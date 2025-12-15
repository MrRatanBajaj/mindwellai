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
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface TavusVideoConsultationProps {
  doctorType?: 'general' | 'dermatologist' | 'mental_health';
  onEndCall: () => void;
}

interface DoctorInfo {
  name: string;
  specialty: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const DOCTOR_INFO: Record<string, DoctorInfo> = {
  general: {
    name: 'Dr. Sarah',
    specialty: 'General Physician',
    icon: Stethoscope,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  dermatologist: {
    name: 'Dr. Michael',
    specialty: 'Dermatologist',
    icon: User,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  mental_health: {
    name: 'Dr. Emma',
    specialty: 'Mental Health Counselor',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
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
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-full", doctorInfo.bgColor)}>
            <DoctorIcon className={cn("h-5 w-5", doctorInfo.color)} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{doctorInfo.name}</h2>
            <p className="text-sm text-muted-foreground">{doctorInfo.specialty}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isConnected && (
            <Badge variant="default" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(sessionDuration)}
            </Badge>
          )}
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isLoading ? "Connecting..." : isConnected ? "In Session" : "Ready"}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex items-center justify-center">
        {!isConnected ? (
          // Pre-connection Screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg"
          >
            <Card className="p-8 bg-card border-border">
              <CardContent className="space-y-6 p-0">
                {/* Doctor Avatar */}
                <div className={cn(
                  "w-32 h-32 rounded-full mx-auto flex items-center justify-center",
                  doctorInfo.bgColor
                )}>
                  <DoctorIcon className={cn("h-16 w-16", doctorInfo.color)} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground">{doctorInfo.name}</h2>
                  <p className="text-muted-foreground">{doctorInfo.specialty}</p>
                </div>

                <p className="text-muted-foreground">
                  Start a video consultation with our AI healthcare professional. 
                  They will guide you through your health concerns and provide helpful advice.
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Video className="h-4 w-4 text-primary" />
                    <span>HD Video Call</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Empathetic Care</span>
                  </div>
                </div>

                <Button
                  onClick={startConsultation}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Video className="h-5 w-5 mr-2" />
                      Start Video Consultation
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={onEndCall}
                  className="w-full"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          // Connected Screen with iframe or link
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col"
          >
            {conversationUrl ? (
              <div className="flex-1 flex flex-col gap-4">
                {/* Video Embed */}
                <Card className="flex-1 overflow-hidden">
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
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full h-14 w-14"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full h-14 w-14"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>

                  <Button
                    variant="destructive"
                    size="lg"
                    className="rounded-full px-8"
                    onClick={endConsultation}
                  >
                    <PhoneOff className="h-5 w-5 mr-2" />
                    End Call
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                    onClick={openInNewTab}
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-muted-foreground">Initializing video...</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer Notice */}
      <div className="bg-muted/50 border-t border-border p-4">
        <p className="text-xs text-center text-muted-foreground max-w-2xl mx-auto">
          <strong>Important:</strong> This is an AI-powered consultation for informational purposes only. 
          It does not replace professional medical advice, diagnosis, or treatment. 
          For emergencies, please call your local emergency services immediately.
        </p>
      </div>
    </div>
  );
};

export default TavusVideoConsultation;
