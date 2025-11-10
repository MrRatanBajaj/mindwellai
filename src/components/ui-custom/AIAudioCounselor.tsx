import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSessionRecording } from '@/hooks/useSessionRecording';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageCircle, 
  Heart,
  Sparkles,
  Phone,
  PhoneOff,
  Clock,
  Users,
  Brain,
  Check
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAudioCounselorProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAudioCounselor: React.FC<AIAudioCounselorProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [isFreeTrial, setIsFreeTrial] = useState(true);
  
  const { startSession: startSessionRecording, endSession: endSessionRecording, addMessage } = useSessionRecording(
    'audio',
    'Dr. Alex AI',
    'Mental Health Specialist - CBT/DBT Expert'
  );
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setIsPlaying(false);
      setIsSpeaking(false);
    };

    return () => {
      cleanup();
    };
  }, []);

  // Session timer effect
  useEffect(() => {
    if (sessionActive && isFreeTrial) {
      sessionTimerRef.current = setInterval(() => {
        setSessionTime(prev => {
          const newTime = prev + 1;
          // 30 minutes = 1800 seconds
          if (newTime >= 1800) {
            endSession();
            toast({
              title: "Free Session Ended",
              description: "Your 30-minute free session has ended. Thank you for using our service!",
            });
            return 1800;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [sessionActive, isFreeTrial]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = () => {
    return 1800 - sessionTime; // 30 minutes - elapsed time
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
  };

  const startSession = async () => {
    try {
      // Start database recording
      await startSessionRecording();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      streamRef.current = stream;
      setSessionActive(true);
      setSessionTime(0);
      
      // Welcome message
      const welcomeMessage = "Hello! I'm Dr. Alex, your AI mental health counselor. I'm trained in evidence-based therapy techniques including CBT and DBT. This is your free 30-minute session. How are you feeling today, and what would you like to talk about?";
      await speakText(welcomeMessage);
      
      setMessages([{
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      }]);
      
      // Save to database
      await addMessage('assistant', welcomeMessage);

      toast({
        title: "Free Session Started",
        description: "AI counselor is ready - 30 minutes available",
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive"
      });
    }
  };

  const endSession = async () => {
    // End database recording
    await endSessionRecording();
    
    cleanup();
    setSessionActive(false);
    setIsRecording(false);
    setIsPlaying(false);
    setIsSpeaking(false);
    setMessages([]);
    setConversationHistory([]);
    onClose();
    
    toast({
      title: "Session Ended",
      description: "Take care of yourself",
    });
  };

  const startRecording = async () => {
    if (!streamRef.current || !sessionActive) return;

    try {
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not start recording",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert to base64 for speech-to-text
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Speech to text
      const { data: sttData, error: sttError } = await supabase.functions.invoke('speech-to-text', {
        body: { audio: base64Audio }
      });

      if (sttError) throw sttError;

      const userMessage = sttData.text;
      if (!userMessage || userMessage.trim().length === 0) {
        toast({
          title: "No Speech Detected",
          description: "Please try speaking more clearly",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      // Add user message to chat
      const newUserMessage: Message = {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newUserMessage]);
      
      // Save to database
      await addMessage('user', userMessage);

      // Get AI response
      const { data: aiData, error: aiError } = await supabase.functions.invoke('ai-audio-counselor', {
        body: { 
          message: userMessage,
          conversationHistory 
        }
      });

      if (aiError) throw aiError;

      const aiResponse = aiData.response;
      const newConversationHistory = aiData.conversationHistory;

      // Add AI message to chat
      const newAiMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAiMessage]);
      setConversationHistory(newConversationHistory);
      
      // Save to database
      await addMessage('assistant', aiResponse);

      // Speak the AI response
      await speakText(aiResponse);

    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Processing Error",
        description: "Could not process your message",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      // Primary: Try OpenAI TTS (more reliable)
      console.log('Attempting OpenAI TTS for text:', text.substring(0, 50) + '...');
      const { data, error } = await supabase.functions.invoke('openai-tts', {
        body: { 
          text, 
          voice: 'nova', // Professional, warm female voice
          model: 'tts-1-hd' // High quality model
        }
      });

      if (!error && data) {
        console.log('OpenAI TTS successful');
        return await processTTSResponse(data);
      }

      console.warn('OpenAI TTS failed, trying ElevenLabs fallback:', error);
      
      // Fallback: Try ElevenLabs (may fail due to API limits)
      try {
        const fallbackResult = await supabase.functions.invoke('elevenlabs-tts', {
          body: { text, voice: 'sarah' }
        });
        
        if (!fallbackResult.error && fallbackResult.data) {
          console.log('ElevenLabs TTS successful');
          return await processTTSResponse(fallbackResult.data);
        }
        
        console.warn('ElevenLabs TTS also failed:', fallbackResult.error);
        throw new Error('Both TTS services failed');
        
      } catch (fallbackError) {
        console.error('ElevenLabs fallback failed:', fallbackError);
        throw fallbackError;
      }

    } catch (error) {
      console.error('All TTS attempts failed:', error);
      setIsSpeaking(false);
      
      // Show user-friendly error and continue with text-only
      toast({
        title: "Voice Synthesis Unavailable",
        description: "Continuing with text-only conversation. Your messages are still being processed!",
        variant: "default"
      });
    }
  };

  const processTTSResponse = async (data: any) => {
    try {
      const audioContent = data.audioContent;
      const audioBlob = new Blob([
        Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))
      ], { type: 'audio/mpeg' });

      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (playError) {
      console.error('Audio playback error:', playError);
      setIsSpeaking(false);
      toast({
        title: "Playback Error",
        description: "Audio generated but couldn't play - check your speakers",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <Card className="h-full border-0">
            <CardHeader className="bg-gradient-to-r from-mindwell-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Heart className="w-6 h-6" />
                    </div>
                    {isSpeaking && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute -inset-2 bg-white/30 rounded-full"
                      />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      AI Mental Health Counselor
                      <Brain className="w-5 h-5" />
                    </CardTitle>
                    <p className="text-white/80 text-sm">Dr. Alex - CBT/DBT Trained • Two-Way Communication</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {sessionActive && isFreeTrial && (
                    <div className="text-center">
                      <Badge variant="secondary" className="bg-green-500 text-white mb-1">
                        <Clock className="w-3 h-3 mr-1" />
                        FREE SESSION
                      </Badge>
                      <div className="text-sm font-mono">
                        {formatTime(getRemainingTime())} left
                      </div>
                    </div>
                  )}
                  {sessionActive && (
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                      Live
                    </Badge>
                  )}
                  <Button
                    onClick={endSession}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <PhoneOff className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 h-96 overflow-hidden flex flex-col">
              {!sessionActive ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-mindwell-100 to-blue-100 rounded-full flex items-center justify-center relative">
                      <Sparkles className="w-12 h-12 text-mindwell-600" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-800 mb-2">
                        Start Your Free 30-Minute Session
                      </h3>
                      <p className="text-slate-600 mb-4 max-w-md mx-auto">
                        Connect with Dr. Alex, your AI mental health counselor trained in CBT and DBT techniques.
                        Experience real-time two-way voice conversation.
                      </p>
                      
                      {/* Features */}
                      <div className="grid grid-cols-2 gap-3 mb-6 max-w-sm mx-auto">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <MessageCircle className="w-4 h-4 text-mindwell-600" />
                          <span>Voice Chat</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Brain className="w-4 h-4 text-mindwell-600" />
                          <span>AI Therapist</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Clock className="w-4 h-4 text-mindwell-600" />
                          <span>30 Min Free</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Users className="w-4 h-4 text-mindwell-600" />
                          <span>Confidential</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={startSession}
                        size="lg"
                        className="bg-gradient-to-r from-mindwell-500 to-blue-600 hover:from-mindwell-600 hover:to-blue-700"
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        Start Free Session
                      </Button>
                      <p className="text-xs text-slate-500 mt-2">
                        No registration required • Completely private
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-mindwell-500 text-white' 
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                      {/* Controls */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-center gap-6">
                          {/* Enhanced Recording Button with Visual Feedback */}
                          <div className="relative">
                            <motion.div
                              animate={isRecording ? { 
                                scale: [1, 1.1, 1],
                                boxShadow: [
                                  "0 0 0 0 rgba(239, 68, 68, 0.4)",
                                  "0 0 0 20px rgba(239, 68, 68, 0)",
                                  "0 0 0 0 rgba(239, 68, 68, 0)"
                                ]
                              } : {}}
                              transition={isRecording ? { 
                                duration: 1.5, 
                                repeat: Infinity 
                              } : {}}
                              className="relative"
                            >
                              <Button
                                onMouseDown={startRecording}
                                onMouseUp={stopRecording}
                                onTouchStart={startRecording}
                                onTouchEnd={stopRecording}
                                disabled={isProcessing || isPlaying}
                                size="lg"
                                className={`relative px-8 py-4 text-lg font-semibold transition-all duration-300 ${
                                  isRecording 
                                    ? 'bg-red-500 hover:bg-red-600 shadow-2xl scale-110' 
                                    : 'bg-mindwell-500 hover:bg-mindwell-600'
                                }`}
                              >
                                <motion.div
                                  animate={isRecording ? { rotate: 360 } : {}}
                                  transition={isRecording ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                                  className="mr-3"
                                >
                                  {isRecording ? (
                                    <MicOff className="w-6 h-6" />
                                  ) : (
                                    <Mic className="w-6 h-6" />
                                  )}
                                </motion.div>
                                {isRecording ? 'Release to Send' : 'Hold to Speak'}
                              </Button>
                            </motion.div>
                            
                            {/* Audio Visualizer */}
                            {isRecording && (
                              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    animate={{ 
                                      height: [4, 16, 4],
                                      opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ 
                                      duration: 0.8, 
                                      repeat: Infinity,
                                      delay: i * 0.1
                                    }}
                                    className="w-1 bg-red-400 rounded-full"
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Enhanced Status Indicators */}
                          <div className="flex flex-col items-center gap-2">
                            <AnimatePresence>
                              {isProcessing && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="flex items-center gap-2 text-mindwell-600"
                                >
                                  <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-mindwell-500 border-t-transparent rounded-full"
                                  />
                                  <span className="text-sm font-medium">Processing...</span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            
                            <AnimatePresence>
                              {isSpeaking && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="flex items-center gap-2 text-green-600"
                                >
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                  >
                                    <Volume2 className="w-5 h-5" />
                                  </motion.div>
                                  <span className="text-sm font-medium">Dr. Alex is speaking...</span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        
                        <motion.p 
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-center text-xs text-slate-500 mt-4"
                        >
                          Hold the microphone button and speak your thoughts
                        </motion.p>
                      </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAudioCounselor;