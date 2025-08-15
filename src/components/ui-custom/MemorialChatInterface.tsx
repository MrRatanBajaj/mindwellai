import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, Mic, MicOff, Volume2, Heart, ArrowLeft, 
  Play, Pause, Loader2, MessageCircle, Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface MemorialProfile {
  id: string;
  name: string;
  relationship: string;
  biography?: string;
  personality_traits?: string[];
  profile_image_url?: string;
  conversation_style?: string;
  ai_model_preference?: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  sender_type: 'user' | 'memorial';
  content: string;
  audio_url?: string;
  created_at: string;
  ai_response_metadata?: any;
}

interface ChatSession {
  id: string;
  memorial_id: string;
  session_name?: string;
  created_at: string;
}

interface MemorialChatInterfaceProps {
  memorial: MemorialProfile;
  onBack: () => void;
}

const MemorialChatInterface: React.FC<MemorialChatInterfaceProps> = ({ memorial, onBack }) => {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    startChatSession();
  }, [memorial]);

  useEffect(() => {
    if (currentSession) {
      loadChatMessages();
      setupRealtimeSubscription();
    }
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startChatSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: session, error } = await supabase
        .from('memorial_chat_sessions')
        .insert({
          user_id: user.id,
          memorial_id: memorial.id,
          session_name: `Chat with ${memorial.name}`
        })
        .select()
        .single();

      if (error) throw error;
      setCurrentSession(session);
    } catch (error) {
      console.error('Error starting chat session:', error);
      toast({
        title: 'Error',
        description: 'Failed to start chat session',
        variant: 'destructive'
      });
    }
  };

  const loadChatMessages = async () => {
    if (!currentSession) return;

    try {
      const { data: messages, error } = await supabase
        .from('memorial_chat_messages')
        .select('*')
        .eq('session_id', currentSession.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((messages || []) as ChatMessage[]);
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!currentSession) return;

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'memorial_chat_messages',
          filter: `session_id=eq.${currentSession.id}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
          setIsLoadingResponse(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentSession) return;

    const userMessage = newMessage;
    setNewMessage('');
    setIsLoadingResponse(true);

    // Add user message to UI immediately
    const tempUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender_type: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      // Save user message to database
      const { error: userError } = await supabase
        .from('memorial_chat_messages')
        .insert({
          session_id: currentSession.id,
          sender_type: 'user',
          content: userMessage
        });

      if (userError) throw userError;

      // Generate AI response
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('memorial-chat', {
        body: {
          message: userMessage,
          memorialId: memorial.id,
          sessionId: currentSession.id
        }
      });

      if (aiError) throw aiError;

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
      setIsLoadingResponse(false);
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Convert audio to text using speech-to-text
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.wav');
          
          const { data, error } = await supabase.functions.invoke('speech-to-text', {
            body: formData
          });

          if (error) throw error;
          
          if (data.text) {
            setNewMessage(data.text);
          }
        } catch (error) {
          console.error('Speech-to-text error:', error);
          toast({
            title: 'Speech Recognition Failed',
            description: 'Could not convert speech to text',
            variant: 'destructive'
          });
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access to send voice messages',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = (audioUrl: string, messageId: string) => {
    if (playingAudio === messageId) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingAudio(null);
      }
      return;
    }

    // Play new audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(audioUrl);
    audioRef.current.onended = () => setPlayingAudio(null);
    audioRef.current.play();
    setPlayingAudio(messageId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col">
      {/* Header */}
      <Card className="border-0 shadow-lg mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={memorial.profile_image_url} />
                  <AvatarFallback className="bg-rose-100 text-rose-600">
                    {memorial.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{memorial.name}</span>
                    <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <span>{memorial.relationship}</span>
                    <Badge variant="secondary" className="text-xs">
                      {memorial.conversation_style || 'warm'}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-slate-600">
                Memorial created {formatDistanceToNow(new Date(memorial.created_at))} ago
              </div>
              {memorial.personality_traits && (
                <div className="flex flex-wrap gap-1 mt-1 justify-end">
                  {memorial.personality_traits.slice(0, 3).map((trait) => (
                    <Badge key={trait} variant="outline" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col border-0 shadow-lg">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-slate-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Start a conversation with {memorial.name}</p>
                  <p className="text-sm">Share your thoughts, ask questions, or just say hello</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.sender_type === 'user'
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    
                    {message.audio_url && (
                      <div className="mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => playAudio(message.audio_url!, message.id)}
                          className={message.sender_type === 'user' ? 'text-white hover:bg-rose-600' : 'hover:bg-slate-200'}
                        >
                          {playingAudio === message.id ? (
                            <Pause className="w-4 h-4 mr-1" />
                          ) : (
                            <Play className="w-4 h-4 mr-1" />
                          )}
                          Listen
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className={`text-xs ${
                        message.sender_type === 'user' ? 'text-rose-100' : 'text-slate-500'
                      }`}>
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatDistanceToNow(new Date(message.created_at))} ago
                      </div>
                      
                      {message.ai_response_metadata?.emotion && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-white/20"
                        >
                          {message.ai_response_metadata.emotion}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoadingResponse && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-lg px-4 py-3 flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                    <span className="text-sm text-slate-600">{memorial.name} is typing...</span>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-slate-50">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  placeholder={`Send a message to ${memorial.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoadingResponse}
                  className="pr-12"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isLoadingResponse}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoadingResponse}
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {isRecording && (
              <div className="flex items-center justify-center mt-2 text-sm text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                Recording... Speak now
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemorialChatInterface;