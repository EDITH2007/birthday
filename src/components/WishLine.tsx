'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASE_PRIMARY, SPRING_PLAYFUL, DURATION } from '@/lib/easing';
import type { WishLine as WishLineType } from '@/content/wishes';

interface Props {
  wish: WishLineType;
  index: number;
}

type CardStyle = 'quote' | 'ticket' | 'sticky' | 'polaroid' | 'bubble';

const CARD_STYLES: CardStyle[] = ['quote', 'ticket', 'sticky', 'polaroid', 'bubble'];
const ACCENT_COLORS = ['#FFD35A', '#7CC6FE', '#7EE0B5', '#FF9F43', '#8E9BFF'];

function QuoteCard({ text, color }: { text: string; color: string }) {
  return (
    <div
      className="relative py-6 px-6 sm:px-8 rounded-2xl"
      style={{
        background: '#FFFBF2',
        border: '2px solid rgba(31,35,64,0.08)',
        boxShadow: '0 4px 20px rgba(31,35,64,0.06)',
      }}
    >
      {/* Oversized serif quotation mark */}
      <span
        className="absolute -top-4 left-3 text-7xl sm:text-8xl leading-none select-none"
        style={{
          fontFamily: 'var(--font-fraunces)',
          color,
          opacity: 0.35,
        }}
      >
        &ldquo;
      </span>
      <p
        className="text-xl sm:text-2xl md:text-3xl leading-relaxed relative z-10"
        style={{
          fontFamily: 'var(--font-fraunces)',
          color: '#1F2340',
        }}
      >
        {text}
      </p>
      <div
        className="mt-4 h-1 w-16 rounded-full"
        style={{ background: color, opacity: 0.7 }}
      />
    </div>
  );
}

function TicketCard({ text, color }: { text: string; color: string }) {
  return (
    <div
      className="relative rounded-xl overflow-hidden"
      style={{
        background: '#FFFBF2',
        border: `2px solid ${color}`,
        boxShadow: `0 4px 16px rgba(31,35,64,0.06)`,
      }}
    >
      {/* Notch cutouts */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
        style={{ background: 'var(--color-base)' }}
      />
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full"
        style={{ background: 'var(--color-base)' }}
      />
      <div className="px-8 sm:px-10 py-6">
        <div
          className="text-[10px] tracking-[0.2em] uppercase font-bold mb-3"
          style={{ color, fontFamily: 'var(--font-manrope)' }}
        >
          ✦ Birthday Wish ✦
        </div>
        <p
          className="text-lg sm:text-xl md:text-2xl leading-relaxed"
          style={{
            fontFamily: 'var(--font-fraunces)',
            color: '#1F2340',
          }}
        >
          {text}
        </p>
        {/* Dashed border */}
        <div
          className="mt-4 border-t border-dashed"
          style={{ borderColor: `${color}40` }}
        />
        <div
          className="mt-2 text-[9px] tracking-widest uppercase text-right"
          style={{ color: '#1F2340', opacity: 0.3, fontFamily: 'var(--font-manrope)' }}
        >
          ADMIT ONE
        </div>
      </div>
    </div>
  );
}

function StickyNoteCard({ text, color }: { text: string; color: string }) {
  return (
    <div className="relative">
      {/* Tape piece */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 rounded-sm opacity-80 z-10"
        style={{
          background: `${color}`,
          transform: 'translate(-50%, 0) rotate(-2deg)',
        }}
      />
      <div
        className="rounded-lg px-6 sm:px-8 py-8 relative"
        style={{
          background: '#FFFBF2',
          border: `2px solid ${color}`,
          boxShadow: `0 4px 20px rgba(31,35,64,0.08)`,
          transform: 'rotate(-0.5deg)',
        }}
      >
        <p
          className="text-lg sm:text-xl md:text-2xl leading-relaxed"
          style={{
            fontFamily: 'var(--font-fraunces)',
            color: '#1F2340',
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function PolaroidNoteCard({ text, color }: { text: string; color: string }) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: '#FFFBF2',
        padding: '20px 20px 24px',
        boxShadow: '0 4px 20px rgba(31,35,64,0.08)',
        transform: 'rotate(1deg)',
      }}
    >
      {/* Top gradient band */}
      <div
        className="h-1 w-full rounded-full mb-5"
        style={{
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
      <p
        className="text-lg sm:text-xl md:text-2xl leading-relaxed"
        style={{
          fontFamily: 'var(--font-fraunces)',
          color: '#1F2340',
        }}
      >
        {text}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1L7.2 4.3L10.8 4.8L8.1 7.3L8.7 10.8L6 9.2L3.3 10.8L3.9 7.3L1.2 4.8L4.8 4.3Z" fill={color} />
        </svg>
        <span
          className="text-[10px] tracking-wider uppercase"
          style={{ color: '#1F2340', opacity: 0.3, fontFamily: 'var(--font-manrope)' }}
        >
          with love
        </span>
      </div>
    </div>
  );
}

function SpeechBubbleCard({ text, color }: { text: string; color: string }) {
  return (
    <div className="relative">
      <div
        className="rounded-2xl px-6 sm:px-8 py-6 relative"
        style={{
          background: '#FFFBF2',
          border: `2px solid ${color}40`,
          boxShadow: `0 4px 16px ${color}10`,
        }}
      >
        <p
          className="text-lg sm:text-xl md:text-2xl leading-relaxed"
          style={{
            fontFamily: 'var(--font-fraunces)',
            color: '#1F2340',
          }}
        >
          {text}
        </p>
      </div>
      {/* Speech bubble tail */}
      <svg
        className="absolute -bottom-4 left-8"
        width="24"
        height="16"
        viewBox="0 0 24 16"
        fill="none"
      >
        <path d="M0 0L12 16L24 0" fill="#FFFBF2" stroke={`${color}40`} strokeWidth="2" />
        <path d="M1 0L12 14L23 0" fill="#FFFBF2" />
      </svg>
    </div>
  );
}

export default function WishLine({ wish, index }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotion();

  const direction = index % 2 === 0 ? 1 : -1;
  const cardStyle = CARD_STYLES[index % CARD_STYLES.length];
  const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];

  const variants = {
    mask: {
      hidden: { clipPath: 'inset(0 100% 0 0)' },
      visible: {
        clipPath: 'inset(0 0% 0 0)',
        transition: { duration: DURATION.slow, ease: EASE_PRIMARY },
      },
    },
    slide: {
      hidden: { opacity: 0, x: 60 * direction },
      visible: {
        opacity: 1,
        x: 0,
        transition: { ...SPRING_PLAYFUL, delay: 0.1 },
      },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.85 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { ...SPRING_PLAYFUL, delay: 0.1 },
      },
    },
  };

  const animType = wish.animation || 'slide';
  const chosen = variants[animType];

  const renderCard = () => {
    switch (cardStyle) {
      case 'quote':
        return <QuoteCard text={wish.text} color={accentColor} />;
      case 'ticket':
        return <TicketCard text={wish.text} color={accentColor} />;
      case 'sticky':
        return <StickyNoteCard text={wish.text} color={accentColor} />;
      case 'polaroid':
        return <PolaroidNoteCard text={wish.text} color={accentColor} />;
      case 'bubble':
        return <SpeechBubbleCard text={wish.text} color={accentColor} />;
    }
  };

  if (reduced) {
    return (
      <div ref={ref} className="wish-line-container py-8 sm:py-12">
        {renderCard()}
      </div>
    );
  }

  return (
    <div ref={ref} className="wish-line-container py-8 sm:py-12 relative">
      <motion.div
        initial={chosen.hidden}
        animate={inView ? chosen.visible : chosen.hidden}
      >
        {renderCard()}
      </motion.div>

      {/* Decorative floating shape behind */}
      <motion.div
        className="absolute -z-10 pointer-events-none hidden sm:block"
        style={{
          top: '50%',
          [index % 2 === 0 ? 'right' : 'left']: '0px',
          transform: 'translateY(-50%)',
        }}
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={
          inView
            ? { opacity: 0.15, scale: 1, rotate: 0 }
            : { opacity: 0, scale: 0.5, rotate: -20 }
        }
        transition={{ duration: DURATION.normal, ease: EASE_PRIMARY, delay: 0.3 }}
      >
        <svg width="60" height="60" viewBox="0 0 80 80">
          {index % 3 === 0 && <circle cx="40" cy="40" r="35" fill="#FFD35A" />}
          {index % 3 === 1 && <circle cx="40" cy="40" r="35" fill="#7CC6FE" />}
          {index % 3 === 2 && (
            <polygon points="40,5 75,65 5,65" fill="#7EE0B5" />
          )}
        </svg>
      </motion.div>
    </div>
  );
}
