'use client';

import { useEffect, useState } from 'react';
import Sticker, { type StickerConfig } from './Sticker';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface StickerLayerProps {
  stickers: StickerConfig[];
  /** Max visible on mobile */
  mobileMax?: number;
}

export default function StickerLayer({ stickers, mobileMax = 5 }: StickerLayerProps) {
  const mouse = useMousePosition();
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!isMobile) return;
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [isMobile]);

  // On mobile, limit visible stickers
  const visibleStickers = isMobile
    ? stickers.filter((s) => !s.hideOnMobile).slice(0, mobileMax)
    : stickers;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 3 }}
    >
      {visibleStickers.map((config, i) => (
        <Sticker
          key={`${config.id}-${i}`}
          config={config}
          mouseX={mouse.normalizedX}
          mouseY={mouse.normalizedY}
          scrollY={scrollY}
        />
      ))}
    </div>
  );
}
