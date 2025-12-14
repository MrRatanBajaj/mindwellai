import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoiceVisualizerProps {
  isActive: boolean;
  isSpeaking: boolean;
  type: 'user' | 'ai';
  inputLevel?: number;
  outputLevel?: number;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isActive,
  isSpeaking,
  type,
  inputLevel = 0,
  outputLevel = 0,
}) => {
  const [bars, setBars] = useState<number[]>(Array(12).fill(0.1));
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive) {
      setBars(Array(12).fill(0.1));
      return;
    }

    const animate = () => {
      setBars(prev => prev.map((_, i) => {
        if (isSpeaking) {
          // Active speaking - dynamic bars
          const baseLevel = type === 'ai' ? outputLevel : inputLevel;
          const randomFactor = Math.random() * 0.5 + 0.5;
          const wave = Math.sin(Date.now() / 100 + i * 0.5) * 0.3 + 0.7;
          return Math.min(1, Math.max(0.1, baseLevel * randomFactor * wave));
        } else {
          // Idle state - subtle animation
          const wave = Math.sin(Date.now() / 500 + i * 0.3) * 0.1 + 0.15;
          return wave;
        }
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isSpeaking, type, inputLevel, outputLevel]);

  const barColor = type === 'ai' 
    ? 'bg-primary' 
    : 'bg-gradient-to-t from-green-500 to-emerald-400';

  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className={cn(
            "w-1.5 rounded-full transition-all duration-75",
            barColor,
            !isActive && "opacity-30"
          )}
          style={{
            height: `${height * 100}%`,
          }}
          animate={{
            scaleY: isActive ? 1 : 0.5,
          }}
          transition={{
            duration: 0.1,
          }}
        />
      ))}
    </div>
  );
};

export default VoiceVisualizer;
