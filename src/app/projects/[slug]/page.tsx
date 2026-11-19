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
import { ArrowLeftIcon, ArrowRightIcon } from "../../../components/nous-logos";
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
                      className="hw-project-back-link inline-flex items-center gap-2 hw-mono text-xs uppercase tracking-[0.1em]"
                    >
                      <ArrowLeftIcon className="size-4 shrink-0" />
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
                        className="hw-project-subtitle max-w-[54ch]"
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
                            className="hw-project-tag inline-flex items-center px-2.5 py-1 hw-mono text-[11px] uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        {project.links.map((lnk) => {
                          const variant = lnk.variant ?? "outline";
                          const cls = `hermes-button hw-project-btn hw-project-btn--${variant} group relative inline-flex cursor-pointer items-center justify-center rounded-none bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] uppercase transition-[background-color,border-color,box-shadow,color,transform] duration-150 ease-out hover:duration-0 active:scale-[0.98] hermes-button-size-m gap-2`;
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
                                {lnk.label}
                              </span>
                              <ArrowRightIcon className="size-4 shrink-0" />
                              <span aria-hidden="true" className="hermes-button-hover-border" />
                            </a>
                          );
                        })}
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
                <div className="hw-feature-panel bg-hermes-paper text-[var(--hw-teams-ink)] relative z-20 w-full overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                  <ProjectMarkdownExplorer project={project} />

                  <section
                    aria-label="Project Navigation"
                    className="bg-hermes-paper hw-project-explore-section text-[var(--hw-teams-ink)]"
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
                          className="inline-flex items-center gap-1.5 hw-mono text-xs uppercase tracking-[0.08em] text-[var(--hermes-primary)] underline underline-offset-4"
                        >
                          <span>All 6 Systems on Home</span>
                          <ArrowRightIcon className="size-3.5 shrink-0" />
                        </Link>
                      </div>

                      <div className="hw-project-pager-grid">
                        <Link href={`/projects/${prev.slug}`} className="hw-project-pager-card">
                          <span className="hw-project-pager-kicker inline-flex items-center gap-1.5 hw-mono text-[11px] uppercase tracking-[0.1em]">
                            <ArrowLeftIcon className="size-3.5 shrink-0" />
                            <span>Previous Project · {prev.order}</span>
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
                          <span className="hw-project-pager-sub text-xs">{prev.indexLabel}</span>
                        </Link>

                        <Link
                          href={`/projects/${next.slug}`}
                          className="hw-project-pager-card text-right items-end"
                        >
                          <span className="hw-project-pager-kicker inline-flex items-center gap-1.5 hw-mono text-[11px] uppercase tracking-[0.1em]">
                            <span>Next Project · {next.order}</span>
                            <ArrowRightIcon className="size-3.5 shrink-0" />
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
                          <span className="hw-project-pager-sub text-xs">{next.indexLabel}</span>
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
                              className="hw-project-pill inline-flex items-center gap-1.5 px-3 py-1.5 hw-mono text-xs uppercase"
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
