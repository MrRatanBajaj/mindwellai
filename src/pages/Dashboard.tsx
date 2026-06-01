import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JOURNAL_STORAGE_KEY } from '@/components/journal/types';
import {
  User, Calendar, BookOpen, ArrowRight, Flame, Sparkles,
  Settings, LogOut, Shield, Leaf, TrendingUp, AlertTriangle,
  Zap, Crown, Wind, Sun, Phone, Headphones, Quote,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

const moodToScore = (m: string) => (m === 'happy' ? 8 : m === 'sad' ? 2 : 5);
const moodEmoji = (m: string) => (m === 'happy' ? '😊' : m === 'sad' ? '😔' : '😐');

const RECOMMENDATIONS: Record<string, { title: string; desc: string; path: string; icon: any; tone: string }[]> = {
  sad: [
    { title: '4-7-8 Breathing', desc: '3 min to ease the chest', path: '/self-help', icon: Wind, tone: 'bg-calm-sky-light/60 text-calm-sky' },
    { title: 'Talk to Aria', desc: 'Hinglish voice, judgement-free', path: '/phone-counselor', icon: Phone, tone: 'bg-calm-lavender-light/60 text-calm-lavender' },
  ],
  neutral: [
    { title: 'Gratitude prompt', desc: '2 lines, one good moment', path: '/journal', icon: BookOpen, tone: 'bg-calm-sage-light/60 text-calm-sage' },
    { title: 'Mindful pause', desc: '5-min grounding audio', path: '/self-help', icon: Headphones, tone: 'bg-calm-sky-light/60 text-calm-sky' },
  ],
  happy: [
    { title: 'Lock in the win', desc: 'Note one thing that worked', path: '/journal', icon: Sun, tone: 'bg-amber-100 text-amber-700' },
    { title: 'Book a check-in', desc: 'Stay ahead of low days', path: '/consultation', icon: Calendar, tone: 'bg-calm-sage-light/60 text-calm-sage' },
  ],
};

const AFFIRMATIONS = [
  "Small steps still move you forward.",
  "Your feelings are valid — and they're not permanent.",
  "Rest is productive too.",
  "You don't have to be okay every day.",
  "Healing isn't linear, and that's allowed.",
];

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
    const saved = localStorage.getItem(`${JOURNAL_STORAGE_KEY}:${user.id}`);
    setJournalEntries(saved ? JSON.parse(saved) : []);

    (async () => {
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
    })();
  }, [user]);

  const updateProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ display_name: displayName }).eq('user_id', user.id);
    if (error) return toast.error('Failed to update profile');
    setProfile((p: any) => ({ ...p, display_name: displayName }));
    setEditingProfile(false);
    toast.success('Profile updated');
  };

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  // ---- Derived insights ----
  const { moodSeries, streak, dominantMood, weeklyAvg, totalEntries } = useMemo(() => {
    const days = 30;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const byDay = new Map<string, number[]>();
    journalEntries.forEach((e: any) => {
      const d = new Date(e.date); d.setHours(0, 0, 0, 0);
      const k = d.toISOString().slice(0, 10);
      const score = typeof e.energy === 'number' ? e.energy : moodToScore(e.mood);
      if (!byDay.has(k)) byDay.set(k, []);
      byDay.get(k)!.push(score);
    });

    const series: { date: string; label: string; score: number | null }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      const arr = byDay.get(k);
      series.push({
        date: k,
        label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        score: arr ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : null,
      });
    }

    // streak: consecutive days back from today with entries
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      if (byDay.has(k)) s++; else break;
    }

    const counts: Record<string, number> = {};
    journalEntries.forEach((e: any) => { counts[e.mood] = (counts[e.mood] || 0) + 1; });
    const dom = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

    const last7 = series.slice(-7).filter(x => x.score !== null).map(x => x.score as number);
    const wAvg = last7.length ? +(last7.reduce((a, b) => a + b, 0) / last7.length).toFixed(1) : null;

    return { moodSeries: series, streak: s, dominantMood: dom, weeklyAvg: wAvg, totalEntries: journalEntries.length };
  }, [journalEntries]);

  const recs = RECOMMENDATIONS[dominantMood] || RECOMMENDATIONS.neutral;
  const affirmation = AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];
  const recentEntries = journalEntries.slice(0, 3);

  const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Greeting */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Your space</p>
              <h1 className="font-display text-3xl md:text-5xl text-foreground leading-tight">
                Hi <span className="text-calm-sage">{profile?.display_name || 'friend'}</span> — <span className="serif-italic text-muted-foreground">how is today landing?</span>
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingProfile(!editingProfile)} className="rounded-full gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="rounded-full gap-1.5 text-muted-foreground hover:text-destructive">
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </Button>
            </div>
          </motion.div>

          {editingProfile && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
              <Card className="border-border/40 rounded-2xl">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-calm-sage-light/60 flex items-center justify-center">
                      <User className="w-7 h-7 text-calm-sage" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm">Display name</Label>
                      <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="max-w-xs" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{user?.email} · joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={updateProfile} className="bg-calm-sage hover:bg-calm-sage/90 text-white rounded-full">Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingProfile(false)} className="rounded-full">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ========== EMOTIONAL COLOR BRAIN MAP ========== */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <EmotionalBrainMap />
          </motion.div>

          {/* ========== BENTO GRID ========== */}
          <motion.div
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 md:grid-cols-6 auto-rows-[minmax(140px,auto)] gap-4"
          >
            {/* Mood trend (large) */}
            <motion.div variants={fadeUp} className="md:col-span-4 md:row-span-2">
              <Card className="h-full border-border/40 rounded-3xl overflow-hidden bg-gradient-to-br from-calm-sage-light/30 via-background to-calm-sky-light/20">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        <TrendingUp className="w-3.5 h-3.5" /> Mood trend · last 30 days
                      </div>
                      <h2 className="font-display text-2xl text-foreground">
                        {weeklyAvg !== null ? (
                          <>This week you averaged <span className="text-calm-sage">{weeklyAvg}/10</span></>
                        ) : (
                          <>Your mood story starts here</>
                        )}
                      </h2>
                    </div>
                    <div className="text-3xl">{moodEmoji(dominantMood)}</div>
                  </div>

                  <div className="flex-1 min-h-[180px]">
                    {totalEntries === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                        <p className="text-sm text-muted-foreground max-w-xs">Write your first journal entry to start tracking how your days feel.</p>
                        <Button size="sm" onClick={() => navigate('/journal')} className="rounded-full bg-calm-sage hover:bg-calm-sage/90 text-white gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> Start journaling
                        </Button>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={moodSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(var(--calm-sage))" stopOpacity={0.45} />
                              <stop offset="100%" stopColor="hsl(var(--calm-sage))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} opacity={0.4} />
                          <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
                          <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }}
                            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                            formatter={(v: any) => [v === null ? '—' : `${v}/10`, 'Mood']}
                          />
                          <Area type="monotone" dataKey="score" stroke="hsl(var(--calm-sage))" strokeWidth={2.5} fill="url(#moodFill)" connectNulls />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Streak */}
            <motion.div variants={fadeUp} className="md:col-span-2">
              <Card className="h-full border-border/40 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-5 h-full flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700/80">
                    <Flame className="w-3.5 h-3.5" /> Streak
                  </div>
                  <div>
                    <div className="font-display text-5xl text-amber-700 leading-none">{streak}</div>
                    <p className="text-xs text-amber-800/70 mt-1">{streak === 1 ? 'day in a row' : 'days in a row'} journaling</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/journal')} className="self-start text-amber-700 hover:text-amber-800 hover:bg-amber-100/60 gap-1 -ml-2 rounded-full">
                    Add today's entry <ArrowRight className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sessions counter */}
            <motion.div variants={fadeUp} className="md:col-span-2">
              <Card className="h-full border-border/40 rounded-3xl">
                <CardContent className="p-5 h-full flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5" /> Therapy
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="font-display text-3xl text-foreground">{sessionCount}</div>
                      <p className="text-[11px] text-muted-foreground">AI sessions</p>
                    </div>
                    <div>
                      <div className="font-display text-3xl text-foreground">{consultationCount}</div>
                      <p className="text-[11px] text-muted-foreground">consultations</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/phone-counselor')} className="self-start text-calm-sage hover:text-calm-sage hover:bg-calm-sage-light/40 gap-1 -ml-2 rounded-full">
                    Talk to Aria <ArrowRight className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommendation engine (based on mood) */}
            <motion.div variants={fadeUp} className="md:col-span-3">
              <Card className="h-full border-border/40 rounded-3xl">
                <CardContent className="p-5 h-full flex flex-col">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    <Leaf className="w-3.5 h-3.5" /> Suggested for you
                  </div>
                  <p className="text-sm text-foreground/80 mb-4">
                    Because your days have been mostly <span className="font-medium">{dominantMood}</span>, try one of these:
                  </p>
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {recs.map((r, i) => (
                      <button key={i} onClick={() => navigate(r.path)} className="text-left p-3 rounded-2xl bg-secondary/50 hover:bg-secondary transition group">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${r.tone}`}>
                          <r.icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-medium text-foreground">{r.title}</h3>
                        <p className="text-[11px] text-muted-foreground">{r.desc}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscription / Plan */}
            <motion.div variants={fadeUp} className="md:col-span-3">
              <Card className="h-full border-border/40 rounded-3xl bg-gradient-to-br from-calm-lavender-light/30 to-background">
                <CardContent className="p-5 h-full flex flex-col">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    <Shield className="w-3.5 h-3.5" /> Your plan
                  </div>
                  {subscription ? (() => {
                    const daysLeft = Math.ceil((new Date(subscription.current_period_end).getTime() - Date.now()) / 86400000);
                    const expired = daysLeft <= 0;
                    const expiringSoon = daysLeft > 0 && daysLeft <= 7;
                    const lowSessions = subscription.sessions_remaining <= 1 && subscription.sessions_remaining < 999;
                    return (
                      <div className="flex-1 flex flex-col justify-between gap-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-calm-lavender/15 text-calm-lavender border-calm-lavender/30 capitalize">{subscription.plan_id}</Badge>
                            <Badge variant="outline" className={expired ? 'border-destructive text-destructive' : 'border-calm-sage text-calm-sage'}>
                              {expired ? 'Expired' : 'Active'}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground"><span className="font-semibold">{subscription.sessions_remaining}</span> <span className="text-muted-foreground">sessions remaining</span></p>
                          {!expired && <p className="text-xs text-muted-foreground mt-1">Renews in {daysLeft} day{daysLeft !== 1 ? 's' : ''}</p>}
                        </div>
                        {(expired || expiringSoon || lowSessions) ? (
                          <div className={`p-3 rounded-xl ${expired ? 'bg-destructive/10 border border-destructive/20' : 'bg-amber-50 border border-amber-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className={`w-3.5 h-3.5 ${expired ? 'text-destructive' : 'text-amber-600'}`} />
                              <span className={`text-xs font-medium ${expired ? 'text-destructive' : 'text-amber-700'}`}>
                                {expired ? 'Plan expired' : expiringSoon ? `Expires in ${daysLeft}d` : `${subscription.sessions_remaining} session left`}
                              </span>
                            </div>
                            <Button size="sm" onClick={() => navigate('/plans')} className="rounded-full bg-calm-sage hover:bg-calm-sage/90 text-white gap-1.5 w-full">
                              <Zap className="w-3.5 h-3.5" /> {expired ? 'Renew' : 'Upgrade'}
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => navigate('/plans')} className="rounded-full gap-1.5 self-start">
                            Manage plan <ArrowRight className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })() : (
                    <div className="flex-1 flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground">No active plan — start free, upgrade when ready.</p>
                      <Button size="sm" onClick={() => navigate('/plans')} className="rounded-full gap-1.5 bg-calm-sage hover:bg-calm-sage/90 text-white self-start mt-3">
                        <Crown className="w-3.5 h-3.5" /> Choose a plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent journal */}
            <motion.div variants={fadeUp} className="md:col-span-4">
              <Card className="h-full border-border/40 rounded-3xl">
                <CardContent className="p-5 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                      <BookOpen className="w-3.5 h-3.5" /> Recent journal
                    </div>
                    <Button variant="link" size="sm" onClick={() => navigate('/journal')} className="text-calm-sage h-auto p-0 gap-1">
                      View all <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                  {recentEntries.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-center">
                      <p className="text-sm text-muted-foreground">Your entries will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 flex-1">
                      {recentEntries.map((e: any) => (
                        <button key={e.id} onClick={() => navigate('/journal')} className="w-full text-left p-3 rounded-2xl hover:bg-secondary/60 transition flex items-start gap-3">
                          <span className="text-xl shrink-0">{moodEmoji(e.mood)}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{e.title || 'Untitled entry'}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{e.content}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Affirmation */}
            <motion.div variants={fadeUp} className="md:col-span-2">
              <Card className="h-full border-border/40 rounded-3xl bg-gradient-to-br from-calm-sky-light/40 to-calm-lavender-light/30">
                <CardContent className="p-5 h-full flex flex-col justify-between">
                  <Quote className="w-5 h-5 text-calm-sky" />
                  <p className="font-display serif-italic text-lg text-foreground leading-snug">"{affirmation}"</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">today's reminder</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
