import React from "react";
import { BeFreakyPreloader } from "../components/befreaky-preloader";
import { FilmGrain, HeroParallax, MarketingFrame, MarketingThemeToggle } from "../components/chrome";
import {
  MarketingHeader,
  MarketingNavigationProvider,
  MarketingPaperNav,
} from "../components/navigation";
import {
  ContactSection,
  ExperienceFaqSection,
  HeroSection,
  MarketingFooterReveal,
  PaperFooter,
  ProjectsSection,
  ShowcaseSection,
  SkillsPortalSection,
} from "../components/sections";

export default function PortfolioPage() {
  return (
    <MarketingNavigationProvider>
      <BeFreakyPreloader />
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

              <HeroSection />
              <ShowcaseSection />

              <div className="hw-feature-parallax relative z-30">
                <div className="hw-feature-panel bg-hermes-paper relative z-20 w-full overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                  <ProjectsSection />
                  <ExperienceFaqSection />
                  <SkillsPortalSection />
                  <ContactSection />
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
