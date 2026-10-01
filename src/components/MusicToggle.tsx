'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion, toggleMotionPreference } from '@/hooks/useReducedMotion';

export default function BottomControls() {
  const [musicExists, setMusicExists] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Check if music.mp3 exists
    fetch('/music.mp3', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          setMusicExists(true);
          audioRef.current = new Audio('/music.mp3');
          audioRef.current.loop = true;
          audioRef.current.volume = 0.3;
        }
      })
      .catch(() => {});
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <div
      className="fixed z-50 flex items-center gap-2"
      style={{
        bottom: 'calc(1.25rem + var(--sab, 0px))',
        right: 'calc(1.25rem + var(--sar, 0px))',
      }}
    >
      {/* Motion toggle button */}
      <button
        onClick={toggleMotionPreference}
        aria-label={reduced ? 'Enable animations' : 'Reduce motion'}
        title={reduced ? 'Enable animations' : 'Reduce motion'}
        className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-md transition-all active:scale-95"
        style={{
          background: reduced ? '#FFD35A' : 'rgba(255,251,242,0.9)',
          backdropFilter: 'blur(8px)',
          color: '#1F2340',
          border: '1px solid rgba(31,35,64,0.12)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {reduced ? (
            // Pause/Static icon
            <path d="M12 2v20M2 12h20" />
          ) : (
            // Motion sparkle icon
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="currentColor" opacity="0.8" />
          )}
        </svg>
      </button>

      {/* Music toggle button */}
      {musicExists && (
        <button
          onClick={toggleMusic}
          aria-label={playing ? 'Pause music' : 'Play music'}
          className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-md transition-all active:scale-95"
          style={{
            background: playing ? '#7EE0B5' : 'rgba(255,251,242,0.9)',
            backdropFilter: 'blur(8px)',
            color: '#1F2340',
            border: '1px solid rgba(31,35,64,0.12)',
          }}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 22v-20l18 10z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
