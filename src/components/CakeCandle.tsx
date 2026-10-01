'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import { candleMomentText } from '@/content/wishes';
import { SPRING_PLAYFUL, EASE_PRIMARY, DURATION } from '@/lib/easing';

export default function CakeCandle() {
  const [blown, setBlown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const handleBlow = () => {
    if (blown) return;
    setBlown(true);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#FFD35A', '#7CC6FE', '#7EE0B5', '#FF9F43', '#8E9BFF'],
    });
  };

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-6 py-12"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: DURATION.normal, ease: EASE_PRIMARY }}
    >
      <p
        className="text-lg sm:text-xl text-center max-w-sm"
        style={{
          fontFamily: 'var(--font-fraunces)',
          color: '#1F2340',
          opacity: 0.8,
        }}
      >
        {candleMomentText}
      </p>

      {/* Cake + candle SVG */}
      <button
        onClick={handleBlow}
        className="relative outline-none cursor-pointer"
        aria-label="Blow out the candle"
        data-hoverable
      >
        <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
          {/* Cake body */}
          <rect x="20" y="70" width="80" height="50" rx="8" fill="#FFD35A" />
          <rect x="15" y="65" width="90" height="15" rx="6" fill="#FF9F43" />
          {/* Frosting drips */}
          <path
            d="M25 80 Q30 95 35 80 Q40 95 45 80 Q50 95 55 80 Q60 95 65 80 Q70 95 75 80 Q80 95 85 80 Q90 95 95 80"
            stroke="#FFFBF2"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Candle */}
          <rect x="55" y="30" width="10" height="35" rx="3" fill="#8E9BFF" />
          <rect x="57" y="32" width="3" height="31" rx="1.5" fill="#7CC6FE" opacity="0.4" />

          {/* Flame or smoke */}
          <AnimatePresence mode="wait">
            {!blown ? (
              <motion.g
                key="flame"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.1, 0.95, 1.05, 1], opacity: 1 }}
                exit={{ scale: 0, opacity: 0, y: -10 }}
                transition={{
                  scale: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
                  opacity: { duration: 0.3 },
                }}
                style={{ originX: '60px', originY: '30px' }}
              >
                <ellipse cx="60" cy="20" rx="7" ry="12" fill="#FFD35A" />
                <ellipse cx="60" cy="18" rx="4" ry="8" fill="#FF9F43" />
                <ellipse cx="60" cy="16" rx="2" ry="5" fill="#FFFBF2" />
                {/* Glow */}
                <circle cx="60" cy="22" r="18" fill="#FFD35A" opacity="0.15" />
              </motion.g>
            ) : (
              <motion.g
                key="smoke"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.6, 0.3, 0], y: [0, -20, -40] }}
                transition={{ duration: 2, ease: EASE_PRIMARY }}
              >
                <circle cx="60" cy="20" r="4" fill="#1F2340" opacity="0.15" />
                <circle cx="58" cy="14" r="3" fill="#1F2340" opacity="0.1" />
                <circle cx="63" cy="8" r="2" fill="#1F2340" opacity="0.05" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Decorative dots on cake */}
          <circle cx="35" cy="90" r="3" fill="#7EE0B5" />
          <circle cx="55" cy="95" r="2.5" fill="#7CC6FE" />
          <circle cx="75" cy="88" r="3" fill="#8E9BFF" />
          <circle cx="85" cy="100" r="2" fill="#FFD35A" />
          <circle cx="45" cy="105" r="2.5" fill="#FF9F43" />
        </svg>

        {!blown && (
          <motion.span
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-50 whitespace-nowrap tracking-wider uppercase"
            style={{ fontFamily: 'var(--font-manrope)', color: '#1F2340' }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Tap to blow
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {blown && (
          <motion.p
            className="text-base sm:text-lg text-center font-medium mt-2"
            style={{ color: '#FFD35A', fontFamily: 'var(--font-fraunces)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_PLAYFUL}
          >
            ✦ Wish made! ✦
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
