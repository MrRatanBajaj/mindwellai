
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
    happy: { icon: '😊', color: 'text-green-500', bg: 'bg-green-50' },
    neutral: { icon: '😐', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    sad: { icon: '😔', color: 'text-red-500', bg: 'bg-red-50' }
  };
  return icons[mood as keyof typeof icons] || icons.neutral;
};

export const JournalEntryCard = ({ entry, index, onEdit, onDelete, onToggleFavorite }: JournalEntryCardProps) => {
  const moodData = getMoodIcon(entry.mood);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group h-full"
    >
      <Card className="h-full shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:bg-white/95">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold line-clamp-1 mb-2">
                {entry.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                {new Date(entry.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`w-10 h-10 rounded-full ${moodData.bg} flex items-center justify-center`}>
                <span className="text-lg">{moodData.icon}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(entry.id)}
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${entry.favorite ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Heart className={`w-4 h-4 ${entry.favorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 line-clamp-4 text-sm leading-relaxed mb-4">
            {entry.content}
          </p>
          
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {entry.tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {entry.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{entry.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle className="w-3 h-3" />
              {entry.content.split(' ').length} words
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(entry)}
                className="h-8 w-8 p-0"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(entry.id)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
