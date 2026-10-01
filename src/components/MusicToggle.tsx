'use client';

import { useEffect, useRef, useState } from 'react';

export default function MusicToggle() {
  const [exists, setExists] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check if music.mp3 exists
    fetch('/music.mp3', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          setExists(true);
          audioRef.current = new Audio('/music.mp3');
          audioRef.current.loop = true;
          audioRef.current.volume = 0.3;
        }
      })
      .catch(() => {});
  }, []);

  if (!exists) return null;

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Pause music' : 'Play music'}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all"
      style={{
        background: playing ? '#FFD35A' : 'rgba(31,35,64,0.08)',
        color: '#1F2340',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {playing ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 22v-20l18 10z" />
        </svg>
      )}
    </button>
  );
}
