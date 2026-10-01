'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { wishes } from '@/content/wishes';
import { RECIPIENT_NAME } from '@/content/config';
import WishLine from '@/components/WishLine';
import SparkleReveal from '@/components/SparkleReveal';
import CakeCandle from '@/components/CakeCandle';
import OTPVault from '@/components/OTPVault';
import FloatingOrbs from '@/components/FloatingOrbs';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SPRING_PLAYFUL, EASE_PRIMARY, DURATION } from '@/lib/easing';

export default function WishPage() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const confettiTriggered = useRef(false);
  const confettiPointRef = useRef<HTMLDivElement>(null);
  const confettiInView = useInView(confettiPointRef, { once: true, margin: '-100px' });

  // Scroll-point confetti burst
  useEffect(() => {
    if (confettiInView && !confettiTriggered.current) {
      confettiTriggered.current = true;
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFD35A', '#7CC6FE', '#7EE0B5', '#FF9F43', '#8E9BFF'],
        disableForReducedMotion: true,
      });
    }
  }, [confettiInView]);

  const handleUnlock = () => {
    router.push('/memories');
  };

  // Split title into letters for stagger animation
  const titleText = `Happy Birthday, ${RECIPIENT_NAME}`;
  const letters = titleText.split('');

  return (
    <div className="page-container relative">
      <FloatingOrbs />

      {/* Hero section */}
      <section className="min-h-[100svh] min-h-[100dvh] flex flex-col items-center justify-center px-5 sm:px-6 relative py-16">
        {/* Animated title */}
        <div className="relative max-w-xl text-center">
          <h1
            className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold text-center leading-tight tracking-tight"
            style={{
              fontFamily: 'var(--font-fraunces)',
              color: '#1F2340',
              textWrap: 'balance',
            }}
          >
            {reduced ? (
              titleText
            ) : (
              letters.map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 40, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    ...SPRING_PLAYFUL,
                    delay: 0.3 + i * 0.04,
                  }}
                  style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))
            )}
          </h1>

          {/* Hand-drawn underline */}
          <svg
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[75%] max-w-[360px]"
            viewBox="0 0 400 20"
            fill="none"
            style={{ overflow: 'visible' }}
          >
            <path
              d="M10 15 C50 5, 100 18, 150 10 C200 2, 250 16, 300 8 C350 0, 380 12, 390 10"
              stroke="#FFD35A"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="draw-underline"
            />
          </svg>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 sm:bottom-8 flex flex-col items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <span
            className="text-[10px] sm:text-xs tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-manrope)', color: '#1F2340' }}
          >
            Scroll down
          </span>
          <motion.svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1F2340"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </motion.svg>
        </motion.div>
      </section>

      {/* Wishes section */}
      <section className="max-w-2xl mx-auto px-6 py-16 sm:py-24 relative">
        {wishes.map((wish, i) => (
          <div key={i} className="relative">
            <WishLine wish={wish} index={i} />
            {/* Confetti trigger point after the 3rd wish */}
            {i === 2 && <div ref={confettiPointRef} />}
          </div>
        ))}
      </section>

      {/* Sparkle reveal section */}
      <section className="py-8 px-6">
        <SparkleReveal />
      </section>

      {/* Cake & candle section */}
      <section className="py-8 px-6">
        <CakeCandle />
      </section>

      {/* Secret Vault section */}
      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-md mx-auto flex flex-col items-center gap-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: DURATION.normal, ease: EASE_PRIMARY }}
          >
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-fraunces)', color: '#1F2340' }}
            >
              Secret Vault
            </h2>
            <p
              className="text-base opacity-60"
              style={{ fontFamily: 'var(--font-manrope)', color: '#1F2340' }}
            >
              There&apos;s one more thing. Enter the code to unlock it.
            </p>
          </motion.div>

          <OTPVault onUnlock={handleUnlock} />
        </div>
      </section>
    </div>
  );
}
