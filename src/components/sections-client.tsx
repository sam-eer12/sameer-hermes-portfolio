"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { triggerPreloaderReplay } from "./befreaky-preloader";
import { smoothScrollToHash } from "./navigation";

type CliTab = "ChadGPT" | "ProjectSLM" | "Portfolio";

const CLI_COMMANDS: Record<CliTab, string> = {
  ChadGPT: "git clone https://huggingface.co/sam-eer12/chadGPT && python inference.py",
  ProjectSLM: "git clone https://github.com/sam-eer12/projectSLM.git && cd projectSLM",
  Portfolio: "git clone https://github.com/sam-eer12/sameer-hermes-portfolio.git",
};

export function InstallTerminal() {
  const [activeTab, setActiveTab] = useState<CliTab>("ChadGPT");
  const [copied, setCopied] = useState(false);
  const [liveStatus, setLiveStatus] = useState("");
  const codeRef = useRef<HTMLElement | null>(null);
  const labelId = useId();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const cmd = CLI_COMMANDS[activeTab];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setLiveStatus("Command copied to clipboard.");
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      if (codeRef.current && window.getSelection) {
        const range = document.createRange();
        range.selectNodeContents(codeRef.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setLiveStatus("Clipboard blocked; command selected for manual copy.");
    }
  };

  const tabs: CliTab[] = ["ChadGPT", "ProjectSLM", "Portfolio"];

  return (
    <div className="hw-install-terminal" id="install">
      <p className="hw-install-terminal-label" id={labelId}>
        Run ChadGPT or inspect source locally
      </p>
      <div dir="ltr" data-orientation="horizontal" className="hw-install-terminal-body">
        <div
          role="tablist"
          aria-orientation="horizontal"
          aria-labelledby={labelId}
          className="hw-install-terminal-tabs"
        >
          {tabs.map((tab, idx) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isSelected}
                data-state={isSelected ? "active" : "inactive"}
                className="hw-install-terminal-tab"
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveTab(tab)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    setActiveTab(tabs[(idx + 1) % tabs.length]);
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length]);
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    setActiveTab(tabs[0]);
                  } else if (e.key === "End") {
                    e.preventDefault();
                    setActiveTab(tabs[tabs.length - 1]);
                  }
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <div
          data-state="active"
          role="tabpanel"
          tabIndex={0}
          className="hw-install-terminal-panel"
        >
          <code ref={codeRef}>{cmd}</code>
          <button
            aria-label={copied ? "Copied install command" : "Copy install command"}
            className="hw-install-terminal-copy"
            type="button"
            onClick={handleCopy}
          >
            {copied ? (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="block shrink-0 size-4"
              >
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="block shrink-0 size-4"
              >
                <path d="M6 6h16v2H6zM2 2h16v2H2zm4 6h2v12H6zM2 4h2v12H2zm4 16h16v2H6zM20 8h2v12h-2zm-4-4h2v2h-2zM2 16h4v2H2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <span aria-live="polite" className="sr-only">
        {liveStatus}
      </span>
    </div>
  );
}

export function ReplayIntroButton() {
  return (
    <button
      type="button"
      onClick={triggerPreloaderReplay}
      data-slot="button"
      data-variant="ghost"
      data-size="m"
      className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border border-white/25 bg-transparent outline-none select-none tracking-[0.02em] transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m text-[var(--hermes-white)]/85 hover:text-[var(--hermes-white)] hover:bg-white/10 gap-2 px-3 py-2.5"
    >
      <span className="leading-none whitespace-nowrap text-cap-trim">
        Replay Intro
      </span>
    </button>
  );
}

export interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
}

export function ExperienceFaqAccordion({ items }: { items: AccordionItemData[] }) {
  const [openId, setOpenId] = useState<string | null>("edu");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const baseHeightRef = useRef<number>(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (el.offsetHeight > baseHeightRef.current) {
        baseHeightRef.current = el.offsetHeight;
        el.style.minHeight = `${baseHeightRef.current}px`;
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {items.map((item, idx) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            data-state={isOpen ? "open" : "closed"}
            className="border border-transparent transition-colors duration-150 hover:duration-0 relative border-dotted border-t-[var(--hermes-primary)] px-0 py-5"
            data-surface="white"
          >
            <h3 className="flex">
              <button
                type="button"
                aria-expanded={isOpen}
                data-state={isOpen ? "open" : "closed"}
                className="group flex min-h-[38px] flex-1 cursor-pointer items-center gap-2 text-left text-[var(--hermes-primary)] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                onKeyDown={(e) => {
                  const btns = e.currentTarget
                    .closest("#faqs")
                    ?.querySelectorAll<HTMLButtonElement>("h3 button");
                  if (!btns) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    btns[(idx + 1) % btns.length]?.focus();
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    btns[(idx - 1 + btns.length) % btns.length]?.focus();
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    btns[0]?.focus();
                  } else if (e.key === "End") {
                    e.preventDefault();
                    btns[btns.length - 1]?.focus();
                  }
                }}
              >
                <span className="min-w-0 flex-1 font-[family-name:var(--font-display)] text-[length:var(--hw-teams-faq-q)] leading-[1.4] font-normal normal-case underline decoration-from-font underline-offset-[var(--hw-underline-offset)]">
                  {item.question}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className={`size-3.5 shrink-0 ${isOpen ? "hidden" : "block"}`}
                >
                  <path d="M13 11h7v2h-7v7h-2v-7H4v-2h7V4h2v7Z" />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className={`size-3.5 shrink-0 ${isOpen ? "block" : "hidden"}`}
                >
                  <path d="M4 11h16v2H4z" />
                </svg>
              </button>
            </h3>
            <div
              role="region"
              data-state={isOpen ? "open" : "closed"}
              data-faq-answer=""
              aria-hidden={!isOpen}
              inert={!isOpen ? true : undefined}
              style={
                isOpen
                  ? undefined
                  : {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      visibility: "hidden",
                      pointerEvents: "none",
                    }
              }
            >
              <div className="pt-[var(--space-m)] normal-case max-w-[880px] text-[length:var(--hw-teams-body)] leading-[1.5] text-[var(--hw-teams-ink)]">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ContactForm({
  endpoint,
  accessKey,
  children,
}: {
  endpoint: string;
  accessKey: string;
  children: React.ReactNode;
}) {
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setResult("Sending....");

    try {
      const formData = new FormData(form);
      formData.append("access_key", accessKey);

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { success?: boolean; message?: string };

      if (data.success) {
        setResult("Form Submitted Successfully");
        form.reset();
      } else {
        setResult(data.message || "Submission failed. Please try again.");
      }
    } catch {
      setResult("Network error. Please email sameer870732@gmail.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="hw-contact-card">
      {children}

      <div className="flex flex-wrap items-center gap-5" style={{ marginTop: "24px" }}>
        <button
          type="submit"
          disabled={submitting}
          data-slot="button"
          data-variant="primary"
          data-size="m"
          className="hw-contact-submit hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase text-[length:var(--hw-teams-label)]"
        >
          <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">
            {submitting ? "Sending...." : "Send Message"}
          </span>
        </button>

        {result ? (
          <p
            role="status"
            aria-live="polite"
            className="text-xs font-medium text-[var(--hermes-primary)]"
          >
            {result}
          </p>
        ) : null}
      </div>
    </form>
  );
}

export function FooterRevealScrollSync() {
  useEffect(() => {
    const el = document.getElementById("footer");
    if (!el) return;
    const mainEl = document.getElementById("hpv2-main");
    let rafPending = false;
    let vh = window.innerHeight || 800;
    let maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);

    const updateMetrics = () => {
      vh = window.innerHeight || 800;
      maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    };

    const updateReveal = () => {
      rafPending = false;
      const distFromBottom = maxScroll - window.scrollY;
      const bottomProgress = Math.max(0, Math.min(1, 1 - distFromBottom / Math.max(1, vh)));
      const mainProgress = mainEl
        ? Math.max(0, Math.min(1, 1 - mainEl.getBoundingClientRect().bottom / Math.max(1, vh)))
        : bottomProgress;
      const progress = distFromBottom <= 16 ? 1 : Math.max(mainProgress, bottomProgress);
      el.style.setProperty("--hw-footer-opacity", "1");
      el.style.setProperty("--hw-footer-lift", `${((1 - progress) * 16).toFixed(1)}px`);
    };

    const onScroll = () => {
      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(updateReveal);
      }
    };

    const onResize = () => {
      updateMetrics();
      onScroll();
    };

    updateMetrics();
    updateReveal();
    document.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}

export function FooterHashLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={(e) => smoothScrollToHash(href, e)}
      className={className}
    >
      {children}
    </a>
  );
}

export function ProjectCardArticle({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const href = `/projects/${slug}`;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("a, button")) return;
    if (window.getSelection()?.toString()) return;
    if (e.metaKey || e.ctrlKey) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(href);
  };

  return (
    <article
      onClick={handleClick}
      className="landing-feature hw-project-card cursor-pointer"
    >
      {children}
    </article>
  );
}

export function ProjectCliBar({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="hw-install-terminal" style={{ maxWidth: "100%" }}>
      <p className="hw-install-terminal-label">Quick clone / run command</p>
      <div className="hw-install-terminal-body">
        <div className="hw-install-terminal-panel">
          <code>{command}</code>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied command" : "Copy command"}
            className="hw-install-terminal-copy"
          >
            {copied ? (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="block shrink-0 size-4"
              >
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="block shrink-0 size-4"
              >
                <path d="M6 6h16v2H6zM2 2h16v2H2zm4 6h2v12H6zM2 4h2v12H2zm4 16h16v2H6zM20 8h2v12h-2zm-4-4h2v2h-2zM2 16h4v2H2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
