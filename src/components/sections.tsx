import React from "react";
import Link from "next/link";
import { CosmicBust3D } from "./cosmic-bust-3d";
import { FitText } from "./chrome";
import { PROJECTS } from "../data/projects";
import {
  ContactForm,
  ExperienceFaqAccordion,
  FooterHashLink,
  FooterRevealScrollSync,
  InstallTerminal,
  ProjectCardArticle,
  ReplayIntroButton,
  type AccordionItemData,
} from "./sections-client";
import {
  ArrowRightIcon,
  GitHubPixelIcon,
  HuggingFacePixelIcon,
  LinkedInPixelIcon,
  NousOutlineFooterLogo,
  NousResearchCenterBadges,
} from "./nous-logos";

const NOUS_CDN =
  "https://web-assets.nousresearch.com/marketing/64ae3d30463049bd9e6f380cda9cd9538a0f4edb";

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
            <span>I Train Small</span> <span>Models &amp; Ship</span> <span>Web Software</span>
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
            Sameer Gupta, sophomore at NSUT Delhi. I built the ChadGPT 250M language model from
            scratch in PyTorch alongside DRDO LiDAR perception, AeroRoute, and WebGL tools.
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
                ChadGPT 250M
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
                GitHub
              </span>
              <span aria-hidden="true" className="hermes-button-hover-border" />
            </a>

            <ReplayIntroButton />
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
  return (
    <section aria-label="Open Weights and Repositories" className="landing-downloads" id="downloads">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)]">
        <div className="landing-download-title">
          <img alt="" height={24} width={24} src={`${NOUS_CDN}/assets/hermes-agent/desktop.svg`} />
          <div className="flex w-full flex-wrap items-start gap-2.5 landing-section-title landing-download-heading">
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
              Open Weights &amp; Code
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
            Inspect ChadGPT 250M model weights on Hugging Face, browse source repositories on GitHub,
            or view the earlier portfolio build.
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
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--hpv2-type-info)",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                250M Open Weights
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
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--hpv2-type-info)",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                29+ Repositories
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
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--hpv2-type-info)",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                NSUT Delhi · 2024 - 2028
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
            <ProjectCardArticle key={proj.slug} slug={proj.slug}>
              <div className="landing-feature-heading">
                <p
                  data-type-role="info"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--hpv2-type-info)",
                    fontWeight: 500,
                    lineHeight: 1.5,
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
                  <Link
                    href={`/projects/${proj.slug}`}
                    className="underline decoration-current/40 underline-offset-4 hover:decoration-current"
                  >
                    {proj.title}
                  </Link>
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
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-medium">
                  <Link
                    href={`/projects/${proj.slug}`}
                    className="hw-project-card-cta inline-flex items-center gap-1.5 px-2.5 py-1"
                  >
                    <span>Docs &amp; Diagrams</span>
                    <ArrowRightIcon className="size-3.5 shrink-0" />
                  </Link>
                  <a
                    href={proj.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hw-project-card-link inline-flex items-center gap-1.5 px-2.5 py-1"
                  >
                    <span>{proj.primaryLabel}</span>
                    <ArrowRightIcon className="size-3.5 shrink-0" />
                  </a>
                  {proj.secondaryHref && proj.secondaryLabel ? (
                    <a
                      href={proj.secondaryHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hw-project-card-link inline-flex items-center gap-1.5 px-2.5 py-1"
                    >
                      <span>{proj.secondaryLabel}</span>
                      <ArrowRightIcon className="size-3.5 shrink-0" />
                    </a>
                  ) : null}
                </div>
              </div>

              <div className={`landing-feature-art ${proj.artClass}`}>
                <Link
                  href={`/projects/${proj.slug}`}
                  aria-label={`Open ${proj.title} documentation and Mermaid diagrams`}
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
                </Link>
              </div>
            </ProjectCardArticle>
          ))}
        </div>
      </div>
    </section>
  );
}

const EXPERIENCE_ITEMS: AccordionItemData[] = [
  {
    id: "edu",
    question: "NSUT Delhi · B.Tech Instrumentation & Control (2024 - 2028)",
    answer:
      "Pursuing a B.Tech in Instrumentation and Control Engineering at Netaji Subhas University of Technology (NSUT), Delhi (August 2024 - May 2028) with a 7.55 CGPA, combining control systems engineering with fullstack software and deep learning research.",
  },
  {
    id: "exp",
    question: "GirlScript Summer of Code '25 & Google Gemini Ambassador",
    answer:
      "Served as an Open Source Contributor during GirlScript Summer of Code (July - Sept 2025), authored open-source PRs including BitChord Apple Music integration (#1414) and SIH2026 DRDO NEXA 2.5D LiDAR mapping, and led campus AI workshops as a Google Gemini Student Ambassador (Aug - Dec 2025).",
  },
  {
    id: "chadgpt",
    question: "ChadGPT 250M Language Model Architecture & Training",
    answer:
      "Engineered a custom 249,832,448-parameter decoder-only PyTorch transformer featuring Grouped Query Attention (GQA) and Rotary Positional Embeddings (RoPE). Extended context length to 4,096 tokens via Position Interpolation, fine-tuned with ChatML SFT on SmolLM-Corpus and OpenHermes-2.5, and verified 42.55% zero-shot accuracy on ARC-Easy.",
  },
  {
    id: "certs",
    question: "Hackathons & Recognitions",
    answer:
      "Certified across Frontend Battle 2.0 (IIT Bhubaneswar, June 2025), BuildWithDelhi 2.0 (Hack with India, Aug 2025), Kaarya Neeti Case Competition (E-Cell NSUT, Aug 2025), Zero to One Hackathon (Chandigarh University, Aug 2025), and the McKinsey Forward Learning Programme (Dec 2025).",
  },
  {
    id: "contact",
    question: "Direct Contact & Profiles",
    answer:
      "Reach out directly at sameer870732@gmail.com or +91 9899901635, explore code repositories at github.com/sam-eer12, inspect model weights at huggingface.co/sam-eer12, or connect on LinkedIn (sameer-gupta-768b28312).",
  },
];

export function ExperienceFaqSection() {
  return (
    <section className="bg-hermes-paper py-[60px]" id="faqs">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] flex flex-col gap-5">
        <div className="flex w-full flex-wrap items-start gap-2.5 hw-faq-header">
          <h2
            data-type-role="heading"
            className="text-cap-trim cap-rules text-[var(--hw-teams-ink)] min-w-0 max-w-full"
            style={{
              fontFamily: "var(--font-rules-gothic-cnd)",
              fontSize: "var(--hpv2-type-heading)",
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Background &amp; Experience
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
          <div className="ml-auto shrink-0 self-start text-[var(--hw-teams-ink)] hw-faq-header-cta">
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

        <ExperienceFaqAccordion items={EXPERIENCE_ITEMS} />
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
    badge: "Primary",
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
    <section aria-label="Engineering Stack" className="landing-portal" id="portal">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] landing-portal-column">
        <div aria-label="Skill Domains" className="landing-plan-chips">
          {["AI & ML", "Three.js", "Next.js", "Systems"].map((chip) => (
            <span
              key={chip}
              data-chip=""
              data-tone="outline"
              className="inline-flex h-[var(--hpv2-chip-h)] shrink-0 items-center gap-1.5 rounded-r-xs px-1.5 border border-current whitespace-nowrap"
            >
              <span
                className="hpv2-label-face font-medium leading-none text-cap-trim"
                style={{
                  fontFamily: "var(--font-body)",
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
            Engineering Stack
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
                  <span className="text-xs font-semibold text-[var(--hermes-primary)]">
                    {col.name}
                  </span>
                  {col.badge ? (
                    <span className="text-[11px] font-medium px-2 py-0.5 bg-[var(--hermes-primary)] text-[var(--hermes-white)]">
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
                  className="text-[var(--hw-teams-ink)]"
                >
                  {col.metric}
                </p>
                <p className="text-xs opacity-75">{col.subtitle}</p>
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
                fontFamily: "var(--font-body)",
                fontSize: "var(--hpv2-type-info)",
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              Get in touch
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

        <ContactForm
          endpoint="https://api.web3forms.com/submit"
          accessKey="dbb12da2-22b7-4553-839a-efb2b312f97e"
        >
          <div className="hw-contact-grid">
            <label className="hw-contact-field">
              <span className="text-xs font-medium opacity-80">
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
              <span className="text-xs font-medium opacity-80">
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
            <span className="text-xs font-medium opacity-80">
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
        </ContactForm>
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
      { label: "Open Weights & Code", href: "#downloads" },
      { label: "Engineering Stack", href: "#portal" },
      { label: "Experience", href: "#faqs" },
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
      { prefix: "Go to ", label: "BitChord Fork", href: "https://github.com/sam-eer12/BitChord", external: true },
      { prefix: "Go to ", label: "SIH2026 Repo", href: "https://github.com/sam-eer12/sih2026", external: true },
      { prefix: "Go to ", label: "AWS-DTU Repo", href: "https://github.com/Shubh3155/AWS-DTU", external: true },
    ],
  },
];

export function MarketingFooterReveal() {
  return (
    <div
      id="footer"
      className="hw-footer-reveal relative z-0 md:-mt-[100dvh]"
      style={
        {
          "--hw-footer-opacity": 1,
          "--hw-footer-lift": "0px",
        } as React.CSSProperties
      }
    >
      <FooterRevealScrollSync />
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
                    const linkContent = (
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
                    );
                    const linkClass =
                      "group -ml-1 inline-flex self-start py-[var(--hw-teams-footer-row-pad)] whitespace-nowrap";
                    return (
                      <li key={`${col.title}-${item.label}`} className="flex">
                        {isHash ? (
                          <FooterHashLink href={item.href} className={linkClass}>
                            {linkContent}
                          </FooterHashLink>
                        ) : (
                          <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            download={item.download}
                            className={linkClass}
                          >
                            {linkContent}
                          </a>
                        )}
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
