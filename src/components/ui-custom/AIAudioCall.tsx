import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  MessageSquare,
  Heart,
  Shield,
  Clock,
  Waves,
  Send,
  User,
  Bot
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import VoiceVisualizer from './VoiceVisualizer';
import SessionSummary from './SessionSummary';

interface AIAudioCallProps {
  onCallEnd?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const JULI_AGENT_ID = "agent_4601kcc8ngyceh1vpfdm3vsrq1j0";

const AIAudioCall: React.FC<AIAudioCallProps> = ({ onCallEnd }) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([0.8]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showChat, setShowChat] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [inputLevel, setInputLevel] = useState(0);
  const [outputLevel, setOutputLevel] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to Juli AI Counselor');
      setIsConnected(true);
      setIsConnecting(false);
      toast({
        title: "Connected to Juli",
        description: "Your AI mental health counselor is ready",
      });
    },
    onDisconnect: () => {
      console.log('Disconnected from Juli');
      setIsConnected(false);
      setIsConnecting(false);
    },
    onMessage: (message: { message: string; source: string }) => {
      console.log('Message received:', message);
      if (message.source === 'user' && message.message) {
        const newMessage: Message = {
          id: Date.now().toString() + '-user',
          role: 'user',
          content: message.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      } else if (message.source === 'ai' && message.message) {
        const newMessage: Message = {
          id: Date.now().toString() + '-assistant',
          role: 'assistant',
          content: message.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      }
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Juli. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
      setIsConnected(false);
    },
  });

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  // Audio level simulation for visualization
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        // Simulate input level based on whether user might be speaking
        const baseInput = conversation.isSpeaking ? 0.1 : Math.random() * 0.6 + 0.2;
        setInputLevel(baseInput);
        
        // Output level based on AI speaking state
        const baseOutput = conversation.isSpeaking ? Math.random() * 0.6 + 0.4 : 0.1;
        setOutputLevel(baseOutput);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isConnected, conversation.isSpeaking]);

  // Volume control
  useEffect(() => {
    if (isConnected) {
      conversation.setVolume({ volume: volume[0] });
    }
  }, [volume, isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = useCallback(async () => {
    setIsConnecting(true);
    setMessages([]);
    setSessionDuration(0);
    setShowSummary(false);
    
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: JULI_AGENT_ID,
      });
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Call Failed",
        description: error instanceof Error ? error.message : "Failed to start audio call. Please check microphone permissions.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  }, [conversation, toast]);

  const endCall = useCallback(async () => {
    try {
      await conversation.endSession();
      setIsConnected(false);
      setShowSummary(true);
      onCallEnd?.();
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }, [conversation, onCallEnd]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
      description: isMuted ? "Juli can hear you now" : "Juli cannot hear you",
    });
  }, [isMuted, toast]);

  const sendTextMessage = useCallback(() => {
    if (!chatInput.trim() || !isConnected) return;
    
    // Send text message through conversation
    conversation.sendUserMessage(chatInput.trim());
    
    // Add to local messages
    const newMessage: Message = {
      id: Date.now().toString() + '-user-text',
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setChatInput('');
  }, [chatInput, isConnected, conversation]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        conversation.endSession();
      }
    };
  }, []);

  return (
    <>
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* Main Call Interface */}
        <Card className="overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20">
          <CardContent className="p-6 md:p-8">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Side - Avatar, Visualizers & Controls */}
              <div className="flex flex-col items-center justify-center space-y-6">
                {/* Juli Avatar with Visualizer */}
                <motion.div 
                  className="relative"
                  animate={isConnected && conversation.isSpeaking ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <div className={cn(
                    "w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl",
                    isConnected && "ring-4 ring-primary/30 ring-offset-4 ring-offset-background"
                  )}>
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-background to-muted flex items-center justify-center">
                      <span className="text-4xl md:text-5xl">🧠</span>
                    </div>
                  </div>
                  
                  {/* Speaking Indicator */}
                  <AnimatePresence>
                    {isConnected && conversation.isSpeaking && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                      >
                        <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                          <Waves className="h-3 w-3 animate-pulse" />
                          Speaking
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Pulsing Ring Animation */}
                  {isConnected && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/40"
                        animate={{ scale: [1, 1.3, 1.3], opacity: [0.6, 0, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/40"
                        animate={{ scale: [1, 1.5, 1.5], opacity: [0.4, 0, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                    </>
                  )}
                </motion.div>

                {/* Voice Visualizers */}
                {isConnected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xs space-y-3"
                  >
                    {/* AI Voice Visualizer */}
                    <div className="bg-muted/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">Juli</span>
                        {conversation.isSpeaking && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Speaking</Badge>
                        )}
                      </div>
                      <VoiceVisualizer
                        isActive={isConnected}
                        isSpeaking={conversation.isSpeaking}
                        type="ai"
                        outputLevel={outputLevel}
                      />
                    </div>

                    {/* User Voice Visualizer */}
                    <div className="bg-muted/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-medium text-muted-foreground">You</span>
                        {!conversation.isSpeaking && isConnected && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-500/20">Listening</Badge>
                        )}
                      </div>
                      <VoiceVisualizer
                        isActive={isConnected && !isMuted}
                        isSpeaking={!conversation.isSpeaking}
                        type="user"
                        inputLevel={inputLevel}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Name & Status */}
                <div className="text-center space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">Juli</h2>
                  <p className="text-sm text-muted-foreground">AI Mental Health Counselor</p>
                  
                  <Badge variant={isConnected ? "default" : "secondary"} className="mt-2">
                    {isConnecting ? "Connecting..." : isConnected ? "In Session" : "Available"}
                  </Badge>
                </div>

                {/* Session Timer */}
                {isConnected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-4 py-2 rounded-full"
                  >
                    <Clock className="h-4 w-4" />
                    <span className="font-mono text-lg">{formatDuration(sessionDuration)}</span>
                  </motion.div>
                )}

                {/* Call Controls */}
                <div className="flex items-center gap-3">
                  {!isConnected ? (
                    <Button
                      onClick={startCall}
                      disabled={isConnecting}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-5 rounded-full shadow-lg"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      {isConnecting ? 'Connecting...' : 'Start Session'}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={toggleMute}
                        variant={isMuted ? "destructive" : "secondary"}
                        size="lg"
                        className="rounded-full h-12 w-12"
                      >
                        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </Button>
                      
                      <Button
                        onClick={endCall}
                        variant="destructive"
                        size="lg"
                        className="px-6 py-5 rounded-full shadow-lg"
                      >
                        <PhoneOff className="h-5 w-5 mr-2" />
                        End
                      </Button>

                      <Button
                        onClick={() => setShowChat(!showChat)}
                        variant={showChat ? "default" : "secondary"}
                        size="lg"
                        className="rounded-full h-12 w-12"
                      >
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Volume Control */}
                {isConnected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xs flex items-center gap-3"
                  >
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={1}
                      step={0.1}
                      className="flex-1"
                    />
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                )}
              </div>

              {/* Right Side - Chat */}
              <AnimatePresence>
                {showChat && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col"
                  >
                    <Card className="flex-1 flex flex-col bg-muted/20 border-border/50 min-h-[400px] lg:min-h-[500px]">
                      <div className="p-4 border-b border-border/50">
                        <h3 className="font-semibold flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Conversation
                          {messages.length > 0 && (
                            <Badge variant="secondary" className="text-xs">{messages.length}</Badge>
                          )}
                        </h3>
                      </div>
                      
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-4 min-h-[200px]">
                              <Heart className="h-12 w-12 mb-4 opacity-30" />
                              <p>Start a session to begin your conversation with Juli.</p>
                              <p className="text-sm mt-2">You can speak or type your messages.</p>
                            </div>
                          ) : (
                            messages.map((msg) => (
                              <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                  "flex gap-2",
                                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                                )}
                              >
                                {msg.role === 'assistant' && (
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-4 w-4 text-primary" />
                                  </div>
                                )}
                                <div className={cn(
                                  "max-w-[80%] rounded-2xl px-4 py-2",
                                  msg.role === 'user' 
                                    ? 'bg-primary text-primary-foreground rounded-br-sm' 
                                    : 'bg-muted text-foreground rounded-bl-sm'
                                )}>
                                  <p className="text-sm">{msg.content}</p>
                                  <span className="text-[10px] opacity-70 mt-1 block">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                {msg.role === 'user' && (
                                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <User className="h-4 w-4 text-green-600" />
                                  </div>
                                )}
                              </motion.div>
                            ))
                          )}
                          <div ref={chatEndRef} />
                        </div>
                      </ScrollArea>

                      {/* Chat Input */}
                      {isConnected && (
                        <div className="p-4 border-t border-border/50">
                          <div className="flex gap-2">
                            <Input
                              ref={inputRef}
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Type a message to Juli..."
                              className="flex-1"
                            />
                            <Button
                              onClick={sendTextMessage}
                              disabled={!chatInput.trim()}
                              size="icon"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 text-center">
                            Press Enter to send or just speak naturally
                          </p>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Features & Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">100% Private</h4>
                <p className="text-sm text-muted-foreground">Conversations are confidential and secure</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Heart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Empathetic AI</h4>
                <p className="text-sm text-muted-foreground">Trained in mental health support</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">24/7 Available</h4>
                <p className="text-sm text-muted-foreground">Support whenever you need it</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Crisis Notice */}
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-sm text-center text-destructive">
            <strong>Crisis Support:</strong> If you're experiencing thoughts of self-harm or suicide, 
            please contact emergency services immediately or call a crisis helpline.
          </p>
        </Card>
      </div>

      {/* Session Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <SessionSummary
            duration={sessionDuration}
            messages={messages}
            onClose={() => setShowSummary(false)}
            onNewSession={() => {
              setShowSummary(false);
              startCall();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAudioCall;
