"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const STICKER_IMAGES = [
  "/assets/stickers/sticker-01.webp",
  "/assets/stickers/sticker-02.webp",
  "/assets/stickers/sticker-03.webp",
  "/assets/stickers/sticker-04.webp",
  "/assets/stickers/sticker-05.webp",
  "/assets/stickers/sticker-06.webp",
  "/assets/stickers/sticker-07.webp",
  "/assets/stickers/sticker-08.webp",
  "/assets/stickers/sticker-09.webp",
  "/assets/stickers/sticker-10.webp",
  "/assets/stickers/sticker-11.webp",
  "/assets/stickers/sticker-12.webp",
];

const LEFT_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const RIGHT_DIGITS = ["0", "9", "5", "4", "6", "8", "5", "4", "6", "9"];

// Progress steps corresponding to left & right square indices (00 -> 19 -> ... -> 99)
const STEP_SCHEDULE_MS = [120, 420, 760, 1140, 1540, 1980, 2420, 2860, 3260, 3680];

type LoaderPhase = "loading" | "ready" | "exiting" | "done";

export function triggerPreloaderReplay() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("replay-preloader"));
  }
}

export function BeFreakyPreloader() {
  const [phase, setPhase] = useState<LoaderPhase>("loading");
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [holdMode, setHoldMode] = useState<boolean>(false);
  const [spawnCount, setSpawnCount] = useState<number>(0);
  const [runKey, setRunKey] = useState<number>(0);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const stickerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const poolIndexRef = useRef<number>(0);
  const zIndexRef = useRef<number>(10);
  const lastSpawnRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const phaseRef = useRef<LoaderPhase>(phase);
  phaseRef.current = phase;

  const spawnStickerAt = useCallback((clientX: number, clientY: number) => {
    const activePhase = phaseRef.current;
    if (activePhase !== "loading" && activePhase !== "ready") return;

    const now = performance.now();
    const prev = lastSpawnRef.current;
    const dx = prev ? clientX - prev.x : 0;
    const dy = prev ? clientY - prev.y : 0;
    const dist = Math.hypot(dx, dy);

    if (prev && (dist < 36 || now - prev.time < 38)) {
      return;
    }

    lastSpawnRef.current = { x: clientX, y: clientY, time: now };

    const idx = poolIndexRef.current % STICKER_IMAGES.length;
    poolIndexRef.current = (poolIndexRef.current + 1) % STICKER_IMAGES.length;

    const el = stickerRefs.current[idx];
    if (!el) return;

    zIndexRef.current += 1;
    el.style.zIndex = String(zIndexRef.current);
    setSpawnCount((c) => c + 1);

    const clampTilt = Math.max(-14, Math.min(14, dx * 0.22));
    const driftX = Math.max(-42, Math.min(42, dx * 0.42));
    const driftY = Math.max(-42, Math.min(42, dy * 0.42));

    el.getAnimations().forEach((anim) => anim.cancel());

    if (typeof el.animate === "function") {
      el.animate(
        [
          {
            opacity: 0,
            transform: `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%) scale(0.22) rotate(${clampTilt * 0.4}deg)`,
          },
          {
            opacity: 1,
            transform: `translate3d(${clientX + driftX * 0.55}px, ${clientY + driftY * 0.55}px, 0) translate(-50%, -50%) scale(1) rotate(${clampTilt}deg)`,
            offset: 0.26,
          },
          {
            opacity: 1,
            transform: `translate3d(${clientX + driftX * 0.85}px, ${clientY + driftY * 0.85}px, 0) translate(-50%, -50%) scale(0.98) rotate(${clampTilt * 0.9}deg)`,
            offset: 0.62,
          },
          {
            opacity: 0,
            transform: `translate3d(${clientX + driftX}px, ${clientY + driftY}px, 0) translate(-50%, -50%) scale(0.66) rotate(${clampTilt * 0.6}deg)`,
          },
        ],
        {
          duration: 900,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        }
      );
    } else {
      el.style.opacity = "1";
      el.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%) scale(1)`;
    }
  }, []);

  const dismissPreloader = useCallback(() => {
    setPhase((cur) => {
      if (cur === "exiting" || cur === "done") return cur;
      return "exiting";
    });
  }, []);

  useEffect(() => {
    if (phase !== "exiting") return;
    const t = window.setTimeout(() => {
      setPhase("done");
    }, 720);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Listen for replay requests
  useEffect(() => {
    const onReplay = () => {
      lastSpawnRef.current = null;
      poolIndexRef.current = 0;
      setStepIdx(0);
      setHoldMode(false);
      setPhase("loading");
      setRunKey((k) => k + 1);
    };
    window.addEventListener("replay-preloader", onReplay);
    return () => window.removeEventListener("replay-preloader", onReplay);
  }, []);

  // Run digit progression and readiness timing per loader invocation
  useEffect(() => {
    if (phase === "done" || phase === "exiting") return;

    const params = new URLSearchParams(window.location.search);
    const shouldHold = params.get("loader") === "hold";
    setHoldMode(shouldHold);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion && !shouldHold) {
      setStepIdx(9);
      const tFast = window.setTimeout(() => setPhase("done"), 180);
      return () => window.clearTimeout(tFast);
    }

    const timers: number[] = [];
    const maxStep = shouldHold ? 8 : 9;

    for (let i = 0; i <= maxStep; i++) {
      timers.push(
        window.setTimeout(() => {
          setStepIdx(i);
        }, STEP_SCHEDULE_MS[i])
      );
    }

    if (!shouldHold) {
      timers.push(
        window.setTimeout(() => {
          setPhase("ready");
        }, STEP_SCHEDULE_MS[9] + 220)
      );
      timers.push(
        window.setTimeout(() => {
          setPhase("exiting");
        }, STEP_SCHEDULE_MS[9] + 620)
      );
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
    // Intentionally scoped to runKey so explicit transitions aren't canceled early
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runKey]);

  // Bind global pointer move & tap listeners while active
  useEffect(() => {
    if (phase === "done") return;

    const handlePointerMove = (e: PointerEvent) => {
      spawnStickerAt(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      spawnStickerAt(e.clientX, e.clientY);
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Force spawn on tap/click even if pointer didn't travel 36px first
      lastSpawnRef.current = null;
      spawnStickerAt(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [phase, spawnStickerAt]);

  if (phase === "done") {
    return null;
  }

  return (
    <div
      ref={rootRef}
      data-testid="befreaky-preloader"
      data-phase={phase}
      data-step={stepIdx}
      data-spawn-count={spawnCount}
      aria-label="Portfolio Preloader"
      role="status"
      className={`preloader ${phase === "exiting" ? "preloader--exiting" : ""}`}
    >
      {/* Top bar control */}
      <div className="preloader__chrome">
        <span className="preloader__badge">
          Sameer Gupta
        </span>
        <button
          type="button"
          onClick={dismissPreloader}
          className="preloader__skip"
        >
          {holdMode ? "Enter" : "Skip"}
        </button>
      </div>

      {/* Mouse-pointer WebP sticker trail pool */}
      <div className="preloader__stickers__container" aria-hidden="true">
        {STICKER_IMAGES.map((src, idx) => (
          <div
            key={src}
            ref={(node) => {
              stickerRefs.current[idx] = node;
            }}
            className="preloader__stickers"
          >
            <img
              src={src}
              alt=""
              decoding="async"
              loading="eager"
              className="preloader__stickers__inner"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Center prompt / ready banner */}
      <p
        className={`preloader__text ${phase === "ready" ? "preloader__text--visible" : ""}`}
      >
        {phase === "ready"
          ? "Ready"
          : "Move cursor to preview"}
      </p>

      {/* Bottom-right twin-square rolling counter */}
      <div className="preloader__square__container" aria-hidden="true">
        <div className="preloader__square__left__wrapper">
          <div
            className="preloader__number__left"
            style={{
              transform: `translate3d(-50%, calc(${stepIdx} * -1 * var(--preloader-sq)), 0)`,
            }}
          >
            {LEFT_DIGITS.map((d, i) => (
              <span key={`${d}-${i}`} className="preloader__number__left__text">
                {d}
              </span>
            ))}
          </div>
        </div>
        <div className="preloader__square__right__wrapper">
          <div
            className="preloader__number__right"
            style={{
              transform: `translate3d(-50%, calc(${stepIdx} * -1 * var(--preloader-sq)), 0)`,
            }}
          >
            {RIGHT_DIGITS.map((d, i) => (
              <span key={`${d}-${i}`} className="preloader__number__right__text">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
