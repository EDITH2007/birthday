'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { slideshowPhotos, type PhotoData } from '@/content/photos';
import PhotoPlaceholder from './PhotoPlaceholder';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASE_PRIMARY_CSS } from '@/lib/easing';

export default function Slideshow() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [showLightLeak, setShowLightLeak] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touchStart = useRef(0);
  const reduced = useReducedMotion();

  const photos = slideshowPhotos;
  const total = photos.length;

  const goTo = useCallback(
    (index: number) => {
      setShowLightLeak(true);
      setTimeout(() => setShowLightLeak(false), 500);
      setCurrent((index + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-play
  useEffect(() => {
    if (!playing) return;
    timerRef.current = setTimeout(next, 4500);
    return () => clearTimeout(timerRef.current);
  }, [current, playing, next]);

  // Ken Burns GSAP effect on the active slide
  const slideRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced || !slideRef.current) return;
    const el = slideRef.current;

    // Random Ken Burns direction
    const directions = [
      { scale: 1.15, x: -20, y: -10 },
      { scale: 1.12, x: 20, y: 10 },
      { scale: 1.18, x: -10, y: 15 },
      { scale: 1.1, x: 15, y: -15 },
    ];
    const dir = directions[current % directions.length];

    gsap.fromTo(
      el,
      { scale: 1, x: 0, y: 0 },
      {
        scale: dir.scale,
        x: dir.x,
        y: dir.y,
        duration: 5,
        ease: 'power1.inOut',
      },
    );

    return () => {
      gsap.killTweensOf(el);
    };
  }, [current, reduced]);

  // Swipe handling
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={containerRef}>
      {/* Polaroid/film frame wrapper */}
      <div
        className="relative rounded-xl p-3 sm:p-4"
        style={{
          background: '#FFFBF2',
          boxShadow: '0 8px 40px rgba(31,35,64,0.1), 0 2px 8px rgba(31,35,64,0.06)',
          transform: 'rotate(-0.5deg)',
        }}
      >
        {/* Tape pieces */}
        <div
          className="absolute -top-2 left-8 z-20"
          style={{
            width: 48,
            height: 18,
            background: 'rgba(255, 211, 90, 0.5)',
            transform: 'rotate(-5deg)',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        />
        <div
          className="absolute -top-2 right-10 z-20"
          style={{
            width: 44,
            height: 16,
            background: 'rgba(126, 224, 181, 0.4)',
            transform: 'rotate(3deg)',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        />

        {/* Main slide area */}
        <div
          className="relative w-full overflow-hidden rounded-lg cursor-pointer aspect-[4/5] sm:aspect-[16/10]"
          style={{ background: '#FFFBF2', touchAction: 'pan-y' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={() => setPlaying((p) => !p)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              ref={slideRef}
              className="absolute inset-0"
              initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
              animate={{ opacity: 1, clipPath: 'inset(0 0 0 0%)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.1 : 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <PhotoPlaceholder
                photo={photos[current]}
                className="w-full h-full"
                aspectRatio="auto"
              />
            </motion.div>
          </AnimatePresence>

          {/* Light leak effect between slides */}
          <AnimatePresence>
            {showLightLeak && !reduced && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,211,90,0.4) 0%, rgba(124,198,254,0.3) 50%, transparent 100%)',
                }}
              />
            )}
          </AnimatePresence>

          {/* Caption */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`caption-${current}`}
              className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pointer-events-none"
              style={{
                background: 'linear-gradient(transparent, rgba(31,35,64,0.7))',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className="text-white text-sm sm:text-lg font-medium leading-snug"
                style={{ fontFamily: 'var(--font-fraunces)', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
              >
                {photos[current].caption}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Caption area below frame */}
        <div className="pt-2 pb-1 px-2 text-center flex items-center justify-between">
          <span
            className="text-[10px] sm:text-xs tracking-wider uppercase opacity-40"
            style={{ fontFamily: 'var(--font-manrope)', color: '#1F2340' }}
          >
            {playing ? 'Playing ✦ Tap slide to pause' : 'Paused ✦ Tap slide to play'}
          </span>
          <span
            className="text-[10px] sm:text-xs tracking-wider uppercase opacity-40 font-semibold"
            style={{ fontFamily: 'var(--font-manrope)', color: '#1F2340' }}
          >
            {current + 1} / {total}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-5 px-2">
        <button
          onClick={prev}
          className="w-11 h-11 flex items-center justify-center rounded-full transition-colors"
          style={{
            background: 'rgba(31,35,64,0.06)',
            color: '#1F2340',
          }}
          aria-label="Previous photo"
          data-hoverable
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Progress dots */}
        <div className="flex gap-2 items-center">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === current ? '#FFD35A' : 'rgba(31,35,64,0.15)',
                transform: i === current ? 'scale(1.4)' : 'scale(1)',
                transitionTimingFunction: EASE_PRIMARY_CSS,
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="w-11 h-11 flex items-center justify-center rounded-full transition-colors"
            style={{
              background: playing ? 'rgba(255,211,90,0.2)' : 'rgba(31,35,64,0.06)',
              color: '#1F2340',
            }}
            aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
            data-hoverable
          >
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4l14 8-14 8z" />
              </svg>
            )}
          </button>

          <button
            onClick={next}
            className="w-11 h-11 flex items-center justify-center rounded-full transition-colors"
            style={{
              background: 'rgba(31,35,64,0.06)',
              color: '#1F2340',
            }}
            aria-label="Next photo"
            data-hoverable
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar — palette gradient instead of dark brown */}
      <div className="mt-3 mx-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(31,35,64,0.04)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #FFD35A, #7EE0B5, #7CC6FE, #8E9BFF)',
            backgroundSize: '200% 100%',
          }}
          initial={{ width: '0%' }}
          animate={{ width: playing ? '100%' : `${((current) / total) * 100}%` }}
          transition={playing ? { duration: 4.5, ease: 'linear' } : { duration: 0.3 }}
          key={`progress-${current}-${playing}`}
        />
      </div>
    </div>
  );
}
