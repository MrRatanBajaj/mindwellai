import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const RepublicDayCelebration = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if current date is between 26th Jan and 27th Jan 12PM IST
    const checkVisibility = () => {
      const now = new Date();
      // Convert to IST (UTC+5:30)
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
      
      const year = istNow.getFullYear();
      
      // Start: 26th Jan 00:00 IST
      const startDate = new Date(year, 0, 26, 0, 0, 0);
      // End: 27th Jan 12:00 IST
      const endDate = new Date(year, 0, 27, 12, 0, 0);
      
      const currentIST = istNow.getTime();
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();
      
      setIsVisible(currentIST >= startTime && currentIST <= endTime);
    };

    checkVisibility();
    // Check every minute
    const interval = setInterval(checkVisibility, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Top Flag Banner */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 h-2 flex"
          >
            <div className="flex-1 bg-[#FF9933]" /> {/* Saffron */}
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#138808]" /> {/* Green */}
          </motion.div>

          {/* Bottom Flag Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-0 left-0 right-0 z-50 h-2 flex"
          >
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#138808]" />
          </motion.div>

          {/* Floating Flags - Left */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="fixed left-4 top-20 z-40 hidden md:block"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                y: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              {/* Flag */}
              <div className="w-16 h-12 shadow-lg rounded-sm overflow-hidden border border-slate-200">
                <div className="h-1/3 bg-[#FF9933]" />
                <div className="h-1/3 bg-white flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border-2 border-[#000080]">
                    <div className="w-full h-full relative">
                      {[...Array(24)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-0.5 h-1.5 bg-[#000080] left-1/2 top-1/2 origin-bottom"
                          style={{ 
                            transform: `translateX(-50%) translateY(-100%) rotate(${i * 15}deg)` 
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-1/3 bg-[#138808]" />
              </div>
              {/* Pole */}
              <div className="absolute -left-1 -top-2 w-1.5 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full" />
            </motion.div>
          </motion.div>

          {/* Floating Flags - Right */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="fixed right-4 top-20 z-40 hidden md:block"
          >
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, 0],
                y: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-16 h-12 shadow-lg rounded-sm overflow-hidden border border-slate-200">
                <div className="h-1/3 bg-[#FF9933]" />
                <div className="h-1/3 bg-white flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border-2 border-[#000080]">
                    <motion.div 
                      className="w-full h-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      {[...Array(24)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-0.5 h-1.5 bg-[#000080] left-1/2 top-1/2 origin-bottom"
                          style={{ 
                            transform: `translateX(-50%) translateY(-100%) rotate(${i * 15}deg)` 
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
                <div className="h-1/3 bg-[#138808]" />
              </div>
              <div className="absolute -right-1 -top-2 w-1.5 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full" />
            </motion.div>
          </motion.div>

          {/* Republic Day Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] p-0.5 rounded-full shadow-lg"
            >
              <div className="bg-slate-900 px-4 py-2 rounded-full">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇮🇳</span>
                  <span className="text-white font-semibold text-sm">
                    Happy Republic Day!
                  </span>
                  <span className="text-lg">🇮🇳</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Confetti Effect */}
          <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -20, 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  opacity: 1,
                  rotate: 0
                }}
                animate={{ 
                  y: typeof window !== 'undefined' ? window.innerHeight + 20 : 1000,
                  opacity: [1, 1, 0],
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1)
                }}
                transition={{ 
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear"
                }}
                className={`absolute w-3 h-3 ${
                  i % 3 === 0 ? 'bg-[#FF9933]' : 
                  i % 3 === 1 ? 'bg-white border border-slate-200' : 
                  'bg-[#138808]'
                } ${i % 2 === 0 ? 'rounded-full' : 'rounded-sm'}`}
              />
            ))}
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RepublicDayCelebration;
