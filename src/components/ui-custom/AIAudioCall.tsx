import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Send,
  User,
  Bot,
  Sparkles,
  Star,
  Zap,
  Brain,
  Activity,
  Headphones,
  Waves,
  AudioWaveform
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import VoiceVisualizer from './VoiceVisualizer';
import SessionSummary from './SessionSummary';
import JuliMascot from './JuliMascot';
import { supabase } from '@/integrations/supabase/client';

interface AIAudioCallProps {
  onCallEnd?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Public ElevenLabs Agent ID for Juli
const JULI_AGENT_ID = "agent_4601kcc8ngyceh1vpfdm3vsrq1j0";

const AIAudioCall: React.FC<AIAudioCallProps> = ({ onCallEnd }) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([0.8]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showChat, setShowChat] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [inputLevel, setInputLevel] = useState(0);
  const [outputLevel, setOutputLevel] = useState(0);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [breathingMode, setBreathingMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to Juli AI Counselor');
      setIsConnected(true);
      setIsConnecting(false);
      toast({
        title: "✨ Connected to Juli",
        description: "Your AI mental health counselor is ready to listen",
      });
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content: "Hello! I'm Juli, your AI mental health counselor. I'm here to listen and support you. How are you feeling today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    },
    onDisconnect: () => {
      console.log('Disconnected from Juli');
      setIsConnected(false);
      setIsConnecting(false);
      stopAudioAnalysis();
    },
    onMessage: (message: any) => {
      console.log('Message received:', message);
      
      // Handle different message types from ElevenLabs
      if (message.type === 'user_transcript' && message.user_transcription_event?.user_transcript) {
        const transcript = message.user_transcription_event.user_transcript;
        const newMessage: Message = {
          id: Date.now().toString() + '-user',
          role: 'user',
          content: transcript,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      } else if (message.type === 'agent_response' && message.agent_response_event?.agent_response) {
        const response = message.agent_response_event.agent_response;
        const newMessage: Message = {
          id: Date.now().toString() + '-assistant',
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      } else if (message.source === 'user' && message.message) {
        // Fallback for older message format
        const newMessage: Message = {
          id: Date.now().toString() + '-user-legacy',
          role: 'user',
          content: message.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      } else if (message.source === 'ai' && message.message) {
        // Fallback for older message format
        const newMessage: Message = {
          id: Date.now().toString() + '-assistant-legacy',
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
        description: "Failed to connect to Juli. Please check your microphone permissions and try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
      setIsConnected(false);
      stopAudioAnalysis();
    },
  });

  // Real-time audio analysis for visualization and voice activity detection
  const startAudioAnalysis = useCallback(async (stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.4;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      let silenceFrames = 0;
      const silenceThreshold = 0.08;
      const speakingThreshold = 0.12;
      
      const analyze = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Focus on voice frequency range (300Hz - 3400Hz for human voice)
        const voiceStart = Math.floor(300 / (audioContextRef.current!.sampleRate / analyserRef.current.fftSize));
        const voiceEnd = Math.floor(3400 / (audioContextRef.current!.sampleRate / analyserRef.current.fftSize));
        
        let voiceSum = 0;
        for (let i = voiceStart; i < voiceEnd && i < bufferLength; i++) {
          voiceSum += dataArray[i];
        }
        const voiceAverage = voiceSum / (voiceEnd - voiceStart);
        const normalizedLevel = voiceAverage / 128;
        
        setInputLevel(normalizedLevel);
        
        // Better voice activity detection with debouncing
        if (normalizedLevel > speakingThreshold) {
          silenceFrames = 0;
          setUserSpeaking(true);
        } else if (normalizedLevel < silenceThreshold) {
          silenceFrames++;
          // Only mark as not speaking after consistent silence (about 300ms)
          if (silenceFrames > 10) {
            setUserSpeaking(false);
          }
        }
        
        animationFrameRef.current = requestAnimationFrame(analyze);
      };
      
      analyze();
    } catch (error) {
      console.error('Audio analysis error:', error);
    }
  }, []);

  const stopAudioAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    setInputLevel(0);
    setUserSpeaking(false);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  // Output level based on AI speaking state
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        const baseOutput = conversation.isSpeaking ? Math.random() * 0.6 + 0.4 : 0.1;
        setOutputLevel(baseOutput);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isConnected, conversation.isSpeaking]);

  // Volume control
  useEffect(() => {
    if (isConnected) {
      conversation.setVolume({ volume: volume[0] });
    }
  }, [volume, isConnected, conversation]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = useCallback(async () => {
    setIsConnecting(true);
    setMessages([]);
    setSessionDuration(0);
    setShowSummary(false);
    setMoodScore(null);
    
    try {
      // Request microphone permission with optimal settings for voice
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1,
        } 
      });
      
      micStreamRef.current = stream;
      
      // Start audio analysis for visualization
      await startAudioAnalysis(stream);
      
      console.log('Starting ElevenLabs conversation with agent:', JULI_AGENT_ID);
      
      // Start the conversation session with the public agent ID using WebRTC
      await conversation.startSession({
        agentId: JULI_AGENT_ID,
      });
      
      toast({
        title: "🎤 Microphone Active",
        description: "Speak naturally - Juli is listening to you",
      });
      
    } catch (error) {
      console.error('Error starting call:', error);
      
      let errorMessage = "Failed to start audio call.";
      if (error instanceof Error) {
        if (error.message.includes('Permission denied') || error.message.includes('NotAllowedError')) {
          errorMessage = "Microphone access denied. Please allow microphone access in your browser settings.";
        } else if (error.message.includes('NotFoundError')) {
          errorMessage = "No microphone found. Please connect a microphone and try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Call Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsConnecting(false);
      stopAudioAnalysis();
    }
  }, [conversation, toast, startAudioAnalysis, stopAudioAnalysis]);

  const endCall = useCallback(async () => {
    try {
      await conversation.endSession();
      setIsConnected(false);
      stopAudioAnalysis();
      setShowSummary(true);
      onCallEnd?.();
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }, [conversation, onCallEnd, stopAudioAnalysis]);

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    // Actually mute/unmute the microphone stream
    if (micStreamRef.current) {
      micStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !newMuted;
      });
    }
    
    toast({
      title: newMuted ? "🔇 Microphone Muted" : "🎤 Microphone Unmuted",
      description: newMuted ? "Juli cannot hear you" : "Juli can hear you now",
    });
  }, [isMuted, toast]);

  const sendTextMessage = useCallback(() => {
    if (!chatInput.trim() || !isConnected) return;
    
    // Send text message through conversation
    conversation.sendUserMessage(chatInput.trim());
    
    // Add to local messages
    const newMessage: Message = {
      id: Date.now().toString() + '-user-text',
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setChatInput('');
  }, [chatInput, isConnected, conversation]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  const handleMoodSelect = (score: number) => {
    setMoodScore(score);
    toast({
      title: "Mood recorded",
      description: `You're feeling ${score <= 2 ? 'low' : score <= 4 ? 'okay' : 'good'} today. Juli is here to help.`,
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        conversation.endSession();
      }
      stopAudioAnalysis();
    };
  }, []);

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];

  return (
    <>
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${150 + i * 30}px`,
                height: `${150 + i * 30}px`,
                background: `radial-gradient(circle, ${i % 3 === 0 ? 'hsl(var(--primary) / 0.08)' : i % 3 === 1 ? 'hsl(142 76% 36% / 0.08)' : 'hsl(280 76% 50% / 0.05)'} 0%, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 40, -40, 0],
                y: [0, -40, 40, 0],
                scale: [1, 1.2, 0.9, 1],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Mood Check Card - Before Call */}
        {!isConnected && !isConnecting && moodScore === null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-emerald-500/10 border-primary/20">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  How are you feeling right now?
                </h3>
                <div className="flex items-center justify-center gap-3">
                  {moodEmojis.map((emoji, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleMoodSelect(index + 1)}
                      className="text-3xl p-2 hover:scale-125 transition-transform rounded-full hover:bg-primary/20"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  This helps Juli understand how to best support you
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Call Interface */}
        <Card className="overflow-hidden bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 border-primary/20 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            {/* Quick Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center gap-3 mb-6"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-sm">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-sm">
                <Zap className="h-3.5 w-3.5 text-emerald-500" />
                <span>Real-time AI</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-sm">
                <Star className="h-3.5 w-3.5 text-amber-500" />
                <span>24/7 Available</span>
              </div>
              {isConnected && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 text-sm"
                >
                  <Activity className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                  <span>Live Session</span>
                </motion.div>
              )}
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Side - Mascot, Visualizers & Controls */}
              <div className="flex flex-col items-center justify-center space-y-6">
                {/* Juli Mascot with Enhanced Animations */}
                <div className="relative">
                  <JuliMascot
                    isActive={isConnected}
                    isSpeaking={conversation.isSpeaking}
                    isListening={isConnected && !conversation.isSpeaking && !isMuted}
                    size="xl"
                  />
                  
                  {/* Floating Audio Waves */}
                  {isConnected && (
                    <div className="absolute -inset-8 pointer-events-none">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute inset-0 rounded-full border-2 border-primary/20"
                          animate={{
                            scale: [1, 1.5 + i * 0.3, 1.5 + i * 0.3],
                            opacity: [0.3, 0, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Voice Visualizers */}
                {isConnected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm space-y-3"
                  >
                    {/* AI Voice Visualizer */}
                    <div className="bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-xl p-4 border border-primary/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={conversation.isSpeaking ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          >
                            <Bot className="h-5 w-5 text-primary" />
                          </motion.div>
                          <span className="text-sm font-medium">Juli</span>
                        </div>
                        {conversation.isSpeaking && (
                          <Badge className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary animate-pulse">
                            <AudioWaveform className="h-3 w-3 mr-1" />
                            Speaking
                          </Badge>
                        )}
                      </div>
                      <VoiceVisualizer
                        isActive={isConnected}
                        isSpeaking={conversation.isSpeaking}
                        type="ai"
                        outputLevel={outputLevel}
                      />
                    </div>

                    {/* User Voice Visualizer */}
                    <div className="bg-gradient-to-r from-emerald-500/10 to-primary/10 rounded-xl p-4 border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={userSpeaking && !isMuted ? { scale: [1, 1.15, 1] } : {}}
                            transition={{ duration: 0.3, repeat: Infinity }}
                          >
                            <User className="h-5 w-5 text-emerald-500" />
                          </motion.div>
                          <span className="text-sm font-medium">You</span>
                        </div>
                        {isMuted ? (
                          <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                            <MicOff className="h-3 w-3 mr-1" />
                            Muted
                          </Badge>
                        ) : userSpeaking ? (
                          <Badge className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-600">
                            <Mic className="h-3 w-3 mr-1 animate-pulse" />
                            Speaking
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                            <Headphones className="h-3 w-3 mr-1" />
                            Ready
                          </Badge>
                        )}
                      </div>
                      <VoiceVisualizer
                        isActive={isConnected && !isMuted}
                        isSpeaking={userSpeaking}
                        type="user"
                        inputLevel={isMuted ? 0 : inputLevel}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Name & Status */}
                <div className="text-center space-y-2">
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent"
                    animate={isConnected ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Juli
                  </motion.h2>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Brain className="h-4 w-4 text-purple-400" />
                    AI Mental Health Counselor
                    <Heart className="h-4 w-4 text-rose-400" />
                  </p>
                  
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="inline-block"
                  >
                    <Badge 
                      variant={isConnected ? "default" : "secondary"} 
                      className={cn(
                        "mt-2 px-4 py-1.5 text-sm",
                        isConnected && "bg-gradient-to-r from-primary via-purple-500 to-emerald-500"
                      )}
                    >
                      {isConnecting ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ scale: [1, 0.5, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          />
                          Connecting to Juli...
                        </span>
                      ) : isConnected ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          In Session • {formatDuration(sessionDuration)}
                        </span>
                      ) : "Ready to Help 24/7"}
                    </Badge>
                  </motion.div>
                </div>

                {/* Call Controls */}
                <div className="flex items-center gap-4">
                  {!isConnected ? (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={startCall}
                        disabled={isConnecting}
                        size="lg"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 rounded-full shadow-lg shadow-green-500/30 text-lg"
                      >
                        <Phone className="h-6 w-6 mr-2" />
                        {isConnecting ? 'Connecting...' : 'Talk to Juli'}
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          onClick={toggleMute}
                          variant={isMuted ? "destructive" : "secondary"}
                          size="lg"
                          className="rounded-full h-14 w-14 shadow-lg"
                        >
                          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={endCall}
                          variant="destructive"
                          size="lg"
                          className="px-8 py-6 rounded-full shadow-lg shadow-red-500/30"
                        >
                          <PhoneOff className="h-6 w-6 mr-2" />
                          End Session
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          onClick={() => setShowChat(!showChat)}
                          variant={showChat ? "default" : "secondary"}
                          size="lg"
                          className="rounded-full h-14 w-14 shadow-lg"
                        >
                          <MessageSquare className="h-6 w-6" />
                        </Button>
                      </motion.div>
                    </>
                  )}
                </div>

                {/* Volume Control */}
                {isConnected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xs flex items-center gap-3 bg-muted/30 rounded-full px-4 py-2"
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

                {/* Breathing Exercise Button */}
                {isConnected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBreathingMode(!breathingMode)}
                      className="rounded-full"
                    >
                      <Waves className="h-4 w-4 mr-2" />
                      {breathingMode ? 'Stop Breathing Exercise' : 'Start Breathing Exercise'}
                    </Button>
                  </motion.div>
                )}

                {/* Breathing Animation */}
                <AnimatePresence>
                  {breathingMode && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center"
                    >
                      <motion.div
                        className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-2 flex items-center justify-center"
                        animate={{
                          scale: [1, 1.5, 1.5, 1],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          times: [0, 0.25, 0.75, 1],
                        }}
                      >
                        <motion.span
                          className="text-white font-medium"
                          animate={{
                            opacity: [1, 1, 1, 1],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                          }}
                        >
                          Breathe
                        </motion.span>
                      </motion.div>
                      <p className="text-sm text-muted-foreground">
                        Inhale... Hold... Exhale...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Side - Chat */}
              <AnimatePresence>
                {showChat && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col"
                  >
                    <Card className="flex-1 flex flex-col bg-muted/20 border-border/50 min-h-[400px] lg:min-h-[550px]">
                      <div className="p-4 border-b border-border/50 flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Conversation
                          {messages.length > 0 && (
                            <Badge variant="secondary" className="text-xs">{messages.length}</Badge>
                          )}
                        </h3>
                        {isConnected && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-muted-foreground">Live</span>
                          </div>
                        )}
                      </div>
                      
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-4 min-h-[200px]">
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Heart className="h-16 w-16 mb-4 text-rose-300" />
                              </motion.div>
                              <p className="text-lg font-medium">Start a session with Juli</p>
                              <p className="text-sm mt-2 max-w-xs">
                                Just speak naturally or type your messages. Juli is here to listen and support you.
                              </p>
                            </div>
                          ) : (
                            messages.map((msg) => (
                              <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                  "flex gap-2",
                                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                                )}
                              >
                                {msg.role === 'assistant' && (
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <Sparkles className="h-4 w-4 text-white" />
                                  </div>
                                )}
                                <div className={cn(
                                  "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                                  msg.role === 'user' 
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-br-sm' 
                                    : 'bg-muted text-foreground rounded-bl-sm'
                                )}>
                                  <p className="text-sm leading-relaxed">{msg.content}</p>
                                  <span className={cn(
                                    "text-[10px] mt-1 block",
                                    msg.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                                  )}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                {msg.role === 'user' && (
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <User className="h-4 w-4 text-white" />
                                  </div>
                                )}
                              </motion.div>
                            ))
                          )}
                          <div ref={chatEndRef} />
                        </div>
                      </ScrollArea>

                      {/* Chat Input */}
                      {isConnected && (
                        <div className="p-4 border-t border-border/50">
                          <div className="flex gap-2">
                            <Input
                              ref={inputRef}
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Type a message to Juli..."
                              className="flex-1"
                            />
                            <Button
                              onClick={sendTextMessage}
                              disabled={!chatInput.trim()}
                              size="icon"
                              className="bg-primary"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
                            <Mic className="h-3 w-3" />
                            Just speak naturally or press Enter to send
                          </p>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Features & Info */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20 hover:border-green-500/40 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">100% Private</h4>
                <p className="text-sm text-muted-foreground">Confidential & secure</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 hover:border-purple-500/40 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">AI Powered</h4>
                <p className="text-sm text-muted-foreground">Advanced understanding</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Heart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Empathetic</h4>
                <p className="text-sm text-muted-foreground">Compassionate support</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 hover:border-amber-500/40 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">24/7 Available</h4>
                <p className="text-sm text-muted-foreground">Anytime support</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Crisis Notice */}
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-sm text-center text-destructive">
            <strong>🆘 Crisis Support:</strong> If you're experiencing thoughts of self-harm or suicide, 
            please contact emergency services immediately or call a crisis helpline.
          </p>
        </Card>
      </div>

      {/* Session Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <SessionSummary
            duration={sessionDuration}
            messages={messages}
            onClose={() => setShowSummary(false)}
            onNewSession={() => {
              setShowSummary(false);
              setMoodScore(null);
              startCall();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAudioCall;
