'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { galleryPhotos } from '@/content/photos';
import PhotoPlaceholder from './PhotoPlaceholder';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SPRING_PLAYFUL, EASE_PRIMARY, DURATION } from '@/lib/easing';

const ROTATIONS = [-3, 2.5, -1.5, 3, -2, 1.8, -2.8, 2.2];

export default function PolaroidGallery() {
  const reduced = useReducedMotion();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto px-4">
      {galleryPhotos.map((photo, i) => (
        <PolaroidCard key={i} photo={photo} index={i} rotation={ROTATIONS[i % ROTATIONS.length]} reduced={reduced} />
      ))}
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

  if (reduced) {
    return (
      <div
        ref={ref}
        className="rounded-lg shadow-md overflow-hidden"
        style={{
          background: '#FFFBF2',
          padding: '8px 8px 32px',
          transform: `rotate(${rotation}deg)`,
        }}
      >
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
      className="rounded-lg shadow-md overflow-hidden"
      style={{
        background: '#FFFBF2',
        padding: '8px 8px 32px',
        boxShadow: '0 4px 20px rgba(31,35,64,0.08)',
      }}
      initial={{
        opacity: 0,
        y: 60,
        rotate: rotation + (Math.random() > 0.5 ? 5 : -5),
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
        y: -8,
        rotate: 0,
        boxShadow: '0 12px 40px rgba(31,35,64,0.12)',
        transition: SPRING_PLAYFUL,
      }}
      data-hoverable
    >
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
