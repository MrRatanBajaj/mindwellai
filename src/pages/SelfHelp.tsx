
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NavLink } from "react-router-dom";
import { BookOpen, Video, FileText, Play, Clock, Award, CheckCircle, Heart, Share2, BookmarkPlus, Eye, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const SelfHelp = () => {
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
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

  // Animation variants for staggered children
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-white to-mindwell-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto text-center"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6">
            Self-Help Resources
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Empower Your Mental Health Journey
          </h1>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            Explore our library of self-help resources designed to provide support, education, and practical tools for your wellbeing.
          </p>
          
          {/* Search input */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-mindwell-300 shadow-sm transition-all duration-300"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Resources Navigation */}
      <section className="py-10 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="courses" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-xl mx-auto mb-10 bg-white shadow-md p-1 rounded-full">
              <TabsTrigger value="courses" className="rounded-full py-2">
                <BookOpen className="w-4 h-4 mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="articles" className="rounded-full py-2">
                <FileText className="w-4 h-4 mr-2" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="exercises" className="rounded-full py-2">
                <Video className="w-4 h-4 mr-2" />
                Exercises
              </TabsTrigger>
              <TabsTrigger value="podcasts" className="rounded-full py-2">
                <Play className="w-4 h-4 mr-2" />
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
                <h2 className="text-2xl font-bold mb-6">Self-Paced Courses</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      id: "course1",
                      title: "Managing Anxiety",
                      description: "Learn effective cognitive and behavioral techniques for managing anxiety.",
                      progress: 0,
                      duration: "4 weeks",
                      lessons: 12,
                      creator: "Dr. Sarah Johnson",
                      source: "Open University",
                      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "course2",
                      title: "Mindfulness Foundations",
                      description: "Develop a mindfulness practice to reduce stress and improve well-being.",
                      progress: 45,
                      duration: "3 weeks",
                      lessons: 9,
                      creator: "Dr. Mark Williams",
                      source: "MIT OpenCourseWare",
                      image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "course3",
                      title: "Building Healthy Relationships",
                      description: "Enhance your relationship skills through effective communication and boundaries.",
                      progress: 0,
                      duration: "5 weeks",
                      lessons: 15,
                      creator: "Dr. John Gottman",
                      source: "Harvard Open Learning",
                      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "course4",
                      title: "Overcoming Depression",
                      description: "Evidence-based strategies to manage and overcome depression symptoms.",
                      progress: 0,
                      duration: "6 weeks",
                      lessons: 18,
                      creator: "Dr. David Burns",
                      source: "Stanford Free Courses",
                      image: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "course5",
                      title: "Sleep Improvement",
                      description: "Techniques to improve sleep quality and establish healthy sleep patterns.",
                      progress: 0,
                      duration: "2 weeks",
                      lessons: 7,
                      creator: "Dr. Matthew Walker",
                      source: "Berkeley OpenEdX",
                      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "course6",
                      title: "Stress Management",
                      description: "Comprehensive approach to managing stress in daily life and work.",
                      progress: 0,
                      duration: "4 weeks",
                      lessons: 12,
                      creator: "Dr. Kelly McGonigal",
                      source: "Yale Open Courses",
                      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    }
                  ].map((course) => (
                    <motion.div key={course.id} variants={itemVariants}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <div className="aspect-video w-full overflow-hidden relative group">
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                            <Button variant="default" size="sm" className="bg-white text-black hover:bg-white/90">
                              <Play className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                          </div>
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">{course.source}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleSave(course.id)}>
                              {savedResources.includes(course.id) ? (
                                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                              ) : (
                                <Heart className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription>{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-1" />
                              <span>{course.lessons} lessons</span>
                            </div>
                          </div>
                          
                          {course.progress > 0 ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                          ) : (
                            <div className="flex items-center text-xs text-slate-500 mt-4">
                              <span className="flex items-center">
                                <Award className="w-3 h-3 mr-1 text-mindwell-500" />
                                By {course.creator}
                              </span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Source
                          </Button>
                          <Button size="sm" className="bg-mindwell-500 hover:bg-mindwell-600 text-white">
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
                <h2 className="text-2xl font-bold mb-6">Articles & Resources</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      id: "article1",
                      title: "Understanding the Stress Response",
                      description: "Learn how stress affects your body and mind, and what you can do about it.",
                      category: "Stress Management",
                      readTime: "8 min read",
                      author: "Dr. Robert Sapolsky",
                      source: "Stanford Health",
                      image: "https://images.unsplash.com/photo-1546353238-1d15a3f5d905?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "article2",
                      title: "The Science of Sleep",
                      description: "Why quality sleep is essential for mental health and how to improve yours.",
                      category: "Sleep Hygiene",
                      readTime: "6 min read",
                      author: "Dr. Matthew Walker",
                      source: "National Sleep Foundation",
                      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "article3",
                      title: "Building Resilience",
                      description: "Strategies to develop mental strength and bounce back from challenges.",
                      category: "Resilience",
                      readTime: "10 min read",
                      author: "Dr. Angela Duckworth",
                      source: "American Psychological Association",
                      image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "article4",
                      title: "The Power of Gratitude",
                      description: "How practicing gratitude can improve your mental health and wellbeing.",
                      category: "Positive Psychology",
                      readTime: "7 min read",
                      author: "Dr. Martin Seligman",
                      source: "Greater Good Science Center",
                      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "article5",
                      title: "Mindfulness for Beginners",
                      description: "Simple techniques to start a mindfulness practice in your daily life.",
                      category: "Mindfulness",
                      readTime: "5 min read",
                      author: "Dr. Jon Kabat-Zinn",
                      source: "Mindful.org",
                      image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "article6",
                      title: "Healthy Boundaries in Relationships",
                      description: "How to establish and maintain healthy boundaries in all relationships.",
                      category: "Relationships",
                      readTime: "9 min read",
                      author: "Dr. Henry Cloud",
                      source: "Psychology Today",
                      image: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    }
                  ].map((article) => (
                    <motion.div key={article.id} variants={itemVariants}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <div className="aspect-video w-full overflow-hidden">
                          <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-700">{article.category}</span>
                              <span className="text-xs text-slate-500 ml-2 flex items-center inline-flex">
                                <Clock className="w-3 h-3 mr-1" />
                                {article.readTime}
                              </span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleSave(article.id)}>
                              {savedResources.includes(article.id) ? (
                                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                              ) : (
                                <Heart className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <CardTitle className="text-xl">{article.title}</CardTitle>
                          <CardDescription>{article.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="flex items-center text-xs text-slate-500">
                            <span>By {article.author}</span>
                            <span className="mx-2">•</span>
                            <span>Source: {article.source}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                          <Button size="sm" className="bg-mindwell-500 hover:bg-mindwell-600 text-white">
                            <FileText className="w-4 h-4 mr-1" />
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
                <h2 className="text-2xl font-bold mb-6">Guided Exercises</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      id: "exercise1",
                      title: "5-Minute Breathing Meditation",
                      description: "A quick mindful breathing exercise to center yourself during busy days.",
                      category: "Meditation",
                      duration: "5 min",
                      instructor: "Dr. Tara Brach",
                      source: "Mindfulness Association",
                      image: "https://images.unsplash.com/photo-1474418397713-2f1091553e69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "exercise2",
                      title: "Progressive Muscle Relaxation",
                      description: "Release physical tension and promote deep relaxation with this guided exercise.",
                      category: "Relaxation",
                      duration: "15 min",
                      instructor: "Dr. Edmund Jacobson",
                      source: "Anxiety and Depression Association",
                      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "exercise3",
                      title: "Gratitude Journaling Practice",
                      description: "Guided journaling exercise to cultivate gratitude and positive perspective.",
                      category: "Journaling",
                      duration: "10 min",
                      instructor: "Dr. Robert Emmons",
                      source: "Positive Psychology Center",
                      image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "exercise4",
                      title: "Body Scan Meditation",
                      description: "Cultivate awareness of your body and reduce stress with this guided practice.",
                      category: "Meditation",
                      duration: "20 min",
                      instructor: "Dr. Jon Kabat-Zinn",
                      source: "Center for Mindfulness",
                      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "exercise5",
                      title: "Self-Compassion Exercise",
                      description: "Learn to treat yourself with kindness during difficult moments.",
                      category: "Self-Compassion",
                      duration: "12 min",
                      instructor: "Dr. Kristin Neff",
                      source: "Self-Compassion.org",
                      image: "https://images.unsplash.com/photo-1529693662653-9d480530a697?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "exercise6",
                      title: "Loving-Kindness Meditation",
                      description: "Cultivate feelings of warmth and kindness toward yourself and others.",
                      category: "Meditation",
                      duration: "15 min",
                      instructor: "Dr. Sharon Salzberg",
                      source: "Center for Contemplative Mind",
                      image: "https://images.unsplash.com/photo-1602192509154-0b900ee1f851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    }
                  ].map((exercise) => (
                    <motion.div key={exercise.id} variants={itemVariants}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <div className="aspect-video w-full overflow-hidden relative group">
                          <img src={exercise.image} alt={exercise.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="icon" className="rounded-full bg-white/90 text-mindwell-700 hover:bg-white">
                              <Play className="w-6 h-6" />
                            </Button>
                          </div>
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-700">{exercise.category}</span>
                              <span className="text-xs text-slate-500 ml-2 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {exercise.duration}
                              </span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleSave(exercise.id)}>
                              {savedResources.includes(exercise.id) ? (
                                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                              ) : (
                                <Heart className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <CardTitle className="text-xl">{exercise.title}</CardTitle>
                          <CardDescription>{exercise.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="flex items-center text-xs text-slate-500">
                            <span>By {exercise.instructor}</span>
                            <span className="mx-2">•</span>
                            <span>Source: {exercise.source}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" className="bg-mindwell-500 hover:bg-mindwell-600 text-white">
                            <Video className="w-4 h-4 mr-1" />
                            Start Exercise
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="podcasts">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isLoading ? "hidden" : "visible"}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold mb-6">Mental Health Podcasts</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      id: "podcast1",
                      title: "The Happiness Lab",
                      description: "Science-based insights for a happier life with Yale professor Dr. Laurie Santos.",
                      category: "Happiness & Wellbeing",
                      episodes: 45,
                      host: "Dr. Laurie Santos",
                      source: "Pushkin Industries",
                      image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "podcast2",
                      title: "Where There's Smoke",
                      description: "Exploring personal development through science, philosophy, and spirituality.",
                      category: "Personal Growth",
                      episodes: 32,
                      host: "Brett Gajda & Nick Jaworski",
                      source: "Public Radio Exchange",
                      image: "https://images.unsplash.com/photo-1589903309151-d9a556639770?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "podcast3",
                      title: "The Psychology Podcast",
                      description: "Conversations exploring human behavior and the science of the mind.",
                      category: "Psychology",
                      episodes: 78,
                      host: "Dr. Scott Barry Kaufman",
                      source: "Stitcher Media",
                      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "podcast4",
                      title: "Ten Percent Happier",
                      description: "Practical advice for training your mind and living with greater calm and clarity.",
                      category: "Mindfulness",
                      episodes: 105,
                      host: "Dan Harris",
                      source: "ABC News",
                      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "podcast5",
                      title: "Unlocking Us",
                      description: "Conversations that unlock the deeply human part of who we are.",
                      category: "Personal Development",
                      episodes: 67,
                      host: "Brené Brown",
                      source: "Spotify Studios",
                      image: "https://images.unsplash.com/photo-1581368087049-7034ed0d1e6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    },
                    {
                      id: "podcast6",
                      title: "Therapy for Black Girls",
                      description: "Mental health and personal development for Black women and beyond.",
                      category: "Mental Health",
                      episodes: 92,
                      host: "Dr. Joy Harden Bradford",
                      source: "iHeartRadio",
                      image: "https://images.unsplash.com/photo-1604077137850-c6d2e2a66966?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    }
                  ].map((podcast) => (
                    <motion.div key={podcast.id} variants={itemVariants}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <div className="aspect-square w-full overflow-hidden relative group">
                          <img src={podcast.image} alt={podcast.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
                            <Button size="sm" className="bg-white/90 text-black hover:bg-white">
                              <Play className="w-4 h-4 mr-1" />
                              Listen Now
                            </Button>
                          </div>
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-700">{podcast.category}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleSave(podcast.id)}>
                              {savedResources.includes(podcast.id) ? (
                                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                              ) : (
                                <Heart className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <CardTitle className="text-xl">{podcast.title}</CardTitle>
                          <CardDescription>{podcast.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Award className="w-4 h-4 mr-1 text-slate-400" />
                              {podcast.host}
                            </span>
                            <span className="text-slate-500">{podcast.episodes} episodes</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Source
                          </Button>
                          <Button size="sm" className="bg-mindwell-500 hover:bg-mindwell-600 text-white">
                            <BookmarkPlus className="w-4 h-4 mr-1" />
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
      
      {/* Progress Tracker */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Track Your Progress</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Monitor your wellness journey and celebrate your achievements with our progress tracking tools.
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
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-mindwell-50 to-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Need More Personalized Support?</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            While these self-help resources are valuable, sometimes you may need more personalized guidance from our AI counselors.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <NavLink to="/consultation">
              <Button size="lg" className="bg-mindwell-500 hover:bg-mindwell-600 text-white transition-transform duration-300 hover:scale-105">
                Book a Consultation
              </Button>
            </NavLink>
            <NavLink to="/plans">
              <Button size="lg" variant="outline" className="transition-transform duration-300 hover:scale-105">
                View Therapy Plans
              </Button>
            </NavLink>
          </div>
        </motion.div>
      </section>
      
      <Footer />
    </div>
  );
};

export default SelfHelp;
