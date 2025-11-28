import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Loader2, Heart, Brain, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import AIAvatar from './AIAvatar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIVoiceTherapist() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioElementRef.current = new Audio();
    audioElementRef.current.onended = () => setIsSpeaking(false);

    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, []);

  const startSession = () => {
    setSessionActive(true);
    setSessionTime(0);
    setMessages([]);
    
    sessionTimerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    toast({
      title: "Session Started",
      description: "Dr. Maya is here to listen. Tap the microphone to speak.",
    });
  };

  const endSession = () => {
    setSessionActive(false);
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
    
    toast({
      title: "Session Ended",
      description: `Session duration: ${Math.floor(sessionTime / 60)}m ${sessionTime % 60}s`,
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Listening",
        description: "Speak now. Tap again when finished.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      // Convert audio to base64 for speech-to-text
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error('Failed to process audio');
        }

        // Speech to text
        const { data: transcriptData, error: transcriptError } = await supabase.functions.invoke(
          'speech-to-text',
          { body: { audio: base64Audio } }
        );

        if (transcriptError) throw transcriptError;

        const userMessage = transcriptData.text;
        const userMsg: Message = {
          role: 'user',
          content: userMessage,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMsg]);

        // Get AI response
        const conversationHistory = messages.map(m => ({
          role: m.role,
          content: m.content
        }));

        const { data: aiData, error: aiError } = await supabase.functions.invoke(
          'ai-voice-therapist',
          { 
            body: { 
              message: userMessage,
              conversationHistory 
            } 
          }
        );

        if (aiError) throw aiError;

        const assistantMsg: Message = {
          role: 'assistant',
          content: aiData.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMsg]);

        // Text to speech
        await speakText(aiData.response);
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Processing Error",
        description: "Could not process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);

      const { data, error } = await supabase.functions.invoke('openai-tts', {
        body: { 
          text,
          voice: 'nova',
          model: 'tts-1'
        }
      });

      if (error) throw error;

      // Convert base64 to audio
      const audioData = atob(data.audioContent);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioElementRef.current) {
        audioElementRef.current.src = audioUrl;
        audioElementRef.current.play();
      }
    } catch (error) {
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
      toast({
        title: "Audio Error",
        description: "Could not play audio response.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            Your AI Companion
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Always here to listen and talk. Dr. Maya cares about your mental wellbeing
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Avatar Section - Main Focus */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <AIAvatar
              name="Dr. Maya"
              specialty="Mental Health & Emotional Wellbeing"
              mood={
                isRecording ? "focused" :
                isSpeaking ? "empathetic" :
                messages.length > 0 ? "calm" : "empathetic"
              }
              isActive={sessionActive}
              isSpeaking={isSpeaking}
              className="w-full"
            />

            {/* Quick Stats */}
            {sessionActive && (
              <Card className="glass-panel border-white/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span className="text-muted-foreground">Session Time</span>
                    </div>
                    <span className="font-semibold text-foreground">{formatTime(sessionTime)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-500" />
                      <span className="text-muted-foreground">Messages</span>
                    </div>
                    <span className="font-semibold text-foreground">{messages.length}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-panel p-4 text-center border-white/20"
              >
                <Brain className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Evidence-Based</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-panel p-4 text-center border-white/20"
              >
                <Heart className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Empathetic</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-panel p-4 text-center border-white/20"
              >
                <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Private</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Chat Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-panel border-white/20 h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Conversation</CardTitle>
                  {sessionActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={endSession}
                      disabled={isRecording || isProcessing}
                    >
                      End Session
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                {!sessionActive ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-8">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                    >
                      <Heart className="w-12 h-12 text-white" />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        Ready to talk?
                      </h3>
                      <p className="text-muted-foreground max-w-sm">
                        I'm here whenever you need someone to listen. Your thoughts matter.
                      </p>
                    </div>
                    <Button 
                      size="lg" 
                      onClick={startSession} 
                      className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Heart className="w-5 h-5" />
                      Start Conversation
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Messages */}
                    <div className="flex-1 space-y-4 overflow-y-auto max-h-96 pr-2">
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground text-sm">
                            Tap the microphone to start speaking...
                          </p>
                        </div>
                      ) : (
                        <AnimatePresence>
                          {messages.map((msg, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                                  msg.role === 'user'
                                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                                    : 'bg-white dark:bg-slate-800 text-foreground border border-border/50'
                                }`}
                              >
                                <p className="text-xs font-medium mb-1 opacity-70">
                                  {msg.role === 'user' ? 'You' : 'Dr. Maya'}
                                </p>
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      )}
                    </div>

                    {/* Voice Controls */}
                    <div className="flex flex-col items-center gap-4 pt-4 border-t border-border/50">
                      {/* Status */}
                      <AnimatePresence mode="wait">
                        {isRecording && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-rose-500">Listening to you...</span>
                          </motion.div>
                        )}
                        {isProcessing && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                          >
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                            <span className="text-sm font-medium text-blue-500">Thinking...</span>
                          </motion.div>
                        )}
                        {isSpeaking && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                          >
                            <Volume2 className="w-4 h-4 animate-pulse text-purple-500" />
                            <span className="text-sm font-medium text-purple-500">Dr. Maya is speaking...</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Mic Button */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          variant={isRecording ? "destructive" : "default"}
                          onClick={isRecording ? stopRecording : startRecording}
                          disabled={isProcessing || isSpeaking}
                          className={`rounded-full w-16 h-16 shadow-lg ${
                            !isRecording && 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                          }`}
                        >
                          {isRecording ? (
                            <MicOff className="w-7 h-7" />
                          ) : (
                            <Mic className="w-7 h-7" />
                          )}
                        </Button>
                      </motion.div>

                      <p className="text-xs text-muted-foreground text-center">
                        {isRecording ? 'Tap to stop recording' : 'Tap to speak'}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Crisis Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/20">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-center text-muted-foreground">
                <strong className="text-rose-600 dark:text-rose-400">Crisis Support:</strong> If you're experiencing a mental health emergency, please call your local emergency services or crisis hotline immediately.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
