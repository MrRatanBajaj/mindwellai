import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { 
  Shield, Heart, Zap, Award, Video, MessageCircle, Brain, Users, 
  Sparkles, PlayCircle, ChevronRight, Star, CheckCircle2, Globe,
  Target, Eye, Lightbulb, ArrowRight, Quote, Phone, Mail, MapPin
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const features = [
    {
      icon: Video,
      title: "AI Video Counseling",
      description: "Face-to-face sessions with realistic AI therapists that respond with empathy and professional guidance.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageCircle,
      title: "Intelligent Chat Therapy",
      description: "Advanced conversational AI trained on evidence-based therapeutic approaches.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Brain,
      title: "Personalized AI Avatars",
      description: "Customizable AI companions that adapt to your personality and therapeutic needs.",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Sparkles,
      title: "Voice Cloning Technology",
      description: "Memorial chat feature with voice synthesis to connect with memories of loved ones.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Users,
      title: "Peer Support Network",
      description: "AI-moderated support groups and community connections for shared healing.",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: Globe,
      title: "24/7 Global Access",
      description: "Round-the-clock mental health support available in multiple languages.",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users", icon: Users },
    { value: "1M+", label: "Sessions Completed", icon: MessageCircle },
    { value: "98%", label: "Satisfaction Rate", icon: Star },
    { value: "24/7", label: "Available Support", icon: Globe },
  ];

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      
      {/* Hero Section - Immersive */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-mindwell-900 via-mindwell-800 to-purple-900" />
          <motion.div 
            className="absolute inset-0"
            style={{ opacity }}
          >
            {/* Floating orbs */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 400 + 200,
                  height: Math.random() * 400 + 200,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `radial-gradient(circle, ${
                    ['rgba(139, 92, 246, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(236, 72, 153, 0.3)'][i % 3]
                  } 0%, transparent 70%)`,
                }}
                animate={{
                  x: [0, 30, 0],
                  y: [0, -30, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Next-Gen AI Mental Health Platform</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
                Redefining
                <br />
                <span className="bg-gradient-to-r from-mindwell-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Mental Health
                </span>
                <br />
                with AI
              </h1>
              
              <p className="text-xl text-white/70 mb-10 max-w-lg leading-relaxed">
                Experience personalized mental health support through our advanced AI avatars, 
                designed to provide empathetic counseling and therapeutic guidance 24/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <NavLink to="/consultation">
                  <Button size="lg" className="bg-white text-mindwell-900 hover:bg-white/90 shadow-2xl h-14 px-8 text-lg">
                    <Video className="w-5 h-5 mr-2" />
                    Start AI Session
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </NavLink>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm h-14 px-8 text-lg"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative">
                {/* Main card */}
                <motion.div
                  className="relative z-10 rounded-3xl overflow-hidden shadow-2xl"
                  style={{ y: y1 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1552308995-2baac1ad5490?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" 
                    alt="AI Mental Health Platform" 
                    className="w-full aspect-[4/5] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mindwell-900/90 via-mindwell-900/40 to-transparent" />
                  
                  {/* Floating info card */}
                  <motion.div
                    className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mindwell-400 to-purple-500 flex items-center justify-center">
                        <Brain className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-lg">Dr. Emma AI</p>
                        <p className="text-white/70 text-sm">Your Personal AI Therapist</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white/70 text-sm">Online</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-2xl"
                  style={{ y: y2 }}
                />
                <motion.div
                  className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-2xl"
                  style={{ y: y1 }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-mindwell-900 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-mindwell-500/20 to-purple-500/20 border border-mindwell-500/30 mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="w-8 h-8 text-mindwell-400" />
                </motion.div>
                <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-32 px-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-mindwell-500/10 to-purple-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mindwell-500/10 border border-mindwell-500/30 text-mindwell-600 text-sm mb-6"
            >
              <Zap className="w-4 h-4" />
              <span>Revolutionary Technology</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered Mental
              <br />
              <span className="text-gradient">Health Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of mental health support with our cutting-edge AI technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-mindwell-500/50 transition-all duration-500 overflow-hidden">
                  <CardContent className="p-8 relative">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
                    
                    <motion.div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-mindwell-500 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <motion.div 
                      className="mt-6 flex items-center text-mindwell-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      Learn more <ChevronRight className="w-4 h-4 ml-1" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section - Cinematic */}
      <section className="py-32 px-6 bg-gradient-to-b from-background via-mindwell-950/50 to-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 text-sm mb-6">
              <Award className="w-4 h-4" />
              <span>Leadership</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Meet Our
              <br />
              <span className="text-gradient">Visionary Founder</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative">
                <motion.div
                  className="rounded-3xl overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src="/founder-image.jpg" 
                    alt="Mr. Ratan Bajaj, Founder and CEO" 
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mindwell-900/80 via-transparent to-transparent" />
                </motion.div>
                
                {/* Floating badge */}
                <motion.div
                  className="absolute -bottom-6 -right-6 p-6 rounded-2xl bg-gradient-to-br from-mindwell-500 to-purple-600 shadow-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <Award className="w-10 h-10 text-white" />
                </motion.div>
                
                <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/30 blur-xl" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-bold mb-2">Mr. Ratan Bajaj</h3>
                <p className="text-mindwell-500 font-medium text-lg">Founder & Chief Executive Officer</p>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Mr. Ratan Bajaj founded MindwellAI with a profound vision to democratize access 
                  to mental health support worldwide. With over a decade of experience in technology 
                  innovation and a deep understanding of psychological wellness, he recognized the 
                  transformative potential of AI in addressing the global mental health crisis.
                </p>
                <p>
                  His journey began after witnessing firsthand the barriers that prevent millions 
                  from accessing quality mental health care - from geographical limitations and 
                  financial constraints to stigma and long waiting lists.
                </p>
              </div>

              <motion.blockquote
                className="relative pl-6 py-4 border-l-4 border-mindwell-500 bg-mindwell-500/5 rounded-r-xl"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Quote className="absolute -top-4 -left-4 w-8 h-8 text-mindwell-500/30" />
                <p className="italic text-lg text-foreground">
                  "Mental health support should be a fundamental right, not a privilege. 
                  Through compassionate AI technology, we're breaking down barriers and 
                  creating a world where everyone has access to the support they need."
                </p>
              </motion.blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-32 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                icon: Eye,
                title: "Our Vision",
                color: "from-blue-500 to-cyan-500",
                description: "To create a world where mental health support is universally accessible, breaking down traditional barriers through innovative AI technology.",
                points: ["Global accessibility for all individuals", "Elimination of mental health stigma", "Personalized therapeutic experiences"]
              },
              {
                icon: Target,
                title: "Our Mission",
                color: "from-purple-500 to-pink-500",
                description: "To provide immediate, compassionate, and effective mental health support through cutting-edge AI technology.",
                points: ["24/7 immediate support availability", "Evidence-based therapeutic methodologies", "Complete privacy and data protection"]
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-mindwell-500/50 transition-all duration-500 overflow-hidden group">
                  <CardContent className="p-10 relative">
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${item.color} opacity-5 blur-3xl group-hover:opacity-10 transition-opacity`} />
                    
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-8 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                      {item.description}
                    </p>
                    
                    <div className="space-y-4">
                      {item.points.map((point, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-mindwell-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{point}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mindwell-600 via-purple-600 to-mindwell-700" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Transform
              <br />
              Your Mental Health Journey?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of users who have already discovered the power of 
              AI-assisted mental health support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink to="/consultation">
                <Button size="lg" className="bg-white text-mindwell-700 hover:bg-white/90 shadow-2xl h-14 px-10 text-lg">
                  <Video className="w-5 h-5 mr-2" />
                  Start Free Session
                </Button>
              </NavLink>
              <NavLink to="/plans">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 h-14 px-10 text-lg"
                >
                  View Plans
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </NavLink>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
