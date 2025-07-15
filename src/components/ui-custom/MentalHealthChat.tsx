
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, MessageCircle, Heart, Brain, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: 'supportive' | 'empathetic' | 'encouraging' | 'understanding' | 'professional';
  techniques?: string[];
}

const MentalHealthChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI mental health assistant, trained in evidence-based therapeutic techniques. I'm here to provide immediate support and guidance. How are you feeling today, and what would you like to talk about?",
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'supportive',
      techniques: ['Active Listening', 'Person-Centered Therapy']
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [aiPersonality, setAiPersonality] = useState<'dr-aria' | 'dr-max' | 'dr-elena'>('dr-aria');

  // Enhanced mental health responses with therapeutic techniques
  const therapeuticResponses = {
    crisis: {
      responses: [
        "I'm really concerned about you right now. Thank you for reaching out - that takes incredible courage. Can you tell me if you're somewhere safe at the moment?",
        "I hear that you're in a lot of pain right now, and I want you to know that I'm here with you. Are you having thoughts of hurting yourself?",
        "You've taken such an important step by talking to someone. Right now, let's focus on keeping you safe. Do you have someone you can call or be with?"
      ],
      techniques: ['Crisis Intervention', 'Safety Planning', 'Active Listening'],
      emotion: 'professional'
    },
    anxiety: {
      responses: [
        "Anxiety can feel overwhelming, but you're not alone in this. Let's try the 5-4-3-2-1 grounding technique: Can you name 5 things you can see right now?",
        "I understand how challenging anxiety can be. Your nervous system is trying to protect you. Let's practice some deep breathing together - breathe in for 4, hold for 4, out for 6.",
        "What you're experiencing is your body's natural alarm system. It's uncomfortable, but it's not dangerous. Can you tell me what triggered these feelings?",
        "Anxiety often comes with 'what if' thoughts. Let's challenge those together. What evidence do you have that supports or contradicts your worried thoughts?"
      ],
      techniques: ['Grounding Techniques', 'Breathing Exercises', 'Cognitive Restructuring', 'Mindfulness'],
      emotion: 'understanding'
    },
    depression: {
      responses: [
        "I hear the pain in your words, and I want you to know that what you're feeling is valid. Depression can make everything feel heavy and hopeless, but you're not alone.",
        "Even though it might not feel like it right now, reaching out shows incredible strength. Have you been able to do any small acts of self-care today?",
        "Depression can make our thoughts very harsh toward ourselves. What would you say to a good friend who was feeling the way you are right now?",
        "Sometimes when we're depressed, even basic tasks feel impossible. What's one tiny thing you could do today that might bring you a moment of comfort?"
      ],
      techniques: ['Behavioral Activation', 'Self-Compassion', 'Activity Scheduling', 'Cognitive Therapy'],
      emotion: 'empathetic'
    },
    stress: {
      responses: [
        "It sounds like you're carrying a lot right now. Stress can feel overwhelming when multiple things pile up. Let's break this down - what feels most urgent to you?",
        "Your stress response is your body trying to help you cope, but it can become exhausting. What coping strategies have helped you in the past?",
        "When we're stressed, we often focus on what we can't control. Let's identify what IS within your control right now.",
        "Stress can cloud our thinking. Let's use the STOP technique: Stop, Take a breath, Observe what's happening, and Proceed mindfully."
      ],
      techniques: ['Stress Management', 'Problem-Solving Therapy', 'Mindfulness', 'Time Management'],
      emotion: 'supportive'
    },
    relationships: {
      responses: [
        "Relationships can be one of our greatest sources of joy and also our deepest challenges. What's been weighing on your heart in your relationships?",
        "Communication in relationships takes practice and patience. It sounds like you're both trying to understand each other better.",
        "Healthy boundaries are essential in any relationship. They're not walls - they're guidelines that help relationships thrive.",
        "Conflict in relationships is normal, but how we handle it matters. What would it look like to approach this situation with both honesty and compassion?"
      ],
      techniques: ['Communication Skills', 'Boundary Setting', 'Conflict Resolution', 'Attachment Theory'],
      emotion: 'understanding'
    },
    general: {
      responses: [
        "Thank you for sharing that with me. I can hear that this is important to you. Can you tell me more about how this has been affecting your daily life?",
        "I'm here to listen and support you through this. What would feel most helpful to talk about right now?",
        "It takes courage to examine our feelings and experiences. You're taking important steps by being here and opening up.",
        "Everyone's journey is unique, and there's no 'right' way to feel. What you're experiencing matters, and I'm here to help you process it."
      ],
      techniques: ['Active Listening', 'Validation', 'Person-Centered Therapy'],
      emotion: 'supportive'
    },
    coping: {
      responses: [
        "Developing healthy coping strategies is so important. What activities or practices have brought you comfort or peace in the past?",
        "Coping skills are like tools in a toolbox - different situations might call for different tools. Let's explore what might work best for you right now.",
        "Self-care isn't selfish - it's necessary. What does self-care look like for you? It doesn't have to be elaborate.",
        "Building resilience takes time and practice. Every small step you take toward caring for yourself matters."
      ],
      techniques: ['Coping Skills Training', 'Self-Care Planning', 'Resilience Building'],
      emotion: 'encouraging'
    }
  };

  const encouragementResponses = [
    "You're showing real courage by being here and talking about your feelings. That's a strength, even when you might not feel strong.",
    "Healing isn't linear, and it's okay to have difficult days. Progress isn't always visible, but every conversation like this matters.",
    "I can see how much you care about getting better. That motivation, even when things are hard, is something to honor.",
    "You deserve support, care, and understanding. Thank you for trusting me with your thoughts and feelings."
  ];

  const aiPersonalities = {
    'dr-aria': {
      name: 'Dr. Aria',
      specialty: 'Trauma & Anxiety',
      avatar: '👩‍⚕️',
      style: 'warm and nurturing'
    },
    'dr-max': {
      name: 'Dr. Max',
      specialty: 'Depression & CBT',
      avatar: '👨‍⚕️',
      style: 'direct and practical'
    },
    'dr-elena': {
      name: 'Dr. Elena',
      specialty: 'Relationships & Mindfulness',
      avatar: '👩‍🎓',
      style: 'gentle and insightful'
    }
  };

  const detectCategory = (message: string): keyof typeof therapeuticResponses => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('kill') || lowerMessage.includes('suicide') || lowerMessage.includes('die') || lowerMessage.includes('end it')) {
      return 'crisis';
    }
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried') || lowerMessage.includes('panic')) {
      return 'anxiety';
    }
    if (lowerMessage.includes('depressed') || lowerMessage.includes('sad') || lowerMessage.includes('hopeless') || lowerMessage.includes('empty')) {
      return 'depression';
    }
    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure') || lowerMessage.includes('busy')) {
      return 'stress';
    }
    if (lowerMessage.includes('relationship') || lowerMessage.includes('partner') || lowerMessage.includes('friend') || lowerMessage.includes('family')) {
      return 'relationships';
    }
    if (lowerMessage.includes('cope') || lowerMessage.includes('coping') || lowerMessage.includes('manage') || lowerMessage.includes('help')) {
      return 'coping';
    }
    
    return 'general';
  };

  const generateAIResponse = (userMessage: string): { content: string; emotion: string; techniques: string[] } => {
    const category = detectCategory(userMessage);
    const categoryData = therapeuticResponses[category];
    
    if (category === 'crisis') {
      // Always prioritize safety for crisis situations
      return {
        content: categoryData.responses[0],
        emotion: categoryData.emotion,
        techniques: categoryData.techniques
      };
    }
    
    const randomResponse = categoryData.responses[Math.floor(Math.random() * categoryData.responses.length)];
    
    // Sometimes add encouragement
    if (Math.random() > 0.7) {
      const encouragement = encouragementResponses[Math.floor(Math.random() * encouragementResponses.length)];
      return {
        content: `${randomResponse}\n\n${encouragement}`,
        emotion: 'encouraging',
        techniques: [...categoryData.techniques, 'Motivational Enhancement']
      };
    }
    
    return {
      content: randomResponse,
      emotion: categoryData.emotion,
      techniques: categoryData.techniques
    };
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

    // Simulate AI thinking time (2-4 seconds for more realistic feel)
    const thinkingTime = Math.random() * 2000 + 2000;
    
    setTimeout(() => {
      const response = generateAIResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'ai',
        timestamp: new Date(),
        emotion: response.emotion as Message['emotion'],
        techniques: response.techniques
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
      case 'encouraging': return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case 'understanding': return <Brain className="w-4 h-4 text-blue-400" />;
      case 'professional': return <Zap className="w-4 h-4 text-purple-400" />;
      default: return <Bot className="w-4 h-4 text-mindwell-500" />;
    }
  };

  const currentPersonality = aiPersonalities[aiPersonality];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-mindwell-500 hover:bg-mindwell-600 text-white rounded-full p-4 shadow-xl animate-bounce hover:scale-110 transition-all duration-200"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 animate-scale-in overflow-hidden">
      {/* Enhanced Chat Header */}
      <div className="bg-gradient-to-r from-mindwell-500 to-mindwell-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">{currentPersonality.avatar}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-bold">{currentPersonality.name}</h3>
            <p className="text-xs opacity-90">{currentPersonality.specialty}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-mindwell-600 rounded-full p-2"
          >
            ×
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex animate-fade-in",
              message.sender === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[85%] p-4 rounded-2xl shadow-sm",
              message.sender === 'user'
                ? "bg-mindwell-500 text-white rounded-br-none"
                : "bg-white text-slate-800 rounded-bl-none border border-slate-200"
            )}>
              {message.sender === 'ai' && (
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    {getEmotionIcon(message.emotion)}
                    <span className="text-xs text-slate-500 font-medium">
                      {currentPersonality.name}
                    </span>
                  </div>
                  {message.techniques && (
                    <div className="text-xs text-slate-400">
                      {message.techniques[0]}
                    </div>
                  )}
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
              
              {message.techniques && message.sender === 'ai' && (
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1">
                    {message.techniques.slice(0, 2).map((technique, index) => (
                      <span
                        key={index}
                        className="text-xs bg-mindwell-50 text-mindwell-700 px-2 py-1 rounded-full"
                      >
                        {technique}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <p className={cn(
                "text-xs mt-2",
                message.sender === 'user' ? "text-mindwell-100" : "text-slate-400"
              )}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white text-slate-800 p-4 rounded-2xl rounded-bl-none max-w-[85%] border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{currentPersonality.avatar}</span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentPersonality.name} is thinking...
                </span>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-mindwell-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-mindwell-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-mindwell-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Chat Input */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex space-x-2 mb-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts and feelings..."
            className="flex-1 text-sm border-slate-300 focus:border-mindwell-500 rounded-full px-4"
            disabled={isTyping}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-mindwell-500 hover:bg-mindwell-600 text-white rounded-full px-4 shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-slate-500">
            🧠 AI trained in therapeutic techniques • 🔒 Private & secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthChat;
