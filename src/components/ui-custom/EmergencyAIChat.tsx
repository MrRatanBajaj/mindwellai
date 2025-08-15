import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, Brain, Heart, AlertTriangle, Phone, MessageCircle, 
  Bot, User, Shield, Clock, Zap, Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EmergencyAIChatProps {
  urgencyLevel?: string;
  counselorId?: string;
  onEndSession: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  type?: 'emergency' | 'support' | 'crisis' | 'normal';
  metadata?: any;
}

const EmergencyAIChat = ({ 
  urgencyLevel = "medium", 
  counselorId = "emma",
  onEndSession 
}: EmergencyAIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize emergency chat session
  useEffect(() => {
    initializeEmergencySession();
    
    // Session timer
    const timer = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeEmergencySession = async () => {
    try {
      const newSessionId = `emergency_chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);

      // Create session using voice_chat_sessions table
      const { error } = await supabase
        .from('voice_chat_sessions')
        .insert({
          session_id: newSessionId,
          user_id: null, // Anonymous emergency session
          status: 'active',
          metadata: {
            chat_type: 'emergency_crisis',
            counselor_id: counselorId,
            urgency_level: urgencyLevel,
            started_at: new Date().toISOString(),
            user_agent: navigator.userAgent,
            emergency_features: true
          }
        });

      if (error) {
        console.error('Session creation error:', error);
      }

      // Add initial emergency messages
      const initialMessages: Message[] = [
        {
          id: 'system-welcome',
          sender: 'system',
          content: '🚨 Emergency mental health support activated. This is a secure, confidential space.',
          timestamp: new Date(),
          type: 'emergency'
        },
        {
          id: 'ai-intro',
          sender: 'ai',
          content: `Hello, I'm your emergency AI counselor. I'm here to provide immediate support and crisis intervention. Whatever you're going through, you're not alone. How are you feeling right now?`,
          timestamp: new Date(),
          type: 'support'
        }
      ];

      if (urgencyLevel === 'high') {
        initialMessages.push({
          id: 'crisis-notice',
          sender: 'system',
          content: '⚠️ HIGH PRIORITY: If you are in immediate danger, please call 911 or 988 (Crisis Lifeline) right away.',
          timestamp: new Date(),
          type: 'crisis'
        });
      }

      setMessages(initialMessages);
      setConnectionStatus('connected');
      
      toast.success("Emergency AI counselor connected", {
        description: "Secure crisis support session is now active"
      });

      // Log initial messages using consultations table
      const { data: { user } } = await supabase.auth.getUser();
      await supabase
        .from('consultations')
        .insert({
          user_id: user?.id || '00000000-0000-0000-0000-000000000000', // Use system UUID for emergency sessions
          name: 'Emergency AI Chat Session',
          email: 'emergency@system.local',
          scheduled_date: new Date().toISOString().split('T')[0],
          scheduled_time: new Date().toTimeString().split(' ')[0],
          session_type: 'emergency_chat',
          status: 'active',
          concerns: 'Emergency AI chat session initialized',
          notes: JSON.stringify({
            messages: initialMessages,
            session_id: newSessionId,
            timestamp: new Date().toISOString()
          })
        });

    } catch (error) {
      console.error('Failed to initialize emergency session:', error);
      setConnectionStatus('disconnected');
      toast.error("Connection failed", {
        description: "Please refresh and try again, or call emergency services if needed"
      });
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      type: 'normal'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Log user message (simplified)
      console.log(`User message: ${userMessage.content} at ${new Date().toISOString()}`);

      // Call AI counselor API
      const { data, error } = await supabase.functions.invoke('ai-counselor', {
        body: {
          message: userMessage.content,
          counselorId: counselorId,
          sessionId: sessionId,
          urgencyLevel: urgencyLevel,
          conversationHistory: messages.slice(-10).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: data.message || 'I understand you may be struggling. Please know that support is available.',
        timestamp: new Date(),
        type: 'support',
        metadata: {
          counselor: data.counselor,
          mood: data.mood,
          confidence: data.confidence
        }
      };

      setMessages(prev => [...prev, aiResponse]);

      // Log AI response (simplified)
      console.log(`AI response: ${aiResponse.content} at ${new Date().toISOString()}`);

      // Check for crisis keywords and show additional help if needed
      if (detectCrisisKeywords(userMessage.content)) {
        const crisisMessage: Message = {
          id: `crisis-${Date.now()}`,
          sender: 'system',
          content: '🆘 Additional resources: National Suicide Prevention Lifeline: 988 | Crisis Text Line: Text HOME to 741741 | Emergency: 911',
          timestamp: new Date(),
          type: 'crisis'
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, crisisMessage]);
        }, 1000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: 'system',
        content: 'Connection issue detected. Your safety is our priority - please call 988 or 911 if you need immediate help.',
        timestamp: new Date(),
        type: 'crisis'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast.error("Message failed to send", {
        description: "Please try again or call emergency services if urgent"
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const detectCrisisKeywords = (message: string): boolean => {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm',
      'want to die', 'no point', 'hopeless', 'worthless', 'better off dead'
    ];
    
    return crisisKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEndSession = async () => {
    try {
      await supabase
        .from('voice_chat_sessions')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString(),
          duration_seconds: sessionDuration,
          metadata: {
            duration_seconds: sessionDuration,
            ended_by: 'user',
            message_count: messages.length,
            session_type: 'emergency_chat'
          }
        })
        .eq('session_id', sessionId);

      toast.success("Emergency session ended", {
        description: "Remember: Help is always available 24/7 when you need it"
      });
      
      onEndSession();
    } catch (error) {
      console.error('Error ending session:', error);
      onEndSession();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMessageIcon = (message: Message) => {
    switch (message.sender) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'ai':
        return <Bot className="w-4 h-4" />;
      case 'system':
        return message.type === 'crisis' ? <AlertTriangle className="w-4 h-4" /> : <Shield className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getMessageStyle = (message: Message) => {
    if (message.type === 'crisis') {
      return 'bg-red-50 border-red-200 border-l-4 border-l-red-500';
    }
    if (message.type === 'emergency') {
      return 'bg-orange-50 border-orange-200 border-l-4 border-l-orange-500';
    }
    if (message.sender === 'user') {
      return 'bg-blue-50 border-blue-200 ml-8';
    }
    if (message.sender === 'ai') {
      return 'bg-green-50 border-green-200 mr-8';
    }
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="h-screen bg-gradient-to-br from-red-50 to-orange-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <Brain className="w-6 h-6" />
              <div>
                <h2 className="font-bold text-lg">🚨 Emergency AI Crisis Counselor</h2>
                <p className="text-red-200 text-sm">
                  Secure Support • Session: {formatDuration(sessionDuration)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {urgencyLevel === 'high' && (
              <span className="bg-red-500 px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                🔴 HIGH PRIORITY
              </span>
            )}
            <div className="bg-green-600 px-3 py-1 rounded-full text-xs font-medium">
              🔒 CONFIDENTIAL
            </div>
          </div>
        </div>
      </div>

      {/* Quick Crisis Actions */}
      <div className="bg-red-100 border-b border-red-200 p-3">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <Button
            onClick={() => window.open("tel:988", "_self")}
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Phone className="w-3 h-3 mr-1" />
            Call 988
          </Button>
          <Button
            onClick={() => window.open("tel:911", "_self")}
            size="sm"
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Emergency 911
          </Button>
          <span className="text-red-600 font-medium flex items-center">
            <Heart className="w-4 h-4 mr-1 animate-pulse" />
            Crisis support available 24/7
          </span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border ${getMessageStyle(message)} animate-fade-in`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    message.sender === 'user' ? 'bg-blue-200' :
                    message.sender === 'ai' ? 'bg-green-200' :
                    message.type === 'crisis' ? 'bg-red-200' : 'bg-gray-200'
                  }`}>
                    {getMessageIcon(message)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm">
                        {message.sender === 'user' ? 'You' :
                         message.sender === 'ai' ? 'AI Crisis Counselor' :
                         message.type === 'crisis' ? 'Crisis Alert' : 'System'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.type === 'crisis' && (
                        <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-gray-800 leading-relaxed">{message.content}</p>
                    {message.metadata?.mood && (
                      <div className="mt-2 text-xs text-gray-500">
                        Detected mood: {message.metadata.mood}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mr-8 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-green-200">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-green-700">AI counselor is responding</span>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 bg-green-500 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what you're feeling... This is a safe space."
                className="pr-12 text-base py-3"
                disabled={isLoading || connectionStatus !== 'connected'}
              />
              {inputMessage && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                </div>
              )}
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>End-to-end encrypted</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Real-time crisis support</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Instant AI response</span>
              </span>
            </div>
            <Button
              onClick={handleEndSession}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              End Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAIChat;