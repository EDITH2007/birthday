'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const rafId = useRef<number>(0);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
    pos.current.y = lerp(pos.current.y, target.current.y, 0.15);

    if (cursorRef.current) {
      const size = isHovering.current ? 48 : 24;
      cursorRef.current.style.transform = `translate3d(${pos.current.x - size / 2}px, ${pos.current.y - size / 2}px, 0)`;
      cursorRef.current.style.width = `${size}px`;
      cursorRef.current.style.height = `${size}px`;
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isMobile || reducedMotion) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = () => { isHovering.current = true; };
    const onLeave = () => { isHovering.current = false; };

    document.addEventListener('mousemove', onMove);
    rafId.current = requestAnimationFrame(animate);

    // Listen for hover on interactive elements
    const interactives = () => document.querySelectorAll('a, button, input, [role="button"], [data-hoverable]');
    const observer = new MutationObserver(() => {
      interactives().forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    interactives().forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
      observer.disconnect();
    };
  }, [isMobile, reducedMotion, animate]);

  if (isMobile || reducedMotion) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'rgba(31, 35, 64, 0.15)',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'width 0.3s cubic-bezier(0.22, 1, 0.36, 1), height 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        mixBlendMode: 'darken',
        willChange: 'transform',
      }}
    />
  );
}
