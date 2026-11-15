"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { triggerPreloaderReplay } from "./befreaky-preloader";
import { CosmicBust3D, CosmicBustParams, CosmicShaderMode } from "./cosmic-bust-3d";
import { FitText } from "./chrome";
import { smoothScrollToHash } from "./navigation";
import {
  GitHubPixelIcon,
  HuggingFacePixelIcon,
  LinkedInPixelIcon,
  NousOutlineFooterLogo,
  NousResearchCenterBadges,
} from "./nous-logos";

const NOUS_CDN =
  "https://web-assets.nousresearch.com/marketing/64ae3d30463049bd9e6f380cda9cd9538a0f4edb";

type CliTab = "ChadGPT" | "ProjectSLM" | "Connect";

const CLI_COMMANDS: Record<CliTab, string> = {
  ChadGPT: "git clone https://huggingface.co/sam-eer12/chadGPT && python inference.py",
  ProjectSLM: "git clone https://github.com/sam-eer12/projectSLM.git && cd projectSLM",
  Connect: "curl -sL https://sameers-portfolio-eosin.vercel.app | head -n 40",
};

function InstallTerminal() {
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

  const tabs: CliTab[] = ["ChadGPT", "ProjectSLM", "Connect"];

  return (
    <div className="hw-install-terminal" id="install">
      <p className="hw-install-terminal-label" id={labelId}>
        Inspect ChadGPT 250M SLM or portfolio CLI
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
                <span aria-hidden="true">:</span>
                {tab}
                <span aria-hidden="true">:</span>
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

export function HeroSection() {
  return (
    <section aria-label="Hero" className="landing-hero">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] landing-hero-grid items-center">
        <div className="landing-hero-copy">
          <h1
            data-type-role="hero"
            className="text-[color:var(--hpv2-text,inherit)] text-cap-trim cap-rules landing-hero-title text-[var(--hermes-white)]"
            style={{
              fontFamily: "var(--font-rules-gothic-cnd)",
              fontSize: "var(--hw-teams-hero-display)",
              fontWeight: 200,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              textTransform: "none",
            }}
          >
            <span>The Engineer</span> <span>That Builds</span> <span>With AI</span>
          </h1>

          <p
            data-type-role="copy"
            className="text-cap-trim cap-rules max-w-[44ch] text-[color:color-mix(in_srgb,var(--hermes-white)_84%,transparent)]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--hpv2-type-body)",
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            Sameer Gupta · NSUT Delhi &apos;28. Custom 250M LLMs, YOLOv11 vision systems, and
            real-time Three.js GLSL engineering.
          </p>

          <div className="landing-hero-actions gap-2.5">
            <a
              href="https://huggingface.co/sam-eer12/chadGPT"
              target="_blank"
              rel="noopener noreferrer"
              role="link"
              tabIndex={0}
              data-slot="button"
              data-variant="secondary"
              data-size="m"
              className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m bg-[color-mix(in_srgb,var(--hermes-paper)_90%,transparent)] text-[var(--hpv2-brand,var(--hermes-primary))] hover:bg-[var(--hermes-paper)] hover:shadow-[var(--hpv2-shadow-lift)] gap-2 px-3 py-2.5 landing-download-cta"
            >
              <HuggingFacePixelIcon className="size-4 shrink-0" />
              <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">
                ChadGPT 250M on HF
              </span>
              <span aria-hidden="true" className="hermes-button-hover-border" />
            </a>

            <a
              href="https://github.com/sam-eer12"
              target="_blank"
              rel="noopener noreferrer"
              role="link"
              tabIndex={0}
              data-slot="button"
              data-variant="outline"
              data-size="m"
              className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border border-white/30 bg-transparent outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m text-[var(--hermes-white)] hover:bg-white/10 gap-2 px-3 py-2.5 landing-cloud-cta"
            >
              <GitHubPixelIcon className="size-4 shrink-0" />
              <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">
                GitHub @sam-eer12
              </span>
              <span aria-hidden="true" className="hermes-button-hover-border" />
            </a>

            <button
              type="button"
              onClick={triggerPreloaderReplay}
              data-slot="button"
              data-variant="ghost"
              data-size="m"
              className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border border-white/25 bg-transparent outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m text-[var(--hermes-white)]/85 hover:text-[var(--hermes-white)] hover:bg-white/10 gap-2 px-3 py-2.5"
            >
              <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">
                :Replay Loader:
              </span>
            </button>
          </div>

          <InstallTerminal />
        </div>

        <figure className="landing-hero-art landing-hero-art--3d hw-hero-parallax">
          <CosmicBust3D variant="hero" />
        </figure>
      </div>
    </section>
  );
}

export function ShowcaseSection() {
  const [studioMode, setStudioMode] = useState<CosmicShaderMode>("cosmic");
  const [params, setParams] = useState<CosmicBustParams>({
    glitchIntensity: 0.78,
    orbitSpeed: 1.0,
    reliefDepth: 0.64,
    kintsugiGlow: 0.85,
  });
  const [surgeCount, setSurgeCount] = useState(0);

  return (
    <section aria-label="Interactive 3D Studio & Ecosystem" className="landing-downloads" id="downloads">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)]">
        <figure
          aria-label="Interactive Three.js Cosmic Bust Shader Studio"
          className="landing-desktop-preview cosmic-studio-panel"
        >
          <CosmicBust3D
            variant="studio"
            mode={studioMode}
            onModeChange={setStudioMode}
            params={params}
            surgeCount={surgeCount}
          />
          <div className="cosmic-studio-controls">
            <label className="flex flex-col gap-1.5">
              <span>Glitch Slice ({params.glitchIntensity.toFixed(2)})</span>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={params.glitchIntensity}
                onChange={(e) =>
                  setParams((p) => ({ ...p, glitchIntensity: parseFloat(e.target.value) }))
                }
                className="cosmic-studio-slider"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span>Orbit Speed ({params.orbitSpeed.toFixed(2)}x)</span>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={params.orbitSpeed}
                onChange={(e) =>
                  setParams((p) => ({ ...p, orbitSpeed: parseFloat(e.target.value) }))
                }
                className="cosmic-studio-slider"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span>3D Depth ({params.reliefDepth.toFixed(2)})</span>
              <input
                type="range"
                min="0.1"
                max="1.2"
                step="0.05"
                value={params.reliefDepth}
                onChange={(e) =>
                  setParams((p) => ({ ...p, reliefDepth: parseFloat(e.target.value) }))
                }
                className="cosmic-studio-slider"
              />
            </label>
            <div className="flex flex-col justify-between gap-1.5">
              <span>Kintsugi Gold ({params.kintsugiGlow.toFixed(2)})</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1.6"
                  step="0.05"
                  value={params.kintsugiGlow}
                  onChange={(e) =>
                    setParams((p) => ({ ...p, kintsugiGlow: parseFloat(e.target.value) }))
                  }
                  className="cosmic-studio-slider flex-1"
                />
                <button
                  type="button"
                  onClick={() => setSurgeCount((c) => c + 1)}
                  className="cosmic-bust-surge-btn shrink-0"
                >
                  Pulse
                </button>
              </div>
            </div>
          </div>
        </figure>

        <div className="landing-download-title">
          <img alt="" height={24} width={24} src={`${NOUS_CDN}/assets/hermes-agent/desktop.svg`} />
          <div className="flex w-full items-start gap-2.5 landing-section-title landing-download-heading">
            <h2
              data-type-role="heading"
              className="text-cap-trim cap-rules text-[var(--hw-teams-ink)]"
              style={{
                fontFamily: "var(--font-rules-gothic-cnd)",
                fontSize: "var(--hpv2-type-heading)",
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                textTransform: "none",
              }}
            >
              Sculpted WebGL &amp; Open AI Ecosystem
            </h2>
          </div>
          <p
            data-type-role="copy"
            className="text-[color:var(--hpv2-text,inherit)] text-cap-trim cap-rules max-w-[54ch]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--hpv2-type-body)",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Custom GLSL shaders, open-weight small language models on Hugging Face, and production
            deployments across Vercel and AWS.
          </p>
        </div>

        <div className="landing-platforms">
          <article className="landing-platform landing-platform--mac">
            <img
              alt=""
              aria-hidden="true"
              className="landing-platform-art"
              decoding="async"
              height={1121}
              width={1121}
              loading="lazy"
              src="/assets/library/platform-art.webp"
            />
            <div className="landing-platform-copy">
              <p
                data-type-role="info"
                style={{
                  fontFamily: "var(--hpv2-font-meta)",
                  fontSize: "var(--hpv2-type-info)",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  textTransform: "uppercase",
                }}
              >
                sam-eer12/chadGPT · 250M SLM
              </p>
              <h3
                data-type-role="subheading"
                className="text-cap-trim cap-rules"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--hw-teams-feature-title)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                }}
              >
                Hugging Face
              </h3>
              <a
                href="https://huggingface.co/sam-eer12"
                target="_blank"
                rel="noopener noreferrer"
                role="link"
                data-slot="button"
                data-variant="secondary"
                data-size="m"
                className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m text-xs bg-[color-mix(in_srgb,var(--hermes-paper)_90%,transparent)] text-[var(--hpv2-brand,var(--hermes-primary))] hover:bg-[var(--hermes-paper)] gap-2 px-3 py-2.5 landing-cta"
              >
                <HuggingFacePixelIcon className="size-4 shrink-0" />
                <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">
                  Open Hugging Face
                </span>
                <span aria-hidden="true" className="hermes-button-hover-border" />
              </a>
            </div>
          </article>

          <article className="landing-platform landing-platform--windows">
            <img
              alt=""
              aria-hidden="true"
              className="landing-platform-art"
              decoding="async"
              height={1121}
              width={1121}
              loading="lazy"
              src="/assets/library/platform-art.webp"
            />
            <div className="landing-platform-copy">
              <p
                data-type-role="info"
                style={{
                  fontFamily: "var(--hpv2-font-meta)",
                  fontSize: "var(--hpv2-type-info)",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  textTransform: "uppercase",
                }}
              >
                29+ Public Repositories
              </p>
              <h3
                data-type-role="subheading"
                className="text-cap-trim cap-rules"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--hw-teams-feature-title)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                }}
              >
                GitHub
              </h3>
              <a
                href="https://github.com/sam-eer12"
                target="_blank"
                rel="noopener noreferrer"
                role="link"
                data-slot="button"
                data-variant="secondary"
                data-size="m"
                className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m text-xs bg-[color-mix(in_srgb,var(--hermes-paper)_90%,transparent)] text-[var(--hpv2-brand,var(--hermes-primary))] hover:bg-[var(--hermes-paper)] gap-2 px-3 py-2.5 landing-cta"
              >
                <GitHubPixelIcon className="size-4 shrink-0" />
                <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">
                  Explore Repositories
                </span>
                <span aria-hidden="true" className="hermes-button-hover-border" />
              </a>
            </div>
          </article>

          <article className="landing-platform landing-platform--linux">
            <img
              alt=""
              aria-hidden="true"
              className="landing-platform-art"
              decoding="async"
              height={1121}
              width={1121}
              loading="lazy"
              src="/assets/library/platform-art.webp"
            />
            <div className="landing-platform-copy">
              <p
                data-type-role="info"
                style={{
                  fontFamily: "var(--hpv2-font-meta)",
                  fontSize: "var(--hpv2-type-info)",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  textTransform: "uppercase",
                }}
              >
                NSUT Delhi &apos;28 · CGPA 7.55
              </p>
              <h3
                data-type-role="subheading"
                className="text-cap-trim cap-rules"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--hw-teams-feature-title)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                }}
              >
                Live Portfolio
              </h3>
              <a
                href="https://sameers-portfolio-eosin.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                role="link"
                data-slot="button"
                data-variant="secondary"
                data-size="m"
                className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m text-xs bg-[color-mix(in_srgb,var(--hermes-paper)_90%,transparent)] text-[var(--hpv2-brand,var(--hermes-primary))] hover:bg-[var(--hermes-paper)] gap-2 px-3 py-2.5 landing-cta"
              >
                <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">
                  Original Vercel Site
                </span>
                <span aria-hidden="true" className="hermes-button-hover-border" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

interface ProjectCardData {
  indexLabel: string;
  title: string;
  description: string;
  href: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  artClass: string;
  image: string;
}

const PROJECTS: ProjectCardData[] = [
  {
    indexLabel: "#1 Language Model",
    title: "ChadGPT - 250M AI LLM",
    description:
      "249.8M-parameter decoder-only SLM trained from scratch with GQA and RoPE, 4k context extension via Position Interpolation, ChatML SFT, and 42.55% zero-shot ARC-Easy.",
    href: "https://huggingface.co/sam-eer12/chadGPT",
    primaryLabel: "Hugging Face",
    secondaryHref: "https://github.com/sam-eer12/projectSLM",
    secondaryLabel: "GitHub Repo",
    artClass: "landing-feature-art--feature-connect",
    image: "/assets/library/feature-1.webp",
  },
  {
    indexLabel: "#2 Route Optimization",
    title: "AeroRoute",
    description:
      "Intelligent aerial and ground mobility route-planning engine optimizing travel time against live congestion and air-pollution telemetry via serverless AWS compute and Amplify.",
    href: "https://aeroroute.d1qrrcsa5p4lz3.amplifyapp.com/",
    primaryLabel: "Live App",
    secondaryHref: "https://github.com/sam-eer12/iiitd-hackathon",
    secondaryLabel: "GitHub Repo",
    artClass: "landing-feature-art--feature-memory",
    image: "/assets/library/feature-2.webp",
  },
  {
    indexLabel: "#3 Computer Vision",
    title: "VigilAI Surveillance",
    description:
      "Web-based AI surveillance platform achieving 94% accuracy with live video stream processing to detect anomalies and misconduct via YOLOv11, PyTorch, OpenCV, Flask, and React.",
    href: "https://github.com/sam-eer12/VigilAI-survillance-project",
    primaryLabel: "GitHub Repo",
    artClass: "landing-feature-art--feature-automation",
    image: "/assets/library/feature-3.webp",
  },
  {
    indexLabel: "#4 Legal Advisor AI",
    title: "Amicus AI",
    description:
      "Fullstack legal advisor assistant offering location-aware legal guidance, case analysis, fraud detection, and document generation using Next.js, Gemini, MongoDB, and NodeMailer.",
    href: "https://amicusai.vercel.app/",
    primaryLabel: "Live App",
    artClass: "landing-feature-art--feature-delegate",
    image: "/assets/library/feature-4.webp",
  },
  {
    indexLabel: "#5 SIH2026 / DRDO LiDAR",
    title: "NEXA - 2.5D LiDAR Mapping",
    description:
      "Smart India Hackathon 2026 (DRDO / iDEX PS 26053) autonomous perception system by Team KANVSS processing 64-beam 1.2M pts/sec LiDAR at 10 Hz for adaptive 2.5D obstacle mapping.",
    href: "https://nexa-drdo.duckdns.org/",
    primaryLabel: "Live Project",
    secondaryHref: "https://github.com/sam-eer12/sih2026",
    secondaryLabel: "GitHub (sih2026)",
    artClass: "landing-feature-art--feature-search",
    image: "/assets/library/feature-5.webp",
  },
  {
    indexLabel: "#6 Open Source Contribution",
    title: "BitChord",
    description:
      "Kotlin YouTube Music client contribution implementing Apple Music integration (#1222), multi-provider routing architecture, and automix headroom fixes for crisp playback.",
    href: "https://github.com/kushagrasinghx/BitChord/pull/1414",
    primaryLabel: "Contribution PR #1414",
    secondaryHref: "https://github.com/sam-eer12/BitChord",
    secondaryLabel: "Fork Repo",
    artClass: "landing-feature-art--feature-sandbox",
    image: "/assets/library/feature-6.webp",
  },
];

export function ProjectsSection() {
  return (
    <section aria-label="Selected Projects" className="landing-features" id="features">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)]">
        <div className="flex w-full items-start gap-2.5 landing-section-title">
          <h2
            data-type-role="heading"
            className="text-cap-trim cap-rules text-[var(--hw-teams-ink)]"
            style={{
              fontFamily: "var(--font-rules-gothic-cnd)",
              fontSize: "var(--hpv2-type-heading)",
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Selected Projects
          </h2>
          <span className="mt-0.5 size-6 shrink-0 text-[var(--hermes-primary)]">
            <img alt="" height={24} width={24} src={`${NOUS_CDN}/assets/hermes-agent/features.svg`} />
          </span>
        </div>

        <div className="landing-feature-grid">
          {PROJECTS.map((proj) => (
            <article key={proj.title} className="landing-feature">
              <div className="landing-feature-heading">
                <p
                  data-type-role="info"
                  style={{
                    fontFamily: "var(--hpv2-font-meta)",
                    fontSize: "var(--hpv2-type-info)",
                    fontWeight: 400,
                    lineHeight: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  {proj.indexLabel}
                </p>
                <h3
                  data-type-role="subheading"
                  className="text-cap-trim cap-rules"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--hw-teams-feature-title)",
                    fontWeight: 500,
                    lineHeight: 1.1,
                  }}
                >
                  <a
                    href={proj.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-current/40 underline-offset-4 hover:decoration-current"
                  >
                    {proj.title}
                  </a>
                </h3>
              </div>

              <div className="flex flex-col justify-between gap-4">
                <p
                  data-type-role="copy"
                  className="text-cap-trim cap-rules landing-feature-description"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--hpv2-type-body)",
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  {proj.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 hw-mono text-[11px] uppercase tracking-wider">
                  <a
                    href={proj.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border border-[var(--hermes-primary)]/40 bg-[var(--hermes-primary)] px-2.5 py-1 text-white transition-colors hover:bg-[var(--hw-accent-pink)] hover:text-[#0d0d1a] hover:border-[var(--hw-accent-pink)]"
                  >
                    <span>{proj.primaryLabel}</span>
                    <span aria-hidden="true">-&gt;</span>
                  </a>
                  {proj.secondaryHref && proj.secondaryLabel ? (
                    <a
                      href={proj.secondaryHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-current/30 px-2.5 py-1 transition-colors hover:border-[var(--hermes-primary)] hover:text-[var(--hermes-primary)]"
                    >
                      <span>{proj.secondaryLabel}</span>
                      <span aria-hidden="true">-&gt;</span>
                    </a>
                  ) : null}
                </div>
              </div>

              <div className={`landing-feature-art ${proj.artClass}`}>
                <a
                  href={proj.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${proj.title}`}
                  className="block"
                >
                  <figure className="hw-teams-plate bg-hermes relative h-[var(--hw-teams-plate-h)] w-full overflow-clip rounded-t-md">
                    <div className="hw-noise absolute inset-0">
                      <img
                        alt=""
                        className="hw-parallax absolute inset-0 size-full object-cover"
                        decoding="async"
                        loading="lazy"
                        src={proj.image}
                      />
                    </div>
                  </figure>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
}

const EXPERIENCE_ITEMS: AccordionItemData[] = [
  {
    id: "edu",
    question: "What is your academic foundation at NSUT Delhi?",
    answer:
      "Pursuing a B.Tech in Instrumentation and Control Engineering at Netaji Subhas University of Technology (NSUT), Delhi (August 2024 - May 2028) with a 7.55 CGPA, combining control systems engineering with fullstack software and deep learning research.",
  },
  {
    id: "exp",
    question: "What open-source and community leadership experience do you bring?",
    answer:
      "Served as an Open Source Contributor during GirlScript Summer of Code (July - Sept 2025), authored open-source PRs including BitChord Apple Music integration (#1414) and SIH2026 DRDO NEXA 2.5D LiDAR mapping, and led campus AI workshops as a Google Gemini Student Ambassador (Aug - Dec 2025).",
  },
  {
    id: "chadgpt",
    question: "How was ChadGPT (250M SLM) architected and trained from scratch?",
    answer:
      "Engineered a custom 249,832,448-parameter decoder-only PyTorch transformer featuring Grouped Query Attention (GQA) and Rotary Positional Embeddings (RoPE). Extended context length to 4,096 tokens via Position Interpolation, fine-tuned with ChatML SFT on SmolLM-Corpus and OpenHermes-2.5, and verified 42.55% zero-shot accuracy on ARC-Easy.",
  },
  {
    id: "certs",
    question: "Which hackathons and programs have recognized your engineering work?",
    answer:
      "Certified across Frontend Battle 2.0 (IIT Bhubaneswar, June 2025), BuildWithDelhi 2.0 (Hack with India, Aug 2025), Kaarya Neeti Case Competition (E-Cell NSUT, Aug 2025), Zero to One Hackathon (Chandigarh University, Aug 2025), and the McKinsey Forward Learning Programme (Dec 2025).",
  },
  {
    id: "contact",
    question: "How can engineering teams or collaborators get in touch?",
    answer:
      "Reach out directly at sameer870732@gmail.com or +91 9899901635, explore code repositories at github.com/sam-eer12, inspect model weights at huggingface.co/sam-eer12, or connect on LinkedIn (sameer-gupta-768b28312).",
  },
];

export function ExperienceFaqSection() {
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
    <section className="bg-hermes-paper py-[60px]" id="faqs">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] flex flex-col gap-5">
        <div className="flex w-full items-start gap-2.5">
          <h2
            data-type-role="heading"
            className="text-cap-trim cap-rules text-[var(--hw-teams-ink)]"
            style={{
              fontFamily: "var(--font-rules-gothic-cnd)",
              fontSize: "var(--hpv2-type-heading)",
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Dossier &amp; Experience
          </h2>
          <span className="mt-0.5 size-6 shrink-0 text-[var(--hermes-primary)]">
            <a
              aria-label="Open GitHub Profile"
              className="block"
              href="https://github.com/sam-eer12"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="block shrink-0 size-6">
                <path d="M6 4H4v16h2zm10-2H6v2h10zm4 4h-2v14h2zm-2 14H6v2h12zM16 4h2v2h-2zm-4 0h2v6h-2z" />
                <path d="M12 8h6v2h-6zm-4 8h8v2H8zm0-4h8v2H8zm0-4h2v2H8z" />
              </svg>
            </a>
          </span>
          <div className="ml-auto shrink-0 self-start text-[var(--hw-teams-ink)]">
            <a
              href="/assets/Sameer_Gupta_Resume.pdf"
              download="Sameer_Gupta_Resume.pdf"
              role="link"
              data-slot="button"
              data-variant="ghost"
              data-size="m"
              className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m bg-transparent text-current hover:shadow-[var(--hpv2-shadow-hair)] gap-2 px-3 py-2.5 h-[var(--hw-teams-btn-h)] text-[length:var(--hw-teams-label)] underline"
            >
              <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">
                Download Resume PDF
              </span>
              <span aria-hidden="true" className="hermes-button-hover-border" />
            </a>
          </div>
        </div>

        <div ref={containerRef}>
          {EXPERIENCE_ITEMS.map((item, idx) => {
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
      </div>
    </section>
  );
}

interface ArsenalColumn {
  name: string;
  badge?: string;
  metric: string;
  subtitle: string;
  featured?: boolean;
  items: string[];
  ctaLabel: string;
  ctaHref: string;
}

const ARSENAL_COLUMNS: ArsenalColumn[] = [
  {
    name: "AI & ML",
    metric: "250M",
    subtitle: "Custom Transformer & CV",
    items: [
      "PyTorch & TensorFlow",
      "YOLOv11 & OpenCV",
      "HF Accelerate & Safetensors",
      "GQA, RoPE & ChatML SFT",
      "Scikit-learn & CUDA",
    ],
    ctaLabel: "ChadGPT Weights",
    ctaHref: "https://huggingface.co/sam-eer12/chadGPT",
  },
  {
    name: "Web & 3D",
    badge: "// core stack",
    metric: "60fps",
    subtitle: "SSR + WebGL Shaders",
    featured: true,
    items: [
      "Next.js (SSR) & React 19",
      "Three.js & Custom GLSL",
      "TypeScript & JavaScript ES6+",
      "TailwindCSS & GSAP",
      "Redux, Zustand & TanStack",
    ],
    ctaLabel: "Browse GitHub",
    ctaHref: "https://github.com/sam-eer12",
  },
  {
    name: "Backend",
    metric: "Cloud",
    subtitle: "APIs, Data & Serverless",
    items: [
      "Node.js, Express & Flask",
      "MongoDB & MySQL",
      "Firebase & AWS Lambda",
      "Vercel Edge & Docker",
      "Jest & Cypress Testing",
    ],
    ctaLabel: "Amicus AI App",
    ctaHref: "https://amicusai.vercel.app/",
  },
  {
    name: "Systems",
    metric: "NSUT",
    subtitle: "Control & Leadership",
    items: [
      "B.Tech ICE (CGPA 7.55)",
      "Flutter & Riverpod Mobile",
      "C++ & Data Structures",
      "GSSoC Open Source",
      "Google Gemini Ambassador",
    ],
    ctaLabel: "Contact Sameer",
    ctaHref: "mailto:sameer870732@gmail.com",
  },
];

export function SkillsPortalSection() {
  return (
    <section aria-label="Technical Arsenal" className="landing-portal" id="portal">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] landing-portal-column">
        <div aria-label="Skill Domains" className="landing-plan-chips">
          {["AI/ML", "Three.js", "Next.js", "Systems"].map((chip) => (
            <span
              key={chip}
              data-chip=""
              data-tone="outline"
              className="inline-flex h-[var(--hpv2-chip-h)] shrink-0 items-center gap-1.5 rounded-r-xs px-1.5 border border-current whitespace-nowrap"
            >
              <span
                className="hpv2-label-face font-medium uppercase leading-none text-cap-trim"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--hpv2-type-label)",
                  fontWeight: 500,
                }}
              >
                {chip}
              </span>
            </span>
          ))}
        </div>

        <div className="flex w-full items-start gap-2.5 landing-section-title landing-portal-heading">
          <h2
            data-type-role="heading"
            className="text-cap-trim cap-rules text-[var(--hw-teams-ink)]"
            style={{
              fontFamily: "var(--font-rules-gothic-cnd)",
              fontSize: "var(--hpv2-type-heading)",
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Technical Arsenal
          </h2>
          <span className="mt-0.5 size-6 shrink-0 text-[var(--hermes-primary)]">
            <img alt="" height={24} width={24} src={`${NOUS_CDN}/assets/hermes-agent/globe.svg`} />
          </span>
          <div className="ml-auto shrink-0 self-start text-[var(--hw-teams-ink)]">
            <div className="landing-portal-actions">
              <a
                href="mailto:sameer870732@gmail.com"
                role="link"
                data-slot="button"
                data-variant="primary"
                data-size="m"
                className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m text-xs bg-[var(--hpv2-brand,var(--hermes-primary))] text-[var(--hermes-white)] gap-2 px-3 py-2.5"
              >
                <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">
                  Email Sameer
                </span>
                <span aria-hidden="true" className="hermes-button-hover-border" />
              </a>
              <a
                href="https://github.com/sam-eer12"
                target="_blank"
                rel="noopener noreferrer"
                role="link"
                data-slot="button"
                data-variant="underline"
                data-size="m"
                className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m text-xs bg-transparent text-current gap-2 px-3 py-2.5"
              >
                <span className="leading-none whitespace-nowrap cap-mono text-cap-trim underline decoration-current/67 underline-offset-[0.2em] group-hover:decoration-current">
                  GitHub Profile
                </span>
              </a>
            </div>
          </div>
        </div>

        <p
          data-type-role="copy"
          className="text-cap-trim cap-rules landing-portal-description"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--hpv2-type-body)",
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          Production stack spanning from-scratch PyTorch language modeling and computer vision
          pipelines to SSR Next.js interfaces and real-time Three.js GLSL rendering.
        </p>

        <div className="landing-portal-art">
          <figure className="hw-teams-plate bg-hermes relative h-[var(--hw-teams-plate-h)] w-full overflow-clip rounded-t-md">
            <div className="hw-noise absolute inset-0">
              <img
                alt=""
                className="hw-parallax absolute inset-0 size-full object-cover"
                decoding="async"
                loading="lazy"
                src="/assets/library/portal-art.webp"
              />
            </div>
          </figure>
        </div>

        <ul className="arsenal-grid">
          {ARSENAL_COLUMNS.map((col) => (
            <li
              key={col.name}
              className="arsenal-card"
              data-featured={col.featured ? "true" : "false"}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="hw-mono text-xs font-medium uppercase tracking-wider text-[var(--hermes-primary)]">
                    {col.name}
                  </span>
                  {col.badge ? (
                    <span className="hw-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-[var(--hermes-primary)] text-[var(--hermes-white)]">
                      {col.badge}
                    </span>
                  ) : null}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-rules-gothic-cmp)",
                    fontSize: "52px",
                    lineHeight: 0.9,
                  }}
                  className="uppercase text-[var(--hw-teams-ink)]"
                >
                  {col.metric}
                </p>
                <p className="hw-mono text-[11px] uppercase opacity-70">{col.subtitle}</p>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-[var(--hw-teams-ink)]">
                  {col.items.map((sk) => (
                    <li key={sk} className="leading-snug">
                      {sk}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={col.ctaHref}
                target={col.ctaHref.startsWith("http") ? "_blank" : undefined}
                rel={col.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                data-slot="button"
                data-variant={col.featured ? "primary" : "outline"}
                data-size="s"
                className={`hermes-button inline-flex items-center justify-center rounded-none px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] ${
                  col.featured
                    ? "bg-[var(--hpv2-brand,var(--hermes-primary))] text-[var(--hermes-white)]"
                    : "border border-current text-[var(--hermes-primary)] hover:bg-[var(--hermes-primary)] hover:text-[var(--hermes-white)]"
                }`}
              >
                {col.ctaLabel}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ContactSection() {
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setResult("Sending....");

    try {
      const formData = new FormData(form);
      formData.append("access_key", "dbb12da2-22b7-4553-839a-efb2b312f97e");

      const response = await fetch("https://api.web3forms.com/submit", {
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
    <section
      id="contact"
      aria-label="Contact Me"
      className="hw-contact-section bg-hermes-paper text-[var(--hw-teams-ink)]"
    >
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)]">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-dotted border-[var(--hermes-primary)]/40 pb-8">
          <div className="flex flex-col gap-3">
            <p
              data-type-role="info"
              className="text-[var(--hermes-primary)]"
              style={{
                fontFamily: "var(--hpv2-font-meta)",
                fontSize: "var(--hpv2-type-info)",
                fontWeight: 400,
                lineHeight: 1.5,
                textTransform: "uppercase",
              }}
            >
              Get in Touch // Direct Inquiry
            </p>
            <h2
              data-type-role="heading"
              className="text-cap-trim cap-rules text-[var(--hw-teams-ink)]"
              style={{
                fontFamily: "var(--font-rules-gothic-cnd)",
                fontSize: "var(--hpv2-type-heading)",
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              Contact Me
            </h2>
          </div>

          <a
            href="/assets/Sameer_Gupta_Resume.pdf"
            download="Sameer_Gupta_Resume.pdf"
            data-slot="button"
            data-variant="outline"
            data-size="m"
            className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border border-[var(--hermes-primary)]/40 outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-colors hover:bg-[var(--hermes-primary)] hover:text-white gap-2 px-4 py-2.5 text-[length:var(--hw-teams-label)]"
          >
            <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">
              Download Resume (PDF)
            </span>
          </a>
        </div>

        <form onSubmit={onSubmit} className="hw-contact-card">
          <div className="hw-contact-grid">
            <label className="hw-contact-field">
              <span className="hw-mono text-[11px] uppercase tracking-wider opacity-80">
                Your Name
              </span>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter Your Name"
                className="hw-contact-input"
              />
            </label>
            <label className="hw-contact-field">
              <span className="hw-mono text-[11px] uppercase tracking-wider opacity-80">
                Your Email
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter Your Email"
                className="hw-contact-input"
              />
            </label>
          </div>

          <label className="hw-contact-field mb-6">
            <span className="hw-mono text-[11px] uppercase tracking-wider opacity-80">
              Message
            </span>
            <textarea
              name="message"
              rows={6}
              required
              placeholder="Enter Your Message"
              className="hw-contact-input resize-y"
            />
          </label>

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
                {submitting ? "Sending...." : "Submit Message ->"}
              </span>
            </button>

            {result ? (
              <p
                role="status"
                aria-live="polite"
                className="hw-mono text-xs uppercase tracking-wider text-[var(--hermes-primary)]"
              >
                {result}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}

export function PaperFooter() {
  return (
    <footer className="bg-hermes-paper text-[var(--hw-teams-ink)] pt-8 pb-12">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] flex flex-col gap-6">
        <FitText
          text="Sameer"
          maxPx={397}
          className="hw-teams-ghost pointer-events-none hw-teams-gothic text-center font-normal"
        />
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-dotted border-[var(--hermes-primary)]/40 pt-6 hw-mono text-xs uppercase tracking-wider">
          <div className="flex flex-col gap-2">
            <p>NSUT Delhi · B.Tech ICE &apos;28</p>
            <p className="opacity-70">sameer870732@gmail.com</p>
          </div>
          <div className="flex items-center gap-4 text-[var(--hermes-primary)]">
            <NousResearchCenterBadges />
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <p>
              <a
                href="https://github.com/sam-eer12"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-from-font"
              >
                GitHub
              </a>
              <span className="mx-2">|</span>
              <a
                href="https://huggingface.co/sam-eer12"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-from-font"
              >
                HuggingFace
              </a>
            </p>
            <p className="opacity-70">Delhi, India · 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterNavItem {
  label: string;
  href: string;
  prefix?: string;
  external?: boolean;
  download?: string;
}

interface FooterNavColumn {
  category: string;
  title: string;
  items: FooterNavItem[];
}

const FOOTER_COLUMNS: FooterNavColumn[] = [
  {
    category: "Products",
    title: "Projects",
    items: [
      { label: "AeroRoute", href: "https://aeroroute.d1qrrcsa5p4lz3.amplifyapp.com/", external: true },
      { label: "NEXA (SIH2026)", href: "https://nexa-drdo.duckdns.org/", external: true },
      { label: "BitChord PR #1414", href: "https://github.com/kushagrasinghx/BitChord/pull/1414", external: true },
      { label: "VigilAI", href: "https://github.com/sam-eer12/VigilAI-survillance-project", external: true },
      { label: "Amicus AI", href: "https://amicusai.vercel.app/", external: true },
      { label: "Via Terminal", href: "#install" },
    ],
  },
  {
    category: "Platform",
    title: "Contact",
    items: [
      { label: "Contact Form", href: "#contact" },
      {
        label: "Download Resume",
        href: "/assets/Sameer_Gupta_Resume.pdf",
        download: "Sameer_Gupta_Resume.pdf",
      },
      { label: "Email Sameer", href: "mailto:sameer870732@gmail.com" },
      { label: "+91 9899901635", href: "tel:+919899901635" },
      { label: "Back to Top", href: "#top" },
    ],
  },
  {
    category: "Research",
    title: "Models",
    items: [
      { label: "ChadGPT 250M", href: "https://huggingface.co/sam-eer12/chadGPT", external: true },
      { label: "Project SLM", href: "https://github.com/sam-eer12/projectSLM", external: true },
      { label: "3D Shader Studio", href: "#downloads" },
      { label: "Technical Matrix", href: "#portal" },
      { label: "Experience & FAQ", href: "#faqs" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    category: "Resources",
    title: "Community",
    items: [
      { prefix: "Go to ", label: "GitHub", href: "https://github.com/sam-eer12", external: true },
      { prefix: "Go to ", label: "Hugging Face", href: "https://huggingface.co/sam-eer12", external: true },
      { prefix: "Go to ", label: "LinkedIn", href: "https://www.linkedin.com/in/sameer-gupta-768b28312", external: true },
      { prefix: "Go to ", label: "BitChord PR", href: "https://github.com/kushagrasinghx/BitChord/pull/1414", external: true },
      { prefix: "Go to ", label: "SIH2026 Repo", href: "https://github.com/sam-eer12/sih2026", external: true },
      { prefix: "Go to ", label: "Legacy Site", href: "https://sameers-portfolio-eosin.vercel.app/", external: true },
    ],
  },
];

export function MarketingFooterReveal() {
  const revealRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;
    let rafPending = false;

    const updateReveal = () => {
      rafPending = false;
      const vh = window.innerHeight || 800;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      const distFromBottom = maxScroll - window.scrollY;
      const bottomProgress = Math.max(0, Math.min(1, 1 - distFromBottom / Math.max(1, vh)));
      const mainEl = document.getElementById("hpv2-main");
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

    updateReveal();
    document.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={revealRef}
      id="footer"
      className="hw-footer-reveal relative z-0 md:-mt-[100dvh]"
      style={
        {
          "--hw-footer-opacity": 1,
          "--hw-footer-lift": "0px",
        } as React.CSSProperties
      }
    >
      <footer className="hw-footer-soften bg-hermes text-[var(--hw-fg)] md:sticky md:top-0 md:flex md:min-h-dvh md:translate-y-[var(--hw-footer-lift,0px)] md:flex-col md:pb-[var(--hw-frame)] md:motion-reduce:translate-y-0">
        <div className="hw-footer-art-stage bg-inherit">
          <div className="hw-noise absolute inset-0">
            <img
              alt=""
              className="absolute inset-0 size-full object-cover object-top"
              decoding="async"
              loading="lazy"
              src="/assets/library/footer.webp"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_bottom,transparent,var(--hermes-primary)_86%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 z-10 pointer-events-none translate-y-[calc(32%+(1-var(--hw-footer-opacity,0))*45%)] opacity-[var(--hw-footer-opacity,0)] will-change-[translate,opacity] motion-reduce:translate-y-[32%] motion-reduce:opacity-100"
          >
            <FitText
              text="Sameer Gupta"
              maxPx="var(--hw-teams-ghost-word)"
              className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] hw-ghost hw-teams-ghost-white hw-teams-gothic text-center font-normal"
            />
          </div>
        </div>

        <div className="relative z-20 mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] pt-3">
          <div className="hw-teams-footer-grid font-[family-name:var(--font-mono)] uppercase relative grid grid-cols-2 gap-x-6 gap-y-10 pb-10 text-[length:var(--hw-teams-label-sm)] leading-none tracking-normal md:grid-cols-[minmax(0,320px)_repeat(4,minmax(0,1fr))] md:gap-5">
            <div className="flex flex-col gap-5 max-md:col-span-2">
              <NousOutlineFooterLogo />
              <p className="hw-mono text-[length:var(--hw-fs-xs)] leading-[1.4] tracking-[0.04em] text-[color:var(--hw-fg-muted)] uppercase">
                AI Systems &amp; Interactive WebGL.
              </p>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title} className="hw-teams-footer-column flex flex-col gap-5">
                <p className="opacity-60">{col.category}</p>
                <p className="hw-teams-footer-title font-[family-name:var(--font-display)] text-[length:var(--hw-teams-faq-q)] leading-[1.4] tracking-normal normal-case">
                  {col.title}
                </p>
                <ul className="-my-[var(--hw-teams-footer-row-pad)] flex flex-col">
                  {col.items.map((item) => {
                    const isHash = item.href.startsWith("#");
                    return (
                      <li key={`${col.title}-${item.label}`} className="flex">
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          download={item.download}
                          onClick={isHash ? (e) => smoothScrollToHash(item.href, e) : undefined}
                          className="group -ml-1 inline-flex self-start py-[var(--hw-teams-footer-row-pad)] whitespace-nowrap"
                        >
                          <span
                            data-chip=""
                            data-tone="plain"
                            className="inline-flex h-[var(--hpv2-chip-h)] shrink-0 items-center gap-1.5 rounded-r-xs px-1.5 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 transition-colors duration-150 ease-out group-hover:bg-[var(--hw-fg)] group-hover:text-[var(--hermes-primary)] group-hover:duration-0"
                          >
                            {item.prefix ? (
                              <span>
                                <span className="opacity-60">{item.prefix}</span>
                                {item.label}
                              </span>
                            ) : (
                              item.label
                            )}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="py-6 border-t border-white/20 flex flex-wrap items-center justify-between gap-4 hw-mono text-[11px] uppercase opacity-75">
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/sam-eer12"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-[var(--hw-accent-pink)] transition-colors"
              >
                <GitHubPixelIcon className="size-4" />
              </a>
              <a
                href="https://huggingface.co/sam-eer12"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hugging Face"
                className="hover:text-[var(--hw-accent-pink)] transition-colors"
              >
                <HuggingFacePixelIcon className="size-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/sameer-gupta-768b28312"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-[var(--hw-accent-pink)] transition-colors"
              >
                <LinkedInPixelIcon className="size-4" />
              </a>
            </div>
            <span>Sameer Gupta · NSUT Delhi · Delhi, India</span>
            <span>MIT License · 2026</span>
          </div>
        </div>
      </footer>
      <div aria-hidden="true" className="pointer-events-none h-dvh max-md:hidden" />
    </div>
  );
}
