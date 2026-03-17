import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Tag, Smile, Meh, Frown, BookOpen, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad';
  date: string;
  tags: string[];
}

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
    { value: 'happy', icon: Smile, label: 'Happy', color: 'text-green-500' },
    { value: 'neutral', icon: Meh, label: 'Neutral', color: 'text-amber-500' },
    { value: 'sad', icon: Frown, label: 'Sad', color: 'text-rose-400' },
  ];

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}>
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-glass border-border/50 bg-card">
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
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Title</label>
              <Input placeholder="What's on your mind?" value={currentEntry.title || ''}
                onChange={e => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                className="text-base font-medium bg-muted/30 border-border/50 rounded-xl" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">How are you feeling?</label>
              <div className="flex gap-2">
                {moodOptions.map(({ value, icon: Icon, color, label }) => (
                  <Button key={value} variant={currentEntry.mood === value ? "default" : "outline"} size="sm"
                    onClick={() => setCurrentEntry(prev => ({ ...prev, mood: value as any }))}
                    className={`flex items-center gap-1.5 rounded-lg ${currentEntry.mood === value ? 'bg-calm-sage text-white' : ''}`}>
                    <Icon className={`w-4 h-4 ${currentEntry.mood === value ? 'text-white' : color}`} /> {label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Your thoughts</label>
              <Textarea placeholder="Write freely — this is your safe space..."
                value={currentEntry.content || ''}
                onChange={e => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[180px] resize-none bg-muted/30 border-border/50 rounded-xl leading-relaxed" />
              <div className="text-xs text-muted-foreground mt-1">{currentEntry.content?.split(' ').filter(Boolean).length || 0} words</div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {currentEntry.tags?.map((tag, idx) => (
                  <Badge key={idx} variant="secondary"
                    className="flex items-center gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive text-xs"
                    onClick={() => removeTag(tag)}>
                    {tag} <X className="w-2.5 h-2.5" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add a tag" value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 bg-muted/30 border-border/50 rounded-lg" />
                <Button variant="outline" size="sm" onClick={addTag} className="rounded-lg">
                  <Hash className="w-3.5 h-3.5" />
                </Button>
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
