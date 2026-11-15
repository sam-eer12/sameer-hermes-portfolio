"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const THEME_STORAGE_KEY = "nous-research-theme";
const THEME_COOKIE = "nous-marketing-theme";

type ThemePref = "system" | "light" | "dark";

function resolveTheme(pref: ThemePref): "light" | "dark" {
  if (pref === "light" || pref === "dark") return pref;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function applyResolvedTheme(resolved: "light" | "dark", pref?: ThemePref) {
  const root = document.documentElement;
  root.dataset.marketingTheme = resolved;
  root.style.colorScheme = resolved;
  if (pref) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, pref);
    } catch {
      // Ignore storage access errors
    }
    document.cookie = `${THEME_COOKIE}=${pref}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

export function MarketingThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [pageContainer, setPageContainer] = useState<Element | null>(null);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const transitioningRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    setPageContainer(document.querySelector("[data-marketing-page]"));

    const getStoredPref = (): ThemePref => {
      try {
        const val = localStorage.getItem(THEME_STORAGE_KEY);
        if (val === "light" || val === "dark" || val === "system") return val;
      } catch {
        // Ignore storage read failure
      }
      return "system";
    };

    const syncFromSystem = () => {
      const pref = getStoredPref();
      const resolved = resolveTheme(pref);
      setResolvedTheme(resolved);
      applyResolvedTheme(resolved);
    };

    syncFromSystem();

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMqChange = () => {
      if (getStoredPref() === "system") syncFromSystem();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY) syncFromSystem();
    };

    mq.addEventListener("change", onMqChange);
    window.addEventListener("storage", onStorage);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "x" && e.key !== "X") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.target as HTMLElement | null)?.isContentEditable) return;
      toggleTheme();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      mq.removeEventListener("change", onMqChange);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const toggleTheme = () => {
    if (transitioningRef.current) return;
    const current =
      document.documentElement.dataset.marketingTheme === "dark" ? "dark" : "light";
    const next: "light" | "dark" = current === "dark" ? "light" : "dark";
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const docAny = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    };

    if (!prefersReduced && typeof docAny.startViewTransition === "function") {
      transitioningRef.current = true;
      document.documentElement.classList.add("marketing-theme-switching");
      const transition = docAny.startViewTransition(() => {
        setResolvedTheme(next);
        applyResolvedTheme(next, next);
      });
      transition.finished.finally(() => {
        document.documentElement.classList.remove("marketing-theme-switching");
        transitioningRef.current = false;
      });
    } else {
      setResolvedTheme(next);
      applyResolvedTheme(next, next);
    }
  };

  if (!mounted) return null;

  const foldButton = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        resolvedTheme === "dark"
          ? "Switch to Hermes Cobalt Light theme (shortcut X)"
          : "Switch to Cosmic Dark theme (shortcut X)"
      }
      title="Toggle theme (X)"
      data-slot="button"
      className="hermes-button marketing-theme-fold cursor-pointer"
    >
      <svg
        viewBox="0 0 32 32"
        className="marketing-theme-fold-front"
        fill="currentColor"
        aria-hidden="true"
      >
        <polygon points="0,0 32,0 32,32" />
      </svg>
      <svg
        viewBox="0 0 32 32"
        className="marketing-theme-fold-back"
        fill="currentColor"
        aria-hidden="true"
      >
        <polygon points="0,0 32,32 0,32" />
      </svg>
    </button>
  );

  return (
    <>
      {pageContainer ? createPortal(foldButton, pageContainer) : null}
      {createPortal(
        <>
          <div className="marketing-theme-signal" aria-hidden="true" />
          <svg className="marketing-theme-filters" aria-hidden="true" width="0" height="0">
            <defs>
              <filter id="marketing-crt-channels" x="-5%" y="0%" width="110%" height="100%">
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="r"
                />
                <feOffset in="r" dx="2" dy="0" result="rShift" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="g"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                  result="b"
                />
                <feOffset in="b" dx="-2" dy="0" result="bShift" />
                <feBlend in="rShift" in2="g" mode="screen" result="rg" />
                <feBlend in="rg" in2="bShift" mode="screen" />
              </filter>
            </defs>
          </svg>
        </>,
        document.body
      )}
    </>
  );
}

export function MarketingFrame() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const clickCueRef = useRef<HTMLDivElement | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const cueTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const frameEl = frameRef.current;
    if (!frameEl) return;

    const resetIdle = () => {
      frameEl.dataset.idle = "false";
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        frameEl.dataset.idle = "true";
      }, 10000);
    };

    resetIdle();

    let rafPending = false;
    const syncScroll = () => {
      rafPending = false;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const scrollPos = 10 + pct * 80;
      frameEl.style.setProperty("--scroll-y", `${scrollPos.toFixed(2)}%`);
    };

    const scheduleSync = () => {
      resetIdle();
      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(syncScroll);
      }
    };

    const onDocClick = (e: MouseEvent) => {
      resetIdle();
      const cue = clickCueRef.current;
      if (!cue) return;
      const vw = Math.max(1, window.innerWidth);
      const vh = Math.max(1, window.innerHeight);
      const xPct = (e.clientX / vw) * 100;
      const yPct = (e.clientY / vh) * 100;
      const distTop = yPct;
      const distBottom = 100 - yPct;
      const distLeft = xPct;
      const distRight = 100 - xPct;
      const minDist = Math.min(distTop, distBottom, distLeft, distRight);

      let snapX = xPct;
      let snapY = yPct;
      if (minDist === distTop) snapY = 0;
      else if (minDist === distBottom) snapY = 100;
      else if (minDist === distLeft) snapX = 0;
      else snapX = 100;

      cue.style.setProperty("--cue-x", `${snapX.toFixed(1)}%`);
      cue.style.setProperty("--cue-y", `${snapY.toFixed(1)}%`);
      cue.dataset.active = "true";
      if (cueTimerRef.current) window.clearTimeout(cueTimerRef.current);
      cueTimerRef.current = window.setTimeout(() => {
        cue.dataset.active = "false";
      }, 760);
    };

    syncScroll();
    document.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });
    document.addEventListener("pointermove", resetIdle, { passive: true });
    document.addEventListener("click", onDocClick, { passive: true });

    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      if (cueTimerRef.current) window.clearTimeout(cueTimerRef.current);
      document.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      document.removeEventListener("pointermove", resetIdle);
      document.removeEventListener("click", onDocClick);
    };
  }, []);

  return (
    <div ref={frameRef} className="hw-frame max-md:hidden" aria-hidden="true">
      <span className="hw-frame-ambient top" />
      <span className="hw-frame-ambient right" />
      <span className="hw-frame-ambient bottom" />
      <span className="hw-frame-ambient left" />
      <div ref={clickCueRef} className="hw-frame-click" />
      <div className="hw-frame-scroll" />
    </div>
  );
}

export function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", { alpha: true, antialias: false });
    } catch {
      gl = null;
    }

    let rafId = 0;
    const resize = () => {
      canvas.width = Math.min(640, Math.max(1, Math.floor(window.innerWidth * 0.35)));
      canvas.height = Math.min(480, Math.max(1, Math.floor(window.innerHeight * 0.35)));
      if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let disposed = false;

    if (gl) {
      const vsSource = `attribute vec2 aPos; void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;
      const fsSource = `
        precision mediump float;
        uniform float uTime;
        uniform float uDensity;
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7)) + uTime) * 43758.5453123);
        }
        void main() {
          float n = hash(gl_FragCoord.xy);
          float g = step(1.0 - uDensity, n);
          gl_FragColor = vec4(vec3(0.918), g);
        }
      `;

      const compile = (type: number, src: string) => {
        const s = gl!.createShader(type)!;
        gl!.shaderSource(s, src);
        gl!.compileShader(s);
        return s;
      };

      const vs = compile(gl.VERTEX_SHADER, vsSource);
      const fs = compile(gl.FRAGMENT_SHADER, fsSource);
      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );
      const loc = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const uTimeLoc = gl.getUniformLocation(prog, "uTime");
      const uDensityLoc = gl.getUniformLocation(prog, "uDensity");
      gl.uniform1f(uDensityLoc, 0.25);

      let frame = 0;
      const loop = () => {
        rafId = 0;
        if (disposed || document.hidden) return;
        frame++;
        if (frame % 3 === 0 || prefersReduced) {
          gl!.uniform1f(uTimeLoc, prefersReduced ? 1.0 : performance.now() * 0.001);
          gl!.drawArrays(gl!.TRIANGLES, 0, 6);
        }
        if (!prefersReduced) rafId = window.requestAnimationFrame(loop);
      };
      const onVisibilityChange = () => {
        if (document.hidden) {
          if (rafId) {
            window.cancelAnimationFrame(rafId);
            rafId = 0;
          }
        } else if (!prefersReduced && !rafId) {
          rafId = window.requestAnimationFrame(loop);
        }
      };
      document.addEventListener("visibilitychange", onVisibilityChange);
      if (!document.hidden) {
        gl.uniform1f(uTimeLoc, 1.0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (!prefersReduced) rafId = window.requestAnimationFrame(loop);
      }

      return () => {
        disposed = true;
        if (rafId) window.cancelAnimationFrame(rafId);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.removeEventListener("resize", resize);
        gl?.deleteBuffer(buf);
        gl?.deleteProgram(prog);
      };
    }

    // 2D Canvas fallback
    const ctx = canvas.getContext("2d");
    const drawFallback = () => {
      rafId = 0;
      if (!ctx || disposed || document.hidden) return;
      const w = canvas.width;
      const h = canvas.height;
      const img = ctx.createImageData(w, h);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const on = Math.random() > 0.75 ? 234 : 0;
        data[i] = on;
        data[i + 1] = on;
        data[i + 2] = on;
        data[i + 3] = on ? 255 : 0;
      }
      ctx.putImageData(img, 0, 0);
      if (!prefersReduced) rafId = window.requestAnimationFrame(drawFallback);
    };
    const onFallbackVisibility = () => {
      if (document.hidden) {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else if (!prefersReduced && !rafId) {
        rafId = window.requestAnimationFrame(drawFallback);
      }
    };
    document.addEventListener("visibilitychange", onFallbackVisibility);
    if (!document.hidden) drawFallback();

    return () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onFallbackVisibility);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-101 h-full w-full"
      style={{ mixBlendMode: "normal", opacity: 0.02 }}
    />
  );
}

export function FitText({
  text,
  className = "",
  maxPx = 397,
}: {
  text: string;
  className?: string;
  maxPx?: number | string;
}) {
  const maxVal = typeof maxPx === "number" ? `${maxPx}px` : maxPx;
  return (
    <p
      aria-hidden="true"
      className={`fit-text ${className}`}
      style={{ ["--fit-max" as string]: maxVal, ["--fit-min" as string]: "1em" }}
    >
      <span>
        <span>{text}</span>
      </span>
      <span aria-hidden="true">{text}</span>
    </p>
  );
}

export function HeroParallax() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let heroTargets: HTMLElement[] = [];
    let imgTargets: HTMLElement[] = [];
    const refreshTargets = () => {
      heroTargets = Array.from(document.querySelectorAll<HTMLElement>(".hw-hero-parallax"));
      imgTargets = Array.from(document.querySelectorAll<HTMLElement>(".hw-parallax"));
    };

    let rafPending = false;
    const updateParallax = () => {
      rafPending = false;
      const sy = window.scrollY;
      const vh = window.innerHeight || 800;
      const pyHero = Math.min(vh, Math.max(0, 0.35 * sy));

      for (let i = 0; i < heroTargets.length; i++) {
        heroTargets[i].style.setProperty("--py-hero", `${pyHero.toFixed(1)}px`);
      }

      for (let i = 0; i < imgTargets.length; i++) {
        const el = imgTargets[i];
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) continue;
        const center = rect.top + rect.height / 2;
        const ratio = (center - vh / 2) / Math.max(1, vh);
        const py = -ratio * rect.height * 0.1;
        el.style.setProperty("--py-img", `${py.toFixed(1)}px`);
      }
    };

    const onScroll = () => {
      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(updateParallax);
      }
    };

    const onResize = () => {
      refreshTargets();
      onScroll();
    };

    refreshTargets();
    updateParallax();
    document.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
