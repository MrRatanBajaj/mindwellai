import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeatureCard from "@/components/ui-custom/FeatureCard";
import Avatar from "@/components/ui-custom/Avatar";
import { FeedbackForm } from "@/components/ui-custom/FeedbackForm";
import { VoiceChat } from "@/components/ui-custom/VoiceChat";
import { RealtimeAnalytics } from "@/components/ui-custom/RealtimeAnalytics";
import VideoShowcase from "@/components/ui-custom/VideoShowcase";
import { motion } from "framer-motion";
import { 
  Brain, Video, Lock, Calendar, History, MessageSquare, 
  Users, Award, Shield, Sparkles, Play, ArrowRight,
  CheckCircle, Star, Zap, Heart, BookOpen, Phone
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-mindwell-50">
      <Header />
      
      {/* Enhanced Hero Section with Animations */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"></div>
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-300 to-blue-300 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full blur-3xl"
        />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 lg:pr-12">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center space-x-2 py-2 px-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 shadow-lg"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </motion.div>
                  <span className="text-purple-700 font-medium text-sm">AI-Powered Mental Health Platform</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight"
                >
                  <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
                    Your Personal{" "}
                  </span>
                  <motion.span 
                    className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0%", "100%", "0%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: "200% 200%",
                    }}
                  >
                    AI Counselor
                  </motion.span>
                  <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
                    Awaits
                  </span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl text-slate-600 leading-relaxed max-w-xl"
                >
                  Experience breakthrough mental health support with our advanced AI counselors. 
                  Get personalized therapy sessions, crisis intervention, and 24/7 emotional support.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <NavLink to="/consultation">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="group w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300">
                        <Video className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                        Start Video Session
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                      </Button>
                    </motion.div>
                  </NavLink>
                  <NavLink to="/ai-voice-therapy">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" className="group w-full sm:w-auto border-2 border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg font-medium transition-all duration-300">
                        <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        Try Voice AI
                      </Button>
                    </motion.div>
                  </NavLink>
                </motion.div>
                
                {/* Social Proof with Animation */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex items-center space-x-6 pt-8"
                >
                  <div className="flex -space-x-3">
                    {[
                      "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=256&h=256&fit=crop",
                      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&h=256&fit=crop",
                      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop"
                    ].map((src, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                      >
                        <Avatar src={src} size="md" className="border-3 border-white shadow-xl hover:scale-110 hover:z-10 transition-transform duration-300" />
                      </motion.div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.div
                          key={star}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 1.0 + star * 0.05 }}
                        >
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                      className="text-sm text-slate-600 font-medium"
                    >
                      Trusted by <span className="font-bold text-purple-600">10,000+</span> users
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Enhanced Interactive Video Showcase */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative">
                {/* Animated Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl z-10"
                >
                  <Brain className="w-10 h-10 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{
                    y: [0, 20, 0],
                    rotate: [0, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl z-10"
                >
                  <Heart className="w-10 h-10 text-white" />
                </motion.div>
                
                {/* Video Showcase Component */}
                <div className="relative glass-panel p-2 rounded-3xl shadow-2xl">
                  <VideoShowcase
                    thumbnailUrl="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1200&h=675&fit=crop&q=80"
                    videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Meet Your AI Counselor"
                    description="Watch how Dr. Maya provides personalized mental health support"
                  />
                  
                  {/* Animated Status Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2"
                  >
                    <div className="glass-panel px-6 py-3 rounded-full shadow-xl border-2 border-white">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Dr. Maya AI</p>
                          <p className="text-xs text-slate-600">Mental Health Specialist</p>
                        </div>
                        <div className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium flex items-center gap-1.5">
                          <motion.div
                            animate={{
                              scale: [1, 1.3, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                            className="w-2 h-2 bg-emerald-500 rounded-full"
                          />
                          Online
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Decorative Gradient Orbs */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl -z-10"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                  className="absolute bottom-1/4 -left-20 w-64 h-64 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full blur-3xl -z-10"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      {/* Real-time Analytics Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Real-time Platform Activity
            </h2>
            <p className="text-lg text-slate-600">
              See how our community is actively engaging with mental health support
            </p>
          </div>
          <RealtimeAnalytics />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mindwell-50/30 to-blue-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Comprehensive Mental Health 
              <span className="bg-gradient-to-r from-mindwell-600 to-blue-600 bg-clip-text text-transparent"> Solutions</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From AI-powered therapy to peer support, we provide every tool you need for your mental wellness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-mindwell-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-mindwell-500 to-mindwell-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">AI Therapy Sessions</h3>
                  <p className="text-slate-600 mb-6">
                    Connect with our advanced AI therapist for personalized mental health support available 24/7.
                  </p>
                  <NavLink 
                    to="/consultation" 
                    className="inline-flex items-center text-mindwell-600 font-semibold hover:text-mindwell-700 transition-colors group"
                  >
                    Start Session 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Peer Support Groups</h3>
                  <p className="text-slate-600 mb-6">
                    Connect with others nearby who share similar experiences. Join audio support groups for peer-to-peer healing.
                  </p>
                  <NavLink 
                    to="/peer-connect" 
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                  >
                    Find Peers 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Self-Help Resources</h3>
                  <p className="text-slate-600 mb-6">
                    Access curated articles, videos, and exercises designed to support your mental wellness journey.
                  </p>
                  <NavLink 
                    to="/self-help" 
                    className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group"
                  >
                    Explore Resources 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Daily Journal</h3>
                  <p className="text-slate-600 mb-6">
                    Track your mood, thoughts, and progress with our intelligent journaling system.
                  </p>
                  <NavLink 
                    to="/journal" 
                    className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors group"
                  >
                    Start Journaling 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Professional Sessions</h3>
                  <p className="text-slate-600 mb-6">
                    Book video sessions with licensed therapists and mental health professionals.
                  </p>
                  <NavLink 
                    to="/consultation" 
                    className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors group"
                  >
                    Book Session 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">AI Audio Counseling</h3>
                  <p className="text-slate-600 mb-6">
                    Experience natural voice conversations with our empathetic AI counselor using advanced speech technology.
                  </p>
                  <NavLink 
                    to="/ai-audio-call" 
                    className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors group"
                  >
                    Start Voice Session 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Memorial Chat</h3>
                  <p className="text-slate-600 mb-6">
                    Connect with memories of lost family members through AI-powered conversations on special occasions.
                  </p>
                  <NavLink 
                    to="/memorial-chat" 
                    className="inline-flex items-center text-rose-600 font-semibold hover:text-rose-700 transition-colors group"
                  >
                    Start Memorial Chat 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Features Section */}
      <section className="py-20 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 py-2 px-4 rounded-full bg-gradient-to-r from-mindwell-100 to-blue-100 border border-mindwell-200 mb-6">
              <Zap className="w-4 h-4 text-mindwell-600" />
              <span className="text-mindwell-700 font-medium text-sm">Platform Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-mindwell-800 bg-clip-text text-transparent">
              Advanced AI Counseling Technology
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Experience the future of mental health support with our cutting-edge AI counselors and comprehensive wellness platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI Avatar Counselors",
                description: "Lifelike AI counselors with facial expressions, voice interaction, and empathetic responses.",
                icon: Brain,
                color: "mindwell",
                features: ["Real-time expressions", "Voice AI", "24/7 availability"]
              },
              {
                title: "HD Video Sessions",
                description: "Crystal-clear video consultations with adaptive quality and secure encryption.",
                icon: Video,
                color: "blue",
                features: ["HD quality", "Auto-adaptation", "Secure calls"]
              },
              {
                title: "Privacy Protected",
                description: "End-to-end encryption with military-grade security for complete confidentiality.",
                icon: Lock,
                color: "green",
                features: ["End-to-end encryption", "HIPAA compliant", "No data storage"]
              },
              {
                title: "Smart Scheduling",
                description: "AI-powered scheduling that learns your preferences and optimizes session timing.",
                icon: Calendar,
                color: "purple",
                features: ["Smart suggestions", "Auto-reminders", "Flexible booking"]
              },
              {
                title: "Progress Tracking",
                description: "Detailed analytics and insights to monitor your mental health journey over time.",
                icon: History,
                color: "orange",
                features: ["Mood tracking", "Progress reports", "Goal setting"]
              },
              {
                title: "Crisis Support",
                description: "Immediate emergency counseling with crisis-trained AI for urgent situations.",
                icon: Phone,
                color: "red",
                features: ["Instant access", "Crisis protocols", "Emergency contacts"]
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.features.map((item, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-slate-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Enhanced CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mindwell-600 via-mindwell-700 to-blue-800 shadow-2xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200"></div>
            </div>
            
            <div className="relative p-8 md:p-16 flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Transform Your Mental Health?
                </h2>
                <p className="text-mindwell-100 text-lg mb-6 leading-relaxed">
                  Join thousands who have found peace, clarity, and support through our AI counseling platform. 
                  Your journey to better mental health starts with a single session.
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {[
                    { number: "50K+", label: "Sessions Completed" },
                    { number: "98%", label: "Satisfaction Rate" },
                    { number: "24/7", label: "Support Available" }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold text-white">{stat.number}</div>
                      <div className="text-sm text-mindwell-200">{stat.label}</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <NavLink to="/consultation">
                    <Button className="group w-full sm:w-auto bg-white text-mindwell-700 hover:bg-mindwell-50 px-8 py-4 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <Calendar className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Start Free Session
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </NavLink>
                  <NavLink to="/self-help">
                    <Button variant="outline" className="group w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105">
                      <BookOpen className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Explore Resources
                    </Button>
                  </NavLink>
                </div>
              </div>
              
              {/* Enhanced floating chat preview */}
              <div className="md:w-1/3">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl transform rotate-6 animate-pulse"></div>
                  <div className="relative bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center mb-4">
                      <div className="relative">
                        <Avatar 
                          src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80" 
                          status="online"
                          className="border-2 border-white/50"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-white font-medium">Dr. Emma AI</p>
                        <p className="text-xs text-white/70">Online • Responds in ~30s</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                        <p className="text-sm text-white/90">Hi! I'm here to support you today. How are you feeling?</p>
                      </div>
                      <div className="p-3 bg-white/30 rounded-lg border border-white/40 text-right">
                        <p className="text-sm text-white">I've been feeling anxious lately...</p>
                      </div>
                      <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                        <p className="text-sm text-white/90">I understand. Let's explore some techniques that can help...</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                        ))}
                      </div>
                      <span className="text-xs text-white/60">AI is typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6">
              User Experiences
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              What Our Users Say
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-balance">
              Hear from people who have transformed their mental well-being through our AI counseling platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah L.",
                role: "Marketing Executive",
                text: "The AI counselor was surprisingly insightful. I was skeptical at first, but the conversations felt natural and helped me work through my anxiety issues.",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
              },
              {
                name: "David M.",
                role: "Software Engineer",
                text: "As someone with a busy schedule, the flexibility to have sessions anytime has been a game-changer. The quality of the conversations and insights rivals my previous in-person therapy.",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
              },
              {
                name: "Mikaela J.",
                role: "Graduate Student",
                text: "The privacy aspect was important to me. I appreciate being able to discuss sensitive issues without worrying about judgment. It's been essential for my graduate school stress.",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
              }
            ].map((testimonial, index) => (
              <div key={index} className="glass-panel rounded-xl p-6 animate-fade-in">
                <div className="flex items-center mb-4">
                  <Avatar src={testimonial.avatar} size="md" />
                  <div className="ml-3">
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Help Us Improve</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              MindWelAI is in beta testing. Your feedback is invaluable in helping us create the best mental health platform.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <FeedbackForm />
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold mb-4">Real-time Voice Support</h3>
                <p className="text-muted-foreground mb-6">
                  Try our voice chat feature for real-time communication and immediate support during your feedback session.
                </p>
              </div>
              <VoiceChat />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
