import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Brain, Sparkles, Heart, MessageCircle, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AIAudioCall from '@/components/ui-custom/AIAudioCall';
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
      description: "Juli uses CBT and DBT techniques to provide effective mental health support"
    },
    {
      icon: MessageCircle,
      title: "Natural Conversation",
      description: "Speak naturally - Juli understands context and responds empathetically"
    },
    {
      icon: Heart,
      title: "Emotional Intelligence",
      description: "Advanced AI trained to recognize and respond to emotional cues"
    },
    {
      icon: Shield,
      title: "Safe Space",
      description: "Non-judgmental environment to express your thoughts freely"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
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

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Mental Health Support</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meet <span className="text-primary">Juli</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI Mental Health Counselor. Experience compassionate, confidential voice 
            conversations powered by advanced AI technology.
          </p>
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

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Why Talk to Juli?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-card border border-border rounded-2xl p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Start Session</h3>
              <p className="text-sm text-muted-foreground">
                Click "Start Session" and allow microphone access to begin
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Talk Naturally</h3>
              <p className="text-sm text-muted-foreground">
                Share your thoughts and feelings - Juli listens and responds
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Get Support</h3>
              <p className="text-sm text-muted-foreground">
                Receive empathetic guidance and coping strategies
              </p>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-5 w-5 text-green-500" />
            <span>End-to-End Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5 text-blue-500" />
            <span>Available 24/7</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Evidence-Based Approach</span>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default AIAudioCallPage;
