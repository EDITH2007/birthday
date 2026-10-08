'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const hoverType = useRef<string>('');
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches);
    };
    checkTouch();
  }, []);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    // Dot follows tightly
    dotPos.current.x = lerp(dotPos.current.x, target.current.x, 0.35);
    dotPos.current.y = lerp(dotPos.current.y, target.current.y, 0.35);
    // Ring lerps behind
    ringPos.current.x = lerp(ringPos.current.x, target.current.x, 0.12);
    ringPos.current.y = lerp(ringPos.current.y, target.current.y, 0.12);

    const isHovering = hoverType.current !== '';

    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${dotPos.current.x - 5}px, ${dotPos.current.y - 5}px, 0) scale(${isHovering ? 0.6 : 1})`;
    }

    if (ringRef.current) {
      const ringScale = isHovering ? 1.35 : 1;
      ringRef.current.style.transform = `translate3d(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px, 0) scale(${ringScale})`;
      ringRef.current.style.borderColor = isHovering
        ? 'rgba(124, 198, 254, 0.6)'
        : 'rgba(142, 155, 255, 0.35)';
    }

    if (labelRef.current) {
      labelRef.current.style.transform = `translate3d(${ringPos.current.x + 20}px, ${ringPos.current.y - 8}px, 0)`;
      labelRef.current.style.opacity = isHovering ? '1' : '0';
      labelRef.current.textContent = hoverType.current || '';
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isMobile || isTouchDevice || reducedMotion) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const getHoverLabel = (el: Element): string => {
      if (el.getAttribute('data-cursor-label')) return el.getAttribute('data-cursor-label')!;
      const tag = el.tagName.toLowerCase();
      if (tag === 'button' || el.getAttribute('role') === 'button') return 'Tap';
      if (tag === 'a') return 'Open';
      if (tag === 'input' || tag === 'textarea') return 'Type';
      if (el.hasAttribute('data-hoverable')) return 'Tap';
      if ((el as HTMLElement).draggable) return 'Drag';
      return 'Tap';
    };

    const onEnter = (e: Event) => {
      hoverType.current = getHoverLabel(e.target as Element);
    };
    const onLeave = () => {
      hoverType.current = '';
    };

    document.addEventListener('mousemove', onMove);
    rafId.current = requestAnimationFrame(animate);

    const interactiveSelector = 'a, button, input, textarea, [role="button"], [data-hoverable]';
    const attachListeners = () => {
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    attachListeners();

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
      observer.disconnect();
    };
  }, [isMobile, isTouchDevice, reducedMotion, animate]);

  if (isMobile || isTouchDevice || reducedMotion) return null;

  return (
    <>
      {/* Ink dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#1F2340',
          pointerEvents: 'none',
          zIndex: 10000,
          willChange: 'transform',
          transition: 'transform 0.1s ease',
        }}
      />
      {/* Soft ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid rgba(142, 155, 255, 0.35)',
          background: 'transparent',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          transition: 'width 0.35s cubic-bezier(0.22, 1, 0.36, 1), height 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease',
        }}
      />
      {/* Label */}
      <span
        ref={labelRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          fontSize: 10,
          fontFamily: 'var(--font-manrope), sans-serif',
          fontWeight: 600,
          color: '#8E9BFF',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          zIndex: 10001,
          opacity: 0,
          willChange: 'transform, opacity',
          transition: 'opacity 0.25s ease',
        }}
      />
    </>
  );
}
