'use client';

import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MarqueeRibbonProps {
  text?: string;
  separator?: string;
}

export default function MarqueeRibbon({
  text = 'HAPPY BIRTHDAY SHREYA',
  separator = ' ✦ ',
}: MarqueeRibbonProps) {
  const reduced = useReducedMotion();

  const repeatedText = Array(12).fill(`${text}${separator}`).join('');

  return (
    <div
      className="relative overflow-hidden py-4"
      style={{
        transform: 'rotate(-1.5deg)',
        background: 'linear-gradient(90deg, #FFD35A, #7CC6FE, #7EE0B5, #8E9BFF, #FFD35A)',
        margin: '2rem -2rem',
      }}
      aria-hidden="true"
    >
      {/* Row 1 - scrolls left */}
      <div
        className="whitespace-nowrap"
        style={{
          animation: reduced ? 'none' : 'marquee-scroll-left 30s linear infinite',
          fontFamily: 'var(--font-manrope), sans-serif',
          fontWeight: 700,
          fontSize: '0.85rem',
          letterSpacing: '0.15em',
          color: '#1F2340',
          opacity: 0.85,
        }}
      >
        {repeatedText}
      </div>
      {/* Row 2 - scrolls right */}
      <div
        className="whitespace-nowrap mt-1"
        style={{
          animation: reduced ? 'none' : 'marquee-scroll-right 35s linear infinite',
          fontFamily: 'var(--font-manrope), sans-serif',
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.12em',
          color: 'rgba(31,35,64,0.5)',
        }}
      >
        {repeatedText}
      </div>
    </div>
  );
}
