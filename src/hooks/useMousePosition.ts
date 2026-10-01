'use client';

import { useEffect, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}

/** Tracks mouse position or device orientation tilt with scroll fallback for parallax. */
export function useMousePosition(): MousePosition {
  const [pos, setPos] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    let hasGyro = false;

    // Mouse movement handler for desktop
    const handleMouse = (e: MouseEvent) => {
      setPos({
        x: e.clientX,
        y: e.clientY,
        normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
        normalizedY: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    // Device orientation handler for mobile tilt
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        hasGyro = true;
        // Clamp gamma (-30 to 30 deg) and beta (-30 to 30 deg)
        const normX = Math.max(-1, Math.min(1, (e.gamma || 0) / 30));
        const normY = Math.max(-1, Math.min(1, (e.beta || 0) / 30));
        setPos({
          x: (normX + 1) * 0.5 * window.innerWidth,
          y: (normY + 1) * 0.5 * window.innerHeight,
          normalizedX: normX,
          normalizedY: normY,
        });
      }
    };

    // Scroll fallback if no gyro/mouse active
    const handleScroll = () => {
      if (!hasGyro && window.matchMedia('(hover: none)').matches) {
        const scrollFactor = Math.sin((window.scrollY / (document.body.scrollHeight || 1)) * Math.PI * 2);
        setPos((prev) => ({
          ...prev,
          normalizedY: scrollFactor * 0.5,
        }));
      }
    };

    window.addEventListener('mousemove', handleMouse, { passive: true });

    // iOS 13+ DeviceOrientation permission handle
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const DeviceEvent = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      if (typeof DeviceEvent.requestPermission === 'function') {
        // Handle iOS permission silently on user interaction
        const requestPerm = () => {
          DeviceEvent.requestPermission!()
            .then((res) => {
              if (res === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation, true);
              }
            })
            .catch(() => {})
            .finally(() => {
              window.removeEventListener('touchstart', requestPerm);
              window.removeEventListener('click', requestPerm);
            });
        };
        window.addEventListener('touchstart', requestPerm, { once: true });
        window.addEventListener('click', requestPerm, { once: true });
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return pos;
}

