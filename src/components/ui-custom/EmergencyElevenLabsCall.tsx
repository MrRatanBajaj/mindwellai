import { useConversation } from "@11labs/react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, ArrowLeft, Heart, Shield, Clock } from "lucide-react";
import { toast } from "sonner";
import VoiceVisualizer from "./VoiceVisualizer";

interface EmergencyElevenLabsCallProps {
  urgencyLevel: string;
  onEndSession: () => void;
}

const DR_ARIA_AGENT_ID = "agent_3701kcf6zw0hehhsgg51jn1z9z7p";

const EmergencyElevenLabsCall = ({ urgencyLevel, onEndSession }: EmergencyElevenLabsCallProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to Dr. Aria");
      toast.success("Connected to Dr. Aria - Trauma & Anxiety Specialist");
    },
    onDisconnect: () => {
      console.log("Disconnected from Dr. Aria");
      toast.info("Session ended");
    },
    onMessage: (message) => {
      console.log("Message from Dr. Aria:", message);
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Connection error. Please try again.");
    },
  });

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (conversation.status === "connected") {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [conversation.status]);

  // Simulate audio levels for visualization
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (conversation.status === "connected") {
      interval = setInterval(() => {
        const baseLevel = conversation.isSpeaking ? 0.6 : 0.2;
        setAudioLevel(baseLevel + Math.random() * 0.3);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [conversation.status, conversation.isSpeaking]);

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      await conversation.startSession({
        agentId: DR_ARIA_AGENT_ID,
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast.error("Failed to connect. Please check microphone permissions.");
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
    onEndSession();
  }, [conversation, onEndSession]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? "Microphone unmuted" : "Microphone muted");
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast.info(isSpeakerOn ? "Speaker off" : "Speaker on");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyColor = () => {
    switch (urgencyLevel) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900/90 border-purple-500/30 text-white">
        <CardHeader className="border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEndSession}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${conversation.status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-sm text-slate-400">
                {conversation.status === 'connected' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className={`text-sm font-medium ${getUrgencyColor()}`}>
              {urgencyLevel.toUpperCase()} Priority
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Dr. Aria Avatar */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto ${conversation.isSpeaking ? 'ring-4 ring-purple-400 ring-opacity-50 animate-pulse' : ''}`}>
                <Heart className="w-16 h-16 text-white" />
              </div>
              {conversation.status === 'connected' && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    {conversation.isSpeaking ? 'Speaking...' : 'Listening...'}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white">Dr. Aria</h2>
              <p className="text-purple-300">Trauma & Anxiety Specialist</p>
              <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-slate-400">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Crisis Trained</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(sessionDuration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Visualizer */}
          {conversation.status === 'connected' && (
            <div className="flex justify-center">
              <VoiceVisualizer 
                isActive={true}
                isSpeaking={conversation.isSpeaking}
                type="ai"
                outputLevel={audioLevel}
              />
            </div>
          )}

          {/* Status Message */}
          <div className="text-center">
            {conversation.status === 'disconnected' && !isConnecting && (
              <p className="text-slate-400">
                Click "Start Session" to connect with Dr. Aria for immediate crisis support.
              </p>
            )}
            {isConnecting && (
              <div className="flex items-center justify-center space-x-2 text-purple-300">
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span>Connecting to Dr. Aria...</span>
              </div>
            )}
            {conversation.status === 'connected' && (
              <p className="text-green-400">
                Dr. Aria is here to help. Speak naturally about what you're experiencing.
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            {conversation.status === 'disconnected' ? (
              <Button
                onClick={startConversation}
                disabled={isConnecting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg"
              >
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5 mr-2" />
                    Start Session
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={toggleMute}
                  variant="outline"
                  className={`rounded-full w-14 h-14 ${isMuted ? 'bg-red-500/20 border-red-500 text-red-500' : 'border-slate-600 text-white hover:bg-slate-800'}`}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                
                <Button
                  onClick={endConversation}
                  className="bg-red-500 hover:bg-red-600 rounded-full w-16 h-16"
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>
                
                <Button
                  onClick={toggleSpeaker}
                  variant="outline"
                  className={`rounded-full w-14 h-14 ${!isSpeakerOn ? 'bg-red-500/20 border-red-500 text-red-500' : 'border-slate-600 text-white hover:bg-slate-800'}`}
                >
                  {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                </Button>
              </>
            )}
          </div>

          {/* Safety Notice */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
            <p className="text-red-300 text-sm">
              <strong>Crisis Resources:</strong> If you're in immediate danger, call 911 or 988 (Suicide & Crisis Lifeline)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyElevenLabsCall;
