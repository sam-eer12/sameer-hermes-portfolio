"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GitHubPixelIcon, HuggingFacePixelIcon, LinkedInPixelIcon } from "./nous-logos";

export type NavPreset = "Identity" | "Projects" | "Models" | "Connect";

const PRESET_PRIMARY_HASH: Record<NavPreset, string> = {
  Identity: "#faqs",
  Projects: "#features",
  Models: "#downloads",
  Connect: "#contact",
};

export function smoothScrollToHash(href: string, event?: React.MouseEvent) {
  if (!href.startsWith("#")) return;
  event?.preventDefault();
  if (typeof window === "undefined") return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = prefersReduced ? "auto" : "smooth";

  if (href === "#top") {
    window.scrollTo({ top: 0, behavior });
    window.history.pushState(null, "", "#top");
    return;
  }

  const targetId = href.slice(1);
  const el = document.getElementById(targetId);
  if (!el) return;

  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 64);
  window.scrollTo({ top, behavior });
  window.history.pushState(null, "", href);
}

interface SubnavLinkItem {
  label: string;
  mutedPrefix?: string;
  href: string;
  external?: boolean;
  download?: string;
  description: string;
}

interface SubnavSection {
  category: string;
  heading: string;
  isShowcase?: boolean;
  links: SubnavLinkItem[];
}

const PRESET_SECTIONS: Record<NavPreset, SubnavSection[]> = {
  Identity: [
    {
      category: "Explore",
      heading: "Profile",
      links: [
        {
          label: "Overview & 3D Studio",
          href: "#downloads",
          description: "Interactive Three.js GLSL sculpture & architectural stack",
        },
        {
          label: "Education & Experience",
          href: "#faqs",
          description: "NSUT Delhi '28 · GirlScript Summer of Code · Google Gemini Ambassador",
        },
      ],
    },
    {
      category: "Arsenal",
      heading: "Stack",
      links: [
        {
          label: "Technical Matrix",
          href: "#portal",
          description: "PyTorch, Next.js, Three.js, Flask, YOLOv11, CUDA",
        },
        {
          label: "Download Resume (PDF)",
          href: "/assets/Sameer_Gupta_Resume.pdf",
          download: "Sameer_Gupta_Resume.pdf",
          description: "Download Sameer Gupta CV / Resume PDF",
        },
      ],
    },
  ],
  Projects: [
    {
      category: "Flagship",
      heading: "AI Builds",
      links: [
        {
          label: "ChadGPT - 250M LLM",
          mutedPrefix: "Featured: ",
          href: "https://huggingface.co/sam-eer12/chadGPT",
          external: true,
          description: "Custom 250M-parameter SLM with GQA, RoPE & 4k context",
        },
        {
          label: "AeroRoute",
          href: "https://aeroroute.d1qrrcsa5p4lz3.amplifyapp.com/",
          external: true,
          description: "Real-time aerial & mobility route optimization platform",
        },
        {
          label: "NEXA - SIH2026 LiDAR",
          href: "https://nexa-drdo.duckdns.org/",
          external: true,
          description: "DRDO 2.5D LiDAR perception (github.com/sam-eer12/sih2026)",
        },
        {
          label: "Amicus AI",
          href: "https://amicusai.vercel.app/",
          external: true,
          description: "Location-aware legal advisor AI assistant",
        },
        {
          label: "VigilAI Surveillance",
          href: "https://github.com/sam-eer12/VigilAI-survillance-project",
          external: true,
          description: "94% accuracy YOLOv11 live anomaly detection system",
        },
        {
          label: "BitChord (PR #1414)",
          href: "https://github.com/kushagrasinghx/BitChord/pull/1414",
          external: true,
          description: "Apple Music & provider routing open-source PR",
        },
      ],
    },
    {
      category: "Archive",
      heading: "All Work",
      isShowcase: true,
      links: [
        {
          label: "View 6 Selected Systems",
          href: "#features",
          description: "Browse AI models, fullstack apps & GSSoC contributions",
        },
      ],
    },
  ],
  Models: [
    {
      category: "Hugging Face",
      heading: "ChadGPT",
      links: [
        {
          label: "Model Weights & Card",
          href: "https://huggingface.co/sam-eer12/chadGPT",
          external: true,
          description: "249,832,448 params · Safetensors · ChatML SFT",
        },
        {
          label: "Training Codebase (GitHub)",
          href: "https://github.com/sam-eer12/projectSLM",
          external: true,
          description: "sam-eer12/projectSLM PyTorch implementation",
        },
      ],
    },
    {
      category: "Benchmarks",
      heading: "Metrics",
      links: [
        {
          label: "42.55% ARC-Easy Zero-Shot",
          href: "#downloads",
          description: "Evaluated with LM-Evaluation-Harness & Position Interpolation",
        },
        {
          label: "Open-Source Repos",
          href: "https://github.com/sam-eer12",
          external: true,
          description: "Explore all repositories on github.com/sam-eer12",
        },
      ],
    },
  ],
  Connect: [
    {
      category: "Profiles",
      heading: "Socials",
      links: [
        {
          label: "GitHub",
          mutedPrefix: "Go to ",
          href: "https://github.com/sam-eer12",
          external: true,
          description: "github.com/sam-eer12",
        },
        {
          label: "Hugging Face",
          mutedPrefix: "Go to ",
          href: "https://huggingface.co/sam-eer12",
          external: true,
          description: "huggingface.co/sam-eer12",
        },
        {
          label: "LinkedIn",
          mutedPrefix: "Go to ",
          href: "https://www.linkedin.com/in/sameer-gupta-768b28312",
          external: true,
          description: "Connect professionally on LinkedIn",
        },
        {
          label: "Contact Form",
          mutedPrefix: "Write ",
          href: "#contact",
          description: "Send a message directly via Web3Forms",
        },
        {
          label: "sameer870732@gmail.com",
          mutedPrefix: "Email ",
          href: "mailto:sameer870732@gmail.com",
          external: true,
          description: "Direct email or +91 9899901635",
        },
      ],
    },
  ],
};

interface PromoSlide {
  id: string;
  label: string;
  href: string;
  icon: string;
  external?: boolean;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: "chadgpt",
    label: "ChadGPT 250M SLM on Hugging Face",
    href: "https://huggingface.co/sam-eer12/chadGPT",
    icon: "https://web-assets.nousresearch.com/marketing/64ae3d30463049bd9e6f380cda9cd9538a0f4edb/assets/hermes-landing/teams/hermes-wing.svg",
    external: true,
  },
  {
    id: "aeroroute",
    label: "AeroRoute - Live Route Optimization",
    href: "https://aeroroute.d1qrrcsa5p4lz3.amplifyapp.com/",
    icon: "https://web-assets.nousresearch.com/marketing/64ae3d30463049bd9e6f380cda9cd9538a0f4edb/assets/hermes-agent/globe.svg",
    external: true,
  },
  {
    id: "nexa",
    label: "NEXA - SIH2026 DRDO 2.5D LiDAR",
    href: "https://nexa-drdo.duckdns.org/",
    icon: "https://web-assets.nousresearch.com/marketing/64ae3d30463049bd9e6f380cda9cd9538a0f4edb/assets/hermes-agent/desktop.svg",
    external: true,
  },
  {
    id: "bitchord",
    label: "BitChord - Apple Music & Routing PR #1414",
    href: "https://github.com/kushagrasinghx/BitChord/pull/1414",
    icon: "https://web-assets.nousresearch.com/marketing/64ae3d30463049bd9e6f380cda9cd9538a0f4edb/assets/hermes-agent/features.svg",
    external: true,
  },
];

interface NavContextValue {
  openPreset: NavPreset | null;
  openMenu: (preset: NavPreset, trigger: HTMLElement) => void;
  scheduleOpen: (preset: NavPreset, trigger: HTMLElement) => void;
  scheduleClose: () => void;
  cancelTimers: () => void;
  closeMenu: () => void;
}

const NavContext = createContext<NavContextValue | null>(null);

function PixelOpenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-6 shrink-0"
    >
      <path d="M7 7h10v10h-2V10.414l-7.293 7.293-1.414-1.414L13.586 9H7V7z" />
    </svg>
  );
}

function PromoBanner({ initialSlide }: { initialSlide: number }) {
  const [slideIdx, setSlideIdx] = useState(initialSlide);
  const [typedCount, setTypedCount] = useState(0);
  const [hoverFast, setHoverFast] = useState(false);

  const slide = PROMO_SLIDES[slideIdx % PROMO_SLIDES.length];

  useEffect(() => {
    setSlideIdx(initialSlide);
  }, [initialSlide]);

  useEffect(() => {
    setTypedCount(0);
    const speed = hoverFast ? 6 : 28;
    let charTimer: number | null = null;
    let holdTimer: number | null = null;

    const advanceChar = (count: number) => {
      if (count <= slide.label.length) {
        setTypedCount(count);
        charTimer = window.setTimeout(() => advanceChar(count + 1), speed);
      } else {
        holdTimer = window.setTimeout(() => {
          setSlideIdx((i) => (i + 1) % PROMO_SLIDES.length);
        }, 6500);
      }
    };

    charTimer = window.setTimeout(() => advanceChar(1), 60);

    return () => {
      if (charTimer) window.clearTimeout(charTimer);
      if (holdTimer) window.clearTimeout(holdTimer);
    };
  }, [slide.label, slideIdx, hoverFast]);

  const prev = () => setSlideIdx((i) => (i - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
  const next = () => setSlideIdx((i) => (i + 1) % PROMO_SLIDES.length);

  return (
    <div
      className="nw-menu-promotion"
      data-promo={slide.id}
      onMouseEnter={() => setHoverFast(true)}
      onMouseLeave={() => setHoverFast(false)}
    >
      <a
        className="promo-hit"
        href={slide.href}
        target={slide.external ? "_blank" : undefined}
        rel={slide.external ? "noopener noreferrer" : undefined}
      >
        <div className="promo-brand flex items-center justify-center">
          <img src={slide.icon} alt="" className="h-5 w-5 object-contain" />
        </div>
        <span className="promo-typed hw-mono truncate text-xs font-medium tracking-wider uppercase">
          {slide.label.slice(0, typedCount)}
          <span className="animate-pulse">_</span>
        </span>
      </a>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous highlight"
          className="grid size-6 cursor-pointer place-items-center opacity-70 hover:opacity-100"
        >
          <span aria-hidden="true">{"<"}</span>
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next highlight"
          className="grid size-6 cursor-pointer place-items-center opacity-70 hover:opacity-100"
        >
          <span aria-hidden="true">{">"}</span>
        </button>
      </div>
    </div>
  );
}

export function MarketingNavigationProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [openPreset, setOpenPreset] = useState<NavPreset | null>(null);
  const [anchorRect, setAnchorRect] = useState<{ top: number; left: number; width: number } | null>(
    null
  );
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cancelTimers = useCallback(() => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const computePosition = useCallback((trigger: HTMLElement) => {
    const rect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(680, vw - 24);
    const left = Math.max(12, Math.min(rect.left, vw - width - 12));
    const top = Math.min(vh - 140, rect.bottom + 8);
    setAnchorRect({ top, left, width });
  }, []);

  const openMenu = useCallback(
    (preset: NavPreset, trigger: HTMLElement) => {
      cancelTimers();
      computePosition(trigger);
      setOpenPreset(preset);
    },
    [cancelTimers, computePosition]
  );

  const scheduleOpen = useCallback(
    (preset: NavPreset, trigger: HTMLElement) => {
      cancelTimers();
      openTimerRef.current = window.setTimeout(() => {
        computePosition(trigger);
        setOpenPreset(preset);
      }, 60);
    },
    [cancelTimers, computePosition]
  );

  const closeMenu = useCallback(() => {
    cancelTimers();
    setOpenPreset(null);
  }, [cancelTimers]);

  const scheduleClose = useCallback(() => {
    cancelTimers();
    closeTimerRef.current = window.setTimeout(() => {
      setOpenPreset(null);
    }, 300);
  }, [cancelTimers]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    const onDocDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (target.closest("[data-research-target]")) return;
      closeMenu();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDocDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDocDown);
    };
  }, [closeMenu]);

  const sections = openPreset ? PRESET_SECTIONS[openPreset] : PRESET_SECTIONS.Identity;
  const initialSlide = openPreset === "Models" ? 0 : openPreset === "Projects" ? 1 : 2;

  return (
    <NavContext.Provider
      value={{ openPreset, openMenu, scheduleOpen, scheduleClose, cancelTimers, closeMenu }}
    >
      {children}
      {mounted &&
        createPortal(
          <div
            ref={panelRef}
            id="research-navigation"
            className="nous-web nw-research-navigation"
            data-open={openPreset ? "true" : "false"}
            data-preset={openPreset ?? "Identity"}
            data-direction="down"
            style={{
              top: anchorRect ? `${anchorRect.top}px` : "84px",
              left: anchorRect ? `${anchorRect.left}px` : "24px",
              width: anchorRect ? `${anchorRect.width}px` : "min(680px, calc(100vw - 24px))",
              maxHeight: "calc(100dvh - 32px)",
              transformOrigin: "top left",
              visibility: openPreset ? "visible" : "hidden",
              pointerEvents: openPreset ? "auto" : "none",
              opacity: openPreset ? 1 : 0,
              transition: "opacity 140ms ease, left 140ms ease, transform 140ms ease",
            }}
            onMouseEnter={cancelTimers}
            onMouseLeave={scheduleClose}
          >
            <PromoBanner initialSlide={initialSlide} />
            <div className="overflow-y-auto">
              {sections.map((sec) => (
                <section
                  key={sec.heading}
                  className="nw-subnav-section"
                >
                  <div className="nw-subnav-group">
                    <div className="nw-subnav-category">
                      <span className="hw-mono text-[11px] uppercase tracking-wider">
                        {sec.category}
                      </span>
                    </div>
                    <span
                      className="nw-subnav-heading uppercase"
                      style={{
                        fontFamily: "var(--font-rules-gothic-cmp)",
                        fontSize: "36px",
                        lineHeight: 0.95,
                      }}
                    >
                      {sec.heading}
                    </span>
                    <div className="nw-subnav-links flex flex-col gap-1 pb-3">
                      {sec.links.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          download={item.download}
                          onClick={(e) => {
                            closeMenu();
                            if (item.href.startsWith("#")) {
                              smoothScrollToHash(item.href, e);
                            }
                          }}
                          className="nw-subnav-link"
                        >
                          <span className="nw-subnav-label">
                            {item.mutedPrefix ? (
                              <span className="nw-label-muted">{item.mutedPrefix}</span>
                            ) : null}
                            {item.label}
                          </span>
                          <span className="nw-subnav-description">{item.description}</span>
                          <PixelOpenIcon />
                        </a>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>,
          document.body
        )}
    </NavContext.Provider>
  );
}

function SubnavTrigger({
  preset,
  alignRight = false,
  sm = false,
}: {
  preset: NavPreset;
  alignRight?: boolean;
  sm?: boolean;
}) {
  const ctx = useContext(NavContext);
  const isOpen = ctx?.openPreset === preset;

  return (
    <button
      type="button"
      className={`hw-mono tracking-normal font-medium ${
        sm ? "text-[length:var(--hw-teams-label-sm)] opacity-60" : "text-[length:var(--hw-teams-label)] opacity-80"
      } nw-subnav-trigger whitespace-nowrap ${alignRight ? "text-right" : ""} hover:opacity-100`}
      data-research-target={preset}
      aria-controls="research-navigation"
      aria-expanded={isOpen ? "true" : "false"}
      onMouseEnter={(e) => ctx?.scheduleOpen(preset, e.currentTarget)}
      onMouseLeave={() => ctx?.scheduleClose()}
      onClick={(e) => {
        ctx?.closeMenu();
        smoothScrollToHash(PRESET_PRIMARY_HASH[preset], e);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          ctx?.openMenu(preset, e.currentTarget);
        }
      }}
    >
      <span className="nw-subnav-trigger-label">{preset}</span>
    </button>
  );
}

function MobileMenuDrawer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center gap-3 md:hidden">
      <a
        href="#install"
        role="link"
        tabIndex={0}
        onClick={(e) => {
          setOpen(false);
          smoothScrollToHash("#install", e);
        }}
        data-slot="button"
        data-variant="secondary"
        data-size="m"
        className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m bg-[color-mix(in_srgb,var(--hermes-paper)_90%,transparent)] text-[var(--hpv2-brand,var(--hermes-primary))] gap-2 px-3 py-[var(--hw-teams-btn-py)] text-[length:var(--hw-teams-label)]"
      >
        <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">ChadGPT</span>
        <span aria-hidden="true" className="hermes-button-hover-border" />
      </a>
      <button
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="-mr-2 grid size-11 cursor-pointer place-items-center"
        type="button"
        onClick={() => setOpen((o) => !o)}
      >
        <svg className="nw-research-menu-burger" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M13.3333 12H2.66667V10.6667H13.3333V12Z" />
          <path d="M13.3333 8.66667H2.66667V7.33333H13.3333V8.66667Z" />
          <path d="M13.3333 5.33333H2.66667V4H13.3333V5.33333Z" />
        </svg>
      </button>

      {mounted &&
        open &&
        createPortal(
          <div className="nous-web nw-research-mobile-menu fixed inset-0 z-[220] flex flex-col bg-[var(--hermes-primary)] p-6 text-[var(--hermes-white)] overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-white/20">
              <span className="hw-teams-gothic text-3xl uppercase">Sameer Gupta</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close mobile navigation"
                className="hw-mono px-3 py-1.5 border border-white/30 text-xs uppercase cursor-pointer"
              >
                Close [X]
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-6">
              {(Object.keys(PRESET_SECTIONS) as NavPreset[]).map((preset) => (
                <div key={preset} className="flex flex-col gap-2">
                  <p className="hw-mono text-xs uppercase opacity-60">{preset}</p>
                  <div className="flex flex-col gap-2">
                    {PRESET_SECTIONS[preset].flatMap((s) =>
                      s.links.map((l) => (
                        <a
                          key={l.label}
                          href={l.href}
                          target={l.external ? "_blank" : undefined}
                          rel={l.external ? "noopener noreferrer" : undefined}
                          download={l.download}
                          onClick={(e) => {
                            setOpen(false);
                            if (l.href.startsWith("#")) {
                              smoothScrollToHash(l.href, e);
                            }
                          }}
                          className="flex items-center justify-between py-2 border-b border-dotted border-white/25"
                        >
                          <span className="hw-mono text-sm uppercase">{l.label}</span>
                          <PixelOpenIcon />
                        </a>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export function MarketingHeader() {
  return (
    <header data-surface="brand" className="marketing-header relative z-[90] text-[var(--hw-fg)]">
      <nav
        data-pro-nav=""
        data-research-nav=""
        aria-label="Sameer Gupta Portfolio"
        className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-6 pt-10 pb-5"
      >
        <div className="flex items-center gap-x-6 max-md:hidden">
          <span className="flex min-w-0 flex-1">
            <SubnavTrigger preset="Identity" />
          </span>
          <span className="flex min-w-0 flex-1">
            <SubnavTrigger preset="Projects" />
          </span>
        </div>

        <div className="flex flex-col items-center max-md:items-start">
          <span className="hw-teams-gothic flex shrink-0 flex-col gap-1.5 text-4xl leading-[0.9] font-medium tracking-normal uppercase md:min-w-[2.25em] items-center text-center max-md:items-start max-md:text-left">
            <a
              href="/assets/Sameer_Gupta_Resume.pdf"
              download="Sameer_Gupta_Resume.pdf"
              title="Download Sameer Gupta Resume (PDF)"
              aria-label="Download Sameer Gupta Resume (PDF)"
              className="flex flex-col gap-1.5 hover:text-[var(--hw-accent-pink)] transition-colors"
            >
              <span className="block">Sameer</span>
              <span className="block">Gupta</span>
            </a>
          </span>
          <div className="mt-2 flex items-center gap-3 opacity-80 max-md:hidden">
            <a
              href="https://github.com/sam-eer12"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub @sam-eer12"
              className="hover:opacity-100 hover:text-[var(--hw-accent-pink)] transition-colors"
            >
              <GitHubPixelIcon className="size-3.5" />
            </a>
            <a
              href="https://huggingface.co/sam-eer12"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hugging Face @sam-eer12"
              className="hover:opacity-100 hover:text-[var(--hw-accent-pink)] transition-colors"
            >
              <HuggingFacePixelIcon className="size-3.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/sameer-gupta-768b28312"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Sameer Gupta"
              className="hover:opacity-100 hover:text-[var(--hw-accent-pink)] transition-colors"
            >
              <LinkedInPixelIcon className="size-3.5" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-x-6 max-md:hidden">
          <span className="flex min-w-0 flex-1 justify-end">
            <SubnavTrigger preset="Models" alignRight />
          </span>
          <span className="flex min-w-0 flex-1 justify-end">
            <SubnavTrigger preset="Connect" alignRight />
          </span>
          <div className="flex flex-1 justify-end" data-pro-nav-action="">
            <a
              href="#downloads"
              role="link"
              tabIndex={0}
              onClick={(e) => smoothScrollToHash("#downloads", e)}
              data-slot="button"
              data-variant="secondary"
              data-size="m"
              className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-midground/30 hermes-button-size-m bg-[color-mix(in_srgb,var(--hermes-paper)_90%,transparent)] text-[var(--hpv2-brand,var(--hermes-primary))] hover:bg-[var(--hermes-paper)] hover:shadow-[var(--hpv2-shadow-lift)] active:bg-[var(--hermes-paper)] gap-2 px-3 py-[var(--hw-teams-btn-py)] text-[length:var(--hw-teams-label)]"
            >
              <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">
                3D Studio
              </span>
              <span aria-hidden="true" className="hermes-button-hover-border" />
            </a>
          </div>
        </div>

        <MobileMenuDrawer />
      </nav>
    </header>
  );
}

export function MarketingPaperNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".landing-hero");
    const panel = document.querySelector(".hw-feature-panel");
    if (!panel && !hero) return;

    let heroVisible = true;
    let panelActive = false;
    const sync = () => setVisible(!heroVisible && panelActive);

    const ioHero = hero
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              heroVisible = entry.isIntersecting;
            }
            sync();
          },
          { threshold: 0.05 }
        )
      : null;

    const ioPanel = panel
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              panelActive = entry.isIntersecting || entry.boundingClientRect.top <= 40;
            }
            sync();
          },
          { rootMargin: "-20px 0px -85% 0px", threshold: 0 }
        )
      : null;

    if (hero) ioHero?.observe(hero);
    if (panel) ioPanel?.observe(panel);
    return () => {
      ioHero?.disconnect();
      ioPanel?.disconnect();
    };
  }, []);

  return (
    <div
      data-surface="brand"
      inert={!visible ? true : undefined}
      className={`marketing-paper-nav bg-hermes-paper fixed inset-x-0 top-0 z-50 text-[var(--hermes-primary)] shadow-[var(--hw-teams-paper-nav-rule)] transition-[translate,visibility] duration-300 ease-out motion-reduce:transition-none md:inset-x-[var(--hw-teams-page-inset)] md:top-[calc(var(--hw-frame)-1px)] ${
        visible ? "translate-y-0" : "invisible -translate-y-full"
      }`}
    >
      <nav
        data-pro-nav=""
        data-research-nav=""
        aria-label="Sameer Gupta Portfolio, pinned"
        className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-6 py-2.5"
      >
        <div className="flex items-center gap-x-6 max-md:hidden">
          <span className="flex min-w-0 flex-1">
            <SubnavTrigger preset="Identity" sm />
          </span>
          <span className="flex min-w-0 flex-1">
            <SubnavTrigger preset="Projects" sm />
          </span>
        </div>

        <a
          href="/assets/Sameer_Gupta_Resume.pdf"
          download="Sameer_Gupta_Resume.pdf"
          title="Download Sameer Gupta Resume (PDF)"
          aria-label="Download Sameer Gupta Resume (PDF)"
          className="flex items-center gap-2 hover:text-[var(--hw-accent-pink)] transition-colors"
        >
          <img
            src="https://web-assets.nousresearch.com/marketing/64ae3d30463049bd9e6f380cda9cd9538a0f4edb/assets/hermes-landing/teams/hermes-wing.svg"
            alt=""
            className="h-6 w-6 rotate-45 object-contain"
          />
          <span className="hw-teams-gothic text-xl uppercase tracking-normal max-md:inline hidden">
            Sameer Gupta
          </span>
        </a>

        <div className="flex items-center gap-x-6 max-md:hidden">
          <span className="flex min-w-0 flex-1 justify-end">
            <SubnavTrigger preset="Models" alignRight sm />
          </span>
          <span className="flex min-w-0 flex-1 justify-end">
            <SubnavTrigger preset="Connect" alignRight sm />
          </span>
          <div className="flex flex-1 justify-end" data-pro-nav-action="">
            <a
              href="https://huggingface.co/sam-eer12/chadGPT"
              target="_blank"
              rel="noopener noreferrer"
              role="link"
              tabIndex={0}
              data-slot="button"
              data-variant="primary"
              data-size="m"
              className="hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m bg-[var(--hpv2-brand,var(--hermes-primary))] text-[var(--hermes-white)] gap-2 px-3 py-[var(--hw-teams-btn-py)] text-[length:var(--hw-teams-label)]"
            >
              <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">
                ChadGPT 250M
              </span>
              <span aria-hidden="true" className="hermes-button-hover-border" />
            </a>
          </div>
        </div>

        <MobileMenuDrawer />
      </nav>
    </div>
  );
}
