import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useFreeTrial } from '@/hooks/useFreeTrial';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  User, Phone, Calendar, Clock, Brain, Heart,
  MessageCircle, Shield, Sparkles, ArrowRight,
  History, BookOpen, Activity, Crown, Gift,
  Star, Headphones, Video, Zap
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loading: trialLoading, trialUsed, trialRemainingSeconds, FREE_TRIAL_LIMIT, trialDurationSeconds } = useFreeTrial();
  const [profile, setProfile] = useState<any>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setProfile(profileData);

      // Fetch session count
      const { count } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      setSessionCount(count ?? 0);

      // Fetch subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      setSubscription(subData);
    };

    fetchData();
  }, [user]);

  const trialProgress = trialLoading ? 0 : Math.min(100, (trialDurationSeconds / FREE_TRIAL_LIMIT) * 100);
  const trialMinutesLeft = Math.ceil(trialRemainingSeconds / 60);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/3 to-purple-500/5">
      <Header />

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Welcome back, <span className="text-gradient">{profile?.display_name || 'User'}</span> 👋
                </h1>
                <p className="text-muted-foreground mt-1">Your mental wellness journey at a glance</p>
              </div>
              <Badge variant="outline" className="px-4 py-2 text-sm border-primary/30">
                <User className="h-4 w-4 mr-2" />
                {user?.email}
              </Badge>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Free Trial Card */}
            {!trialLoading && !trialUsed && !subscription && (
              <motion.div variants={itemVariants}>
                <Card className="border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-primary/10 to-purple-500/10 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-500/20">
                          <Gift className="h-8 w-8 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold flex items-center gap-2">
                            🎉 Free 15-Minute Counseling Session
                            <Badge className="bg-emerald-500 text-white">NEW USER</Badge>
                          </h3>
                          <p className="text-muted-foreground mt-1">
                            You have <strong>{trialMinutesLeft} minutes</strong> of free AI counseling remaining. Start your journey today!
                          </p>
                          <div className="mt-3 max-w-md">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Used: {Math.floor(trialDurationSeconds / 60)}m {trialDurationSeconds % 60}s</span>
                              <span>15:00 total</span>
                            </div>
                            <Progress value={trialProgress} className="h-2" />
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate('/ai-audio-call')}
                        size="lg"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shadow-lg"
                      >
                        <Phone className="h-5 w-5" />
                        Start Free Session
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Trial Used - Upgrade Prompt */}
            {!trialLoading && trialUsed && !subscription && (
              <motion.div variants={itemVariants}>
                <Card className="border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-primary/10 to-purple-500/10">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-amber-500/20">
                          <Crown className="h-8 w-8 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Your free trial has ended</h3>
                          <p className="text-muted-foreground">Upgrade to continue unlimited AI counseling sessions</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate('/plans')}
                        size="lg"
                        className="bg-gradient-to-r from-amber-500 to-primary text-white gap-2"
                      >
                        <Crown className="h-5 w-5" />
                        View Plans
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Brain, label: 'Sessions', value: sessionCount.toString(), color: 'text-primary', bg: 'bg-primary/10' },
                { icon: Clock, label: 'Total Time', value: `${Math.floor(trialDurationSeconds / 60)}m`, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { icon: Star, label: 'Plan', value: subscription?.plan_id || 'Free Trial', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { icon: Shield, label: 'Status', value: 'Protected', color: 'text-blue-500', bg: 'bg-blue-500/10' },
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="font-bold text-lg">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: Headphones,
                    title: 'AI Voice Counseling',
                    desc: 'Talk to Juli, your AI counselor',
                    path: '/ai-audio-call',
                    color: 'from-primary/20 to-purple-500/20',
                    iconColor: 'text-primary',
                    disabled: trialUsed && !subscription,
                  },
                  {
                    icon: MessageCircle,
                    title: 'AI Text Therapy',
                    desc: 'Chat-based counseling session',
                    path: '/ai-therapist',
                    color: 'from-emerald-500/20 to-teal-500/20',
                    iconColor: 'text-emerald-500',
                    disabled: trialUsed && !subscription,
                  },
                  {
                    icon: Calendar,
                    title: 'Book Consultation',
                    desc: 'Schedule a therapy session',
                    path: '/consultation',
                    color: 'from-blue-500/20 to-indigo-500/20',
                    iconColor: 'text-blue-500',
                    disabled: false,
                  },
                  {
                    icon: BookOpen,
                    title: 'Self-Help Resources',
                    desc: 'Articles, exercises & guides',
                    path: '/self-help',
                    color: 'from-amber-500/20 to-orange-500/20',
                    iconColor: 'text-amber-500',
                    disabled: false,
                  },
                ].map((action, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      className={`cursor-pointer hover:shadow-lg transition-all border-transparent ${action.disabled ? 'opacity-50' : ''}`}
                      onClick={() => {
                        if (action.disabled) {
                          navigate('/plans');
                        } else {
                          navigate(action.path);
                        }
                      }}
                    >
                      <CardContent className={`p-5 bg-gradient-to-br ${action.color} rounded-lg`}>
                        <action.icon className={`h-8 w-8 ${action.iconColor} mb-3`} />
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
                        {action.disabled && (
                          <Badge variant="outline" className="mt-2 text-xs border-amber-500/30 text-amber-600">
                            <Crown className="h-3 w-3 mr-1" /> Upgrade Required
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* More Features */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/sessions')}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-rose-500/10">
                      <History className="h-6 w-6 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Session History</h3>
                      <p className="text-xs text-muted-foreground">View past sessions & transcripts</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/journal')}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-violet-500/10">
                      <BookOpen className="h-6 w-6 text-violet-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Wellness Journal</h3>
                      <p className="text-xs text-muted-foreground">Track your thoughts & feelings</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/peer-connect')}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-cyan-500/10">
                      <Heart className="h-6 w-6 text-cyan-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Peer Support</h3>
                      <p className="text-xs text-muted-foreground">Connect with community</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Subscription Status */}
            {subscription && (
              <motion.div variants={itemVariants}>
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-primary" />
                      Subscription Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan</span>
                      <Badge>{subscription.plan_id}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sessions Remaining</span>
                      <span className="font-bold">{subscription.sessions_remaining}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline" className="border-emerald-500 text-emerald-600">{subscription.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
