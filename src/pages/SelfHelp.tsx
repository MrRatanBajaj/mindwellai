import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  Heart,
  Leaf,
  Moon,
  Search,
  Sparkles,
  Sun,
  Wind,
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'All support', icon: Sparkles },
  { id: 'anxiety', label: 'Anxiety', icon: Wind },
  { id: 'stress', label: 'Stress', icon: Brain },
  { id: 'sleep', label: 'Sleep', icon: Moon },
  { id: 'mindfulness', label: 'Mindfulness', icon: Leaf },
  { id: 'mood', label: 'Mood care', icon: Sun },
];

const exercises = [
  { id: 'ex-1', title: '4-6 Grounding Breath', category: 'anxiety', duration: '4 min', description: 'Slow your nervous system with a therapist-approved breath rhythm.', steps: ['Inhale for 4', 'Exhale for 6', 'Repeat for 10 rounds'] },
  { id: 'ex-2', title: 'Worry Reset Sheet', category: 'stress', duration: '8 min', description: 'Separate facts, fears, and the next helpful action.', steps: ['Name the worry', 'List evidence', 'Choose one next step'] },
  { id: 'ex-3', title: 'Gentle Sleep Wind-down', category: 'sleep', duration: '12 min', description: 'A quiet evening routine to reduce racing thoughts before bed.', steps: ['Dim light', 'No scrolling', 'Body scan for 5 minutes'] },
  { id: 'ex-4', title: 'Self-Compassion Pause', category: 'mood', duration: '5 min', description: 'Use kind internal language during hard emotional moments.', steps: ['Notice the pain', 'Name it kindly', 'Offer yourself support'] },
  { id: 'ex-5', title: '5 Senses Reset', category: 'mindfulness', duration: '3 min', description: 'Return to the present when your mind feels overloaded.', steps: ['5 things you see', '4 you feel', '3 you hear'] },
  { id: 'ex-6', title: 'Boundary Rehearsal', category: 'stress', duration: '6 min', description: 'Practice a calm sentence for saying no without guilt.', steps: ['Write your boundary', 'Say it aloud', 'Keep it short and warm'] },
  { id: 'ex-7', title: 'Progressive Muscle Relaxation', category: 'anxiety', duration: '10 min', description: 'Systematically tense and release each muscle group to dissolve physical anxiety.', steps: ['Start with your toes', 'Tense for 5 seconds', 'Release and notice the calm'] },
  { id: 'ex-8', title: 'Gratitude Reflection', category: 'mood', duration: '5 min', description: 'Shift your focus toward positive aspects of your day.', steps: ['Write 3 things you are grateful for', 'Why each matters', 'Feel the warmth'] },
  { id: 'ex-9', title: 'Box Breathing', category: 'stress', duration: '4 min', description: 'A Navy SEAL technique to calm stress instantly.', steps: ['Inhale 4 sec', 'Hold 4 sec', 'Exhale 4 sec, Hold 4 sec'] },
  { id: 'ex-10', title: 'Sleep Body Scan', category: 'sleep', duration: '15 min', description: 'A guided awareness of each body part to ease into restful sleep.', steps: ['Lie down comfortably', 'Scan from head to toes', 'Release tension at each point'] },
  { id: 'ex-11', title: 'Mindful Walking', category: 'mindfulness', duration: '10 min', description: 'Walk slowly and notice every sensation — a moving meditation.', steps: ['Walk at half speed', 'Feel each footstep', 'Notice sounds around you'] },
  { id: 'ex-12', title: 'Emotional Check-In', category: 'mood', duration: '3 min', description: 'Name your current emotion without judgment.', steps: ['Pause and breathe', 'Name the emotion', 'Accept it without fixing'] },
];

const resources = [
  { id: 're-1', title: 'NIMH: Caring for Your Mental Health', category: 'mood', type: 'Guide', url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health', source: 'NIMH', description: 'Foundational mental health habits from a trusted clinical source.' },
  { id: 're-2', title: 'WHO: Mental Health Strengthening Tips', category: 'mindfulness', type: 'Guide', url: 'https://www.who.int/news-room/feature-stories/mental-well-being-resources-for-the-public', source: 'WHO', description: 'Simple, evidence-informed ways to support daily wellbeing.' },
  { id: 're-3', title: 'Mind: Managing Anxiety', category: 'anxiety', type: 'Article', url: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/', source: 'Mind', description: 'Practical strategies for panic, anxiety, and overwhelm.' },
  { id: 're-4', title: 'NHS: Stress Management', category: 'stress', type: 'Toolkit', url: 'https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-manage-stress/', source: 'NHS', description: 'Grounded techniques for work pressure and emotional fatigue.' },
  { id: 're-5', title: 'Sleep Foundation: Healthy Sleep Tips', category: 'sleep', type: 'Checklist', url: 'https://www.sleepfoundation.org/sleep-hygiene', source: 'Sleep Foundation', description: 'Create a sleep environment that supports emotional recovery.' },
  { id: 're-6', title: 'Mindful: Meditation Basics', category: 'mindfulness', type: 'Practice', url: 'https://www.mindful.org/how-to-meditate/', source: 'Mindful', description: 'A gentle beginner-friendly path into mindful awareness.' },
  { id: 're-7', title: 'Psychology Tools: CBT Thought Record', category: 'mood', type: 'Worksheet', url: 'https://www.psychologytools.com/', source: 'Psychology Tools', description: 'A classic CBT exercise for reframing negative thoughts.' },
  { id: 're-8', title: 'HelpGuide: Emotional Resilience', category: 'stress', type: 'Article', url: 'https://www.helpguide.org/mental-health/wellbeing/building-better-mental-health', source: 'HelpGuide', description: 'Build resilience habits when life feels emotionally heavy.' },
  { id: 're-9', title: 'Headspace: Free Meditation & Sleep', category: 'mindfulness', type: 'App', url: 'https://www.headspace.com/headspace-meditation-app', source: 'Headspace', description: 'Free guided meditations, focus music, and sleep sounds.' },
  { id: 're-10', title: 'Verywell Mind: Coping Strategies', category: 'stress', type: 'Guide', url: 'https://www.verywellmind.com/forty-healthy-coping-skills-4586742', source: 'Verywell Mind', description: '40+ healthy coping skills backed by mental health professionals.' },
  { id: 're-11', title: 'Anxiety Canada: MindShift CBT', category: 'anxiety', type: 'App', url: 'https://www.anxietycanada.com/resources/mindshift-cbt/', source: 'Anxiety Canada', description: 'Free CBT-based app for managing anxiety, worry, and panic.' },
  { id: 're-12', title: 'Harvard Health: Sleep & Mental Health', category: 'sleep', type: 'Article', url: 'https://www.health.harvard.edu/newsletter_article/sleep-and-mental-health', source: 'Harvard Health', description: 'Research-backed insights on the link between sleep and emotional wellbeing.' },
  { id: 're-13', title: 'Greater Good: Gratitude Journal', category: 'mood', type: 'Practice', url: 'https://greatergood.berkeley.edu/article/item/tips_for_keeping_a_gratitude_journal', source: 'UC Berkeley', description: 'Science-based gratitude journaling tips to boost happiness.' },
  { id: 're-14', title: 'beyondblue: Anxiety & Depression', category: 'anxiety', type: 'Guide', url: 'https://www.beyondblue.org.au/', source: 'beyondblue', description: 'Comprehensive free resources for anxiety, depression, and suicide prevention.' },
  { id: 're-15', title: 'Calm: Free Breathing Exercises', category: 'mindfulness', type: 'Tool', url: 'https://www.calm.com/breathe', source: 'Calm', description: 'Simple guided breathing exercises you can do anywhere, anytime.' },
  { id: 're-16', title: 'SAMHSA Helpline Resources', category: 'mood', type: 'Helpline', url: 'https://www.samhsa.gov/find-help/national-helpline', source: 'SAMHSA', description: 'Free, confidential 24/7 helpline for mental health and substance use.' },
  { id: 're-17', title: 'Tiny Buddha: Letting Go of Stress', category: 'stress', type: 'Article', url: 'https://tinybuddha.com/blog/category/letting-go/', source: 'Tiny Buddha', description: 'Warm, relatable articles on releasing stress and emotional burdens.' },
  { id: 're-18', title: 'NHS: 5 Steps to Mental Wellbeing', category: 'mindfulness', type: 'Guide', url: 'https://www.nhs.uk/mental-health/self-help/guides-and-tools/five-steps-to-mental-wellbeing/', source: 'NHS', description: 'Evidence-based steps: connect, be active, learn, give, be present.' },
];

const therapistTracks = [
  { title: 'For anxious mornings', description: 'Breathwork + grounding + one calming article.', category: 'anxiety' },
  { title: 'For burnout after work', description: 'Boundary reflection + stress toolkit + sleep reset.', category: 'stress' },
  { title: 'For low mood days', description: 'Self-compassion + gratitude + mood-care reading.', category: 'mood' },
];

const SelfHelp = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [savedResources, setSavedResources] = useState<string[]>([]);

  const storageKey = user ? `saved-self-help:${user.id}` : 'saved-self-help:guest';
  const completedKey = user ? `completed-self-help:${user.id}` : 'completed-self-help:guest';

  useEffect(() => {
    setSavedResources(JSON.parse(localStorage.getItem(storageKey) || '[]'));
    setCompletedExercises(JSON.parse(localStorage.getItem(completedKey) || '[]'));
  }, [storageKey, completedKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(savedResources));
  }, [savedResources, storageKey]);

  useEffect(() => {
    localStorage.setItem(completedKey, JSON.stringify(completedExercises));
  }, [completedExercises, completedKey]);

  const matches = (text: string) => text.toLowerCase().includes(searchQuery.toLowerCase());

  const filteredExercises = useMemo(() => exercises.filter((item) => {
    const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
    return categoryMatch && (!searchQuery || matches(item.title) || matches(item.description));
  }), [activeCategory, searchQuery]);

  const filteredResources = useMemo(() => resources.filter((item) => {
    const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
    return categoryMatch && (!searchQuery || matches(item.title) || matches(item.description) || matches(item.source));
  }), [activeCategory, searchQuery]);

  const toggleSaved = (id: string) => {
    setSavedResources((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const toggleCompleted = (id: string) => {
    setCompletedExercises((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-border/40 bg-gradient-to-br from-calm-sage-light/40 via-background to-calm-sky-light/30 p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-calm-sage-light/70 px-4 py-1.5 text-calm-sage mb-4">
                  <Leaf className="w-4 h-4" /> Therapist-guided self help
                </div>
                <h1 className="font-display text-4xl md:text-5xl text-foreground font-bold mb-3">Support your mind with calm, practical tools</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Explore exercises, trusted therapy resources, and gentle routines designed to help with anxiety, stress, sleep, and emotional recovery.
                </p>
              </div>
              <Card className="border-border/40 bg-card/80 shadow-soft">
                <CardContent className="p-5 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Your support summary</p>
                    <p className="text-2xl font-semibold text-foreground mt-1">{completedExercises.length} practices completed</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Saved links</p>
                      <p className="mt-1 font-semibold text-foreground">{savedResources.length}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Focus areas</p>
                      <p className="mt-1 font-semibold text-foreground">{categories.length - 1}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-4 text-sm text-muted-foreground">
                    Healing doesn&apos;t need to be dramatic — small, repeated acts of care build real emotional strength.
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          <section className="grid gap-4 lg:grid-cols-3">
            {therapistTracks.map((track, index) => (
              <motion.div key={track.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                <Card className="h-full border-border/40">
                  <CardContent className="p-5 space-y-3">
                    <Badge variant="secondary" className="rounded-full">{track.category}</Badge>
                    <h2 className="text-lg font-semibold text-foreground">{track.title}</h2>
                    <p className="text-sm text-muted-foreground">{track.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>

          <section className="space-y-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search exercises, guides, and therapy resources" className="pl-10 h-11 rounded-xl border-border/50 bg-card" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className={`rounded-full gap-1.5 ${activeCategory === category.id ? 'bg-calm-sage text-primary-foreground' : ''}`}
                >
                  <category.icon className="w-3.5 h-3.5" />
                  {category.label}
                </Button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Daily practices</h2>
                <p className="text-sm text-muted-foreground">Short, structured exercises you can start immediately.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredExercises.map((exercise) => {
                const completed = completedExercises.includes(exercise.id);
                return (
                  <Card key={exercise.id} className="border-border/40 h-full">
                    <CardContent className="p-5 h-full flex flex-col">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <Badge variant="secondary" className="rounded-full">{exercise.category}</Badge>
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {exercise.duration}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{exercise.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{exercise.description}</p>
                      <div className="space-y-2 mb-5">
                        {exercise.steps.map((step) => (
                          <div key={step} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-calm-sage mt-0.5 shrink-0" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      <Button onClick={() => toggleCompleted(exercise.id)} className={`mt-auto rounded-xl ${completed ? 'bg-calm-sky text-primary-foreground hover:bg-calm-sky/90' : 'bg-calm-sage text-primary-foreground hover:bg-calm-sage/90'}`}>
                        {completed ? 'Completed today' : 'Mark as completed'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Trusted therapy resources</h2>
              <p className="text-sm text-muted-foreground">High-quality external links from respected mental health organizations.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredResources.map((resource) => {
                const saved = savedResources.includes(resource.id);
                return (
                  <Card key={resource.id} className="border-border/40">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="rounded-full">{resource.type}</Badge>
                            <span className="text-xs text-muted-foreground">{resource.source}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">{resource.title}</h3>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => toggleSaved(resource.id)} className="rounded-full">
                          {saved ? 'Saved' : 'Save'}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <a href={resource.url} target="_blank" rel="noreferrer" className="inline-flex">
                        <Button className="rounded-xl bg-calm-lavender text-primary-foreground hover:bg-calm-lavender/90 gap-2">
                          Open resource <ArrowRight className="w-4 h-4" />
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section>
            <Card className="border-border/40 bg-gradient-to-r from-calm-sage-light/30 via-background to-calm-lavender-light/30">
              <CardContent className="p-6 md:p-8 text-center">
                <Heart className="w-8 h-8 text-calm-sage mx-auto mb-3" />
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Need deeper personal support?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-5">
                  Self-help is powerful, and professional support can make it even more effective when life feels bigger than what you can hold alone.
                </p>
                <Button className="rounded-xl bg-calm-sage text-primary-foreground hover:bg-calm-sage/90 gap-2" onClick={() => window.location.href = '/consultation'}>
                  Book a counselor <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SelfHelp;