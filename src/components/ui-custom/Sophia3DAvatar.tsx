import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import sophiaImage from '@/assets/sophia-fullbody.jpg';

interface Sophia3DAvatarProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/* ══════════════════════════════════════════════════════════
   SOPHIA — Realistic AI Counselor Avatar
   Uses actual Sophia image with layered animations
   Mouth motion, breathing, glow effects, status indicators
   ══════════════════════════════════════════════════════════ */

// Speaking mouth animation bars
const MouthAnimation = ({ isSpeaking }: { isSpeaking: boolean }) => {
  return (
    <AnimatePresence>
      {isSpeaking && (
        <motion.div
          className="absolute bottom-[38%] left-1/2 -translate-x-1/2 flex items-end gap-[2px] z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
        >
          {[0.6, 1, 0.7, 0.9, 0.5].map((h, i) => (
            <motion.div
              key={i}
              className="w-[3px] rounded-full bg-rose-400/60"
              animate={{
                height: isSpeaking ? [4, 4 + h * 8, 4, 4 + h * 6, 4] : [4],
              }}
              transition={{
                duration: 0.3 + i * 0.05,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.06,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Breathing animation overlay
const BreathingOverlay = () => (
  <motion.div
    className="absolute inset-0 rounded-3xl pointer-events-none"
    animate={{
      scale: [1, 1.006, 1],
    }}
    transition={{
      duration: 3.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

// Listening pulse ring
const ListeningPulse = ({ isListening }: { isListening: boolean }) => (
  <AnimatePresence>
    {isListening && (
      <>
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-emerald-400/30"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 rounded-3xl border border-emerald-400/20"
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </>
    )}
  </AnimatePresence>
);

// Speaking glow effect
const SpeakingGlow = ({ isSpeaking }: { isSpeaking: boolean }) => (
  <motion.div
    className="absolute -inset-4 rounded-[2rem] pointer-events-none"
    style={{
      background: 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.15), transparent 70%)',
    }}
    animate={{
      opacity: isSpeaking ? [0.5, 1, 0.5] : 0.15,
      scale: isSpeaking ? [1, 1.06, 1] : 1,
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

// Floating particles when speaking
const FloatingParticles = ({ isSpeaking }: { isSpeaking: boolean }) => (
  <AnimatePresence>
    {isSpeaking && (
      <>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: '30%',
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [-10, -60 - Math.random() * 40],
              x: [0, (Math.random() - 0.5) * 30],
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeOut',
            }}
          />
        ))}
      </>
    )}
  </AnimatePresence>
);

// Subtle eye blink simulation (overlay)
const EyeBlinkOverlay = () => {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    };
    const interval = setInterval(() => {
      if (Math.random() > 0.3) blink();
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {blinking && (
        <>
          {/* Left eye area */}
          <motion.div
            className="absolute w-[8%] h-[2.5%] bg-[#c68642] rounded-full z-10"
            style={{ top: '28%', left: '37%' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 0.15 }}
          />
          {/* Right eye area */}
          <motion.div
            className="absolute w-[8%] h-[2.5%] bg-[#c68642] rounded-full z-10"
            style={{ top: '28%', right: '37%' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 0.15 }}
          />
        </>
      )}
    </AnimatePresence>
  );
};

const Sophia3DAvatar: React.FC<Sophia3DAvatarProps> = ({
  isSpeaking = false,
  isListening = false,
  isActive = false,
  size = 'lg',
  className,
}) => {
  const sizeMap = {
    sm: 'w-48 h-56',
    md: 'w-64 h-72',
    lg: 'w-80 h-[420px]',
    xl: 'w-[380px] h-[500px]',
  };

  return (
    <div className={cn('relative flex items-center justify-center', sizeMap[size], className)}>
      {/* Background glow */}
      <SpeakingGlow isSpeaking={isSpeaking} />

      {/* Main avatar container */}
      <motion.div
        className="relative w-full h-full rounded-3xl overflow-hidden"
        animate={{
          // Subtle breathing sway
          rotateZ: isSpeaking
            ? [0, 0.3, -0.3, 0]
            : [0, 0.15, -0.15, 0],
        }}
        transition={{
          duration: isSpeaking ? 2 : 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Sophia image */}
        <motion.img
          src={sophiaImage}
          alt="Sophia - AI Counselor"
          className="w-full h-full object-cover object-top rounded-3xl select-none"
          draggable={false}
          animate={{
            // Breathing scale
            scale: [1, 1.008, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl pointer-events-none" />

        {/* Eye blink overlay */}
        <EyeBlinkOverlay />

        {/* Mouth speaking animation */}
        <MouthAnimation isSpeaking={isSpeaking} />
      </motion.div>

      {/* Listening pulse rings */}
      <ListeningPulse isListening={isListening} />

      {/* Speaking particles */}
      <FloatingParticles isSpeaking={isSpeaking} />

      {/* Status indicator */}
      {isActive && (
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className={cn(
              'px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-xl backdrop-blur-sm',
              isSpeaking
                ? 'bg-gradient-to-r from-primary to-purple-500'
                : isListening
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                  : 'bg-gradient-to-r from-emerald-500 to-primary'
            )}
          >
            {isSpeaking ? '🗣️ Speaking...' : isListening ? '🎧 Listening...' : '💚 Ready'}
          </div>
        </motion.div>
      )}

      {/* Active session ring */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-primary/30 pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
};

export default Sophia3DAvatar;
