
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, MessageCircle, Heart, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: 'supportive' | 'empathetic' | 'encouraging' | 'understanding';
}

const MentalHealthChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm here to provide mental health support and guidance. How are you feeling today? Feel free to share what's on your mind.",
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'supportive'
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Mental health trained responses database
  const mentalHealthResponses = {
    anxiety: [
      "I understand that anxiety can feel overwhelming. Let's try some grounding techniques. Can you name 5 things you can see around you right now?",
      "Anxiety is very common and treatable. What specific situations tend to trigger your anxiety the most?",
      "Remember, you're safe right now. Try taking slow, deep breaths with me. Breathe in for 4 counts, hold for 4, and out for 4."
    ],
    depression: [
      "I hear you, and I want you to know that what you're feeling is valid. Depression can make everything feel harder, but you're not alone.",
      "Small steps matter. Have you been able to do any self-care activities today, even something as simple as drinking water or stepping outside?",
      "It takes courage to reach out. That shows incredible strength, even when you might not feel strong right now."
    ],
    stress: [
      "Stress can really impact our daily lives. What are the main sources of stress you're dealing with right now?",
      "Let's work on some stress management techniques. Have you tried progressive muscle relaxation or mindfulness exercises?",
      "It sounds like you're carrying a lot right now. What would help you feel more supported?"
    ],
    general: [
      "Thank you for sharing that with me. How has this been affecting your daily life?",
      "I'm here to listen and support you. Can you tell me more about what you're experiencing?",
      "That sounds really challenging. You're taking a positive step by talking about it.",
      "What kind of support feels most helpful to you right now?"
    ],
    encouragement: [
      "You're showing real strength by seeking help and talking about your feelings.",
      "Every small step forward is progress, even when it doesn't feel like it.",
      "Remember, healing isn't linear. It's okay to have difficult days.",
      "You deserve support and care. Thank you for trusting me with your feelings."
    ]
  };

  const detectEmotion = (message: string): 'supportive' | 'empathetic' | 'encouraging' | 'understanding' => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('hopeless')) {
      return 'empathetic';
    }
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('scared')) {
      return 'understanding';
    }
    if (lowerMessage.includes('better') || lowerMessage.includes('good') || lowerMessage.includes('thanks')) {
      return 'encouraging';
    }
    return 'supportive';
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
      return mentalHealthResponses.anxiety[Math.floor(Math.random() * mentalHealthResponses.anxiety.length)];
    }
    
    if (lowerMessage.includes('depressed') || lowerMessage.includes('sad') || lowerMessage.includes('hopeless')) {
      return mentalHealthResponses.depression[Math.floor(Math.random() * mentalHealthResponses.depression.length)];
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
      return mentalHealthResponses.stress[Math.floor(Math.random() * mentalHealthResponses.stress.length)];
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('better') || lowerMessage.includes('help')) {
      return mentalHealthResponses.encouragement[Math.floor(Math.random() * mentalHealthResponses.encouragement.length)];
    }
    
    return mentalHealthResponses.general[Math.floor(Math.random() * mentalHealthResponses.general.length)];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time (1-3 seconds for realism)
    const thinkingTime = Math.random() * 2000 + 1000;
    
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const emotion = detectEmotion(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        emotion
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, thinkingTime);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case 'empathetic': return <Heart className="w-4 h-4 text-red-400" />;
      case 'encouraging': return <Brain className="w-4 h-4 text-green-400" />;
      case 'understanding': return <MessageCircle className="w-4 h-4 text-blue-400" />;
      default: return <Bot className="w-4 h-4 text-mindwell-500" />;
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-mindwell-500 hover:bg-mindwell-600 text-white rounded-full p-3 shadow-lg animate-pulse"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 animate-scale-in">
      {/* Chat Header */}
      <div className="bg-mindwell-500 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-mindwell-500" />
          </div>
          <div>
            <h3 className="font-semibold">MindwellAI Assistant</h3>
            <p className="text-xs opacity-90">Mental Health Support</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMinimized(true)}
          className="text-white hover:bg-mindwell-600"
        >
          ×
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex animate-fade-in",
              message.sender === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[80%] p-3 rounded-lg",
              message.sender === 'user'
                ? "bg-mindwell-500 text-white rounded-br-none"
                : "bg-slate-100 text-slate-800 rounded-bl-none"
            )}>
              {message.sender === 'ai' && (
                <div className="flex items-center space-x-1 mb-1">
                  {getEmotionIcon(message.emotion)}
                  <span className="text-xs text-slate-500">AI Therapist</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className={cn(
                "text-xs mt-1",
                message.sender === 'user' ? "text-mindwell-100" : "text-slate-400"
              )}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-slate-100 text-slate-800 p-3 rounded-lg rounded-bl-none max-w-[80%]">
              <div className="flex items-center space-x-1">
                <Bot className="w-4 h-4 text-mindwell-500" />
                <span className="text-xs text-slate-500">AI Therapist is typing</span>
              </div>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts and feelings..."
            className="flex-1 text-sm"
            disabled={isTyping}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-mindwell-500 hover:bg-mindwell-600 text-white px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          This AI is trained on mental health data for support
        </p>
      </div>
    </div>
  );
};

export default MentalHealthChat;
