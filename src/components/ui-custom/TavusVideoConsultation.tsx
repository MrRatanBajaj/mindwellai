import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  User,
  Stethoscope,
  Heart,
  Brain,
  Clock,
  Shield,
  Loader2,
  ExternalLink,
  Activity,
  Baby,
  Apple,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface TavusVideoConsultationProps {
  doctorType?: 'general' | 'dermatologist' | 'mental_health' | 'cardiologist' | 'pediatrician' | 'neurologist' | 'gynecologist' | 'nutritionist';
  onEndCall: () => void;
}

interface DoctorInfo {
  name: string;
  specialty: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  gradient: string;
  description: string;
}

const DOCTOR_INFO: Record<string, DoctorInfo> = {
  general: {
    name: 'Dr. Sarah',
    specialty: 'General Physician',
    icon: Stethoscope,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Expert in general health consultations and preventive care',
  },
  dermatologist: {
    name: 'Dr. Michael',
    specialty: 'Dermatologist',
    icon: Sparkles,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    gradient: 'from-amber-500 to-orange-600',
    description: 'Specialist in skin health, hair, and cosmetic concerns',
  },
  mental_health: {
    name: 'Dr. Emma',
    specialty: 'Mental Health Counselor',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    gradient: 'from-purple-500 to-purple-600',
    description: 'Compassionate support for anxiety, depression, and emotional wellness',
  },
  cardiologist: {
    name: 'Dr. James',
    specialty: 'Cardiologist',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    gradient: 'from-red-500 to-rose-600',
    description: 'Expert in heart health and cardiovascular wellness',
  },
  pediatrician: {
    name: 'Dr. Lily',
    specialty: 'Pediatrician',
    icon: Baby,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    gradient: 'from-pink-500 to-pink-600',
    description: 'Caring specialist for children\'s health and development',
  },
  neurologist: {
    name: 'Dr. Nathan',
    specialty: 'Neurologist',
    icon: Activity,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    gradient: 'from-indigo-500 to-indigo-600',
    description: 'Expert in brain and nervous system health',
  },
  gynecologist: {
    name: 'Dr. Maya',
    specialty: 'Gynecologist',
    icon: User,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
    gradient: 'from-rose-500 to-pink-600',
    description: 'Specialist in women\'s reproductive health and wellness',
  },
  nutritionist: {
    name: 'Dr. Sophie',
    specialty: 'Nutritionist',
    icon: Apple,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    gradient: 'from-green-500 to-emerald-600',
    description: 'Expert in dietary health and nutrition planning',
  },
};

const TavusVideoConsultation: React.FC<TavusVideoConsultationProps> = ({
  doctorType = 'general',
  onEndCall,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [personaId, setPersonaId] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const doctorInfo = DOCTOR_INFO[doctorType] || DOCTOR_INFO.general;
  const DoctorIcon = doctorInfo.icon;

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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startConsultation = useCallback(async () => {
    setIsLoading(true);
    try {
      // Step 1: Create or get persona
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
      const createdPersonaId = personaData?.persona_id;
      
      if (!createdPersonaId) {
        throw new Error('No persona ID returned');
      }
      
      setPersonaId(createdPersonaId);

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

      if (!conversationData?.conversation_url) {
        throw new Error('No conversation URL returned');
      }

      setConversationId(conversationData.conversation_id);
      setConversationUrl(conversationData.conversation_url);
      setIsConnected(true);

      toast({
        title: "Consultation Ready",
        description: `You're connected with ${doctorInfo.name}`,
      });

    } catch (error) {
      console.error('Error starting consultation:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to start video consultation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [doctorType, doctorInfo.name, toast]);

  const endConsultation = useCallback(async () => {
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

  const openInNewTab = () => {
    if (conversationUrl) {
      window.open(conversationUrl, '_blank', 'noopener,noreferrer');
    }
  };

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
          {!isConnected ? (
            // Pre-connection Screen
            <motion.div
              key="pre-connection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-xl w-full"
            >
              <Card className="p-8 bg-card/80 backdrop-blur-lg border-border overflow-hidden relative">
                {/* Animated background */}
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
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      { icon: Video, label: 'HD Video Call', color: 'text-blue-500' },
                      { icon: Shield, label: 'Secure & Private', color: 'text-green-500' },
                      { icon: Brain, label: 'AI-Powered', color: 'text-purple-500' },
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

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={startConsultation}
                      disabled={isLoading}
                      size="lg"
                      className={cn("w-full bg-gradient-to-r text-white shadow-lg h-14 text-lg", doctorInfo.gradient)}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Connecting to {doctorInfo.name}...
                        </>
                      ) : (
                        <>
                          <Video className="h-5 w-5 mr-2" />
                          Start Video Consultation
                        </>
                      )}
                    </Button>
                  </motion.div>

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
          ) : (
            // Connected Screen with iframe
            <motion.div
              key="connected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col"
            >
              {conversationUrl ? (
                <div className="flex-1 flex flex-col gap-4">
                  {/* Video Embed */}
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

                  {/* Controls */}
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
                        onClick={endConsultation}
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
          )}
        </AnimatePresence>
      </div>

      {/* Footer Notice */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-muted/50 backdrop-blur-lg border-t border-border p-4"
      >
        <p className="text-xs text-center text-muted-foreground max-w-2xl mx-auto">
          <strong>Important:</strong> This is an AI-powered consultation for informational purposes only. 
          It does not replace professional medical advice, diagnosis, or treatment. 
          For emergencies, please call your local emergency services immediately.
        </p>
      </motion.div>
    </div>
  );
};

export default TavusVideoConsultation;
