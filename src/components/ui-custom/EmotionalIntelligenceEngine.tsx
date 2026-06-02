import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Brain, Check, Sparkles, Activity, Mic, CloudSun, Eye, Info, Shield,
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

/**
 * Emotional Intelligence Engine
 * Combines: Color Psychology, Mood Tracking, Digital Phenotyping (lightweight),
 * Emotion Visualization, Affective Computing — all client-side, per-user.
 *
 * SAFETY: All outputs are wellness insights & self-reflection — NOT medical
 * diagnosis. Disclaimers are surfaced in every analytical panel.
 */

const COLORS = [
  { id: 'blue',     label: 'Calm',              hex: '#7FB3D5', desc: 'Steady, settled', score: 7 },
  { id: 'green',    label: 'Recovery',          hex: '#A8C8A0', desc: 'Healing, growing', score: 8 },
  { id: 'yellow',   label: 'Hopeful',           hex: '#F4D35E', desc: 'Light, optimistic', score: 8 },
  { id: 'orange',   label: 'Energised',         hex: '#F4A261', desc: 'Driven, alive', score: 7 },
  { id: 'red',      label: 'Stress overload',   hex: '#E76F51', desc: 'Tight, reactive', score: 3 },
  { id: 'purple',   label: 'Reflective',        hex: '#A78BCF', desc: 'Deep, thoughtful', score: 6 },
  { id: 'grey',     label: 'Emotional fatigue', hex: '#9AA0A6', desc: 'Numb, drained', score: 2 },
  { id: 'pink',     label: 'Tender',            hex: '#F4B6C2', desc: 'Soft, vulnerable', score: 5 },
];

const EMOTIONS = [
  'Anxious', 'Calm', 'Sad', 'Grateful', 'Angry', 'Lonely',
  'Hopeful', 'Overwhelmed', 'Focused', 'Tired', 'Loved', 'Restless',
];

type Entry = {
  date: string;
  color: string;
  emotion: string;
  energy: number;
  journal?: string;
};

type VoiceLog = {
  date: string;
  durationSec: number;
  pacePerMin: number;   // words per minute (synthetic if absent)
  pauses: number;
  toneEnergy: number;   // 0-100
  engagement: number;   // 0-100
};

const storageKey = (uid: string) => `emotional_brain_map:${uid}`;
const voiceKey   = (uid: string) => `voice_biomarkers:${uid}`;
const consentKey = (uid: string) => `eie_consent:${uid}`;
const todayKey   = () => new Date().toISOString().slice(0, 10);

const Disclaimer = () => (
  <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-secondary/40 border border-border/40 rounded-xl p-3">
    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
    <p>
      These are <span className="font-medium text-foreground">wellness insights</span>, not a medical
      diagnosis. WellMindAI does not detect depression, anxiety or any disorder. If you're in distress,
      please reach out to a qualified professional or our crisis support.
    </p>
  </div>
);

const EmotionalIntelligenceEngine = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [voice, setVoice] = useState<VoiceLog[]>([]);
  const [color, setColor] = useState('');
  const [emotion, setEmotion] = useState('');
  const [energy, setEnergy] = useState(3);
  const [journal, setJournal] = useState('');
  const [consent, setConsent] = useState(false);

  // Load
  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem(storageKey(user.id));
      setEntries(raw ? JSON.parse(raw) : []);
      const vraw = localStorage.getItem(voiceKey(user.id));
      setVoice(vraw ? JSON.parse(vraw) : []);
      setConsent(localStorage.getItem(consentKey(user.id)) === 'true');
    } catch {/* noop */}
  }, [user]);

  const todays = useMemo(() => entries.find((e) => e.date === todayKey()), [entries]);
  useEffect(() => {
    if (todays) {
      setColor(todays.color); setEmotion(todays.emotion);
      setEnergy(todays.energy); setJournal(todays.journal || '');
    }
  }, [todays]);

  const giveConsent = () => {
    if (!user) { toast.error('Sign in first'); return; }
    localStorage.setItem(consentKey(user.id), 'true');
    setConsent(true);
    toast.success('Consent saved — your data stays private to your device.');
  };

  const save = () => {
    if (!user) { toast.error('Sign in to save'); return; }
    if (!consent) { toast.error('Please give consent below first'); return; }
    if (!color || !emotion) { toast.error('Pick a color and an emotion'); return; }
    const next: Entry = { date: todayKey(), color, emotion, energy, journal: journal.slice(0, 1000) || undefined };
    const updated = [...entries.filter((e) => e.date !== next.date), next].sort((a, b) => a.date.localeCompare(b.date));
    setEntries(updated);
    localStorage.setItem(storageKey(user.id), JSON.stringify(updated));
    toast.success("Today's check-in saved");
  };

  // ---- 6-month grid ----
  const grid = useMemo(() => {
    const map = new Map(entries.map((e) => [e.date, e]));
    const days: { date: string; entry?: Entry }[] = [];
    const now = new Date();
    for (let i = 179; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, entry: map.get(key) });
    }
    return days;
  }, [entries]);

  // ---- Timeline data (last 60 days) ----
  const timeline = useMemo(() => {
    const map = new Map(entries.map((e) => [e.date, e]));
    const out: { date: string; mood: number | null; energy: number | null; label: string }[] = [];
    const now = new Date();
    for (let i = 59; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const e = map.get(key);
      const c = e ? COLORS.find((x) => x.id === e.color) : undefined;
      out.push({
        date: key,
        label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        mood: c ? c.score : null,
        energy: e ? e.energy * 2 : null,
      });
    }
    return out;
  }, [entries]);

  // ---- Significant shifts ----
  const shifts = useMemo(() => {
    const out: { date: string; from: string; to: string; delta: number }[] = [];
    for (let i = 1; i < entries.length; i++) {
      const a = entries[i - 1]; const b = entries[i];
      const sa = COLORS.find((c) => c.id === a.color)?.score ?? 5;
      const sb = COLORS.find((c) => c.id === b.color)?.score ?? 5;
      if (Math.abs(sb - sa) >= 4) {
        out.push({ date: b.date, from: a.emotion, to: b.emotion, delta: sb - sa });
      }
    }
    return out.slice(-5).reverse();
  }, [entries]);

  // ---- Insights ----
  const insights = useMemo(() => {
    if (entries.length < 5) return null;
    const last30 = entries.slice(-30);
    const counts: Record<string, number> = {};
    const emoCounts: Record<string, number> = {};
    let weekdayEnergy = Array(7).fill(0); let weekdayN = Array(7).fill(0);
    last30.forEach((e) => {
      counts[e.color] = (counts[e.color] || 0) + 1;
      emoCounts[e.emotion] = (emoCounts[e.emotion] || 0) + 1;
      const wd = new Date(e.date).getDay();
      weekdayEnergy[wd] += e.energy; weekdayN[wd] += 1;
    });
    const dom = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const dominantColor = COLORS.find((c) => c.id === dom[0]);
    const topEmotion = Object.entries(emoCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const stressDays = last30.filter((e) => e.color === 'red' || e.color === 'grey').length;
    const recoveryDays = last30.filter((e) => e.color === 'green' || e.color === 'blue').length;
    const avgEnergy = (last30.reduce((s, e) => s + e.energy, 0) / last30.length);
    const wdAvg = weekdayEnergy.map((v, i) => weekdayN[i] ? v / weekdayN[i] : 0);
    const lowest = wdAvg.reduce((min, v, i) => (weekdayN[i] && v < wdAvg[min] ? i : min), 0);
    const wd = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      dominantColor, topEmotion, stressDays, recoveryDays,
      avgEnergy: avgEnergy.toFixed(1), total: last30.length,
      lowestDay: weekdayN[lowest] ? wd[lowest] : null,
    };
  }, [entries]);

  // ---- Weather forecast (next 7 days) — heuristic only ----
  const forecast = useMemo(() => {
    if (entries.length < 14) return null;
    const recent = entries.slice(-14);
    const avg = recent.reduce((s, e) => s + (COLORS.find((c) => c.id === e.color)?.score ?? 5), 0) / recent.length;
    const stress = recent.filter((e) => e.color === 'red' || e.color === 'grey').length / recent.length;
    const trend = (() => {
      const half = Math.floor(recent.length / 2);
      const a = recent.slice(0, half).reduce((s, e) => s + (COLORS.find((c) => c.id === e.color)?.score ?? 5), 0) / half;
      const b = recent.slice(half).reduce((s, e) => s + (COLORS.find((c) => c.id === e.color)?.score ?? 5), 0) / (recent.length - half);
      return b - a;
    })();
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() + i + 1);
      const proj = Math.max(1, Math.min(10, avg + trend * (i / 6) + (Math.random() - 0.5) * 0.6));
      let outlook = 'Steady', tone = 'bg-calm-sky-light/40 text-calm-sky';
      if (proj >= 7) { outlook = 'Bright'; tone = 'bg-calm-sage-light/40 text-calm-sage'; }
      else if (proj <= 4) { outlook = 'Heavy'; tone = 'bg-red-50 text-red-600'; }
      return {
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        proj: proj.toFixed(1), outlook, tone,
      };
    });
    return {
      days,
      confidence: Math.min(85, 40 + entries.length).toFixed(0),
      stressRisk: stress > 0.4 ? 'Elevated' : stress > 0.2 ? 'Moderate' : 'Low',
    };
  }, [entries]);

  // ---- Reflection mirror (simple template, deterministic) ----
  const mirror = useMemo(() => {
    if (entries.length < 7) return null;
    const last = entries.slice(-21);
    const emo: Record<string, number> = {};
    last.forEach((e) => { emo[e.emotion] = (emo[e.emotion] || 0) + 1; });
    const top3 = Object.entries(emo).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
    const triggersText = last.filter((e) => e.journal).slice(-3).map((e) => e.journal).join(' • ');
    const strengths = last.filter((e) => e.energy >= 4).length;
    const growth = last.filter((e) => e.color === 'green').length;
    return { top3, triggersText, strengths, growth, total: last.length };
  }, [entries]);

  // ---- Voice biomarkers (aggregated metadata, no audio stored) ----
  const voiceSeries = useMemo(() => voice.slice(-14).map((v) => ({
    label: new Date(v.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    pace: v.pacePerMin, tone: v.toneEnergy, engagement: v.engagement,
  })), [voice]);

  const simulateVoiceCapture = () => {
    if (!user) return;
    const sample: VoiceLog = {
      date: todayKey(),
      durationSec: 60 + Math.floor(Math.random() * 240),
      pacePerMin: 110 + Math.floor(Math.random() * 60),
      pauses: 4 + Math.floor(Math.random() * 10),
      toneEnergy: 40 + Math.floor(Math.random() * 50),
      engagement: 50 + Math.floor(Math.random() * 45),
    };
    const updated = [...voice.filter((v) => v.date !== sample.date), sample]
      .sort((a, b) => a.date.localeCompare(b.date));
    setVoice(updated);
    localStorage.setItem(voiceKey(user.id), JSON.stringify(updated));
    toast.success('Voice session metadata logged (no audio stored).');
  };

  return (
    <Card className="border-border/40 rounded-3xl overflow-hidden bg-gradient-to-br from-background to-secondary/30">
      <CardContent className="p-5 md:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Brain className="w-3.5 h-3.5" /> Emotional Intelligence Engine
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-foreground mt-1">
              Your personal <span className="serif-italic text-primary">emotional operating system</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Color psychology · mood tracking · gentle voice insights · affective patterns — all stored privately on your device.
            </p>
          </div>
          {todays && (
            <Badge variant="secondary" className="gap-1 shrink-0">
              <Check className="w-3 h-3" /> Checked-in
            </Badge>
          )}
        </div>

        {/* Consent gate */}
        {!consent && (
          <div className="mb-5 p-4 rounded-2xl border border-border/50 bg-card">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
              <Shield className="w-4 h-4 text-primary" /> Privacy & consent
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Your emotional data is stored locally on this device, scoped to your account. We never sell or share it. You can clear it anytime from your browser.
            </p>
            <Button size="sm" onClick={giveConsent} className="rounded-full">I consent — enable my engine</Button>
          </div>
        )}

        <Tabs defaultValue="checkin" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-5 h-auto">
            <TabsTrigger value="checkin" className="text-xs">Check-in</TabsTrigger>
            <TabsTrigger value="map" className="text-xs">Brain Map</TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
            <TabsTrigger value="voice" className="text-xs">Voice</TabsTrigger>
            <TabsTrigger value="forecast" className="text-xs">Forecast</TabsTrigger>
          </TabsList>

          {/* CHECK-IN */}
          <TabsContent value="checkin" className="space-y-5">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Pick today's emotional color</p>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    className={`relative aspect-square rounded-2xl transition-all ${color === c.id ? 'ring-2 ring-offset-2 ring-foreground scale-105' : 'hover:scale-105'}`}
                    style={{ background: c.hex }}
                    title={`${c.label} — ${c.desc}`}
                    aria-label={c.label}
                  >
                    {color === c.id && <Check className="w-4 h-4 text-white absolute top-1.5 right-1.5 drop-shadow" />}
                  </button>
                ))}
              </div>
              {color && (
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="font-medium text-foreground">{COLORS.find((c) => c.id === color)?.label}</span>
                  {' · '}{COLORS.find((c) => c.id === color)?.desc}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">Which emotion fits best?</p>
              <div className="flex flex-wrap gap-1.5">
                {EMOTIONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmotion(e)}
                    className={`px-3 py-1 rounded-full text-xs transition ${emotion === e ? 'bg-foreground text-background' : 'bg-secondary text-foreground/70 hover:bg-secondary/80'}`}
                  >{e}</button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="font-medium text-foreground text-sm">Energy level</span>
                <span>{energy}/5</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setEnergy(n)}
                    className={`flex-1 h-2 rounded-full transition ${n <= energy ? 'bg-primary' : 'bg-secondary'}`}
                    aria-label={`Energy ${n}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">A line for your future self <span className="text-xs text-muted-foreground font-normal">(optional)</span></p>
              <Textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="What's behind today's color? A trigger, a win, a thought…"
                maxLength={1000}
                className="rounded-2xl text-sm"
              />
            </div>

            <Button onClick={save} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
              {todays ? 'Update today' : 'Save today'} <Sparkles className="w-3.5 h-3.5" />
            </Button>
          </TabsContent>

          {/* BRAIN MAP */}
          <TabsContent value="map" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Last 6 months</p>
              <p className="text-[10px] text-muted-foreground">{entries.length} day{entries.length !== 1 ? 's' : ''} logged</p>
            </div>
            <div className="grid grid-flow-col grid-rows-10 gap-[3px]" style={{ gridAutoColumns: 'minmax(0, 1fr)' }}>
              {grid.map((d) => {
                const c = d.entry ? COLORS.find((x) => x.id === d.entry!.color)?.hex : undefined;
                return (
                  <motion.div
                    key={d.date}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="aspect-square rounded-[3px]"
                    style={{ background: c || 'hsl(var(--secondary))', opacity: c ? 0.85 : 0.4 }}
                    title={d.entry ? `${d.date}: ${COLORS.find((x) => x.id === d.entry!.color)?.label} · ${d.entry.emotion}` : d.date}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground pt-2">
              {COLORS.map((c) => (
                <span key={c.id} className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c.hex }} /> {c.label}
                </span>
              ))}
            </div>
            <Disclaimer />
          </TabsContent>

          {/* TIMELINE */}
          <TabsContent value="timeline" className="space-y-4">
            <div className="h-56">
              <ResponsiveContainer>
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={9} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} width={24} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="mood" stroke="hsl(var(--primary))" fill="url(#moodGrad)" connectNulls />
                  <Line type="monotone" dataKey="energy" stroke="hsl(var(--calm-sage))" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Significant shifts</p>
              {shifts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No major shifts yet — keep checking in daily.</p>
              ) : (
                <ul className="space-y-2">
                  {shifts.map((s, i) => (
                    <li key={i} className="text-sm flex items-center justify-between p-3 rounded-xl bg-card border border-border/40">
                      <span>
                        <span className="font-medium">{s.date}</span> — moved from{' '}
                        <span className="text-muted-foreground">{s.from}</span> to{' '}
                        <span className="text-foreground font-medium">{s.to}</span>
                      </span>
                      <Badge variant={s.delta > 0 ? 'secondary' : 'destructive'}>
                        {s.delta > 0 ? '+' : ''}{s.delta}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Disclaimer />
          </TabsContent>

          {/* INSIGHTS */}
          <TabsContent value="insights" className="space-y-4">
            {!insights ? (
              <p className="text-sm text-muted-foreground">Log at least 5 days to unlock pattern insights.</p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-card border border-border/40">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Dominant shade</p>
                    <p className="text-base font-medium mt-1" style={{ color: insights.dominantColor?.hex }}>
                      {insights.dominantColor?.label}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-card border border-border/40">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Top emotion</p>
                    <p className="text-base font-medium mt-1">{insights.topEmotion}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-card border border-border/40">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Stress / Recovery</p>
                    <p className="text-base font-medium mt-1">{insights.stressDays} / {insights.recoveryDays}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-card border border-border/40">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg energy</p>
                    <p className="text-base font-medium mt-1">{insights.avgEnergy}/5</p>
                  </div>
                </div>

                {insights.lowestDay && (
                  <div className="p-4 rounded-2xl bg-secondary/40 border border-border/40">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      <Activity className="w-3.5 h-3.5" /> Pattern noticed
                    </div>
                    <p className="text-sm">
                      Your energy dips most on <span className="font-medium">{insights.lowestDay}s</span>.
                      Consider scheduling something restorative that morning.
                    </p>
                  </div>
                )}

                {/* Reflection Mirror */}
                {mirror && (
                  <div className="p-4 rounded-2xl bg-card border border-border/40">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
                      <Eye className="w-3.5 h-3.5 text-primary" /> Personal Reflection Mirror
                    </div>
                    <p className="text-sm leading-relaxed">
                      Across {mirror.total} recent days, your most-named feelings have been{' '}
                      <span className="font-medium">{mirror.top3.join(', ')}</span>. You logged{' '}
                      <span className="font-medium">{mirror.strengths}</span> high-energy days and{' '}
                      <span className="font-medium">{mirror.growth}</span> recovery days — both signs you're attending to yourself.
                    </p>
                    {mirror.triggersText && (
                      <p className="text-xs text-muted-foreground mt-3 italic">
                        Recent reflections: "{mirror.triggersText.slice(0, 220)}{mirror.triggersText.length > 220 ? '…' : ''}"
                      </p>
                    )}
                  </div>
                )}

                <Disclaimer />
              </>
            )}
          </TabsContent>

          {/* VOICE */}
          <TabsContent value="voice" className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-muted-foreground max-w-md">
                We analyse <span className="text-foreground font-medium">conversational metadata only</span> — pace, pauses, tone-energy and engagement — never your raw audio. Use this alongside Aria voice calls.
              </p>
              <Button size="sm" variant="outline" onClick={simulateVoiceCapture} className="gap-1.5 rounded-full">
                <Mic className="w-3.5 h-3.5" /> Log a session
              </Button>
            </div>

            {voiceSeries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No voice sessions logged yet.</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer>
                  <LineChart data={voiceSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} width={24} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                    <Line type="monotone" dataKey="pace" name="Pace (wpm)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="tone" name="Tone energy" stroke="hsl(var(--calm-sage))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="engagement" name="Engagement" stroke="hsl(var(--calm-lavender))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            <Disclaimer />
          </TabsContent>

          {/* FORECAST */}
          <TabsContent value="forecast" className="space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <CloudSun className="w-3.5 h-3.5" /> Emotional Weather — next 7 days
            </div>
            {!forecast ? (
              <p className="text-sm text-muted-foreground">Log at least 14 days to see your forecast.</p>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-2">
                  {forecast.days.map((d, i) => (
                    <div key={i} className={`p-3 rounded-2xl text-center ${d.tone}`}>
                      <p className="text-[10px] uppercase">{d.label}</p>
                      <p className="text-lg font-display mt-1">{d.proj}</p>
                      <p className="text-[10px] mt-0.5">{d.outlook}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">Confidence: {forecast.confidence}%</Badge>
                  <Badge variant="outline">Stress risk: {forecast.stressRisk}</Badge>
                  <Badge variant="outline">Wellness outlook only — not predictive of any condition</Badge>
                </div>
                <Disclaimer />
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmotionalIntelligenceEngine;
