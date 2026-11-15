import type { Metadata, Viewport } from "next";
import "./production.css";
import "./globals.css";

const NOUS_CDN =
  "https://web-assets.nousresearch.com/marketing/64ae3d30463049bd9e6f380cda9cd9538a0f4edb";

export const metadata: Metadata = {
  title: "Sameer Gupta | AI Systems, LLMs & Interactive 3D Engineering",
  description:
    "Portfolio of Sameer Gupta (NSUT Delhi '28) - creator of ChadGPT 250M SLM on Hugging Face, AeroRoute, NEXA (SIH2026 DRDO LiDAR), VigilAI, Amicus AI, BitChord, and interactive Three.js GLSL sculptures.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Sameer Gupta | AI Systems, LLMs & Interactive 3D Engineering",
    description:
      "Custom 250M language models trained from scratch, real-time 2.5D LiDAR & computer vision, AeroRoute mobility engine, BitChord open-source contributions, and interactive Three.js 3D WebGL sculptures.",
    url: "https://sameers-portfolio-eosin.vercel.app/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sameer Gupta | AI & 3D WebGL Portfolio",
    description:
      "Custom 250M LLM (ChadGPT), AeroRoute, NEXA (SIH2026), VigilAI, Amicus AI, BitChord, and Three.js interactive cosmic bust.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0000f2",
};

const THEME_INIT_SCRIPT = `(function(){try{var k='nous-research-theme',p=localStorage.getItem(k)||'system',d=p==='dark'||(p==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var t=d?'dark':'light';document.documentElement.dataset.marketingTheme=t;document.documentElement.style.colorScheme=t;}catch(e){}})();`;

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://sameers-portfolio-eosin.vercel.app/#person",
      name: "Sameer Gupta",
      email: "mailto:sameer870732@gmail.com",
      url: "https://sameers-portfolio-eosin.vercel.app/",
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "Netaji Subhas University of Technology (NSUT), Delhi",
      },
      sameAs: [
        "https://github.com/sam-eer12",
        "https://huggingface.co/sam-eer12",
        "https://www.linkedin.com/in/sameer-gupta-768b28312",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://huggingface.co/sam-eer12/chadGPT#software",
      name: "ChadGPT - 250M AI LLM",
      applicationCategory: "AIApplication",
      author: { "@id": "https://sameers-portfolio-eosin.vercel.app/#person" },
      url: "https://huggingface.co/sam-eer12/chadGPT",
      description:
        "249,832,448-parameter decoder-only small language model built from scratch with GQA, RoPE, 4k Position Interpolation, and ChatML SFT.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://web-assets.nousresearch.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://web-assets.nousresearch.com" />
        <link
          rel="preload"
          href={`${NOUS_CDN}/font/Rules/RulesVariable.woff2`}
          as="font"
          crossOrigin=""
          type="font/woff2"
        />
        <link
          rel="preload"
          href={`${NOUS_CDN}/font/Rules/RulesGothicCnd-Light.woff2`}
          as="font"
          crossOrigin=""
          type="font/woff2"
        />
        <link
          rel="preload"
          href={`${NOUS_CDN}/font/Rules/RulesGothicCmp-Medium.woff2`}
          as="font"
          crossOrigin=""
          type="font/woff2"
        />
        <link
          rel="preload"
          href={`${NOUS_CDN}/font/AeonikFonoProTRIAL/AeonikFonoProTRIAL-Regular.woff2`}
          as="font"
          crossOrigin=""
          type="font/woff2"
        />
        <link rel="preload" href="/assets/cosmic-bust.webp" as="image" fetchPriority="high" />
        <link
          rel="preload"
          href={`${NOUS_CDN}/assets/hermes-landing/teams/hermes-wing.svg`}
          as="image"
        />
        <link rel="preload" href={`${NOUS_CDN}/assets/hermes-agent/desktop.svg`} as="image" />
        <link rel="preload" href={`${NOUS_CDN}/assets/hermes-agent/features.svg`} as="image" />
        <link rel="preload" href={`${NOUS_CDN}/assets/hermes-agent/globe.svg`} as="image" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html{background:var(--hermes-primary,#0000f2);overflow-x:clip}
              .hermes-web{background:var(--hermes-primary,#0000f2);color:var(--hermes-white,#f2f2f2);min-height:100dvh}
              .hermes-web.hw-teams-page{background:var(--hermes-blue-dark-20,#0000c2)}
              html[data-marketing-theme=dark],html[data-marketing-theme=dark] .hermes-web.hw-teams-page{background:var(--marketing-dark-back,#19192f)}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}
