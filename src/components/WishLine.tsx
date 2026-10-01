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

export default function WishLine({ wish, index }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotion();

  const direction = index % 2 === 0 ? 1 : -1;

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

  if (reduced) {
    return (
      <div ref={ref} className="wish-line-container py-8 sm:py-12">
        <p
          className="text-xl sm:text-2xl md:text-3xl leading-relaxed"
          style={{
            fontFamily: 'var(--font-fraunces)',
            color: '#1F2340',
          }}
        >
          {wish.text}
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="wish-line-container py-8 sm:py-12">
      <motion.p
        className="text-xl sm:text-2xl md:text-3xl leading-relaxed"
        style={{
          fontFamily: 'var(--font-fraunces)',
          color: '#1F2340',
        }}
        initial={chosen.hidden}
        animate={inView ? chosen.visible : chosen.hidden}
      >
        {wish.text}
      </motion.p>

      {/* Decorative floating shape behind */}
      <motion.div
        className="absolute -z-10"
        style={{
          top: '50%',
          [index % 2 === 0 ? 'right' : 'left']: '-20px',
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
        <svg width="80" height="80" viewBox="0 0 80 80">
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
