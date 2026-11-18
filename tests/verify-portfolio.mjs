import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

test("public WebP image library and 12 preloader stickers are staged with zero legacy jpg/png files", () => {
  const bustPath = path.join(ROOT, "public", "assets", "cosmic-bust.webp");
  assert.ok(fs.existsSync(bustPath), "cosmic-bust.webp must exist in public/assets");
  assert.ok(fs.statSync(bustPath).size > 10000, "cosmic-bust.webp must not be empty");
  assert.ok(!fs.existsSync(path.join(ROOT, "public", "assets", "cosmic-bust.jpg")), "legacy cosmic-bust.jpg must be removed");

  const libFiles = [
    "hero.webp",
    "feature-1.webp",
    "feature-2.webp",
    "feature-3.webp",
    "feature-4.webp",
    "feature-5.webp",
    "feature-6.webp",
    "platform-art.webp",
    "portal-art.webp",
    "research-art.webp",
    "footer.webp",
    "project-chadgpt.webp",
    "project-aeroroute.webp",
    "project-vigilai.webp",
    "project-amicus-ai.webp",
    "project-nexa.webp",
    "project-bitchord.webp",
  ];
  for (const f of libFiles) {
    const p = path.join(ROOT, "public", "assets", "library", f);
    assert.ok(fs.existsSync(p), `Missing library WebP asset: public/assets/library/${f}`);
    assert.ok(fs.statSync(p).size > 5000, `Library WebP asset too small: ${f}`);
  }

  for (let i = 1; i <= 12; i++) {
    const name = `sticker-${String(i).padStart(2, "0")}.webp`;
    const p = path.join(ROOT, "public", "assets", "stickers", name);
    assert.ok(fs.existsSync(p), `Missing preloader sticker WebP: ${name}`);
    assert.ok(fs.statSync(p).size > 5000, `Preloader sticker WebP too small: ${name}`);
  }

  const srcFiles = [
    "src/components/cosmic-bust-3d.tsx",
    "src/components/befreaky-preloader.tsx",
    "src/components/sections.tsx",
    "src/components/navigation.tsx",
    "src/components/markdown-preview.tsx",
    "src/data/projects.ts",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/projects/[slug]/page.tsx",
  ];
  for (const rel of srcFiles) {
    const content = fs.readFileSync(path.join(ROOT, rel), "utf8").replace(/\/og-thumbnail\.jpg/g, "");
    assert.doesNotMatch(content, /\.(jpg|jpeg|png)\b/i, `${rel} must not reference jpg/png raster images`);
  }
  const ogThumbPath = path.join(ROOT, "public", "og-thumbnail.jpg");
  assert.ok(fs.existsSync(ogThumbPath), "public/og-thumbnail.jpg must exist for OpenGraph link previews");
  assert.ok(fs.statSync(ogThumbPath).size > 20000, "public/og-thumbnail.jpg must not be empty");
});

test("BeFreakyPreloader implements twin-square counter and 12 WebP mouse-trail stickers", () => {
  const src = fs.readFileSync(path.join(ROOT, "src", "components", "befreaky-preloader.tsx"), "utf8");
  assert.match(src, /className=.*preloader/);
  assert.match(src, /preloader__square__container/);
  assert.match(src, /preloader__square__left__wrapper/);
  assert.match(src, /preloader__square__right__wrapper/);
  assert.match(src, /preloader__stickers__container/);
  assert.match(src, /preloader__stickers/);
  for (let i = 1; i <= 12; i++) {
    const expected = `/assets/stickers/sticker-${String(i).padStart(2, "0")}.webp`;
    assert.ok(src.includes(expected), `Preloader missing ${expected}`);
  }
  assert.ok(!src.includes("—"), "Preloader copy must not include em-dashes");
  assert.match(src, /__hermesInitialDocChecked/);
  assert.match(src, /hermes-preloader-seen/);
  const navSrc = fs.readFileSync(path.join(ROOT, "src", "components", "navigation.tsx"), "utf8");
  assert.match(navSrc, /useRouter/);
  assert.match(navSrc, /usePathname/);
});

test("Three.js CosmicBust3D component defines GLSL shaders and uses cosmic-bust.webp", () => {
  const src = fs.readFileSync(path.join(ROOT, "src", "components", "cosmic-bust-3d.tsx"), "utf8");
  assert.match(src, /import \* as THREE from ["']three["']/);
  assert.match(src, /BUST_VERTEX_SHADER/);
  assert.match(src, /BUST_FRAGMENT_SHADER/);
  assert.match(src, /RING_PARTICLE_VERTEX/);
  assert.match(src, /\/assets\/cosmic-bust\.webp/);
  assert.match(src, /pointerdown/);
  assert.match(src, /renderer\.dispose\(\)/);
  assert.ok(
    src.includes('"cosmic"') &&
      src.includes('"halftone"') &&
      src.includes('"kintsugi"') &&
      src.includes('"wireframe"'),
    "all 4 shader modes must be implemented"
  );
});

test("Footer reveal stacking order puts main/feature-panel above hw-footer-reveal and keeps spacer inside", () => {
  const pageSrc = fs.readFileSync(path.join(ROOT, "src", "app", "page.tsx"), "utf8");
  const secSrc = fs.readFileSync(path.join(ROOT, "src", "components", "sections.tsx"), "utf8");
  assert.match(pageSrc, /id="hpv2-main"[^>]*className="[^"]*relative z-10/);
  assert.match(pageSrc, /className="hw-feature-parallax[^"]*z-30"/);
  assert.match(secSrc, /className="hw-footer-reveal relative z-0 md:-mt-\[100dvh\]"/);
  assert.match(secSrc, /<\/footer>\s*<div aria-hidden="true" className="pointer-events-none h-dvh max-md:hidden" \/>\s*<\/div>/);
});

test("Portfolio data and external identity links match user profiles without em-dashes", () => {
  const files = [
    path.join(ROOT, "src", "components", "sections.tsx"),
    path.join(ROOT, "src", "components", "navigation.tsx"),
    path.join(ROOT, "src", "components", "befreaky-preloader.tsx"),
    path.join(ROOT, "src", "components", "cosmic-bust-3d.tsx"),
    path.join(ROOT, "src", "components", "markdown-preview.tsx"),
    path.join(ROOT, "src", "data", "projects.ts"),
    path.join(ROOT, "src", "app", "layout.tsx"),
    path.join(ROOT, "src", "app", "projects", "[slug]", "page.tsx"),
  ];
  const combined = files.map((f) => fs.readFileSync(f, "utf8")).join("\n");

  const requiredTokens = [
    "Sameer Gupta",
    "https://github.com/sam-eer12",
    "https://huggingface.co/sam-eer12",
    "https://huggingface.co/sam-eer12/chadGPT",
    "https://aeroroute.d1qrrcsa5p4lz3.amplifyapp.com/",
    "https://github.com/Shubh3155/AWS-DTU",
    "https://nexa-drdo.duckdns.org/",
    "https://github.com/sam-eer12/sih2026",
    "https://github.com/kushagrasinghx/BitChord/pull/1414",
    "https://github.com/sam-eer12/BitChord",
    "AeroRoute",
    "NEXA",
    "BitChord",
    "VigilAI",
    "Amicus AI",
    "NSUT",
    "sameer870732@gmail.com",
    "https://api.web3forms.com/submit",
    "dbb12da2-22b7-4553-839a-efb2b312f97e",
    "/assets/Sameer_Gupta_Resume.pdf",
  ];
  for (const tok of requiredTokens) {
    assert.ok(combined.includes(tok), `Missing required portfolio token: ${tok}`);
  }

  for (const forbidden of [
    "Ocenaus AI",
    "Haryana Roadways",
    "HrRoadways",
    ":Surge Ring:",
    ":Replay Loader:",
    ":{m}:",
    "THREE.JS //",
    "// core stack",
    "The Engineer That Builds With AI",
    "DRAG TO ORBIT",
  ]) {
    assert.ok(!combined.includes(forbidden), `Disallowed legacy or AI-template copy found: ${forbidden}`);
  }

  assert.ok(!combined.includes("—"), "Visible UI copy must not include em-dashes");
});

test("Resume PDF, favicon.svg, Contact form, and download links are wired correctly", () => {
  const resumeAsset = path.join(ROOT, "public", "assets", "Sameer_Gupta_Resume.pdf");
  const resumePublic = path.join(ROOT, "public", "Sameer_Gupta_Resume.pdf");
  assert.ok(fs.existsSync(resumeAsset), "public/assets/Sameer_Gupta_Resume.pdf must exist");
  assert.ok(fs.statSync(resumeAsset).size > 10000, "Resume PDF in public/assets must not be empty");
  assert.ok(fs.existsSync(resumePublic), "public/Sameer_Gupta_Resume.pdf must exist");

  const faviconPublic = path.join(ROOT, "public", "favicon.svg");
  const appIcon = path.join(ROOT, "src", "app", "icon.svg");
  assert.ok(fs.existsSync(faviconPublic), "public/favicon.svg must exist");
  assert.ok(fs.existsSync(appIcon), "src/app/icon.svg must exist");

  const navSrc = fs.readFileSync(path.join(ROOT, "src", "components", "navigation.tsx"), "utf8");
  const downloadMatches = navSrc.match(/download="Sameer_Gupta_Resume\.pdf"/g) || [];
  assert.ok(downloadMatches.length >= 2, "Header name and sticky center logo must download Sameer_Gupta_Resume.pdf");
  assert.match(navSrc, /smoothScrollToHash/);

  const cssSrc = fs.readFileSync(path.join(ROOT, "src", "app", "globals.css"), "utf8");
  assert.match(cssSrc, /scroll-behavior:\s*smooth/);

  const bustSrc = fs.readFileSync(path.join(ROOT, "src", "components", "cosmic-bust-3d.tsx"), "utf8");
  assert.match(bustSrc, /IntersectionObserver/);

  const secSrc = fs.readFileSync(path.join(ROOT, "src", "components", "sections.tsx"), "utf8");
  assert.match(secSrc, /id="contact"/);
  assert.match(secSrc, /name="name"/);
  assert.match(secSrc, /name="email"/);
  assert.match(secSrc, /name="message"/);
  assert.match(secSrc, /id="footer"/);
  assert.equal((secSrc.match(/<CosmicBust3D/g) || []).length, 1, "Only hero CosmicBust3D section should render");
  assert.ok(!secSrc.includes("cosmic-studio-panel"), "Secondary 3D studio frame must be removed");
});

test("Navbar dropdown links render full-width Hermes grid slots nw-subnav-label and nw-subnav-description", () => {
  const navSrc = fs.readFileSync(path.join(ROOT, "src", "components", "navigation.tsx"), "utf8");
  assert.match(navSrc, /className="nw-subnav-link"/);
  assert.match(navSrc, /className="nw-subnav-label"/);
  assert.match(navSrc, /className="nw-subnav-description"/);
  assert.doesNotMatch(navSrc, /data-shop=/);
});

test("Hermes Agent design tokens and production CSS rules are present", () => {
  const prodCss = fs.readFileSync(path.join(ROOT, "src", "app", "production.css"), "utf8");
  assert.ok(prodCss.includes("--hermes-primary"), "production.css must include --hermes-primary");
  assert.ok(prodCss.includes("RulesGothicCnd"), "production.css must include RulesGothicCnd");
  assert.ok(prodCss.includes("AeonikFono"), "production.css must include AeonikFono");
  assert.ok(!prodCss.includes("../media/"), "production.css relative ../media/ URLs must be rewritten");
});

test("Next.js SSR HTML output includes preloader, portfolio markup, Three.js hero slot, and fixed footer structure", () => {
  const htmlPath = path.join(ROOT, ".next", "server", "app", "index.html");
  assert.ok(fs.existsSync(htmlPath), "index.html must exist after next build");
  const html = fs.readFileSync(htmlPath, "utf8");
  assert.match(html, /befreaky-preloader/);
  assert.match(html, /preloader__square__container/);
  assert.match(html, /preloader__stickers/);
  assert.match(html, /I Train Small/);
  assert.match(html, /cosmic-bust-3d/);
  assert.match(html, /hw-feature-parallax/);
  assert.match(html, /hw-footer-reveal/);
  assert.match(html, /ChadGPT - 250M AI LLM/);
  assert.match(html, /Selected Projects/);
  assert.match(html, /Engineering Stack/);
  assert.match(html, /meta name="keywords"[^>]+Sameer Gupta/);
  assert.match(html, /meta property="og:image"[^>]+og-thumbnail\.jpg/);
  assert.match(html, /meta name="twitter:image"[^>]+og-thumbnail\.jpg/);
  assert.match(
    html,
    /meta name="google-site-verification" content="z89_y2w8b2a0dGcpC0S3hy4ObEPHA1A09Ts5T3aHZEU"/
  );

  const sitemapPath = path.join(ROOT, "public", "sitemap.xml");
  assert.ok(fs.existsSync(sitemapPath), "public/sitemap.xml must exist");
  const sitemapXml = fs.readFileSync(sitemapPath, "utf8");
  assert.match(sitemapXml, /<loc>https:\/\/sameerg\.vercel\.app\/<\/loc>/);
  assert.match(sitemapXml, /<image:loc>https:\/\/sameerg\.vercel\.app\/og-thumbnail\.jpg<\/image:loc>/);
  assert.match(sitemapXml, /Sameer_Gupta_Resume\.pdf/);

  const projectSlugs = ["chadgpt", "aeroroute", "vigilai", "amicus-ai", "nexa", "bitchord"];
  for (let i = 0; i < projectSlugs.length; i++) {
    const slug = projectSlugs[i];
    assert.ok(html.includes(`/projects/${slug}`), `Homepage SSR HTML must link to /projects/${slug}`);
    assert.ok(
      html.includes(`/assets/library/feature-${i + 1}.webp`),
      `Homepage SSR HTML must retain original Hermes cover image feature-${i + 1}.webp`
    );
    assert.ok(sitemapXml.includes(`/projects/${slug}`), `sitemap.xml must include /projects/${slug}`);
    assert.ok(
      sitemapXml.includes(`project-${slug}.webp`),
      `sitemap.xml must include project-${slug}.webp image tag`
    );
    const projHtmlPath = path.join(ROOT, ".next", "server", "app", "projects", `${slug}.html`);
    assert.ok(fs.existsSync(projHtmlPath), `Project detail SSR HTML missing for ${slug}`);
    const projHtml = fs.readFileSync(projHtmlPath, "utf8");
    assert.match(projHtml, /hw-project-hero/);
    assert.match(projHtml, /hw-md-toolbar/);
    assert.match(projHtml, /hw-mermaid-card/);
    assert.match(projHtml, /hw-project-explore-section/);
    assert.ok(
      projHtml.includes(`/assets/library/project-${slug}.webp`),
      `Project page ${slug} must render thumbnail project-${slug}.webp`
    );
    assert.match(projHtml, /README\.md/);
  }
  const aeroHtml = fs.readFileSync(
    path.join(ROOT, ".next", "server", "app", "projects", "aeroroute.html"),
    "utf8"
  );
  assert.ok(
    aeroHtml.includes("https://github.com/Shubh3155/AWS-DTU"),
    "AeroRoute project page must reference https://github.com/Shubh3155/AWS-DTU"
  );
});

test("Each project description lives in src/descriptions/*.md with Mermaid diagrams and is imported in projects.ts", () => {
  const projectsSrc = fs.readFileSync(path.join(ROOT, "src", "data", "projects.ts"), "utf8");
  assert.ok(!projectsSrc.includes("```mermaid"), "projects.ts must import .md files instead of embedding inline markdown");

  const projectSlugs = ["chadgpt", "aeroroute", "vigilai", "amicus-ai", "nexa", "bitchord"];
  for (const slug of projectSlugs) {
    assert.ok(
      projectsSrc.includes(`from "../descriptions/${slug}.md"`),
      `projects.ts must import ../descriptions/${slug}.md`
    );
    const mdPath = path.join(ROOT, "src", "descriptions", `${slug}.md`);
    assert.ok(fs.existsSync(mdPath), `Missing markdown description file: src/descriptions/${slug}.md`);
    const mdContent = fs.readFileSync(mdPath, "utf8");
    assert.ok(!mdContent.includes("—"), `src/descriptions/${slug}.md must not contain em-dashes`);
    const mermaidBlocks = mdContent.match(/```mermaid/g) || [];
    assert.ok(
      mermaidBlocks.length >= 2,
      `Expected at least 2 Mermaid charts in src/descriptions/${slug}.md, found ${mermaidBlocks.length}`
    );
  }
});

test("Markdown preview renders inline <code> HTML tags and escaped pipes cleanly inside tables", () => {
  const mdPreviewSrc = fs.readFileSync(
    path.join(ROOT, "src", "components", "markdown-preview.tsx"),
    "utf8"
  );
  assert.match(mdPreviewSrc, /decodeHtmlEntities/);
  assert.match(mdPreviewSrc, /decodePlainMarkdownText/);
  assert.match(mdPreviewSrc, /parseTableRow/);

  const chadHtml = fs.readFileSync(
    path.join(ROOT, ".next", "server", "app", "projects", "chadgpt.html"),
    "utf8"
  );
  const tableMatch = chadHtml.match(/<table class="hw-md-table">[\s\S]*?endoftext[\s\S]*?<\/table>/);
  assert.ok(tableMatch, "ChadGPT SSR HTML must render the ChatML tokenizer table");
  const tokenTableHtml = tableMatch[0];
  assert.ok(
    tokenTableHtml.includes('<code class="hw-md-inline-code">&lt;|endoftext|&gt;</code>'),
    "Tokenizer table must render <|endoftext|> inside .hw-md-inline-code"
  );
  assert.ok(
    tokenTableHtml.includes('<code class="hw-md-inline-code">&lt;|im_start|&gt;</code>'),
    "Tokenizer table must render <|im_start|> inside .hw-md-inline-code"
  );
  assert.ok(
    tokenTableHtml.includes('<code class="hw-md-inline-code">&lt;|im_end|&gt;</code>'),
    "Tokenizer table must render <|im_end|> inside .hw-md-inline-code"
  );
  assert.ok(
    !tokenTableHtml.includes("&lt;code&gt;") && !tokenTableHtml.includes("&#124;"),
    "Tokenizer table cells must not display raw <code> tags or undecoded &#124; entities"
  );
});

