'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { galleryPhotos } from '@/content/photos';
import PhotoPlaceholder from './PhotoPlaceholder';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SPRING_PLAYFUL, EASE_PRIMARY, DURATION } from '@/lib/easing';

const ROTATIONS_DESKTOP = [-3, 2.5, -1.5, 3, -2, 1.8, -2.8, 2.2];
const ROTATIONS_MOBILE = [-1.5, 1, -1, 1.5, -1, 1.2, -1.5, 1];

const TAPE_COLORS = [
  'rgba(255, 211, 90, 0.5)',
  'rgba(124, 198, 254, 0.4)',
  'rgba(126, 224, 181, 0.4)',
  'rgba(142, 155, 255, 0.4)',
  'rgba(255, 159, 67, 0.4)',
];

export default function PolaroidGallery() {
  const reduced = useReducedMotion();
  const isMobile = (typeof window !== 'undefined' && window.innerWidth < 640);

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8 max-w-5xl mx-auto px-4 sm:px-6">
      {galleryPhotos.map((photo, i) => {
        const rot = isMobile ? ROTATIONS_MOBILE[i % ROTATIONS_MOBILE.length] : ROTATIONS_DESKTOP[i % ROTATIONS_DESKTOP.length];
        return (
          <PolaroidCard key={i} photo={photo} index={i} rotation={rot} reduced={reduced} />
        );
      })}
    </div>
  );
}

function PolaroidCard({
  photo,
  index,
  rotation,
  reduced,
}: {
  photo: (typeof galleryPhotos)[0];
  index: number;
  rotation: number;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const tapeColor = TAPE_COLORS[index % TAPE_COLORS.length];
  const tapeRotation = (index % 2 === 0 ? -8 : 5) + Math.floor(index * 3.7) % 10;

  if (reduced) {
    return (
      <div
        ref={ref}
        className="rounded-lg shadow-md overflow-visible relative"
        style={{
          background: '#FFFBF2',
          padding: '8px 8px 32px',
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Tape */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
          style={{
            width: 40,
            height: 14,
            background: tapeColor,
            transform: `rotate(${tapeRotation}deg)`,
            borderRadius: 2,
          }}
        />
        <PhotoPlaceholder photo={photo} aspectRatio="4/5" className="rounded" />
        <p
          className="text-center text-sm mt-3 opacity-70"
          style={{ fontFamily: 'var(--font-fraunces)', color: '#1F2340' }}
        >
          {photo.caption}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="rounded-lg overflow-visible relative"
      style={{
        background: '#FFFBF2',
        padding: '8px 8px 32px',
        boxShadow: '0 4px 20px rgba(31,35,64,0.08)',
      }}
      initial={{
        opacity: 0,
        y: 60,
        rotate: rotation + (index % 2 === 0 ? 5 : -5),
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
              rotate: rotation,
            }
          : {}
      }
      transition={{
        duration: DURATION.normal,
        ease: EASE_PRIMARY,
        delay: index * 0.1,
      }}
      whileHover={{
        y: -12,
        rotate: 0,
        scale: 1.03,
        boxShadow: '0 16px 50px rgba(31,35,64,0.14)',
        transition: { type: 'spring', ...SPRING_PLAYFUL },
      }}
      data-hoverable
    >
      {/* Tape piece */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
        style={{
          width: 42,
          height: 15,
          background: tapeColor,
          transform: `rotate(${tapeRotation}deg)`,
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      />
      <PhotoPlaceholder photo={photo} aspectRatio="4/5" className="rounded" />
      <p
        className="text-center text-sm mt-3 opacity-70"
        style={{ fontFamily: 'var(--font-fraunces)', color: '#1F2340' }}
      >
        {photo.caption}
      </p>
    </motion.div>
  );
}
