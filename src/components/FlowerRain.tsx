'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface FlowerRainRef {
  triggerBurst: (x: number, y: number) => void;
  stop: () => void;
}

// Target flower density tiers
export const TARGET_DESKTOP = 180; // far ~80, mid ~70, near ~30
export const TARGET_MOBILE = 90;   // far ~40, mid ~35, near ~15
export const TARGET_LOW_END = 45;  // far ~20, mid ~18, near ~7

const MAX_PARTICLES = 260;

// Fast Precomputed Sine Lookup Table (1024 entries)
const SIN_BITS = 10;
const SIN_SIZE = 1 << SIN_BITS; // 1024
const SIN_MASK = SIN_SIZE - 1;
const SIN_TABLE = new Float32Array(SIN_SIZE);
const RAD_TO_INDEX = SIN_SIZE / (Math.PI * 2);

for (let i = 0; i < SIN_SIZE; i++) {
  SIN_TABLE[i] = Math.sin((i / SIN_SIZE) * Math.PI * 2);
}

function fastSin(rad: number): number {
  const index = ((rad * RAD_TO_INDEX) | 0) & SIN_MASK;
  return SIN_TABLE[index];
}

function fastCos(rad: number): number {
  const index = (((rad + Math.PI * 0.5) * RAD_TO_INDEX) | 0) & SIN_MASK;
  return SIN_TABLE[index];
}

// 4 distinct handcrafted SVG flower designs
const FLOWER_SVG_TEMPLATES = [
  // 0: 5-petal blossom with notched tips & golden stamen center
  (cBase: string, cTip: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <radialGradient id="pGrad" cx="50%" cy="85%" r="75%">
        <stop offset="0%" stop-color="${cBase}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="${cTip}" stop-opacity="0.9"/>
      </radialGradient>
    </defs>
    <g transform="translate(50, 50)">
      <g transform="rotate(0)"><path d="M 0,0 C -16,-12 -20,-32 -7,-42 C -2,-45 0,-39 0,-39 C 0,-39 2,-45 7,-42 C 20,-32 16,-12 0,0 Z" fill="url(#pGrad)"/></g>
      <g transform="rotate(72)"><path d="M 0,0 C -16,-12 -20,-32 -7,-42 C -2,-45 0,-39 0,-39 C 0,-39 2,-45 7,-42 C 20,-32 16,-12 0,0 Z" fill="url(#pGrad)"/></g>
      <g transform="rotate(144)"><path d="M 0,0 C -16,-12 -20,-32 -7,-42 C -2,-45 0,-39 0,-39 C 0,-39 2,-45 7,-42 C 20,-32 16,-12 0,0 Z" fill="url(#pGrad)"/></g>
      <g transform="rotate(216)"><path d="M 0,0 C -16,-12 -20,-32 -7,-42 C -2,-45 0,-39 0,-39 C 0,-39 2,-45 7,-42 C 20,-32 16,-12 0,0 Z" fill="url(#pGrad)"/></g>
      <g transform="rotate(288)"><path d="M 0,0 C -16,-12 -20,-32 -7,-42 C -2,-45 0,-39 0,-39 C 0,-39 2,-45 7,-42 C 20,-32 16,-12 0,0 Z" fill="url(#pGrad)"/></g>
      <circle cx="0" cy="0" r="5.5" fill="#F7D070"/>
      <circle cx="-5" cy="-6" r="1.5" fill="#F7D070"/>
      <circle cx="5" cy="-6" r="1.5" fill="#F7D070"/>
      <circle cx="7" cy="3" r="1.5" fill="#F7D070"/>
      <circle cx="0" cy="7" r="1.5" fill="#F7D070"/>
      <circle cx="-7" cy="3" r="1.5" fill="#F7D070"/>
    </g>
  </svg>`,

  // 1: Loose single petal
  (cBase: string, cTip: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <defs>
      <linearGradient id="pGrad" x1="0%" y1="100%" x2="50%" y2="0%">
        <stop offset="0%" stop-color="${cBase}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="${cTip}" stop-opacity="0.9"/>
      </linearGradient>
    </defs>
    <g transform="translate(30, 30)">
      <path d="M 0,22 C -14,15 -22,-5 -8,-22 C -3,-26 0,-20 0,-20 C 0,-20 3,-26 8,-22 C 22,-5 14,15 0,22 Z" fill="url(#pGrad)"/>
      <path d="M 0,18 Q -2,0 0,-15" stroke="#EE8FAE" stroke-width="0.8" opacity="0.35" fill="none"/>
    </g>
  </svg>`,

  // 2: Small 4-petal flower
  (cBase: string, cTip: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs>
      <radialGradient id="pGrad" cx="50%" cy="80%" r="70%">
        <stop offset="0%" stop-color="${cBase}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="${cTip}" stop-opacity="0.9"/>
      </radialGradient>
    </defs>
    <g transform="translate(40, 40)">
      <g transform="rotate(0)"><path d="M 0,0 C -13,-9 -14,-26 0,-32 C 14,-26 13,-9 0,0 Z" fill="url(#pGrad)"/></g>
      <g transform="rotate(90)"><path d="M 0,0 C -13,-9 -14,-26 0,-32 C 14,-26 13,-9 0,0 Z" fill="url(#pGrad)"/></g>
      <g transform="rotate(180)"><path d="M 0,0 C -13,-9 -14,-26 0,-32 C 14,-26 13,-9 0,0 Z" fill="url(#pGrad)"/></g>
      <g transform="rotate(270)"><path d="M 0,0 C -13,-9 -14,-26 0,-32 C 14,-26 13,-9 0,0 Z" fill="url(#pGrad)"/></g>
      <circle cx="0" cy="0" r="4" fill="#F7D070"/>
    </g>
  </svg>`,

  // 3: Tiny bud
  (cBase: string, cTip: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <defs>
      <linearGradient id="pGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="${cBase}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="${cTip}" stop-opacity="0.9"/>
      </linearGradient>
    </defs>
    <g transform="translate(25, 25)">
      <path d="M -4,12 C -6,16 6,16 4,12 C 6,4 -6,4 -4,12 Z" fill="#D4B2A7" opacity="0.6"/>
      <path d="M -8,10 C -12,-2 -4,-18 0,-20 C 4,-18 12,-2 8,10 Z" fill="url(#pGrad)"/>
      <path d="M -3,8 C -6,-1 0,-15 3,-17 C 7,-10 5,2 -1,8 Z" fill="${cTip}" opacity="0.7"/>
    </g>
  </svg>`,
];

const PINK_COLOR_PALETTES = [
  { base: '#EE8FAE', tip: '#FDE3EA' },
  { base: '#F4A7BE', tip: '#F9C6D4' },
  { base: '#F9C6D4', tip: '#FFF1F5' },
  { base: '#FDE3EA', tip: '#FFFFFF' },
];

const FlowerRain = forwardRef<FlowerRainRef, {}>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isStoppedRef = useRef(false);

  // Allocation of Particle State in Typed Arrays (Zero Heap Churn)
  const pX = useRef(new Float32Array(MAX_PARTICLES));
  const pY = useRef(new Float32Array(MAX_PARTICLES));
  const pVx = useRef(new Float32Array(MAX_PARTICLES));
  const pVy = useRef(new Float32Array(MAX_PARTICLES));
  const pBaseVy = useRef(new Float32Array(MAX_PARTICLES));
  const pSize = useRef(new Float32Array(MAX_PARTICLES));
  const pAngleZ = useRef(new Float32Array(MAX_PARTICLES));
  const pVAngleZ = useRef(new Float32Array(MAX_PARTICLES));
  const pSwayPhase = useRef(new Float32Array(MAX_PARTICLES));
  const pSwaySpeed = useRef(new Float32Array(MAX_PARTICLES));
  const pSwayAmp = useRef(new Float32Array(MAX_PARTICLES));
  const pTumblePhaseX = useRef(new Float32Array(MAX_PARTICLES));
  const pTumbleSpeedX = useRef(new Float32Array(MAX_PARTICLES));
  const pTumblePhaseY = useRef(new Float32Array(MAX_PARTICLES));
  const pTumbleSpeedY = useRef(new Float32Array(MAX_PARTICLES));
  const pSpriteIdx = useRef(new Uint8Array(MAX_PARTICLES));
  const pLayer = useRef(new Uint8Array(MAX_PARTICLES)); // 0: far, 1: mid, 2: near
  const pOpacity = useRef(new Float32Array(MAX_PARTICLES));
  const pActive = useRef(new Uint8Array(MAX_PARTICLES));
  const pIsBurst = useRef(new Uint8Array(MAX_PARTICLES));
  const pBurstLife = useRef(new Float32Array(MAX_PARTICLES));

  // Pointer position & ripple state
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -999, y: -999, active: false });
  const rippleRef = useRef<{ x: number; y: number; radius: number; opacity: number; active: boolean }>({
    x: 0,
    y: 0,
    radius: 0,
    opacity: 0,
    active: false,
  });

  useImperativeHandle(ref, () => ({
    triggerBurst: (cx: number, cy: number) => {
      if (isStoppedRef.current) return;
      const burstCount = 32;
      let activated = 0;
      for (let i = 0; i < MAX_PARTICLES && activated < burstCount; i++) {
        if (!pActive.current[i] || pIsBurst.current[i]) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 4.0 + Math.random() * 6.5;

          pX.current[i] = cx;
          pY.current[i] = cy;
          pVx.current[i] = fastCos(angle) * speed;
          pVy.current[i] = fastSin(angle) * speed - 1.5;
          pBaseVy.current[i] = 1.2 + Math.random() * 1.4;
          pLayer.current[i] = Math.random() > 0.4 ? 2 : 1;
          pSize.current[i] = pLayer.current[i] === 2 ? 34 + Math.random() * 10 : 24 + Math.random() * 8;
          pSpriteIdx.current[i] = Math.floor(Math.random() * 16) + (pLayer.current[i] === 0 ? 0 : 16);
          pOpacity.current[i] = 0.95;
          pIsBurst.current[i] = 1;
          pBurstLife.current[i] = 1.8;
          pActive.current[i] = 1;
          activated++;
        }
      }
    },
    stop: () => {
      isStoppedRef.current = true;
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // High performance desynchronized context
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    // Detect environment capabilities
    const isMobile = window.innerWidth < 768;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const concurrency = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
    const deviceMemory = typeof navigator !== 'undefined' && (navigator as any).deviceMemory ? (navigator as any).deviceMemory : 4;
    const isLowEnd = concurrency <= 4 || deviceMemory <= 4;

    // Target particle counts
    let targetCount = TARGET_DESKTOP;
    if (reducedMotion) {
      targetCount = 15;
    } else if (isLowEnd) {
      targetCount = TARGET_LOW_END;
    } else if (isMobile) {
      targetCount = TARGET_MOBILE;
    }

    let currentActiveCount = targetCount;

    // ==========================================
    // STEP 2: PRE-RENDER MASTER SPRITE ATLAS
    // ==========================================
    // Master atlas grid: 8 columns x 6 rows = 48 cells (each cell 64x64)
    const atlasCanvas = document.createElement('canvas');
    atlasCanvas.width = 512;
    atlasCanvas.height = 384;
    const atlasCtx = atlasCanvas.getContext('2d');

    if (atlasCtx) {
      let spriteIdx = 0;
      // Layers: 0 (far - pre-blurred softly), 1 (mid), 2 (near)
      [0, 1, 2].forEach((layer) => {
        FLOWER_SVG_TEMPLATES.forEach((svgFunc, typeIdx) => {
          PINK_COLOR_PALETTES.forEach((palette) => {
            const svgStr = svgFunc(palette.base, palette.tip);
            const img = new Image();
            const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const cellX = (spriteIdx % 8) * 64;
            const cellY = Math.floor(spriteIdx / 8) * 64;

            img.onload = () => {
              URL.revokeObjectURL(url);
              atlasCtx.save();
              if (layer === 0) {
                // Far layer: bake soft blur by downscaling onto cell
                atlasCtx.globalAlpha = 0.65;
                atlasCtx.drawImage(img, cellX + 12, cellY + 12, 40, 40);
              } else {
                atlasCtx.globalAlpha = layer === 1 ? 0.85 : 0.95;
                atlasCtx.drawImage(img, cellX + 4, cellY + 4, 56, 56);
              }
              atlasCtx.restore();
            };
            img.src = url;
            spriteIdx++;
          });
        });
      });
    }

    // Initialize particle pool with pre-seeded positions across screen
    const initParticle = (i: number, w: number, h: number, preSeed = true) => {
      const layerRoll = Math.random();
      let layer = 1;
      let baseVy = 1.4;
      let size = 26;
      let opacity = 0.82;

      if (layerRoll < 0.44) {
        layer = 0; // Far
        size = 14 + Math.random() * 5;
        baseVy = 0.7 + Math.random() * 0.4;
        opacity = 0.5 + Math.random() * 0.15;
      } else if (layerRoll > 0.82) {
        layer = 2; // Near
        size = 36 + Math.random() * 10;
        baseVy = 2.2 + Math.random() * 0.9;
        opacity = 0.92 + Math.random() * 0.08;
      } else {
        layer = 1; // Mid
        size = 24 + Math.random() * 7;
        baseVy = 1.3 + Math.random() * 0.5;
        opacity = 0.78 + Math.random() * 0.12;
      }

      const variantOffset = Math.floor(Math.random() * 16);
      const spriteIdx = layer * 16 + variantOffset;

      pX.current[i] = Math.random() * (w + 120) - 60;
      pY.current[i] = preSeed ? Math.random() * (h + 120) - 60 : -60 - Math.random() * 50;
      pVx.current[i] = (Math.random() - 0.5) * 0.4;
      pVy.current[i] = baseVy;
      pBaseVy.current[i] = baseVy;
      pSize.current[i] = size;
      pAngleZ.current[i] = Math.random() * Math.PI * 2;
      pVAngleZ.current[i] = (Math.random() - 0.5) * 0.03;
      pSwayPhase.current[i] = Math.random() * Math.PI * 2;
      pSwaySpeed.current[i] = 0.01 + Math.random() * 0.015;
      pSwayAmp.current[i] = 0.8 + Math.random() * 1.2;
      pTumblePhaseX.current[i] = Math.random() * Math.PI * 2;
      pTumbleSpeedX.current[i] = 0.015 + Math.random() * 0.02;
      pTumblePhaseY.current[i] = Math.random() * Math.PI * 2;
      pTumbleSpeedY.current[i] = 0.015 + Math.random() * 0.02;
      pSpriteIdx.current[i] = spriteIdx;
      pLayer.current[i] = layer;
      pOpacity.current[i] = opacity;
      pActive.current[i] = i < currentActiveCount ? 1 : 0;
      pIsBurst.current[i] = 0;
      pBurstLife.current[i] = 0;
    };

    // Debounced Canvas Resize
    const updateCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const maxDpr = isMobile ? 1.5 : 2.0;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      for (let i = 0; i < MAX_PARTICLES; i++) {
        initParticle(i, width, height, true);
      }
    };

    updateCanvasSize();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateCanvasSize, 150);
    };

    window.addEventListener('resize', handleResize);

    // Mouse & Touch Interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (isLowEnd || reducedMotion) return;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleCanvasClick = (e: MouseEvent | TouchEvent) => {
      if (isLowEnd || reducedMotion) return;
      const cx = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      rippleRef.current.x = cx;
      rippleRef.current.y = cy;
      rippleRef.current.radius = 10;
      rippleRef.current.opacity = 0.4;
      rippleRef.current.active = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleCanvasClick, { passive: true });
    window.addEventListener('touchstart', handleCanvasClick, { passive: true });

    // ==========================================
    // STEP 4: ADAPTIVE QUALITY (FPS MONITOR)
    // ==========================================
    let fpsWindowTime = performance.now();
    let fpsFrameCount = 0;
    let lowFpsConsecutive = 0;
    let highFpsConsecutive = 0;
    let enableInteractions = !isLowEnd && !reducedMotion;

    // Delta-time loop state
    let lastTime = performance.now();
    let isTabVisible = true;
    let isCanvasIntersecting = true;

    const handleVisibility = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const observer = new IntersectionObserver(([entry]) => {
      isCanvasIntersecting = entry.isIntersecting;
    });
    observer.observe(canvas);

    // Main 60FPS Render Loop
    const render = (now: number) => {
      if (isStoppedRef.current || !isTabVisible || !isCanvasIntersecting) {
        animId = requestAnimationFrame(render);
        return;
      }

      let dt = (now - lastTime) / 1000;
      dt = Math.min(dt, 0.05); // Clamp dt to max 50ms
      lastTime = now;

      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Adaptive Quality Check every 1000ms
      fpsFrameCount++;
      if (now - fpsWindowTime >= 1000) {
        const avgFps = (fpsFrameCount * 1000) / (now - fpsWindowTime);
        fpsFrameCount = 0;
        fpsWindowTime = now;

        if (avgFps < 50) {
          lowFpsConsecutive++;
          highFpsConsecutive = 0;
          if (lowFpsConsecutive >= 2) {
            // Drop count by 20% down to floor of 40% target
            const minFloor = Math.floor(targetCount * 0.4);
            currentActiveCount = Math.max(minFloor, Math.floor(currentActiveCount * 0.8));
            enableInteractions = false;
          }
        } else if (avgFps > 58) {
          highFpsConsecutive++;
          lowFpsConsecutive = 0;
          if (highFpsConsecutive >= 5 && currentActiveCount < targetCount) {
            currentActiveCount = Math.min(targetCount, currentActiveCount + 10);
            if (currentActiveCount >= targetCount * 0.8) enableInteractions = !isLowEnd;
          }
        }
      }

      // Update Active Particles
      for (let i = 0; i < MAX_PARTICLES; i++) {
        if (i >= currentActiveCount && !pIsBurst.current[i]) {
          pActive.current[i] = 0;
          continue;
        } else {
          pActive.current[i] = 1;
        }
      }

      // Soft global wind vector
      const globalWind = reducedMotion ? 0 : fastSin(now * 0.0003) * 0.6;

      // Center clear zone ellipse (button + subtitle area)
      const centerX = width / 2;
      const centerY = height / 2;
      const clearZoneRx = Math.min(width * 0.45, 210);
      const clearZoneRy = 130;

      // Update & Draw Touch Ripple
      if (rippleRef.current.active && enableInteractions) {
        const r = rippleRef.current;
        r.radius += 180 * dt;
        r.opacity *= 0.94;

        if (r.radius < 200 && r.opacity > 0.02) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(244, 167, 190, ${r.opacity * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          r.active = false;
        }
      }

      // 3 Depth Pass Drawing: Pass 0 (far), Pass 1 (mid), Pass 2 (near)
      for (let layerPass = 0; layerPass < 3; layerPass++) {
        for (let i = 0; i < MAX_PARTICLES; i++) {
          if (!pActive.current[i] || pLayer.current[i] !== layerPass) continue;

          if (reducedMotion) {
            pY.current[i] += 0.5;
            if (pY.current[i] > height + 40) pY.current[i] = -40;
          } else {
            // Normal Physics Step
            if (pIsBurst.current[i]) {
              pX.current[i] += pVx.current[i] * dt * 60;
              pY.current[i] += pVy.current[i] * dt * 60;
              pVx.current[i] *= 0.96;
              pVy.current[i] = pVy.current[i] * 0.96 + pBaseVy.current[i] * 0.04;
              pBurstLife.current[i] -= dt;
              if (pBurstLife.current[i] <= 0) {
                pIsBurst.current[i] = 0;
                initParticle(i, width, height, false);
                continue;
              }
            } else {
              pSwayPhase.current[i] += pSwaySpeed.current[i];
              const sway = fastSin(pSwayPhase.current[i]) * pSwayAmp.current[i];

              pVx.current[i] = pVx.current[i] * 0.92 + (sway * 0.12 + globalWind * 0.3) * 0.08;
              pVy.current[i] = pVy.current[i] * 0.95 + pBaseVy.current[i] * 0.05;

              // Cursor avoidance (only on mid/near layers)
              if (enableInteractions && mouseRef.current.active && layerPass >= 1) {
                const dx = pX.current[i] - mouseRef.current.x;
                const dy = pY.current[i] - mouseRef.current.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 14400 && distSq > 1) { // 120px radius
                  const push = (1 - Math.sqrt(distSq) / 120) * 1.2;
                  pVx.current[i] += (dx / Math.sqrt(distSq)) * push;
                }
              }

              // Touch ripple impulse (only on mid/near layers)
              if (enableInteractions && rippleRef.current.active && layerPass >= 1) {
                const r = rippleRef.current;
                const dx = pX.current[i] - r.x;
                const dy = pY.current[i] - r.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (Math.abs(dist - r.radius) < 30 && dist > 1) {
                  const push = (1 - Math.abs(dist - r.radius) / 30) * 2.0;
                  pVx.current[i] += (dx / dist) * push;
                  pVy.current[i] += (dy / dist) * push;
                }
              }

              // Clear zone soft outward push
              const cdx = (pX.current[i] - centerX) / clearZoneRx;
              const cdy = (pY.current[i] - centerY) / clearZoneRy;
              const cDistSq = cdx * cdx + cdy * cdy;
              if (cDistSq < 1) {
                const push = (1 - Math.sqrt(cDistSq)) * 0.2;
                pVx.current[i] += (pX.current[i] > centerX ? 1 : -1) * push;
              }

              pX.current[i] += pVx.current[i] * dt * 60;
              pY.current[i] += pVy.current[i] * dt * 60;

              pAngleZ.current[i] += pVAngleZ.current[i];
              pTumblePhaseX.current[i] += pTumbleSpeedX.current[i];
              pTumblePhaseY.current[i] += pTumbleSpeedY.current[i];

              // Recycle offscreen particle back to top
              if (pY.current[i] > height + 60 || pX.current[i] < -100 || pX.current[i] > width + 100) {
                initParticle(i, width, height, false);
              }
            }
          }

          // Skip drawing if outside viewport
          const px = pX.current[i];
          const py = pY.current[i];
          if (px < -60 || px > width + 60 || py < -60 || py > height + 60) continue;

          // Clear Zone Opacity Dampening
          const cdx = (px - centerX) / clearZoneRx;
          const cdy = (py - centerY) / clearZoneRy;
          const cDistSq = cdx * cdx + cdy * cdy;
          let opacityMult = 1;
          if (cDistSq < 1) {
            opacityMult = 0.45 + 0.55 * Math.sqrt(cDistSq);
          }

          // Calculate 2D Scale Tumble Transformation
          const sz = pSize.current[i];
          const angleZ = pAngleZ.current[i];
          const cosA = fastCos(angleZ);
          const sinA = fastSin(angleZ);
          const scaleX = reducedMotion ? 1 : fastCos(pTumblePhaseX.current[i]);
          const scaleY = reducedMotion ? 1 : fastCos(pTumblePhaseY.current[i]);
          const absScaleX = Math.max(0.18, Math.abs(scaleX)) * Math.sign(scaleX || 1);

          // Get Sprite Atlas Source Rect (64x64 per cell)
          const sIdx = pSpriteIdx.current[i];
          const sx = (sIdx % 8) * 64;
          const sy = Math.floor(sIdx / 8) * 64;

          // Single fast 2D Affine Matrix Transform (zero save/restore)
          ctx.setTransform(
            absScaleX * cosA * dpr,
            absScaleX * sinA * dpr,
            -scaleY * sinA * dpr,
            scaleY * cosA * dpr,
            px * dpr,
            py * dpr,
          );
          ctx.globalAlpha = pOpacity.current[i] * opacityMult;
          ctx.drawImage(atlasCanvas, sx, sy, 64, 64, -sz / 2, -sz / 2, sz, sz);
        }
      }

      // Reset transform once after loop
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('touchstart', handleCanvasClick);
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
    />
  );
});

FlowerRain.displayName = 'FlowerRain';

export default FlowerRain;
