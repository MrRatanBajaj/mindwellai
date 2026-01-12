import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Gift, Sparkles, Star, PartyPopper, ArrowRight, Check, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';

const LohriOfferPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup has been shown before
    const shown = localStorage.getItem('lohriPopupShown');
    if (!shown) {
      // Show popup after 2 seconds for first-time visitors
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem('lohriPopupShown', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  // Spark animation component
  const FloatingSpark = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -30],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
      }}
    >
      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
    </motion.div>
  );

  // Bonfire component
  const Bonfire = () => (
    <div className="relative w-24 h-20 mx-auto mb-4">
      {/* Glow effect */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-16 bg-orange-500/30 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      {/* Main fire */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-20 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-full blur-sm"
        animate={{
          scale: [1, 1.1, 1, 1.05, 1],
          height: ['80px', '88px', '80px'],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      
      {/* Inner flame */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-14 bg-gradient-to-t from-orange-400 via-yellow-300 to-white rounded-full"
        animate={{
          scale: [1, 1.15, 1],
          height: ['56px', '64px', '56px'],
        }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />
      
      {/* Core flame */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-t from-yellow-200 to-white rounded-full"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 0.3, repeat: Infinity }}
      />

      {/* Floating sparks */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: 48,
            y: 60,
            opacity: 0,
          }}
          animate={{
            x: 48 + (Math.random() * 40 - 20),
            y: [60, 20, -10],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            repeat: Infinity,
          }}
        >
          <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full" />
        </motion.div>
      ))}

      {/* Wood logs */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex">
        <div className="w-14 h-3 bg-gradient-to-r from-amber-800 to-amber-900 rounded-full transform -rotate-15 -mr-3" />
        <div className="w-14 h-3 bg-gradient-to-r from-amber-900 to-amber-800 rounded-full transform rotate-15 -ml-3" />
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Popup */}
          <motion.div
            className="relative w-full max-w-md bg-gradient-to-br from-orange-900 via-red-900 to-amber-900 rounded-3xl overflow-hidden shadow-2xl border border-orange-500/30"
            initial={{ scale: 0.5, opacity: 0, rotateY: -30 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: 30 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 3px 3px, rgba(255,200,0,0.5) 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }} />
            </div>

            {/* Floating Sparks */}
            <FloatingSpark delay={0} x="10%" y="20%" />
            <FloatingSpark delay={0.5} x="85%" y="30%" />
            <FloatingSpark delay={1} x="15%" y="60%" />
            <FloatingSpark delay={1.5} x="90%" y="70%" />
            <FloatingSpark delay={0.8} x="50%" y="10%" />

            {/* Content */}
            <div className="relative p-6 text-center text-white">
              {/* Close Button */}
              <motion.button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Festival Icons */}
              <div className="flex justify-center gap-4 mb-2">
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [-10, 10, -10] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🎉
                </motion.span>
                <motion.span
                  className="text-3xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  🔥
                </motion.span>
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [10, -10, 10] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🎊
                </motion.span>
              </div>

              {/* Bonfire Animation */}
              <Bonfire />

              {/* Title */}
              <motion.h2
                className="text-3xl font-bold mb-2"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255,200,0,0.5)',
                    '0 0 40px rgba(255,200,0,0.8)',
                    '0 0 20px rgba(255,200,0,0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Happy Lohri! 🌾
              </motion.h2>
              
              <p className="text-orange-200 mb-4">
                Celebrate the harvest festival with us
              </p>

              {/* Offer Box */}
              <motion.div
                className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-6"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255,200,0,0.2)',
                    '0 0 40px rgba(255,200,0,0.4)',
                    '0 0 20px rgba(255,200,0,0.2)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="w-6 h-6 text-yellow-400" />
                  <span className="text-xl font-bold text-yellow-300">FESTIVE OFFER</span>
                  <PartyPopper className="w-6 h-6 text-yellow-400" />
                </div>
                
                <div className="text-4xl font-extrabold text-white mb-2">
                  FREE Sessions
                </div>
                <p className="text-orange-200 text-sm mb-3">
                  For first 100 users this Lohri!
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 text-left text-sm">
                  {[
                    '30 min AI Counseling',
                    'Voice & Video Call',
                    'No Credit Card',
                    'HIPAA Compliant',
                  ].map((feature, i) => (
                    <motion.div
                      key={feature}
                      className="flex items-center gap-1 text-orange-100"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-xs">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <NavLink to="/ai-voice-therapy" onClick={handleClose}>
                  <Button
                    className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 text-white font-bold py-6 text-lg shadow-lg"
                    size="lg"
                  >
                    <Flame className="w-5 h-5 mr-2" />
                    Claim Free Session
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </NavLink>
                
                <Button
                  variant="ghost"
                  className="w-full text-orange-200 hover:text-white hover:bg-white/10"
                  onClick={handleClose}
                >
                  Maybe Later
                </Button>
              </div>

              {/* Countdown/Urgency */}
              <motion.div
                className="mt-4 flex items-center justify-center gap-2 text-sm text-orange-300"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Limited time festive offer • Ends soon!</span>
                <Sparkles className="w-4 h-4" />
              </motion.div>

              {/* Dancing figures at bottom */}
              <div className="flex justify-center gap-2 mt-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-center"
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  >
                    <div className="w-3 h-3 bg-orange-300 rounded-full" />
                    <div className="w-4 h-6 bg-gradient-to-b from-orange-400 to-red-500 rounded-full -mt-1" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LohriOfferPopup;
