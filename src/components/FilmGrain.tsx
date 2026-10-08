'use client';

export default function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.02]"
      style={{
        backgroundImage: `radial-gradient(circle, #1F2340 0.5px, transparent 0.5px)`,
        backgroundSize: '16px 16px',
      }}
    />
  );
}


