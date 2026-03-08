import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Clock,
  Shield,
  Loader2,
  ExternalLink,
  Brain,
  Heart,
  Volume2,
  AlertCircle,
  Waves,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useConversation } from '@11labs/react';
import VoiceWaveformVisualizer from './VoiceWaveformVisualizer';
import { DOCTOR_PROFILES, type DoctorType } from '@/lib/doctorProfiles';

interface TavusVideoConsultationProps {
  doctorType?: DoctorType;
  onEndCall: () => void;
}

type ConsultationMode = 'selection' | 'video' | 'voice';
type ReconnectReason = 'disconnect' | 'error';

const TavusVideoConsultation: React.FC<TavusVideoConsultationProps> = ({
  doctorType = 'general',
  onEndCall,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [mode, setMode] = useState<ConsultationMode>('selection');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const shouldReconnectRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectFnRef = useRef<(reason: ReconnectReason) => void>(() => {});
  const modeRef = useRef<ConsultationMode>('selection');
  const sessionDurationRef = useRef(0);

  const doctorInfo = DOCTOR_PROFILES[doctorType] || DOCTOR_PROFILES.general;
  const DoctorIcon = doctorInfo.icon;

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    sessionDurationRef.current = sessionDuration;
  }, [sessionDuration]);

  // ElevenLabs conversation hook
  const elevenLabsConversation = useConversation({
    onConnect: () => {
      console.log('ElevenLabs voice connected');
      setIsConnected(true);
      setIsLoading(false);
      setIsReconnecting(false);
      reconnectAttemptsRef.current = 0;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      toast({
        title: 'Voice Connected',
        description: `You're speaking with ${doctorInfo.name}`,
      });
    },
    onDisconnect: () => {
      console.log('ElevenLabs voice disconnected');
      setIsConnected(false);
      if (shouldReconnectRef.current && modeRef.current === 'voice') {
        reconnectFnRef.current('disconnect');
      }
    },
    onMessage: (message) => {
      console.log('ElevenLabs message:', message);
    },
    onError: (error: any) => {
      console.error('ElevenLabs error:', error);
      const errorMsg = typeof error === 'string' ? error : error?.message || 'Voice connection failed';
      setVoiceError(errorMsg);
      setIsConnected(false);
      setIsLoading(false);
      if (shouldReconnectRef.current && modeRef.current === 'voice') {
        reconnectFnRef.current('error');
        return;
      }
      toast({
        title: 'Voice Error',
        description: errorMsg,
        variant: 'destructive',
      });
    },
  });

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Tavus Video Consultation
  const startVideoConsultation = useCallback(async () => {
    setIsLoading(true);
    setMode('video');
    try {
      // Step 1: Create persona
      console.log('Creating persona for:', doctorType);
      const { data: personaData, error: personaError } = await supabase.functions.invoke(
        'tavus-conversation',
        {
          body: { action: 'create_persona', doctorType },
        }
      );

      if (personaError) {
        throw new Error(personaError.message || 'Failed to create persona');
      }

      console.log('Persona response:', personaData);

      if (personaData?.error) {
        throw new Error(personaData.error);
      }

      const createdPersonaId = personaData?.persona_id;

      if (!createdPersonaId) {
        throw new Error('No persona ID returned');
      }

      // Step 2: Create conversation
      console.log('Creating conversation with persona:', createdPersonaId);
      const { data: conversationData, error: conversationError } = await supabase.functions.invoke(
        'tavus-conversation',
        {
          body: { action: 'create_conversation', personaId: createdPersonaId, doctorType },
        }
      );

      if (conversationError) {
        throw new Error(conversationError.message || 'Failed to create conversation');
      }

      console.log('Conversation response:', conversationData);

      if (conversationData?.error) {
        throw new Error(conversationData.error);
      }

      if (!conversationData?.conversation_url) {
        throw new Error('No conversation URL returned');
      }

      setConversationId(conversationData.conversation_id);
      setConversationUrl(conversationData.conversation_url);
      setIsConnected(true);

      toast({
        title: 'Video Consultation Ready',
        description: `You're connected with ${doctorInfo.name}`,
      });
    } catch (error) {
      console.error('Error starting video consultation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start video consultation';

      toast({
        title: 'Video Connection Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      toast({
        title: 'Try Voice Consultation',
        description: 'Video not available. Would you like to try voice consultation instead?',
      });

      setMode('selection');
    } finally {
      setIsLoading(false);
    }
  }, [doctorType, doctorInfo.name, toast]);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const startVoiceSession = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke('elevenlabs-voice-agent', {
      body: {
        action: 'get_signed_url',
        doctorType,
        systemPrompt: doctorInfo.systemPrompt,
      },
    });

    if (error) {
      throw new Error(typeof error === 'string' ? error : (error as any)?.message || 'Failed to get voice session');
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    if (data?.signed_url) {
      await elevenLabsConversation.startSession({ signedUrl: data.signed_url });
      return;
    }

    if (data?.agent_id) {
      await elevenLabsConversation.startSession({ agentId: data.agent_id });
      return;
    }

    throw new Error('No session URL or agent ID returned');
  }, [doctorType, doctorInfo.systemPrompt, elevenLabsConversation]);

  const attemptReconnect = useCallback((reason: ReconnectReason) => {
    if (!shouldReconnectRef.current || modeRef.current !== 'voice' || reconnectTimeoutRef.current) {
      return;
    }

    reconnectAttemptsRef.current += 1;
    const attempts = reconnectAttemptsRef.current;

    if (attempts > 24) {
      shouldReconnectRef.current = false;
      setIsReconnecting(false);
      setIsLoading(false);
      setVoiceError('Connection kept dropping. Please start voice consultation again.');
      toast({
        title: 'Voice Session Ended',
        description: 'Network remained unstable during long call. Please reconnect.',
        variant: 'destructive',
      });
      return;
    }

    setIsReconnecting(true);
    const delay = Math.min(15000, 1200 * Math.pow(1.4, attempts - 1));

    reconnectTimeoutRef.current = setTimeout(async () => {
      reconnectTimeoutRef.current = null;
      if (!shouldReconnectRef.current || modeRef.current !== 'voice') return;

      try {
        await startVoiceSession();
      } catch (error) {
        console.error(`Reconnect attempt ${attempts} failed after ${reason}:`, error);
        attemptReconnect('error');
      }
    }, delay);
  }, [startVoiceSession, toast]);

  useEffect(() => {
    reconnectFnRef.current = attemptReconnect;
  }, [attemptReconnect]);

  // Start ElevenLabs Voice Consultation
  const startVoiceConsultation = useCallback(async () => {
    setIsLoading(true);
    setMode('voice');
    setVoiceError(null);
    shouldReconnectRef.current = true;
    reconnectAttemptsRef.current = 0;
    clearReconnectTimer();
    setIsReconnecting(false);

    try {
      const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      permissionStream.getTracks().forEach((track) => track.stop());
      await startVoiceSession();
    } catch (error) {
      shouldReconnectRef.current = false;
      clearReconnectTimer();
      setIsReconnecting(false);
      setIsLoading(false);
      console.error('Error starting voice consultation:', error);
      setVoiceError(error instanceof Error ? error.message : 'Voice connection failed');
      toast({
        title: 'Voice Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to start voice consultation',
        variant: 'destructive',
      });
      setMode('selection');
    }
  }, [clearReconnectTimer, startVoiceSession, toast]);

  useEffect(() => {
    let keepAlive: NodeJS.Timeout;
    let healthCheck: NodeJS.Timeout;

    if (mode === 'voice' && isConnected) {
      keepAlive = setInterval(() => {
        try {
          elevenLabsConversation.sendUserActivity();
        } catch {
          reconnectFnRef.current('disconnect');
        }
      }, 10000);

      healthCheck = setInterval(() => {
        if (elevenLabsConversation.status !== 'connected' && shouldReconnectRef.current) {
          reconnectFnRef.current('disconnect');
        } else {
          console.log(`Voice call healthy — ${formatDuration(sessionDurationRef.current)}`);
        }
      }, 30000);
    }

    return () => {
      clearInterval(keepAlive);
      clearInterval(healthCheck);
    };
  }, [mode, isConnected, elevenLabsConversation]);

  useEffect(() => {
    return () => {
      shouldReconnectRef.current = false;
      clearReconnectTimer();
      elevenLabsConversation.endSession().catch(() => {});
    };
  }, [clearReconnectTimer, elevenLabsConversation]);

  const endVideoConsultation = useCallback(async () => {
    try {
      if (conversationId) {
        await supabase.functions.invoke('tavus-conversation', {
          body: { action: 'end_conversation', conversationId },
        });
      }

      toast({
        title: "Session Ended",
        description: `Consultation duration: ${formatDuration(sessionDuration)}`,
      });

      setIsConnected(false);
      setConversationUrl(null);
      setConversationId(null);
      onEndCall();
    } catch (error) {
      console.error('Error ending consultation:', error);
      onEndCall();
    }
  }, [conversationId, sessionDuration, toast, onEndCall]);

  const endVoiceConsultation = useCallback(async () => {
    try {
      shouldReconnectRef.current = false;
      clearReconnectTimer();
      setIsReconnecting(false);
      await elevenLabsConversation.endSession();

      toast({
        title: "Session Ended",
        description: `Consultation duration: ${formatDuration(sessionDuration)}`,
      });

      setIsConnected(false);
      onEndCall();
    } catch (error) {
      console.error('Error ending voice consultation:', error);
      onEndCall();
    }
  }, [clearReconnectTimer, elevenLabsConversation, sessionDuration, toast, onEndCall]);

  const openInNewTab = () => {
    if (conversationUrl) {
      window.open(conversationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Selection screen
  const renderSelectionScreen = () => (
    <motion.div
      key="selection"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center max-w-xl w-full"
    >
      <Card className="p-8 bg-card/80 backdrop-blur-lg border-border overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className={cn("absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br opacity-20 blur-3xl", doctorInfo.gradient)} />
          <div className={cn("absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br opacity-20 blur-3xl", doctorInfo.gradient)} />
        </div>
        
        <CardContent className="space-y-6 p-0 relative z-10">
          {/* Doctor Avatar */}
          <motion.div 
            className={cn(
              "w-36 h-36 rounded-3xl mx-auto flex items-center justify-center bg-gradient-to-br shadow-2xl",
              doctorInfo.gradient
            )}
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(0,0,0,0.1)",
                "0 0 40px rgba(0,0,0,0.2)",
                "0 0 20px rgba(0,0,0,0.1)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <DoctorIcon className="h-16 w-16 text-white" />
          </motion.div>

          <div>
            <h2 className="text-3xl font-bold text-foreground">{doctorInfo.name}</h2>
            <p className="text-lg text-muted-foreground">{doctorInfo.specialty}</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              {doctorInfo.description}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { icon: Shield, label: 'Secure & Private', color: 'text-green-500' },
              { icon: Brain, label: 'AI-Powered', color: 'text-purple-500' },
              { icon: Clock, label: 'Available 24/7', color: 'text-blue-500' },
              { icon: Heart, label: 'Empathetic Care', color: 'text-red-500' },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-muted-foreground bg-muted/50 rounded-lg p-2"
              >
                <feature.icon className={cn("h-4 w-4", feature.color)} />
                <span>{feature.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Consultation Options */}
          <div className="space-y-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={startVideoConsultation}
                disabled={isLoading}
                size="lg"
                className={cn("w-full bg-gradient-to-r text-white shadow-lg h-14 text-lg", doctorInfo.gradient)}
              >
                {isLoading && mode === 'video' ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Connecting Video...
                  </>
                ) : (
                  <>
                    <Video className="h-5 w-5 mr-2" />
                    Start Video Consultation
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={startVoiceConsultation}
                disabled={isLoading}
                size="lg"
                variant="outline"
                className="w-full h-14 text-lg border-2"
              >
                {isLoading && mode === 'voice' ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Connecting Voice...
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5 mr-2" />
                    Start Voice Consultation
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          <p className="text-xs text-muted-foreground">
            Video requires Tavus setup. Voice uses ElevenLabs AI.
          </p>

          <Button
            variant="ghost"
            onClick={onEndCall}
            className="w-full"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Video consultation screen
  const renderVideoScreen = () => (
    <motion.div
      key="video"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col"
    >
      {conversationUrl ? (
        <div className="flex-1 flex flex-col gap-4">
          <Card className="flex-1 overflow-hidden shadow-2xl">
            <CardContent className="p-0 h-full min-h-[500px]">
              <iframe
                src={conversationUrl}
                className="w-full h-full min-h-[500px]"
                allow="camera; microphone; autoplay; fullscreen"
                allowFullScreen
              />
            </CardContent>
          </Card>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 bg-card/80 backdrop-blur-lg rounded-2xl p-4"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="lg"
                className="rounded-full h-14 w-14"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant={!isVideoOn ? "destructive" : "secondary"}
                size="lg"
                className="rounded-full h-14 w-14"
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="destructive"
                size="lg"
                className="rounded-full px-8 h-14"
                onClick={endVideoConsultation}
              >
                <PhoneOff className="h-5 w-5 mr-2" />
                End Call
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full h-14 w-14"
                onClick={openInNewTab}
              >
                <ExternalLink className="h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Initializing video...</p>
        </div>
      )}
    </motion.div>
  );

  // Voice consultation screen
  const renderVoiceScreen = () => (
    <motion.div
      key="voice"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden bg-card/80 backdrop-blur-lg border-border">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className={cn("absolute -top-32 -right-32 w-64 h-64 rounded-full bg-gradient-to-br opacity-20 blur-3xl", doctorInfo.gradient)}
            animate={{
              scale: elevenLabsConversation.isSpeaking ? [1, 1.3, 1] : [1, 1.1, 1],
              opacity: elevenLabsConversation.isSpeaking ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className={cn("absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-br opacity-20 blur-3xl", doctorInfo.gradient)}
            animate={{
              scale: elevenLabsConversation.isSpeaking ? [1.3, 1, 1.3] : [1.1, 1, 1.1],
              opacity: elevenLabsConversation.isSpeaking ? [0.3, 0.2, 0.3] : [0.15, 0.1, 0.15],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <CardContent className="relative p-8 space-y-6">
          {/* Header with Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className={cn("p-2 rounded-xl bg-gradient-to-br", doctorInfo.gradient)}
                animate={elevenLabsConversation.isSpeaking ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Waves className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-foreground">{doctorInfo.name}</h3>
                <p className="text-xs text-muted-foreground">{doctorInfo.specialty}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="default" className={cn(
                "flex items-center gap-2",
                isConnected ? "bg-green-500" : "bg-yellow-500"
              )}>
                <motion.div 
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                {elevenLabsConversation.isSpeaking ? 'Speaking' : isConnected ? 'Live' : 'Connecting'}
              </Badge>
              {isConnected && (
                <Badge variant="outline" className="flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3" />
                  {formatDuration(sessionDuration)}
                </Badge>
              )}
            </div>
          </div>

          {/* Main Visualizer */}
          <div className="py-8">
            <VoiceWaveformVisualizer
              isActive={isConnected}
              isSpeaking={elevenLabsConversation.isSpeaking}
              isListening={isConnected && !elevenLabsConversation.isSpeaking}
              gradient={doctorInfo.gradient}
              mascotIcon={DoctorIcon}
              doctorName={doctorInfo.name}
            />
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Shield, label: 'Encrypted', value: 'End-to-end' },
              { icon: Brain, label: 'AI Model', value: 'ElevenLabs' },
              { icon: Volume2, label: 'Audio', value: 'HD Quality' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/50 rounded-xl p-3 text-center"
              >
                <item.icon className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xs font-medium">{item.value}</p>
              </motion.div>
            ))}
          </div>

          {voiceError && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg"
            >
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{voiceError}</span>
            </motion.div>
          )}

          {/* Conversation Tips */}
          <motion.div
            className="bg-primary/5 border border-primary/20 rounded-xl p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-center text-muted-foreground">
              {elevenLabsConversation.isSpeaking 
                ? "🎧 Listening to your AI doctor's response..." 
                : isConnected 
                  ? "🎤 Speak naturally - I'm listening and will respond." 
                  : "⏳ Preparing your voice consultation..."}
            </p>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full h-14 w-14"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="destructive"
                size="lg"
                className="rounded-full px-10 h-14 shadow-lg"
                onClick={endVoiceConsultation}
              >
                <PhoneOff className="h-5 w-5 mr-2" />
                End Call
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full h-14 w-14"
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/80 backdrop-blur-lg border-b border-border p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            className={cn("p-3 rounded-2xl bg-gradient-to-br", doctorInfo.gradient)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <DoctorIcon className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h2 className="font-bold text-lg text-foreground">{doctorInfo.name}</h2>
            <p className="text-sm text-muted-foreground">{doctorInfo.specialty}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Badge variant="default" className="flex items-center gap-2 bg-green-500/20 text-green-600 border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <Clock className="h-3 w-3" />
                {formatDuration(sessionDuration)}
              </Badge>
            </motion.div>
          )}
          <Badge variant={isConnected ? "default" : "secondary"} className={isConnected ? "bg-green-500" : ""}>
            {isLoading ? "Connecting..." : isConnected ? "Live" : "Ready"}
          </Badge>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {mode === 'selection' && !isConnected && renderSelectionScreen()}
          {mode === 'video' && isConnected && renderVideoScreen()}
          {mode === 'voice' && renderVoiceScreen()}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-muted/50 backdrop-blur-lg border-t border-border p-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-500" />
            <span>End-to-end encrypted • HIPAA compliant • Your data is protected</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TavusVideoConsultation;
