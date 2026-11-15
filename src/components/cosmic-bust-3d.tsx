"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type CosmicShaderMode = "cosmic" | "halftone" | "kintsugi" | "wireframe";

export interface CosmicBustParams {
  glitchIntensity: number;
  orbitSpeed: number;
  reliefDepth: number;
  kintsugiGlow: number;
}

interface CosmicBust3DProps {
  variant?: "hero" | "studio";
  mode?: CosmicShaderMode;
  onModeChange?: (mode: CosmicShaderMode) => void;
  params?: CosmicBustParams;
  surgeCount?: number;
}

const DEFAULT_PARAMS: CosmicBustParams = {
  glitchIntensity: 0.78,
  orbitSpeed: 1.0,
  reliefDepth: 0.64,
  kintsugiGlow: 0.85,
};

const BUST_VERTEX_SHADER = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uGlitch;
  uniform float uDepth;
  uniform float uSurge;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying float vHeight;
  varying float vEyeBand;
  varying float vSliceOffset;
  varying float vAlphaMask;
  varying vec3 vNormalApprox;

  float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }

  float lum(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
  }

  // Tilted eye horizon matching the cosmic ring in cosmic-bust.webp
  float eyeHorizonY(float xUv) {
    return 0.60 - 0.11 * (xUv - 0.5);
  }

  float computeBustHeight(vec2 uv) {
    vec2 texel = vec2(1.0 / 512.0, 1.0 / 320.0);
    float c = lum(texture2D(uTexture, uv).rgb);
    float l = lum(texture2D(uTexture, uv - vec2(texel.x * 2.0, 0.0)).rgb);
    float r = lum(texture2D(uTexture, uv + vec2(texel.x * 2.0, 0.0)).rgb);
    float u = lum(texture2D(uTexture, uv + vec2(0.0, texel.y * 2.0)).rgb);
    float d = lum(texture2D(uTexture, uv - vec2(0.0, texel.y * 2.0)).rgb);
    float smoothLum = (c * 2.0 + l + r + u + d) / 6.0;

    // Anatomical 3D bust volume approximation:
    // Center face ellipsoid + recessed mouth cavity + neck/shoulder foreground projection
    vec2 headCenter = vec2(0.51, 0.62);
    float headDist = length((uv - headCenter) * vec2(1.35, 1.0));
    float headSphere = smoothstep(0.56, 0.05, headDist) * 0.52;

    // Open mouth recess around (0.61, 0.36)
    vec2 mouthCenter = vec2(0.615, 0.355);
    float mouthDist = length((uv - mouthCenter) * vec2(1.85, 1.35));
    float mouthCavity = smoothstep(0.16, 0.02, mouthDist) * 0.38;

    // Foreground left-shoulder toga projection
    float shoulder = smoothstep(0.45, 0.0, length((uv - vec2(0.18, 0.12)) * vec2(0.95, 1.25))) * 0.34;

    return smoothLum * 0.68 + headSphere + shoulder - mouthCavity;
  }

  void main() {
    vUv = uv;

    float h = computeBustHeight(uv);
    float edgeMaskX = smoothstep(0.0, 0.09, uv.x) * smoothstep(1.0, 0.91, uv.x);
    float edgeMaskY = smoothstep(0.0, 0.08, uv.y) * smoothstep(1.0, 0.92, uv.y);

    // Preserve solid sculpture silhouette (including shadowed neck, cheek, and open mouth cavity)
    vec3 rawTex = texture2D(uTexture, uv).rgb;
    float baseLum = lum(rawTex);
    float coreSilhouette = smoothstep(0.68, 0.24, length((uv - vec2(0.45, 0.42)) * vec2(0.92, 0.96)));
    float bustPresence = smoothstep(0.02, 0.14, baseLum + coreSilhouette * 0.42);
    vAlphaMask = clamp(bustPresence * edgeMaskX * edgeMaskY, 0.0, 1.0);

    // Tilted horizontal scanline eye-slice corridor
    float ey = eyeHorizonY(uv.x);
    float distEye = abs(uv.y - ey);
    float bandEnvelope = exp(-pow(distEye / (0.105 + uSurge * 0.07), 2.0));

    float rowIndex = floor(uv.y * 165.0);
    float tStep = floor(uTime * (5.0 + uSurge * 12.0));
    float r1 = hash11(rowIndex * 13.7 + tStep * 0.37);
    float r2 = hash11(rowIndex * 5.3 + floor(uTime * 15.0) * 0.19);
    float sliceJitter = (r1 - 0.5) * 2.0 * step(0.62 - uSurge * 0.34, r2);
    float slice = sliceJitter * bandEnvelope * (0.048 * uGlitch + 0.17 * uSurge);

    vEyeBand = bandEnvelope;
    vSliceOffset = slice;
    vHeight = h;

    // Cylindrical relief curve so bust wraps organically in 3D space
    float cylX = (uv.x - 0.5) * 3.14159 * 0.36;
    vec3 pos = position;
    pos.x += slice * 1.15;
    pos.z += cos(cylX) * 0.34 - 0.20;
    pos.z += h * uDepth * 0.85;
    pos.z += abs(slice) * 0.28;

    // Subtle living breath + pointer hover attraction
    pos.y += sin(uTime * 1.25 + uv.x * 2.0) * 0.014;
    pos.z += exp(-length(uv - (uPointer * 0.5 + 0.5)) * 4.5) * 0.06;

    // Approximate surface normal for vertex/fragment shading
    float hx = computeBustHeight(uv + vec2(0.004, 0.0));
    float hy = computeBustHeight(uv + vec2(0.0, 0.004));
    vNormalApprox = normalize(vec3((h - hx) * 6.5 * uDepth, (h - hy) * 6.5 * uDepth, 1.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const BUST_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uGlitch;
  uniform float uKintsugi;
  uniform float uSurge;
  uniform float uMode; // 0 cosmic, 1 halftone, 2 kintsugi, 3 wireframe
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying float vHeight;
  varying float vEyeBand;
  varying float vSliceOffset;
  varying float vAlphaMask;
  varying vec3 vNormalApprox;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float lum(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
  }

  void main() {
    // Subtle chromatic horizontal scanline offset concentrated inside the eye glitch band
    float rgbShift = (0.0014 + abs(vSliceOffset) * 0.16) * (0.25 + 0.65 * vEyeBand) * (0.4 + uGlitch + uSurge);
    vec2 uvR = clamp(vUv + vec2(vSliceOffset * 0.14 + rgbShift, 0.0), 0.002, 0.998);
    vec2 uvG = clamp(vUv + vec2(vSliceOffset * 0.14, 0.0), 0.002, 0.998);
    vec2 uvB = clamp(vUv + vec2(vSliceOffset * 0.14 - rgbShift, 0.0), 0.002, 0.998);

    float r = texture2D(uTexture, uvR).r;
    float g = texture2D(uTexture, uvG).g;
    float b = texture2D(uTexture, uvB).b;
    vec3 texColor = vec3(r, g, b);

    // Fine scanline dark raster slices across the eye void
    float scanWave = sin(vUv.y * 540.0 + uTime * 22.0);
    float rasterGate = mix(1.0, smoothstep(-0.35, 0.45, scanWave), vEyeBand * (0.55 * uGlitch + 0.35 * uSurge));

    // Dynamic 3D lighting from pointer + key light + cobalt rim
    vec3 N = normalize(vNormalApprox);
    vec3 L1 = normalize(vec3(0.55 + uPointer.x * 0.85, 0.45 + uPointer.y * 0.65, 1.0));
    float diff = max(dot(N, L1), 0.0);
    float spec = pow(max(dot(reflect(-L1, N), vec3(0.0, 0.0, 1.0)), 0.0), 22.0);
    float rim = pow(1.0 - max(dot(N, vec3(0.0, 0.0, 1.0)), 0.0), 2.4);

    // Detect golden kintsugi veins already present in the marble (warm R+G > B)
    float warmGold = smoothstep(0.05, 0.22, (texColor.r * 0.6 + texColor.g * 0.4) - texColor.b);
    float pulseGold = 0.78 + 0.28 * sin(uTime * 2.2 + vUv.y * 16.0 - vUv.x * 8.0);
    vec3 kintsugiEmission = vec3(1.0, 0.80, 0.36) * warmGold * uKintsugi * (0.45 + uSurge * 1.2) * pulseGold;

    // Eye-ring plasma sheen where the tilted halo crosses the face
    float eyeGlowMask = exp(-pow((vUv.y - (0.60 - 0.11 * (vUv.x - 0.5))) / 0.042, 2.0));
    vec3 plasmaGlow = mix(vec3(0.32, 0.52, 1.0), vec3(0.97, 0.47, 0.81), 0.3 + 0.3 * sin(uTime * 1.8 + vUv.x * 6.0));

    vec3 outColor = texColor * (0.85 + 0.32 * diff) + vec3(0.65, 0.82, 1.0) * spec * 0.18;
    outColor += vec3(0.22, 0.36, 1.0) * rim * 0.24;
    outColor *= rasterGate;
    outColor += kintsugiEmission;
    outColor += plasmaGlow * eyeGlowMask * (0.24 + 0.50 * uSurge) * (1.0 - rasterGate * 0.35);

    // Mode 1: Hermes Agent Halftone Blueprint Engraving
    if (uMode > 0.5 && uMode < 1.5) {
      float gray = lum(outColor);
      vec2 cell = fract(vUv * vec2(170.0, 110.0)) - 0.5;
      float dotMask = step(length(cell), gray * 0.68);
      vec3 cobalt = vec3(0.0, 0.0, 0.949); // #0000f2
      vec3 paper = vec3(0.972, 0.972, 0.965); // #f8f8f6
      vec3 pink = vec3(0.973, 0.471, 0.812); // #f878cf
      outColor = mix(cobalt * 0.42, paper, dotMask);
      outColor = mix(outColor, pink, eyeGlowMask * 0.65 + warmGold * 0.55);
    }
    // Mode 2: Obsidian Kintsugi Overdrive
    else if (uMode >= 1.5 && uMode < 2.5) {
      float gray = lum(texColor);
      vec3 obsidian = vec3(0.05, 0.06, 0.14) + vec3(0.18, 0.22, 0.35) * pow(gray, 1.8) * (0.6 + diff);
      outColor = obsidian * rasterGate + kintsugiEmission * 2.2 + vec3(0.42, 0.52, 1.0) * rim * 0.65;
      outColor += plasmaGlow * eyeGlowMask * 0.55;
    }
    // Mode 3: Technical Neural Wireframe Tint
    else if (uMode >= 2.5) {
      vec3 neonBlue = vec3(0.37, 0.45, 1.0);
      vec3 ice = vec3(0.90, 0.97, 1.0);
      outColor = mix(neonBlue, ice, vHeight * 0.8) + kintsugiEmission * 0.9;
    }

    float finalAlpha = clamp(vAlphaMask + eyeGlowMask * 0.45, 0.0, 1.0);
    if (finalAlpha < 0.03) discard;

    gl_FragColor = vec4(outColor, finalAlpha);
  }
`;

const RING_PARTICLE_VERTEX = /* glsl */ `
  attribute float aAngle;
  attribute float aRadius;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aColorMix;
  attribute float aHeight;

  uniform float uTime;
  uniform float uOrbitSpeed;
  uniform float uSurge;
  uniform float uPixelRatio;

  varying float vColorMix;
  varying float vAlpha;

  void main() {
    float angle = aAngle + uTime * aSpeed * uOrbitSpeed * (1.0 + uSurge * 2.4);
    float rx = aRadius * 1.62;
    float rz = aRadius * 0.96;

    // Slight orbital wave turbulence matching cosmic dust stream
    float yWave = sin(angle * 3.0 + uTime * 1.4) * 0.045 + aHeight;
    vec3 localPos = vec3(cos(angle) * rx, yWave, sin(angle) * rz);

    vec4 mvPos = modelViewMatrix * vec4(localPos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    float depthPulse = 0.65 + 0.35 * sin(uTime * 3.0 + aAngle * 7.0);
    gl_PointSize = aSize * uPixelRatio * (3.2 / max(1.0, -mvPos.z)) * (0.85 + uSurge * 0.45) * depthPulse;
    vColorMix = aColorMix;
    vAlpha = clamp(0.45 + 0.55 * depthPulse, 0.0, 1.0);
  }
`;

const RING_PARTICLE_FRAGMENT = /* glsl */ `
  uniform float uMode;
  varying float vColorMix;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;

    float core = exp(-d * 6.0);
    vec3 colBlue = vec3(0.42, 0.62, 1.0);
    vec3 colIce = vec3(0.92, 0.97, 1.0);
    vec3 colPink = vec3(0.97, 0.47, 0.81);
    vec3 colGold = vec3(1.0, 0.84, 0.48);

    vec3 col = mix(colBlue, colIce, smoothstep(0.0, 0.55, vColorMix));
    if (vColorMix > 0.65) {
      col = mix(col, colPink, (vColorMix - 0.65) * 2.0);
    }
    if (vColorMix > 0.88) {
      col = mix(col, colGold, (vColorMix - 0.88) * 6.0);
    }
    if (uMode > 0.5 && uMode < 1.5) {
      col = mix(vec3(0.97, 0.97, 0.96), colPink, vColorMix);
    }

    gl_FragColor = vec4(col * (0.8 + core * 1.4), core * vAlpha);
  }
`;

function createStarFlareTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const cx = size / 2;
    const grad = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
    grad.addColorStop(0.0, "rgba(255,255,255,1)");
    grad.addColorStop(0.18, "rgba(190,225,255,0.92)");
    grad.addColorStop(0.45, "rgba(95,114,255,0.38)");
    grad.addColorStop(1.0, "rgba(0,0,242,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Crisp horizontal anamorphic lens flare spike
    const hGrad = ctx.createLinearGradient(0, cx, size, cx);
    hGrad.addColorStop(0, "rgba(147,197,253,0)");
    hGrad.addColorStop(0.5, "rgba(255,255,255,0.85)");
    hGrad.addColorStop(1, "rgba(147,197,253,0)");
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, cx - 2, size, 4);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function CosmicBust3D({
  variant = "hero",
  mode: controlledMode,
  onModeChange,
  params = DEFAULT_PARAMS,
  surgeCount = 0,
}: CosmicBust3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [internalMode, setInternalMode] = useState<CosmicShaderMode>("cosmic");
  const mode = controlledMode ?? internalMode;
  const setMode = (next: CosmicShaderMode) => {
    setInternalMode(next);
    onModeChange?.(next);
  };

  const [localSurge, setLocalSurge] = useState(0);
  const [pointerLabel, setPointerLabel] = useState("DRAG TO ORBIT · CLICK TO SURGE");
  const [webglReady, setWebglReady] = useState(true);

  const stateRef = useRef({
    mode,
    params,
    surgeTarget: 0,
    surgeCurrent: 0,
  });

  stateRef.current.mode = mode;
  stateRef.current.params = params;

  const triggerSurge = () => {
    stateRef.current.surgeTarget = 1.0;
    setLocalSurge((n) => n + 1);
  };

  useEffect(() => {
    if (surgeCount > 0) {
      stateRef.current.surgeTarget = 1.0;
    }
  }, [surgeCount]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglReady(false);
      return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(pixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    camera.position.set(0, 0.05, 3.65);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Fallback 1x1 dark-blue texture so shaders render cleanly even before cosmic-bust.webp decodes
    const placeholderTex = new THREE.DataTexture(new Uint8Array([14, 18, 52, 255]), 1, 1);
    placeholderTex.needsUpdate = true;

    const bustUniforms = {
      uTexture: { value: placeholderTex as THREE.Texture },
      uTime: { value: 0 },
      uGlitch: { value: stateRef.current.params.glitchIntensity },
      uDepth: { value: stateRef.current.params.reliefDepth },
      uKintsugi: { value: stateRef.current.params.kintsugiGlow },
      uSurge: { value: 0 },
      uMode: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
    };

    const bustGeom = new THREE.PlaneGeometry(3.35, 1.98, 200, 130);
    const bustMat = new THREE.ShaderMaterial({
      vertexShader: BUST_VERTEX_SHADER,
      fragmentShader: BUST_FRAGMENT_SHADER,
      uniforms: bustUniforms,
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    const bustMesh = new THREE.Mesh(bustGeom, bustMat);
    bustMesh.position.set(0, -0.02, 0);
    rootGroup.add(bustMesh);

    // Load actual uploaded reference artwork
    const textureLoader = new THREE.TextureLoader();
    let loadedTex: THREE.Texture | null = null;
    textureLoader.load(
      "/assets/cosmic-bust.webp",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        loadedTex = tex;
        bustUniforms.uTexture.value = tex;
      },
      undefined,
      () => {
        // Keep placeholder if offline/error
      }
    );

    // 3D Volumetric Starlight Contour Shell behind the bust for deep 3D parallax when dragging
    const shellCount = 1800;
    const shellPos = new Float32Array(shellCount * 3);
    const shellColors = new Float32Array(shellCount * 3);
    for (let i = 0; i < shellCount; i++) {
      const phi = Math.acos(1 - 2 * ((i + 0.5) / shellCount));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.05 + (i % 7) * 0.06;
      shellPos[i * 3] = Math.sin(phi) * Math.cos(theta) * r * 1.15;
      shellPos[i * 3 + 1] = Math.cos(phi) * r * 0.92;
      shellPos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r * 0.55 - 0.35;

      const mixVal = (i % 10) / 10;
      shellColors[i * 3] = 0.32 + mixVal * 0.45;
      shellColors[i * 3 + 1] = 0.48 + mixVal * 0.38;
      shellColors[i * 3 + 2] = 0.98;
    }
    const shellGeom = new THREE.BufferGeometry();
    shellGeom.setAttribute("position", new THREE.BufferAttribute(shellPos, 3));
    shellGeom.setAttribute("color", new THREE.BufferAttribute(shellColors, 3));
    const shellMat = new THREE.PointsMaterial({
      size: 0.016,
      vertexColors: true,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const shellPoints = new THREE.Points(shellGeom, shellMat);
    rootGroup.add(shellPoints);

    // Tilted 3D Cosmic Accretion Ring wrapping around & behind the bust's eyes
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0.02, 0.21, 0.22);
    ringGroup.rotation.set(0.24, 0.04, -0.175);
    rootGroup.add(ringGroup);

    const ringParticleCount = 4600;
    const angles = new Float32Array(ringParticleCount);
    const radii = new Float32Array(ringParticleCount);
    const speeds = new Float32Array(ringParticleCount);
    const sizes = new Float32Array(ringParticleCount);
    const colorMixes = new Float32Array(ringParticleCount);
    const heights = new Float32Array(ringParticleCount);
    const dummyPos = new Float32Array(ringParticleCount * 3);

    for (let i = 0; i < ringParticleCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const radialSpread = (Math.random() - 0.5) * 0.36;
      const r = 0.86 + radialSpread * (Math.random() > 0.3 ? 0.42 : 1.15);
      angles[i] = a;
      radii[i] = r;
      speeds[i] = 0.16 + (1.15 - r) * 0.22 + (Math.random() - 0.5) * 0.06;
      sizes[i] = Math.random() > 0.88 ? 4.4 + Math.random() * 4.5 : 1.6 + Math.random() * 2.5;
      colorMixes[i] = Math.random();
      heights[i] = (Math.random() - 0.5) * 0.09;
    }

    const ringGeom = new THREE.BufferGeometry();
    ringGeom.setAttribute("position", new THREE.BufferAttribute(dummyPos, 3));
    ringGeom.setAttribute("aAngle", new THREE.BufferAttribute(angles, 1));
    ringGeom.setAttribute("aRadius", new THREE.BufferAttribute(radii, 1));
    ringGeom.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    ringGeom.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    ringGeom.setAttribute("aColorMix", new THREE.BufferAttribute(colorMixes, 1));
    ringGeom.setAttribute("aHeight", new THREE.BufferAttribute(heights, 1));

    const ringUniforms = {
      uTime: { value: 0 },
      uOrbitSpeed: { value: stateRef.current.params.orbitSpeed },
      uSurge: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uMode: { value: 0 },
    };

    const ringMat = new THREE.ShaderMaterial({
      vertexShader: RING_PARTICLE_VERTEX,
      fragmentShader: RING_PARTICLE_FRAGMENT,
      uniforms: ringUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const ringPoints = new THREE.Points(ringGeom, ringMat);
    ringGroup.add(ringPoints);

    // 3D Luminous Core Orbit Wire
    const orbitCurvePts: THREE.Vector3[] = [];
    for (let i = 0; i <= 140; i++) {
      const th = (i / 140) * Math.PI * 2;
      orbitCurvePts.push(new THREE.Vector3(Math.cos(th) * 1.4, 0, Math.sin(th) * 0.83));
    }
    const orbitCurveGeom = new THREE.BufferGeometry().setFromPoints(orbitCurvePts);
    const orbitCurveMat = new THREE.LineBasicMaterial({
      color: 0xa5b4fc,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const orbitLine = new THREE.LineLoop(orbitCurveGeom, orbitCurveMat);
    ringGroup.add(orbitLine);

    // 3D Horizontal Eye-Scanline Glitch Streaks floating through the eye plane
    const streakCount = 72;
    const streakPositions = new Float32Array(streakCount * 6);
    for (let i = 0; i < streakCount; i++) {
      const y = (Math.random() - 0.5) * 0.34;
      const xCenter = (Math.random() - 0.5) * 2.1;
      const halfLen = 0.14 + Math.random() * 0.52;
      const z = 0.25 + Math.random() * 0.65;
      streakPositions[i * 6] = xCenter - halfLen;
      streakPositions[i * 6 + 1] = y;
      streakPositions[i * 6 + 2] = z;
      streakPositions[i * 6 + 3] = xCenter + halfLen;
      streakPositions[i * 6 + 4] = y;
      streakPositions[i * 6 + 5] = z;
    }
    const streakGeom = new THREE.BufferGeometry();
    streakGeom.setAttribute("position", new THREE.BufferAttribute(streakPositions, 3));
    const streakMat = new THREE.LineBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
    });
    const streakLines = new THREE.LineSegments(streakGeom, streakMat);
    ringGroup.add(streakLines);

    // Focal Singularity Star Flare positioned on the front-right brow/temple arc
    const flareTex = createStarFlareTexture();
    const flareMat = new THREE.SpriteMaterial({
      map: flareTex,
      color: 0xe0f2fe,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const singularitySprite = new THREE.Sprite(flareMat);
    singularitySprite.position.set(0.62, 0.04, 0.72);
    singularitySprite.scale.set(0.68, 0.44, 1);
    ringGroup.add(singularitySprite);

    // Pointer & Drag Orbit Interaction
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragBaseYaw = 0;
    let dragBasePitch = 0;
    let targetYaw = 0;
    let targetPitch = 0;
    let currentYaw = 0;
    let currentPitch = 0;
    let pointerX = 0;
    let pointerY = 0;
    let dragDistance = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragDistance = 0;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragBaseYaw = targetYaw;
      dragBasePitch = targetPitch;
      canvas.setPointerCapture(e.pointerId);
      setPointerLabel("ORBITING 3D MESH");
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      }
      if (isDragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragDistance = Math.hypot(dx, dy);
        targetYaw = THREE.MathUtils.clamp(dragBaseYaw + dx * 0.0065, -0.82, 0.82);
        targetPitch = THREE.MathUtils.clamp(dragBasePitch + dy * 0.0045, -0.38, 0.38);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isDragging && dragDistance < 6) {
        stateRef.current.surgeTarget = 1.0;
        setLocalSurge((n) => n + 1);
      }
      isDragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer already released
      }
      setPointerLabel("DRAG TO ORBIT · CLICK TO SURGE");
    };

    const handlePointerLeave = () => {
      if (!isDragging) {
        pointerX = 0;
        pointerY = 0;
      }
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    // ResizeObserver for crisp responsive sizing
    const updateSize = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      // Fit the entire 3.35 x 1.98 3D bust + orbiting ring inside the container without clipping edges
      camera.position.z = w / h > 1.45 ? 3.25 : 3.95;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(container);

    let rafId = 0;
    let totalElapsed = 0;
    let isIntersecting = true;
    let isPageVisible = typeof document !== "undefined" ? !document.hidden : true;
    let disposed = false;
    const clock = new THREE.Clock();

    const modeToFloat = (m: CosmicShaderMode) => {
      if (m === "halftone") return 1;
      if (m === "kintsugi") return 2;
      if (m === "wireframe") return 3;
      return 0;
    };

    const renderFrame = () => {
      rafId = 0;
      if (disposed || !isIntersecting || !isPageVisible) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      totalElapsed += dt;
      const elapsed = totalElapsed;
      const { mode: curMode, params: curParams } = stateRef.current;

      // Decay surge pulse smoothly
      stateRef.current.surgeTarget = Math.max(0, stateRef.current.surgeTarget - dt * 0.65);
      stateRef.current.surgeCurrent +=
        (stateRef.current.surgeTarget - stateRef.current.surgeCurrent) * Math.min(1, dt * 8.0);
      const surge = stateRef.current.surgeCurrent;

      // Return gently toward rest pose when not dragging, plus gentle hover tilt
      if (!isDragging) {
        const idleYaw = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.45) * 0.08 + pointerX * 0.16;
        const idlePitch = prefersReducedMotion ? 0 : Math.cos(elapsed * 0.35) * 0.03 - pointerY * 0.1;
        targetYaw += (idleYaw - targetYaw) * Math.min(1, dt * 2.4);
        targetPitch += (idlePitch - targetPitch) * Math.min(1, dt * 2.4);
      }

      currentYaw += (targetYaw - currentYaw) * Math.min(1, dt * 7.5);
      currentPitch += (targetPitch - currentPitch) * Math.min(1, dt * 7.5);

      rootGroup.rotation.y = currentYaw;
      rootGroup.rotation.x = currentPitch;

      const mFloat = modeToFloat(curMode);
      bustMat.wireframe = curMode === "wireframe";
      bustUniforms.uTime.value = prefersReducedMotion ? 0 : elapsed;
      bustUniforms.uGlitch.value = curParams.glitchIntensity;
      bustUniforms.uDepth.value = curParams.reliefDepth;
      bustUniforms.uKintsugi.value = curParams.kintsugiGlow;
      bustUniforms.uSurge.value = surge;
      bustUniforms.uMode.value = mFloat;
      bustUniforms.uPointer.value.set(pointerX, pointerY);

      ringUniforms.uTime.value = prefersReducedMotion ? 0 : elapsed;
      ringUniforms.uOrbitSpeed.value = curParams.orbitSpeed;
      ringUniforms.uSurge.value = surge;
      ringUniforms.uMode.value = mFloat;

      // Animate orbital flare & 3D glitch streaks
      const flareScale = 0.65 + surge * 0.65 + (prefersReducedMotion ? 0 : Math.sin(elapsed * 3.4) * 0.07);
      singularitySprite.scale.set(flareScale * 1.1, flareScale * 0.62, 1);
      streakLines.position.x = prefersReducedMotion ? 0 : Math.sin(elapsed * 14.0) * 0.03 * curParams.glitchIntensity;
      streakMat.opacity = 0.24 + surge * 0.55;
      shellPoints.rotation.y = prefersReducedMotion ? 0 : elapsed * 0.06;

      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(renderFrame);
    };

    const syncPlayback = () => {
      if (disposed) return;
      if (isIntersecting && isPageVisible) {
        if (!rafId) {
          clock.start();
          rafId = window.requestAnimationFrame(renderFrame);
        }
      } else {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
        clock.stop();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isIntersecting = entry.isIntersecting;
        }
        syncPlayback();
      },
      { threshold: 0.01 }
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      syncPlayback();
    };
    document.addEventListener("visibilitychange", onVisibility);

    renderer.render(scene, camera);
    syncPlayback();

    return () => {
      disposed = true;
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafId) window.cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      bustGeom.dispose();
      bustMat.dispose();
      shellGeom.dispose();
      shellMat.dispose();
      ringGeom.dispose();
      ringMat.dispose();
      orbitCurveGeom.dispose();
      orbitCurveMat.dispose();
      streakGeom.dispose();
      streakMat.dispose();
      flareMat.dispose();
      flareTex.dispose();
      placeholderTex.dispose();
      loadedTex?.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="cosmic-bust-3d"
      data-shader-mode={mode}
      data-surge-count={localSurge}
      className={`cosmic-bust-stage ${variant === "studio" ? "cosmic-bust-stage--studio" : ""}`}
    >
      {webglReady ? (
        <canvas
          ref={canvasRef}
          aria-label="Interactive Three.js 3D sculpture of classical marble bust with cosmic eye ring"
          className="cosmic-bust-canvas"
        />
      ) : (
        <img
          src="/assets/cosmic-bust.webp"
          alt="Classical marble bust with cosmic ring"
          className="size-full object-cover"
        />
      )}

      <div className="cosmic-bust-hud-top">
        <span>THREE.JS // GLSL COSMIC BUST v1.0</span>
        <span className="max-sm:hidden">{pointerLabel}</span>
      </div>

      <div className="cosmic-bust-hud-bottom">
        <div className="cosmic-bust-tabs" role="group" aria-label="3D Shader Render Modes">
          {(["cosmic", "halftone", "kintsugi", "wireframe"] as CosmicShaderMode[]).map((m) => (
            <button
              key={m}
              type="button"
              className="cosmic-bust-tab"
              data-active={mode === m ? "true" : "false"}
              onClick={() => setMode(m)}
            >
              :{m}:
            </button>
          ))}
        </div>
        <button type="button" className="cosmic-bust-surge-btn" onClick={triggerSurge}>
          :Surge Ring:
        </button>
      </div>
    </div>
  );
}
