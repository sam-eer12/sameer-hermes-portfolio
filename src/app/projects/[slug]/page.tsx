import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FilmGrain,
  HeroParallax,
  MarketingFrame,
  MarketingThemeToggle,
} from "../../../components/chrome";
import { ProjectMarkdownExplorer } from "../../../components/markdown-preview";
import {
  MarketingHeader,
  MarketingNavigationProvider,
  MarketingPaperNav,
} from "../../../components/navigation";
import { MarketingFooterReveal, PaperFooter } from "../../../components/sections";
import { ProjectCliBar } from "../../../components/sections-client";
import {
  getAdjacentProjects,
  getProjectBySlug,
  PROJECTS,
} from "../../../data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} - Architecture & Documentation`,
    description: project.description,
    alternates: {
      canonical: `https://sameerg.vercel.app/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} | Sameer Gupta`,
      description: project.description,
      url: `https://sameerg.vercel.app/projects/${project.slug}`,
      type: "article",
      images: [
        {
          url: project.thumbnail,
          alt: `${project.title} preview thumbnail`,
          type: "image/webp",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Sameer Gupta`,
      description: project.description,
      images: [project.thumbnail],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(project.slug);

  return (
    <MarketingNavigationProvider>
      <div
        className="bg-hermes text-hermes-fg antialiased"
        style={{
          backgroundColor: "var(--color-hermes)",
          color: "var(--color-hermes-fg)",
        }}
      >
        <div className="hermes-web min-h-dvh w-full bg-[var(--hermes-primary)] text-[var(--hermes-white)] hw-teams-page my-0">
          <div
            data-marketing-page=""
            className="bg-hermes mx-auto min-h-dvh w-full md:w-[var(--hw-teams-page-w)]"
          >
            <MarketingThemeToggle />
            <MarketingFrame />
            <FilmGrain />
            <HeroParallax />

            <div id="hpv2-main" role="main" tabIndex={-1} className="relative z-10 bg-hermes">
              <span aria-hidden="true" id="top" />
              <MarketingHeader />
              <MarketingPaperNav />

              <section aria-label={project.title} className="hw-project-hero">
                <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)]">
                  <div className="hw-project-breadcrumb">
                    <Link
                      href="/#features"
                      className="inline-flex items-center gap-2 hw-mono text-xs uppercase tracking-[0.1em] text-[var(--hermes-white)]/85 hover:text-[var(--hw-accent-pink)] transition-colors"
                    >
                      <span aria-hidden="true">&lt;-</span>
                      <span>Back to Selected Projects</span>
                    </Link>

                    <span className="hw-project-index-pill">
                      PROJECT {project.order} / 06 · {project.indexLabel}
                    </span>
                  </div>

                  <div className="hw-project-hero-grid">
                    <div className="flex flex-col gap-5">
                      <h1
                        data-type-role="hero"
                        className="text-cap-trim cap-rules text-[var(--hermes-white)]"
                        style={{
                          fontFamily: "var(--font-rules-gothic-cnd)",
                          fontSize: "clamp(2.85rem, 6.2vw, 5.25rem)",
                          fontWeight: 200,
                          lineHeight: 0.96,
                          letterSpacing: "-0.02em",
                          textTransform: "none",
                        }}
                      >
                        {project.title}
                      </h1>

                      <p
                        data-type-role="copy"
                        className="max-w-[54ch] text-[color:color-mix(in_srgb,var(--hermes-white)_88%,transparent)]"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "clamp(1rem, 1.35vw, 1.2rem)",
                          fontWeight: 400,
                          lineHeight: 1.5,
                        }}
                      >
                        {project.subtitle}
                      </p>

                      <div className="flex flex-wrap gap-2" aria-label="Technologies">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center border border-white/25 px-2.5 py-1 hw-mono text-[11px] uppercase tracking-[0.06em] text-white/90"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        {project.links.map((lnk) => {
                          const variant = lnk.variant ?? "outline";
                          const cls =
                            variant === "primary"
                              ? "hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.08em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m bg-[color-mix(in_srgb,var(--hermes-paper)_92%,transparent)] text-[var(--hpv2-brand,var(--hermes-primary))] hover:bg-[var(--hermes-paper)] hover:shadow-[var(--hpv2-shadow-lift)] gap-2 px-3.5 py-2.5 text-xs"
                              : variant === "secondary"
                              ? "hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border border-white/45 bg-white/10 outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.08em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m text-[var(--hermes-white)] hover:bg-white/20 gap-2 px-3.5 py-2.5 text-xs"
                              : "hermes-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border border-white/25 bg-transparent outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.08em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m text-[var(--hermes-white)]/85 hover:bg-white/10 gap-2 px-3 py-2 text-xs";
                          return (
                            <a
                              key={lnk.label}
                              href={lnk.href}
                              target={lnk.external ? "_blank" : undefined}
                              rel={lnk.external ? "noopener noreferrer" : undefined}
                              data-slot="button"
                              data-variant={variant}
                              data-size="m"
                              className={cls}
                            >
                              <span className="leading-none whitespace-nowrap cap-mono text-cap-trim">
                                {lnk.label} -&gt;
                              </span>
                            </a>
                          );
                        })}

                        <a
                          href="#architecture"
                          className="inline-flex items-center gap-1.5 px-2.5 py-2 hw-mono text-xs uppercase tracking-[0.08em] text-[var(--hw-accent-pink)] underline underline-offset-4 hover:text-white transition-colors"
                        >
                          Jump to Mermaid Docs
                        </a>
                      </div>

                      <ProjectCliBar command={project.cliCommand} />
                    </div>

                    <div className="hw-project-visual-card">
                      <figure className="hw-teams-plate bg-hermes relative w-full overflow-clip">
                        <div className="hw-noise absolute inset-0">
                          <img
                            alt={`${project.title} preview thumbnail`}
                            className="hw-parallax absolute inset-0 size-full object-cover"
                            decoding="async"
                            src={project.thumbnail}
                          />
                        </div>
                      </figure>

                      <dl className="hw-project-meta-list">
                        <div className="hw-project-meta-row">
                          <dt>Role</dt>
                          <dd>{project.role}</dd>
                        </div>
                        <div className="hw-project-meta-row">
                          <dt>Timeline</dt>
                          <dd>{project.timeline}</dd>
                        </div>
                        <div className="hw-project-meta-row">
                          <dt>Status</dt>
                          <dd>{project.status}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <ul className="hw-project-metrics" aria-label="Key project metrics">
                    {project.metrics.map((m) => (
                      <li key={m.label} className="hw-project-metric-cell">
                        <span className="hw-mono text-[11px] uppercase tracking-[0.1em] opacity-70">
                          {m.label}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-rules-gothic-cmp)",
                            fontSize: "44px",
                            lineHeight: 0.92,
                          }}
                          className="text-[var(--hermes-white)]"
                        >
                          {m.value}
                        </span>
                        <span className="text-xs opacity-80 leading-snug">{m.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <div className="hw-feature-parallax relative z-30">
                <div className="hw-feature-panel bg-hermes-paper relative z-20 w-full overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                  <ProjectMarkdownExplorer project={project} />

                  <section
                    aria-label="Project Navigation"
                    className="bg-hermes-paper hw-project-explore-section"
                  >
                    <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] hw-project-explore-inner">
                      <div className="hw-project-explore-header">
                        <h2
                          className="text-cap-trim cap-rules text-[var(--hw-teams-ink)]"
                          style={{
                            fontFamily: "var(--font-rules-gothic-cnd)",
                            fontSize: "clamp(2rem, 4vw, 3rem)",
                            fontWeight: 400,
                            lineHeight: 1,
                          }}
                        >
                          Explore Other Projects
                        </h2>
                        <Link
                          href="/#features"
                          className="hw-mono text-xs uppercase tracking-[0.08em] text-[var(--hermes-primary)] underline underline-offset-4"
                        >
                          All 6 Systems on Home -&gt;
                        </Link>
                      </div>

                      <div className="hw-project-pager-grid">
                        <Link href={`/projects/${prev.slug}`} className="hw-project-pager-card">
                          <span className="hw-mono text-[11px] uppercase tracking-[0.1em] opacity-65">
                            &lt;- Previous Project · {prev.order}
                          </span>
                          <span
                            className="text-[var(--hw-teams-ink)]"
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "1.5rem",
                              fontWeight: 500,
                              lineHeight: 1.15,
                            }}
                          >
                            {prev.title}
                          </span>
                          <span className="text-xs opacity-75">{prev.indexLabel}</span>
                        </Link>

                        <Link
                          href={`/projects/${next.slug}`}
                          className="hw-project-pager-card text-right items-end"
                        >
                          <span className="hw-mono text-[11px] uppercase tracking-[0.1em] opacity-65">
                            Next Project · {next.order} -&gt;
                          </span>
                          <span
                            className="text-[var(--hw-teams-ink)]"
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "1.5rem",
                              fontWeight: 500,
                              lineHeight: 1.15,
                            }}
                          >
                            {next.title}
                          </span>
                          <span className="text-xs opacity-75">{next.indexLabel}</span>
                        </Link>
                      </div>

                      <div className="hw-project-pills-row">
                        {PROJECTS.map((item) => {
                          const isCurrent = item.slug === project.slug;
                          return (
                            <Link
                              key={item.slug}
                              href={`/projects/${item.slug}`}
                              aria-current={isCurrent ? "page" : undefined}
                              className={`inline-flex items-center gap-1.5 border px-3 py-1.5 hw-mono text-xs uppercase tracking-[0.06em] transition-colors ${
                                isCurrent
                                  ? "border-[var(--hermes-primary)] bg-[var(--hermes-primary)] text-white"
                                  : "border-current/25 text-[var(--hw-teams-ink)] hover:border-[var(--hermes-primary)] hover:text-[var(--hermes-primary)]"
                              }`}
                            >
                              <span>{item.order}</span>
                              <span>{item.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </section>

                  <PaperFooter />
                </div>
              </div>
            </div>

            <MarketingFooterReveal />
          </div>
        </div>
      </div>
    </MarketingNavigationProvider>
  );
}
