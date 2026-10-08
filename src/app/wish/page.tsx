'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
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
import FlowerRain, { FlowerRainRef } from '@/components/FlowerRain';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SPRING_PLAYFUL, EASE_PRIMARY, DURATION } from '@/lib/easing';

export default function WishPage() {
  const router = useRouter();
  const reduced = useReducedMotion();

  const flowerRainRef = useRef<FlowerRainRef>(null);

  const confettiTriggered = useRef(false);
  const confettiPointRef = useRef<HTMLDivElement>(null);
  const confettiInView = useInView(confettiPointRef, { once: true, margin: '-100px' });

  // Headline font size scaling & measurement refs
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const headlineWrapperRef = useRef<HTMLDivElement>(null);
  const hiddenCloneRef = useRef<HTMLDivElement>(null);

  const [headlineFontSize, setHeadlineFontSize] = useState<number | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Stable, rock-solid headline measurement using an unanimated 100px clone after fonts load
  const calculateHeadlineSize = useCallback(() => {
    const container = heroContainerRef.current;
    const clone = hiddenCloneRef.current;
    if (!container || !clone) return;

    // Available target width (78% of viewport on desktop, full width minus 32px padding on mobile)
    const viewportWidth = window.innerWidth;
    const availableWidth = viewportWidth >= 768
      ? Math.min(container.clientWidth * 0.78, viewportWidth * 0.78)
      : Math.max(260, container.clientWidth - 32);

    // Measure natural width of unanimated layout at reference size 100px
    const naturalWidth = clone.getBoundingClientRect().width;
    if (naturalWidth <= 0) return;

    // Calculate exact font size needed to hit target width
    const calculated = 100 * (availableWidth / naturalWidth);

    // Cap between min 22px (mobile 320px safety) and max 110px (desktop 1920px)
    const cappedSize = Math.max(22, Math.min(110, Math.floor(calculated)));
    setHeadlineFontSize(cappedSize);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
        calculateHeadlineSize();
      });
    } else {
      setFontsLoaded(true);
      calculateHeadlineSize();
    }

    const container = heroContainerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      calculateHeadlineSize();
    });
    ro.observe(container);

    window.addEventListener('resize', calculateHeadlineSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calculateHeadlineSize);
    };
  }, [calculateHeadlineSize]);

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

  const handleCandleBlow = () => {
    flowerRainRef.current?.triggerBurst();
  };

  const handleCorrectCode = () => {
    flowerRainRef.current?.triggerBurst();
  };

  const handleUnlock = () => {
    flowerRainRef.current?.stop();
    router.push('/memories');
  };

  const prefixText = 'Happy Birthday,';
  const prefixLetters = prefixText.split('');
  const recipientLetters = RECIPIENT_NAME.split('');

  return (
    <div className="page-container relative min-h-[100dvh] w-full overflow-x-clip">
      {/* Soft pre-rendered CSS background orbs */}
      <FloatingOrbs />

      {/* Full-Page Canvas Flower Rain behind everything */}
      <FlowerRain ref={flowerRainRef} preset="page2" />

      {/* Hidden Unanimated Clone at 100px reference size for exact width measurement */}
      <div
        ref={hiddenCloneRef}
        aria-hidden="true"
        className="fixed top-0 left-0 opacity-0 pointer-events-none -z-50 whitespace-nowrap inline-flex items-baseline"
        style={{ fontSize: '100px' }}
      >
        <span
          className="inline-block whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-instrument), Georgia, serif',
            letterSpacing: '-0.02em',
          }}
        >
          {prefixText}
        </span>
        <span className="inline-block">&nbsp;</span>
        <span
          className="inline-block whitespace-nowrap px-2"
          style={{
            fontFamily: 'var(--font-allura), var(--font-pinyon), cursive',
            fontSize: '1.4em',
          }}
        >
          {RECIPIENT_NAME}
        </span>
      </div>

      {/* Main content layer sitting strictly above flower rain */}
      <div className="relative z-10 w-full">
        {/* Hero Section */}
        <section
          ref={heroContainerRef}
          className="min-h-[100svh] min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 relative py-12 text-center overflow-hidden"
        >
          {/* Animated Hero Headline Container */}
          <div
            ref={headlineWrapperRef}
            className="relative flex flex-col items-center justify-center max-w-full transition-opacity duration-300"
            style={{
              opacity: fontsLoaded && headlineFontSize ? 1 : 0,
            }}
          >
            {/* Inline-Block Text Wrapper so Underline matches exact text width */}
            <div className="relative inline-block max-w-full">
              <h1
                className="inline-flex items-baseline justify-center tracking-tight select-none whitespace-nowrap leading-none"
                style={{
                  fontSize: headlineFontSize ? `${headlineFontSize}px` : 'clamp(1.5rem, 5vw, 4.5rem)',
                }}
              >
                {/* Prefix: "Happy Birthday," in Instrument Serif */}
                <span
                  className="inline-block whitespace-nowrap"
                  style={{
                    fontFamily: 'var(--font-instrument), Georgia, serif',
                    color: '#1F2340',
                    letterSpacing: '-0.02em',
                    fontWeight: 400,
                  }}
                >
                  {reduced ? (
                    prefixText
                  ) : (
                    prefixLetters.map((letter, i) => (
                      <motion.span
                        key={i}
                        className="inline-block"
                        initial={{ opacity: 0, y: 35 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...SPRING_PLAYFUL, delay: 0.15 + i * 0.03 }}
                        whileHover={{ y: -3, scale: 1.08 }}
                      >
                        {letter === ' ' ? '\u00A0' : letter}
                      </motion.span>
                    ))
                  )}
                </span>

                <span className="inline-block">&nbsp;</span>

                {/* Recipient Name: "Shreya" in Flowing Script (Allura) */}
                <span
                  className="inline-block whitespace-nowrap px-1 sm:px-2 pb-1"
                  style={{
                    fontFamily: 'var(--font-allura), var(--font-pinyon), cursive',
                    fontSize: '1.4em',
                    lineHeight: 1,
                  }}
                >
                  {reduced ? (
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #D35400 0%, #E67E22 45%, #575FCF 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {RECIPIENT_NAME}
                    </span>
                  ) : (
                    recipientLetters.map((letter, i) => (
                      <motion.span
                        key={i}
                        className="inline-block"
                        initial={{ opacity: 0, y: 35, rotate: -6 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{ ...SPRING_PLAYFUL, delay: 0.6 + i * 0.05 }}
                        whileHover={{ y: -6, scale: 1.25 }}
                        whileTap={{ scale: 0.92 }}
                        style={{
                          background: 'linear-gradient(135deg, #D35400 0%, #E67E22 45%, #575FCF 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: 'drop-shadow(0 2px 4px rgba(31,35,64,0.1))',
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))
                  )}
                </span>
              </h1>

              {/* Hand-drawn Underline matching EXACT headline width */}
              <div className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 w-full pointer-events-none flex justify-center">
                <svg
                  className="w-full h-auto overflow-visible"
                  viewBox="0 0 400 20"
                  preserveAspectRatio="none"
                  fill="none"
                  style={{ maxHeight: '18px' }}
                >
                  <path
                    d="M10 15 C50 5, 100 18, 150 10 C200 2, 250 16, 300 8 C350 0, 380 12, 390 10"
                    stroke="#FF9F43"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    className="draw-underline"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Scroll hint indicator */}
          <motion.div
            className="absolute bottom-6 sm:bottom-8 flex flex-col items-center gap-1.5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.8, duration: 1 }}
          >
            <span
              className="text-[10px] sm:text-xs tracking-widest uppercase font-semibold"
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
        <section className="py-12 px-6 flex justify-center">
          <SparkleReveal />
        </section>

        {/* Cake & candle section */}
        <section className="py-12 px-6 flex justify-center">
          <CakeCandle onBlow={handleCandleBlow} />
        </section>

        {/* Secret Vault section */}
        <section className="py-20 sm:py-32 px-6">
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
                className="text-base opacity-70"
                style={{ fontFamily: 'var(--font-manrope)', color: '#1F2340' }}
              >
                There&apos;s one more thing. Enter the code to unlock it.
              </p>
            </motion.div>

            <OTPVault onUnlock={handleUnlock} onCorrectCode={handleCorrectCode} />
          </div>
        </section>
      </div>
    </div>
  );
}
