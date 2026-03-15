import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX,
  MessageSquare, Heart, Shield, Clock, Send, User, Bot,
  Sparkles, Star, Zap, Brain, Activity, Headphones, Waves, AudioWaveform
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import VoiceVisualizer from './VoiceVisualizer';
import SessionSummary from './SessionSummary';
import Sophia3DAvatar from './Sophia3DAvatar';
import { supabase } from '@/integrations/supabase/client';

export interface AudioCounselor {
  id: string;
  name: string;
  specialty: string;
  description: string;
  gradient: string;
  avatarImage: string;
  agentId?: string;
  doctorType: string;
}

interface AIAudioCallProps {
  onCallEnd?: () => void;
  maxDurationSeconds?: number;
  onTimeUp?: () => void;
  isFreeTrial?: boolean;
  trialRemainingSeconds?: number;
  selectedCounselor?: AudioCounselor;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SOPHIA_AGENT_ID = "agent_4601kcc8ngyceh1vpfdm3vsrq1j0";
const DEFAULT_COUNSELOR_NAME = 'Sophia';

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const AIAudioCall: React.FC<AIAudioCallProps> = ({ onCallEnd, maxDurationSeconds, onTimeUp, isFreeTrial, trialRemainingSeconds, selectedCounselor }) => {
  const counselorName = selectedCounselor?.name || DEFAULT_COUNSELOR_NAME;
  const counselorDoctorType = selectedCounselor?.doctorType || 'mental_health';
  const counselorAvatar = selectedCounselor?.avatarImage;
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
  const [isReconnecting, setIsReconnecting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnectRef = useRef(false);
  const sessionDurationRef = useRef(0);
  const reconnectFnRef = useRef<(reason: 'disconnect' | 'error') => void>(() => {});

  const conversation = useConversation({
    onConnect: () => {
      setIsConnected(true);
      setIsConnecting(false);
      setIsReconnecting(false);
      reconnectAttemptsRef.current = 0;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      toast({ title: `✨ Connected to ${counselorName}`, description: "Your AI counselor is ready to listen" });
      setMessages([{
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content: `Hi there! I'm ${counselorName}, your AI counselor. 💜 I'm here to listen, support, and help you work through whatever you're experiencing. How are you feeling today?`,
        timestamp: new Date()
      }]);
    },
    onDisconnect: () => {
      setIsConnected(false);
      setIsConnecting(false);
      if (shouldReconnectRef.current) {
        reconnectFnRef.current('disconnect');
        return;
      }
      stopAudioAnalysis();
    },
    onMessage: (message: any) => {
      if (message.type === 'user_transcript' && message.user_transcription_event?.user_transcript) {
        setMessages(prev => [...prev, { id: Date.now().toString() + '-user', role: 'user', content: message.user_transcription_event.user_transcript, timestamp: new Date() }]);
      } else if (message.type === 'agent_response' && message.agent_response_event?.agent_response) {
        setMessages(prev => [...prev, { id: Date.now().toString() + '-assistant', role: 'assistant', content: message.agent_response_event.agent_response, timestamp: new Date() }]);
      } else if (message.source === 'user' && message.message) {
        setMessages(prev => [...prev, { id: Date.now().toString() + '-user-legacy', role: 'user', content: message.message, timestamp: new Date() }]);
      } else if (message.source === 'ai' && message.message) {
        setMessages(prev => [...prev, { id: Date.now().toString() + '-assistant-legacy', role: 'assistant', content: message.message, timestamp: new Date() }]);
      }
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      setIsConnecting(false);
      setIsConnected(false);
      if (shouldReconnectRef.current) {
        reconnectFnRef.current('error');
        return;
      }
      toast({ title: "Connection Error", description: "Failed to connect. Please check your microphone and try again.", variant: "destructive" });
      stopAudioAnalysis();
    },
  });

  // Audio analysis
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
      
      const analyze = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const voiceStart = Math.floor(300 / (audioContextRef.current!.sampleRate / analyserRef.current.fftSize));
        const voiceEnd = Math.floor(3400 / (audioContextRef.current!.sampleRate / analyserRef.current.fftSize));
        let voiceSum = 0;
        for (let i = voiceStart; i < voiceEnd && i < bufferLength; i++) voiceSum += dataArray[i];
        const normalizedLevel = (voiceSum / (voiceEnd - voiceStart)) / 128;
        setInputLevel(normalizedLevel);
        if (normalizedLevel > 0.12) { silenceFrames = 0; setUserSpeaking(true); }
        else if (normalizedLevel < 0.08) { silenceFrames++; if (silenceFrames > 10) setUserSpeaking(false); }
        animationFrameRef.current = requestAnimationFrame(analyze);
      };
      analyze();
    } catch (error) { console.error('Audio analysis error:', error); }
  }, []);

  const stopAudioAnalysis = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    if (micStreamRef.current) micStreamRef.current.getTracks().forEach(track => track.stop());
    micStreamRef.current = null;
    setInputLevel(0);
    setUserSpeaking(false);
  }, []);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const attemptReconnect = useCallback((reason: 'disconnect' | 'error') => {
    if (!shouldReconnectRef.current || reconnectTimeoutRef.current) return;

    reconnectAttemptsRef.current += 1;
    const attempts = reconnectAttemptsRef.current;

    if (attempts > 12) {
      shouldReconnectRef.current = false;
      setIsReconnecting(false);
      setIsConnecting(false);
      setIsConnected(false);
      stopAudioAnalysis();
      toast({
        title: 'Session Ended',
        description: `Network connection kept dropping. Please tap Talk to ${counselorName} again.`,
        variant: 'destructive',
      });
      return;
    }

    setIsReconnecting(true);
    const delay = Math.min(10000, 1000 * Math.pow(1.5, attempts - 1));

    reconnectTimeoutRef.current = setTimeout(async () => {
      reconnectTimeoutRef.current = null;
      if (!shouldReconnectRef.current) return;

      try {
        await conversation.startSession({ agentId: SOPHIA_AGENT_ID });
      } catch (error) {
        console.error(`Reconnect attempt ${attempts} failed after ${reason}:`, error);
        attemptReconnect('error');
      }
    }, delay);
  }, [conversation, stopAudioAnalysis, toast]);

  useEffect(() => {
    reconnectFnRef.current = attemptReconnect;
  }, [attemptReconnect]);

  useEffect(() => {
    sessionDurationRef.current = sessionDuration;
  }, [sessionDuration]);

  // Chat auto-scroll
  useEffect(() => {
    if (chatEndRef.current) {
      const scrollArea = chatEndRef.current.closest('[data-radix-scroll-area-viewport]');
      if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages, messages.length]);

  // Session timer + auto-end for free trial
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setSessionDuration(prev => {
          const next = prev + 1;
          if (maxDurationSeconds && next >= maxDurationSeconds) {
            shouldReconnectRef.current = false;
            clearReconnectTimer();
            toast({ title: "⏰ Free Trial Time Up", description: "Your 15-minute session has ended. Upgrade for unlimited access!" });
            conversation.endSession();
            setIsConnected(false);
            stopAudioAnalysis();
            setShowSummary(true);
            onTimeUp?.();
            clearInterval(interval);
          }
          if (maxDurationSeconds && next === maxDurationSeconds - 120) {
            toast({ title: "⚠️ 2 Minutes Remaining", description: "Your free session will end in 2 minutes." });
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected, maxDurationSeconds, onTimeUp, conversation, stopAudioAnalysis, toast, clearReconnectTimer]);

  // Output level simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setOutputLevel(conversation.isSpeaking ? Math.random() * 0.6 + 0.4 : 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isConnected, conversation.isSpeaking]);

  // Long-session keepalive + health recovery (stable for 1hr+)
  useEffect(() => {
    let keepAlive: NodeJS.Timeout;
    let healthCheck: NodeJS.Timeout;

    if (isConnected) {
      keepAlive = setInterval(() => {
        try {
          conversation.sendUserActivity();
        } catch {
          reconnectFnRef.current('disconnect');
        }
      }, 10000);

      healthCheck = setInterval(() => {
        if (conversation.status !== 'connected' && shouldReconnectRef.current) {
          reconnectFnRef.current('disconnect');
        } else {
          console.log(`Sophia call healthy — ${formatDuration(sessionDurationRef.current)}`);
        }
      }, 30000);
    }

    return () => {
      clearInterval(keepAlive);
      clearInterval(healthCheck);
    };
  }, [isConnected, conversation]);

  // Volume control
  useEffect(() => {
    if (isConnected) conversation.setVolume({ volume: volume[0] });
  }, [volume, isConnected, conversation]);

  const startCall = useCallback(async () => {
    try {
      shouldReconnectRef.current = true;
      reconnectAttemptsRef.current = 0;
      clearReconnectTimer();
      setIsReconnecting(false);
      setIsConnecting(true);
      setSessionDuration(0);
      setMessages([]);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      micStreamRef.current = stream;
      startAudioAnalysis(stream);
      
      // Log session
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('ai_counseling_sessions').insert({
          session_id: `audio-${Date.now()}`, user_id: user.id, counselor_id: `${counselorDoctorType}-ai`, session_type: 'audio_call', status: 'active',
          metadata: { agent_id: SOPHIA_AGENT_ID, mood_score: moodScore, counselor: counselorName } as any
        });
      }

      // Use Sophia's hardcoded agent for Sophia, or edge function for others
      if (!selectedCounselor || selectedCounselor.doctorType === 'mental_health') {
        await conversation.startSession({ agentId: SOPHIA_AGENT_ID });
      } else {
        // Get signed URL from edge function for this doctor type
        const { data: agentData, error: agentError } = await supabase.functions.invoke('elevenlabs-voice-agent', {
          body: { action: 'get_signed_url', doctorType: counselorDoctorType }
        });
        if (agentError || (!agentData?.signed_url && !agentData?.agent_id)) {
          throw new Error('Failed to create voice agent for ' + counselorName);
        }
        if (agentData.signed_url) {
          await conversation.startSession({ signedUrl: agentData.signed_url });
        } else {
          await conversation.startSession({ agentId: agentData.agent_id });
        }
      }
      toast({ title: "🎤 Microphone Active", description: `Speak naturally — ${counselorName} is listening` });
    } catch (error) {
      shouldReconnectRef.current = false;
      clearReconnectTimer();
      console.error('Error starting call:', error);
      let errorMessage = "Failed to start audio call.";
      if (error instanceof Error) {
        if (error.message.includes('Permission denied') || error.message.includes('NotAllowedError')) errorMessage = "Microphone access denied. Please allow microphone in browser settings.";
        else if (error.message.includes('NotFoundError')) errorMessage = "No microphone found. Please connect a microphone.";
        else errorMessage = error.message;
      }
      toast({ title: "Call Failed", description: errorMessage, variant: "destructive" });
      setIsConnecting(false);
      setIsReconnecting(false);
      stopAudioAnalysis();
    }
  }, [conversation, toast, startAudioAnalysis, stopAudioAnalysis, moodScore, clearReconnectTimer]);

  const endCall = useCallback(async () => {
    try {
      shouldReconnectRef.current = false;
      clearReconnectTimer();
      setIsReconnecting(false);
      await conversation.endSession();
      setIsConnected(false);
      stopAudioAnalysis();
      setShowSummary(true);
      onCallEnd?.();
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }, [conversation, onCallEnd, stopAudioAnalysis, clearReconnectTimer]);

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (micStreamRef.current) micStreamRef.current.getAudioTracks().forEach(track => { track.enabled = !newMuted; });
    toast({ title: newMuted ? "🔇 Muted" : "🎤 Unmuted", description: newMuted ? "Sophia cannot hear you" : "Sophia can hear you now" });
  }, [isMuted, toast]);

  const sendTextMessage = useCallback(() => {
    if (!chatInput.trim() || !isConnected) return;
    conversation.sendUserMessage(chatInput.trim());
    setMessages(prev => [...prev, { id: Date.now().toString() + '-user-text', role: 'user', content: chatInput.trim(), timestamp: new Date() }]);
    setChatInput('');
  }, [chatInput, isConnected, conversation]);

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTextMessage(); } };

  useEffect(() => {
    return () => {
      shouldReconnectRef.current = false;
      clearReconnectTimer();
      conversation.endSession().catch(() => {});
      stopAudioAnalysis();
    };
  }, [conversation, stopAudioAnalysis, clearReconnectTimer]);

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];

  return (
    <>
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Mood Check */}
        {!isConnected && !isConnecting && !isReconnecting && moodScore === null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card border-border/50">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" /> How are you feeling right now?
                </h3>
                <div className="flex items-center justify-center gap-4">
                  {moodEmojis.map((emoji, index) => (
                    <motion.button key={index} onClick={() => { setMoodScore(index + 1); toast({ title: "Mood recorded", description: `Sophia will personalize your session based on how you're feeling.` }); }}
                      className="text-3xl p-3 hover:bg-primary/10 rounded-2xl transition-colors" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                      {emoji}
                    </motion.button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">This helps Sophia personalize your session</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ═══ Main Interface ═══ */}
        <Card className="overflow-hidden bg-card border-border/50 shadow-xl">
          <CardContent className="p-0">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-border/30 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-medium">
                  <Shield className="h-3.5 w-3.5 text-primary" /> Encrypted
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-xs font-medium">
                  <Zap className="h-3.5 w-3.5 text-emerald-500" /> Real-time AI
                </div>
              </div>
              {(isConnected || isReconnecting) && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                  <motion.div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isReconnecting ? "bg-amber-500" : "bg-rose-500"
                    )}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium">
                    {isReconnecting ? 'Reconnecting…' : `Live • ${formatDuration(sessionDuration)}`}
                  </span>
                </motion.div>
              )}
            </div>

            <div className="grid lg:grid-cols-5 gap-0">
              {/* ═══ LEFT: Avatar + Controls (3 cols) ═══ */}
              <div className="lg:col-span-3 flex flex-col items-center justify-center p-8 space-y-6 bg-gradient-to-b from-muted/10 to-transparent min-h-[500px]">
                
                {/* 3D Avatar — Centerpiece */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Sophia3DAvatar
                    isSpeaking={conversation.isSpeaking}
                    isListening={(isConnected || isReconnecting) && !conversation.isSpeaking && !isMuted}
                    isActive={isConnected || isReconnecting}
                    size="xl"
                  />
                </motion.div>

                {/* Name + Status */}
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">Sophia</h2>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" /> AI Mental Health Counselor
                  </p>
                  <Badge
                    variant={isConnected ? "default" : "secondary"}
                    className={cn("mt-1", isConnected && "bg-gradient-to-r from-primary to-purple-500", isReconnecting && "bg-amber-500/20 text-amber-700")}
                  >
                    {isReconnecting
                      ? 'Reconnecting securely...'
                      : isConnecting
                        ? 'Connecting...'
                        : isConnected
                          ? `In Session • ${formatDuration(sessionDuration)}`
                          : 'Ready to Help'}
                  </Badge>
                </div>

                {/* Voice Visualizers */}
                {isConnected && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-3 border border-primary/15 bg-primary/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Bot className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium">Sophia</span>
                        </div>
                        {conversation.isSpeaking && <Badge className="text-[9px] px-1.5 py-0 bg-primary/20 text-primary">Speaking</Badge>}
                      </div>
                      <VoiceVisualizer isActive={isConnected} isSpeaking={conversation.isSpeaking} type="ai" outputLevel={outputLevel} />
                    </div>
                    <div className="rounded-xl p-3 border border-emerald-500/15 bg-emerald-500/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4 text-emerald-500" />
                          <span className="text-xs font-medium">You</span>
                        </div>
                        {isMuted ? <Badge variant="destructive" className="text-[9px] px-1.5 py-0">Muted</Badge>
                          : userSpeaking ? <Badge className="text-[9px] px-1.5 py-0 bg-emerald-500/20 text-emerald-600">Speaking</Badge>
                          : <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Ready</Badge>}
                      </div>
                      <VoiceVisualizer isActive={isConnected && !isMuted} isSpeaking={userSpeaking} type="user" inputLevel={isMuted ? 0 : inputLevel} />
                    </div>
                  </motion.div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-3">
                  {!isConnected ? (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={startCall} disabled={isConnecting || isReconnecting} size="lg"
                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-6 rounded-2xl shadow-lg shadow-emerald-500/25 text-lg gap-2">
                        <Phone className="h-5 w-5" /> {isReconnecting ? 'Reconnecting...' : isConnecting ? 'Connecting...' : 'Talk to Sophia'}
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button onClick={toggleMute} variant={isMuted ? "destructive" : "secondary"} size="lg" className="rounded-full h-14 w-14">
                          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={endCall} variant="destructive" size="lg" className="px-6 py-5 rounded-2xl gap-2">
                          <PhoneOff className="h-5 w-5" /> End Session
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button onClick={() => setShowChat(!showChat)} variant={showChat ? "default" : "secondary"} size="lg" className="rounded-full h-14 w-14">
                          <MessageSquare className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    </>
                  )}
                </div>

                {/* Volume + Breathing */}
                {isConnected && (
                  <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                    <div className="w-full flex items-center gap-3 bg-muted/30 rounded-full px-4 py-2">
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                      <Slider value={volume} onValueChange={setVolume} max={1} step={0.1} className="flex-1" />
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setBreathingMode(!breathingMode)} className="rounded-full gap-2 text-xs">
                      <Waves className="h-3.5 w-3.5" /> {breathingMode ? 'Stop Breathing' : 'Breathing Exercise'}
                    </Button>
                  </div>
                )}

                {/* Breathing Animation */}
                <AnimatePresence>
                  {breathingMode && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="text-center">
                      <motion.div
                        className="w-20 h-20 rounded-full bg-gradient-to-r from-primary/40 to-emerald-500/40 mx-auto mb-2 flex items-center justify-center"
                        animate={{ scale: [1, 1.5, 1.5, 1] }}
                        transition={{ duration: 8, repeat: Infinity, times: [0, 0.25, 0.75, 1] }}
                      >
                        <span className="text-sm font-medium text-foreground">Breathe</span>
                      </motion.div>
                      <p className="text-xs text-muted-foreground">Inhale... Hold... Exhale...</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ═══ RIGHT: Chat Panel (2 cols) ═══ */}
              <AnimatePresence>
                {showChat && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="lg:col-span-2 flex flex-col border-l border-border/30 min-h-[500px] bg-muted/5"
                  >
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border/30 flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-primary" /> Conversation
                        {messages.length > 0 && <Badge variant="secondary" className="text-xs">{messages.length}</Badge>}
                      </h3>
                      {isConnected && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10">
                          <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                          <span className="text-[10px] text-emerald-600 font-medium">Live</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-6 min-h-[200px]">
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                              <Heart className="h-12 w-12 mb-3 text-rose-300" />
                            </motion.div>
                            <p className="text-sm font-medium">Start a session with Sophia</p>
                            <p className="text-xs mt-1 max-w-[200px]">Speak naturally or type messages. Sophia is here to listen.</p>
                          </div>
                        ) : (
                          messages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={cn("flex gap-2.5", msg.role === 'user' ? 'justify-end' : 'justify-start')}
                            >
                              {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0 shadow">
                                  <Sparkles className="h-4 w-4 text-white" />
                                </div>
                              )}
                              <div className={cn(
                                "max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-sm",
                                msg.role === 'user' 
                                  ? 'bg-primary text-primary-foreground rounded-br-md' 
                                  : 'bg-muted text-foreground rounded-bl-md border border-border/30'
                              )}>
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                <span className={cn("text-[10px] mt-1 block opacity-60", msg.role === 'user' ? 'text-primary-foreground' : 'text-muted-foreground')}>
                                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow">
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
                      <div className="p-4 border-t border-border/30">
                        <div className="flex gap-2">
                          <Input ref={inputRef} value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={handleKeyPress}
                            placeholder="Type a message..." className="flex-1 rounded-xl text-sm" />
                          <Button onClick={sendTextMessage} disabled={!chatInput.trim()} size="icon"
                            className="bg-primary hover:bg-primary/90 rounded-xl">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
                          <Mic className="h-3 w-3" /> Speak or type to communicate
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Shield, title: "100% Private", desc: "Confidential sessions", color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { icon: Brain, title: "AI Powered", desc: "Advanced understanding", color: "text-purple-500", bg: "bg-purple-500/10" },
            { icon: Heart, title: "Empathetic", desc: "Compassionate support", color: "text-rose-500", bg: "bg-rose-500/10" },
            { icon: Clock, title: "24/7 Available", desc: "Anytime support", color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((item) => (
            <Card key={item.title} className="p-4 bg-card border-border/50 hover:border-primary/20 transition-colors">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg", item.bg)}>
                  <item.icon className={cn("h-4 w-4", item.color)} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Crisis Notice */}
        <Card className="p-4 bg-destructive/5 border-destructive/15">
          <p className="text-xs text-center text-muted-foreground">
            <strong className="text-destructive">🆘 Crisis:</strong> For self-harm or suicidal thoughts, contact emergency services or iCall (9152987821) • 988 Lifeline (US)
          </p>
        </Card>
      </div>

      {/* Session Summary */}
      <AnimatePresence>
        {showSummary && (
          <SessionSummary
            duration={sessionDuration}
            messages={messages}
            onClose={() => setShowSummary(false)}
            onNewSession={() => { setShowSummary(false); setMoodScore(null); startCall(); }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAudioCall;
