import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles, Heart, Star, Music, Smile } from 'lucide-react';

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
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
    xl: 'w-56 h-56'
  };

  const innerSizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-44 h-44',
    xl: 'w-52 h-52'
  };

  return (
    <div className={cn("relative", className)}>
      {/* Outer Glow Rings - Enhanced */}
      {isActive && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(${45 + i * 30}deg, hsl(var(--primary) / ${0.3 - i * 0.05}), hsl(142 76% 36% / ${0.3 - i * 0.05}), hsl(280 76% 50% / ${0.2 - i * 0.04}))`,
              }}
              animate={{
                scale: [1, 1.3 + i * 0.15, 1.3 + i * 0.15],
                opacity: [0.4 - i * 0.08, 0, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.3
              }}
            />
          ))}
        </>
      )}

      {/* Sound Wave Circles when speaking */}
      {isSpeaking && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`sound-${i}`}
              className="absolute inset-0 rounded-full border-2 border-primary/40"
              animate={{
                scale: [1, 1.8 + i * 0.2],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.2
              }}
            />
          ))}
        </>
      )}

      {/* Main Mascot Container */}
      <motion.div
        className={cn(
          sizeClasses[size],
          "relative rounded-full",
          "bg-gradient-to-br from-primary via-purple-500 to-emerald-500",
          "shadow-2xl",
          isActive && "ring-4 ring-primary/30 ring-offset-4 ring-offset-background"
        )}
        style={{
          boxShadow: isActive 
            ? '0 0 60px hsl(var(--primary) / 0.4), 0 0 100px hsl(142 76% 36% / 0.2)' 
            : '0 25px 50px -12px hsl(var(--primary) / 0.25)'
        }}
        animate={isSpeaking ? {
          scale: [1, 1.05, 0.98, 1.03, 1],
          rotate: [0, -1, 1, -1, 0]
        } : isListening ? {
          scale: [1, 1.02, 1],
        } : isActive ? {
          scale: [1, 1.01, 1]
        } : {}}
        transition={{
          duration: isSpeaking ? 0.4 : isListening ? 1.5 : 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Gradient overlay animation */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-50"
          style={{
            background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Inner Circle with Face */}
        <motion.div
          className={cn(
            innerSizeClasses[size],
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "rounded-full bg-gradient-to-br from-background via-background to-muted/50",
            "flex flex-col items-center justify-center overflow-hidden",
            "shadow-inner"
          )}
        >
          {/* Face Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Eyebrows - Animated */}
            <div className="absolute top-[28%] flex items-center gap-6">
              <motion.div
                className="w-4 h-1 rounded-full bg-foreground/60"
                animate={isSpeaking ? { y: [0, -2, 0] } : {}}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
              <motion.div
                className="w-4 h-1 rounded-full bg-foreground/60"
                animate={isSpeaking ? { y: [0, -2, 0] } : {}}
                transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
              />
            </div>

            {/* Eyes - Enhanced */}
            <div className="absolute top-[38%] flex items-center gap-5">
              {/* Left Eye */}
              <motion.div
                className="relative"
                animate={isSpeaking ? { y: [0, -2, 0] } : isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: isSpeaking ? 0.3 : 1.5, repeat: Infinity }}
              >
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-foreground shadow-inner" />
                <motion.div
                  className="absolute top-0.5 left-0.5 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"
                  animate={{ opacity: [1, 0.7, 1], scale: [1, 0.9, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Eye sparkle */}
                <motion.div
                  className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-white/50"
                />
              </motion.div>

              {/* Right Eye */}
              <motion.div
                className="relative"
                animate={isSpeaking ? { y: [0, -2, 0] } : isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: isSpeaking ? 0.3 : 1.5, repeat: Infinity, delay: 0.1 }}
              >
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-foreground shadow-inner" />
                <motion.div
                  className="absolute top-0.5 left-0.5 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"
                  animate={{ opacity: [1, 0.7, 1], scale: [1, 0.9, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-white/50"
                />
              </motion.div>
            </div>

            {/* Blush Marks - Enhanced */}
            <div className="absolute top-[48%] flex items-center justify-between w-[75%]">
              <motion.div 
                className="w-4 h-2 md:w-5 md:h-2.5 rounded-full bg-rose-300/60"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="w-4 h-2 md:w-5 md:h-2.5 rounded-full bg-rose-300/60"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </div>

            {/* Mouth - Enhanced Animations */}
            <motion.div
              className="absolute top-[58%]"
              animate={isSpeaking ? {
                scaleY: [1, 1.4, 0.7, 1.3, 0.9, 1.2, 1],
                scaleX: [1, 0.85, 1.1, 0.9, 1.05, 0.95, 1]
              } : {}}
              transition={{ duration: 0.25, repeat: Infinity }}
            >
              {isSpeaking ? (
                <motion.div 
                  className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-foreground/80 flex items-center justify-center overflow-hidden"
                  animate={{
                    borderRadius: ['50%', '40%', '50%', '45%', '50%']
                  }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  <motion.div 
                    className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-rose-400/70"
                    animate={{
                      scale: [1, 0.8, 1.1, 0.9, 1]
                    }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                  />
                </motion.div>
              ) : isListening ? (
                <motion.div 
                  className="flex items-end gap-0.5"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-8 h-4 md:w-10 md:h-5 rounded-full border-2 border-foreground/80 border-t-0" />
                </motion.div>
              ) : (
                <motion.div
                  className="w-7 h-3 md:w-8 md:h-3.5 bg-foreground/80"
                  style={{ borderRadius: '0 0 100px 100px' }}
                  animate={{ scaleX: [1, 1.08, 1], scaleY: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Sparkles when speaking - Enhanced */}
            {isSpeaking && (
              <>
                {[
                  { top: '15%', left: '10%', color: 'text-yellow-400', delay: 0, icon: Star },
                  { top: '20%', right: '10%', color: 'text-primary', delay: 0.3, icon: Sparkles },
                  { bottom: '25%', left: '15%', color: 'text-emerald-400', delay: 0.6, icon: Heart },
                  { bottom: '20%', right: '15%', color: 'text-purple-400', delay: 0.9, icon: Music },
                ].map((sparkle, i) => (
                  <motion.div
                    key={i}
                    className={cn("absolute", sparkle.color)}
                    style={{
                      top: sparkle.top,
                      bottom: sparkle.bottom,
                      left: sparkle.left,
                      right: sparkle.right,
                    }}
                    animate={{ 
                      scale: [0, 1.2, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: sparkle.delay }}
                  >
                    <sparkle.icon className="h-3 w-3" />
                  </motion.div>
                ))}
              </>
            )}

            {/* Sound Waves when speaking - Right side */}
            {isSpeaking && (
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="h-0.5 bg-primary rounded-full"
                    style={{ width: `${8 + i * 3}px` }}
                    animate={{
                      scaleX: [1, 1.8, 1],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: Infinity,
                      delay: i * 0.08
                    }}
                  />
                ))}
              </div>
            )}

            {/* Listening indicator waves */}
            {isListening && (
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-0.5 bg-emerald-500 rounded-full"
                    style={{ width: `${6 + i * 2}px` }}
                    animate={{
                      scaleX: [0.5, 1.5, 0.5],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Headphones - Enhanced */}
        <div className="absolute inset-0">
          {/* Left Ear */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
            animate={isActive ? { x: [-3, 0, -3] } : {}}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <div className="w-5 h-10 md:w-6 md:h-12 bg-gradient-to-b from-primary via-primary to-primary/70 rounded-l-full shadow-lg">
              {/* Speaker grill */}
              <div className="absolute inset-1 flex flex-col justify-center gap-0.5 opacity-30">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-0.5 bg-white rounded-full" />
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Right Ear */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
            animate={isActive ? { x: [3, 0, 3] } : {}}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <div className="w-5 h-10 md:w-6 md:h-12 bg-gradient-to-b from-primary via-primary to-primary/70 rounded-r-full shadow-lg">
              <div className="absolute inset-1 flex flex-col justify-center gap-0.5 opacity-30">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-0.5 bg-white rounded-full" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Headband - Enhanced */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[85%] h-4 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-t-full shadow-md">
            {/* Headband shine */}
            <div className="absolute inset-x-0 top-0 h-1 bg-white/20 rounded-t-full" />
          </div>
        </div>

        {/* Active Status Indicator - Enhanced */}
        {isActive && (
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg"
            style={{
              background: isSpeaking 
                ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(280 76% 50%))' 
                : isListening 
                  ? 'linear-gradient(135deg, hsl(142 76% 36%), hsl(160 76% 40%))' 
                  : 'linear-gradient(135deg, hsl(142 76% 36%), hsl(var(--primary)))'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isSpeaking ? (
              <span className="flex items-center gap-1.5">
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  💬
                </motion.span>
                Speaking...
              </span>
            ) : isListening ? (
              <span className="flex items-center gap-1.5">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  👂
                </motion.span>
                Listening...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💚
                </motion.span>
                Ready
              </span>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Floating Elements when active - Enhanced */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[
            { emoji: '💜', delay: 0 },
            { emoji: '✨', delay: 0.4 },
            { emoji: '💚', delay: 0.8 },
            { emoji: '⭐', delay: 1.2 },
            { emoji: '🌟', delay: 1.6 },
            { emoji: '💫', delay: 2.0 },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="absolute text-xl"
              style={{
                left: `${10 + i * 15}%`,
                top: '-10%'
              }}
              animate={{
                y: [-30, -80, -120],
                x: [0, (i % 2 === 0 ? 15 : -15), (i % 2 === 0 ? -10 : 10)],
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.3],
                rotate: [0, i % 2 === 0 ? 30 : -30, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeOut"
              }}
            >
              {item.emoji}
            </motion.div>
          ))}
        </div>
      )}

      {/* Particle effect when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/60"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * 45 * Math.PI / 180) * 80],
                y: [0, Math.sin(i * 45 * Math.PI / 180) * 80],
                opacity: [1, 0],
                scale: [0.5, 1.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JuliMascot;
