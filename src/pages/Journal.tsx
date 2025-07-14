
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Search, Filter, BookOpen, Star, Calendar as CalendarIcon, MoreHorizontal } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JournalEntryCard } from '@/components/journal/JournalEntry';
import { JournalEditor } from '@/components/journal/JournalEditor';
import { JournalStats } from '@/components/journal/JournalStats';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad';
  date: string;
  tags: string[];
  favorite?: boolean;
}

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: '',
    content: '',
    mood: 'neutral',
    tags: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'mood'>('date');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

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

  const saveEntry = (entryData: Partial<JournalEntry>) => {
    if (!entryData.title || !entryData.content) return;

    if (editingEntry) {
      // Update existing entry
      setEntries(prev => prev.map(entry => 
        entry.id === editingEntry.id 
          ? { ...entry, ...entryData }
          : entry
      ));
      setEditingEntry(null);
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: entryData.title!,
        content: entryData.content!,
        mood: entryData.mood || 'neutral',
        date: new Date().toISOString(),
        tags: entryData.tags || [],
        favorite: false
      };
      setEntries(prev => [newEntry, ...prev]);
    }

    setCurrentEntry({ title: '', content: '', mood: 'neutral', tags: [] });
    setIsWriting(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, favorite: !entry.favorite } : entry
    ));
  };

  const editEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setCurrentEntry(entry);
    setIsWriting(true);
  };

  const closeEditor = () => {
    setIsWriting(false);
    setEditingEntry(null);
    setCurrentEntry({ title: '', content: '', mood: 'neutral', tags: [] });
  };

  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesMood = selectedMoodFilter === 'all' || entry.mood === selectedMoodFilter;
      const matchesFavorite = !showFavoritesOnly || entry.favorite;
      return matchesSearch && matchesMood && matchesFavorite;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'mood':
          return a.mood.localeCompare(b.mood);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            My Journal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Capture your thoughts, track your emotions, and reflect on your journey through life
          </p>
        </motion.div>

        <JournalStats entries={entries} />

        {/* Enhanced Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Button
              onClick={() => setIsWriting(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Edit3 className="w-5 h-5" />
              New Entry
            </Button>

            <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search entries, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white/80 backdrop-blur-sm"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
                    <MoreHorizontal className="w-4 h-4 mr-2" />
                    Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white/95 backdrop-blur-sm">
                  <DropdownMenuItem onClick={() => setSortBy('date')}>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Sort by Date
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('title')}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Sort by Title
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
                    <Star className="w-4 h-4 mr-2" />
                    {showFavoritesOnly ? 'Show All' : 'Favorites Only'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { value: 'all', label: 'All Moods', emoji: '🌟' },
              { value: 'happy', label: 'Happy', emoji: '😊' },
              { value: 'neutral', label: 'Neutral', emoji: '😐' },
              { value: 'sad', label: 'Sad', emoji: '😔' }
            ].map(({ value, label, emoji }) => (
              <Button
                key={value}
                variant={selectedMoodFilter === value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMoodFilter(value)}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
              >
                <span>{emoji}</span>
                {label}
              </Button>
            ))}
          </div>
        </motion.div>

        <JournalEditor
          isOpen={isWriting}
          entry={currentEntry}
          onClose={closeEditor}
          onSave={saveEntry}
          isEditing={!!editingEntry}
        />

        {/* Enhanced Entries Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry, index) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                index={index}
                onEdit={editEntry}
                onDelete={deleteEntry}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredEntries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              {entries.length === 0 ? "Begin Your Journey" : "No entries found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {entries.length === 0 
                ? "Start documenting your thoughts, experiences, and emotions. Every great story begins with a single entry."
                : "Try adjusting your search or filters to find what you're looking for."
              }
            </p>
            {entries.length === 0 && (
              <Button
                onClick={() => setIsWriting(true)}
                className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg"
              >
                Write Your First Entry
              </Button>
            )}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Journal;
