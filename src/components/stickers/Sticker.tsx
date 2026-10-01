'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import confetti from 'canvas-confetti';
import { STICKER_MAP, type StickerId } from './StickerSVGs';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SPRING_PLAYFUL } from '@/lib/easing';

export interface StickerConfig {
  id: StickerId;
  /** Position as % from top-left */
  x: number;
  y: number;
  /** Sticker size in px */
  size?: number;
  /** Initial rotation in degrees */
  rotation?: number;
  /** Whether this sticker is draggable */
  draggable?: boolean;
  /** Parallax depth 0-1, higher = more movement */
  depth?: number;
  /** Bob animation duration */
  bobDuration?: number;
  /** Bob delay */
  bobDelay?: number;
  /** Hide on mobile */
  hideOnMobile?: boolean;
}

interface StickerProps {
  config: StickerConfig;
  mouseX?: number;
  mouseY?: number;
  scrollY?: number;
}

export default function Sticker({ config, mouseX = 0, mouseY = 0, scrollY = 0 }: StickerProps) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const {
    id,
    x,
    y,
    size = 56,
    rotation = 0,
    draggable = false,
    depth = 0.3,
    bobDuration = 4,
    bobDelay = 0,
    hideOnMobile = false,
  } = config;

  const StickerSVG = STICKER_MAP[id];
  if (!StickerSVG) return null;
  if (isMobile && hideOnMobile) return null;

  // Parallax offset
  const parallaxX = isMobile ? 0 : mouseX * depth * 25;
  const parallaxY = isMobile ? scrollY * depth * 0.05 : mouseY * depth * 20;

  const handleInteraction = () => {
    if (reduced) return;
    // Mini confetti puff
    const el = constraintsRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const cx = (rect.left + rect.width / 2) / window.innerWidth;
      const cy = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 8,
        spread: 30,
        startVelocity: 15,
        gravity: 0.8,
        origin: { x: cx, y: cy },
        colors: ['#FFD35A', '#7CC6FE', '#7EE0B5', '#FF9F43', '#8E9BFF'],
        disableForReducedMotion: true,
      });
    }
  };

  const bobAnimation = reduced
    ? {}
    : {
        y: [0, -6, 0],
        rotate: [rotation - 1, rotation + 1, rotation - 1],
      };

  const bobTransition = reduced
    ? {}
    : {
        repeat: Infinity,
        duration: bobDuration,
        delay: bobDelay,
        ease: 'easeInOut' as const,
      };

  const scaledSize = isMobile ? Math.min(size, 42) : size;

  const content = (
    <motion.div
      ref={constraintsRef}
      className="sticker-item"
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        zIndex: 2,
        filter: 'drop-shadow(0 3px 6px rgba(31,35,64,0.12))',
        transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`,
        willChange: reduced ? 'auto' : 'transform',
        pointerEvents: draggable ? 'auto' : 'none',
        touchAction: 'pan-y',
      }}
      animate={bobAnimation}
      transition={bobTransition}
      onHoverStart={() => {
        setHovered(true);
        handleInteraction();
      }}
      onHoverEnd={() => setHovered(false)}
      onTap={handleInteraction}
      whileHover={
        reduced
          ? {}
          : {
              scale: 1.15,
              rotate: rotation + 5,
              transition: { type: 'spring', ...SPRING_PLAYFUL },
            }
      }
      whileTap={
        reduced
          ? {}
          : {
              scale: 0.9,
              transition: { type: 'spring', ...SPRING_PLAYFUL },
            }
      }
    >
      <StickerSVG size={scaledSize} />
    </motion.div>
  );

  if (draggable && !reduced) {
    return (
      <motion.div
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          zIndex: 5,
          filter: 'drop-shadow(0 3px 6px rgba(31,35,64,0.12))',
          pointerEvents: 'auto',
          cursor: 'grab',
          touchAction: 'pan-y',
        }}
        drag={isMobile ? 'x' : true}
        dragElastic={0.2}
        dragConstraints={isMobile ? { left: -30, right: 30 } : { left: -80, right: 80, top: -80, bottom: 80 }}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
        whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 50 }}
        animate={bobAnimation}
        transition={bobTransition}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onTap={handleInteraction}
        whileHover={{
          scale: 1.15,
          rotate: rotation + 5,
          transition: { type: 'spring', ...SPRING_PLAYFUL },
        }}
        whileTap={{
          scale: 0.9,
          transition: { type: 'spring', ...SPRING_PLAYFUL },
        }}
        data-hoverable
      >
        <StickerSVG size={scaledSize} />
      </motion.div>
    );
  }

  return content;
}
