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
import { JOURNAL_STORAGE_KEY } from '@/components/journal/types';
import {
  BookOpen, ArrowRight, Flame, LogOut, Phone, Video, Crown, Zap,
} from 'lucide-react';

const moodEmoji = (m: string) => (m === 'happy' ? '😊' : m === 'sad' ? '😔' : '😐');

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name?: string } | null>(null);
  const [subscription, setSubscription] = useState<{ plan_id?: string; sessions_remaining?: number; current_period_end?: string } | null>(null);
  const [journalEntries, setJournalEntries] = useState<Array<{ id: string; mood: string; date: string; title?: string; content?: string }>>([]);

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`${JOURNAL_STORAGE_KEY}:${user.id}`);
    setJournalEntries(saved ? JSON.parse(saved) : []);
    (async () => {
      const [profileRes, subRes] = await Promise.all([
        supabase.from('profiles').select('display_name').eq('user_id', user.id).single(),
        supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').maybeSingle(),
      ]);
      setProfile(profileRes.data);
      setSubscription(subRes.data);
    })();
  }, [user]);

  const { streak, lastEntry } = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = new Set(journalEntries.map((e) => {
      const d = new Date(e.date); d.setHours(0, 0, 0, 0); return d.toISOString().slice(0, 10);
    }));
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      if (days.has(d.toISOString().slice(0, 10))) s++; else break;
    }
    const sorted = [...journalEntries].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return { streak: s, lastEntry: sorted[0] ?? null };
  }, [journalEntries]);

  const planLabel = subscription?.plan_id ? subscription.plan_id : 'Free';
  const daysLeft = subscription?.current_period_end
    ? Math.max(0, Math.ceil((+new Date(subscription.current_period_end) - Date.now()) / 86400000))
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Greeting */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">your space</p>
              <h1 className="font-display text-3xl md:text-4xl text-foreground">
                Hi <span className="text-calm-sage">{profile?.display_name || 'friend'}</span>.
              </h1>
            </div>
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate('/'); }} className="rounded-full gap-1.5 text-muted-foreground">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </Button>
          </motion.div>

          {/* Streak + Last entry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Card className="rounded-2xl border-border/40 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-200/60 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <div className="font-display text-3xl text-amber-700 leading-none">{streak}</div>
                  <p className="text-xs text-amber-800/70 mt-1">day{streak === 1 ? '' : 's'} journaling</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/40">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="text-3xl">{lastEntry ? moodEmoji(lastEntry.mood) : '·'}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">last entry</p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {lastEntry ? (lastEntry.title || 'Untitled') : 'No entries yet'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next step */}
          <Card className="rounded-2xl border-border/40 mb-4">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">next step</p>
              <div className="grid sm:grid-cols-3 gap-2">
                <Button onClick={() => navigate('/journal')} className="rounded-full bg-calm-sage hover:bg-calm-sage/90 text-white gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Journal
                </Button>
                <Button onClick={() => navigate('/consultation/audio')} variant="outline" className="rounded-full gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Audio
                </Button>
                <Button onClick={() => navigate('/consultation/video')} variant="outline" className="rounded-full gap-1.5">
                  <Video className="w-3.5 h-3.5" /> Video
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Plan */}
          <Card className="rounded-2xl border-border/40 bg-gradient-to-br from-calm-lavender-light/30 to-background">
            <CardContent className="p-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">your plan</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-calm-lavender/15 text-calm-lavender border-calm-lavender/30 capitalize">{planLabel}</Badge>
                  {daysLeft !== null && (
                    <span className="text-xs text-muted-foreground">{daysLeft} day{daysLeft === 1 ? '' : 's'} left</span>
                  )}
                </div>
              </div>
              <Button size="sm" onClick={() => navigate('/plans')} className="rounded-full gap-1.5 bg-calm-sage hover:bg-calm-sage/90 text-white">
                {subscription ? <><Zap className="w-3.5 h-3.5" /> Manage</> : <><Crown className="w-3.5 h-3.5" /> Upgrade</>}
                <ArrowRight className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
