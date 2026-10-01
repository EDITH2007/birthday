'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import ConfettiShapes from '@/components/ConfettiShapes';
import FloatingOrbs from '@/components/FloatingOrbs';
import StickerLayer from '@/components/stickers/StickerLayer';
import { BuntingSticker } from '@/components/stickers/StickerSVGs';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASE_PRIMARY, DURATION } from '@/lib/easing';
import type { StickerConfig } from '@/components/stickers/Sticker';

interface Sparkle {
  w: number;
  h: number;
  x: number;
  y: number;
  color: string;
  dur: number;
  del: number;
}

const PAGE1_STICKERS: StickerConfig[] = [
  // Corner clusters
  { id: 'party-popper', x: 3, y: 5, size: 52, rotation: -15, depth: 0.4, bobDuration: 5, bobDelay: 0 },
  { id: 'sparkle-cluster', x: 8, y: 12, size: 40, rotation: 10, depth: 0.25, bobDuration: 4, bobDelay: 0.5, hideOnMobile: true },
  { id: 'balloons', x: 85, y: 4, size: 56, rotation: 8, depth: 0.5, bobDuration: 4.5, bobDelay: 0.3 },
  { id: 'crown', x: 90, y: 15, size: 38, rotation: -10, depth: 0.3, bobDuration: 5.5, bobDelay: 1, hideOnMobile: true },
  { id: 'gift-box', x: 5, y: 80, size: 48, rotation: 12, depth: 0.35, bobDuration: 4, bobDelay: 0.8 },
  { id: 'confetti-cannon', x: 88, y: 78, size: 50, rotation: -8, depth: 0.45, bobDuration: 5, bobDelay: 0.4 },
  // Floating mid stickers
  { id: 'disco-ball', x: 20, y: 45, size: 44, rotation: 5, depth: 0.5, bobDuration: 6, bobDelay: 1.5, draggable: true },
  { id: 'vinyl-record', x: 75, y: 50, size: 46, rotation: -5, depth: 0.4, bobDuration: 5.5, bobDelay: 2, draggable: true },
  { id: 'cupcake', x: 12, y: 55, size: 36, rotation: -8, depth: 0.2, bobDuration: 4, bobDelay: 1, hideOnMobile: true },
  { id: 'party-hat', x: 82, y: 35, size: 38, rotation: 12, depth: 0.3, bobDuration: 4.5, bobDelay: 0.6, hideOnMobile: true },
];

export default function InvitationPage() {
  const [transitioning, setTransitioning] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const reduced = useReducedMotion();

  // Generate sparkle data client-side only to avoid hydration mismatch
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  useEffect(() => {
    if (reduced) return;
    const colors = ['#FFD35A', '#7CC6FE', '#8E9BFF', '#FF9F43', '#7EE0B5'];
    setSparkles(
      Array.from({ length: 18 }, (_, i) => ({
        w: 3 + Math.random() * 5,
        h: 3 + Math.random() * 5,
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 90,
        color: colors[i % 5],
        dur: 2 + Math.random() * 3,
        del: Math.random() * 4,
      })),
    );
  }, [reduced]);

  // Show "psst, tap here" hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 3000);
    return () => clearTimeout(timer);
  }, []);

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

  const [clickPos, setClickPos] = useState({ x: '50%', y: '50%' });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transitioning) return;

    // Calculate click coordinates for circular reveal transition
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const cy = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    setClickPos({ x: `${cx.toFixed(1)}%`, y: `${cy.toFixed(1)}%` });

    // Ripple effect
    setRipple(true);
    setTimeout(() => setRipple(false), 600);

    // Multi-shape confetti burst from button position
    if (buttonRef.current) {
      const bx = (rect.left + rect.width / 2) / window.innerWidth;
      const by = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: bx, y: by },
        colors: ['#FFD35A', '#7CC6FE', '#7EE0B5', '#FF9F43', '#8E9BFF'],
        disableForReducedMotion: true,
      });
      setTimeout(() => {
        confetti({
          particleCount: 25,
          spread: 80,
          startVelocity: 20,
          shapes: ['star'],
          origin: { x: bx, y: by - 0.05 },
          colors: ['#FFD35A', '#8E9BFF'],
          disableForReducedMotion: true,
        });
      }, 150);
    }

    // Start clip-path transition
    setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        router.push('/wish');
      }, 900);
    }, 350);
  };

  // Subtitle shimmer text
  const subtitleText = 'A LITTLE SOMETHING FOR YOU';
  const subtitleLetters = subtitleText.split('');

  return (
    <div className="page-container paper-texture flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background layers */}
      <FloatingOrbs />
      <ConfettiShapes />

      {/* Sticker layer */}
      <StickerLayer stickers={PAGE1_STICKERS} mobileMax={4} />

      {/* Bunting garland at top */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-[4] pointer-events-none flex justify-center max-w-full overflow-hidden"
        style={{
          animation: reduced ? 'none' : 'bunting-sway 6s ease-in-out infinite',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <BuntingSticker size={320} className="sm:w-[400px]" />
      </motion.div>

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
              opacity: [0, 0.9, 0],
              scale: [0.5, 1.3, 0.5],
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

      {/* Main interactive area */}
      <motion.div
        className="relative z-10 flex flex-col items-center max-w-xs sm:max-w-md w-full text-center my-auto py-12"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DURATION.slow, ease: EASE_PRIMARY, delay: 0.3 }}
      >
        {/* Sunburst rays behind button */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: -1 }}
        >
          <motion.div
            className="absolute"
            style={{
              width: 220,
              height: 220,
              animation: reduced ? 'none' : 'rotate-stars 40s linear infinite',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 1 }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  width: 2,
                  height: 100,
                  background: 'linear-gradient(to top, transparent, #FFD35A)',
                  transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                  transformOrigin: 'bottom center',
                  opacity: 0.6,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Pulsing halo ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="absolute rounded-full"
            style={{
              width: 210,
              height: 64,
              border: '2px solid rgba(255, 211, 90, 0.4)',
              animation: reduced ? 'none' : 'pulse-halo 2.5s ease-in-out infinite',
            }}
          />
        </div>

        <motion.button
          ref={buttonRef}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative min-w-[210px] sm:min-w-[240px] px-8 sm:px-12 py-5 sm:py-6 rounded-full text-lg sm:text-xl font-semibold outline-none touch-manipulation"
          style={{
            fontFamily: 'var(--font-fraunces)',
            color: '#1F2340',
            background: 'linear-gradient(135deg, #FFD35A 0%, #FFE08A 50%, #FFD35A 100%)',
            boxShadow: '0 4px 20px rgba(255, 211, 90, 0.35), inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.05)',
            animation: reduced ? 'none' : 'gentle-bob 3s ease-in-out infinite, breathing-glow 3s ease-in-out infinite',
            transform: `translate(${magnetic.x}px, ${magnetic.y}px)`,
            transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          whileTap={{ scale: 0.94 }}
          data-hoverable
          aria-label="Open your birthday surprise"
        >
          {/* Ripple effect */}
          <AnimatePresence>
            {ripple && (
              <motion.span
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'rgba(255, 255, 255, 0.4)' }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE_PRIMARY }}
              />
            )}
          </AnimatePresence>

          <span className="relative z-10 flex items-center justify-center gap-3 text-lg sm:text-xl">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L14 8.5L21 10L15.5 14.5L17 21.5L12 18L7 21.5L8.5 14.5L3 10L10 8.5L12 2Z" />
            </svg>
            Open me
          </span>
        </motion.button>

        {/* "psst, tap here" hint — works on mobile & desktop on 1 line */}
        <AnimatePresence>
          {showHint && !transitioning && (
            <motion.div
              className="mt-3 flex items-center justify-center gap-1.5 pointer-events-none text-xs tracking-wider"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 0.7, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE_PRIMARY }}
            >
              <svg width="18" height="14" viewBox="0 0 24 16" fill="none">
                <path
                  d="M12 2L12 14M12 2L6 8M12 2L18 8"
                  stroke="#1F2340"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.6"
                />
              </svg>
              <motion.span
                className="whitespace-nowrap font-medium italic"
                style={{
                  fontFamily: 'var(--font-manrope)',
                  color: '#1F2340',
                }}
                animate={{
                  rotate: [-1, 1, -1],
                }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                psst, tap here
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtitle with letter shimmer */}
        <motion.p
          className="text-center mt-6 text-xs sm:text-sm tracking-wider uppercase flex justify-center flex-wrap px-2"
          style={{ fontFamily: 'var(--font-manrope)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: DURATION.slow }}
        >
          {subtitleLetters.map((letter, i) => (
            <motion.span
              key={i}
              style={{
                display: 'inline-block',
                color: '#1F2340',
                background: reduced
                  ? 'none'
                  : 'linear-gradient(90deg, rgba(31,35,64,0.4) 0%, rgba(255,211,90,0.9) 50%, rgba(31,35,64,0.4) 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: reduced ? 'unset' : 'text',
                WebkitTextFillColor: reduced ? '#1F2340' : 'transparent',
                animation: reduced ? 'none' : `shimmer-sweep 3s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.p>
      </motion.div>

      {/* Clip-path reveal transition from click position */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ backgroundColor: '#FFD35A' }}
            initial={{ clipPath: `circle(0% at ${clickPos.x} ${clickPos.y})` }}
            animate={{ clipPath: `circle(160% at ${clickPos.x} ${clickPos.y})` }}
            transition={{ duration: 0.9, ease: EASE_PRIMARY }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
