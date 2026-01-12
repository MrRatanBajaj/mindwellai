import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Music, Sparkles, Star, X, Wind } from 'lucide-react';

const LohriFestivalBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Kite component with string
  const Kite = ({ color, delay, startX, size = 1 }: { color: string; delay: number; startX: number; size?: number }) => (
    <motion.div
      className="absolute"
      style={{ left: `${startX}%`, top: '0%' }}
      initial={{ y: 100, x: 0, opacity: 0 }}
      animate={{
        y: [100, -20, 30, -10, 20],
        x: [0, 30, -20, 40, -10, 20],
        opacity: [0, 1, 1, 1, 1],
        rotate: [-5, 10, -8, 15, -3, 5],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Kite body - diamond shape */}
      <div 
        className="relative"
        style={{ transform: `scale(${size})` }}
      >
        <div 
          className={`w-8 h-10 ${color} rotate-45 rounded-sm shadow-lg`}
          style={{
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }}
        >
          {/* Kite design pattern */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-full bg-white/40 rotate-45" />
            <div className="absolute w-full h-0.5 bg-white/40" />
          </div>
        </div>
        
        {/* Kite tail */}
        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center"
          animate={{ x: [-3, 3, -3] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full my-0.5 ${i % 2 === 0 ? 'bg-yellow-400' : 'bg-red-400'}`}
              animate={{ x: [i % 2 === 0 ? -2 : 2, i % 2 === 0 ? 2 : -2] }}
              transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
          {/* String */}
          <svg className="absolute top-0 left-1/2 -translate-x-1/2" width="2" height="40">
            <motion.path
              d="M1,0 Q5,20 1,40"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
              fill="none"
              animate={{ d: ["M1,0 Q5,20 1,40", "M1,0 Q-3,20 1,40", "M1,0 Q5,20 1,40"] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );

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

  // Peanuts/Popcorn floating
  const FlyingItem = ({ emoji, delay, x }: { emoji: string; delay: number; x: number }) => (
    <motion.div
      className="absolute text-sm"
      style={{ left: `${x}%`, bottom: '0%' }}
      animate={{
        y: [0, -30, -50],
        x: [0, Math.random() * 20 - 10],
        opacity: [0, 1, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
      }}
    >
      {emoji}
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
      {/* Sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-600/20 via-transparent to-transparent" />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Flying Kites */}
      <Kite color="bg-gradient-to-br from-cyan-400 to-blue-500" delay={0} startX={5} size={0.8} />
      <Kite color="bg-gradient-to-br from-pink-400 to-rose-500" delay={1} startX={25} size={1} />
      <Kite color="bg-gradient-to-br from-yellow-400 to-orange-500" delay={2} startX={70} size={0.9} />
      <Kite color="bg-gradient-to-br from-green-400 to-emerald-500" delay={1.5} startX={85} size={0.7} />
      <Kite color="bg-gradient-to-br from-purple-400 to-violet-500" delay={0.5} startX={45} size={0.6} />

      {/* Wind effect lines */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-white/20"
            style={{
              width: `${30 + Math.random() * 40}px`,
              left: `${i * 20}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              x: [-100, 500],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating Decorative Elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${i * 12 + 5}%`,
            top: '70%',
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
          {i % 4 === 0 ? (
            <Flame className="w-4 h-4 text-yellow-300" />
          ) : i % 4 === 1 ? (
            <Sparkles className="w-4 h-4 text-orange-200" />
          ) : i % 4 === 2 ? (
            <Wind className="w-3 h-3 text-sky-200" />
          ) : (
            <Music className="w-3 h-3 text-yellow-200" />
          )}
        </motion.div>
      ))}

      {/* Flying peanuts/popcorn/rewri */}
      <FlyingItem emoji="🥜" delay={0} x={15} />
      <FlyingItem emoji="🍿" delay={0.5} x={35} />
      <FlyingItem emoji="🌰" delay={1} x={55} />
      <FlyingItem emoji="🍭" delay={1.5} x={75} />
      <FlyingItem emoji="✨" delay={2} x={90} />

      <div className="relative max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          {/* Animated Bonfire */}
          <div className="relative w-16 h-14 hidden sm:block">
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
                  Happy Lohri! 🪁 🎉
                </motion.h3>
                <p className="text-xs sm:text-sm text-orange-100">
                  Celebrate the harvest festival • Free Sessions Today!
                </p>
              </div>
              <span className="text-2xl hidden sm:inline">🎊</span>
            </motion.div>
          </div>

          {/* Dancing Figures Around Fire */}
          <div className="hidden md:flex items-end gap-2 h-12">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, i % 2 === 0 ? 15 : -15, 0],
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-3 h-3 bg-orange-200 rounded-full" />
                <div className={`w-4 h-5 ${i % 2 === 0 ? 'bg-orange-400' : 'bg-red-400'} rounded-full -mt-1`} />
                {/* Arms raised */}
                <div className="absolute -top-1 flex gap-3">
                  <motion.div 
                    className="w-0.5 h-2 bg-orange-200 rounded-full origin-bottom"
                    animate={{ rotate: [-30, 30, -30] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                  />
                  <motion.div 
                    className="w-0.5 h-2 bg-orange-200 rounded-full origin-bottom"
                    animate={{ rotate: [30, -30, 30] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                  />
                </div>
              </motion.div>
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
