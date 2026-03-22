export type JournalMood = 'happy' | 'neutral' | 'sad';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: JournalMood;
  date: string;
  tags: string[];
  favorite?: boolean;
  energy?: number;
  gratitude?: string;
}

export const JOURNAL_STORAGE_KEY = 'journalEntries';

export const JOURNAL_PROMPTS = [
  'What made you feel emotionally safe today?',
  'Which thought kept returning today, and what might it be asking for?',
  'Write about one small win that deserves more credit.',
  'What helped you feel grounded when stress showed up?',
  'What boundary would support your peace this week?',
  'If your body could speak, what would it ask for right now?',
  'What are you learning about yourself in this season?',
  'Write a kind message to the version of you that is tired.',
];

export const SUGGESTED_TAGS = [
  'gratitude',
  'stress',
  'sleep',
  'family',
  'work',
  'healing',
  'calm',
  'reflection',
];