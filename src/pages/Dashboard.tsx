import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JOURNAL_STORAGE_KEY } from '@/components/journal/types';
import {
  User, Calendar, Clock, Brain, Heart, BookOpen,
  ArrowRight, Star, Edit3, Flame, Activity,
  Settings, LogOut, Shield, Leaf, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [consultationCount, setConsultationCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    // Load journal from localStorage
    const saved = localStorage.getItem(`${JOURNAL_STORAGE_KEY}:${user.id}`);
    if (saved) setJournalEntries(JSON.parse(saved));
    else setJournalEntries([]);

    const fetchData = async () => {
      const [profileRes, sessionRes, subRes, consultRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('therapy_sessions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').maybeSingle(),
        supabase.from('consultations').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);
      setProfile(profileRes.data);
      setDisplayName(profileRes.data?.display_name || '');
      setSessionCount(sessionRes.count ?? 0);
      setSubscription(subRes.data);
      setConsultationCount(consultRes.count ?? 0);
    };
    fetchData();
  }, [user]);

  const updateProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ display_name: displayName }).eq('user_id', user.id);
    if (error) { toast.error("Failed to update profile"); return; }
    setProfile((prev: any) => ({ ...prev, display_name: displayName }));
    setEditingProfile(false);
    toast.success("Profile updated!");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Journal insights
  const recentEntries = journalEntries.slice(0, 5);
  const totalWords = journalEntries.reduce((s: number, e: any) => s + (e.content?.split(' ').length || 0), 0);
  const moodCounts = journalEntries.reduce((acc: any, e: any) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1; return acc;
  }, {} as Record<string, number>);
  const dominantMood = Object.entries(moodCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'neutral';

  const itemV = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Welcome, <span className="text-calm-sage">{profile?.display_name || 'there'}</span> 🌿
                </h1>
                <p className="text-muted-foreground mt-1">Your mental wellness journey at a glance</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingProfile(!editingProfile)} className="rounded-lg gap-1.5">
                  <Settings className="w-3.5 h-3.5" /> Profile
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-lg gap-1.5 text-destructive hover:text-destructive">
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Edit Profile */}
          {editingProfile && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
              <Card className="border-border/40">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-calm-sage-light/60 flex items-center justify-center">
                      <User className="w-8 h-8 text-calm-sage" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm">Display Name</Label>
                      <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="max-w-xs" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Email: {user?.email}</div>
                  <div className="text-sm text-muted-foreground">Joined: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={updateProfile} className="bg-calm-sage hover:bg-calm-sage/90 text-white rounded-lg">Save Changes</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingProfile(false)} className="rounded-lg">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stats Grid */}
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { icon: BookOpen, label: 'Journal Entries', value: journalEntries.length, color: 'bg-calm-lavender-light/60 text-calm-lavender' },
              { icon: Calendar, label: 'Consultations', value: consultationCount, color: 'bg-calm-sky-light/60 text-calm-sky' },
              { icon: Brain, label: 'Sessions', value: sessionCount, color: 'bg-calm-sage-light/60 text-calm-sage' },
              { icon: Edit3, label: 'Words Written', value: totalWords.toLocaleString(), color: 'bg-amber-100 text-amber-600' },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemV}>
                <Card className="border-border/40 hover:shadow-soft transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Mood Insight & Subscription */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-calm-sage" /> Mood Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {journalEntries.length > 0 ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{dominantMood === 'happy' ? '😊' : dominantMood === 'sad' ? '😔' : '😐'}</span>
                      <div>
                        <p className="font-medium text-foreground">Mostly {dominantMood}</p>
                        <p className="text-xs text-muted-foreground">Based on {journalEntries.length} journal entries</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {[{ mood: 'happy', emoji: '😊', label: 'Happy' }, { mood: 'neutral', emoji: '😐', label: 'Neutral' }, { mood: 'sad', emoji: '😔', label: 'Sad' }].map(m => (
                        <div key={m.mood} className="flex items-center gap-1.5 text-sm">
                          <span>{m.emoji}</span>
                          <span className="text-muted-foreground">{moodCounts[m.mood] || 0}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Start journaling to see mood insights.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4 text-calm-sky" /> Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                {subscription ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Plan</span><Badge>{subscription.plan_id}</Badge></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Sessions Left</span><span className="font-semibold">{subscription.sessions_remaining}</span></div>
                     <div className="flex justify-between text-sm"><span className="text-muted-foreground">Status</span><Badge variant="outline" className="border-calm-sage text-calm-sage">Active</Badge></div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">No active subscription.</p>
                    <Button size="sm" variant="outline" onClick={() => navigate('/consultation')} className="rounded-lg gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Book Counselor
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-calm-sage" /> Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { icon: BookOpen, title: 'Journal', desc: 'Write a new entry', path: '/journal', color: 'bg-calm-lavender-light/50' },
              { icon: Leaf, title: 'Self Help', desc: 'Exercises & courses', path: '/self-help', color: 'bg-calm-sage-light/50' },
              { icon: Calendar, title: 'Book Counselor', desc: 'Schedule a session', path: '/consultation', color: 'bg-calm-sky-light/50' },
              { icon: Star, title: 'Careers', desc: 'Join our team', path: '/careers', color: 'bg-amber-50' },
            ].map((action, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card className="cursor-pointer border-border/40 hover:shadow-soft transition-all" onClick={() => navigate(action.path)}>
                  <CardContent className={`p-4 ${action.color} rounded-lg`}>
                    <action.icon className="w-6 h-6 text-foreground mb-2" />
                    <h3 className="font-semibold text-foreground text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Journal */}
          {recentEntries.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-calm-lavender" /> Recent Journal Entries
                </h2>
                <Button variant="link" size="sm" onClick={() => navigate('/journal')} className="text-calm-sage gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {recentEntries.slice(0, 4).map((entry: any) => (
                  <Card key={entry.id} className="border-border/40 cursor-pointer hover:shadow-soft transition" onClick={() => navigate('/journal')}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{entry.mood === 'happy' ? '😊' : entry.mood === 'sad' ? '😔' : '😐'}</span>
                        <h3 className="font-medium text-foreground text-sm truncate">{entry.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{entry.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(entry.date).toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Mental Health Awareness */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-calm-sage-light/30 via-calm-sky-light/30 to-calm-lavender-light/30 border border-border/30 text-center">
            <Heart className="w-6 h-6 text-calm-sage mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground mb-1">Remember: It's okay to not be okay</p>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">
              Your mental health journey is unique. Celebrate small wins, be kind to yourself, and don't hesitate to reach out for professional help when needed. Every step forward matters. 💚
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
