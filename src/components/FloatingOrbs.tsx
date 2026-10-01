'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Orb {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
}

/* Only butter-yellow, sky-blue, mint and periwinkle — NO pink/peach/tangerine in glows */
const COLORS = [
  'rgba(255, 211, 90, 0.28)',
  'rgba(124, 198, 254, 0.25)',
  'rgba(126, 224, 181, 0.22)',
  'rgba(142, 155, 255, 0.20)',
];

export default function FloatingOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [orbs, setOrbs] = useState<Orb[]>([]);

  useEffect(() => {
    const count = isMobile ? 3 : 6;
    setOrbs(
      Array.from({ length: count }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: isMobile ? 140 + Math.random() * 140 : 200 + Math.random() * 200,
        color: COLORS[i % COLORS.length],
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.25,
      })),
    );
  }, [isMobile]);

  const rafRef = useRef<number>(0);
  const orbPosRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (reduced || orbs.length === 0) return;

    orbPosRef.current = orbs.map((o) => ({ x: o.x, y: o.y }));

    const animate = () => {
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const container = containerRef.current;
      if (!container) return;
      const children = container.children;

      orbPosRef.current.forEach((pos, i) => {
        const orb = orbs[i];
        pos.x += orb.speedX * 0.04;
        pos.y += orb.speedY * 0.04;

        if (pos.x > 110) pos.x = -10;
        if (pos.x < -10) pos.x = 110;
        if (pos.y > 110) pos.y = -10;
        if (pos.y < -10) pos.y = 110;

        const el = children[i] as HTMLElement;
        if (el) {
          el.style.transform = `translate3d(${pos.x}%, ${pos.y}%, 0)`;
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [orbs, reduced]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            filter: isMobile ? 'blur(20px)' : 'blur(45px)',
            willChange: 'transform',
            left: `${orb.x}%`,
            top: `${orb.y}%`,
          }}
        />
      ))}
    </div>
  );
}

