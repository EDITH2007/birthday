'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMousePosition } from '@/hooks/useMousePosition';

const PALETTE = ['#FFD35A', '#7CC6FE', '#7EE0B5', '#FF9F43', '#8E9BFF'];

interface Shape {
  type: 'circle' | 'triangle' | 'star' | 'ribbon';
  color: string;
  size: number;
  x: number;
  y: number;
  rotation: number;
  depth: number; // 0–1 for parallax
  animDelay: number;
  animDuration: number;
}

function ShapeSVG({ type, color, size }: { type: Shape['type']; color: string; size: number }) {
  switch (type) {
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={color} opacity="0.7" />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 22,20 2,20" fill={color} opacity="0.6" />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polygon
            points="12,2 14.5,8.5 21.5,9.5 16.5,14.5 17.5,21.5 12,18 6.5,21.5 7.5,14.5 2.5,9.5 9.5,8.5"
            fill={color}
            opacity="0.6"
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
            opacity="0.5"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

export default function ConfettiShapes() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const mouse = useMousePosition();
  const [shapes, setShapes] = useState<Shape[]>([]);

  // Generate random shapes only on client after mount to avoid hydration mismatch
  useEffect(() => {
    const types: Shape['type'][] = ['circle', 'triangle', 'star', 'ribbon'];
    const count = isMobile ? 18 : 35;

    setShapes(
      Array.from({ length: count }, (_, i) => ({
        type: types[i % types.length],
        color: PALETTE[i % PALETTE.length],
        size: 10 + Math.random() * 18,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        depth: 0.2 + Math.random() * 0.8,
        animDelay: Math.random() * 8,
        animDuration: 12 + Math.random() * 10,
      })),
    );
  }, [isMobile]);

  if (shapes.length === 0) return null;

  if (reduced) {
    // Static confetti, no animation
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-[1]">
        {shapes.slice(0, 10).map((s, i) => (
          <div
            key={i}
            className="absolute opacity-40"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `rotate(${s.rotation}deg)`,
            }}
          >
            <ShapeSVG type={s.type} color={s.color} size={s.size} />
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
            }}
          >
            <ShapeSVG type={s.type} color={s.color} size={s.size} />
          </div>
        );
      })}
    </div>
  );
}
