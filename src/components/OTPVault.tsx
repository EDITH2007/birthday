'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SECRET_CODE, CODE_HINT } from '@/content/config';
import { EASE_PRIMARY, SPRING_PLAYFUL } from '@/lib/easing';

interface OTPVaultProps {
  onUnlock: () => void;
  onCorrectCode?: () => void;
}

export default function OTPVault({ onUnlock, onCorrectCode }: OTPVaultProps) {
  const [values, setValues] = useState<string[]>(Array(5).fill(''));
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [wrongMessage, setWrongMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const wrongMessages = [
    'Not quite! Try again.',
    'Close, but no confetti yet!',
    'Hmm, that\u2019s not it. Check the hint!',
  ];

  const handleFocus = () => {
    if (typeof window !== 'undefined' && window.visualViewport) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    }
  };

  const checkCode = useCallback(
    (vals: string[]) => {
      const code = vals.join('').toUpperCase();
      if (code.length === 5) {
        if (code === SECRET_CODE.toUpperCase()) {
          setStatus('correct');
          sessionStorage.setItem('vault-unlocked', 'true');

          if (onCorrectCode) {
            onCorrectCode();
          }

          confetti({
            particleCount: 60,
            spread: 70,
            origin: { x: 0.15, y: 0.85 },
            angle: 60,
            colors: ['#FFD35A', '#7CC6FE', '#7EE0B5', '#FF9F43', '#8E9BFF'],
          });
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { x: 0.85, y: 0.85 },
            angle: 120,
            colors: ['#FFD35A', '#7CC6FE', '#7EE0B5', '#FF9F43', '#8E9BFF'],
          });

          setTimeout(onUnlock, 1200);
        } else {
          setStatus('wrong');
          setWrongMessage(wrongMessages[Math.floor(Math.random() * wrongMessages.length)]);
          setTimeout(() => {
            setValues(Array(5).fill(''));
            setStatus('idle');
            inputRefs.current[0]?.focus();
          }, 1000);
        }
      }
    },
    [onUnlock],
  );

  const handleChange = (index: number, value: string) => {
    if (status !== 'idle') return;
    const char = value.slice(-1).toUpperCase();
    if (!/[A-Z0-9]/.test(char) && char !== '') return;

    const newValues = [...values];
    newValues[index] = char;
    setValues(newValues);

    if (char && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    checkCode(newValues);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      const newValues = [...values];
      newValues[index - 1] = '';
      setValues(newValues);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').toUpperCase().slice(0, 5);
    const chars = text.split('').filter((c) => /[A-Z0-9]/.test(c));
    const newValues = [...values];
    chars.forEach((c, i) => {
      if (i < 5) newValues[i] = c;
    });
    setValues(newValues);
    const nextEmpty = newValues.findIndex((v) => !v);
    inputRefs.current[nextEmpty === -1 ? 4 : nextEmpty]?.focus();
    checkCode(newValues);
  };

  const boxVariants = {
    idle: { scale: 1, borderColor: 'rgba(31,35,64,0.15)' },
    wrong: {
      x: [0, -8, 8, -6, 6, -3, 3, 0],
      borderColor: '#FF9F43',
      transition: { duration: 0.5 },
    },
    correct: {
      scale: [1, 1.1, 1],
      borderColor: '#7EE0B5',
      backgroundColor: 'rgba(126,224,181,0.15)',
      transition: { duration: 0.4 },
    },
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-6 relative px-3 sm:px-6 py-6 sm:py-8 rounded-2xl w-full max-w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,251,242,0.9) 0%, rgba(240,244,255,0.9) 100%)',
        border: status === 'correct' ? '2px solid rgba(126,224,181,0.5)' : '2px solid rgba(31,35,64,0.08)',
        boxShadow: status === 'correct'
          ? '0 0 40px rgba(126,224,181,0.3), 0 8px 30px rgba(31,35,64,0.08)'
          : '0 8px 30px rgba(31,35,64,0.06)',
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
      }}
    >
      {/* Lock icon */}
      <motion.div
        className="mb-1 sm:mb-2"
        animate={
          status === 'wrong'
            ? { animation: 'lock-rattle 0.5s ease-in-out' }
            : {}
        }
        style={{
          animation: status === 'wrong' ? 'lock-rattle 0.5s ease-in-out' : 'none',
        }}
      >
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          <rect
            x="12"
            y="22"
            width="24"
            height="20"
            rx="4"
            fill={status === 'correct' ? '#7EE0B5' : '#1F2340'}
            opacity={status === 'correct' ? 1 : 0.15}
            stroke={status === 'correct' ? '#7EE0B5' : '#1F2340'}
            strokeWidth="2"
          />
          <motion.path
            d="M16 22V16C16 11.6 19.6 8 24 8C28.4 8 32 11.6 32 16V22"
            stroke={status === 'correct' ? '#7EE0B5' : '#1F2340'}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity={status === 'correct' ? 1 : 0.3}
            animate={
              status === 'correct'
                ? { y: -6, opacity: 1 }
                : { y: 0 }
            }
            transition={{ type: 'spring', ...SPRING_PLAYFUL }}
          />
          <circle
            cx="24"
            cy="32"
            r="3"
            fill={status === 'correct' ? '#FFFBF2' : '#1F2340'}
            opacity={status === 'correct' ? 0.8 : 0.4}
          />
          <rect
            x="23"
            y="33"
            width="2"
            height="4"
            rx="1"
            fill={status === 'correct' ? '#FFFBF2' : '#1F2340'}
            opacity={status === 'correct' ? 0.8 : 0.4}
          />
        </svg>
      </motion.div>

      {/* Glow rays on correct */}
      <AnimatePresence>
        {status === 'correct' && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'radial-gradient(circle at 50% 30%, rgba(126,224,181,0.2), transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex gap-1.5 xs:gap-2 sm:gap-3 justify-center w-full" onPaste={handlePaste}>
        {values.map((val, i) => (
          <motion.div
            key={i}
            variants={boxVariants}
            animate={status}
            transition={{ ease: EASE_PRIMARY }}
            className="flex-shrink-0"
          >
            <input
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="text"
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              maxLength={1}
              value={val}
              onFocus={handleFocus}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-[48px] h-[54px] xs:w-12 xs:h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(255,211,90,0.3)] touch-manipulation"
              style={{
                fontFamily: 'var(--font-manrope)',
                color: '#1F2340',
                fontSize: '20px',
                background: status === 'correct' ? 'rgba(126,224,181,0.15)' : 'rgba(255,251,242,0.8)',
                borderColor:
                  status === 'correct'
                    ? '#7EE0B5'
                    : status === 'wrong'
                      ? '#FF9F43'
                      : val
                        ? 'rgba(31,35,64,0.3)'
                        : 'rgba(31,35,64,0.12)',
                caretColor: '#FFD35A',
              }}
              aria-label={`Code character ${i + 1}`}
            />
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-xs sm:text-sm opacity-60 text-center"
        style={{ color: '#1F2340', fontFamily: 'var(--font-manrope)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.3, ...SPRING_PLAYFUL }}
      >
        {CODE_HINT}
      </motion.p>

      {status === 'wrong' && wrongMessage && (
        <motion.p
          className="text-xs sm:text-sm font-medium text-center"
          style={{ color: '#FF9F43' }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {wrongMessage}
        </motion.p>
      )}

      {status === 'correct' && (
        <motion.p
          className="text-xs sm:text-sm font-semibold text-center"
          style={{ color: '#7EE0B5' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          ✦ Unlocked! ✦
        </motion.p>
      )}
    </div>
  );
}
