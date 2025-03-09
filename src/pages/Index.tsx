
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeatureCard from "@/components/ui-custom/FeatureCard";
import Avatar from "@/components/ui-custom/Avatar";
import { Brain, Video, Lock, Calendar, History, MessageSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6 animate-fade-in">
                Virtual Mental Health Counseling
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance animate-fade-in">
                Mindful Conversations with <span className="text-gradient">AI Counselors</span>
              </h1>
              <p className="text-slate-600 text-lg mb-8 max-w-lg text-balance animate-fade-in">
                Experience personalized mental health support through AI-powered therapy sessions, accessible anytime and anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
                <NavLink to="/consultation">
                  <Button className="w-full sm:w-auto bg-mindwell-500 hover:bg-mindwell-600 text-white">
                    Book a Session
                  </Button>
                </NavLink>
                <NavLink to="/about">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </NavLink>
              </div>
              
              <div className="mt-12 flex items-center animate-fade-in">
                <div className="flex -space-x-3">
                  <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80" size="md" />
                  <Avatar src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80" size="md" />
                  <Avatar src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80" size="md" />
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium text-slate-600">From 500+ reviews</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative w-full h-full p-4">
                <div className="absolute inset-0 bg-mindwell-50 rounded-3xl transform rotate-3"></div>
                <div className="relative glass-panel rounded-3xl overflow-hidden shadow-lg border border-white/50 animate-fade-in">
                  <div className="aspect-video">
                    <img 
                      src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&h=980&q=80"
                      alt="Virtual counseling session" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-white/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-mindwell-100 flex items-center justify-center text-mindwell-600">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Live Session</p>
                          <p className="text-xs text-slate-500">Dr. Emma AI</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Live
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6">
              Our Platform Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Advanced Virtual Counseling
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-balance">
              MindwellAI combines cutting-edge AI technology with evidence-based therapeutic approaches to provide personalized mental health support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="AI-Powered Counselors"
              description="Interact with lifelike AI counselors trained on evidence-based therapeutic approaches."
              icon={Brain}
              className="animate-fade-in"
            />
            <FeatureCard
              title="Video Consultations"
              description="Connect through high-quality video sessions that adapt to your connection speed."
              icon={Video}
              className="animate-fade-in"
            />
            <FeatureCard
              title="Private & Secure"
              description="End-to-end encryption and strict privacy protocols keep your conversations confidential."
              icon={Lock}
              className="animate-fade-in"
            />
            <FeatureCard
              title="Flexible Scheduling"
              description="Book sessions at your convenience, with 24/7 availability to fit your schedule."
              icon={Calendar}
              className="animate-fade-in"
            />
            <FeatureCard
              title="Session History"
              description="Access past sessions and track your progress over time with detailed insights."
              icon={History}
              className="animate-fade-in"
            />
            <FeatureCard
              title="Chat Support"
              description="Text-based conversations available between video sessions for continuous support."
              icon={MessageSquare}
              className="animate-fade-in"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mindwell-600 to-mindwell-800 shadow-xl">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <circle cx="25" cy="25" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            <div className="relative p-8 md:p-16 flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">
                  Start Your Wellness Journey Today
                </h2>
                <p className="text-mindwell-100 text-lg mb-6 max-w-xl animate-fade-in">
                  Take the first step towards better mental health. Our AI counselors are ready to provide support tailored to your unique needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
                  <NavLink to="/consultation">
                    <Button className="w-full sm:w-auto bg-white text-mindwell-700 hover:bg-mindwell-50">
                      Book a Free Consultation
                    </Button>
                  </NavLink>
                  <NavLink to="/about">
                    <Button variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                      Explore Counselors
                    </Button>
                  </NavLink>
                </div>
              </div>
              
              <div className="md:w-1/3 animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl transform rotate-6"></div>
                  <div className="relative bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30">
                    <div className="flex items-center mb-4">
                      <Avatar 
                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80" 
                        status="online"
                      />
                      <div className="ml-3">
                        <p className="text-white font-medium">Dr. Sophia AI</p>
                        <p className="text-xs text-white/70">Cognitive Behavioral Specialist</p>
                      </div>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg mb-3 border border-white/20">
                      <p className="text-sm text-white/90">How have you been feeling this past week?</p>
                    </div>
                    <div className="p-3 bg-white/30 rounded-lg border border-white/40 text-right">
                      <p className="text-sm text-white">I've been feeling anxious about my new job...</p>
                    </div>
                    <div className="mt-4">
                      <div className="relative">
                        <input 
                          type="text" 
                          className="w-full bg-white/10 border border-white/30 rounded-full py-2 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/50"
                          placeholder="Type your message..."
                        />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center">
                          <svg className="w-4 h-4 text-mindwell-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
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
                    <svg key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
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
