import { motion } from 'framer-motion';
import { Calendar, Edit3, Trash2, Heart, MessageCircle, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad';
  date: string;
  tags: string[];
  favorite?: boolean;
}

interface JournalEntryCardProps {
  entry: JournalEntry;
  index: number;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const getMoodIcon = (mood: string) => {
  const icons = {
    happy: { icon: '😊', bg: 'bg-green-50' },
    neutral: { icon: '😐', bg: 'bg-amber-50' },
    sad: { icon: '😔', bg: 'bg-rose-50' }
  };
  return icons[mood as keyof typeof icons] || icons.neutral;
};

export const JournalEntryCard = ({ entry, index, onEdit, onDelete, onToggleFavorite }: JournalEntryCardProps) => {
  const moodData = getMoodIcon(entry.mood);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="group h-full"
    >
      <Card className="h-full border-border/40 bg-card hover:shadow-soft transition-all duration-300">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold line-clamp-1 text-foreground">{entry.title}</CardTitle>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                <Calendar className="w-3 h-3" />
                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-8 h-8 rounded-lg ${moodData.bg} flex items-center justify-center`}>
                <span className="text-sm">{moodData.icon}</span>
              </div>
              <button onClick={() => onToggleFavorite(entry.id)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition opacity-0 group-hover:opacity-100 ${entry.favorite ? 'text-rose-500 bg-rose-50' : 'text-muted-foreground hover:bg-muted'}`}>
                <Heart className={`w-3.5 h-3.5 ${entry.favorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-3">{entry.content}</p>

          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {entry.tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0 bg-muted/60">
                  {tag}
                </Badge>
              ))}
              {entry.tags.length > 3 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">+{entry.tags.length - 3}</Badge>
              )}
            </div>
          )}

          <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MessageCircle className="w-2.5 h-2.5" /> {entry.content.split(' ').length} words
            </span>
            <div className="flex gap-0.5">
              <Button variant="ghost" size="sm" onClick={() => onEdit(entry)} className="h-7 w-7 p-0">
                <Edit3 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(entry.id)} className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
