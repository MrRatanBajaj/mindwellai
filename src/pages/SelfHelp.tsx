
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NavLink } from "react-router-dom";
import { BookOpen, Video, FileText, Play, Clock, Award, CheckCircle, Heart, Share2 } from "lucide-react";

const SelfHelp = () => {
  const [savedResources, setSavedResources] = useState<string[]>([]);
  
  const toggleSave = (id: string) => {
    if (savedResources.includes(id)) {
      setSavedResources(savedResources.filter(item => item !== id));
    } else {
      setSavedResources([...savedResources, id]);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6 animate-fade-in">
            Self-Help Resources
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-balance animate-fade-in">
            Empower Your Mental Health Journey
          </h1>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto animate-fade-in">
            Explore our library of self-help resources designed to provide support, education, and practical tools for your wellbeing.
          </p>
        </div>
      </section>
      
      {/* Resources Navigation */}
      <section className="py-10 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-10">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="exercises">Exercises</TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses" className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Self-Paced Courses</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: "course1",
                    title: "Managing Anxiety",
                    description: "Learn effective cognitive and behavioral techniques for managing anxiety.",
                    progress: 0,
                    duration: "4 weeks",
                    lessons: 12,
                    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  },
                  {
                    id: "course2",
                    title: "Mindfulness Foundations",
                    description: "Develop a mindfulness practice to reduce stress and improve well-being.",
                    progress: 45,
                    duration: "3 weeks",
                    lessons: 9,
                    image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  },
                  {
                    id: "course3",
                    title: "Building Healthy Relationships",
                    description: "Enhance your relationship skills through effective communication and boundaries.",
                    progress: 0,
                    duration: "5 weeks",
                    lessons: 15,
                    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  }
                ].map((course) => (
                  <Card key={course.id} className="overflow-hidden hover-lift">
                    <div className="aspect-video w-full overflow-hidden">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                        <div className="h-6"></div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => toggleSave(course.id)}>
                        {savedResources.includes(course.id) ? (
                          <Heart className="w-4 h-4 mr-1 fill-red-500 text-red-500" />
                        ) : (
                          <Heart className="w-4 h-4 mr-1" />
                        )}
                        Save
                      </Button>
                      <Button size="sm" className="bg-mindwell-500 hover:bg-mindwell-600 text-white">
                        <Play className="w-4 h-4 mr-1" />
                        Start Course
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="articles" className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Articles & Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: "article1",
                    title: "Understanding the Stress Response",
                    description: "Learn how stress affects your body and mind, and what you can do about it.",
                    category: "Stress Management",
                    readTime: "8 min read",
                    image: "https://images.unsplash.com/photo-1546353238-1d15a3f5d905?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  },
                  {
                    id: "article2",
                    title: "The Science of Sleep",
                    description: "Why quality sleep is essential for mental health and how to improve yours.",
                    category: "Sleep Hygiene",
                    readTime: "6 min read",
                    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  },
                  {
                    id: "article3",
                    title: "Building Resilience",
                    description: "Strategies to develop mental strength and bounce back from challenges.",
                    category: "Resilience",
                    readTime: "10 min read",
                    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  }
                ].map((article) => (
                  <Card key={article.id} className="overflow-hidden hover-lift">
                    <div className="aspect-video w-full overflow-hidden">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader>
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-700">{article.category}</span>
                        <span className="text-xs text-slate-500 ml-2 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      <CardDescription>{article.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => toggleSave(article.id)}>
                        {savedResources.includes(article.id) ? (
                          <Heart className="w-4 h-4 mr-1 fill-red-500 text-red-500" />
                        ) : (
                          <Heart className="w-4 h-4 mr-1" />
                        )}
                        Save
                      </Button>
                      <Button size="sm" className="bg-mindwell-500 hover:bg-mindwell-600 text-white">
                        <FileText className="w-4 h-4 mr-1" />
                        Read Article
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="exercises" className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Guided Exercises</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: "exercise1",
                    title: "5-Minute Breathing Meditation",
                    description: "A quick mindful breathing exercise to center yourself during busy days.",
                    category: "Meditation",
                    duration: "5 min",
                    image: "https://images.unsplash.com/photo-1474418397713-2f1091553e69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  },
                  {
                    id: "exercise2",
                    title: "Progressive Muscle Relaxation",
                    description: "Release physical tension and promote deep relaxation with this guided exercise.",
                    category: "Relaxation",
                    duration: "15 min",
                    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  },
                  {
                    id: "exercise3",
                    title: "Gratitude Journaling Practice",
                    description: "Guided journaling exercise to cultivate gratitude and positive perspective.",
                    category: "Journaling",
                    duration: "10 min",
                    image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  }
                ].map((exercise) => (
                  <Card key={exercise.id} className="overflow-hidden hover-lift">
                    <div className="aspect-video w-full overflow-hidden relative group">
                      <img src={exercise.image} alt={exercise.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="icon" className="rounded-full bg-white/90 text-mindwell-700 hover:bg-white">
                          <Play className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-700">{exercise.category}</span>
                        <span className="text-xs text-slate-500 ml-2 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {exercise.duration}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{exercise.title}</CardTitle>
                      <CardDescription>{exercise.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => toggleSave(exercise.id)}>
                        {savedResources.includes(exercise.id) ? (
                          <Heart className="w-4 h-4 mr-1 fill-red-500 text-red-500" />
                        ) : (
                          <Heart className="w-4 h-4 mr-1" />
                        )}
                        Save
                      </Button>
                      <Button size="sm" className="bg-mindwell-500 hover:bg-mindwell-600 text-white">
                        <Video className="w-4 h-4 mr-1" />
                        Start Exercise
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Progress Tracker */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Track Your Progress</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Monitor your wellness journey and celebrate your achievements with our progress tracking tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <Card className="glass-panel border border-mindwell-100">
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
                      className="bg-mindwell-50 text-mindwell-700 px-3 py-1 rounded-full text-sm flex items-center"
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
            
            <Card className="glass-panel border border-mindwell-100">
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
            
            <Card className="glass-panel border border-mindwell-100">
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
                        {id: "article1", title: "Understanding the Stress Response", type: "Article"},
                        {id: "article2", title: "The Science of Sleep", type: "Article"},
                        {id: "article3", title: "Building Resilience", type: "Article"},
                        {id: "exercise1", title: "5-Minute Breathing Meditation", type: "Exercise"},
                        {id: "exercise2", title: "Progressive Muscle Relaxation", type: "Exercise"},
                        {id: "exercise3", title: "Gratitude Journaling Practice", type: "Exercise"},
                      ];
                      const item = allItems.find(item => item.id === id);
                      return item ? (
                        <li key={id} className="flex justify-between items-center text-sm">
                          <span>{item.title}</span>
                          <span className="text-xs text-slate-500">{item.type}</span>
                        </li>
                      ) : null;
                    })}
                  </ul>
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    <p>Save resources by clicking the heart icon</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-mindwell-50">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-6">Need More Personalized Support?</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            While these self-help resources are valuable, sometimes you may need more personalized guidance from our AI counselors.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <NavLink to="/consultation">
              <Button size="lg" className="bg-mindwell-500 hover:bg-mindwell-600 text-white">
                Book a Consultation
              </Button>
            </NavLink>
            <NavLink to="/plans">
              <Button size="lg" variant="outline">
                View Therapy Plans
              </Button>
            </NavLink>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default SelfHelp;
