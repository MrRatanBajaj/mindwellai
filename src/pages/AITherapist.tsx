import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AIVideoConsultation from "@/components/ui-custom/AIVideoConsultation";
import AIChatCounselor from "@/components/ui-custom/AIChatCounselor";
import AIVoiceChat from "@/components/ui-custom/AIVoiceChat";
import EmergencyCounseling from "@/components/ui-custom/EmergencyCounseling";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, MessageCircle, Phone, Brain, Heart, 
  Star, Clock, Users, Shield, Zap, Award,
  CheckCircle2, ArrowRight, Sparkles, Play,
  Mic, Globe, Activity, X
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Counselor {
  id: string;
  name: string;
  specialty: string;
  description: string;
  rating: number;
  sessions: number;
  languages: string[];
  specialties: string[];
  gradient: string;
  emoji: string;
  available: boolean;
}

const AITherapist = () => {
  const [currentSession, setCurrentSession] = useState<'none' | 'video' | 'chat' | 'voice' | 'emergency'>('none');
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const counselors: Counselor[] = [
    {
      id: 'emma',
      name: 'Dr. Emma AI',
      specialty: 'Anxiety & Depression Specialist',
      description: 'Expert in CBT and mindfulness-based interventions for anxiety and mood disorders.',
      rating: 4.9,
      sessions: 12847,
      languages: ['English', 'Spanish', 'French'],
      specialties: ['CBT', 'Mindfulness', 'Panic Disorders', 'Social Anxiety'],
      gradient: 'from-purple-500 via-purple-600 to-violet-600',
      emoji: '💜',
      available: true
    },
    {
      id: 'marcus',
      name: 'Dr. Marcus AI',
      specialty: 'Trauma & PTSD Specialist',
      description: 'Specialized in trauma-informed care and EMDR techniques for healing.',
      rating: 4.8,
      sessions: 8934,
      languages: ['English', 'German', 'Italian'],
      specialties: ['PTSD', 'Trauma Recovery', 'EMDR', 'Complex Trauma'],
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      emoji: '💙',
      available: true
    },
    {
      id: 'sophia',
      name: 'Dr. Sophia AI',
      specialty: 'Relationship & Family Therapist',
      description: 'Expert in couples therapy, family dynamics, and communication skills.',
      rating: 4.9,
      sessions: 15632,
      languages: ['English', 'Mandarin', 'Japanese'],
      specialties: ['Couples Therapy', 'Family Dynamics', 'Communication', 'Conflict Resolution'],
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      emoji: '💗',
      available: true
    },
    {
      id: 'alex',
      name: 'Dr. Alex AI',
      specialty: 'Addiction & Recovery Counselor',
      description: 'Specialized in substance abuse treatment and behavioral addiction recovery.',
      rating: 4.7,
      sessions: 6891,
      languages: ['English', 'Portuguese', 'Dutch'],
      specialties: ['Addiction Recovery', 'Behavioral Therapy', 'Relapse Prevention', '12-Step Support'],
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      emoji: '💚',
      available: true
    }
  ];

  const handleStartSession = (type: 'video' | 'chat' | 'voice', counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setCurrentSession(type);
    toast.success(`Starting ${type} session with ${counselor.name}`);
  };

  const handleEndSession = () => {
    setCurrentSession('none');
    setSelectedCounselor(null);
    toast.success('Session ended successfully');
  };

  const handleEmergencySession = (type: 'video' | 'chat', urgency: string) => {
    setCurrentSession('emergency');
    toast.info(`Connecting to emergency ${type} support`);
  };

  // Render active sessions
  if (currentSession === 'video' && selectedCounselor) {
    return (
      <AIVideoConsultation
        counselorName={selectedCounselor.name}
        specialty={selectedCounselor.specialty}
        onEndCall={handleEndSession}
      />
    );
  }

  if (currentSession === 'chat' && selectedCounselor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <Header />
        <div className="pt-24 pb-10 px-6">
          <div className="max-w-4xl mx-auto mb-4">
            <Button variant="outline" onClick={handleEndSession} className="gap-2">
              <X className="w-4 h-4" />
              End Session
            </Button>
          </div>
          <AIChatCounselor
            counselorName={selectedCounselor.name}
            specialty={selectedCounselor.specialty}
            onEndSession={handleEndSession}
          />
        </div>
      </div>
    );
  }

  if (currentSession === 'voice' && selectedCounselor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <Header />
        <div className="pt-24 pb-10 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={cn(
                "w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl bg-gradient-to-br shadow-2xl",
                selectedCounselor.gradient
              )}>
                {selectedCounselor.emoji}
              </div>
              <h1 className="text-2xl font-bold mb-2">Voice Session with {selectedCounselor.name}</h1>
              <p className="text-muted-foreground mb-4">{selectedCounselor.specialty}</p>
              <Button variant="outline" onClick={handleEndSession} className="gap-2">
                <X className="w-4 h-4" />
                End Session
              </Button>
            </motion.div>
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-pink-500/10 to-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
            >
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Mental Health Support</span>
              <Sparkles className="w-4 h-4" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Meet Your Personal
              <span className="block mt-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI Therapist
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Experience personalized mental health support with our advanced AI counselors, 
              available 24/7 for video calls, chat sessions, and voice therapy.
            </p>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {[
                { icon: Users, label: "Active Users", value: "50K+", color: "text-blue-500" },
                { icon: Clock, label: "Avg Response", value: "<30s", color: "text-green-500" },
                { icon: Star, label: "User Rating", value: "4.8/5", color: "text-yellow-500" },
                { icon: Shield, label: "Privacy", value: "100%", color: "text-purple-500" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4"
                >
                  <stat.icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="counselors" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 bg-muted/50 p-1 rounded-full">
              <TabsTrigger value="counselors" className="rounded-full flex items-center gap-2 data-[state=active]:bg-background">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">Counselors</span>
              </TabsTrigger>
              <TabsTrigger value="emergency" className="rounded-full flex items-center gap-2 data-[state=active]:bg-background">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Emergency</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="rounded-full flex items-center gap-2 data-[state=active]:bg-background">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Features</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="counselors">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {counselors.map((counselor, index) => (
                  <motion.div
                    key={counselor.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredId(counselor.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <Card className={cn(
                      "group relative overflow-hidden transition-all duration-500 border-2",
                      "hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1",
                      hoveredId === counselor.id ? "border-primary/30" : "border-transparent"
                    )}>
                      {/* Gradient overlay on hover */}
                      <div 
                        className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br",
                          counselor.gradient
                        )}
                      />

                      <CardContent className="relative p-6">
                        <div className="flex gap-6">
                          {/* Avatar Section */}
                          <div className="flex-shrink-0">
                            <motion.div 
                              className={cn(
                                "w-20 h-20 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br shadow-lg",
                                counselor.gradient
                              )}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              {counselor.emoji}
                            </motion.div>
                            
                            {/* Online Status */}
                            <div className="flex items-center justify-center gap-1.5 mt-3">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-xs text-green-600 font-medium">Online</span>
                            </div>
                          </div>

                          {/* Info Section */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold">{counselor.name}</h3>
                                <p className="text-sm text-primary font-medium">{counselor.specialty}</p>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold">{counselor.rating}</span>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {counselor.description}
                            </p>

                            {/* Stats Row */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                {counselor.sessions.toLocaleString()} sessions
                              </span>
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {counselor.languages.length} languages
                              </span>
                            </div>

                            {/* Specialties */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {counselor.specialties.slice(0, 3).map((spec) => (
                                <Badge key={spec} variant="secondary" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                              {counselor.specialties.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{counselor.specialties.length - 3}
                                </Badge>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className={cn("flex-1 bg-gradient-to-r text-white shadow-lg", counselor.gradient)}
                                onClick={() => handleStartSession('video', counselor)}
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Video Call
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleStartSession('chat', counselor)}
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Chat
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleStartSession('voice', counselor)}
                              >
                                <Mic className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Quick Start CTA */}
              <motion.div 
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="inline-block bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-3">
                      Not sure which counselor to choose?
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-primary to-purple-500"
                      onClick={() => handleStartSession('video', counselors[0])}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start with Dr. Emma
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="emergency">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <EmergencyCounseling onStartSession={handleEmergencySession} />
              </motion.div>
            </TabsContent>

            <TabsContent value="features">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[
                  {
                    icon: Brain,
                    title: "Advanced AI Technology",
                    description: "State-of-the-art natural language processing and emotional intelligence.",
                    features: ["Real-time emotion detection", "Personalized responses", "Continuous learning"],
                    gradient: "from-purple-500 to-indigo-500"
                  },
                  {
                    icon: Shield,
                    title: "Complete Privacy",
                    description: "End-to-end encryption ensures your conversations remain confidential.",
                    features: ["HIPAA compliant", "No data storage", "Anonymous sessions"],
                    gradient: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: Heart,
                    title: "Evidence-Based Therapy",
                    description: "AI counselors trained on proven therapeutic approaches.",
                    features: ["CBT techniques", "Mindfulness practices", "Crisis intervention"],
                    gradient: "from-pink-500 to-rose-500"
                  },
                  {
                    icon: Clock,
                    title: "24/7 Availability",
                    description: "Get support whenever you need it, with instant access.",
                    features: ["No wait times", "Global accessibility", "Multiple time zones"],
                    gradient: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: Users,
                    title: "Personalized Care",
                    description: "Each AI counselor adapts to your unique needs.",
                    features: ["Custom treatment plans", "Progress tracking", "Adaptive responses"],
                    gradient: "from-orange-500 to-amber-500"
                  },
                  {
                    icon: Award,
                    title: "Professional Standards",
                    description: "Highest standards of therapeutic practice and ethics.",
                    features: ["Licensed supervision", "Quality assurance", "Continuous improvement"],
                    gradient: "from-violet-500 to-purple-500"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary/20">
                      <CardContent className="p-6">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br shadow-lg",
                          feature.gradient
                        )}>
                          <feature.icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        <ul className="space-y-2">
                          {feature.features.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
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
