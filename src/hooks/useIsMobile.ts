'use client';

import { useEffect, useState } from 'react';

/** Returns true on touch-primary devices or screens under 768px width. */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouch || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    mq.addEventListener('change', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mq.removeEventListener('change', checkMobile);
    };
  }, []);

  return isMobile;
}

