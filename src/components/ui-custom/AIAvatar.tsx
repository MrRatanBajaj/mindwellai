import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, MessageCircle, Brain, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AIAvatarProps {
  name?: string;
  specialty?: string;
  mood?: "calm" | "empathetic" | "encouraging" | "focused";
  isActive?: boolean;
  isSpeaking?: boolean;
  className?: string;
  onStartSession?: (type: 'video' | 'chat') => void;
}

const AIAvatar = ({
  name = "Dr. Emma AI",
  specialty = "Anxiety & Depression Specialist",
  mood = "empathetic",
  isActive = false,
  isSpeaking = false,
  className,
  onStartSession
}: AIAvatarProps) => {
  const [currentMood, setCurrentMood] = useState(mood);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsConnected(true);
      // Simulate mood changes during conversation
      const moodInterval = setInterval(() => {
        const moods: typeof mood[] = ["calm", "empathetic", "encouraging", "focused"];
        const newMood = moods[Math.floor(Math.random() * moods.length)];
        setCurrentMood(newMood);
      }, 8000);

      return () => clearInterval(moodInterval);
    } else {
      setIsConnected(false);
    }
  }, [isActive]);

  const getMoodConfig = (mood: typeof currentMood) => {
    switch (mood) {
      case "calm":
        return {
          gradient: "from-blue-400 to-blue-600",
          glow: "shadow-blue-500/30",
          emoji: "😌",
          expression: "Calm & Centered"
        };
      case "empathetic":
        return {
          gradient: "from-purple-400 to-purple-600",
          glow: "shadow-purple-500/30",
          emoji: "🤗",
          expression: "Understanding & Caring"
        };
      case "encouraging":
        return {
          gradient: "from-green-400 to-green-600",
          glow: "shadow-green-500/30",
          emoji: "💪",
          expression: "Supportive & Motivating"
        };
      case "focused":
        return {
          gradient: "from-orange-400 to-orange-600",
          glow: "shadow-orange-500/30",
          emoji: "🎯",
          expression: "Attentive & Focused"
        };
      default:
        return {
          gradient: "from-mindwell-400 to-mindwell-600",
          glow: "shadow-mindwell-500/30",
          emoji: "😊",
          expression: "Ready to Help"
        };
    }
  };

  const moodConfig = getMoodConfig(currentMood);

  return (
    <Card className={cn("glass-panel border-white/20", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <motion.div 
            className="relative mb-4"
            animate={isSpeaking ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 0.8, repeat: isSpeaking ? Infinity : 0 }}
          >
            <div className={cn(
              "w-24 h-24 rounded-full bg-gradient-to-br flex items-center justify-center text-3xl transition-all duration-1000 shadow-lg",
              moodConfig.gradient,
              moodConfig.glow,
              isActive && "ring-4 ring-white/50"
            )}>
              <motion.span
                key={currentMood}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {moodConfig.emoji}
              </motion.span>
            </div>
            
            {/* Status indicator */}
            <div className="absolute -bottom-1 -right-1">
              <motion.div 
                className={cn(
                  "w-6 h-6 rounded-full border-2 border-white flex items-center justify-center",
                  isConnected ? "bg-green-500" : "bg-gray-400"
                )}
                animate={isConnected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isConnected ? (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                ) : (
                  <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                )}
              </motion.div>
            </div>

            {/* Speaking indicator */}
            <AnimatePresence>
              {isSpeaking && (
                <motion.div
                  className="absolute -top-2 -right-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <Sparkles className="w-4 h-4 text-mindwell-500" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Name and title */}
          <h3 className="text-xl font-semibold text-slate-800 mb-1">{name}</h3>
          <p className="text-sm text-slate-600 mb-2">{specialty}</p>
          
          {/* Mood indicator */}
          <motion.div
            key={currentMood}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs bg-gradient-to-r text-white border-0",
                moodConfig.gradient
              )}
            >
              {moodConfig.expression}
            </Badge>
          </motion.div>

          {/* Action buttons */}
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-mindwell-200 hover:bg-mindwell-50"
              onClick={() => onStartSession?.('video')}
            >
              <Video className="w-4 h-4 mr-1" />
              Video
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-mindwell-200 hover:bg-mindwell-50"
              onClick={() => onStartSession?.('chat')}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Chat
            </Button>
          </div>

          {/* Connection status */}
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-green-500" : "bg-gray-400"
            )}></div>
            {isConnected ? "Available Now" : "Offline"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAvatar;