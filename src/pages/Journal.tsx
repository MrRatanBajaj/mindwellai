
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Edit3, Save, Search, Filter, BookOpen, Heart, Smile, Meh, Frown } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad';
  date: string;
  tags: string[];
}

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: '',
    content: '',
    mood: 'neutral',
    tags: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const saveEntry = () => {
    if (!currentEntry.title || !currentEntry.content) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: currentEntry.title!,
      content: currentEntry.content!,
      mood: currentEntry.mood || 'neutral',
      date: new Date().toISOString(),
      tags: currentEntry.tags || []
    };

    setEntries(prev => [newEntry, ...prev]);
    setCurrentEntry({ title: '', content: '', mood: 'neutral', tags: [] });
    setIsWriting(false);
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile className="w-5 h-5 text-green-500" />;
      case 'sad': return <Frown className="w-5 h-5 text-red-500" />;
      default: return <Meh className="w-5 h-5 text-yellow-500" />;
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMoodFilter === 'all' || entry.mood === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Journal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Express your thoughts, track your emotions, and reflect on your journey
          </p>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <Button
            onClick={() => setIsWriting(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <Edit3 className="w-5 h-5" />
            New Entry
          </Button>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All', icon: Filter },
                { value: 'happy', label: 'Happy', icon: Smile },
                { value: 'neutral', label: 'Neutral', icon: Meh },
                { value: 'sad', label: 'Sad', icon: Frown }
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={selectedMoodFilter === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMoodFilter(value)}
                  className="flex items-center gap-1"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isWriting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8"
            >
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Write Your Thoughts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Entry title..."
                    value={currentEntry.title}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="text-lg font-medium"
                  />

                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-medium">Mood:</span>
                    {[
                      { value: 'happy', icon: Smile, color: 'text-green-500' },
                      { value: 'neutral', icon: Meh, color: 'text-yellow-500' },
                      { value: 'sad', icon: Frown, color: 'text-red-500' }
                    ].map(({ value, icon: Icon, color }) => (
                      <Button
                        key={value}
                        variant={currentEntry.mood === value ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentEntry(prev => ({ ...prev, mood: value as any }))}
                        className="flex items-center gap-1"
                      >
                        <Icon className={`w-4 h-4 ${color}`} />
                      </Button>
                    ))}
                  </div>

                  <Textarea
                    placeholder="What's on your mind today?"
                    value={currentEntry.content}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[200px] resize-none"
                  />

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsWriting(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={saveEntry}
                      disabled={!currentEntry.title || !currentEntry.content}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Entry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold line-clamp-1">
                        {entry.title}
                      </CardTitle>
                      {getMoodIcon(entry.mood)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-4 text-sm leading-relaxed">
                      {entry.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredEntries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              {entries.length === 0 ? "Start Your Journey" : "No entries found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {entries.length === 0 
                ? "Write your first journal entry to begin reflecting on your thoughts and emotions."
                : "Try adjusting your search or filters to find what you're looking for."
              }
            </p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Journal;
