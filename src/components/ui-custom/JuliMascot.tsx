import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface JuliMascotProps {
  isActive?: boolean;
  isSpeaking?: boolean;
  isListening?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const JuliMascot: React.FC<JuliMascotProps> = ({
  isActive = false,
  isSpeaking = false,
  isListening = false,
  size = 'lg',
  className
}) => {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
    xl: 'w-52 h-52'
  };

  const innerSizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48'
  };

  return (
    <div className={cn("relative", className)}>
      {/* Outer Glow Rings */}
      {isActive && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-emerald-500/30"
            animate={{
              scale: [1, 1.3, 1.3],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/30 to-primary/30"
            animate={{
              scale: [1, 1.5, 1.5],
              opacity: [0.4, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20"
            animate={{
              scale: [1, 1.7, 1.7],
              opacity: [0.3, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1
            }}
          />
        </>
      )}

      {/* Main Mascot Container */}
      <motion.div
        className={cn(
          sizeClasses[size],
          "relative rounded-full",
          "bg-gradient-to-br from-primary via-primary/80 to-emerald-500",
          "shadow-2xl shadow-primary/30",
          isActive && "ring-4 ring-primary/30 ring-offset-4 ring-offset-background"
        )}
        animate={isSpeaking ? {
          scale: [1, 1.03, 1],
        } : isListening ? {
          scale: [1, 1.01, 1],
        } : {}}
        transition={{
          duration: isSpeaking ? 0.3 : 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Inner Circle with Face */}
        <motion.div
          className={cn(
            innerSizeClasses[size],
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "rounded-full bg-gradient-to-br from-background via-background to-muted",
            "flex flex-col items-center justify-center overflow-hidden"
          )}
        >
          {/* Face Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Eyes */}
            <div className="absolute top-[35%] flex items-center gap-3">
              {/* Left Eye */}
              <motion.div
                className="relative"
                animate={isSpeaking ? { y: [0, -1, 0] } : {}}
                transition={{ duration: 0.3, repeat: Infinity }}
              >
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-foreground" />
                <motion.div
                  className="absolute top-0.5 left-0.5 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white"
                  animate={{ opacity: [1, 0.8, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Right Eye */}
              <motion.div
                className="relative"
                animate={isSpeaking ? { y: [0, -1, 0] } : {}}
                transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
              >
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-foreground" />
                <motion.div
                  className="absolute top-0.5 left-0.5 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white"
                  animate={{ opacity: [1, 0.8, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>

            {/* Blush Marks */}
            <div className="absolute top-[42%] flex items-center justify-between w-[70%]">
              <div className="w-2.5 h-1.5 md:w-3 md:h-2 rounded-full bg-rose-300/50" />
              <div className="w-2.5 h-1.5 md:w-3 md:h-2 rounded-full bg-rose-300/50" />
            </div>

            {/* Mouth */}
            <motion.div
              className="absolute top-[55%]"
              animate={isSpeaking ? {
                scaleY: [1, 1.3, 0.8, 1.2, 1],
                scaleX: [1, 0.9, 1.1, 0.95, 1]
              } : {}}
              transition={{ duration: 0.2, repeat: Infinity }}
            >
              {isSpeaking ? (
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-foreground/80 flex items-center justify-center">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-rose-400/60" />
                </div>
              ) : isListening ? (
                <div className="w-6 h-3 md:w-8 md:h-4 rounded-full border-2 border-foreground/80 border-t-0" />
              ) : (
                <motion.div
                  className="w-5 h-2 md:w-6 md:h-2.5 rounded-full bg-foreground/80"
                  style={{ borderRadius: '0 0 100px 100px' }}
                  animate={{ scaleX: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Sparkles when speaking */}
            {isSpeaking && (
              <>
                <motion.div
                  className="absolute top-[20%] left-[15%] text-yellow-400"
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                >
                  ✦
                </motion.div>
                <motion.div
                  className="absolute top-[25%] right-[15%] text-primary"
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: [0, -180, -360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                >
                  ✦
                </motion.div>
                <motion.div
                  className="absolute bottom-[25%] left-[20%] text-emerald-400"
                  animate={{ 
                    scale: [0, 0.8, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.6 }}
                >
                  ✦
                </motion.div>
              </>
            )}

            {/* Sound Waves when speaking */}
            {isSpeaking && (
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-0.5 bg-primary rounded-full"
                    animate={{
                      scaleX: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Headphones */}
        <div className="absolute inset-0">
          {/* Left Ear */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
            animate={isActive ? { x: [-2, 0, -2] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-4 h-8 md:w-5 md:h-10 bg-gradient-to-b from-primary to-primary/70 rounded-l-full shadow-lg" />
          </motion.div>
          
          {/* Right Ear */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
            animate={isActive ? { x: [2, 0, 2] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-4 h-8 md:w-5 md:h-10 bg-gradient-to-b from-primary to-primary/70 rounded-r-full shadow-lg" />
          </motion.div>

          {/* Headband */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-t-full" />
        </div>

        {/* Active Status Indicator */}
        {isActive && (
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isSpeaking ? '💬 Speaking' : isListening ? '👂 Listening' : '🟢 Active'}
          </motion.div>
        )}
      </motion.div>

      {/* Floating Hearts/Stars when active */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg"
              style={{
                left: `${20 + i * 15}%`,
                top: '0%'
              }}
              animate={{
                y: [-20, -60, -100],
                x: [0, (i % 2 === 0 ? 10 : -10), (i % 2 === 0 ? -5 : 5)],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut"
              }}
            >
              {i % 2 === 0 ? '💜' : '✨'}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JuliMascot;
