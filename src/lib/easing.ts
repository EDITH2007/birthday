/** Primary easing curve — springy ease-out, used everywhere for consistency. */
export const EASE_PRIMARY = [0.22, 1, 0.36, 1] as const;

/** CSS version of the primary easing curve. */
export const EASE_PRIMARY_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** Framer Motion spring config for playful bounces. */
export const SPRING_PLAYFUL = { stiffness: 120, damping: 14 };

/** Framer Motion spring config for softer, slower animations. */
export const SPRING_SOFT = { stiffness: 80, damping: 20 };

/** Standard durations. */
export const DURATION = {
  fast: 0.4,
  normal: 0.7,
  slow: 1.0,
  slower: 1.2,
} as const;
