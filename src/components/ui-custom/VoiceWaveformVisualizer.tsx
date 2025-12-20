import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoiceWaveformVisualizerProps {
  isActive: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  gradient: string;
  mascotIcon: React.ElementType;
  doctorName: string;
}

const VoiceWaveformVisualizer: React.FC<VoiceWaveformVisualizerProps> = ({
  isActive,
  isSpeaking,
  isListening,
  gradient,
  mascotIcon: MascotIcon,
  doctorName,
}) => {
  const [waveformData, setWaveformData] = useState<number[]>(Array(32).fill(0.1));
  const [pulseRings, setPulseRings] = useState<number[]>([]);
  const animationRef = useRef<number>();
  const ringIdRef = useRef(0);

  // Generate dynamic waveform data
  useEffect(() => {
    if (!isActive) {
      setWaveformData(Array(32).fill(0.1));
      return;
    }

    const animate = () => {
      setWaveformData(prev => 
        prev.map((_, i) => {
          if (isSpeaking) {
            // More dynamic, higher amplitude when AI is speaking
            const baseHeight = 0.3 + Math.sin(Date.now() * 0.008 + i * 0.5) * 0.3;
            const randomness = Math.random() * 0.4;
            return Math.min(1, baseHeight + randomness);
          } else if (isListening) {
            // Subtle breathing animation when listening
            const baseHeight = 0.15 + Math.sin(Date.now() * 0.003 + i * 0.3) * 0.1;
            const randomness = Math.random() * 0.15;
            return baseHeight + randomness;
          }
          return 0.1;
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isSpeaking, isListening]);

  // Add pulse rings when speaking
  useEffect(() => {
    if (!isSpeaking) return;

    const interval = setInterval(() => {
      ringIdRef.current += 1;
      setPulseRings(prev => [...prev.slice(-3), ringIdRef.current]);
    }, 600);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Remove old rings
  useEffect(() => {
    if (pulseRings.length > 4) {
      const timer = setTimeout(() => {
        setPulseRings(prev => prev.slice(1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [pulseRings]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Outer Glow Ring */}
      <div className="relative">
        {/* Pulse Rings */}
        <AnimatePresence>
          {pulseRings.map((id) => (
            <motion.div
              key={id}
              className={cn(
                "absolute inset-0 rounded-full border-2",
                isSpeaking ? "border-primary/50" : "border-primary/20"
              )}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
              }}
            />
          ))}
        </AnimatePresence>

        {/* Main Mascot Container */}
        <motion.div
          className="relative z-10"
          animate={isSpeaking ? {
            scale: [1, 1.05, 1],
          } : {}}
          transition={{
            duration: 0.6,
            repeat: isSpeaking ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Background Glow */}
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full blur-2xl bg-gradient-to-br",
              gradient
            )}
            animate={{
              opacity: isSpeaking ? [0.4, 0.7, 0.4] : isListening ? [0.2, 0.35, 0.2] : 0.1,
              scale: isSpeaking ? [1.2, 1.4, 1.2] : 1.1,
            }}
            transition={{
              duration: isSpeaking ? 0.8 : 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Mascot Circle */}
          <motion.div
            className={cn(
              "relative w-40 h-40 rounded-full flex items-center justify-center bg-gradient-to-br shadow-2xl overflow-hidden",
              gradient
            )}
            animate={isSpeaking ? {
              boxShadow: [
                "0 0 30px rgba(139, 92, 246, 0.3)",
                "0 0 60px rgba(139, 92, 246, 0.5)",
                "0 0 30px rgba(139, 92, 246, 0.3)"
              ]
            } : {}}
            transition={{
              duration: 0.8,
              repeat: Infinity,
            }}
          >
            {/* Inner Ring Animation */}
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-white/30"
              animate={isActive ? {
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.6, 0.3],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Mascot Icon with Animation */}
            <motion.div
              animate={isSpeaking ? {
                y: [0, -3, 0],
                rotate: [-2, 2, -2],
              } : isListening ? {
                scale: [1, 1.03, 1],
              } : {}}
              transition={{
                duration: isSpeaking ? 0.3 : 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <MascotIcon className="h-16 w-16 text-white drop-shadow-lg" />
            </motion.div>

            {/* Speaking Indicator */}
            <AnimatePresence>
              {isSpeaking && (
                <motion.div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-white"
                        animate={{
                          y: [0, -4, 0],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Waveform Visualization */}
      <div className="mt-8 flex items-center justify-center gap-[3px] h-20 px-4">
        {waveformData.map((value, i) => {
          const isCenter = i > 10 && i < 22;
          const distanceFromCenter = Math.abs(i - 16);
          const heightMultiplier = isCenter ? 1 : 0.6 - (distanceFromCenter * 0.03);
          
          return (
            <motion.div
              key={i}
              className={cn(
                "rounded-full bg-gradient-to-t",
                gradient,
                isSpeaking && "shadow-lg"
              )}
              style={{
                width: isCenter ? 4 : 3,
              }}
              animate={{
                height: Math.max(4, value * 80 * heightMultiplier),
                opacity: 0.4 + value * 0.6,
              }}
              transition={{
                duration: 0.1,
                ease: "easeOut"
              }}
            />
          );
        })}
      </div>

      {/* Status Text */}
      <motion.div
        className="mt-4 text-center"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className={cn(
          "text-sm font-medium",
          isSpeaking ? "text-primary" : "text-muted-foreground"
        )}>
          {isSpeaking ? `${doctorName} is speaking...` : isListening ? "Listening to you..." : "Connecting..."}
        </p>
      </motion.div>

      {/* Circular Waveform Around Mascot */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-56 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {waveformData.slice(0, 24).map((value, i) => {
            const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
            const innerRadius = 70;
            const outerRadius = innerRadius + value * 25;
            const x1 = 100 + Math.cos(angle) * innerRadius;
            const y1 = 100 + Math.sin(angle) * innerRadius;
            const x2 = 100 + Math.cos(angle) * outerRadius;
            const y2 = 100 + Math.sin(angle) * outerRadius;

            return (
              <motion.line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#waveGradient)"
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: isActive ? 0.3 + value * 0.5 : 0.1,
                }}
                transition={{ duration: 0.1 }}
              />
            );
          })}
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(139, 92, 246)" />
              <stop offset="100%" stopColor="rgb(236, 72, 153)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default VoiceWaveformVisualizer;
