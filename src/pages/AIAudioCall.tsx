import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Phone, Brain, Sparkles, Heart, MessageCircle, 
  Shield, Clock, Zap, Star, Volume2, Headphones, Lock, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AIAudioCall from '@/components/ui-custom/AIAudioCall';
import Juli3DAvatar from '@/components/ui-custom/Juli3DAvatar';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useFreeTrial } from '@/hooks/useFreeTrial';
import { Progress } from '@/components/ui/progress';

const AIAudioCallPage: React.FC = () => {
  const navigate = useNavigate();
  const { trialUsed, trialRemainingSeconds, FREE_TRIAL_LIMIT, loading: trialLoading, updateTrialDuration, markTrialUsed } = useFreeTrial();

  // Check if user has a paid subscription
  const [hasSubscription, setHasSubscription] = React.useState(false);
  const [subLoading, setSubLoading] = React.useState(true);

  React.useEffect(() => {
    const checkSub = async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();
        setHasSubscription(!!data);
      }
      setSubLoading(false);
    };
    checkSub();
  }, []);

  const isFreeTrial = !hasSubscription && !trialUsed;
  const isBlocked = trialUsed && !hasSubscription;

  const handleCallEnd = () => {
    console.log('Session ended');
  };

  const handleTimeUp = () => {
    markTrialUsed();
    setTimeout(() => navigate('/plans'), 3000);
  };

  const features = [
    { icon: Brain, title: "Evidence-Based Support", description: "Juli uses CBT and DBT techniques to provide effective mental health support", color: "from-purple-500 to-primary" },
    { icon: MessageCircle, title: "Natural Conversation", description: "Speak naturally - Juli understands context and responds empathetically", color: "from-blue-500 to-cyan-500" },
    { icon: Heart, title: "Emotional Intelligence", description: "Advanced AI trained to recognize and respond to emotional cues", color: "from-rose-500 to-pink-500" },
    { icon: Shield, title: "Safe Space", description: "Non-judgmental environment to express your thoughts freely", color: "from-emerald-500 to-green-500" }
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

  if (trialLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Brain className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    );
  }

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
            animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0], scale: [1, 1.2, 0.8, 1] }}
            transition={{ duration: 15 + i * 3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      
      <main className="container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </motion.div>

        {/* Free Trial Banner */}
        {isFreeTrial && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Card className="p-4 border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-primary/10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-500/20">
                    <Clock className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">🎁 Free Trial Session</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.ceil(trialRemainingSeconds / 60)} minutes remaining of your free counseling
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Progress value={((FREE_TRIAL_LIMIT - trialRemainingSeconds) / FREE_TRIAL_LIMIT) * 100} className="h-2" />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Blocked Banner */}
        {isBlocked && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
            <Card className="p-8 text-center border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-primary/10">
              <Lock className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Free Trial Completed</h2>
              <p className="text-muted-foreground mb-6">Your 15-minute free session has ended. Upgrade to continue unlimited counseling.</p>
              <Button onClick={() => navigate('/plans')} size="lg" className="bg-gradient-to-r from-amber-500 to-primary text-white gap-2">
                <Sparkles className="h-5 w-5" /> View Plans & Upgrade
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-emerald-500/20 text-primary mb-6 border border-primary/30">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Mental Health Support</span>
            <Sparkles className="h-4 w-4" />
          </motion.div>
          
          <div className="flex justify-center mb-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <Juli3DAvatar size="md" isActive={false} />
            </motion.div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Meet <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">Juli</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Your AI Mental Health Counselor. Experience compassionate, confidential voice conversations.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="px-3 py-1 border-primary/30 bg-primary/5">
              <Shield className="h-3 w-3 mr-1 text-primary" /> HIPAA Compliant
            </Badge>
            <Badge variant="outline" className="px-3 py-1 border-emerald-500/30 bg-emerald-500/5">
              <Lock className="h-3 w-3 mr-1 text-emerald-500" /> End-to-End Encrypted
            </Badge>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + index * 0.1 }}>
              <Card className="p-4 text-center bg-gradient-to-br from-card to-muted/50 border-primary/10">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Call Component - only show if not blocked */}
        {!isBlocked && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <AIAudioCall
              onCallEnd={handleCallEnd}
              isFreeTrial={isFreeTrial}
              maxDurationSeconds={isFreeTrial ? trialRemainingSeconds : undefined}
              onTimeUp={handleTimeUp}
              trialRemainingSeconds={isFreeTrial ? trialRemainingSeconds : undefined}
            />
          </motion.div>
        )}

        {/* Features Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" /> Why Talk to Juli? <Heart className="h-6 w-6 text-rose-500" />
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }} whileHover={{ y: -5 }}>
                <Card className="h-full p-6 hover:shadow-xl transition-all bg-gradient-to-br from-card to-muted/30">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-card via-background to-card border border-border rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" /> How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Start Session", desc: "Click \"Start Session\" and allow microphone access", icon: Phone },
              { step: 2, title: "Talk Naturally", desc: "Share your thoughts - Juli listens and responds", icon: Volume2 },
              { step: 3, title: "Get Support", desc: "Receive empathetic guidance and coping strategies", icon: Heart }
            ].map((item, index) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + index * 0.1 }} className="text-center relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIAudioCallPage;
