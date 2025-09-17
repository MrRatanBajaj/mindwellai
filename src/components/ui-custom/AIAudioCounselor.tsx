import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageCircle, 
  Heart,
  Sparkles,
  Phone,
  PhoneOff
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
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
  };

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      streamRef.current = stream;
      setSessionActive(true);
      
      // Welcome message
      const welcomeMessage = "Hello! I'm Dr. Alex, your AI counselor. I'm here to listen and support you. How are you feeling today?";
      await speakText(welcomeMessage);
      
      setMessages([{
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      }]);

      toast({
        title: "Session Started",
        description: "AI counselor is ready to help",
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

  const endSession = () => {
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
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { text, voice: 'sarah' }
      });

      if (error) throw error;

      const audioContent = data.audioContent;
      const audioBlob = new Blob([
        Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))
      ], { type: 'audio/mpeg' });

      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Could not generate speech",
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
                    <CardTitle className="text-xl">AI Audio Counselor</CardTitle>
                    <p className="text-white/80 text-sm">Dr. Alex - Mental Health Support</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {sessionActive && (
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                      Live Session
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
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-mindwell-100 to-blue-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-mindwell-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-800 mb-2">
                        Start Your Audio Session
                      </h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        Connect with Dr. Alex, your AI counselor, for supportive conversation and mental health guidance.
                      </p>
                      <Button
                        onClick={startSession}
                        size="lg"
                        className="bg-gradient-to-r from-mindwell-500 to-blue-600 hover:from-mindwell-600 hover:to-blue-700"
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        Start Session
                      </Button>
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
                    <div className="flex items-center justify-center gap-4">
                      {/* Recording Button */}
                      <Button
                        onMouseDown={startRecording}
                        onMouseUp={stopRecording}
                        onTouchStart={startRecording}
                        onTouchEnd={stopRecording}
                        disabled={isProcessing || isPlaying}
                        size="lg"
                        className={`relative ${
                          isRecording 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-mindwell-500 hover:bg-mindwell-600'
                        }`}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="w-5 h-5 mr-2" />
                            Release to Send
                          </>
                        ) : (
                          <>
                            <Mic className="w-5 h-5 mr-2" />
                            Hold to Speak
                          </>
                        )}
                        
                        {isRecording && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="absolute -inset-1 bg-red-400/30 rounded-lg"
                          />
                        )}
                      </Button>

                      {/* Status Indicators */}
                      <div className="flex items-center gap-2">
                        {isProcessing && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <div className="w-4 h-4 border-2 border-mindwell-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Processing...</span>
                          </div>
                        )}
                        
                        {isSpeaking && (
                          <div className="flex items-center gap-2 text-green-600">
                            <Volume2 className="w-4 h-4" />
                            <span className="text-sm">Dr. Alex is speaking...</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-center text-xs text-slate-500 mt-3">
                      Hold the microphone button and speak your thoughts
                    </p>
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