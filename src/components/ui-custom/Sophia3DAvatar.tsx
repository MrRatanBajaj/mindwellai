import React, { useEffect, useState } from 'react';
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

const speakingBars = [0.8, 1.1, 0.9, 1.2, 0.7];
const particles = [18, 32, 45, 58, 70, 84];

function EyeBlinkOverlay() {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.4) {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
      }
    }, 2600);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {blink && (
        <>
          <motion.div
            className="absolute z-10 rounded-full bg-muted"
            style={{ top: '27.5%', left: '37%', width: '8%', height: '2.2%' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 0.14 }}
          />
          <motion.div
            className="absolute z-10 rounded-full bg-muted"
            style={{ top: '27.5%', right: '37%', width: '8%', height: '2.2%' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 0.14 }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

const Sophia3DAvatar: React.FC<Sophia3DAvatarProps> = ({
  isSpeaking = false,
  isListening = false,
  isActive = false,
  size = 'lg',
  className,
}) => {
  const sizeMap = {
    sm: 'w-52 h-64',
    md: 'w-72 h-80',
    lg: 'w-[360px] h-[440px]',
    xl: 'w-[420px] h-[520px]',
  };

  return (
    <div className={cn('relative flex items-center justify-center', sizeMap[size], className)}>
      {/* Room background */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl border border-border/40 bg-card/50 backdrop-blur-sm">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, hsl(var(--muted) / 0.75) 0%, hsl(var(--background) / 0.95) 68%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[28%]"
          style={{
            background:
              'linear-gradient(0deg, hsl(var(--secondary) / 0.85) 0%, hsl(var(--secondary) / 0.35) 100%)',
            clipPath: 'polygon(0 100%, 100% 100%, 76% 0, 24% 0)',
          }}
        />
        <div className="absolute top-[18%] left-[12%] h-[30%] w-[2px] bg-border/40" />
        <div className="absolute top-[18%] right-[12%] h-[30%] w-[2px] bg-border/40" />
      </div>

      {/* Speaker glow */}
      <motion.div
        className="absolute -inset-4 rounded-[2rem]"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.08), transparent 68%)',
        }}
        animate={{
          opacity: isSpeaking ? [0.35, 0.95, 0.35] : 0.2,
          scale: isSpeaking ? [1, 1.05, 1] : [1, 1.01, 1],
        }}
        transition={{ duration: isSpeaking ? 1.3 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Half-body Sophia with motion */}
      <motion.div
        className="relative z-10 h-full w-full overflow-hidden rounded-3xl"
        animate={{
          y: isSpeaking ? [0, -4, 0] : [0, -2, 0],
          rotateZ: isSpeaking ? [0, 0.2, -0.2, 0] : [0, 0.1, -0.1, 0],
        }}
        transition={{ duration: isSpeaking ? 1.6 : 3.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.img
          src={sophiaImage}
          alt="Sophia AI counselor"
          className="h-full w-full select-none object-cover"
          style={{ objectPosition: 'center 14%' }}
          draggable={false}
          animate={{ scale: [1.18, 1.205, 1.18] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
        <EyeBlinkOverlay />

        {/* Speaking mouth animation */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              className="absolute bottom-[39%] left-1/2 z-20 flex -translate-x-1/2 items-end gap-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
            >
              {speakingBars.map((bar, index) => (
                <motion.div
                  key={index}
                  className="w-[3px] rounded-full bg-primary/70"
                  animate={{ height: [4, 5 + bar * 8, 4, 4 + bar * 7, 4] }}
                  transition={{
                    duration: 0.34 + index * 0.05,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.05,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Listening pulse */}
      <AnimatePresence>
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-primary/35"
              initial={{ scale: 1, opacity: 0.65 }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.65, 0, 0.65] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-3xl border border-accent/35"
              initial={{ scale: 1, opacity: 0.55 }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.35 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Speaking particles */}
      <AnimatePresence>
        {isSpeaking &&
          particles.map((left, index) => (
            <motion.div
              key={left}
              className="absolute z-20 h-1.5 w-1.5 rounded-full bg-primary/40"
              style={{ left: `${left}%`, bottom: '30%' }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.85, 0], y: [-8, -70], x: [0, index % 2 === 0 ? 10 : -10] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 + (index % 3) * 0.25, repeat: Infinity, delay: index * 0.18, ease: 'easeOut' }}
            />
          ))}
      </AnimatePresence>

      {/* Status chip */}
      {isActive && (
        <motion.div
          className="absolute -bottom-3 left-1/2 z-20 -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
            {isSpeaking ? '🗣️ Speaking...' : isListening ? '🎧 Listening...' : '💚 Ready'}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Sophia3DAvatar;
