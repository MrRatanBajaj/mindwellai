import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Loader2, Heart, Brain, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold text-foreground">AI Voice Therapist</h1>
          <p className="text-muted-foreground">
            Have a natural conversation with Dr. Maya, your AI mental health counselor
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <Brain className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Evidence-Based</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Trained in CBT, DBT, and mindfulness techniques
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <Heart className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Compassionate</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Non-judgmental support in a safe space
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <Shield className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Private & Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your conversations are confidential and secure
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Session Interface */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Therapy Session</CardTitle>
              {sessionActive && (
                <span className="text-sm text-muted-foreground">
                  {formatTime(sessionTime)}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!sessionActive ? (
              <div className="text-center space-y-4 py-8">
                <p className="text-muted-foreground">
                  Ready to start your therapy session?
                </p>
                <Button size="lg" onClick={startSession} className="gap-2">
                  <Heart className="w-5 h-5" />
                  Start Session
                </Button>
              </div>
            ) : (
              <>
                {/* Conversation History */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-primary/10 ml-8'
                            : 'bg-muted mr-8'
                        }`}
                      >
                        <p className="text-sm font-medium mb-1">
                          {msg.role === 'user' ? 'You' : 'Dr. Maya'}
                        </p>
                        <p className="text-foreground">{msg.content}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Voice Controls */}
                <div className="flex flex-col items-center gap-4">
                  {/* Status Indicator */}
                  <AnimatePresence mode="wait">
                    {isRecording && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 text-destructive"
                      >
                        <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Recording...</span>
                      </motion.div>
                    )}
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 text-primary"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">Processing...</span>
                      </motion.div>
                    )}
                    {isSpeaking && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 text-primary"
                      >
                        <Volume2 className="w-4 h-4 animate-pulse" />
                        <span className="text-sm font-medium">Dr. Maya is speaking...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Microphone Button */}
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing || isSpeaking}
                    className="rounded-full w-20 h-20"
                  >
                    {isRecording ? (
                      <MicOff className="w-8 h-8" />
                    ) : (
                      <Mic className="w-8 h-8" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={endSession}
                    disabled={isRecording || isProcessing}
                  >
                    End Session
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Crisis Notice */}
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-muted-foreground">
              <strong>Crisis Support:</strong> If you're in immediate danger, please call your
              local emergency services or crisis hotline immediately.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
