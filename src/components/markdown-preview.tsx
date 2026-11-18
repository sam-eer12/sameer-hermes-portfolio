"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ProjectData } from "../data/projects";

type PreviewMode = "preview" | "diagrams" | "raw";

type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3 | 4; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "mermaid"; code: string; title: string; index: number }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "callout"; variant: "NOTE" | "IMPORTANT" | "WARNING" | "TIP"; lines: string[] }
  | { type: "blockquote"; lines: string[] }
  | { type: "hr" };

const NAMED_HTML_ENTITIES: Record<string, string> = {
  lt: "<",
  LT: "<",
  gt: ">",
  GT: ">",
  amp: "&",
  AMP: "&",
  quot: '"',
  QUOT: '"',
  apos: "'",
  nbsp: "\u00a0",
  verbar: "|",
  vert: "|",
  Vert: "\u2016",
  lbrack: "[",
  rbrack: "]",
  lcub: "{",
  rcub: "}",
  ast: "*",
  bsol: "\\",
  sol: "/",
  grave: "`",
  ndash: "\u2013",
  mdash: "\u2014",
  hellip: "\u2026",
  middot: "\u00b7",
  times: "\u00d7",
  copy: "\u00a9",
  reg: "\u00ae",
  trade: "\u2122",
};

function resolveEntityMatch(
  full: string,
  dec?: string,
  hex?: string,
  named?: string
): string {
  if (dec !== undefined) {
    const cp = Number.parseInt(dec, 10);
    if (!Number.isFinite(cp) || cp <= 0 || cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff)) {
      return "\ufffd";
    }
    return String.fromCodePoint(cp);
  }
  if (hex !== undefined) {
    const cp = Number.parseInt(hex, 16);
    if (!Number.isFinite(cp) || cp <= 0 || cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff)) {
      return "\ufffd";
    }
    return String.fromCodePoint(cp);
  }
  if (named !== undefined && Object.prototype.hasOwnProperty.call(NAMED_HTML_ENTITIES, named)) {
    return NAMED_HTML_ENTITIES[named];
  }
  return full;
}

function decodeHtmlEntities(input: string): string {
  return input.replace(
    /&(?:#(\d+)|#[xX]([0-9a-fA-F]+)|([a-zA-Z][a-zA-Z0-9]*));/g,
    (full, dec?: string, hex?: string, named?: string) =>
      resolveEntityMatch(full, dec, hex, named)
  );
}

function decodePlainMarkdownText(input: string): string {
  return input.replace(
    /\\([\\`*_{}[\]()#+\-.!|>~<&])|&(?:#(\d+)|#[xX]([0-9a-fA-F]+)|([a-zA-Z][a-zA-Z0-9]*));/g,
    (full, escaped?: string, dec?: string, hex?: string, named?: string) => {
      if (escaped !== undefined) {
        return escaped;
      }
      return resolveEntityMatch(full, dec, hex, named);
    }
  );
}

function stripInlineSyntax(text: string): string {
  return decodeHtmlEntities(
    text.replace(/<\/?code(?:\s[^>]*)?>/gi, "").replace(/`+/g, "")
  );
}

function slugify(text: string): string {
  return stripInlineSyntax(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function isTableDivider(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes("|")) return false;
  const cells = trimmed
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c));
}

function countPrecedingBackslashes(str: string, index: number): number {
  let count = 0;
  for (let i = index - 1; i >= 0 && str[i] === "\\"; i--) {
    count++;
  }
  return count;
}

function parseTableRow(line: string): string[] {
  let raw = line.trim();
  if (raw.startsWith("|")) {
    raw = raw.slice(1);
  }
  if (raw.endsWith("|") && countPrecedingBackslashes(raw, raw.length - 1) % 2 === 0) {
    raw = raw.slice(0, -1);
  }

  const cells: string[] = [];
  let current = "";
  let i = 0;

  while (i < raw.length) {
    // Keep same-line <code>...</code> tags intact even if they contain literal '|'
    if (raw[i] === "<") {
      const rest = raw.slice(i);
      const codeMatch = rest.match(/^<code(?:\s[^>]*)?>[\s\S]*?<\/code>/i);
      if (codeMatch) {
        current += codeMatch[0];
        i += codeMatch[0].length;
        continue;
      }
    }

    if (raw[i] === "\\") {
      let endBs = i;
      while (endBs < raw.length && raw[endBs] === "\\") {
        endBs++;
      }
      const bsCount = endBs - i;
      if (endBs < raw.length && raw[endBs] === "|") {
        if (bsCount % 2 === 1) {
          current += "\\".repeat(bsCount - 1) + "|";
          i = endBs + 1;
          continue;
        }
        current += raw.slice(i, endBs);
        i = endBs;
        continue;
      }
      current += raw.slice(i, endBs);
      i = endBs;
      continue;
    }

    if (raw[i] === "|") {
      cells.push(current.trim());
      current = "";
      i++;
      continue;
    }

    current += raw[i];
    i++;
  }

  cells.push(current.trim());
  return cells;
}

function parseMarkdown(source: string): MarkdownBlock[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  const usedIds = new Map<string, number>();
  let mermaidCount = 0;
  let lastHeading = "System Workflow";
  let i = 0;

  const uniqueId = (raw: string) => {
    const base = slugify(raw) || "section";
    const count = usedIds.get(base) ?? 0;
    usedIds.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Fenced code / Mermaid block
    const fenceMatch = trimmed.match(/^```([\w-]*)\s*$/);
    if (fenceMatch) {
      const lang = (fenceMatch[1] || "text").toLowerCase();
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith("```")) {
        i++;
      }
      const code = codeLines.join("\n");
      if (lang === "mermaid") {
        mermaidCount++;
        blocks.push({
          type: "mermaid",
          code,
          title: lastHeading,
          index: mermaidCount,
        });
      } else {
        blocks.push({ type: "code", lang, code });
      }
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4;
      const text = headingMatch[2].trim();
      if (level <= 3) lastHeading = stripInlineSyntax(text);
      blocks.push({
        type: "heading",
        level,
        text,
        id: uniqueId(text),
      });
      i++;
      continue;
    }

    // Blockquote / Callout
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      const alertMatch = quoteLines[0]?.match(/^\[!(NOTE|IMPORTANT|WARNING|TIP)\]$/i);
      if (alertMatch) {
        const variant = alertMatch[1].toUpperCase() as "NOTE" | "IMPORTANT" | "WARNING" | "TIP";
        blocks.push({
          type: "callout",
          variant,
          lines: quoteLines.slice(1).filter((l) => l.length > 0),
        });
      } else {
        blocks.push({ type: "blockquote", lines: quoteLines });
      }
      continue;
    }

    // GFM Table
    if (trimmed.includes("|") && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const headers = parseTableRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length) {
        const rowTrim = lines[i].trim();
        if (!rowTrim || !rowTrim.includes("|")) break;
        rows.push(parseTableRow(lines[i]));
        i++;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    // Unordered or Ordered List
    const ulMatch = trimmed.match(/^[-*]\s+(.+)$/);
    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (ulMatch || olMatch) {
      const ordered = Boolean(olMatch);
      const items: string[] = [];
      while (i < lines.length) {
        const cur = lines[i].trim();
        const match = ordered ? cur.match(/^\d+\.\s+(.+)$/) : cur.match(/^[-*]\s+(.+)$/);
        if (!match) break;
        items.push(match[1]);
        i++;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    // Paragraph (collect until next block starter or blank line)
    const paraLines: string[] = [];
    while (i < lines.length) {
      const cur = lines[i];
      const curTrim = cur.trim();
      if (
        !curTrim ||
        curTrim.startsWith("```") ||
        curTrim.startsWith("#") ||
        curTrim.startsWith(">") ||
        /^[-*]\s+/.test(curTrim) ||
        /^\d+\.\s+/.test(curTrim) ||
        /^(-{3,}|\*{3,}|_{3,})$/.test(curTrim) ||
        (curTrim.includes("|") && i + 1 < lines.length && isTableDivider(lines[i + 1]))
      ) {
        break;
      }
      paraLines.push(curTrim);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "paragraph", text: paraLines.join(" ") });
    }
  }

  return blocks;
}

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern =
    /(\[[^\]]+\]\([^)]+\)|`[^`]+`|<code(?:\s[^>]*)?>[\s\S]*?<\/code>|\*\*[^*]+\*\*|\*[^*]+\*)/gi;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIdx) {
      nodes.push(decodePlainMarkdownText(text.slice(lastIdx, match.index)));
    }
    const token = match[0];
    if (token.startsWith("[")) {
      const linkParts = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkParts) {
        const [, label, href] = linkParts;
        const isExternal = /^https?:\/\//.test(href);
        nodes.push(
          <a
            key={`lnk-${keyIdx++}`}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="hw-md-inline-link"
          >
            {renderInline(label)}
          </a>
        );
      } else {
        nodes.push(decodePlainMarkdownText(token));
      }
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={`code-${keyIdx++}`} className="hw-md-inline-code">
          {token.slice(1, -1)}
        </code>
      );
    } else if (/^<code(?:\s[^>]*)?>/i.test(token)) {
      const codeTagMatch = token.match(/^<code(?:\s[^>]*)?>([\s\S]*?)<\/code>$/i);
      if (codeTagMatch) {
        nodes.push(
          <code key={`htmlcode-${keyIdx++}`} className="hw-md-inline-code">
            {decodeHtmlEntities(codeTagMatch[1])}
          </code>
        );
      } else {
        nodes.push(decodePlainMarkdownText(token));
      }
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={`b-${keyIdx++}`}>{renderInline(token.slice(2, -2))}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={`em-${keyIdx++}`}>{renderInline(token.slice(1, -1))}</em>);
    }
    lastIdx = match.index + token.length;
  }

  if (lastIdx < text.length) {
    nodes.push(decodePlainMarkdownText(text.slice(lastIdx)));
  }
  return nodes;
}

function CodeBlockCard({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="hw-md-codeblock">
      <div className="hw-md-codeblock-head">
        <span className="hw-mono text-[11px] uppercase tracking-[0.12em]">
          {lang || "text"}
        </span>
        <button type="button" onClick={handleCopy} className="hw-md-mini-btn">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="hw-md-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MermaidDiagram({
  code,
  title,
  index,
}: {
  code: string;
  title: string;
  index: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rawId = useId();
  const seqRef = useRef(0);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [zoom, setZoom] = useState(1);
  const [showSource, setShowSource] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const syncTheme = () => {
      const t = document.documentElement.dataset.marketingTheme === "dark" ? "dark" : "light";
      setThemeMode(t);
    };
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-marketing-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (showSource) return;
    let cancelled = false;
    setStatus("loading");

    async function renderChart() {
      try {
        const { default: mermaid } = await import("mermaid");
        const isDark = themeMode === "dark";
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          themeVariables: isDark
            ? {
                darkMode: true,
                background: "#121329",
                primaryColor: "#1d2252",
                primaryTextColor: "#eef2ff",
                primaryBorderColor: "#6e82ff",
                secondaryColor: "#24193c",
                secondaryTextColor: "#f8d2ec",
                secondaryBorderColor: "#f878cf",
                tertiaryColor: "#161a3d",
                tertiaryTextColor: "#dce4ff",
                lineColor: "#7e90ff",
                textColor: "#eef2ff",
                clusterBkg: "#171a3b",
                clusterBorder: "#4e5fd4",
                edgeLabelBackground: "#121329",
                actorBkg: "#1d2252",
                actorBorder: "#6e82ff",
                actorTextColor: "#eef2ff",
                actorLineColor: "#6e82ff",
                signalColor: "#eef2ff",
                signalTextColor: "#eef2ff",
                noteBkgColor: "#261a3f",
                noteBorderColor: "#f878cf",
                noteTextColor: "#ffe4f6",
                fontSize: "13px",
              }
            : {
                darkMode: false,
                background: "#ffffff",
                primaryColor: "#eaecff",
                primaryTextColor: "#0c0e3a",
                primaryBorderColor: "#0000f2",
                secondaryColor: "#fdecf8",
                secondaryTextColor: "#260820",
                secondaryBorderColor: "#f878cf",
                tertiaryColor: "#f5f6ff",
                tertiaryTextColor: "#111240",
                lineColor: "#0000f2",
                textColor: "#11112b",
                clusterBkg: "#f7f8ff",
                clusterBorder: "#8c93ff",
                edgeLabelBackground: "#ffffff",
                actorBkg: "#eaecff",
                actorBorder: "#0000f2",
                actorTextColor: "#0c0e3a",
                actorLineColor: "#0000f2",
                signalColor: "#11112b",
                signalTextColor: "#11112b",
                noteBkgColor: "#fdecf8",
                noteBorderColor: "#d94fb0",
                noteTextColor: "#260820",
                fontSize: "13px",
              },
          flowchart: {
            htmlLabels: false,
            curve: "basis",
            nodeSpacing: 36,
            rankSpacing: 48,
            padding: 14,
          },
          sequence: {
            mirrorActors: false,
            messageMargin: 36,
            boxMargin: 10,
          },
        });

        seqRef.current += 1;
        const cleanId = `hermes-mmd-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}-${seqRef.current}`;
        const result = await mermaid.render(cleanId, code);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = result.svg;
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
            svgEl.style.display = "block";
            svgEl.style.margin = "0 auto";
          }
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void renderChart();
    return () => {
      cancelled = true;
    };
  }, [code, themeMode, showSource, rawId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <figure className="hw-mermaid-card" aria-label={`Mermaid workflow diagram: ${title}`}>
      <div className="hw-mermaid-toolbar">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="hw-mermaid-badge">
            MERMAID · {String(index).padStart(2, "0")}
          </span>
          <figcaption className="hw-mono text-xs truncate opacity-85">{title}</figcaption>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {!showSource && (
            <>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.7, Number((z - 0.15).toFixed(2))))}
                aria-label="Zoom out diagram"
                className="hw-md-mini-btn"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                aria-label="Reset diagram zoom"
                className="hw-md-mini-btn"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.15).toFixed(2))))}
                aria-label="Zoom in diagram"
                className="hw-md-mini-btn"
              >
                +
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setShowSource((s) => !s)}
            className="hw-md-mini-btn"
          >
            {showSource ? "View Chart" : "Mermaid Source"}
          </button>
          <button type="button" onClick={handleCopy} className="hw-md-mini-btn">
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {showSource || status === "error" ? (
        <pre className="hw-md-pre">
          <code>{code}</code>
        </pre>
      ) : (
        <div className="hw-mermaid-viewport">
          {status === "loading" && (
            <p className="hw-mono text-xs opacity-65 py-6 text-center">
              Rendering Mermaid chart...
            </p>
          )}
          <div
            ref={containerRef}
            className="hw-mermaid-svg-wrap"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              display: status === "loading" ? "none" : "block",
            }}
          />
        </div>
      )}
    </figure>
  );
}

export function ProjectMarkdownExplorer({ project }: { project: ProjectData }) {
  const [mode, setMode] = useState<PreviewMode>("preview");
  const [copiedAll, setCopiedAll] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const blocks = useMemo(() => parseMarkdown(project.markdown), [project.markdown]);

  const headings = useMemo(
    () =>
      blocks.filter(
        (b): b is Extract<MarkdownBlock, { type: "heading" }> =>
          b.type === "heading" && (b.level === 2 || b.level === 3)
      ),
    [blocks]
  );

  const mermaidBlocks = useMemo(
    () =>
      blocks.filter(
        (b): b is Extract<MarkdownBlock, { type: "mermaid" }> => b.type === "mermaid"
      ),
    [blocks]
  );

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(project.markdown);
      setCopiedAll(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopiedAll(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <section
      id="architecture"
      aria-label={`${project.title} Markdown Documentation`}
      className="bg-hermes-paper hw-md-section"
    >
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)]">
        <div className="hw-md-toolbar">
          <div className="flex flex-wrap items-center gap-3">
            <span className="hw-md-file-pill">README.md</span>
            <span className="hw-mono text-xs uppercase tracking-wider opacity-75">
              Markdown Preview · {mermaidBlocks.length} Mermaid Diagrams
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div role="tablist" aria-label="Document view mode" className="hw-md-mode-tabs">
              {(
                [
                  { id: "preview", label: "Preview" },
                  { id: "diagrams", label: `Diagrams (${mermaidBlocks.length})` },
                  { id: "raw", label: "Raw MD" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === tab.id}
                  data-active={mode === tab.id ? "true" : "false"}
                  onClick={() => setMode(tab.id)}
                  className="hw-md-mode-tab"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button type="button" onClick={handleCopyMarkdown} className="hw-md-mini-btn">
              {copiedAll ? "Copied MD" : "Copy MD"}
            </button>
          </div>
        </div>

        <div className={`hw-md-layout ${mode === "preview" ? "hw-md-layout--with-toc" : ""}`}>
          {mode === "preview" && headings.length > 0 && (
            <aside aria-label="Document outline" className="hw-md-sidebar">
              <div className="hw-md-toc-box">
                <p className="hw-mono text-[11px] uppercase tracking-[0.12em] opacity-65 mb-3">
                  Sections
                </p>
                <nav className="flex flex-col gap-1.5">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`hw-md-toc-link ${
                        h.level === 3 ? "pl-3 text-xs opacity-75" : "text-xs font-medium"
                      }`}
                    >
                      {stripInlineSyntax(h.text)}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          <div className="hw-md-prose">
            {mode === "raw" && <CodeBlockCard lang="markdown" code={project.markdown} />}

            {mode === "diagrams" && (
              <div className="flex flex-col gap-8">
                {mermaidBlocks.map((m) => (
                  <MermaidDiagram
                    key={`diag-only-${m.index}`}
                    code={m.code}
                    title={m.title}
                    index={m.index}
                  />
                ))}
              </div>
            )}

            {mode === "preview" &&
              blocks.map((block, idx) => {
                if (block.type === "heading") {
                  if (block.level === 1) {
                    return (
                      <h1 key={idx} id={block.id} className="hw-md-h1">
                        {renderInline(block.text)}
                      </h1>
                    );
                  }
                  if (block.level === 2) {
                    return (
                      <h2 key={idx} id={block.id} className="hw-md-h2">
                        {renderInline(block.text)}
                      </h2>
                    );
                  }
                  if (block.level === 3) {
                    return (
                      <h3 key={idx} id={block.id} className="hw-md-h3">
                        {renderInline(block.text)}
                      </h3>
                    );
                  }
                  return (
                    <h4 key={idx} id={block.id} className="hw-md-h4">
                      {renderInline(block.text)}
                    </h4>
                  );
                }

                if (block.type === "paragraph") {
                  return (
                    <p key={idx} className="hw-md-p">
                      {renderInline(block.text)}
                    </p>
                  );
                }

                if (block.type === "hr") {
                  return <hr key={idx} className="hw-md-hr" />;
                }

                if (block.type === "callout") {
                  return (
                    <aside
                      key={idx}
                      className="hw-md-callout"
                      data-callout={block.variant.toLowerCase()}
                    >
                      <p className="hw-md-callout-title">{block.variant}</p>
                      <div className="flex flex-col gap-1.5">
                        {block.lines.map((line, lIdx) => (
                          <p key={lIdx} className="hw-md-p mb-0">
                            {renderInline(line)}
                          </p>
                        ))}
                      </div>
                    </aside>
                  );
                }

                if (block.type === "blockquote") {
                  return (
                    <blockquote key={idx} className="hw-md-blockquote">
                      {block.lines.map((line, lIdx) => (
                        <p key={lIdx} className="hw-md-p mb-0">
                          {renderInline(line)}
                        </p>
                      ))}
                    </blockquote>
                  );
                }

                if (block.type === "list") {
                  if (block.ordered) {
                    return (
                      <ol key={idx} className="hw-md-list hw-md-list--ordered">
                        {block.items.map((item, iIdx) => (
                          <li key={iIdx}>{renderInline(item)}</li>
                        ))}
                      </ol>
                    );
                  }
                  return (
                    <ul key={idx} className="hw-md-list">
                      {block.items.map((item, iIdx) => (
                        <li key={iIdx}>{renderInline(item)}</li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === "table") {
                  return (
                    <div key={idx} className="hw-md-table-wrap">
                      <table className="hw-md-table">
                        <thead>
                          <tr>
                            {block.headers.map((head, hIdx) => (
                              <th key={hIdx}>{renderInline(head)}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {block.headers.map((_, cIdx) => (
                                <td key={cIdx}>{renderInline(row[cIdx] ?? "")}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                if (block.type === "code") {
                  return <CodeBlockCard key={idx} lang={block.lang} code={block.code} />;
                }

                if (block.type === "mermaid") {
                  return (
                    <MermaidDiagram
                      key={idx}
                      code={block.code}
                      title={block.title}
                      index={block.index}
                    />
                  );
                }

                return null;
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
