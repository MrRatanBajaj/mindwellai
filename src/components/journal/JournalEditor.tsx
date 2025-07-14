
import { useState } from 'react';
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

  const handleSave = () => {
    if (!currentEntry.title || !currentEntry.content) return;
    onSave(currentEntry);
  };

  const addTag = () => {
    if (newTag.trim() && !currentEntry.tags?.includes(newTag.trim())) {
      setCurrentEntry(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const moodOptions = [
    { value: 'happy', icon: Smile, color: 'text-green-500', label: 'Happy' },
    { value: 'neutral', icon: Meh, color: 'text-yellow-500', label: 'Neutral' },
    { value: 'sad', icon: Frown, color: 'text-red-500', label: 'Sad' }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="w-6 h-6 text-primary" />
              {isEditing ? 'Edit Entry' : 'New Journal Entry'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              placeholder="What's your entry about?"
              value={currentEntry.title || ''}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
              className="text-lg font-medium"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">How are you feeling?</label>
            <div className="flex gap-2">
              {moodOptions.map(({ value, icon: Icon, color, label }) => (
                <Button
                  key={value}
                  variant={currentEntry.mood === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentEntry(prev => ({ ...prev, mood: value as any }))}
                  className="flex items-center gap-2"
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Your thoughts</label>
            <Textarea
              placeholder="Write about your day, thoughts, feelings, or anything on your mind..."
              value={currentEntry.content || ''}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[200px] resize-none"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {currentEntry.content?.split(' ').length || 0} words
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {currentEntry.tags?.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeTag(tag)}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag (e.g., work, family, goals)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={addTag}>
                <Hash className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!currentEntry.title || !currentEntry.content}
              className="flex-1 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isEditing ? 'Update Entry' : 'Save Entry'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
