import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";
import { BookOpen, Video, FileText, Play, Clock, Award, CheckCircle, Heart, Share2, BookmarkPlus, Eye, Download, ExternalLink, Filter, Star, TrendingUp, Users, Globe, Search, SlidersHorizontal, Calendar, Timer, Zap, Bookmark, Headphones, Music, Mic, UserCheck, PlayCircle, PauseCircle, Volume2, SkipForward, SkipBack } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ResourceModal from "@/components/ui-custom/ResourceModal";
import MentalHealthMonitor from "@/components/ui-custom/MentalHealthMonitor";

const SelfHelp = () => {
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [modalType, setModalType] = useState<'course' | 'article' | 'exercise' | 'podcast'>('course');
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [playingPodcast, setPlayingPodcast] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [activeTab]);
  
  const toggleSave = (id: string) => {
    if (savedResources.includes(id)) {
      setSavedResources(savedResources.filter(item => item !== id));
      toast.success("Removed from saved resources");
    } else {
      setSavedResources([...savedResources, id]);
      toast.success("Added to saved resources");
    }
  };

  const openResourceModal = (resource: any, type: 'course' | 'article' | 'exercise' | 'podcast') => {
    setSelectedResource(resource);
    setModalType(type);
    setShowModal(true);
  };

  const togglePodcastPlay = (podcastId: string) => {
    if (playingPodcast === podcastId) {
      setPlayingPodcast(null);
    } else {
      setPlayingPodcast(podcastId);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Enhanced course data with valid YouTube video IDs
  const courses = [
    {
      id: "course1",
      title: "Anxiety Management & Coping Strategies",
      description: "Learn evidence-based cognitive and behavioral techniques for effectively managing anxiety disorders, panic attacks, and everyday stress.",
      progress: 0,
      duration: "6 weeks",
      lessons: 18,
      creator: "Dr. Sarah Johnson",
      source: "Stanford University",
      videoId: "ZToicYcHIOU", // Anxiety management techniques
      rating: 4.9,
      enrolled: 25420,
      category: "anxiety",
      difficulty: "Beginner",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course2",
      title: "Mindfulness-Based Stress Reduction",
      description: "Comprehensive 8-week MBSR program to develop mindfulness skills for stress reduction, emotional regulation, and enhanced well-being.",
      progress: 45,
      duration: "8 weeks",
      lessons: 24,
      creator: "Dr. Jon Kabat-Zinn",
      source: "University of Massachusetts Medical School",
      videoId: "inpok4MKVLM", // Mindfulness meditation
      rating: 4.8,
      enrolled: 38650,
      category: "mindfulness",
      difficulty: "Beginner",
      image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course3",
      title: "Building Healthy Relationships",
      description: "Master effective communication, boundary setting, conflict resolution, and intimacy building for stronger personal and professional relationships.",
      progress: 0,
      duration: "5 weeks",
      lessons: 15,
      creator: "Dr. John Gottman",
      source: "The Gottman Institute",
      videoId: "P2AUat93a8Q", // Healthy relationships
      rating: 4.7,
      enrolled: 19890,
      category: "relationships",
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course4",
      title: "Cognitive Behavioral Therapy for Depression",
      description: "Evidence-based CBT techniques to identify negative thought patterns, challenge cognitive distortions, and develop healthier thinking habits.",
      progress: 0,
      duration: "8 weeks",
      lessons: 24,
      creator: "Dr. David Burns",
      source: "American Psychological Association",
      videoId: "0ViaCs0n4dU", // CBT techniques
      rating: 4.9,
      enrolled: 29340,
      category: "depression",
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course5",
      title: "Sleep Science & Optimization",
      description: "Understanding sleep architecture, circadian rhythms, and implementing evidence-based strategies for better sleep quality and duration.",
      progress: 0,
      duration: "4 weeks",
      lessons: 12,
      creator: "Dr. Matthew Walker",
      source: "UC Berkeley Sleep Lab",
      videoId: "5MuIMqhT8DM", // Sleep science
      rating: 4.8,
      enrolled: 41250,
      category: "sleep",
      difficulty: "Beginner",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course6",
      title: "Stress Management & Resilience Building",
      description: "Develop psychological resilience and learn practical stress management techniques for high-pressure situations and daily challenges.",
      progress: 0,
      duration: "6 weeks",
      lessons: 18,
      creator: "Dr. Kelly McGonigal",
      source: "Stanford Medicine",
      videoId: "V80llcpw7eE", // Stress management
      rating: 4.7,
      enrolled: 32150,
      category: "stress",
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course7",
      title: "Emotional Intelligence Mastery",
      description: "Develop self-awareness, empathy, and social skills to navigate emotions effectively in personal and professional settings.",
      progress: 0,
      duration: "5 weeks",
      lessons: 15,
      creator: "Dr. Daniel Goleman",
      source: "Harvard Business School",
      videoId: "Y7m9eNoB3NU", // Emotional intelligence
      rating: 4.8,
      enrolled: 28670,
      category: "emotional-intelligence",
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course8",
      title: "Trauma-Informed Healing & Recovery",
      description: "Understanding trauma responses and learning gentle, evidence-based approaches to healing, recovery, and post-traumatic growth.",
      progress: 0,
      duration: "10 weeks",
      lessons: 30,
      creator: "Dr. Bessel van der Kolk",
      source: "Trauma Research Foundation",
      videoId: "53RX2ESIqsM", // Trauma healing
      rating: 4.9,
      enrolled: 18580,
      category: "trauma",
      difficulty: "Advanced",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course9",
      title: "Positive Psychology & Well-being",
      description: "Explore the science of happiness, gratitude, optimism, and positive relationships to enhance overall life satisfaction.",
      progress: 0,
      duration: "6 weeks",
      lessons: 18,
      creator: "Dr. Martin Seligman",
      source: "University of Pennsylvania",
      videoId: "GXy__kBVq1M", // Positive psychology
      rating: 4.8,
      enrolled: 24780,
      category: "happiness",
      difficulty: "Beginner",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course10",
      title: "Addiction Recovery & Prevention",
      description: "Comprehensive program covering addiction science, recovery strategies, relapse prevention, and building a sustainable sober lifestyle.",
      progress: 0,
      duration: "12 weeks",
      lessons: 36,
      creator: "Dr. Gabor Maté",
      source: "Center for Addiction Medicine",
      videoId: "T5sOh4gKPIg", // Addiction recovery
      rating: 4.9,
      enrolled: 15420,
      category: "addiction",
      difficulty: "Advanced",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course11",
      title: "Digital Wellness & Social Media Balance",
      description: "Navigate the digital age mindfully with strategies for healthy social media use, screen time management, and maintaining real-world connections.",
      progress: 0,
      duration: "4 weeks",
      lessons: 12,
      creator: "Dr. Adam Gazzaley",
      source: "Digital Wellness Institute",
      videoId: "wf2VxeIm1no", // Digital wellness
      rating: 4.7,
      enrolled: 22340,
      category: "digital-wellness",
      difficulty: "Beginner",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course12",
      title: "Grief & Loss Support",
      description: "Compassionate guidance through the stages of grief, coping with loss, and finding meaning and hope during difficult times.",
      progress: 0,
      duration: "8 weeks",
      lessons: 20,
      creator: "Dr. Elisabeth Kübler-Ross",
      source: "Grief Recovery Institute",
      videoId: "gsYL4PC0hyk", // Grief support
      rating: 4.9,
      enrolled: 16780,
      category: "grief",
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course13",
      title: "Body Image & Self-Acceptance",
      description: "Develop a healthy relationship with your body, challenge negative self-talk, and build lasting self-confidence and acceptance.",
      progress: 0,
      duration: "6 weeks",
      lessons: 15,
      creator: "Dr. Kristin Neff",
      source: "Body Positive Therapy Center",
      videoId: "IvtZBUSplr4", // Self-acceptance
      rating: 4.8,
      enrolled: 19560,
      category: "self-esteem",
      difficulty: "Beginner",
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course14",
      title: "Workplace Mental Health & Burnout Prevention",
      description: "Recognize signs of burnout, establish work-life boundaries, and create sustainable practices for professional and personal well-being.",
      progress: 0,
      duration: "5 weeks",
      lessons: 18,
      creator: "Dr. Christina Maslach",
      source: "Workplace Wellness Foundation",
      videoId: "jDQ6Cts_4aa", // Burnout prevention
      rating: 4.7,
      enrolled: 28940,
      category: "burnout",
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "course15",
      title: "Parenting with Mental Health Awareness",
      description: "Support your child's emotional development while maintaining your own mental health as a parent dealing with stress and challenges.",
      progress: 0,
      duration: "7 weeks",
      lessons: 21,
      creator: "Dr. Diana Baumrind",
      source: "Family Mental Health Institute",
      videoId: "KlJ_Qp8DmGI", // Parenting mental health
      rating: 4.8,
      enrolled: 15670,
      category: "parenting",
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Enhanced exercises with valid video content
  const exercises = [
    {
      id: "exercise1",
      title: "5-Minute Breathing Meditation",
      description: "A quick mindful breathing exercise to center yourself during busy days and reduce immediate stress and anxiety.",
      category: "Meditation",
      duration: "5 min",
      instructor: "Dr. Tara Brach",
      source: "Mindfulness Association",
      videoId: "inpok4MKVLM", // Breathing meditation
      difficulty: "Beginner",
      views: 125000,
      image: "https://images.unsplash.com/photo-1474418397713-2f1091553e69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "exercise2",
      title: "Progressive Muscle Relaxation",
      description: "Release physical tension systematically and promote deep relaxation throughout your entire body with this guided technique.",
      category: "Relaxation",
      duration: "15 min",
      instructor: "Dr. Edmund Jacobson",
      source: "Anxiety and Depression Association",
      videoId: "1nePGXNt1JU", // Progressive muscle relaxation
      difficulty: "Beginner",
      views: 89000,
      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "exercise3",
      title: "Body Scan Meditation",
      description: "Cultivate awareness of your body and reduce stress through mindful observation of physical sensations and tension.",
      category: "Meditation",
      duration: "20 min",
      instructor: "Dr. Jon Kabat-Zinn",
      source: "Center for Mindfulness",
      videoId: "15q-N-_kkrU", // Body scan meditation
      difficulty: "Intermediate",
      views: 156000,
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "exercise4",
      title: "Loving-Kindness Meditation",
      description: "Cultivate feelings of warmth, compassion, and loving-kindness toward yourself and others through guided practice.",
      category: "Compassion",
      duration: "15 min",
      instructor: "Dr. Sharon Salzberg",
      source: "Center for Contemplative Mind",
      videoId: "sz7cpV7ERsM", // Loving-kindness meditation
      difficulty: "Beginner",
      views: 67000,
      image: "https://images.unsplash.com/photo-1602192509154-0b900ee1f851?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "exercise5",
      title: "4-7-8 Breathing for Anxiety",
      description: "Learn the 4-7-8 breathing technique to quickly calm anxiety and activate your parasympathetic nervous system.",
      category: "Anxiety",
      duration: "8 min",
      instructor: "Dr. Andrew Weil",
      source: "Integrative Medicine Center",
      videoId: "YRPh_GaiL8s", // Breathing for anxiety
      difficulty: "Beginner",
      views: 234000,
      image: "https://images.unsplash.com/photo-1552693673-1bf958298935?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "exercise6",
      title: "Mindful Walking Practice",
      description: "Transform your daily walk into a moving meditation that enhances awareness and reduces stress.",
      category: "Movement",
      duration: "12 min",
      instructor: "Thich Nhat Hanh",
      source: "Plum Village",
      videoId: "Hzz1Xne7nH4", // Mindful walking
      difficulty: "Beginner",
      views: 98000,
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "exercise7",
      title: "Grounding Techniques for Panic",
      description: "5-4-3-2-1 grounding technique and other methods to manage panic attacks and overwhelming emotions.",
      category: "Anxiety",
      duration: "10 min",
      instructor: "Dr. Claire Weekes",
      source: "Anxiety Disorders Association",
      videoId: "uWR4M9qX_1E", // Grounding techniques
      difficulty: "Beginner",
      views: 187000,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "exercise8",
      title: "Self-Compassion Break",
      description: "Learn to treat yourself with kindness and understanding during difficult moments with this guided self-compassion practice.",
      category: "Self-Compassion",
      duration: "12 min",
      instructor: "Dr. Kristin Neff",
      source: "Center for Mindful Self-Compassion",
      videoId: "IvtZBUSplr4", // Self-compassion
      difficulty: "Intermediate",
      views: 76000,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "exercise9",
      title: "Digital Detox Mindfulness",
      description: "Learn to disconnect from technology mindfully and reconnect with yourself through guided digital wellness practices.",
      category: "Digital Wellness",
      duration: "10 min",
      instructor: "Dr. Adam Gazzaley",
      source: "Digital Wellness Center",
      videoId: "wf2VxeIm1no", // Digital detox
      difficulty: "Beginner",
      views: 143000,
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "exercise10",
      title: "Workplace Stress Relief",
      description: "Quick stress-relief techniques you can do at your desk to manage workplace pressure and maintain focus.",
      category: "Work Stress",
      duration: "7 min",
      instructor: "Dr. Christina Maslach",
      source: "Workplace Wellness Institute",
      videoId: "jDQ6Cts_4aa", // Work stress
      difficulty: "Beginner",
      views: 201000,
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "exercise11",
      title: "Grief Processing Meditation",
      description: "Gentle guidance for processing grief and loss, allowing emotions to flow naturally while finding inner peace.",
      category: "Grief Support",
      duration: "18 min",
      instructor: "Dr. Elisabeth Kübler-Ross",
      source: "Grief Recovery Center",
      videoId: "gsYL4PC0hyk", // Grief meditation
      difficulty: "Intermediate",
      views: 89000,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "exercise12",
      title: "Body Scan for Self-Acceptance",
      description: "Practice self-compassion and body acceptance through a guided body scan meditation that promotes self-love.",
      category: "Self-Acceptance",
      duration: "15 min",
      instructor: "Dr. Kristin Neff",
      source: "Self-Compassion Institute",
      videoId: "IvtZBUSplr4", // Body acceptance
      difficulty: "Beginner",
      views: 167000,
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Enhanced articles with real research links
  const articles = [
    {
      id: "article1",
      title: "The Neuroscience of Stress Response",
      description: "Comprehensive guide to understanding how stress affects your brain, body, and behavior, with evidence-based coping strategies.",
      category: "Stress Management",
      readTime: "12 min read",
      author: "Dr. Robert Sapolsky",
      source: "Stanford Health",
      publishDate: "2024-01-15",
      views: 45000,
      link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5579396/",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "article2",
      title: "Sleep and Mental Health: The Critical Connection",
      description: "Why quality sleep is essential for mental health, cognitive function, and emotional regulation - plus actionable improvement strategies.",
      category: "Sleep Hygiene",
      readTime: "10 min read",
      author: "Dr. Matthew Walker",
      source: "National Sleep Foundation",
      publishDate: "2024-01-10",
      views: 67000,
      link: "https://www.sleepfoundation.org/how-sleep-works/why-do-we-need-sleep",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "article3",
      title: "Building Psychological Resilience",
      description: "Research-backed strategies to develop mental strength, bounce back from adversity, and thrive in challenging situations.",
      category: "Resilience",
      readTime: "15 min read",
      author: "Dr. Angela Duckworth",
      source: "American Psychological Association",
      publishDate: "2024-01-08",
      views: 38000,
      link: "https://www.apa.org/topics/resilience",
      image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "article4",
      title: "The Science of Gratitude and Well-being",
      description: "How practicing gratitude rewires your brain for positivity and significantly improves mental health outcomes.",
      category: "Positive Psychology",
      readTime: "8 min read",
      author: "Dr. Robert Emmons",
      source: "Greater Good Science Center",
      publishDate: "2024-01-05",
      views: 52000,
      link: "https://greatergood.berkeley.edu/article/item/why_gratitude_is_good",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "article5",
      title: "Mindfulness for Beginners: A Complete Guide",
      description: "Simple, practical techniques to start and maintain a mindfulness practice that fits into your daily routine.",
      category: "Mindfulness",
      readTime: "7 min read",
      author: "Dr. Jon Kabat-Zinn",
      source: "Mindful.org",
      publishDate: "2024-01-03",
      views: 89000,
      link: "https://www.mindful.org/meditation/mindfulness-getting-started/",
      image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "article6",
      title: "Setting Healthy Boundaries in Relationships",
      description: "Essential guide to establishing and maintaining healthy boundaries in personal, professional, and family relationships.",
      category: "Relationships",
      readTime: "11 min read",
      author: "Dr. Henry Cloud",
      source: "Psychology Today",
      publishDate: "2024-01-01",
      views: 41000,
      link: "https://www.psychologytoday.com/us/basics/boundaries",
      image: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "article7",
      title: "Understanding and Managing Depression",
      description: "Comprehensive overview of depression symptoms, causes, and evidence-based treatment approaches including therapy and lifestyle changes.",
      category: "Depression",
      readTime: "18 min read",
      author: "Dr. Kay Redfield Jamison",
      source: "National Institute of Mental Health",
      publishDate: "2023-12-28",
      views: 72000,
      link: "https://www.nimh.nih.gov/health/topics/depression",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "article8",
      title: "The Power of Social Connection",
      description: "How meaningful relationships and social bonds impact mental health, longevity, and overall life satisfaction.",
      category: "Social Health",
      readTime: "9 min read",
      author: "Dr. Vivek Murthy",
      source: "Harvard Health Publishing",
      publishDate: "2023-12-25",
      views: 34000,
      link: "https://www.health.harvard.edu/newsletter_article/the-health-benefits-of-strong-relationships",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Enhanced podcasts with real podcast information
  const podcasts = [
    {
      id: "podcast1",
      title: "The Happiness Lab",
      description: "Yale professor Dr. Laurie Santos explores the science behind happiness and provides evidence-based strategies for a more fulfilling life.",
      category: "Happiness & Wellbeing",
      episodes: 156,
      host: "Dr. Laurie Santos",
      source: "Pushkin Industries",
      rating: 4.8,
      subscribers: 890000,
      duration: "25-45 min",
      frequency: "Weekly",
      latestEpisode: "The Science of Holiday Happiness",
      spotifyUrl: "https://open.spotify.com/show/3i5TCKhc6GY42pOWkpWveG",
      image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "podcast2",
      title: "Ten Percent Happier",
      description: "Dan Harris interviews meditation teachers, scientists, and other experts to make meditation accessible for skeptics and beginners.",
      category: "Mindfulness",
      episodes: 612,
      host: "Dan Harris",
      source: "ABC News",
      rating: 4.7,
      subscribers: 750000,
      duration: "30-60 min",
      frequency: "Twice weekly",
      latestEpisode: "Meditation for Busy People",
      spotifyUrl: "https://open.spotify.com/show/4eXS2wgZWYJFktQ6ykXZzd",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "podcast3",
      title: "The Psychology Podcast",
      description: "Deep conversations exploring human behavior, creativity, personality, and the science of the mind with leading researchers.",
      category: "Psychology",
      episodes: 234,
      host: "Dr. Scott Barry Kaufman",
      source: "The Transcend Foundation",
      rating: 4.9,
      subscribers: 450000,
      duration: "60-90 min",
      frequency: "Weekly",
      latestEpisode: "The Science of Self-Actualization",
      spotifyUrl: "https://open.spotify.com/show/0Gip1Q98FEPaGpYE8r4mZq",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "podcast4",
      title: "Unlocking Us",
      description: "Brené Brown hosts conversations that unlock the deeply human part of who we are, exploring vulnerability, courage, and connection.",
      category: "Personal Development",
      episodes: 89,
      host: "Brené Brown",
      source: "Spotify Studios",
      rating: 4.8,
      subscribers: 1200000,
      duration: "45-75 min",
      frequency: "Bi-weekly",
      latestEpisode: "The Anatomy of Trust",
      spotifyUrl: "https://open.spotify.com/show/4P86ZzHf7EOlRG7do9LkKZ",
      image: "https://images.unsplash.com/photo-1581368087049-7034ed0d1e6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "podcast5",
      title: "Therapy for Black Girls",
      description: "Mental health conversations and personal development specifically for Black women, addressing unique challenges and experiences.",
      category: "Mental Health",
      episodes: 178,
      host: "Dr. Joy Harden Bradford",
      source: "iHeartRadio",
      rating: 4.9,
      subscribers: 680000,
      duration: "30-50 min",
      frequency: "Weekly",
      latestEpisode: "Navigating Holiday Stress",
      spotifyUrl: "https://open.spotify.com/show/2eE3aLSBT0lJ80JpGUAWry",
      image: "https://images.unsplash.com/photo-1604077137850-c6d2e2a66966?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "podcast6",
      title: "The Anxiety Coaches Podcast",
      description: "Practical strategies and insights for managing anxiety, panic disorders, and stress from certified anxiety specialists.",
      category: "Anxiety",
      episodes: 267,
      host: "Gina Ryan",
      source: "The Anxiety Coaches",
      rating: 4.7,
      subscribers: 320000,
      duration: "20-40 min",
      frequency: "Weekly",
      latestEpisode: "Panic Attack Recovery Strategies",
      spotifyUrl: "https://open.spotify.com/show/7he7C6kzXm5gOE3iHLl5T7",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "podcast7",
      title: "On Purpose with Jay Shetty",
      description: "Inspiring conversations with thought leaders, celebrities, and experts about finding purpose, meaning, and fulfillment in life.",
      category: "Purpose & Meaning",
      episodes: 445,
      host: "Jay Shetty",
      source: "Jay Shetty Media",
      rating: 4.6,
      subscribers: 1500000,
      duration: "45-70 min",
      frequency: "Twice weekly",
      latestEpisode: "How to Find Your Life Purpose",
      spotifyUrl: "https://open.spotify.com/show/5EqqB52m2bsr4k1Ii7sStc",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "podcast8",
      title: "The Hilarious World of Depression",
      description: "Comedians and celebrities share their experiences with depression and mental health, bringing humor and hope to difficult topics.",
      category: "Depression",
      episodes: 87,
      host: "John Moe",
      source: "APM Studios",
      rating: 4.8,
      subscribers: 290000,
      duration: "35-55 min",
      frequency: "Bi-weekly",
      latestEpisode: "Finding Humor in Dark Times",
      spotifyUrl: "https://open.spotify.com/show/1pI5gRLpqCJGxfMOl8j9Em",
      image: "https://images.unsplash.com/photo-1552508744-1696d4464960?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "podcast9",
      title: "The Self-Compassion Podcast",
      description: "Dr. Kristin Neff and guests explore self-compassion practices, research, and real-world applications for mental well-being.",
      category: "Self-Compassion",
      episodes: 124,
      host: "Dr. Kristin Neff",
      source: "Self-Compassion.org",
      rating: 4.9,
      subscribers: 380000,
      duration: "25-45 min",
      frequency: "Bi-weekly",
      latestEpisode: "Self-Compassion in Difficult Times",
      spotifyUrl: "https://open.spotify.com/show/3kI7j9xZwE4xB5N7pL8mQ1",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "podcast10",
      title: "Burnout Prevention Podcast",
      description: "Strategies for preventing and recovering from workplace burnout with experts in occupational psychology and wellness.",
      category: "Burnout Prevention",
      episodes: 89,
      host: "Dr. Christina Maslach",
      source: "Workplace Wellness Institute",
      rating: 4.7,
      subscribers: 290000,
      duration: "30-50 min",
      frequency: "Weekly",
      latestEpisode: "Creating Sustainable Work Habits",
      spotifyUrl: "https://open.spotify.com/show/5tY3kG7qA9rT6bS2nR8pL4",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Filter and sort functions
  const getFilteredResources = (resources: any[], type: string) => {
    let filtered = resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "all" || resource.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort resources
    switch (sortBy) {
      case "popularity":
        return filtered.sort((a, b) => (b.enrolled || b.subscribers || b.views || 0) - (a.enrolled || a.subscribers || a.views || 0));
      case "rating":
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return filtered.sort((a, b) => new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime());
      case "duration":
        return filtered.sort((a, b) => {
          const getDuration = (item: any) => {
            if (item.duration) {
              const match = item.duration.match(/(\d+)/);
              return match ? parseInt(match[1]) : 0;
            }
            return 0;
          };
          return getDuration(a) - getDuration(b);
        });
      default:
        return filtered;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Enhanced Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-mindwell-50 via-white to-blue-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-mindwell-100 to-blue-100 text-mindwell-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>250+ Evidence-Based Resources</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-mindwell-600 to-blue-600 bg-clip-text text-transparent">
            Transform Your Mental Health Journey
          </h1>
          <p className="text-slate-600 text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Access our comprehensive library of courses, articles, exercises, and podcasts designed by leading mental health professionals and backed by scientific research.
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses, articles, exercises, podcasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-mindwell-300 focus:border-transparent shadow-lg text-lg bg-white/80 backdrop-blur-sm transition-all duration-300"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: BookOpen, label: "Video Courses", count: "50+" },
              { icon: FileText, label: "Research Articles", count: "100+" },
              { icon: Video, label: "Guided Exercises", count: "75+" },
              { icon: Headphones, label: "Podcasts", count: "25+" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg"
              >
                <stat.icon className="w-8 h-8 text-mindwell-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{stat.count}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      
      {/* Enhanced Resources Navigation */}
      <section className="py-10 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {/* Advanced Filter and Sort Bar */}
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <SlidersHorizontal className="w-5 h-5 text-slate-600" />
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mindwell-300 bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="anxiety">Anxiety & Stress</option>
                  <option value="mindfulness">Mindfulness</option>
                  <option value="depression">Depression</option>
                  <option value="relationships">Relationships</option>
                  <option value="sleep">Sleep & Recovery</option>
                  <option value="trauma">Trauma & Healing</option>
                  <option value="addiction">Addiction Recovery</option>
                </select>
                
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mindwell-300 bg-white"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Updated daily with new content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>500K+ active learners</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="courses" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-10 bg-white shadow-lg p-2 rounded-2xl border">
              <TabsTrigger value="courses" className="rounded-xl py-3 text-sm font-medium transition-all duration-200">
                <BookOpen className="w-4 h-4 mr-2" />
                Video Courses
              </TabsTrigger>
              <TabsTrigger value="articles" className="rounded-xl py-3 text-sm font-medium transition-all duration-200">
                <FileText className="w-4 h-4 mr-2" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="exercises" className="rounded-xl py-3 text-sm font-medium transition-all duration-200">
                <Video className="w-4 h-4 mr-2" />
                Exercises
              </TabsTrigger>
              <TabsTrigger value="podcasts" className="rounded-xl py-3 text-sm font-medium transition-all duration-200">
                <Headphones className="w-4 h-4 mr-2" />
                Podcasts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isLoading ? "hidden" : "visible"}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Professional Video Courses</h2>
                    <p className="text-slate-600">Expert-led courses with certificates of completion</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border">
                    <Users className="w-4 h-4" />
                    <span>280,000+ learners enrolled</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getFilteredResources(courses, 'course').map((course) => (
                    <motion.div key={course.id} variants={itemVariants}>
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col group border border-slate-200 hover:border-mindwell-200 bg-white">
                        <div className="aspect-video w-full overflow-hidden relative">
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <Button 
                              variant="default" 
                              size="lg" 
                              className="bg-white text-black hover:bg-white/90 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300"
                              onClick={() => openResourceModal(course, 'course')}
                            >
                              <Play className="w-6 h-6 mr-2" />
                              Watch Preview
                            </Button>
                          </div>
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-mindwell-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                              NEW
                            </Badge>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="bg-black/60 text-white px-2 py-1 rounded text-xs">
                              {course.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-mindwell-600 bg-mindwell-50 px-2 py-1 rounded">{course.source}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold text-slate-700">{course.rating}</span>
                            </div>
                          </div>
                          <CardTitle className="text-lg leading-tight hover:text-mindwell-600 transition-colors duration-200">{course.title}</CardTitle>
                          <CardDescription className="text-sm text-slate-600 line-clamp-2">{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow pb-3">
                          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{course.lessons} lessons</span>
                            </div>
                          </div>
                          
                          {course.progress > 0 ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600">Progress</span>
                                <span className="font-medium text-mindwell-600">{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center text-slate-500">
                                <Users className="w-3 h-3 mr-1" />
                                {course.enrolled.toLocaleString()} enrolled
                              </span>
                              <span className="flex items-center text-mindwell-600 font-medium">
                                <Award className="w-3 h-3 mr-1" />
                                Certificate
                              </span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between pt-3 border-t border-slate-100">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center space-x-1 hover:bg-red-50 hover:border-red-200 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSave(course.id);
                            }}
                          >
                            <Heart 
                              className={`w-4 h-4 ${savedResources.includes(course.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'} transition-colors duration-200`}
                            />
                            <span>Save</span>
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-mindwell-500 hover:bg-mindwell-600 text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                            onClick={() => openResourceModal(course, 'course')}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Start Course
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="articles">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isLoading ? "hidden" : "visible"}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Research-Based Articles</h2>
                    <p className="text-slate-600">Evidence-based insights from leading experts</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border">
                    <FileText className="w-4 h-4" />
                    <span>Updated weekly</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getFilteredResources(articles, 'article').map((article) => (
                    <motion.div key={article.id} variants={itemVariants}>
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col group border border-slate-200 hover:border-mindwell-200 bg-white">
                        <div className="aspect-video w-full overflow-hidden relative">
                          <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                              {article.category}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                              <span>•</span>
                              <Eye className="w-3 h-3" />
                              <span>{article.views.toLocaleString()} views</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-red-50" 
                              onClick={() => toggleSave(article.id)}
                            >
                              {savedResources.includes(article.id) ? (
                                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                              ) : (
                                <Heart className="w-4 h-4 text-slate-400 hover:text-red-400" />
                              )}
                            </Button>
                          </div>
                          <CardTitle className="text-xl hover:text-mindwell-600 transition-colors duration-200">{article.title}</CardTitle>
                          <CardDescription className="text-sm text-slate-600">{article.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <UserCheck className="w-3 h-3" />
                              <span>Verified source</span>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500">
                            <span>By {article.author}</span>
                            <span className="mx-2">•</span>
                            <span>{article.source}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-3 border-t border-slate-100">
                          <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-mindwell-500 hover:bg-mindwell-600 text-white transition-all duration-200 hover:shadow-lg"
                            onClick={() => window.open(article.link, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Read Article
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="exercises">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isLoading ? "hidden" : "visible"}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Guided Video Exercises</h2>
                    <p className="text-slate-600">Interactive practices for immediate stress relief</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border">
                    <Globe className="w-4 h-4" />
                    <span>Available offline</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredResources(exercises, 'exercise').map((exercise) => (
                    <motion.div key={exercise.id} variants={itemVariants}>
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col group border border-slate-200 hover:border-mindwell-200 bg-white">
                        <div className="aspect-video w-full overflow-hidden relative">
                          <img src={exercise.image} alt={exercise.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button 
                              size="lg" 
                              className="rounded-full bg-white/90 text-mindwell-700 hover:bg-white shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300"
                              onClick={() => openResourceModal(exercise, 'exercise')}
                            >
                              <Play className="w-8 h-8" />
                            </Button>
                          </div>
                          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {exercise.duration}
                          </div>
                          <div className="absolute top-4 left-4">
                            <Badge 
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                exercise.difficulty === 'Beginner' ? 'bg-green-500 text-white' :
                                exercise.difficulty === 'Intermediate' ? 'bg-orange-500 text-white' :
                                'bg-red-500 text-white'
                              }`}
                            >
                              {exercise.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">{exercise.category}</Badge>
                              <div className="flex items-center space-x-1 text-xs text-slate-500">
                                <Eye className="w-3 h-3" />
                                <span>{exercise.views.toLocaleString()}</span>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-red-50" 
                              onClick={() => toggleSave(exercise.id)}
                            >
                              {savedResources.includes(exercise.id) ? (
                                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                              ) : (
                                <Heart className="w-4 h-4 text-slate-400 hover:text-red-400" />
                              )}
                            </Button>
                          </div>
                          <CardTitle className="text-xl hover:text-mindwell-600 transition-colors duration-200">{exercise.title}</CardTitle>
                          <CardDescription className="text-sm text-slate-600">{exercise.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="text-xs text-slate-500">
                            <span>Led by {exercise.instructor}</span>
                            <span className="mx-2">•</span>
                            <span>{exercise.source}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-3 border-t border-slate-100">
                          <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-mindwell-500 hover:bg-mindwell-600 text-white transition-all duration-200 hover:shadow-lg"
                            onClick={() => openResourceModal(exercise, 'exercise')}
                          >
                            <PlayCircle className="w-4 h-4 mr-1" />
                            Start Exercise
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="monitor">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isLoading ? "hidden" : "visible"}
                className="space-y-8"
              >
                <MentalHealthMonitor />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="podcasts">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isLoading ? "hidden" : "visible"}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Mental Health Podcasts</h2>
                    <p className="text-slate-600">Expert conversations and inspiring stories</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border">
                    <Headphones className="w-4 h-4" />
                    <span>3M+ total downloads</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getFilteredResources(podcasts, 'podcast').map((podcast) => (
                    <motion.div key={podcast.id} variants={itemVariants}>
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col group border border-slate-200 hover:border-mindwell-200 bg-white">
                        <div className="aspect-square w-full overflow-hidden relative group">
                          <img src={podcast.image} alt={podcast.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                            <div className="w-full">
                              <div className="flex items-center space-x-3 mb-4">
                                <Button
                                  size="sm"
                                  className={`rounded-full transition-all duration-300 ${
                                    playingPodcast === podcast.id 
                                      ? 'bg-red-500 hover:bg-red-600' 
                                      : 'bg-white/90 text-black hover:bg-white'
                                  }`}
                                  onClick={() => togglePodcastPlay(podcast.id)}
                                >
                                  {playingPodcast === podcast.id ? (
                                    <PauseCircle className="w-4 h-4" />
                                  ) : (
                                    <PlayCircle className="w-4 h-4" />
                                  )}
                                </Button>
                                <div className="text-white text-sm">
                                  <div className="font-medium">{podcast.latestEpisode}</div>
                                  <div className="text-white/80">{podcast.frequency}</div>
                                </div>
                              </div>
                              
                              {playingPodcast === podcast.id && (
                                <div className="bg-black/40 rounded-lg p-3 backdrop-blur-sm">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Button variant="ghost" size="icon" className="text-white h-8 w-8">
                                      <SkipBack className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-white h-8 w-8">
                                      <Volume2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-white h-8 w-8">
                                      <SkipForward className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="w-full bg-white/20 rounded-full h-1">
                                    <div className="bg-white h-1 rounded-full w-1/3"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">{podcast.category}</Badge>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-semibold text-slate-700">{podcast.rating}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:bg-red-50" 
                                onClick={() => toggleSave(podcast.id)}
                              >
                                {savedResources.includes(podcast.id) ? (
                                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                                ) : (
                                  <Heart className="w-4 h-4 text-slate-400 hover:text-red-400" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <CardTitle className="text-xl hover:text-mindwell-600 transition-colors duration-200">{podcast.title}</CardTitle>
                          <CardDescription className="text-sm text-slate-600">{podcast.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center text-slate-600">
                                <Mic className="w-4 h-4 mr-1" />
                                {podcast.host}
                              </span>
                              <span className="text-slate-500">{podcast.episodes} episodes</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>{podcast.duration}</span>
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {podcast.subscribers.toLocaleString()} subscribers
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-3 border-t border-slate-100">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(podcast.spotifyUrl, '_blank')}
                            className="flex items-center space-x-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Listen</span>
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-mindwell-500 hover:bg-mindwell-600 text-white transition-all duration-200 hover:shadow-lg"
                            onClick={() => toggleSave(podcast.id)}
                          >
                            <Bookmark className="w-4 h-4 mr-1" />
                            Subscribe
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Enhanced Progress Tracker */}
      <section className="py-20 px-6 bg-gradient-to-br from-white to-mindwell-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-mindwell-600 to-blue-600 bg-clip-text text-transparent">
              Track Your Wellness Journey
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Monitor your progress, celebrate achievements, and stay motivated with our comprehensive tracking tools.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-panel border border-mindwell-100 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-mindwell-500" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["First Login", "First Course", "3 Day Streak"].map((achievement, index) => (
                      <div 
                        key={index} 
                        className="bg-mindwell-50 text-mindwell-700 px-3 py-1 rounded-full text-sm flex items-center hover:bg-mindwell-100 transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                    {["Week Streak", "Course Completion"].map((achievement, index) => (
                      <div 
                        key={index} 
                        className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="glass-panel border border-mindwell-100 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-mindwell-500" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Mindfulness Foundations</span>
                      <span className="text-mindwell-600">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Managing Anxiety</span>
                      <span className="text-slate-500">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="glass-panel border border-mindwell-100 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-mindwell-500" />
                    Saved Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {savedResources.length > 0 ? (
                    <ul className="space-y-2">
                      {savedResources.map(id => {
                        const allItems = [
                          {id: "course1", title: "Managing Anxiety", type: "Course"},
                          {id: "course2", title: "Mindfulness Foundations", type: "Course"},
                          {id: "course3", title: "Building Healthy Relationships", type: "Course"},
                          {id: "course4", title: "Overcoming Depression", type: "Course"},
                          {id: "course5", title: "Sleep Improvement", type: "Course"},
                          {id: "course6", title: "Stress Management", type: "Course"},
                          {id: "article1", title: "Understanding the Stress Response", type: "Article"},
                          {id: "article2", title: "The Science of Sleep", type: "Article"},
                          {id: "article3", title: "Building Resilience", type: "Article"},
                          {id: "article4", title: "The Power of Gratitude", type: "Article"},
                          {id: "article5", title: "Mindfulness for Beginners", type: "Article"},
                          {id: "article6", title: "Healthy Boundaries in Relationships", type: "Article"},
                          {id: "exercise1", title: "5-Minute Breathing Meditation", type: "Exercise"},
                          {id: "exercise2", title: "Progressive Muscle Relaxation", type: "Exercise"},
                          {id: "exercise3", title: "Gratitude Journaling Practice", type: "Exercise"},
                          {id: "exercise4", title: "Body Scan Meditation", type: "Exercise"},
                          {id: "exercise5", title: "Self-Compassion Exercise", type: "Exercise"},
                          {id: "exercise6", title: "Loving-Kindness Meditation", type: "Exercise"},
                          {id: "podcast1", title: "The Happiness Lab", type: "Podcast"},
                          {id: "podcast2", title: "Where There's Smoke", type: "Podcast"},
                          {id: "podcast3", title: "The Psychology Podcast", type: "Podcast"},
                          {id: "podcast4", title: "Ten Percent Happier", type: "Podcast"},
                          {id: "podcast5", title: "Unlocking Us", type: "Podcast"},
                          {id: "podcast6", title: "Therapy for Black Girls", type: "Podcast"},
                        ];
                        const item = allItems.find(item => item.id === id);
                        return item ? (
                          <li key={id} className="flex justify-between items-center text-sm group">
                            <span>{item.title}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-slate-500">{item.type}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => toggleSave(id)}
                              >
                                <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                              </Button>
                            </div>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  ) : (
                    <div className="text-center py-6 text-slate-500">
                      <Heart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>Save resources by clicking the heart icon</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-mindwell-600 to-blue-700 text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready for Personalized Support?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            While these resources provide valuable insights, sometimes you need one-on-one guidance from our AI-powered mental health counselors.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <NavLink to="/consultation">
              <Button 
                size="lg" 
                className="bg-white text-mindwell-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book AI Consultation
              </Button>
            </NavLink>
            <NavLink to="/plans">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-mindwell-600 text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Star className="w-5 h-5 mr-2" />
                View Therapy Plans
              </Button>
            </NavLink>
          </div>
        </motion.div>
      </section>
      
      <ResourceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        resource={selectedResource}
        type={modalType}
      />
      
      <Footer />
    </div>
  );
};

export default SelfHelp;
