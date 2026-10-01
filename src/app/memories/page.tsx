'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CLOSING_MESSAGE } from '@/content/config';
import Slideshow from '@/components/Slideshow';
import PolaroidGallery from '@/components/PolaroidGallery';
import FloatingOrbs from '@/components/FloatingOrbs';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SPRING_PLAYFUL, EASE_PRIMARY, DURATION } from '@/lib/easing';

export default function MemoriesPage() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [authorized, setAuthorized] = useState(false);
  const [showClosing, setShowClosing] = useState(false);

  // Check session storage for unlock
  useEffect(() => {
    const unlocked = sessionStorage.getItem('vault-unlocked');
    if (unlocked === 'true') {
      setAuthorized(true);
    } else {
      router.replace('/wish');
    }
  }, [router]);

  // Final confetti shower
  useEffect(() => {
    if (!showClosing) return;
    const timer = setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.3 },
        colors: ['#FFD35A', '#7CC6FE', '#7EE0B5', '#FF9F43', '#8E9BFF'],
        disableForReducedMotion: true,
      });
    }, 600);
    return () => clearTimeout(timer);
  }, [showClosing]);

  const handleReplay = () => {
    sessionStorage.removeItem('vault-unlocked');
    router.push('/');
  };

  if (!authorized) {
    return (
      <div className="page-container flex items-center justify-center">
        <p style={{ fontFamily: 'var(--font-manrope)', opacity: 0.5 }}>
          Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="page-container relative">
      <FloatingOrbs />

      {/* Opening title card */}
      <section className="min-h-[70vh] flex items-center justify-center px-6 relative">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: DURATION.slow, ease: EASE_PRIMARY }}
        >
          <motion.h1
            className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-fraunces)', color: '#1F2340' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_PLAYFUL, delay: 0.3 }}
          >
            Our favourite moments
          </motion.h1>
          <motion.div
            className="mt-4 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: DURATION.normal }}
          >
            {['#FFD35A', '#7CC6FE', '#7EE0B5', '#FF9F43', '#8E9BFF'].map((color, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                style={{ width: 8, height: 8, backgroundColor: color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + i * 0.1, ...SPRING_PLAYFUL }}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Slideshow */}
      <section className="px-4 sm:px-8 py-12 sm:py-20">
        <Slideshow />
      </section>

      {/* Polaroid Gallery */}
      <section className="py-16 sm:py-24">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-center mb-12"
          style={{ fontFamily: 'var(--font-fraunces)', color: '#1F2340' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: DURATION.normal, ease: EASE_PRIMARY }}
        >
          The scrapbook
        </motion.h2>
        <PolaroidGallery />
      </section>

      {/* Closing screen */}
      <section className="py-20 sm:py-32 px-6">
        <motion.div
          className="max-w-lg mx-auto text-center flex flex-col items-center gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: DURATION.slow, ease: EASE_PRIMARY }}
          onViewportEnter={() => setShowClosing(true)}
        >
          {/* Decorative star */}
          <motion.svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            initial={{ rotate: -30, scale: 0.8 }}
            whileInView={{ rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={SPRING_PLAYFUL}
          >
            <path
              d="M24 2L28 18L44 24L28 30L24 46L20 30L4 24L20 18L24 2Z"
              fill="#FFD35A"
            />
          </motion.svg>

          <p
            className="text-xl sm:text-2xl leading-relaxed"
            style={{ fontFamily: 'var(--font-fraunces)', color: '#1F2340' }}
          >
            {CLOSING_MESSAGE}
          </p>

          <motion.button
            onClick={handleReplay}
            className="mt-6 px-8 py-3 rounded-full text-base font-semibold transition-all"
            style={{
              fontFamily: 'var(--font-manrope)',
              color: '#1F2340',
              background: 'linear-gradient(135deg, #FFD35A 0%, #FFE08A 100%)',
              boxShadow: '0 4px 20px rgba(255, 211, 90, 0.25)',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(255, 211, 90, 0.35)' }}
            whileTap={{ scale: 0.95 }}
            data-hoverable
          >
            Replay ✦
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
