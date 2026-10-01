'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMousePosition } from '@/hooks/useMousePosition';

const PALETTE = ['#FFD35A', '#7CC6FE', '#7EE0B5', '#FF9F43', '#8E9BFF'];

type DepthLayer = 'far' | 'mid' | 'near';

interface Shape {
  type: 'circle' | 'triangle' | 'star' | 'ribbon' | 'diamond' | 'ring';
  color: string;
  size: number;
  x: number;
  y: number;
  rotation: number;
  depth: number;
  layer: DepthLayer;
  animDelay: number;
  animDuration: number;
  opacity: number;
}

function ShapeSVG({ type, color, size, opacity }: { type: Shape['type']; color: string; size: number; opacity: number }) {
  switch (type) {
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={color} opacity={opacity} />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 22,20 2,20" fill={color} opacity={opacity} />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polygon
            points="12,2 14.5,8.5 21.5,9.5 16.5,14.5 17.5,21.5 12,18 6.5,21.5 7.5,14.5 2.5,9.5 9.5,8.5"
            fill={color}
            opacity={opacity}
          />
        </svg>
      );
    case 'ribbon':
      return (
        <svg width={size} height={size * 2} viewBox="0 0 12 24" fill="none">
          <path
            d="M2 0 C6 4, 6 8, 2 12 C-2 16, -2 20, 2 24"
            stroke={color}
            strokeWidth="2.5"
            fill="none"
            opacity={opacity}
            strokeLinecap="round"
          />
        </svg>
      );
    case 'diamond':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 22,12 12,22 2,12" fill={color} opacity={opacity} />
        </svg>
      );
    case 'ring':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="3" fill="none" opacity={opacity} />
        </svg>
      );
  }
}

export default function ConfettiShapes() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const mouse = useMousePosition();
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const types: Shape['type'][] = ['circle', 'triangle', 'star', 'ribbon', 'diamond', 'ring'];
    const count = isMobile ? 22 : 48;

    const layerConfig: Record<DepthLayer, { sizeRange: [number, number]; opacityRange: [number, number]; blur: number; depthRange: [number, number] }> = {
      far:  { sizeRange: [6, 10],  opacityRange: [0.3, 0.5],  blur: 0, depthRange: [0.1, 0.3] },
      mid:  { sizeRange: [10, 18], opacityRange: [0.5, 0.75], blur: 0, depthRange: [0.3, 0.6] },
      near: { sizeRange: [14, 24], opacityRange: [0.7, 0.95], blur: 0, depthRange: [0.6, 1.0] },
    };

    const layers: DepthLayer[] = ['far', 'mid', 'mid', 'near'];

    setShapes(
      Array.from({ length: count }, (_, i) => {
        const layer = layers[i % layers.length];
        const cfg = layerConfig[layer];
        const size = cfg.sizeRange[0] + Math.random() * (cfg.sizeRange[1] - cfg.sizeRange[0]);
        const opacity = cfg.opacityRange[0] + Math.random() * (cfg.opacityRange[1] - cfg.opacityRange[0]);
        const depth = cfg.depthRange[0] + Math.random() * (cfg.depthRange[1] - cfg.depthRange[0]);

        return {
          type: types[i % types.length],
          color: PALETTE[i % PALETTE.length],
          size,
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          depth,
          layer,
          animDelay: Math.random() * 8,
          animDuration: 10 + Math.random() * 12,
          opacity,
        };
      }),
    );
  }, [isMobile]);

  if (shapes.length === 0) return null;

  if (reduced) {
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-[1]">
        {shapes.slice(0, 12).map((s, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `rotate(${s.rotation}deg)`,
              opacity: s.opacity * 0.6,
            }}
          >
            <ShapeSVG type={s.type} color={s.color} size={s.size} opacity={1} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-[1]">
      {shapes.map((s, i) => {
        const parallaxX = mouse.normalizedX * s.depth * 20;
        const parallaxY = mouse.normalizedY * s.depth * 15;
        const filterBlur = !isMobile && s.layer === 'far' ? 'blur(1px)' : 'none';

        return (
          <div
            key={i}
            className="absolute confetti-drift"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0) rotate(${s.rotation}deg)`,
              animationDelay: `${s.animDelay}s`,
              animationDuration: `${s.animDuration}s`,
              willChange: 'transform',
              filter: filterBlur,
            }}
          >
            <ShapeSVG type={s.type} color={s.color} size={s.size} opacity={s.opacity} />
          </div>
        );
      })}
    </div>
  );
}
