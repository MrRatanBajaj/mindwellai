import { motion } from "framer-motion";

const MindAnimation = () => {
  // Psychology-inspired calming colors
  const colors = {
    primary: "#8B5CF6", // Violet - wisdom, creativity
    secondary: "#06B6D4", // Cyan - calm, clarity
    accent: "#F59E0B", // Amber - warmth, optimism
    soft: "#A78BFA", // Light violet
    healing: "#34D399", // Emerald - growth, healing
  };

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80">
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-4"
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="ringGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
              <stop offset="50%" stopColor={colors.secondary} stopOpacity="0.6" />
              <stop offset="100%" stopColor={colors.primary} stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#ringGradient1)"
            strokeWidth="2"
            strokeDasharray="20 10 5 10"
            opacity="0.6"
          />
        </svg>
      </motion.div>

      {/* Middle counter-rotating ring */}
      <motion.div
        className="absolute inset-10"
        animate={{ rotate: -360 }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="ringGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.accent} stopOpacity="0.7" />
              <stop offset="100%" stopColor={colors.healing} stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#ringGradient2)"
            strokeWidth="3"
            strokeDasharray="30 15"
            opacity="0.5"
          />
        </svg>
      </motion.div>

      {/* Inner pulsing ring */}
      <motion.div
        className="absolute inset-16"
        animate={{
          scale: [1, 1.05, 1],
          rotate: 360,
        }}
        transition={{
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={colors.soft}
            strokeWidth="1.5"
            strokeDasharray="10 5"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      {/* Floating thought bubbles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 8 + i * 3,
            height: 8 + i * 3,
            background: `linear-gradient(135deg, ${colors.primary}60, ${colors.secondary}40)`,
            top: `${20 + (i * 12)}%`,
            left: `${10 + (i * 15)}%`,
          }}
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Center brain/mind icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          {/* Glowing core */}
          <motion.div
            className="absolute -inset-4 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.primary}30 0%, transparent 70%)`,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Brain SVG */}
          <motion.svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.primary}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              filter: [
                "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))",
                "drop-shadow(0 0 16px rgba(139, 92, 246, 0.8))",
                "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5" />
            <path d="m15.7 10.4-.9.4" />
            <path d="m9.2 13.2-.9.4" />
            <path d="m14.6 13.1-2.1-.4-.5 2.5" />
            <path d="m9.5 10.4.9.4" />
            <path d="m14.8 13.2.9.4" />
            <path d="m9.4 13.1 2.1-.4.5 2.5" />
          </motion.svg>
        </div>
      </motion.div>

      {/* Orbiting particles */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`orbit-${i}`}
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: 8 + i * 3,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
        >
          <motion.div
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: [colors.healing, colors.accent, colors.secondary][i],
              top: "5%",
              left: "50%",
              transform: "translateX(-50%)",
              boxShadow: `0 0 10px ${[colors.healing, colors.accent, colors.secondary][i]}80`,
            }}
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        </motion.div>
      ))}

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-violet-400/30"
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border border-cyan-400/20"
        animate={{
          scale: [0.9, 1.3, 0.9],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1,
        }}
      />
    </div>
  );
};

export default MindAnimation;
