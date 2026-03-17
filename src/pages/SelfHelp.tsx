import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen, Play, Clock, Heart, Search, Wind, Brain,
  Sun, Moon, Sparkles, Leaf, Users, ArrowRight, Star,
  Headphones, BookmarkPlus, CheckCircle, Timer
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const categories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "anxiety", label: "Anxiety", icon: Wind },
  { id: "depression", label: "Depression", icon: Moon },
  { id: "stress", label: "Stress", icon: Brain },
  { id: "sleep", label: "Sleep", icon: Moon },
  { id: "mindfulness", label: "Mindfulness", icon: Leaf },
  { id: "relationships", label: "Relationships", icon: Users },
];

const exercises = [
  {
    id: "e1", title: "4-7-8 Breathing", description: "Calm anxiety with this powerful breathing pattern",
    duration: "5 min", category: "anxiety", difficulty: "Beginner", type: "exercise",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
  },
  {
    id: "e2", title: "Body Scan Meditation", description: "Release tension through mindful body awareness",
    duration: "15 min", category: "mindfulness", difficulty: "Beginner", type: "exercise",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&q=80",
  },
  {
    id: "e3", title: "Progressive Muscle Relaxation", description: "Systematically release physical stress",
    duration: "12 min", category: "stress", difficulty: "Beginner", type: "exercise",
    image: "https://images.unsplash.com/photo-1474418397713-2f1091553e69?w=400&q=80",
  },
  {
    id: "e4", title: "Gratitude Journaling Prompt", description: "Write about 3 things you're grateful for today",
    duration: "10 min", category: "depression", difficulty: "Beginner", type: "exercise",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80",
  },
  {
    id: "e5", title: "Sleep Hygiene Routine", description: "Build a calming pre-sleep wind-down ritual",
    duration: "20 min", category: "sleep", difficulty: "Beginner", type: "exercise",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=80",
  },
  {
    id: "e6", title: "Loving-Kindness Meditation", description: "Cultivate compassion for yourself and others",
    duration: "15 min", category: "mindfulness", difficulty: "Intermediate", type: "exercise",
    image: "https://images.unsplash.com/photo-1602192509154-0b900ee1f851?w=400&q=80",
  },
];

const courses = [
  {
    id: "c1", title: "Understanding Anxiety", description: "Evidence-based techniques for managing anxiety disorders and panic attacks",
    lessons: 12, duration: "4 weeks", category: "anxiety", rating: 4.9, enrolled: 25420, creator: "Dr. Sarah Johnson",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80",
  },
  {
    id: "c2", title: "Mindfulness-Based Stress Reduction", description: "8-week MBSR program for stress management and emotional regulation",
    lessons: 24, duration: "8 weeks", category: "mindfulness", rating: 4.8, enrolled: 38650, creator: "Dr. Jon Kabat-Zinn",
    image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=400&q=80",
  },
  {
    id: "c3", title: "CBT for Depression", description: "Challenge negative thought patterns and build healthier thinking habits",
    lessons: 18, duration: "6 weeks", category: "depression", rating: 4.9, enrolled: 29340, creator: "Dr. David Burns",
    image: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=400&q=80",
  },
  {
    id: "c4", title: "Better Sleep Science", description: "Understand circadian rhythms and optimize your sleep quality naturally",
    lessons: 10, duration: "3 weeks", category: "sleep", rating: 4.8, enrolled: 41250, creator: "Dr. Matthew Walker",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=80",
  },
  {
    id: "c5", title: "Building Healthy Relationships", description: "Communication skills, boundary-setting, and conflict resolution",
    lessons: 15, duration: "5 weeks", category: "relationships", rating: 4.7, enrolled: 19890, creator: "Dr. John Gottman",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
  },
  {
    id: "c6", title: "Stress Resilience Training", description: "Build psychological resilience for high-pressure situations",
    lessons: 14, duration: "4 weeks", category: "stress", rating: 4.7, enrolled: 32150, creator: "Dr. Kelly McGonigal",
    image: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&q=80",
  },
];

const articles = [
  { id: "a1", title: "10 Signs You May Be Experiencing Burnout", readTime: "5 min", category: "stress", saves: 1240 },
  { id: "a2", title: "How to Practice Self-Compassion Daily", readTime: "4 min", category: "mindfulness", saves: 980 },
  { id: "a3", title: "Understanding Your Attachment Style", readTime: "7 min", category: "relationships", saves: 2100 },
  { id: "a4", title: "The Science Behind Deep Breathing", readTime: "3 min", category: "anxiety", saves: 1560 },
  { id: "a5", title: "Creating a Mental Health Morning Routine", readTime: "6 min", category: "depression", saves: 1870 },
  { id: "a6", title: "Digital Detox: Reclaiming Your Peace", readTime: "5 min", category: "stress", saves: 890 },
];

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } },
};

const SelfHelp = () => {
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSection, setActiveSection] = useState<"exercises" | "courses" | "articles">("exercises");

  const toggleSave = (id: string) => {
    setSavedResources(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    toast.success(savedResources.includes(id) ? "Removed from saved" : "Saved for later");
  };

  const filterByCategory = <T extends { category: string; title: string; description?: string }>(items: T[]) =>
    items.filter(item => {
      const matchesCat = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-calm-sage-light/60 text-calm-sage mb-4">
              <Leaf className="w-4 h-4" /> Self-Care Resources
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              Nurture Your Mind
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Guided exercises, expert courses, and curated articles to support your mental wellness journey.
            </p>
          </motion.div>

          {/* Awareness Banner */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-calm-sage-light/40 via-calm-sky-light/40 to-calm-lavender-light/40 border border-border/30">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-calm-sage mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Mental health is just as important as physical health</p>
                <p className="text-xs text-muted-foreground">
                  1 in 4 people will experience a mental health condition. You're not alone — these resources are here to help you build resilience, self-awareness, and inner peace. Take it one step at a time. 💚
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-card border-border/50 rounded-xl"
              />
            </div>
          </motion.div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full gap-1.5 ${activeCategory === cat.id ? "bg-calm-sage text-white hover:bg-calm-sage/90" : "bg-card hover:bg-muted"}`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Section tabs */}
          <div className="flex gap-1 justify-center mb-8 bg-muted/50 rounded-xl p-1 max-w-sm mx-auto">
            {([
              { key: "exercises", label: "Exercises", icon: Play },
              { key: "courses", label: "Courses", icon: BookOpen },
              { key: "articles", label: "Articles", icon: BookmarkPlus },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === tab.key
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Exercises */}
          {activeSection === "exercises" && (
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filterByCategory(exercises).map(ex => (
                <motion.div key={ex.id} variants={itemVariants}>
                  <Card className="overflow-hidden border-border/40 hover:shadow-soft transition-all group cursor-pointer">
                    <div className="relative h-40 overflow-hidden">
                      <img src={ex.image} alt={ex.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <Badge className="absolute top-3 left-3 bg-white/90 text-foreground text-xs">{ex.difficulty}</Badge>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-sm">
                        <Timer className="w-3.5 h-3.5" /> {ex.duration}
                      </div>
                      <button onClick={() => toggleSave(ex.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition">
                        <Heart className={`w-4 h-4 ${savedResources.includes(ex.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{ex.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ex.description}</p>
                      <Button size="sm" className="mt-3 w-full bg-calm-sage hover:bg-calm-sage/90 text-white rounded-lg gap-1.5">
                        <Play className="w-3.5 h-3.5" /> Start Exercise
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Courses */}
          {activeSection === "courses" && (
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filterByCategory(courses).map(course => (
                <motion.div key={course.id} variants={itemVariants}>
                  <Card className="overflow-hidden border-border/40 hover:shadow-soft transition-all group cursor-pointer">
                    <div className="relative h-40 overflow-hidden">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-sm">
                        <Clock className="w-3.5 h-3.5" /> {course.duration}
                        <span className="w-1 h-1 bg-white/60 rounded-full" />
                        {course.lessons} lessons
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{course.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {course.rating}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {(course.enrolled / 1000).toFixed(1)}k enrolled</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">by {course.creator}</p>
                      <Button size="sm" variant="outline" className="mt-3 w-full rounded-lg gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Start Course
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Articles */}
          {activeSection === "articles" && (
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="grid gap-3 max-w-2xl mx-auto">
              {filterByCategory(articles.map(a => ({ ...a, description: a.title }))).map(article => (
                <motion.div key={article.id} variants={itemVariants}>
                  <Card className="border-border/40 hover:shadow-soft transition-all cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-calm-lavender-light/60 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-calm-lavender" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm">{article.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                          <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {article.saves}</span>
                        </div>
                      </div>
                      <button onClick={() => toggleSave(article.id)}>
                        <Heart className={`w-4 h-4 ${savedResources.includes(article.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                      </button>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {((activeSection === "exercises" && filterByCategory(exercises).length === 0) ||
            (activeSection === "courses" && filterByCategory(courses).length === 0) ||
            (activeSection === "articles" && filterByCategory(articles.map(a => ({ ...a, description: a.title }))).length === 0)) && (
            <div className="text-center py-16">
              <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No resources found. Try a different category or search term.</p>
            </div>
          )}

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-calm-sage-light/30 to-calm-sky-light/30 border border-border/30">
            <Sun className="w-8 h-8 text-calm-sage mx-auto mb-3" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Need personalized support?</h2>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Book a session with a professional counselor for tailored guidance on your wellness journey.
            </p>
            <Button className="bg-calm-sage hover:bg-calm-sage/90 text-white rounded-xl gap-2" onClick={() => window.location.href = '/consultation'}>
              Book a Counselor <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SelfHelp;
