import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Music, Sparkles, Star, X } from 'lucide-react';

const LohriFestivalBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Bonfire flames
  const FlameParticle = ({ delay, x }: { delay: number; x: number }) => (
    <motion.div
      className="absolute bottom-0"
      style={{ left: `${x}%` }}
      initial={{ y: 0, opacity: 0.8, scale: 0.5 }}
      animate={{
        y: [-10, -40, -60],
        opacity: [0.8, 0.6, 0],
        scale: [0.5, 0.8, 0.3],
        x: [0, Math.random() * 20 - 10, Math.random() * 30 - 15],
      }}
      transition={{
        duration: 1.5,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    >
      <div className="w-3 h-4 rounded-full bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent blur-[2px]" />
    </motion.div>
  );

  // Spark particles
  const Spark = ({ delay }: { delay: number }) => (
    <motion.div
      className="absolute"
      initial={{ 
        x: 50 + Math.random() * 30 + '%',
        y: '80%',
        opacity: 0 
      }}
      animate={{
        y: ['80%', '20%', '-20%'],
        x: [null, `${50 + Math.random() * 60 - 30}%`],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    >
      <Star className="w-2 h-2 text-yellow-300 fill-yellow-300" />
    </motion.div>
  );

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Floating Decorative Elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${i * 12 + 5}%`,
            top: '20%',
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {i % 3 === 0 ? (
            <Flame className="w-4 h-4 text-yellow-300" />
          ) : i % 3 === 1 ? (
            <Sparkles className="w-4 h-4 text-orange-200" />
          ) : (
            <Music className="w-3 h-3 text-yellow-200" />
          )}
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4">
          {/* Animated Bonfire */}
          <div className="relative w-16 h-12 hidden sm:block">
            {/* Fire base */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-6">
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-10 bg-gradient-to-t from-orange-600 via-orange-400 to-yellow-300 rounded-full blur-sm"
                animate={{
                  scale: [1, 1.1, 1, 1.05, 1],
                  opacity: [0.9, 1, 0.9, 1, 0.9],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
              />
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-8 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-200 rounded-full"
                animate={{
                  scale: [1, 1.15, 1, 1.1, 1],
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                }}
              />
              {/* Inner flame */}
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-6 bg-gradient-to-t from-yellow-400 to-white rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  height: ['24px', '28px', '24px'],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                }}
              />
            </div>
            {/* Flame particles */}
            {[...Array(6)].map((_, i) => (
              <FlameParticle key={i} delay={i * 0.2} x={30 + i * 8} />
            ))}
            {/* Sparks */}
            {[...Array(4)].map((_, i) => (
              <Spark key={i} delay={i * 0.5} />
            ))}
            {/* Wood logs */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-8 h-2 bg-gradient-to-r from-amber-800 to-amber-900 rounded-full transform -rotate-12" />
              <div className="w-8 h-2 bg-gradient-to-r from-amber-900 to-amber-800 rounded-full transform rotate-12 -ml-4" />
            </div>
          </div>

          {/* Festival Text */}
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center gap-2"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl">🔥</span>
              <div className="text-center">
                <motion.h3 
                  className="font-bold text-lg sm:text-xl"
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(255,200,0,0.5)',
                      '0 0 20px rgba(255,200,0,0.8)',
                      '0 0 10px rgba(255,200,0,0.5)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Happy Lohri! 🎉
                </motion.h3>
                <p className="text-xs sm:text-sm text-orange-100">
                  Celebrate the harvest festival with us
                </p>
              </div>
              <span className="text-2xl hidden sm:inline">🎊</span>
            </motion.div>
          </div>

          {/* Dancing Figures Animation */}
          <div className="hidden md:flex items-end gap-1 h-10">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-4 h-6 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, i % 2 === 0 ? 10 : -10, 0],
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Close Button */}
          <motion.button
            onClick={() => setIsVisible(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Bottom Fire Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60" />
    </motion.div>
  );
};

export default LohriFestivalBanner;
