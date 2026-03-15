import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Phone, Brain, Sparkles, Heart, MessageCircle, 
  Shield, Clock, Zap, Star, Volume2, Headphones, Lock, CheckCircle2,
  Users, Award, Mic, Play, ChevronRight, Globe, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AIAudioCall from '@/components/ui-custom/AIAudioCall';
import type { AudioCounselor } from '@/components/ui-custom/AIAudioCall';
import Sophia3DAvatar from '@/components/ui-custom/Sophia3DAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useFreeTrial } from '@/hooks/useFreeTrial';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

import sophiaAvatar from '@/assets/sophia-avatar.jpg';
import drAryanAvatar from '@/assets/dr-aryan-avatar.jpg';
import drMeeraAvatar from '@/assets/dr-meera-avatar.jpg';
import drZaraAvatar from '@/assets/dr-zara-avatar.jpg';

const AUDIO_COUNSELORS: AudioCounselor[] = [
  {
    id: 'sophia',
    name: 'Sophia',
    specialty: 'Mental Health Counselor',
    description: 'CBT, DBT & mindfulness expert for anxiety, stress & emotional well-being',
    gradient: 'from-purple-500 via-purple-600 to-violet-600',
    avatarImage: '',  // uses Sophia3DAvatar
    doctorType: 'mental_health',
  },
  {
    id: 'dr-aryan',
    name: 'Dr. Aryan',
    specialty: 'Male Therapist',
    description: "Men's mental health, anger management & work-life balance specialist",
    gradient: 'from-slate-500 via-zinc-600 to-gray-700',
    avatarImage: drAryanAvatar,
    doctorType: 'male_therapist',
  },
  {
    id: 'dr-meera',
    name: 'Dr. Meera',
    specialty: 'Senior Wellness Counselor',
    description: 'Life transitions, grief support & elder wellness with 35+ years wisdom',
    gradient: 'from-amber-600 via-yellow-600 to-orange-500',
    avatarImage: drMeeraAvatar,
    doctorType: 'elder_counselor',
  },
  {
    id: 'dr-zara',
    name: 'Dr. Zara',
    specialty: 'Youth & Teen Counselor',
    description: 'Academic stress, social anxiety & identity exploration for Gen-Z',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    avatarImage: drZaraAvatar,
    doctorType: 'youth_counselor',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } })
};

const AIAudioCallPage: React.FC = () => {
  const navigate = useNavigate();
  const { trialUsed, trialRemainingSeconds, FREE_TRIAL_LIMIT, loading: trialLoading, updateTrialDuration, markTrialUsed } = useFreeTrial();
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

  const handleCallEnd = () => console.log('Session ended');
  const handleTimeUp = () => {
    markTrialUsed();
    setTimeout(() => navigate('/plans'), 3000);
  };

  const therapyMethods = [
    { name: "CBT", full: "Cognitive Behavioral Therapy", icon: Brain, desc: "Reframe negative thought patterns" },
    { name: "DBT", full: "Dialectical Behavior Therapy", icon: Heart, desc: "Emotional regulation & mindfulness" },
    { name: "ACT", full: "Acceptance & Commitment", icon: Shield, desc: "Psychological flexibility & values" },
    { name: "MBSR", full: "Mindfulness-Based Stress", icon: Sparkles, desc: "Breathing & grounding techniques" },
  ];

  const stats = [
    { value: "10K+", label: "Sessions", icon: Headphones, color: "from-primary to-purple-500" },
    { value: "98%", label: "Satisfaction", icon: Star, color: "from-amber-500 to-orange-500" },
    { value: "24/7", label: "Available", icon: Clock, color: "from-emerald-500 to-green-500" },
    { value: "100%", label: "Private", icon: Lock, color: "from-rose-500 to-pink-500" },
  ];

  const testimonials = [
    { text: "Sophia helped me through my darkest moments. It felt like talking to someone who truly understands.", name: "Priya S.", rating: 5 },
    { text: "The breathing exercises during sessions changed my daily anxiety management completely.", name: "Arjun M.", rating: 5 },
    { text: "I was skeptical about AI therapy, but Sophia's empathy and insights surprised me.", name: "Sneha K.", rating: 5 },
  ];

  if (trialLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
        >
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-4 rounded-full bg-primary/10"
          >
            <Brain className="h-8 w-8 text-primary" />
          </motion.div>
          <p className="text-muted-foreground text-sm">Loading your session...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      
      {/* Subtle animated background mesh */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-transparent to-purple-500/3" />
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.12), transparent 70%)' }}
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, hsl(280 76% 50% / 0.1), transparent 70%)' }}
          animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <main className="relative z-10">
        {/* Back + Trial Banner */}
        <div className="container mx-auto px-4 pt-24 pb-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4 hover:bg-primary/10 gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </motion.div>

          {isFreeTrial && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
              <Card className="p-4 border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-emerald-500/15">
                      <Clock className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">🎁 Free Trial — {Math.ceil(trialRemainingSeconds / 60)} min remaining</p>
                      <p className="text-xs text-muted-foreground">Experience Sophia's counseling completely free</p>
                    </div>
                  </div>
                  <div className="w-full sm:w-48">
                    <Progress value={((FREE_TRIAL_LIMIT - trialRemainingSeconds) / FREE_TRIAL_LIMIT) * 100} className="h-2" />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {isBlocked && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
              <Card className="p-8 text-center border border-amber-500/20 bg-amber-500/5">
                <Lock className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Free Trial Completed</h2>
                <p className="text-muted-foreground mb-6">Upgrade to continue unlimited counseling with Sophia.</p>
                <Button onClick={() => navigate('/plans')} size="lg" className="bg-gradient-to-r from-primary to-purple-500 text-primary-foreground gap-2">
                  <Sparkles className="h-5 w-5" /> View Plans & Upgrade
                </Button>
              </Card>
            </motion.div>
          )}
        </div>

        {/* ═══════════ HERO SECTION ═══════════ */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
            {/* Left: Text Content */}
            <motion.div 
              className="space-y-6 order-2 lg:order-1"
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp} custom={0}>
                <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1.5 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" /> AI-Powered Mental Health Support
                </Badge>
              </motion.div>

              <motion.h1 
                variants={fadeUp} custom={1}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
              >
                Meet{' '}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
                  Sophia
                </span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl text-muted-foreground font-medium">
                  Your AI Counselor
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Experience compassionate, evidence-based mental health support through natural voice conversations. Available 24/7, completely confidential.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3">
                <Badge variant="outline" className="px-3 py-1.5 border-primary/20 bg-primary/5 gap-1.5">
                  <Shield className="h-3 w-3 text-primary" /> HIPAA Compliant
                </Badge>
                <Badge variant="outline" className="px-3 py-1.5 border-emerald-500/20 bg-emerald-500/5 gap-1.5">
                  <Lock className="h-3 w-3 text-emerald-500" /> End-to-End Encrypted
                </Badge>
                <Badge variant="outline" className="px-3 py-1.5 border-purple-500/20 bg-purple-500/5 gap-1.5">
                  <Globe className="h-3 w-3 text-purple-500" /> Multi-Language
                </Badge>
              </motion.div>

              <motion.div variants={fadeUp} custom={4} className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  {['😊', '🧘', '💆', '🌟'].map((e, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-sm">{e}</div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium">Trusted by 10,000+ users</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: 3D Avatar */}
            <motion.div 
              className="flex items-center justify-center order-1 lg:order-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative">
                {/* Ambient glow behind avatar */}
                <div className="absolute inset-0 -m-16">
                  <motion.div
                    className="w-full h-full rounded-full"
                    style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.15), hsl(280 76% 50% / 0.08), transparent 70%)' }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <Sophia3DAvatar size="xl" isActive={false} isSpeaking={false} />
                
                {/* Floating cards around avatar */}
                <motion.div
                  className="absolute -left-16 top-1/4 px-3 py-2 rounded-xl bg-card/90 backdrop-blur border border-border/50 shadow-lg"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span className="text-xs font-medium">CBT Expert</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -right-12 top-1/3 px-3 py-2 rounded-xl bg-card/90 backdrop-blur border border-border/50 shadow-lg"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span className="text-xs font-medium">Empathetic AI</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl bg-card/90 backdrop-blur border border-border/50 shadow-lg"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-medium">Voice Therapy</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ STATS BAR ═══════════ */}
        <section className="border-y border-border/50 bg-muted/20 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ MAIN CALL SECTION ═══════════ */}
        {!isBlocked && (
          <section className="container mx-auto px-4 py-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Start Your Session</h2>
                <p className="text-muted-foreground">Click below to begin a private voice conversation with Sophia</p>
              </div>
              <AIAudioCall
                onCallEnd={handleCallEnd}
                isFreeTrial={isFreeTrial}
                maxDurationSeconds={isFreeTrial ? trialRemainingSeconds : undefined}
                onTimeUp={handleTimeUp}
                trialRemainingSeconds={isFreeTrial ? trialRemainingSeconds : undefined}
              />
            </motion.div>
          </section>
        )}

        {/* ═══════════ THERAPY METHODS ═══════════ */}
        <section className="bg-muted/10 py-16 border-y border-border/30">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 mb-4">Evidence-Based</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Trained in Leading Therapy Methods</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">Sophia combines multiple therapeutic approaches personalized to your needs</p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {therapyMethods.map((method, i) => (
                <motion.div 
                  key={method.name}
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="p-6 h-full bg-card hover:shadow-lg transition-all border-border/50 hover:border-primary/30 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <method.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="mb-2 text-xs">{method.name}</Badge>
                    <h3 className="font-semibold mb-1">{method.full}</h3>
                    <p className="text-sm text-muted-foreground">{method.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <section className="container mx-auto px-4 py-16">
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">How It Works</h2>
            <p className="text-muted-foreground">Three simple steps to better mental health</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/30 via-purple-500/30 to-emerald-500/30" />
            
            {[
              { step: 1, title: "Start Session", desc: "Click the button and allow microphone access for voice conversation", icon: Play, color: "from-primary to-purple-500" },
              { step: 2, title: "Talk Naturally", desc: "Share your thoughts and feelings — Sophia listens and responds empathetically", icon: Mic, color: "from-purple-500 to-rose-500" },
              { step: 3, title: "Get Support", desc: "Receive personalized coping strategies and therapeutic guidance", icon: Heart, color: "from-rose-500 to-emerald-500" }
            ].map((item, index) => (
              <motion.div 
                key={item.step} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center relative"
              >
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-5 shadow-xl`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <item.icon className="h-7 w-7 text-white" />
                </motion.div>
                <div className="text-xs font-bold text-primary mb-1">STEP {item.step}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════ TESTIMONIALS ═══════════ */}
        <section className="bg-muted/10 py-16 border-y border-border/30">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">What Users Say</h2>
              <p className="text-muted-foreground">Real experiences from people who talk to Sophia</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 h-full bg-card border-border/50">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 italic leading-relaxed">"{t.text}"</p>
                    <p className="text-sm font-semibold">— {t.name}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ CRISIS NOTICE ═══════════ */}
        <section className="container mx-auto px-4 py-8">
          <Card className="p-5 bg-destructive/5 border-destructive/15">
            <p className="text-sm text-center text-muted-foreground">
              <strong className="text-destructive">🆘 Crisis Support:</strong> If you're experiencing thoughts of self-harm or suicide, 
              please contact emergency services or call a crisis helpline: 
              <span className="font-medium"> iCall (9152987821) • 988 Lifeline (US) • Samaritans 116 123 (UK)</span>
            </p>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AIAudioCallPage;
