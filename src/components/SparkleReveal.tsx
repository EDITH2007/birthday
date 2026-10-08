'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hiddenWish } from '@/content/wishes';
import { SPRING_PLAYFUL } from '@/lib/easing';

export default function SparkleReveal() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <button
        onClick={() => setRevealed(true)}
        className="relative group outline-none"
        aria-label="Reveal hidden message"
        data-hoverable
      >
        <motion.div
          animate={
            revealed
              ? { scale: 1.2, opacity: 0 }
              : { scale: [1, 1.15, 1], opacity: 1 }
          }
          transition={
            revealed
              ? { duration: 0.3 }
              : { repeat: Infinity, duration: 2, ease: 'easeInOut' }
          }
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 2L28 18L44 24L28 30L24 46L20 30L4 24L20 18L24 2Z"
              fill="#FFD35A"
              stroke="#FF9F43"
              strokeWidth="1"
            />
            <path
              d="M24 10L26.5 19.5L36 24L26.5 28.5L24 38L21.5 28.5L12 24L21.5 19.5L24 10Z"
              fill="#FFFBF2"
              opacity="0.5"
            />
          </svg>
        </motion.div>

        {!revealed && (
          <span
            className="block mt-2 text-xs opacity-50 tracking-wider uppercase"
            style={{ fontFamily: 'var(--font-manrope)', color: '#1F2340' }}
          >
            Tap the sparkle
          </span>
        )}
      </button>

      <AnimatePresence>
        {revealed && (
          <motion.div
            key="hidden-wish"
            className="p-6 rounded-2xl max-w-md text-center"
            style={{
              background: '#FFFBF2',
              border: '2px solid rgba(255, 211, 90, 0.5)',
              boxShadow: '0 4px 20px rgba(31,35,64,0.06)',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={SPRING_PLAYFUL}
          >
            <p
              className="text-lg sm:text-xl italic"
              style={{
                fontFamily: 'var(--font-fraunces)',
                color: '#1F2340',
              }}
            >
              {hiddenWish}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
