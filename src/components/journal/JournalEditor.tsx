import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Smile, Meh, Frown, BookOpen, Hash, Sparkles, BatteryCharging, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { JournalEntry } from '@/components/journal/types';
import { SUGGESTED_TAGS } from '@/components/journal/types';

interface JournalEditorProps {
  isOpen: boolean;
  entry: Partial<JournalEntry>;
  onClose: () => void;
  onSave: (entry: Partial<JournalEntry>) => void;
  isEditing?: boolean;
}

export const JournalEditor = ({ isOpen, entry, onClose, onSave, isEditing = false }: JournalEditorProps) => {
  const [currentEntry, setCurrentEntry] = useState(entry);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setCurrentEntry(entry);
  }, [entry]);

  const handleSave = () => {
    if (!currentEntry.title || !currentEntry.content) return;
    onSave(currentEntry);
  };

  const addTag = () => {
    if (newTag.trim() && !currentEntry.tags?.includes(newTag.trim())) {
      setCurrentEntry(prev => ({ ...prev, tags: [...(prev.tags || []), newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentEntry(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tagToRemove) || [] }));
  };

  const moodOptions = [
    { value: 'happy', icon: Smile, label: 'Light', color: 'text-calm-sage' },
    { value: 'neutral', icon: Meh, label: 'Steady', color: 'text-calm-sky' },
    { value: 'sad', icon: Frown, label: 'Heavy', color: 'text-calm-lavender' },
  ];

  const wordCount = currentEntry.content?.split(' ').filter(Boolean).length || 0;

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}>
        <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-glass border-border/50 bg-card">
          <CardHeader className="border-b border-border/30 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-display">
                <BookOpen className="w-5 h-5 text-calm-lavender" />
                {isEditing ? 'Edit Entry' : 'New Journal Entry'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-lg">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 p-5">
            <div className="grid gap-5 lg:grid-cols-[1.8fr_1fr]">
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Title</label>
                  <Input placeholder="Give this reflection a name" value={currentEntry.title || ''}
                    onChange={e => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="text-base font-medium bg-muted/30 border-border/50 rounded-xl" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">How are you feeling?</label>
                  <div className="flex flex-wrap gap-2">
                    {moodOptions.map(({ value, icon: Icon, color, label }) => (
                      <Button key={value} type="button" variant={currentEntry.mood === value ? "default" : "outline"} size="sm"
                        onClick={() => setCurrentEntry(prev => ({ ...prev, mood: value as JournalEntry['mood'] }))}
                        className={`flex items-center gap-1.5 rounded-full ${currentEntry.mood === value ? 'bg-calm-sage text-primary-foreground' : ''}`}>
                        <Icon className={`w-4 h-4 ${currentEntry.mood === value ? 'text-primary-foreground' : color}`} /> {label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Your thoughts</label>
                  <Textarea placeholder="Write freely — this is your private, calm space to notice what is true today..."
                    value={currentEntry.content || ''}
                    onChange={e => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[220px] resize-none bg-muted/30 border-border/50 rounded-xl leading-relaxed" />
                  <div className="text-xs text-muted-foreground mt-1">{wordCount} words</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <BatteryCharging className="w-4 h-4 text-calm-sky" /> Energy check-in
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={currentEntry.energy ?? 5}
                    onChange={e => setCurrentEntry(prev => ({ ...prev, energy: Number(e.target.value) }))}
                    className="w-full accent-calm-sage"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span className="font-medium text-foreground">{currentEntry.energy ?? 5}/10</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Heart className="w-4 h-4 text-calm-lavender" /> Gratitude note
                  </div>
                  <Textarea
                    placeholder="One thing that felt kind, supportive, or comforting today"
                    value={currentEntry.gratitude || ''}
                    onChange={e => setCurrentEntry(prev => ({ ...prev, gratitude: e.target.value }))}
                    className="min-h-[100px] resize-none bg-background border-border/50 rounded-xl"
                  />
                </div>

                <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Sparkles className="w-4 h-4 text-calm-sage" /> Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentEntry.tags?.map((tag, idx) => (
                      <Badge key={idx} variant="secondary"
                        className="flex items-center gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive text-xs"
                        onClick={() => removeTag(tag)}>
                        {tag} <X className="w-2.5 h-2.5" />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TAGS.map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => !currentEntry.tags?.includes(tag) && setCurrentEntry(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }))}
                        className="rounded-full text-xs"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Add a tag" value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 bg-background border-border/50 rounded-lg" />
                    <Button type="button" variant="outline" size="sm" onClick={addTag} className="rounded-lg">
                      <Hash className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-border/30">
              <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={handleSave} disabled={!currentEntry.title || !currentEntry.content}
                className="flex-1 bg-calm-sage hover:bg-calm-sage/90 text-white rounded-xl gap-1.5">
                <Save className="w-4 h-4" /> {isEditing ? 'Update' : 'Save Entry'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
