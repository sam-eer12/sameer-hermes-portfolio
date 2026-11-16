import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./production.css";
import "./globals.css";

const NOUS_CDN =
  "https://web-assets.nousresearch.com/marketing/64ae3d30463049bd9e6f380cda9cd9538a0f4edb";

const SITE_URL = "https://sameerg.vercel.app";
const SITE_TITLE = "Sameer Gupta | AI, Computer Vision & Fullstack Engineer";
const SITE_DESCRIPTION =
  "Portfolio of Sameer Gupta (NSUT Delhi). Creator of the ChadGPT 250M language model, NEXA DRDO 2.5D LiDAR perception (SIH 2026), AeroRoute, VigilAI, and BitChord.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Sameer Gupta",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Sameer Gupta Portfolio",
  keywords: [
    "Sameer Gupta",
    "Sameer Gupta portfolio",
    "Sameer Gupta NSUT",
    "Sameer Gupta NSUT Delhi",
    "sam-eer12",
    "sameer870732",
    "ChadGPT 250M",
    "ChadGPT SLM",
    "ProjectSLM PyTorch",
    "NEXA SIH2026 DRDO LiDAR",
    "AeroRoute",
    "VigilAI surveillance YOLOv11",
    "Amicus AI",
    "BitChord contributor",
    "GirlScript Summer of Code Sameer Gupta",
    "Google Gemini Student Ambassador NSUT",
    "AI engineer India",
    "Machine learning portfolio Next.js Three.js",
    "Custom language model from scratch PyTorch",
  ],
  authors: [{ name: "Sameer Gupta", url: SITE_URL }],
  creator: "Sameer Gupta",
  publisher: "Sameer Gupta",
  category: "Technology",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Sameer Gupta",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-thumbnail.jpg",
        width: 1024,
        height: 573,
        alt: "Sameer Gupta Portfolio - Classical Marble Bust with Cosmic Ring",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-thumbnail.jpg",
        width: 1024,
        height: 573,
        alt: "Sameer Gupta Portfolio - Classical Marble Bust with Cosmic Ring",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Sameer Gupta",
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-thumbnail.jpg`,
        width: 1024,
        height: 573,
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Sameer Gupta",
      jobTitle: "AI & Fullstack Engineer",
      email: "mailto:sameer870732@gmail.com",
      url: SITE_URL,
      image: `${SITE_URL}/og-thumbnail.jpg`,
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "Netaji Subhas University of Technology (NSUT), Delhi",
      },
      knowsAbout: [
        "Small Language Models",
        "PyTorch",
        "Computer Vision",
        "YOLOv11",
        "LiDAR Perception",
        "Next.js",
        "Three.js",
        "GLSL Shaders",
      ],
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
      author: { "@id": `${SITE_URL}/#person` },
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
        <Analytics />
      </body>
    </html>
  );
}
