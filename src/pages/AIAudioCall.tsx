import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Phone, 
  Brain, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Shield, 
  Clock, 
  Zap,
  Star,
  Volume2,
  Headphones,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AIAudioCall from '@/components/ui-custom/AIAudioCall';
import JuliMascot from '@/components/ui-custom/JuliMascot';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const AIAudioCallPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCallEnd = () => {
    console.log('Session ended');
  };

  const features = [
    {
      icon: Brain,
      title: "Evidence-Based Support",
      description: "Juli uses CBT and DBT techniques to provide effective mental health support",
      color: "from-purple-500 to-primary"
    },
    {
      icon: MessageCircle,
      title: "Natural Conversation",
      description: "Speak naturally - Juli understands context and responds empathetically",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "Emotional Intelligence",
      description: "Advanced AI trained to recognize and respond to emotional cues",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Safe Space",
      description: "Non-judgmental environment to express your thoughts freely",
      color: "from-emerald-500 to-green-500"
    }
  ];

  const stats = [
    { value: "10K+", label: "Sessions Completed", icon: Headphones },
    { value: "98%", label: "User Satisfaction", icon: Star },
    { value: "24/7", label: "Always Available", icon: Clock },
    { value: "100%", label: "Confidential", icon: Lock }
  ];

  const benefits = [
    "Instant access - no appointments needed",
    "Completely private and confidential",
    "Evidence-based therapeutic techniques",
    "Available in your language",
    "No judgment, just support",
    "Affordable mental wellness"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
      <Header />
      
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full opacity-30"
            style={{
              background: `radial-gradient(circle, ${i % 2 === 0 ? 'hsl(var(--primary) / 0.15)' : 'hsl(142 76% 36% / 0.15)'} 0%, transparent 70%)`,
              left: `${10 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -50, 50, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <main className="container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </motion.div>

        {/* Hero Section with Mascot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-emerald-500/20 text-primary mb-6 border border-primary/30"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
            <span className="text-sm font-medium">AI-Powered Mental Health Support</span>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
          </motion.div>
          
          {/* Mini Mascot Preview */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <JuliMascot size="md" isActive={false} />
            </motion.div>
          </div>

          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Meet <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">Juli</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your AI Mental Health Counselor. Experience compassionate, confidential voice 
            conversations powered by advanced AI technology.
          </motion.p>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Badge variant="outline" className="px-3 py-1 border-primary/30 bg-primary/5">
              <Shield className="h-3 w-3 mr-1 text-primary" />
              HIPAA Compliant
            </Badge>
            <Badge variant="outline" className="px-3 py-1 border-emerald-500/30 bg-emerald-500/5">
              <Lock className="h-3 w-3 mr-1 text-emerald-500" />
              End-to-End Encrypted
            </Badge>
            <Badge variant="outline" className="px-3 py-1 border-amber-500/30 bg-amber-500/5">
              <Star className="h-3 w-3 mr-1 text-amber-500" />
              4.9 Rating
            </Badge>
          </motion.div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="p-4 text-center bg-gradient-to-br from-card to-muted/50 border-primary/10 hover:border-primary/30 transition-all">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Call Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <AIAudioCall onCallEnd={handleCallEnd} />
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <Card className="p-8 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 border-primary/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-amber-500" />
                  Why Choose Juli?
                </h2>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <JuliMascot size="lg" isActive={true} />
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            Why Talk to Juli?
            <Heart className="h-6 w-6 text-rose-500" />
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 bg-gradient-to-br from-card to-muted/30">
                  <motion.div 
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-br from-card via-background to-card border border-border rounded-2xl p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Start Session", desc: "Click \"Start Session\" and allow microphone access to begin", icon: Phone },
              { step: 2, title: "Talk Naturally", desc: "Share your thoughts and feelings - Juli listens and responds", icon: Volume2 },
              { step: 3, title: "Get Support", desc: "Receive empathetic guidance and coping strategies", icon: Heart }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center relative"
              >
                <motion.div 
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <item.icon className="h-8 w-8 text-white" />
                </motion.div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center font-bold text-primary text-sm shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          <motion.div 
            className="flex items-center gap-2 text-muted-foreground px-4 py-2 rounded-full bg-muted/30"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="h-5 w-5 text-emerald-500" />
            <span>End-to-End Encrypted</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2 text-muted-foreground px-4 py-2 rounded-full bg-muted/30"
            whileHover={{ scale: 1.05 }}
          >
            <Clock className="h-5 w-5 text-blue-500" />
            <span>Available 24/7</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2 text-muted-foreground px-4 py-2 rounded-full bg-muted/30"
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="h-5 w-5 text-rose-500" />
            <span>Evidence-Based Approach</span>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default AIAudioCallPage;
