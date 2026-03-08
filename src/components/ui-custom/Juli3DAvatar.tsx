import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import juliImg from '@/assets/juli-fullbody.png';

interface Juli3DAvatarProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Juli3DAvatar: React.FC<Juli3DAvatarProps> = ({
  isSpeaking = false,
  isListening = false,
  isActive = false,
  size = 'lg',
  className,
}) => {
  const sizeMap = {
    sm: 'w-40 h-48',
    md: 'w-56 h-64',
    lg: 'w-72 h-80',
    xl: 'w-[340px] h-[400px]',
  };

  return (
    <div className={cn('relative flex items-end justify-center', className)}>

      {/* Soft ambient glow behind — no circle */}
      {isActive && (
        <motion.div
          className="absolute inset-0 -m-8"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 55%, hsl(var(--primary) / 0.12), transparent 70%)' }}
          animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Speaking energy pulse — no circle */}
      {isSpeaking && (
        <motion.div
          className="absolute inset-0 -m-6"
          style={{ background: 'radial-gradient(ellipse 55% 65% at 50% 50%, hsl(var(--primary) / 0.2), hsl(280 76% 50% / 0.08), transparent 70%)' }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.97, 1.05, 0.97] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        />
      )}

      {/* Listening soft glow */}
      {isListening && !isSpeaking && (
        <motion.div
          className="absolute inset-0 -m-4"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 55%, hsl(142 76% 36% / 0.12), transparent 70%)' }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}

      {/* ═══ Main Avatar Container — NO circle, clean transparent ═══ */}
      <div className={cn(sizeMap[size], 'relative')}>

        {/* Full-body image with lifelike animations */}
        <motion.img
          src={juliImg}
          alt="Juli — AI Mental Health Counselor"
          className="w-full h-full object-contain object-bottom select-none pointer-events-none"
          draggable={false}
          animate={isSpeaking ? {
            // Speaking: subtle head nod + body sway + hand gesture
            y: [0, -3, 1, -2, 0],
            x: [0, 1.5, -1, 0.8, 0],
            rotate: [0, 0.4, -0.3, 0.2, 0],
            scale: [1, 1.005, 0.998, 1.003, 1],
          } : isListening ? {
            // Listening: gentle lean-in + slight nod
            y: [0, -1.5, 0],
            rotate: [0, 0.2, 0, -0.15, 0],
            scale: [1, 1.002, 1],
          } : isActive ? {
            // Active idle: natural breathing sway
            y: [0, -2, 0],
            rotate: [0, 0.15, 0, -0.15, 0],
          } : {
            // Static idle: very subtle breathing
            y: [0, -1, 0],
            scale: [1, 1.002, 1],
          }}
          transition={{
            duration: isSpeaking ? 0.55 : isListening ? 3 : isActive ? 5 : 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* ─── Face region motion overlay (mouth area animation) ─── */}
        {isSpeaking && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: '28%', width: '30%', height: '8%' }}
          >
            {/* Mouth movement indicator — subtle shadow pulse */}
            <motion.div
              className="w-full h-full rounded-full"
              style={{ background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.08), transparent 80%)' }}
              animate={{
                scaleX: [1, 1.3, 0.85, 1.2, 0.95, 1.15, 1],
                scaleY: [1, 0.7, 1.4, 0.8, 1.25, 0.85, 1],
                opacity: [0.15, 0.35, 0.15],
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
          </motion.div>
        )}

        {/* ─── Eye blink simulation ─── */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ top: '18%', width: '40%', height: '4%' }}
        >
          <motion.div
            className="w-full h-full"
            style={{ background: 'linear-gradient(180deg, transparent 30%, hsl(var(--background) / 0.08) 50%, transparent 70%)' }}
            animate={{ 
              opacity: [0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              scaleY: [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, repeatDelay: 1 }}
          />
        </motion.div>

        {/* ─── Speaking sound waves ─── */}
        {isSpeaking && (
          <div className="absolute right-0 top-[22%] flex flex-col gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`wave-${i}`}
                className="rounded-full bg-primary/50"
                style={{ width: `${8 + i * 3}px`, height: '2px' }}
                animate={{ scaleX: [1, 2, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 0.35, repeat: Infinity, delay: i * 0.08 }}
              />
            ))}
          </div>
        )}

        {/* Shimmer light sweep for depth */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(110deg, transparent 35%, hsl(var(--primary) / 0.04) 50%, transparent 65%)' }}
          animate={{ x: ['-120%', '220%'] }}
          transition={{ duration: 5, repeat: Infinity, repeatDelay: 4 }}
        />
      </div>

      {/* ═══ Status Badge — below avatar ═══ */}
      {isActive && (
        <motion.div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-xl z-10"
          style={{
            background: isSpeaking
              ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(280 76% 50%))'
              : isListening
                ? 'linear-gradient(135deg, hsl(142 76% 36%), hsl(160 76% 40%))'
                : 'linear-gradient(135deg, hsl(142 76% 36%), hsl(var(--primary)))',
          }}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >
          {isSpeaking ? (
            <span className="flex items-center gap-2">
              <motion.div className="flex gap-0.5 items-end">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white rounded-full"
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
              Speaking...
            </span>
          ) : isListening ? (
            <span className="flex items-center gap-1.5">
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>🎧</motion.span>
              Listening...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>💚</motion.span>
              Ready
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Juli3DAvatar;
