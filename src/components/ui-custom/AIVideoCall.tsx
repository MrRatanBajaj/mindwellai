import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, 
  MessageCircle, Settings, Maximize, Minimize, 
  Brain, Heart, Zap, Users, Camera, Volume2, VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AIVideoCallProps {
  counselorName?: string;
  specialty?: string;
  onEndCall: () => void;
  className?: string;
}

const AIVideoCall = ({
  counselorName = "Dr. Emma AI",
  specialty = "Anxiety & Depression Specialist",
  onEndCall,
  className
}: AIVideoCallProps) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [aiMood, setAiMood] = useState("empathetic");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Timer for call duration
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Simulate AI mood changes
    const moodTimer = setInterval(() => {
      const moods = ["empathetic", "encouraging", "focused", "calm"];
      setAiMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 8000);

    // Simulate AI speaking patterns
    const speakingTimer = setInterval(() => {
      setIsAISpeaking(true);
      setTimeout(() => setIsAISpeaking(false), 3000 + Math.random() * 4000);
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(moodTimer);
      clearInterval(speakingTimer);
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    toast.success("Session ended. Your progress has been saved.");
    onEndCall();
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "empathetic": return "🤗";
      case "encouraging": return "💪";
      case "focused": return "🎯";
      case "calm": return "😌";
      default: return "😊";
    }
  };

  const getAvatarGradient = (mood: string) => {
    switch (mood) {
      case "empathetic": return "from-purple-400 to-purple-600";
      case "encouraging": return "from-green-400 to-green-600";
      case "focused": return "from-orange-400 to-orange-600";
      case "calm": return "from-blue-400 to-blue-600";
      default: return "from-mindwell-400 to-mindwell-600";
    }
  };

  const simulateAIResponse = () => {
    const responses = [
      "I understand how you're feeling. Let's work through this together.",
      "That's a very valid concern. Many people experience similar challenges.",
      "You're showing great insight by recognizing these patterns.",
      "Let's try a breathing exercise to help you feel more centered.",
      "What you're describing sounds like a normal response to stress."
    ];
    setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
    setIsAISpeaking(true);
    setTimeout(() => {
      setIsAISpeaking(false);
      setAiResponse("");
    }, 4000);
  };

  return (
    <div className={cn(
      "fixed inset-0 bg-black z-50 flex flex-col",
      !isFullscreen && "relative inset-auto bg-transparent",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">Connected</span>
          </div>
          <div className="text-white/60 text-sm">
            {formatDuration(callDuration)}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-white hover:bg-white/20"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="text-white hover:bg-white/20"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex-1 flex">
        {/* AI Counselor Video */}
        <div className="flex-1 relative bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* AI Avatar */}
            <motion.div 
              className="relative"
              animate={isAISpeaking ? { scale: [1, 1.02, 1] } : { scale: 1 }}
              transition={{ duration: 0.8, repeat: isAISpeaking ? Infinity : 0 }}
            >
              <div className={cn(
                "w-48 h-48 rounded-full bg-gradient-to-br flex items-center justify-center text-8xl shadow-2xl transition-all duration-1000",
                getAvatarGradient(aiMood),
                isAISpeaking && "ring-4 ring-white/30"
              )}>
                <motion.span
                  key={aiMood}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  {getMoodEmoji(aiMood)}
                </motion.span>
              </div>

              {/* Speaking indicator */}
              <AnimatePresence>
                {isAISpeaking && (
                  <motion.div
                    className="absolute -top-4 -right-4"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Brain className="w-6 h-6 text-mindwell-500" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* AI Info Overlay */}
          <div className="absolute top-4 left-4">
            <Card className="glass-panel-dark border-white/10">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mindwell-400 to-mindwell-600 flex items-center justify-center text-sm">
                    🤖
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{counselorName}</p>
                    <p className="text-white/70 text-xs">{specialty}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Response Overlay */}
          <AnimatePresence>
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute bottom-4 left-4 right-4"
              >
                <Card className="glass-panel-dark border-white/10">
                  <CardContent className="p-4">
                    <p className="text-white text-sm">{aiResponse}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Video (PIP) */}
        <div className="absolute bottom-20 right-4 w-40 h-32 bg-slate-800 rounded-lg overflow-hidden border-2 border-white/20">
          <div className="w-full h-full flex items-center justify-center text-white/60">
            {isVideoOn ? (
              <div className="text-4xl">👤</div>
            ) : (
              <VideoOff className="w-8 h-8" />
            )}
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs bg-black/50 text-white">
              You
            </Badge>
          </div>
        </div>

        {/* Chat Panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 bg-white border-l border-slate-200 flex flex-col"
            >
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold">Session Notes</h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                  <div className="text-sm text-slate-600">
                    <strong>Session started:</strong> {new Date().toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-slate-600">
                    <strong>Duration:</strong> {formatDuration(callDuration)}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-200">
                <Textarea
                  placeholder="Add session notes..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="mb-3"
                />
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={simulateAIResponse}
                >
                  Send Message
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/90 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isAudioOn ? "secondary" : "destructive"}
            size="lg"
            onClick={() => setIsAudioOn(!isAudioOn)}
            className="rounded-full w-14 h-14"
          >
            {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>
          
          <Button
            variant={isVideoOn ? "secondary" : "destructive"}
            size="lg"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className="rounded-full w-14 h-14"
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>
          
          <Button
            variant={isSpeakerOn ? "secondary" : "destructive"}
            size="lg"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className="rounded-full w-14 h-14"
          >
            {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
            className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIVideoCall;