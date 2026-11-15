import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = path.resolve(process.cwd());
const ASSETS_DIR = path.join(ROOT, "public", "assets");
const LIB_DIR = path.join(ASSETS_DIR, "library");
const STICKERS_DIR = path.join(ASSETS_DIR, "stickers");

const NOUS_CDN =
  "https://web-assets.nousresearch.com/marketing/64ae3d30463049bd9e6f380cda9cd9538a0f4edb";

fs.mkdirSync(ASSETS_DIR, { recursive: true });
fs.mkdirSync(LIB_DIR, { recursive: true });
fs.mkdirSync(STICKERS_DIR, { recursive: true });

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function createFrameOverlaySvg({ width, height, tag, title, subtitle, accent = "#0000f2", dark = false }) {
  const bgBadge = dark ? "#07071a" : "#f8f8f6";
  const fgBadge = dark ? "#f2f2f2" : "#0000f2";
  const borderCol = dark ? "#5f72ff" : "#0000f2";
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect x="6" y="6" width="${width - 12}" height="${height - 12}" fill="none" stroke="${borderCol}" stroke-width="6"/>
      <rect x="6" y="6" width="${width - 12}" height="58" fill="${accent}"/>
      <text x="24" y="42" fill="#ffffff" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20" font-weight="700" letter-spacing="2">${escapeXml(tag)}</text>
      <rect x="6" y="${height - 96}" width="${width - 12}" height="90" fill="${bgBadge}"/>
      <line x1="6" y1="${height - 96}" x2="${width - 6}" y2="${height - 96}" stroke="${borderCol}" stroke-width="4"/>
      <text x="24" y="${height - 56}" fill="${fgBadge}" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700">${escapeXml(title)}</text>
      <text x="24" y="${height - 26}" fill="${fgBadge}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="16" opacity="0.82">${escapeXml(subtitle)}</text>
    </svg>
  `);
}

function createArchitecturePlateSvg({ width, height, tag, title, lines, accent = "#0000f2", bg = "#07071a", fg = "#e6f9ff" }) {
  const rows = lines
    .map(
      (line, idx) =>
        `<text x="36" y="${210 + idx * 46}" fill="${fg}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22" opacity="0.9">${escapeXml(line)}</text>`
    )
    .join("");
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="${bg}"/>
      <g opacity="0.16" stroke="#5f72ff" stroke-width="1">
        ${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${height}"/>`).join("")}
        ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${i * 60}" x2="${width}" y2="${i * 60}"/>`).join("")}
      </g>
      <rect x="14" y="14" width="${width - 28}" height="${height - 28}" fill="none" stroke="${accent}" stroke-width="6"/>
      <rect x="14" y="14" width="${width - 28}" height="68" fill="${accent}"/>
      <text x="36" y="56" fill="#ffffff" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22" font-weight="700" letter-spacing="2">${escapeXml(tag)}</text>
      <text x="36" y="148" fill="${fg}" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="700">${escapeXml(title)}</text>
      <line x1="36" y1="168" x2="${width - 36}" y2="168" stroke="#f878cf" stroke-width="3"/>
      ${rows}
      <circle cx="${width - 96}" cy="${height - 96}" r="42" fill="none" stroke="#f878cf" stroke-width="3" stroke-dasharray="8 6"/>
      <circle cx="${width - 96}" cy="${height - 96}" r="18" fill="${accent}"/>
    </svg>
  `);
}

async function main() {
  // 1. Convert public/assets/cosmic-bust.jpg -> public/assets/cosmic-bust.webp
  const bustJpg = path.join(ASSETS_DIR, "cosmic-bust.jpg");
  const bustWebp = path.join(ASSETS_DIR, "cosmic-bust.webp");
  let bustBuffer;
  if (fs.existsSync(bustJpg)) {
    bustBuffer = fs.readFileSync(bustJpg);
    await sharp(bustBuffer).webp({ quality: 92 }).toFile(bustWebp);
    console.log("Converted cosmic-bust.jpg -> cosmic-bust.webp");
  } else if (fs.existsSync(bustWebp)) {
    bustBuffer = fs.readFileSync(bustWebp);
    console.log("Using existing cosmic-bust.webp");
  } else {
    throw new Error("Neither cosmic-bust.jpg nor cosmic-bust.webp found!");
  }

  // Verify bustWebp before deleting bustJpg
  const bustStat = fs.statSync(bustWebp);
  if (bustStat.size < 10000) {
    throw new Error(`cosmic-bust.webp is suspiciously small: ${bustStat.size} bytes`);
  }
  if (fs.existsSync(bustJpg)) {
    fs.unlinkSync(bustJpg);
    console.log("Removed legacy cosmic-bust.jpg");
  }

  // Save library/hero.webp from cosmic-bust as well
  await sharp(bustBuffer).webp({ quality: 90 }).toFile(path.join(LIB_DIR, "hero.webp"));

  // 2. Download Hermes assets and convert/store as local .webp files in public/assets/library/
  const featureSources = [
    { out: "feature-1.webp", remote: `${NOUS_CDN}/assets/hermes-agent/feature-connect.webp` },
    { out: "feature-2.webp", remote: `${NOUS_CDN}/assets/hermes-agent/feature-memory.webp` },
    { out: "feature-3.webp", remote: `${NOUS_CDN}/assets/hermes-agent/feature-automation.webp` },
    { out: "feature-4.webp", remote: `${NOUS_CDN}/assets/hermes-agent/feature-delegate.webp` },
    { out: "feature-5.webp", remote: `${NOUS_CDN}/assets/hermes-agent/feature-search.webp` },
    { out: "feature-6.webp", remote: `${NOUS_CDN}/assets/hermes-agent/feature-sandbox.webp` },
  ];

  const featureBuffers = [];
  for (const item of featureSources) {
    const outPath = path.join(LIB_DIR, item.out);
    let buf;
    try {
      buf = await fetchBuffer(item.remote);
      await sharp(buf).webp({ quality: 88 }).toFile(outPath);
      console.log(`Saved library/${item.out}`);
    } catch (err) {
      console.warn(`Fallback for ${item.out}: ${err.message}`);
      buf = await sharp(
        createArchitecturePlateSvg({
          width: 960,
          height: 640,
          tag: item.out.toUpperCase(),
          title: "HERMES // PORTFOLIO PLATE",
          lines: ["Local WebP fallback plate"],
        })
      )
        .webp({ quality: 88 })
        .toBuffer();
      fs.writeFileSync(outPath, buf);
    }
    featureBuffers.push(fs.readFileSync(outPath));
  }

  // platform-art.webp & footer.webp
  let platformBuf;
  try {
    platformBuf = await fetchBuffer(`${NOUS_CDN}/assets/hermes-agent/platform-art.webp`);
    await sharp(platformBuf).webp({ quality: 88 }).toFile(path.join(LIB_DIR, "platform-art.webp"));
    console.log("Saved library/platform-art.webp");
  } catch (err) {
    console.warn("Fallback platform-art.webp:", err.message);
    platformBuf = featureBuffers[0];
    fs.copyFileSync(path.join(LIB_DIR, "feature-1.webp"), path.join(LIB_DIR, "platform-art.webp"));
  }

  try {
    const footerBuf = await fetchBuffer(`${NOUS_CDN}/assets/hermes-agent/footer.webp`);
    await sharp(footerBuf).webp({ quality: 88 }).toFile(path.join(LIB_DIR, "footer.webp"));
    console.log("Saved library/footer.webp");
  } catch (err) {
    console.warn("Fallback footer.webp:", err.message);
    await sharp(bustBuffer)
      .tint({ r: 16, g: 32, b: 230 })
      .webp({ quality: 88 })
      .toFile(path.join(LIB_DIR, "footer.webp"));
  }

  // portal-art.webp & research-art.webp (SVG -> WebP via sharp or fallback raster)
  let portalBuf;
  try {
    const portalSvg = await fetchBuffer(`${NOUS_CDN}/assets/hermes-agent/portal-art.svg`);
    portalBuf = await sharp(portalSvg, { density: 144 })
      .resize(1310, 620, { fit: "cover" })
      .webp({ quality: 90 })
      .toBuffer();
    fs.writeFileSync(path.join(LIB_DIR, "portal-art.webp"), portalBuf);
    console.log("Converted portal-art.svg -> library/portal-art.webp");
  } catch (err) {
    console.warn("Fallback portal-art.webp:", err.message);
    portalBuf = await sharp(
      createArchitecturePlateSvg({
        width: 1310,
        height: 620,
        tag: "TECHNICAL ARSENAL // STACK",
        title: "PYTORCH · NEXT.JS · THREE.JS",
        lines: ["Custom LLMs · Computer Vision · Cloud Native"],
        bg: "#0000f2",
        accent: "#19192f",
      })
    )
      .webp({ quality: 90 })
      .toBuffer();
    fs.writeFileSync(path.join(LIB_DIR, "portal-art.webp"), portalBuf);
  }

  // research-art.webp (from NOUS_CDN research-art or platform-art composite)
  try {
    const resSvg = await fetchBuffer(`${NOUS_CDN}/assets/hermes-agent/research-art.svg`).catch(() => null);
    if (resSvg) {
      await sharp(resSvg, { density: 144 })
        .resize(960, 640, { fit: "cover" })
        .webp({ quality: 88 })
        .toFile(path.join(LIB_DIR, "research-art.webp"));
    } else {
      await sharp(platformBuf)
        .resize(960, 640, { fit: "cover" })
        .webp({ quality: 88 })
        .toFile(path.join(LIB_DIR, "research-art.webp"));
    }
    console.log("Saved library/research-art.webp");
  } catch (err) {
    console.warn("Fallback research-art.webp:", err.message);
    fs.copyFileSync(path.join(LIB_DIR, "platform-art.webp"), path.join(LIB_DIR, "research-art.webp"));
  }

  // 3. Build 12 high-impact WebP sticker cards (sticker-01.webp .. sticker-12.webp)
  const bustMeta = await sharp(bustBuffer).metadata();
  const bw = bustMeta.width || 1024;
  const bh = bustMeta.height || 576;

  // Sticker 01..04: Cosmic bust crops & shader-toned plates (560x560 square cards)
  const bustStickers = [
    {
      file: "sticker-01.webp",
      extract: {
        left: Math.round(bw * 0.22),
        top: 0,
        width: Math.min(bw - Math.round(bw * 0.22), Math.round(bh * 0.96)),
        height: Math.round(bh * 0.96),
      },
      tint: { r: 220, g: 235, b: 255 },
      overlay: { tag: "01 // THREE.JS", title: "COSMIC BUST", subtitle: "GLSL DISPLACEMENT MESH", dark: true, accent: "#0000f2" },
    },
    {
      file: "sticker-02.webp",
      extract: {
        left: Math.round(bw * 0.14),
        top: Math.round(bh * 0.16),
        width: Math.min(bw - Math.round(bw * 0.14), Math.round(bh * 0.72)),
        height: Math.round(bh * 0.72),
      },
      tint: { r: 140, g: 175, b: 255 },
      overlay: { tag: "02 // SHADER", title: "HALFTONE SCAN", subtitle: "4,600 RING PARTICLES", dark: true, accent: "#3f53ff" },
    },
    {
      file: "sticker-03.webp",
      extract: {
        left: Math.round(bw * 0.28),
        top: Math.round(bh * 0.08),
        width: Math.min(bw - Math.round(bw * 0.28), Math.round(bh * 0.86)),
        height: Math.round(bh * 0.86),
      },
      tint: { r: 255, g: 210, b: 140 },
      overlay: { tag: "03 // KINTSUGI", title: "GOLD SEAMS", subtitle: "PROCEDURAL MARBLE RELIEF", dark: true, accent: "#b8741e" },
    },
    {
      file: "sticker-04.webp",
      extract: {
        left: Math.round(bw * 0.2),
        top: Math.round(bh * 0.24),
        width: Math.min(bw - Math.round(bw * 0.2), Math.round(bh * 0.74)),
        height: Math.round(bh * 0.74),
      },
      negate: true,
      overlay: { tag: "04 // INVERTED", title: "EYE HORIZON", subtitle: "ORBIT + SURGE PULSE", dark: false, accent: "#0000f2" },
    },
  ];

  for (const st of bustStickers) {
    let img = sharp(bustBuffer).extract(st.extract).resize(560, 560, { fit: "cover" });
    if (st.negate) {
      img = img.negate({ alpha: false });
    } else if (st.tint) {
      img = img.tint(st.tint);
    }
    const base = await img.toBuffer();
    const overlay = createFrameOverlaySvg({ width: 560, height: 560, ...st.overlay });
    await sharp(base)
      .composite([{ input: overlay }])
      .webp({ quality: 88 })
      .toFile(path.join(STICKERS_DIR, st.file));
  }

  // Sticker 05..10: Editorial framed project & model cards from feature-1..feature-6
  const projectCards = [
    { file: "sticker-05.webp", tag: "05 // PYTORCH SLM", title: "CHADGPT 250M", subtitle: "GQA · ROPE · 42.55% ARC-EASY", accent: "#0000f2" },
    { file: "sticker-06.webp", tag: "06 // ROUTE ENGINE", title: "AEROROUTE", subtitle: "AWS AMPLIFY · LIVE MOBILITY OPT", accent: "#0000c2" },
    { file: "sticker-07.webp", tag: "07 // COMPUTER VISION", title: "VIGILAI", subtitle: "94% ANOMALY ACCURACY · YOLOV11", accent: "#0000f2" },
    { file: "sticker-08.webp", tag: "08 // LEGAL AI", title: "AMICUS AI", subtitle: "NEXT.JS + GEMINI + MONGODB", accent: "#19192f" },
    { file: "sticker-09.webp", tag: "09 // SIH 2026 DRDO", title: "NEXA LIDAR", subtitle: "2.5D DYNAMIC PERCEPTION SYSTEM", accent: "#0000f2" },
    { file: "sticker-10.webp", tag: "10 // OPEN SOURCE", title: "BITCHORD PR #1414", subtitle: "APPLE MUSIC · PROVIDER ROUTING", accent: "#0000c2" },
  ];

  for (let i = 0; i < projectCards.length; i++) {
    const card = projectCards[i];
    const base = await sharp(featureBuffers[i])
      .resize(560, 560, { fit: "cover" })
      .toBuffer();
    const overlay = createFrameOverlaySvg({ width: 560, height: 560, ...card, dark: false });
    await sharp(base)
      .composite([{ input: overlay }])
      .webp({ quality: 88 })
      .toFile(path.join(STICKERS_DIR, card.file));
  }

  // Sticker 11..12: AI architecture / NSUT dossier plates
  const plate11 = await sharp(portalBuf)
    .resize(560, 560, { fit: "cover" })
    .composite([
      {
        input: createFrameOverlaySvg({
          width: 560,
          height: 560,
          tag: "11 // NSUT DELHI '28",
          title: "SAMEER GUPTA",
          subtitle: "ICE B.TECH · GEMINI AMBASSADOR",
          dark: true,
          accent: "#0000f2",
        }),
      },
    ])
    .webp({ quality: 88 })
    .toFile(path.join(STICKERS_DIR, "sticker-11.webp"));

  const plate12Svg = createArchitecturePlateSvg({
    width: 560,
    height: 560,
    tag: "12 // STACK TOPOLOGY",
    title: "WEBGL + LLM LAB",
    lines: [
      "> WEIGHTS: huggingface.co/sam-eer12",
      "> SOURCE:  github.com/sam-eer12",
      "> ENGINE:  Three.js + Next.js 15",
      "> STATUS:  PORTFOLIO READY",
    ],
    accent: "#0000f2",
    bg: "#07071a",
  });
  await sharp(plate12Svg).webp({ quality: 88 }).toFile(path.join(STICKERS_DIR, "sticker-12.webp"));

  void plate11;
  console.log("Generated 12 WebP sticker plates in public/assets/stickers/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
