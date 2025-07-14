
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Heart, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad';
  date: string;
  tags: string[];
  favorite?: boolean;
}

interface JournalStatsProps {
  entries: JournalEntry[];
}

export const JournalStats = ({ entries }: JournalStatsProps) => {
  const totalEntries = entries.length;
  const totalWords = entries.reduce((sum, entry) => sum + entry.content.split(' ').length, 0);
  const favoriteEntries = entries.filter(entry => entry.favorite).length;
  
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantMood = Object.entries(moodCounts).reduce((a, b) => 
    moodCounts[a[0]] > moodCounts[b[0]] ? a : b, ['neutral', 0])[0];

  const stats = [
    {
      title: 'Total Entries',
      value: totalEntries,
      icon: Calendar,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      title: 'Words Written',
      value: totalWords.toLocaleString(),
      icon: BarChart3,
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    {
      title: 'Favorites',
      value: favoriteEntries,
      icon: Heart,
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
    {
      title: 'Mood Trend',
      value: dominantMood === 'happy' ? '😊' : dominantMood === 'sad' ? '😔' : '😐',
      icon: TrendingUp,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50'
    }
  ];

  if (totalEntries === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.title}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
