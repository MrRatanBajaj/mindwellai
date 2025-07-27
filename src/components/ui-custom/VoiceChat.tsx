import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceChatProps {
  sessionId?: string;
  onSessionEnd?: () => void;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ sessionId, onSessionEnd }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [participants, setParticipants] = useState<number>(0);
  const { toast } = useToast();
  
  const channelRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const connect = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Request microphone access
      streamRef.current = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });

      // Create a unique channel for this voice chat session
      const channelName = sessionId || `voice-chat-${Date.now()}`;
      
      channelRef.current = supabase.channel(channelName, {
        config: {
          presence: { key: 'user' }
        }
      });

      // Set up presence tracking
      channelRef.current
        .on('presence', { event: 'sync' }, () => {
          const presences = channelRef.current.presenceState();
          setParticipants(Object.keys(presences).length);
        })
        .on('presence', { event: 'join' }, ({ newPresences }: any) => {
          console.log('User joined:', newPresences);
          toast({
            title: "User joined",
            description: "Someone joined the voice chat",
          });
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }: any) => {
          console.log('User left:', leftPresences);
          toast({
            title: "User left",
            description: "Someone left the voice chat",
          });
        })
        .on('broadcast', { event: 'voice-data' }, ({ payload }: any) => {
          // Handle incoming voice data
          console.log('Received voice data:', payload);
        })
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            // Track user presence
            await channelRef.current.track({
              user_id: 'anonymous-user',
              online_at: new Date().toISOString(),
              status: 'in-call'
            });
            
            setIsConnected(true);
            setConnectionStatus('connected');
            setIsListening(true);
            
            toast({
              title: "Connected to voice chat",
              description: "You can now start talking",
            });
          }
        });

    } catch (error) {
      console.error('Error connecting to voice chat:', error);
      toast({
        title: "Connection failed",
        description: "Unable to access microphone or connect to voice chat",
        variant: "destructive",
      });
      setConnectionStatus('disconnected');
    }
  };

  const disconnect = async () => {
    if (channelRef.current) {
      await channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setIsListening(false);
    setParticipants(0);
    
    toast({
      title: "Disconnected",
      description: "Voice chat session ended",
    });
    
    onSessionEnd?.();
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
      
      toast({
        title: isMuted ? "Unmuted" : "Muted",
        description: isMuted ? "You are now unmuted" : "You are now muted",
      });
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Voice Chat</span>
          <div className={`flex items-center gap-2 ${getStatusColor()}`}>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
              connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
              'bg-gray-500'
            }`} />
            <span className="text-sm">
              {connectionStatus === 'connected' ? `${participants} users` : 
               connectionStatus === 'connecting' ? 'Connecting...' : 
               'Disconnected'}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Connect to start a voice chat session with real-time communication.
            </p>
            <Button 
              onClick={connect} 
              disabled={connectionStatus === 'connecting'}
              className="w-full hover-scale"
            >
              {connectionStatus === 'connecting' ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </div>
              ) : (
                <>
                  <Phone className="h-4 w-4 mr-2" />
                  Start Voice Chat
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="lg"
                onClick={toggleMute}
                className="hover-scale"
              >
                {isMuted ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Mute
                  </>
                )}
              </Button>
              
              <Button
                variant="destructive"
                size="lg"
                onClick={disconnect}
                className="hover-scale"
              >
                <PhoneOff className="h-5 w-5 mr-2" />
                End Call
              </Button>
            </div>
            
            {isListening && !isMuted && (
              <div className="flex items-center justify-center space-x-2 text-green-500 animate-pulse">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">Listening...</span>
                <div className="flex space-x-1">
                  {[1, 2, 3].map((bar) => (
                    <div
                      key={bar}
                      className="w-1 bg-green-500 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 16 + 8}px`,
                        animationDelay: `${bar * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {isMuted && (
              <div className="flex items-center justify-center space-x-2 text-red-500">
                <VolumeX className="h-4 w-4" />
                <span className="text-sm">Microphone muted</span>
              </div>
            )}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground text-center">
          Voice chat uses real-time communication for instant feedback and support.
        </div>
      </CardContent>
    </Card>
  );
};