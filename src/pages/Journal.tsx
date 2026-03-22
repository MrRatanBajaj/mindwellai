import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Search, BookOpen, Star, Flame, Lightbulb, BatteryCharging, Sparkles, TrendingUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JournalEntryCard } from '@/components/journal/JournalEntry';
import { JournalEditor } from '@/components/journal/JournalEditor';
import { Card, CardContent } from '@/components/ui/card';
import { JOURNAL_PROMPTS, JOURNAL_STORAGE_KEY } from '@/components/journal/types';
import type { JournalEntry } from '@/components/journal/types';

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({ title: '', content: '', mood: 'neutral', tags: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const saveEntry = (entryData: Partial<JournalEntry>) => {
    if (!entryData.title || !entryData.content) return;
    if (editingEntry) {
      setEntries(prev => prev.map(e => e.id === editingEntry.id ? { ...e, ...entryData } : e));
      setEditingEntry(null);
    } else {
      const newEntry: JournalEntry = {
        id: Date.now().toString(), title: entryData.title!, content: entryData.content!,
        mood: entryData.mood || 'neutral', date: new Date().toISOString(),
        tags: entryData.tags || [], favorite: false,
      };
      setEntries(prev => [newEntry, ...prev]);
    }
     setCurrentEntry({ title: '', content: '', mood: 'neutral', tags: [], energy: 5, gratitude: '' });
    setIsWriting(false);
  };

  const deleteEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));
  const toggleFavorite = (id: string) => setEntries(prev => prev.map(e => e.id === id ? { ...e, favorite: !e.favorite } : e));
  const editEntry = (entry: JournalEntry) => { setEditingEntry(entry); setCurrentEntry(entry); setIsWriting(true); };
  const closeEditor = () => { setIsWriting(false); setEditingEntry(null); setCurrentEntry({ title: '', content: '', mood: 'neutral', tags: [], energy: 5, gratitude: '' }); };

  // Streak calculation
  const getStreak = () => {
    if (entries.length === 0) return 0;
    const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today); checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sorted.some(e => e.date.startsWith(dateStr))) streak++;
      else if (i > 0) break;
    }
    return streak;
  };

  const totalWords = entries.reduce((s, e) => s + e.content.split(' ').length, 0);
  const favoriteCount = entries.filter(e => e.favorite).length;
  const averageEnergy = entries.length ? Math.round(entries.reduce((sum, entry) => sum + (entry.energy ?? 5), 0) / entries.length) : 0;
  const gratitudeCount = entries.filter(entry => entry.gratitude?.trim()).length;
  const moodSummary = entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});
  const strongestMood = Object.entries(moodSummary).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
  const randomPrompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];

  const filtered = entries
    .filter(e => {
      const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchMood = selectedMoodFilter === 'all' || e.mood === selectedMoodFilter;
      const matchFav = !showFavoritesOnly || e.favorite;
      return matchSearch && matchMood && matchFav;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 rounded-[2rem] border border-border/40 bg-gradient-to-br from-calm-lavender-light/40 via-background to-calm-sage-light/30 p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-calm-lavender-light/60 text-calm-lavender mb-4">
                  <BookOpen className="w-4 h-4" /> Wellness Journal
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">Your reflective space for healing and clarity</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Capture emotions, energy, gratitude, and patterns that matter — all inside your own private mental wellness record.
                </p>
              </div>
              <Card className="border-border/40 bg-card/80 shadow-soft">
                <CardContent className="p-5 space-y-3">
                  <div className="text-sm font-medium text-foreground">This week&apos;s emotional snapshot</div>
                  <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Most frequent mood</p>
                      <p className="text-lg font-semibold text-foreground capitalize">{strongestMood}</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-calm-sage" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Avg. energy</p>
                      <p className="mt-1 font-semibold text-foreground">{averageEnergy || 0}/10</p>
                    </div>
                    <div className="rounded-2xl bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Gratitude notes</p>
                      <p className="mt-1 font-semibold text-foreground">{gratitudeCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Stats Row */}
          {entries.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Entries", value: entries.length, icon: BookOpen, color: "bg-calm-sky-light/60 text-calm-sky" },
                { label: "Words", value: totalWords.toLocaleString(), icon: Edit3, color: "bg-calm-sage-light/60 text-calm-sage" },
                { label: "Streak", value: `${getStreak()}d`, icon: Flame, color: "bg-amber-100 text-amber-600" },
                 { label: "Favorites", value: favoriteCount, icon: Star, color: "bg-calm-lavender-light/60 text-calm-lavender" },
              ].map((stat, i) => (
                <Card key={i} className="border-border/40">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] mb-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className="p-5 rounded-2xl bg-calm-lavender-light/30 border border-border/30 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-calm-lavender shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Therapist-inspired writing prompt</p>
                <p className="text-sm text-muted-foreground italic mt-1">"{randomPrompt}"</p>
                <Button size="sm" onClick={() => { setCurrentEntry(prev => ({ ...prev, content: randomPrompt + '\n\n' })); setIsWriting(true); }}
                  className="mt-3 bg-calm-lavender hover:bg-calm-lavender/90 text-primary-foreground rounded-lg shrink-0">
                  Write from prompt
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Card className="border-border/40">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-calm-sky-light/50 flex items-center justify-center">
                    <BatteryCharging className="w-5 h-5 text-calm-sky" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Average energy</p>
                    <p className="font-semibold text-foreground">{averageEnergy || 0}/10 across entries</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/40">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-calm-sage-light/50 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-calm-sage" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Gratitude practice</p>
                    <p className="font-semibold text-foreground">{gratitudeCount} entries include gratitude</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
            <Button onClick={() => setIsWriting(true)}
              className="bg-calm-sage hover:bg-calm-sage/90 text-white rounded-xl gap-2 shadow-soft">
              <Edit3 className="w-4 h-4" /> New Entry
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search entries..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 w-56 h-9 bg-card border-border/50 rounded-lg text-sm" />
              </div>
              <Button size="sm" variant={showFavoritesOnly ? "default" : "outline"} onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`rounded-lg gap-1 ${showFavoritesOnly ? 'bg-rose-500 text-white' : ''}`}>
                <Star className="w-3.5 h-3.5" /> Favorites
              </Button>
            </div>
          </div>

          {/* Mood Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { value: 'all', label: 'All', emoji: '✨' },
              { value: 'happy', label: 'Happy', emoji: '😊' },
              { value: 'neutral', label: 'Neutral', emoji: '😐' },
              { value: 'sad', label: 'Sad', emoji: '😔' },
            ].map(m => (
              <Button key={m.value} size="sm" variant={selectedMoodFilter === m.value ? "default" : "outline"}
                onClick={() => setSelectedMoodFilter(m.value)}
                className={`rounded-full gap-1.5 ${selectedMoodFilter === m.value ? 'bg-calm-sage text-white' : 'bg-card'}`}>
                {m.emoji} {m.label}
              </Button>
            ))}
          </div>

          {/* Editor */}
          <JournalEditor isOpen={isWriting} entry={currentEntry} onClose={closeEditor} onSave={saveEntry} isEditing={!!editingEntry} />

          {/* Entries Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((entry, index) => (
                <JournalEntryCard key={entry.id} entry={entry} index={index} onEdit={editEntry} onDelete={deleteEntry} onToggleFavorite={toggleFavorite} />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="w-16 h-16 bg-calm-lavender-light/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-calm-lavender" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {entries.length === 0 ? "Begin Your Journey" : "No entries found"}
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                {entries.length === 0
                  ? "Writing helps process emotions and build self-awareness. Start with today's prompt!"
                  : "Try adjusting your search or mood filter."}
              </p>
              {entries.length === 0 && (
                <Button onClick={() => setIsWriting(true)} className="mt-4 bg-calm-sage hover:bg-calm-sage/90 text-white rounded-xl">
                  Write Your First Entry
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Journal;
