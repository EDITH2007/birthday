'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SECRET_CODE, CODE_HINT } from '@/content/config';
import { EASE_PRIMARY, SPRING_PLAYFUL } from '@/lib/easing';

interface OTPVaultProps {
  onUnlock: () => void;
}

export default function OTPVault({ onUnlock }: OTPVaultProps) {
  const [values, setValues] = useState<string[]>(Array(5).fill(''));
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [wrongMessage, setWrongMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const wrongMessages = [
    'Not quite! Try again.',
    'Close, but no confetti yet!',
    'Hmm, that\u2019s not it. Check the hint!',
  ];

  const checkCode = useCallback(
    (vals: string[]) => {
      const code = vals.join('').toUpperCase();
      if (code.length === 5) {
        if (code === SECRET_CODE.toUpperCase()) {
          setStatus('correct');
          // Store unlock in sessionStorage
          sessionStorage.setItem('vault-unlocked', 'true');

          // Confetti
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.7 },
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
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-3" onPaste={handlePaste}>
        {values.map((val, i) => (
          <motion.div
            key={i}
            variants={boxVariants}
            animate={status}
            transition={{ ease: EASE_PRIMARY }}
          >
            <input
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="text"
              autoCapitalize="characters"
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(255,211,90,0.3)]"
              style={{
                fontFamily: 'var(--font-manrope)',
                color: '#1F2340',
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
        className="text-sm opacity-60 text-center"
        style={{ color: '#1F2340', fontFamily: 'var(--font-manrope)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.3, ...SPRING_PLAYFUL }}
      >
        {CODE_HINT}
      </motion.p>

      {status === 'wrong' && wrongMessage && (
        <motion.p
          className="text-sm font-medium text-center"
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
          className="text-sm font-semibold text-center"
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
