'use client';

import { useEffect, useState } from 'react';

export function toggleMotionPreference() {
  if (typeof window === 'undefined') return;
  const current = localStorage.getItem('reduce-motion') === 'true';
  const next = !current;
  localStorage.setItem('reduce-motion', String(next));
  window.dispatchEvent(new CustomEvent('motion-toggle', { detail: next }));
}

/** Returns true when reduced motion is preferred (via OS setting, low-end device, or user toggle). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const checkState = () => {
      const stored = localStorage.getItem('reduce-motion');
      if (stored !== null) {
        setReduced(stored === 'true');
        return;
      }
      
      // Auto-detect low-end devices
      const isLowEnd =
        (typeof navigator !== 'undefined' &&
          ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
            ((navigator as unknown as { deviceMemory?: number }).deviceMemory &&
              (navigator as unknown as { deviceMemory: number }).deviceMemory <= 4)));

      setReduced(mq.matches || Boolean(isLowEnd));
    };

    checkState();

    const handler = () => checkState();
    mq.addEventListener('change', handler);
    window.addEventListener('motion-toggle', handler);

    return () => {
      mq.removeEventListener('change', handler);
      window.removeEventListener('motion-toggle', handler);
    };
  }, []);

  return reduced;
}

