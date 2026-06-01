import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

/**
 * Emotional Color Brain Map™
 * Daily: pick color + emotion + energy (1–5). Renders a 6-month visual map.
 * Stored client-side, per-user (privacy rule).
 */

const COLORS = [
  { id: 'blue',     label: 'Calm',              hex: '#7FB3D5', desc: 'Steady, settled' },
  { id: 'green',    label: 'Recovery',          hex: '#A8C8A0', desc: 'Healing, growing' },
  { id: 'yellow',   label: 'Hopeful',           hex: '#F4D35E', desc: 'Light, optimistic' },
  { id: 'orange',   label: 'Energised',         hex: '#F4A261', desc: 'Driven, alive' },
  { id: 'red',      label: 'Stress overload',   hex: '#E76F51', desc: 'Tight, reactive' },
  { id: 'purple',   label: 'Reflective',        hex: '#A78BCF', desc: 'Deep, thoughtful' },
  { id: 'grey',     label: 'Emotional fatigue', hex: '#9AA0A6', desc: 'Numb, drained' },
  { id: 'pink',     label: 'Tender',            hex: '#F4B6C2', desc: 'Soft, vulnerable' },
];

const EMOTIONS = [
  'Anxious', 'Calm', 'Sad', 'Grateful', 'Angry', 'Lonely',
  'Hopeful', 'Overwhelmed', 'Focused', 'Tired', 'Loved', 'Restless',
];

type Entry = { date: string; color: string; emotion: string; energy: number };

const storageKey = (uid: string) => `emotional_brain_map:${uid}`;
const todayKey = () => new Date().toISOString().slice(0, 10);

const EmotionalBrainMap = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [color, setColor] = useState<string>('');
  const [emotion, setEmotion] = useState<string>('');
  const [energy, setEnergy] = useState<number>(3);

  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem(storageKey(user.id));
      setEntries(raw ? JSON.parse(raw) : []);
    } catch { setEntries([]); }
  }, [user]);

  const todays = useMemo(() => entries.find((e) => e.date === todayKey()), [entries]);

  useEffect(() => {
    if (todays) {
      setColor(todays.color); setEmotion(todays.emotion); setEnergy(todays.energy);
    }
  }, [todays]);

  const save = () => {
    if (!user) { toast.error('Sign in to save your map'); return; }
    if (!color || !emotion) { toast.error('Pick a color and an emotion'); return; }
    const next: Entry = { date: todayKey(), color, emotion, energy };
    const updated = [...entries.filter((e) => e.date !== next.date), next].sort((a, b) => a.date.localeCompare(b.date));
    setEntries(updated);
    localStorage.setItem(storageKey(user.id), JSON.stringify(updated));
    toast.success("Today's map saved");
  };

  // Build a 6-month grid: last ~180 days as a 18 cols x 10 rows heatmap (cols = weeks)
  const grid = useMemo(() => {
    const days: { date: string; entry?: Entry }[] = [];
    const map = new Map(entries.map((e) => [e.date, e]));
    const now = new Date();
    for (let i = 179; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, entry: map.get(key) });
    }
    return days;
  }, [entries]);

  const insights = useMemo(() => {
    if (entries.length < 7) return null;
    const last30 = entries.slice(-30);
    const counts: Record<string, number> = {};
    last30.forEach((e) => { counts[e.color] = (counts[e.color] || 0) + 1; });
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const dominantColor = COLORS.find((c) => c.id === dominant[0]);
    const stressDays = last30.filter((e) => e.color === 'red' || e.color === 'grey').length;
    const recoveryDays = last30.filter((e) => e.color === 'green' || e.color === 'blue').length;
    const avgEnergy = (last30.reduce((s, e) => s + e.energy, 0) / last30.length).toFixed(1);
    return { dominantColor, stressDays, recoveryDays, avgEnergy, total: last30.length };
  }, [entries]);

  return (
    <Card className="border-border/40 rounded-3xl overflow-hidden bg-gradient-to-br from-background to-secondary/30">
      <CardContent className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Brain className="w-3.5 h-3.5" /> Emotional Color Brain Map™
            </div>
            <p className="font-display text-xl md:text-2xl text-foreground mt-1">
              How does today <span className="serif-italic text-primary">feel</span>?
            </p>
          </div>
          {todays && (
            <span className="inline-flex items-center gap-1 text-[11px] text-calm-sage font-medium">
              <Check className="w-3.5 h-3.5" /> Logged today
            </span>
          )}
        </div>

        {/* Color picker */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-5">
          {COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => setColor(c.id)}
              className={`group relative aspect-square rounded-2xl transition-all ${color === c.id ? 'ring-2 ring-offset-2 ring-foreground scale-105' : 'hover:scale-105'}`}
              style={{ background: c.hex }}
              title={`${c.label} — ${c.desc}`}
              aria-label={c.label}
            >
              {color === c.id && <Check className="w-4 h-4 text-white absolute top-1.5 right-1.5 drop-shadow" />}
              <span className="absolute inset-x-0 -bottom-5 text-[9px] text-muted-foreground text-center opacity-0 group-hover:opacity-100 transition">
                {c.label}
              </span>
            </button>
          ))}
        </div>
        {color && (
          <p className="text-xs text-muted-foreground -mt-2 mb-4">
            <span className="font-medium text-foreground">{COLORS.find((c) => c.id === color)?.label}</span>
            {' · '}{COLORS.find((c) => c.id === color)?.desc}
          </p>
        )}

        {/* Emotion chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {EMOTIONS.map((e) => (
            <button
              key={e}
              onClick={() => setEmotion(e)}
              className={`px-3 py-1 rounded-full text-xs transition ${emotion === e ? 'bg-foreground text-background' : 'bg-secondary text-foreground/70 hover:bg-secondary/80'}`}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Energy slider */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Energy level</span>
            <span className="font-medium text-foreground">{energy}/5</span>
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

        <Button onClick={save} size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 mb-6">
          {todays ? 'Update today' : 'Save today'} <Sparkles className="w-3.5 h-3.5" />
        </Button>

        {/* 6-month grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
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
        </div>

        {/* Pattern insight */}
        {insights && insights.dominantColor && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-4 rounded-2xl bg-card border border-border/50"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Your pattern
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Across your last {insights.total} logged days, your dominant shade has been{' '}
              <span className="font-medium" style={{ color: insights.dominantColor.hex }}>
                {insights.dominantColor.label.toLowerCase()}
              </span>
              . You logged <span className="font-medium">{insights.stressDays}</span> stress-overload days and{' '}
              <span className="font-medium">{insights.recoveryDays}</span> recovery days, with an average energy of{' '}
              <span className="font-medium">{insights.avgEnergy}/5</span>.
            </p>
            {insights.stressDays >= insights.recoveryDays && insights.stressDays >= 5 && (
              <p className="text-xs text-muted-foreground mt-2">
                Stress days are outpacing recovery — try a short breathing session or talk to Aria tonight.
              </p>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionalBrainMap;
