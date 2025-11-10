import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, 
  MessageCircle, Volume2, VolumeX, Sparkles, Brain,
  Activity, Heart, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useSessionRecording } from "@/hooks/useSessionRecording";

interface AIVideoConsultationProps {
  counselorName?: string;
  specialty?: string;
  onEndCall: () => void;
  className?: string;
}

const AIVideoConsultation = ({
  counselorName = "Dr. Emma AI",
  specialty = "Mental Health Specialist",
  onEndCall,
  className
}: AIVideoConsultationProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(30 * 60); // 30 minutes
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [aiMood, setAiMood] = useState("empathetic");
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const { startSession, endSession, addMessage } = useSessionRecording(
    'video',
    counselorName,
    specialty
  );
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Start recording session
    startSession();
    
    // Call duration timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
      setSessionTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(timer);
      endSession();
    };
  }, []);

  useEffect(() => {
    // Initialize audio context for visualizations
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Set up audio visualization
      if (audioContextRef.current && !analyserRef.current) {
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);
        
        const visualize = () => {
          if (!analyserRef.current) return;
          
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);
          
          animationFrameRef.current = requestAnimationFrame(visualize);
        };
        
        visualize();
      }

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioInput(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast.info("Listening... Speak now");
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setAudioLevel(0);
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      console.log('Converting speech to text...');
      
      // Convert speech to text
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const { data: transcriptData, error: transcriptError } = await supabase.functions.invoke('speech-to-text', {
        body: formData
      });

      if (transcriptError) throw transcriptError;
      
      const userText = transcriptData.text;
      console.log('User said:', userText);
      
      setCurrentTranscript(userText);
      
      // Save user message to database
      await addMessage('user', userText);
      
      // Add to conversation history
      const newHistory = [...conversationHistory, { role: 'user', content: userText }];
      setConversationHistory(newHistory);

      // Get AI response
      console.log('Getting AI counselor response...');
      const { data: aiData, error: aiError } = await supabase.functions.invoke('ai-audio-counselor', {
        body: { 
          message: userText,
          conversationHistory: newHistory
        }
      });

      if (aiError) throw aiError;

      const aiResponse = aiData.response;
      console.log('AI responded:', aiResponse);

      // Save AI response to database
      await addMessage('assistant', aiResponse);

      // Update conversation history with AI response
      setConversationHistory([...newHistory, { role: 'assistant', content: aiResponse }]);
      
      // Update AI mood based on response
      updateAIMood(aiResponse);

      // Speak the response
      await speakResponse(aiResponse);

      setCurrentTranscript("");
      
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error("Failed to process your message. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = async (text: string) => {
    try {
      setIsAISpeaking(true);
      
      console.log('Converting text to speech with ElevenLabs...');
      
      // Try ElevenLabs first (best quality)
      const { data: elevenLabsData, error: elevenLabsError } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { 
          text,
          voice: 'sarah',
          modelId: 'eleven_turbo_v2_5'
        }
      });

      if (!elevenLabsError && elevenLabsData?.audioContent) {
        console.log('ElevenLabs TTS successful');
        await playAudio(elevenLabsData.audioContent);
        return;
      }

      console.warn('ElevenLabs failed, trying OpenAI TTS fallback');
      
      // Fallback to OpenAI TTS
      const { data: openaiData, error: openaiError } = await supabase.functions.invoke('openai-tts', {
        body: { 
          text,
          voice: 'nova',
          model: 'tts-1'
        }
      });

      if (!openaiError && openaiData?.audioContent) {
        console.log('OpenAI TTS successful');
        await playAudio(openaiData.audioContent);
        return;
      }

      throw new Error('Both TTS services failed');

    } catch (error) {
      console.error('Error speaking response:', error);
      toast.error("Could not play audio response");
    } finally {
      setIsAISpeaking(false);
    }
  };

  const playAudio = async (base64Audio: string) => {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audio.onended = () => resolve(true);
        audio.onerror = () => reject(new Error('Audio playback failed'));
        audio.play();
      } catch (error) {
        reject(error);
      }
    });
  };

  const updateAIMood = (response: string) => {
    const lowerResponse = response.toLowerCase();
    if (lowerResponse.includes('understand') || lowerResponse.includes('support')) {
      setAiMood('empathetic');
    } else if (lowerResponse.includes('strength') || lowerResponse.includes('progress')) {
      setAiMood('encouraging');
    } else if (lowerResponse.includes('focus') || lowerResponse.includes('technique')) {
      setAiMood('focused');
    } else {
      setAiMood('calm');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      case "empathetic": return "from-purple-400 via-purple-500 to-purple-600";
      case "encouraging": return "from-green-400 via-green-500 to-green-600";
      case "focused": return "from-orange-400 via-orange-500 to-orange-600";
      case "calm": return "from-blue-400 via-blue-500 to-blue-600";
      default: return "from-primary via-primary to-accent";
    }
  };

  const handleEndCall = async () => {
    stopRecording();
    await endSession();
    toast.success("Session ended. Your progress has been saved.");
    onEndCall();
  };

  return (
    <div className={cn("fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white text-sm font-medium">Live Session</span>
          </div>
          <div className="text-white/60 text-sm">
            {formatDuration(callDuration)}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(sessionTimeRemaining)} Free Time
          </Badge>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        {/* AI Avatar */}
        <div className="relative z-10">
          <motion.div 
            className="relative"
            animate={isAISpeaking ? { 
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0]
            } : { scale: 1 }}
            transition={{ 
              duration: 0.8, 
              repeat: isAISpeaking ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {/* Main Avatar */}
            <div className={cn(
              "w-64 h-64 rounded-full bg-gradient-to-br flex items-center justify-center text-9xl shadow-2xl transition-all duration-1000 relative",
              getAvatarGradient(aiMood),
              isAISpeaking && "ring-8 ring-white/30 shadow-primary/50"
            )}>
              <motion.span
                key={aiMood}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {getMoodEmoji(aiMood)}
              </motion.span>

              {/* Audio Visualization Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-white"
                animate={{
                  scale: isAISpeaking ? [1, 1.1, 1] : 1,
                  opacity: isAISpeaking ? [0.3, 0.6, 0.3] : 0
                }}
                transition={{ duration: 1, repeat: isAISpeaking ? Infinity : 0 }}
              />
            </div>

            {/* Status Indicators */}
            <AnimatePresence>
              {isAISpeaking && (
                <motion.div
                  className="absolute -top-6 -right-6"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <div className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="w-8 h-8 text-primary" />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {isRecording && (
                <motion.div
                  className="absolute -bottom-6 -right-6"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <div className="w-16 h-16 bg-red-500 rounded-full shadow-2xl flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Activity className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Counselor Info Card */}
          <motion.div 
            className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-panel-dark border-white/20">
              <CardContent className="p-4 text-center">
                <h3 className="text-white font-semibold text-lg mb-1">{counselorName}</h3>
                <p className="text-white/70 text-sm mb-2">{specialty}</p>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    Pre-trained AI Model
                  </Badge>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    CBT/DBT Expert
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Current Transcript Display */}
        <AnimatePresence>
          {(currentTranscript || isProcessing) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-32 left-1/2 transform -translate-x-1/2 max-w-2xl w-full px-4"
            >
              <Card className="glass-panel-dark border-white/20">
                <CardContent className="p-4">
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-3 text-white">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5 text-primary" />
                      </motion.div>
                      <span className="text-sm">Processing your message...</span>
                    </div>
                  ) : (
                    <p className="text-white text-sm">
                      <span className="text-white/60">You: </span>
                      {currentTranscript}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/40 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={isAudioOn ? "secondary" : "destructive"}
              size="lg"
              onClick={() => setIsAudioOn(!isAudioOn)}
              className="rounded-full w-16 h-16 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
              disabled={isProcessing}
            >
              {isAudioOn ? (
                <Mic className="w-7 h-7 text-white" />
              ) : (
                <MicOff className="w-7 h-7 text-white" />
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={cn(
                "rounded-full w-20 h-20 text-white font-semibold transition-all",
                isRecording 
                  ? "bg-red-500 hover:bg-red-600 ring-4 ring-red-500/30 shadow-lg shadow-red-500/50" 
                  : "bg-primary hover:bg-accent shadow-lg shadow-primary/50"
              )}
              disabled={!isAudioOn || isProcessing}
            >
              <motion.div
                animate={isRecording ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.8, repeat: isRecording ? Infinity : 0 }}
              >
                <MessageCircle className="w-8 h-8" />
              </motion.div>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={isSpeakerOn ? "secondary" : "destructive"}
              size="lg"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className="rounded-full w-16 h-16 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
              disabled={isProcessing}
            >
              {isSpeakerOn ? (
                <Volume2 className="w-7 h-7 text-white" />
              ) : (
                <VolumeX className="w-7 h-7 text-white" />
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="destructive"
              size="lg"
              onClick={handleEndCall}
              className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50"
            >
              <PhoneOff className="w-7 h-7" />
            </Button>
          </motion.div>
        </div>

        <div className="text-center mt-4">
          <p className="text-white/60 text-sm">
            {isRecording ? "🎤 Listening..." : "Hold the center button to speak"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIVideoConsultation;