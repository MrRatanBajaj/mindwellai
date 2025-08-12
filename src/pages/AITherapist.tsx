import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AIAvatar from "@/components/ui-custom/AIAvatar";
import AIVideoCall from "@/components/ui-custom/AIVideoCall";
import AIChatCounselor from "@/components/ui-custom/AIChatCounselor";
import AIVoiceChat from "@/components/ui-custom/AIVoiceChat";
import EmergencyCounseling from "@/components/ui-custom/EmergencyCounseling";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, MessageCircle, Phone, Brain, Heart, 
  Star, Clock, Users, Shield, Zap, Award,
  PlayCircle, CheckCircle2, ArrowRight
} from "lucide-react";
import { toast } from "sonner";

const AITherapist = () => {
  const [currentSession, setCurrentSession] = useState<'none' | 'video' | 'chat' | 'voice' | 'emergency'>('none');
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null);

  const counselors = [
    {
      id: 'emma',
      name: 'Dr. Emma AI',
      specialty: 'Anxiety & Depression Specialist',
      description: 'Expert in cognitive behavioral therapy and mindfulness-based interventions for anxiety and mood disorders.',
      rating: 4.9,
      sessions: 12847,
      languages: ['English', 'Spanish', 'French'],
      specialties: ['CBT', 'Mindfulness', 'Panic Disorders', 'Social Anxiety'],
      mood: 'empathetic' as const,
      available: true
    },
    {
      id: 'marcus',
      name: 'Dr. Marcus AI',
      specialty: 'Trauma & PTSD Specialist',
      description: 'Specialized in trauma-informed care and EMDR techniques for healing from traumatic experiences.',
      rating: 4.8,
      sessions: 8934,
      languages: ['English', 'German', 'Italian'],
      specialties: ['PTSD', 'Trauma Recovery', 'EMDR', 'Complex Trauma'],
      mood: 'calm' as const,
      available: true
    },
    {
      id: 'sophia',
      name: 'Dr. Sophia AI',
      specialty: 'Relationship & Family Therapist',
      description: 'Expert in couples therapy, family dynamics, and communication skills development.',
      rating: 4.9,
      sessions: 15632,
      languages: ['English', 'Mandarin', 'Japanese'],
      specialties: ['Couples Therapy', 'Family Dynamics', 'Communication', 'Conflict Resolution'],
      mood: 'encouraging' as const,
      available: true
    },
    {
      id: 'alex',
      name: 'Dr. Alex AI',
      specialty: 'Addiction & Recovery Counselor',
      description: 'Specialized in substance abuse treatment and behavioral addiction recovery programs.',
      rating: 4.7,
      sessions: 6891,
      languages: ['English', 'Portuguese', 'Dutch'],
      specialties: ['Addiction Recovery', 'Behavioral Therapy', 'Relapse Prevention', '12-Step Support'],
      mood: 'focused' as const,
      available: true
    }
  ];

  const handleStartSession = (type: 'video' | 'chat' | 'voice', counselor?: any) => {
    if (counselor) {
      setSelectedCounselor(counselor);
    }
    setCurrentSession(type);
    toast.success(`Starting ${type} session with ${counselor?.name || 'AI counselor'}`);
  };

  const handleEndSession = () => {
    setCurrentSession('none');
    setSelectedCounselor(null);
    toast.success('Session ended successfully');
  };

  const handleEmergencySession = (type: 'video' | 'chat', urgency: string) => {
    setCurrentSession('emergency');
    toast.info(`Connecting you to emergency ${type} support (${urgency} priority)`);
  };

  if (currentSession === 'video') {
    return (
      <AIVideoCall
        counselorName={selectedCounselor?.name}
        specialty={selectedCounselor?.specialty}
        onEndCall={handleEndSession}
      />
    );
  }

  if (currentSession === 'chat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-mindwell-50">
        <Header />
        <div className="pt-20 pb-10 px-6">
          <AIChatCounselor
            counselorName={selectedCounselor?.name}
            specialty={selectedCounselor?.specialty}
            onEndSession={handleEndSession}
          />
        </div>
      </div>
    );
  }

  if (currentSession === 'voice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-mindwell-50">
        <Header />
        <div className="pt-20 pb-10 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">
                Voice Session with {selectedCounselor?.name || 'AI Counselor'}
              </h1>
              <p className="text-slate-600 mb-4">{selectedCounselor?.specialty}</p>
              <Button onClick={handleEndSession} variant="outline">
                End Session
              </Button>
            </div>
            <AIVoiceChat 
              onCallEnd={handleEndSession}
              className="max-w-3xl mx-auto"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-mindwell-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-2 px-4 rounded-full bg-gradient-to-r from-mindwell-100 to-mindwell-200 text-mindwell-700 font-medium text-sm mb-6 border border-mindwell-300">
              🧠 AI-Powered Mental Health Support
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-balance">
              Meet Your Personal
              <span className="text-gradient"> AI Therapist</span>
            </h1>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto text-balance leading-relaxed">
              Experience personalized mental health support with our advanced AI counselors, available 24/7 for video calls, chat sessions, and emergency support.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { icon: Users, label: "Active Users", value: "50K+" },
              { icon: Clock, label: "Avg Response", value: "<30s" },
              { icon: Star, label: "User Rating", value: "4.8/5" },
              { icon: Shield, label: "Privacy", value: "100%" }
            ].map((stat, index) => (
              <Card key={index} className="glass-panel border-white/20 text-center">
                <CardContent className="p-4">
                  <stat.icon className="w-8 h-8 text-mindwell-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="counselors" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="counselors" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Counselors
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Emergency Support
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Features
              </TabsTrigger>
            </TabsList>

            <TabsContent value="counselors">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {counselors.map((counselor, index) => (
                  <motion.div
                    key={counselor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="glass-panel border-white/20 hover-lift group">
                      <CardHeader className="text-center">
                        <AIAvatar
                          name={counselor.name}
                          specialty={counselor.specialty}
                          mood={counselor.mood}
                          isActive={counselor.available}
                          className="mb-4"
                          onStartSession={(type) => handleStartSession(type, counselor)}
                        />
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{counselor.rating}</span>
                            <span className="text-xs text-slate-500">({counselor.sessions} sessions)</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 justify-center">
                            {counselor.languages.map((lang) => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <p className="text-sm text-slate-600 text-center">
                          {counselor.description}
                        </p>
                        
                        <div className="space-y-2">
                          <h4 className="text-xs font-medium text-slate-700">Specializations:</h4>
                          <div className="flex flex-wrap gap-1">
                            {counselor.specialties.map((specialty) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-1 pt-2">
                          <Button
                            size="sm"
                            className="bg-mindwell-500 hover:bg-mindwell-600 text-xs"
                            onClick={() => handleStartSession('video', counselor)}
                          >
                            <Video className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleStartSession('chat', counselor)}
                          >
                            <MessageCircle className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="text-xs"
                            onClick={() => handleStartSession('voice', counselor)}
                          >
                            <Phone className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="emergency">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <EmergencyCounseling onStartSession={handleEmergencySession} />
              </motion.div>
            </TabsContent>

            <TabsContent value="features">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {[
                  {
                    icon: Brain,
                    title: "Advanced AI Technology",
                    description: "Our AI counselors use state-of-the-art natural language processing and emotional intelligence algorithms.",
                    features: ["Real-time emotion detection", "Personalized responses", "Continuous learning"]
                  },
                  {
                    icon: Shield,
                    title: "Complete Privacy & Security",
                    description: "End-to-end encryption ensures your conversations remain completely private and confidential.",
                    features: ["HIPAA compliant", "No data storage", "Anonymous sessions"]
                  },
                  {
                    icon: Heart,
                    title: "Evidence-Based Therapy",
                    description: "All our AI counselors are trained on proven therapeutic approaches and clinical best practices.",
                    features: ["CBT techniques", "Mindfulness practices", "Crisis intervention"]
                  },
                  {
                    icon: Clock,
                    title: "24/7 Availability",
                    description: "Get support whenever you need it, with instant access to qualified AI mental health professionals.",
                    features: ["No wait times", "Global accessibility", "Multiple time zones"]
                  },
                  {
                    icon: Users,
                    title: "Personalized Care",
                    description: "Each AI counselor adapts to your unique needs, preferences, and therapeutic goals.",
                    features: ["Custom treatment plans", "Progress tracking", "Adaptive responses"]
                  },
                  {
                    icon: Award,
                    title: "Professional Standards",
                    description: "Our AI counselors maintain the highest standards of therapeutic practice and ethical guidelines.",
                    features: ["Licensed supervision", "Quality assurance", "Continuous improvement"]
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="glass-panel border-white/20 hover-lift h-full">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-mindwell-400 to-mindwell-600 flex items-center justify-center mb-4">
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-slate-600">{feature.description}</p>
                        <ul className="space-y-2">
                          {feature.features.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AITherapist;