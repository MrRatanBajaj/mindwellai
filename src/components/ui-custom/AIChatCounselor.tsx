import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Mic, MicOff, Brain, Heart, Lightbulb, 
  BookOpen, Smile, AlertCircle, Calendar, Clock,
  ThumbsUp, ThumbsDown, Copy, Download, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'exercise' | 'resource' | 'insight';
  metadata?: {
    mood?: string;
    confidence?: number;
    suggestions?: string[];
  };
}

interface AIChatCounselorProps {
  counselorName?: string;
  specialty?: string;
  sessionId?: string;
  onEndSession?: () => void;
  className?: string;
}

const AIChatCounselor = ({
  counselorName = "Dr. Emma AI",
  specialty = "Cognitive Behavioral Therapy Specialist",
  sessionId,
  onEndSession,
  className
}: AIChatCounselorProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm ${counselorName}, your AI mental health counselor. I'm here to provide you with personalized support using evidence-based therapeutic approaches. What's on your mind today?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Session timer
    const timer = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Analyze user mood (simplified)
    const lowerMessage = userMessage.toLowerCase();
    let detectedMood = "neutral";
    let responseType: Message['type'] = 'text';
    let aiContent = "";

    if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('panic')) {
      detectedMood = "anxious";
      aiContent = "I can hear that you're feeling anxious right now. Anxiety is a very common experience, and there are effective ways to manage it. Let's try a quick grounding technique: Can you name 5 things you can see around you right now?";
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      detectedMood = "sad";
      aiContent = "Thank you for sharing how you're feeling. It takes courage to acknowledge when we're struggling. These feelings are valid, and you're not alone. What's one small thing that usually brings you even a tiny bit of comfort?";
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
      detectedMood = "angry";
      aiContent = "I can sense your frustration, and that's completely understandable. Anger often tells us that something important to us has been threatened or violated. Let's explore what might be underneath this anger. What do you think triggered these feelings?";
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
      detectedMood = "stressed";
      responseType = 'exercise';
      aiContent = "It sounds like you're dealing with a lot of stress right now. Stress can feel overwhelming, but we can work together to develop coping strategies. Would you like to try a brief breathing exercise to help you feel more centered?";
    } else {
      const responses = [
        "That's an important insight. Can you tell me more about how that makes you feel?",
        "I hear what you're saying. It sounds like this is really significant for you. What thoughts come up when you reflect on this?",
        "Thank you for sharing that with me. What do you think would be most helpful to explore about this situation?",
        "That's a very human experience you're describing. Many people face similar challenges. How has this been affecting your daily life?",
        "I appreciate your openness in sharing this. What strengths do you think you have that might help you navigate this situation?"
      ];
      aiContent = responses[Math.floor(Math.random() * responses.length)];
    }

    setCurrentMood(detectedMood);

    return {
      id: Date.now().toString(),
      content: aiContent,
      sender: 'ai',
      timestamp: new Date(),
      type: responseType,
      metadata: {
        mood: detectedMood,
        confidence: 0.85,
        suggestions: responseType === 'exercise' ? ['Breathing Exercise', 'Progressive Relaxation', 'Mindfulness'] : []
      }
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast.error("I'm having trouble responding right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.info("Voice input activated. Speak now...");
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false);
        toast.success("Voice input captured");
      }, 3000);
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'anxious': return 'text-orange-600 bg-orange-50';
      case 'sad': return 'text-blue-600 bg-blue-50';
      case 'angry': return 'text-red-600 bg-red-50';
      case 'stressed': return 'text-purple-600 bg-purple-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getAIAvatar = (mood?: string) => {
    switch (mood) {
      case 'anxious': return '🤗';
      case 'sad': return '💙';
      case 'angry': return '🤲';
      case 'stressed': return '🧘';
      default: return '🤖';
    }
  };

  return (
    <div className={cn("flex flex-col h-[80vh] max-w-4xl mx-auto", className)}>
      {/* Header */}
      <Card className="glass-panel border-white/20 mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mindwell-400 to-mindwell-600 flex items-center justify-center text-xl">
                {getAIAvatar(currentMood)}
              </div>
              <div>
                <CardTitle className="text-lg">{counselorName}</CardTitle>
                <p className="text-sm text-slate-600">{specialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {currentMood && (
                <Badge className={getMoodColor(currentMood)}>
                  Current mood: {currentMood}
                </Badge>
              )}
              <div className="text-right">
                <div className="text-sm font-medium">{formatDuration(sessionDuration)}</div>
                <div className="text-xs text-slate-500">Session time</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 glass-panel border-white/20 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3",
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'ai' && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-mindwell-400 to-mindwell-600 text-white text-sm">
                      {getAIAvatar(message.metadata?.mood)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={cn(
                  "max-w-[80%] rounded-2xl p-4",
                  message.sender === 'user' 
                    ? 'bg-mindwell-500 text-white' 
                    : 'bg-white border border-slate-200'
                )}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                    {message.type && message.type !== 'text' && (
                      <Badge variant="outline" className="text-xs">
                        {message.type === 'exercise' && <Heart className="w-3 h-3 mr-1" />}
                        {message.type === 'insight' && <Lightbulb className="w-3 h-3 mr-1" />}
                        {message.type === 'resource' && <BookOpen className="w-3 h-3 mr-1" />}
                        {message.type}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.metadata?.suggestions && message.metadata.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.metadata.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => setInputValue(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {message.sender === 'ai' && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Helpful
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {message.sender === 'user' && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-slate-500 text-white text-sm">
                      👤
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-gradient-to-br from-mindwell-400 to-mindwell-600 text-white text-sm">
                    🤖
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="w-4 h-4 text-mindwell-500" />
                    </motion.div>
                    <span className="text-sm text-slate-600">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="min-h-[60px] max-h-32 resize-none pr-12"
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleListening}
                className={cn(
                  "absolute right-2 top-2 h-8 w-8 p-0",
                  isListening && "text-red-500"
                )}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="h-[60px] bg-mindwell-500 hover:bg-mindwell-600"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue("I'm feeling anxious today")}
              className="text-xs h-7"
            >
              I'm anxious
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue("I'm having trouble sleeping")}
              className="text-xs h-7"
            >
              Sleep issues
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue("I need coping strategies")}
              className="text-xs h-7"
            >
              Need coping help
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue("Can we do a breathing exercise?")}
              className="text-xs h-7"
            >
              Breathing exercise
            </Button>
          </div>
        </div>
      </Card>

      {/* Session actions */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="w-4 h-4" />
          Session: {formatDuration(sessionDuration)}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Session
          </Button>
          <Button variant="outline" size="sm" onClick={onEndSession}>
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatCounselor;