import { useState, useRef, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff } from 'lucide-react';
import { toast } from 'sonner';

interface AIVoiceChatProps {
  agentId?: string;
  onCallEnd?: () => void;
  className?: string;
}

const AIVoiceChat = ({ agentId, onCallEnd, className }: AIVoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string; content: string; timestamp: Date }>>([]);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to AI voice chat');
      setIsConnected(true);
      toast.success('Connected to AI counselor');
    },
    onDisconnect: () => {
      console.log('Disconnected from AI voice chat');
      setIsConnected(false);
      toast.info('Disconnected from AI counselor');
      onCallEnd?.();
    },
    onMessage: (message: any) => {
      console.log('Received message:', message);
      // Handle both string and object message formats
      const content = typeof message === 'string' ? message : (message.message || message.text || message.content || '');
      const source = typeof message === 'object' && message.source ? message.source : 'user';
      
      setMessages(prev => [...prev, {
        role: source === 'ai' ? 'assistant' : 'user',
        content: content,
        timestamp: new Date()
      }]);
    },
    onError: (error: any) => {
      console.error('Voice chat error:', error);
      toast.error(`Voice chat error: ${error?.message || 'Unknown error'}`);
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `You are a compassionate AI mental health counselor. Your role is to:
          - Listen actively and empathetically to users' concerns
          - Provide supportive and non-judgmental responses
          - Offer evidence-based coping strategies and techniques
          - Encourage users to seek professional help when appropriate
          - Maintain appropriate boundaries as an AI assistant
          - Use a warm, caring, and professional tone
          - Ask thoughtful follow-up questions to better understand the user's situation
          
          Remember: You are providing support and guidance, not professional medical advice. Always encourage users to consult with qualified mental health professionals for serious concerns.`
        },
        firstMessage: "Hello! I'm here to listen and support you. How are you feeling today, and what would you like to talk about?",
        language: "en"
      },
      tts: {
        voiceId: "EXAVITQu4vr4xnSDxMaL" // Sarah - calm, empathetic voice
      }
    }
  });

  const startConversation = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use provided agentId or default public agent
      const url = agentId 
        ? `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`
        : undefined;
      
      const id = await conversation.startSession({ 
        agentId: agentId || 'default_public_agent_id' // Replace with actual public agent ID
      });
      
      setConversationId(id);
      setMessages([]);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast.error('Failed to start voice chat. Please check microphone permissions.');
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      setConversationId(null);
      setMessages([]);
    } catch (error) {
      console.error('Failed to end conversation:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    conversation.setVolume({ volume: isMuted ? volume : 0 });
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (!isMuted) {
      conversation.setVolume({ volume: newVolume });
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Voice Counselor</span>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isConnected ? (
            <Button
              onClick={startConversation}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Start Voice Session
            </Button>
          ) : (
            <Button
              onClick={endConversation}
              variant="destructive"
              size="lg"
            >
              <PhoneOff className="w-5 h-5 mr-2" />
              End Session
            </Button>
          )}
        </div>

        {/* Voice Controls */}
        {isConnected && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={toggleMute}
                variant={isMuted ? "destructive" : "outline"}
                size="sm"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-24"
                />
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${conversation.isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                <span className="text-sm">AI Speaking</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mic className={`w-4 h-4 ${!isMuted ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="text-sm">Microphone</span>
              </div>
            </div>
          </div>
        )}

        {/* Conversation Display */}
        {messages.length > 0 && (
          <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground">
          {!isConnected ? (
            <p>Click "Start Voice Session" to begin talking with your AI counselor</p>
          ) : (
            <p>Speak naturally - the AI counselor is listening and will respond with voice</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIVoiceChat;