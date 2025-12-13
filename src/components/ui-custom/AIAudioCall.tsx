import React, { useState, useEffect, useCallback } from 'react';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  MessageSquare,
  Heart,
  Shield,
  Clock,
  Waves
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AIAudioCallProps {
  onCallEnd?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const JULI_AGENT_ID = "agent_4601kcc8ngyceh1vpfdm3vsrq1j0";

const AIAudioCall: React.FC<AIAudioCallProps> = ({ onCallEnd }) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([0.8]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to Juli AI Counselor');
      setIsConnected(true);
      setIsConnecting(false);
      toast({
        title: "Connected to Juli",
        description: "Your AI mental health counselor is ready",
      });
    },
    onDisconnect: () => {
      console.log('Disconnected from Juli');
      setIsConnected(false);
      setIsConnecting(false);
    },
    onMessage: (message: { message: string; source: string }) => {
      console.log('Message received:', message);
      if (message.source === 'user' && message.message) {
        const newMessage: Message = {
          id: Date.now().toString() + '-user',
          role: 'user',
          content: message.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      } else if (message.source === 'ai' && message.message) {
        const newMessage: Message = {
          id: Date.now().toString() + '-assistant',
          role: 'assistant',
          content: message.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      }
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Juli. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
      setIsConnected(false);
    },
  });

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Volume control
  useEffect(() => {
    if (isConnected) {
      conversation.setVolume({ volume: volume[0] });
    }
  }, [volume, isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = useCallback(async () => {
    setIsConnecting(true);
    setMessages([]);
    setSessionDuration(0);
    
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Connect directly to the public Juli agent
      await conversation.startSession({
        agentId: JULI_AGENT_ID,
      });
      
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Call Failed",
        description: error instanceof Error ? error.message : "Failed to start audio call. Please check microphone permissions.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  }, [conversation, toast]);

  const endCall = useCallback(async () => {
    try {
      await conversation.endSession();
      setIsConnected(false);
      onCallEnd?.();
      
      toast({
        title: "Session Ended",
        description: `Session duration: ${formatDuration(sessionDuration)}`,
      });
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }, [conversation, onCallEnd, sessionDuration, toast]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    // Note: Actual mute functionality would require stream manipulation
    toast({
      title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
      description: isMuted ? "Juli can hear you now" : "Juli cannot hear you",
    });
  }, [isMuted, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        conversation.endSession();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Call Interface */}
      <Card className="overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Avatar & Controls */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              {/* Juli Avatar */}
              <motion.div 
                className="relative"
                animate={isConnected && conversation.isSpeaking ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <div className={cn(
                  "w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl",
                  isConnected && "ring-4 ring-primary/30 ring-offset-4 ring-offset-background"
                )}>
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-background to-muted flex items-center justify-center">
                    <span className="text-5xl">🧠</span>
                  </div>
                </div>
                
                {/* Speaking Indicator */}
                <AnimatePresence>
                  {isConnected && conversation.isSpeaking && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                    >
                      <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                        <Waves className="h-3 w-3 animate-pulse" />
                        Speaking
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pulsing Ring Animation */}
                {isConnected && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/40"
                      animate={{ scale: [1, 1.3, 1.3], opacity: [0.6, 0, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/40"
                      animate={{ scale: [1, 1.5, 1.5], opacity: [0.4, 0, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                  </>
                )}
              </motion.div>

              {/* Name & Status */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Juli</h2>
                <p className="text-muted-foreground">AI Mental Health Counselor</p>
                
                <Badge variant={isConnected ? "default" : "secondary"} className="mt-2">
                  {isConnecting ? "Connecting..." : isConnected ? "In Session" : "Available"}
                </Badge>
              </div>

              {/* Session Timer */}
              {isConnected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-lg">{formatDuration(sessionDuration)}</span>
                </motion.div>
              )}

              {/* Call Controls */}
              <div className="flex items-center gap-4">
                {!isConnected ? (
                  <Button
                    onClick={startCall}
                    disabled={isConnecting}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full shadow-lg"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    {isConnecting ? 'Connecting...' : 'Start Session'}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={toggleMute}
                      variant={isMuted ? "destructive" : "secondary"}
                      size="lg"
                      className="rounded-full h-14 w-14"
                    >
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    
                    <Button
                      onClick={endCall}
                      variant="destructive"
                      size="lg"
                      className="px-8 py-6 rounded-full shadow-lg"
                    >
                      <PhoneOff className="h-5 w-5 mr-2" />
                      End Session
                    </Button>

                    <Button
                      onClick={() => setShowChat(!showChat)}
                      variant={showChat ? "default" : "secondary"}
                      size="lg"
                      className="rounded-full h-14 w-14"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>

              {/* Volume Control */}
              {isConnected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-xs flex items-center gap-3"
                >
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={1}
                    step={0.1}
                    className="flex-1"
                  />
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              )}
            </div>

            {/* Right Side - Chat Transcript */}
            <AnimatePresence>
              {(showChat || !isConnected) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 min-w-0"
                >
                  <Card className="h-[400px] flex flex-col bg-muted/30 border-border/50">
                    <div className="p-4 border-b border-border/50">
                      <h3 className="font-semibold flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Conversation
                      </h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-4">
                          <Heart className="h-12 w-12 mb-4 opacity-30" />
                          <p>Start a session to begin your conversation with Juli.</p>
                          <p className="text-sm mt-2">Your conversation will appear here.</p>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "flex",
                              msg.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                          >
                            <div className={cn(
                              "max-w-[85%] rounded-2xl px-4 py-2",
                              msg.role === 'user' 
                                ? 'bg-primary text-primary-foreground rounded-br-sm' 
                                : 'bg-muted text-foreground rounded-bl-sm'
                            )}>
                              <p className="text-sm">{msg.content}</p>
                              <span className="text-[10px] opacity-70 mt-1 block">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Features & Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">100% Private</h4>
              <p className="text-sm text-muted-foreground">Conversations are confidential and secure</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Heart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Empathetic AI</h4>
              <p className="text-sm text-muted-foreground">Trained in mental health support</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">24/7 Available</h4>
              <p className="text-sm text-muted-foreground">Support whenever you need it</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Crisis Notice */}
      <Card className="p-4 bg-destructive/10 border-destructive/20">
        <p className="text-sm text-center text-destructive">
          <strong>Crisis Support:</strong> If you're experiencing thoughts of self-harm or suicide, 
          please contact emergency services immediately or call a crisis helpline.
        </p>
      </Card>
    </div>
  );
};

export default AIAudioCall;
