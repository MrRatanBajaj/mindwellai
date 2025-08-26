import React, { useState, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIAudioCallProps {
  onCallEnd?: () => void;
}

const AIAudioCall: React.FC<AIAudioCallProps> = ({ onCallEnd }) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [micPermission, setMicPermission] = useState<boolean>(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      toast({
        title: "Connected",
        description: "AI counselor is ready to talk",
      });
      setIsConnecting(false);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setConversationId(null);
      setIsConnecting(false);
    },
    onMessage: (message) => {
      console.log('Message received:', message);
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI counselor",
        variant: "destructive",
      });
      setIsConnecting(false);
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `You are a compassionate AI mental health counselor. Your role is to:
          - Listen actively and empathetically to users
          - Provide emotional support and validation
          - Offer coping strategies and stress management techniques
          - Help users process their feelings and thoughts
          - Suggest when professional help might be beneficial
          - Maintain a warm, non-judgmental tone
          - Keep conversations focused on mental wellness
          
          Always prioritize the user's safety and wellbeing. If someone expresses thoughts of self-harm, encourage them to seek immediate professional help.`
        },
        firstMessage: "Hello, I'm here to listen and support you today. How are you feeling right now?",
        language: "en",
      },
      tts: {
        voiceId: "EXAVITQu4vr4xnSDxMaL" // Sarah - a warm, empathetic voice
      },
    },
  });

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to start the audio call",
        variant: "destructive",
      });
      return false;
    }
  };

  const startCall = async () => {
    setIsConnecting(true);
    
    try {
      // Request microphone permission first
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        setIsConnecting(false);
        return;
      }

      // Get signed URL from Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('elevenlabs-voice-agent', {
        body: { action: 'create_session' }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.signed_url) {
        throw new Error('Failed to get signed URL');
      }

      // Start conversation with agentId (for public agents)
      // For development, use a placeholder agentId - in production you need to create an agent in ElevenLabs
      const newConversationId = await conversation.startSession({ 
        agentId: data.agent_id || "development-agent" 
      });
      
      setConversationId(newConversationId);
      
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Call Failed",
        description: error instanceof Error ? error.message : "Failed to start audio call",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const endCall = async () => {
    try {
      await conversation.endSession();
      setConversationId(null);
      onCallEnd?.();
      
      toast({
        title: "Call Ended",
        description: "Audio call has been ended",
      });
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  const toggleVolume = async (volume: number) => {
    try {
      await conversation.setVolume({ volume });
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (conversationId) {
        conversation.endSession();
      }
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Phone className="h-5 w-5" />
          AI Audio Counselor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Connection Status */}
          <div className="text-center">
            {isConnecting && (
              <p className="text-sm text-muted-foreground">Connecting...</p>
            )}
            {conversationId && !isConnecting && (
              <p className="text-sm text-green-600">Connected - Call in progress</p>
            )}
            {!conversationId && !isConnecting && (
              <p className="text-sm text-muted-foreground">Ready to start call</p>
            )}
          </div>

          {/* Speaking Indicator */}
          {conversation.isSpeaking && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm">AI is speaking...</span>
            </div>
          )}

          {/* Call Controls */}
          <div className="flex gap-4">
            {!conversationId ? (
              <Button
                onClick={startCall}
                disabled={isConnecting}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Phone className="h-4 w-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Start Call'}
              </Button>
            ) : (
              <Button
                onClick={endCall}
                variant="destructive"
                size="lg"
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                End Call
              </Button>
            )}
          </div>

          {/* Volume Controls */}
          {conversationId && (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm text-muted-foreground">Volume</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleVolume(0.3)}
                >
                  Low
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleVolume(0.7)}
                >
                  Medium
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleVolume(1.0)}
                >
                  High
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Speak naturally - the AI will respond with voice.</p>
            <p>This is a safe space to share your thoughts and feelings.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAudioCall;