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

    // Screen-wide ripple effect via confetti cannons from both sides
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { x: 0.5, y: 0.45 },
      colors: ['#FFD35A', '#7CC6FE', '#7EE0B5', '#FF9F43', '#8E9BFF'],
    });

    // Spark burst
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 120,
        startVelocity: 35,
        shapes: ['star'],
        origin: { x: 0.5, y: 0.4 },
        colors: ['#FFD35A', '#8E9BFF', '#FFFBF2'],
        gravity: 0.6,
      });
    }, 200);
  };

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-8 py-16 relative"
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

      {/* Large detailed cake + candle */}
      <button
        onClick={handleBlow}
        className="relative outline-none cursor-pointer group p-4 rounded-3xl touch-manipulation flex flex-col items-center"
        aria-label="Blow out the candle"
        data-hoverable
      >
        {/* Candle glow */}
        {!blown && (
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,211,90,0.3) 0%, transparent 70%)',
              animation: 'pulse-halo 2s ease-in-out infinite',
            }}
          />
        )}

        <svg className="w-[65vw] max-w-[200px] h-auto" viewBox="0 0 180 210" fill="none">
          {/* Plate */}
          <ellipse cx="90" cy="190" rx="80" ry="12" fill="#1F2340" opacity="0.06" />

          {/* Cake base layer */}
          <rect x="30" y="120" width="120" height="60" rx="12" fill="#FFD35A" stroke="#FFFFFF" strokeWidth="3" />
          {/* Cake middle layer */}
          <rect x="40" y="90" width="100" height="40" rx="10" fill="#FF9F43" stroke="#FFFFFF" strokeWidth="3" />
          {/* Cake top layer */}
          <rect x="50" y="68" width="80" height="30" rx="8" fill="#7CC6FE" stroke="#FFFFFF" strokeWidth="3" />

          {/* Frosting drips */}
          <path
            d="M40 92Q48 108 56 92Q64 108 72 92Q80 108 88 92Q96 108 104 92Q112 108 120 92Q128 108 136 92"
            stroke="#FFFBF2"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M50 70Q56 80 62 70Q68 80 74 70Q80 80 86 70Q92 80 98 70Q104 80 110 70Q116 80 122 70"
            stroke="#FFFBF2"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Candle */}
          <rect x="82" y="30" width="16" height="40" rx="4" fill="#8E9BFF" stroke="#FFFFFF" strokeWidth="3" />
          <rect x="86" y="34" width="5" height="32" rx="2.5" fill="#7CC6FE" opacity="0.4" />
          {/* Candle stripe */}
          <path d="M82 45H98" stroke="#FFFBF2" strokeWidth="1.5" opacity="0.4" />
          <path d="M82 55H98" stroke="#FFFBF2" strokeWidth="1.5" opacity="0.4" />

          {/* Flame or smoke */}
          <AnimatePresence mode="wait">
            {!blown ? (
              <motion.g
                key="flame"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0, y: -15 }}
                transition={{
                  scale: { duration: 0.3 },
                  opacity: { duration: 0.3 },
                }}
                style={{ originX: '90px', originY: '30px' }}
              >
                <g style={{ animation: 'flame-flicker 0.8s ease-in-out infinite', transformOrigin: '90px 30px' }}>
                  {/* Outer flame */}
                  <ellipse cx="90" cy="18" rx="10" ry="16" fill="#FFD35A" stroke="#FFFFFF" strokeWidth="2" />
                  {/* Mid flame */}
                  <ellipse cx="90" cy="16" rx="6" ry="11" fill="#FF9F43" />
                  {/* Inner flame core */}
                  <ellipse cx="90" cy="14" rx="3" ry="7" fill="#FFFBF2" />
                  {/* Glow rings */}
                  <circle cx="90" cy="20" r="22" fill="#FFD35A" opacity="0.1" />
                  <circle cx="90" cy="20" r="30" fill="#FFD35A" opacity="0.05" />
                </g>
              </motion.g>
            ) : (
              <motion.g
                key="smoke"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.7, 0.4, 0.15, 0], y: [0, -15, -30, -50] }}
                transition={{ duration: 2.5, ease: EASE_PRIMARY }}
              >
                <circle cx="90" cy="24" r="5" fill="#1F2340" opacity="0.12" />
                <circle cx="86" cy="16" r="4" fill="#1F2340" opacity="0.08" />
                <circle cx="94" cy="10" r="3" fill="#1F2340" opacity="0.05" />
                <circle cx="88" cy="4" r="2.5" fill="#1F2340" opacity="0.03" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Decorative elements on cake */}
          <circle cx="50" cy="140" r="4" fill="#7EE0B5" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="75" cy="148" r="3.5" fill="#7CC6FE" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="105" cy="135" r="4" fill="#8E9BFF" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="130" cy="150" r="3" fill="#FFD35A" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="60" cy="160" r="3.5" fill="#FF9F43" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="115" cy="162" r="3" fill="#7EE0B5" stroke="#FFFFFF" strokeWidth="2" />

          {/* Sprinkle lines */}
          <line x1="58" y1="100" x2="62" y2="96" stroke="#FFD35A" strokeWidth="2" strokeLinecap="round" />
          <line x1="78" y1="98" x2="82" y2="102" stroke="#8E9BFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="96" y1="96" x2="100" y2="100" stroke="#7EE0B5" strokeWidth="2" strokeLinecap="round" />
          <line x1="116" y1="100" x2="120" y2="96" stroke="#7CC6FE" strokeWidth="2" strokeLinecap="round" />

          {/* Stars on top */}
          <polygon points="60,78 62,74 64,78 60,76 64,76" fill="#FFD35A" opacity="0.6" />
          <polygon points="115,76 117,72 119,76 115,74 119,74" fill="#FFD35A" opacity="0.6" />
        </svg>

        {!blown && (
          <motion.span
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap tracking-wider uppercase"
            style={{ fontFamily: 'var(--font-manrope)', color: '#1F2340' }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Tap to blow
          </motion.span>
        )}
      </button>

      {/* Screen-wide ripple effect on blow */}
      <AnimatePresence>
        {blown && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.15, 0] }}
            transition={{ duration: 1.2, ease: EASE_PRIMARY }}
            style={{
              background: 'radial-gradient(circle at 50% 45%, rgba(255,211,90,0.3), transparent 60%)',
            }}
          />
        )}
      </AnimatePresence>

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
