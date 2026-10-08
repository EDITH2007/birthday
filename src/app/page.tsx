'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import FlowerRain, { FlowerRainRef } from '@/components/FlowerRain';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASE_PRIMARY, DURATION } from '@/lib/easing';

export default function InvitationPage() {
  const [transitioning, setTransitioning] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [clickPos, setClickPos] = useState({ x: '50%', y: '50%' });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const flowerRainRef = useRef<FlowerRainRef>(null);
  const router = useRouter();
  const reduced = useReducedMotion();

  // Magnetic hover effect on desktop
  const [magnetic, setMagnetic] = useState({ x: 0, y: 0 });
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.18;
      const deltaY = (e.clientY - centerY) * 0.18;
      setMagnetic({ x: deltaX, y: deltaY });
    },
    [reduced],
  );

  const handleMouseLeave = () => setMagnetic({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transitioning) return;

    // Calculate click coordinates for circular reveal transition
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    const cx = ((clickX) / window.innerWidth) * 100;
    const cy = ((clickY) / window.innerHeight) * 100;
    setClickPos({ x: `${cx.toFixed(1)}%`, y: `${cy.toFixed(1)}%` });

    // Button press ripple effect
    setRipple(true);
    setTimeout(() => setRipple(false), 600);

    // Trigger 20 to 30 petal burst from button center
    if (flowerRainRef.current) {
      flowerRainRef.current.triggerBurst(clickX, clickY);
    }

    // Start champagne circular reveal transition to Page 2 (/wish)
    setTimeout(() => {
      setTransitioning(true);
      if (flowerRainRef.current) {
        flowerRainRef.current.stop();
      }
      setTimeout(() => {
        router.push('/wish');
      }, 900);
    }, 250);
  };

  const subtitleText = 'A little something for you';
  const subtitleLetters = subtitleText.split('');

  // Framer motion variants for choreography
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: EASE_PRIMARY,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: DURATION.slow,
        ease: EASE_PRIMARY,
        delay: 0.4,
      },
    },
  };

  const subtitleContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.035,
        delayChildren: 1.1,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: EASE_PRIMARY,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="page-container paper-texture flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{
        background: 'linear-gradient(180deg, #FFFBF2 0%, #FBF3E4 100%)',
        paddingTop: 'var(--sat)',
        paddingBottom: 'var(--sab)',
      }}
    >
      {/* Radial champagne glow behind center button */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255, 230, 170, 0.45) 0%, rgba(255, 251, 242, 0) 60%), radial-gradient(circle at 50% 50%, transparent 55%, rgba(31, 35, 64, 0.04) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Hero Raining Pink Flowers component */}
      <FlowerRain ref={flowerRainRef} />

      {/* Main Content (Button & Subtitle) */}
      <main className="relative z-10 flex flex-col items-center justify-center max-w-sm sm:max-w-md w-full text-center my-auto py-12">
        {/* Soft breathing halo behind button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          <div
            className="w-[230px] h-[68px] sm:w-[260px] sm:h-[76px] rounded-full opacity-60"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 211, 90, 0.4) 0%, transparent 70%)',
              animation: reduced ? 'none' : 'breathing-glow 4s ease-in-out infinite',
            }}
          />
        </div>

        {/* Centered "Open me" Button */}
        <motion.button
          ref={buttonRef}
          variants={buttonVariants}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative min-w-[200px] sm:min-w-[236px] min-h-[52px] px-8 sm:px-11 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-semibold outline-none touch-manipulation select-none"
          style={{
            fontFamily: 'var(--font-fraunces), Georgia, serif',
            color: '#1F2340',
            background: 'linear-gradient(135deg, #FFE699 0%, #FFD35A 50%, #F5B82E 100%)',
            boxShadow:
              '0 10px 30px -4px rgba(230, 180, 70, 0.35), 0 4px 12px rgba(31, 35, 64, 0.08), inset 0 1px 1.5px rgba(255, 255, 255, 0.85), inset 0 -1px 2px rgba(0, 0, 0, 0.06)',
            transform: `translate(${magnetic.x}px, ${magnetic.y}px)`,
            transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease',
          }}
          whileHover={reduced ? {} : { scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          data-hoverable
          aria-label="Open your birthday surprise"
        >
          {/* Button press ripple effect */}
          <AnimatePresence>
            {ripple && (
              <motion.span
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE_PRIMARY }}
              />
            )}
          </AnimatePresence>

          <span className="relative z-10 flex items-center justify-center gap-2.5 tracking-wide">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#1F2340] opacity-80"
            >
              <path d="M12 2L14.4 8.6L21.5 9.5L16.2 14.2L17.7 21.2L12 17.6L6.3 21.2L7.8 14.2L2.5 9.5L9.6 8.6L12 2Z" />
            </svg>
            Open me
          </span>
        </motion.button>

        {/* Elegant Subtitle Message directly below button */}
        <motion.p
          variants={subtitleContainerVariants}
          className="mt-6 text-sm sm:text-base tracking-[0.18em] italic font-serif flex justify-center flex-wrap px-4 select-none"
          style={{
            fontFamily: 'var(--font-fraunces), Georgia, serif',
            color: 'rgba(31, 35, 64, 0.72)',
          }}
        >
          {subtitleLetters.map((letter, i) => (
            <motion.span key={i} variants={letterVariants} className="inline-block">
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.p>
      </main>

      {/* Champagne Circular Reveal Transition to Page 2 */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ backgroundColor: '#FBF3E4' }}
            initial={{ clipPath: `circle(0% at ${clickPos.x} ${clickPos.y})` }}
            animate={{ clipPath: `circle(160% at ${clickPos.x} ${clickPos.y})` }}
            transition={{ duration: 0.9, ease: EASE_PRIMARY }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

