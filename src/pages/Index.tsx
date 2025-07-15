import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeatureCard from "@/components/ui-custom/FeatureCard";
import Avatar from "@/components/ui-custom/Avatar";
import { 
  Brain, Video, Lock, Calendar, History, MessageSquare, 
  Users, Award, Shield, Sparkles, Play, ArrowRight,
  CheckCircle, Star, Zap, Heart, BookOpen, Phone
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-mindwell-50">
      <Header />
      
      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-mindwell-50/50 via-blue-50/30 to-purple-50/20"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-mindwell-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 lg:pr-12">
              <div className="space-y-6 animate-fade-in">
                <div className="inline-flex items-center space-x-2 py-2 px-4 rounded-full bg-gradient-to-r from-mindwell-100 to-blue-100 border border-mindwell-200">
                  <Sparkles className="w-4 h-4 text-mindwell-600 animate-pulse" />
                  <span className="text-mindwell-700 font-medium text-sm">AI-Powered Mental Health Platform</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-slate-900 via-mindwell-800 to-blue-900 bg-clip-text text-transparent">
                  Your Personal 
                  <span className="block bg-gradient-to-r from-mindwell-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                    AI Counselor
                  </span>
                  Awaits
                </h1>
                
                <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                  Experience breakthrough mental health support with our advanced AI counselors. 
                  Get personalized therapy sessions, crisis intervention, and 24/7 emotional support.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <NavLink to="/consultation">
                    <Button className="group w-full sm:w-auto bg-gradient-to-r from-mindwell-500 to-mindwell-600 hover:from-mindwell-600 hover:to-mindwell-700 text-white px-8 py-4 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <Video className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Start Video Session
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </NavLink>
                  <NavLink to="/about">
                    <Button variant="outline" className="group w-full sm:w-auto border-2 border-mindwell-200 text-mindwell-700 hover:bg-mindwell-50 px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105">
                      <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Watch Demo
                    </Button>
                  </NavLink>
                </div>
                
                {/* Social Proof */}
                <div className="flex items-center space-x-6 pt-8">
                  <div className="flex -space-x-3">
                    {[
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80",
                      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80",
                      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
                    ].map((src, i) => (
                      <Avatar key={i} src={src} size="md" className="border-2 border-white shadow-lg hover:scale-110 transition-transform duration-300" />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-amber-400 fill-current animate-pulse" style={{ animationDelay: `${star * 100}ms` }} />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 font-medium">Trusted by 10,000+ users</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Hero Visual */}
            <div className="lg:w-1/2 relative">
              <div className="relative group">
                {/* Floating elements */}
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-mindwell-200 to-mindwell-300 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <Brain className="w-8 h-8 text-mindwell-600" />
                </div>
                <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl flex items-center justify-center shadow-lg animate-bounce delay-500">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                
                {/* Main card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/50 group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
                  <div className="aspect-video relative">
                    <img 
                      src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&h=980&q=80"
                      alt="AI Counselor Session" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300 cursor-pointer group">
                        <Play className="w-8 h-8 text-mindwell-600 ml-1 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Session info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-white/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mindwell-400 to-mindwell-600 flex items-center justify-center text-white shadow-lg">
                            <Brain className="w-6 h-6" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">Dr. Aria AI</p>
                          <p className="text-xs text-slate-600">Cognitive Behavioral Specialist</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center space-x-1 font-medium">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Available Now</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
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
                    <Star key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </Star>
                  ))}
                </div>
                <p className="text-slate-600 text-sm">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
