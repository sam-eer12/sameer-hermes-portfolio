import aerorouteMd from "../descriptions/aeroroute.md";
import amicusAiMd from "../descriptions/amicus-ai.md";
import bitchordMd from "../descriptions/bitchord.md";
import chadgptMd from "../descriptions/chadgpt.md";
import nexaMd from "../descriptions/nexa.md";
import vigilaiMd from "../descriptions/vigilai.md";

export interface ProjectMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export interface ProjectData {
  slug: "chadgpt" | "aeroroute" | "vigilai" | "amicus-ai" | "nexa" | "bitchord";
  order: string;
  indexLabel: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  artClass: string;
  image: string;
  thumbnail: string;
  tags: string[];
  status: string;
  timeline: string;
  role: string;
  cliCommand: string;
  metrics: ProjectMetric[];
  links: ProjectLink[];
  markdown: string;
}

export const PROJECTS: ProjectData[] = [
  {
    slug: "chadgpt",
    order: "01",
    indexLabel: "Language Model",
    title: "ChadGPT - 250M AI LLM",
    subtitle: "Custom 249.8M-Parameter Decoder Transformer Trained from Scratch in PyTorch",
    description:
      "249.8M-parameter decoder-only SLM trained from scratch with GQA and RoPE, 4k context extension via Position Interpolation, ChatML SFT, and 42.55% zero-shot ARC-Easy.",
    href: "https://huggingface.co/sam-eer12/chadGPT",
    primaryLabel: "Hugging Face",
    secondaryHref: "https://github.com/sam-eer12/projectSLM",
    secondaryLabel: "GitHub Repo",
    artClass: "landing-feature-art--feature-connect",
    image: "/assets/library/feature-1.webp",
    thumbnail: "/assets/library/project-chadgpt.webp",
    tags: [
      "PyTorch",
      "Grouped Query Attention",
      "RoPE + Position Interpolation",
      "ChatML SFT",
      "HF Accelerate",
      "Safetensors",
    ],
    status: "Published Open Weights (FP32 Safetensors)",
    timeline: "2 Months End-to-End · 2x NVIDIA T4",
    role: "Sole Author & ML Researcher",
    cliCommand: "hf download sam-eer12/chadGPT --local-dir chadGPT && python chadGPT/inference.py",
    metrics: [
      { label: "Parameters", value: "249.8M", detail: "249,832,448 Trainable Weights" },
      { label: "Context", value: "4,096", detail: "Extended via PI 0.25x Scaling" },
      { label: "ARC-Easy", value: "42.55%", detail: "Zero-Shot (2,376 Questions)" },
      { label: "Attention", value: "16Q / 4KV", detail: "18 Blocks · 4x KV Memory Cut" },
    ],
    links: [
      {
        label: "Hugging Face Weights",
        href: "https://huggingface.co/sam-eer12/chadGPT",
        external: true,
        variant: "primary",
      },
      {
        label: "Project SLM Source",
        href: "https://github.com/sam-eer12/projectSLM",
        external: true,
        variant: "secondary",
      },
      {
        label: "Launch in Colab",
        href: "https://huggingface.co/sam-eer12/chadGPT/colab",
        external: true,
        variant: "outline",
      },
      {
        label: "Launch in Kaggle",
        href: "https://huggingface.co/sam-eer12/chadGPT/kaggle",
        external: true,
        variant: "outline",
      },
    ],
    markdown: chadgptMd,
  },
  {
    slug: "aeroroute",
    order: "02",
    indexLabel: "Route Optimization",
    title: "AeroRoute",
    subtitle: "Exposure-Aware Mobility & Air-Quality Route Comparison Platform on AWS",
    description:
      "Aerial and ground mobility route-planning engine optimizing travel time against live congestion and air-pollution telemetry via serverless AWS compute and Amplify.",
    href: "https://aeroroute.d1qrrcsa5p4lz3.amplifyapp.com/",
    primaryLabel: "Live App",
    secondaryHref: "https://github.com/Shubh3155/AWS-DTU",
    secondaryLabel: "GitHub (AWS-DTU)",
    artClass: "landing-feature-art--feature-memory",
    image: "/assets/library/feature-2.webp",
    thumbnail: "/assets/library/project-aeroroute.webp",
    tags: [
      "Next.js + TypeScript",
      "FastAPI + Python 3.12",
      "Mapbox GL JS",
      "Open-Meteo CAMS",
      "Supabase + Firebase",
      "AWS Amplify & Lightsail",
    ],
    status: "Deployed Prototype (Amplify + Mumbai Lightsail VM)",
    timeline: "2026 · AWS-DTU Team Build",
    role: "Fullstack, Routing API & Cloud Architecture",
    cliCommand: "git clone https://github.com/Shubh3155/AWS-DTU.git && cd AWS-DTU",
    metrics: [
      { label: "Exposure Unit", value: "PM2.5", detail: "ug*min/m3 Integrated Over Route" },
      { label: "Sampling Step", value: "100m", detail: "Max Segment Grid (<=64 Batch)" },
      { label: "Live Telemetry", value: "CAMS", detail: "~45 km Grid + OpenAQ Replay" },
      { label: "AWS Infra", value: "Amplify", detail: "+ Lightsail Mumbai Docker VM" },
    ],
    links: [
      {
        label: "Open Live App",
        href: "https://aeroroute.d1qrrcsa5p4lz3.amplifyapp.com/",
        external: true,
        variant: "primary",
      },
      {
        label: "Shubh3155/AWS-DTU Repo",
        href: "https://github.com/Shubh3155/AWS-DTU",
        external: true,
        variant: "secondary",
      },
      {
        label: "API Contract Docs",
        href: "https://github.com/Shubh3155/AWS-DTU/blob/main/documentations/API_CONTRACT.md",
        external: true,
        variant: "outline",
      },
      {
        label: "Live Air Quality Spec",
        href: "https://github.com/Shubh3155/AWS-DTU/blob/main/documentations/LIVE_AIR_QUALITY.md",
        external: true,
        variant: "outline",
      },
    ],
    markdown: aerorouteMd,
  },
  {
    slug: "vigilai",
    order: "03",
    indexLabel: "Computer Vision",
    title: "VigilAI Surveillance",
    subtitle: "Multi-Threaded YOLOv11 Real-Time Anomaly & Hazard Surveillance System",
    description:
      "Web-based AI surveillance platform achieving 94% accuracy with live video stream processing to detect anomalies and misconduct via YOLOv11, PyTorch, OpenCV, Flask, and React.",
    href: "https://github.com/sam-eer12/VigilAI-survillance-project",
    primaryLabel: "GitHub Repo",
    artClass: "landing-feature-art--feature-automation",
    image: "/assets/library/feature-3.webp",
    thumbnail: "/assets/library/project-vigilai.webp",
    tags: [
      "YOLOv11 (Ultralytics)",
      "PyTorch & CUDA",
      "OpenCV MJPEG",
      "Flask REST API",
      "React + Vite + TypeScript",
      "Shadcn UI",
    ],
    status: "Open-Source Fullstack CV System",
    timeline: "2025 · Hackathon & Research Build",
    role: "CV Pipeline, Flask Backend & React UI Engineer",
    cliCommand: "git clone https://github.com/sam-eer12/VigilAI-survillance-project.git && python flask_api.py",
    metrics: [
      { label: "Accuracy", value: "94%", detail: "mAP50 Multi-Class Detection" },
      { label: "Classes", value: "8 Labels", detail: "Safety Gear, Fire, Smoke, Violence" },
      { label: "Capture Loop", value: "60 FPS", detail: "Decoupled Capture + Inference Threads" },
      { label: "Variants", value: "n to x", detail: "YOLOv11n (1.2ms) to x (12.3ms)" },
    ],
    links: [
      {
        label: "GitHub Repository",
        href: "https://github.com/sam-eer12/VigilAI-survillance-project",
        external: true,
        variant: "primary",
      },
      {
        label: "Flask Backend API",
        href: "https://github.com/sam-eer12/VigilAI-survillance-project/blob/main/flask_api.py",
        external: true,
        variant: "secondary",
      },
      {
        label: "Core YOLOv11 Engine",
        href: "https://github.com/sam-eer12/VigilAI-survillance-project/blob/main/vigilai.py",
        external: true,
        variant: "outline",
      },
    ],
    markdown: vigilaiMd,
  },
  {
    slug: "amicus-ai",
    order: "04",
    indexLabel: "Legal Tech",
    title: "Amicus AI",
    subtitle: "Jurisdiction-Aware Legal Counsel, Zero-Retention Ghost Vault & Contract Forge",
    description:
      "Fullstack legal advisor assistant offering location-aware legal guidance, case analysis, fraud detection, and document generation using Next.js, Gemini, MongoDB, and NodeMailer.",
    href: "https://amicusai.vercel.app/",
    primaryLabel: "Live App",
    secondaryHref: "https://github.com/sam-eer12/gemini-hackahton",
    secondaryLabel: "GitHub Repo",
    artClass: "landing-feature-art--feature-delegate",
    image: "/assets/library/feature-4.webp",
    thumbnail: "/assets/library/project-amicus-ai.webp",
    tags: [
      "Next.js 16 (App Router)",
      "Google Gemini AI",
      "MongoDB + Mongoose",
      "JWT + OTP Verification",
      "Framer Motion",
      "html2pdf.js",
    ],
    status: "Live Production Web App (Vercel)",
    timeline: "2025 · Gemini Hackathon Build",
    role: "Fullstack & AI Systems Architect",
    cliCommand: "git clone https://github.com/sam-eer12/gemini-hackahton.git && npm run dev",
    metrics: [
      { label: "Core Modules", value: "3 Engines", detail: "Counsel, Ghost Vault, Contract Forge" },
      { label: "Vault Retention", value: "0 Bytes", detail: "Immediate Post-Analysis Deletion" },
      { label: "Auth Flow", value: "JWT+OTP", detail: "bcrypt Hashing + Nodemailer OTP" },
      { label: "Export Engine", value: "PDF", detail: "Client-Side Contract Generation" },
    ],
    links: [
      {
        label: "Open Live App",
        href: "https://amicusai.vercel.app/",
        external: true,
        variant: "primary",
      },
      {
        label: "GitHub Repository",
        href: "https://github.com/sam-eer12/gemini-hackahton",
        external: true,
        variant: "secondary",
      },
    ],
    markdown: amicusAiMd,
  },
  {
    slug: "nexa",
    order: "05",
    indexLabel: "SIH2026 · DRDO LiDAR",
    title: "NEXA - 2.5D LiDAR Mapping",
    subtitle: "Adaptive Variable-Resolution 2.5D Polar LiDAR Perception for Autonomous Vehicles",
    description:
      "Smart India Hackathon 2026 (DRDO / iDEX PS 26053) autonomous perception system by Team KANVSS processing 64-beam 1.2M pts/sec LiDAR at 10 Hz for adaptive 2.5D obstacle mapping.",
    href: "https://nexa-drdo.duckdns.org/",
    primaryLabel: "Live Project",
    secondaryHref: "https://github.com/sam-eer12/sih2026",
    secondaryLabel: "GitHub (sih2026)",
    artClass: "landing-feature-art--feature-search",
    image: "/assets/library/feature-5.webp",
    thumbnail: "/assets/library/project-nexa.webp",
    tags: [
      "DRDO / iDEX PS 26053",
      "ONNX Runtime (CPU)",
      "Foveated Polar Grid",
      "FastAPI Binary WS",
      "Three.js InstancedMesh",
      "AWS EC2 Graviton + Caddy",
    ],
    status: "SIH 2026 Team KANVSS · Deployed on AWS",
    timeline: "2026 · Smart India Hackathon (DRDO)",
    role: "Perception Pipeline, Binary WS & 3D Viewer Engineer",
    cliCommand: "git clone https://github.com/sam-eer12/sih2026.git && make test && make bench",
    metrics: [
      { label: "Cell Reduction", value: "22.67x", detail: "705,771 vs 16M Dense Grid" },
      { label: "Conservation", value: "100.0%", detail: "Closed-Form O(1) offset[k] + j" },
      { label: "Median Latency", value: "142.2ms", detail: "CPU-Only (No CUDA Required)" },
      { label: "False Positives", value: "0", detail: "S1 Flat Road Control · 382 Tests" },
    ],
    links: [
      {
        label: "Open Live Demo",
        href: "https://nexa-drdo.duckdns.org/",
        external: true,
        variant: "primary",
      },
      {
        label: "GitHub (sih2026)",
        href: "https://github.com/sam-eer12/sih2026",
        external: true,
        variant: "secondary",
      },
      {
        label: "Benchmark Report",
        href: "https://github.com/sam-eer12/sih2026/blob/main/docs/RESULTS.md",
        external: true,
        variant: "outline",
      },
    ],
    markdown: nexaMd,
  },
  {
    slug: "bitchord",
    order: "06",
    indexLabel: "Open Source",
    title: "BitChord",
    subtitle: "Apple MusicKit Integration, Multi-Provider Playback Routing & Automix Headroom Fix",
    description:
      "Kotlin YouTube Music client contribution implementing Apple Music integration (#1222), multi-provider routing architecture, and automix headroom fixes for crisp playback.",
    href: "https://github.com/kushagrasinghx/BitChord/pull/1414",
    primaryLabel: "Contribution PR #1414",
    secondaryHref: "https://github.com/sam-eer12/BitChord",
    secondaryLabel: "Fork Repo",
    artClass: "landing-feature-art--feature-sandbox",
    image: "/assets/library/feature-6.webp",
    thumbnail: "/assets/library/project-bitchord.webp",
    tags: [
      "Kotlin Multiplatform",
      "Go Backend (ES256 JWT)",
      "MusicKit Android SDK",
      "Provider Routing",
      "ISRC Matching + LRU",
      "Open Source PR #1414",
    ],
    status: "8-Commit Feature PR (#1414 for Issue #1222)",
    timeline: "2025 - 2026 · GSSoC & Open Source",
    role: "Open Source Systems Contributor",
    cliCommand: "git clone https://github.com/sam-eer12/BitChord.git && ./gradlew :shared:jvmTest",
    metrics: [
      { label: "Scope", value: "8 Commits", detail: "Backend Go + Shared KMP + Android App" },
      { label: "Token Signing", value: "ES256", detail: "Go Server P-256 Minting (30/min IP)" },
      { label: "Catalog Match", value: "ISRC+LRU", detail: "Storefront-Scoped Persistent Cache" },
      { label: "Audio Engine", value: "Headroom", detail: "Automix Clipping Prevention Fix" },
    ],
    links: [
      {
        label: "View PR #1414",
        href: "https://github.com/kushagrasinghx/BitChord/pull/1414",
        external: true,
        variant: "primary",
      },
      {
        label: "Fork Repository",
        href: "https://github.com/sam-eer12/BitChord",
        external: true,
        variant: "secondary",
      },
      {
        label: "Tracked Issue #1222",
        href: "https://github.com/kushagrasinghx/BitChord/issues/1222",
        external: true,
        variant: "outline",
      },
    ],
    markdown: bitchordMd,
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): {
  prev: ProjectData;
  next: ProjectData;
} {
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const safeIdx = idx === -1 ? 0 : idx;
  const prev = PROJECTS[(safeIdx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(safeIdx + 1) % PROJECTS.length];
  return { prev, next };
}
