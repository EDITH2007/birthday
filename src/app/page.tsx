'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import ConfettiShapes from '@/components/ConfettiShapes';
import FloatingOrbs from '@/components/FloatingOrbs';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASE_PRIMARY, DURATION } from '@/lib/easing';

interface Sparkle {
  w: number;
  h: number;
  x: number;
  y: number;
  color: string;
  dur: number;
  del: number;
}

export default function InvitationPage() {
  const [transitioning, setTransitioning] = useState(false);
  const [ripple, setRipple] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const reduced = useReducedMotion();

  // Generate sparkle data client-side only to avoid hydration mismatch
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  useEffect(() => {
    if (reduced) return;
    const colors = ['#FFD35A', '#7CC6FE', '#8E9BFF', '#FF9F43'];
    setSparkles(
      Array.from({ length: 12 }, (_, i) => ({
        w: 3 + Math.random() * 4,
        h: 3 + Math.random() * 4,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        color: colors[i % 4],
        dur: 2 + Math.random() * 3,
        del: Math.random() * 4,
      })),
    );
  }, [reduced]);

  // Magnetic hover effect
  const [magnetic, setMagnetic] = useState({ x: 0, y: 0 });
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.2;
      const deltaY = (e.clientY - centerY) * 0.2;
      setMagnetic({ x: deltaX, y: deltaY });
    },
    [reduced],
  );

  const handleMouseLeave = () => setMagnetic({ x: 0, y: 0 });

  const handleClick = () => {
    if (transitioning) return;

    // Ripple effect
    setRipple(true);
    setTimeout(() => setRipple(false), 600);

    // Confetti burst from button position
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        colors: ['#FFD35A', '#7CC6FE', '#7EE0B5', '#FF9F43', '#8E9BFF'],
        disableForReducedMotion: true,
      });
    }

    // Start clip-path transition
    setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        router.push('/wish');
      }, 1000);
    }, 400);
  };

  return (
    <div className="page-container flex items-center justify-center relative overflow-hidden">
      {/* Background layers */}
      <FloatingOrbs />
      <ConfettiShapes />

      {/* Tiny sparkles — rendered only after client mount */}
      <div className="pointer-events-none fixed inset-0 z-[2]" aria-hidden="true">
        {sparkles.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: s.w,
              height: s.h,
              left: `${s.x}%`,
              top: `${s.y}%`,
              background: s.color,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: s.dur,
              delay: s.del,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* The Button */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DURATION.slow, ease: EASE_PRIMARY, delay: 0.3 }}
      >
        <motion.button
          ref={buttonRef}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative px-10 py-5 rounded-full text-xl font-semibold outline-none"
          style={{
            fontFamily: 'var(--font-fraunces)',
            color: '#1F2340',
            background: 'linear-gradient(135deg, #FFD35A 0%, #FFE08A 100%)',
            animation: reduced ? 'none' : 'gentle-bob 3s ease-in-out infinite, breathing-glow 3s ease-in-out infinite',
            transform: `translate(${magnetic.x}px, ${magnetic.y}px)`,
            transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          whileTap={{ scale: 0.95 }}
          data-hoverable
          aria-label="Open your birthday surprise"
        >
          {/* Ripple effect */}
          <AnimatePresence>
            {ripple && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: 'rgba(255, 255, 255, 0.4)' }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE_PRIMARY }}
              />
            )}
          </AnimatePresence>

          <span className="relative z-10 flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L14 8.5L21 10L15.5 14.5L17 21.5L12 18L7 21.5L8.5 14.5L3 10L10 8.5L12 2Z" />
            </svg>
            Open me
          </span>
        </motion.button>

        {/* Subtle label */}
        <motion.p
          className="text-center mt-6 text-sm tracking-wider uppercase opacity-40"
          style={{ fontFamily: 'var(--font-manrope)', color: '#1F2340' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5, duration: DURATION.slow }}
        >
          A little something for you
        </motion.p>
      </motion.div>

      {/* Clip-path reveal transition */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: '#FFD35A' }}
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            transition={{ duration: 1, ease: EASE_PRIMARY }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
