
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Avatar from "@/components/ui-custom/Avatar";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Shield, Heart, Zap, Award, Video, MessageCircle, Brain, Users, Sparkles, PlayCircle, ChevronRight, Star, CheckCircle2, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mindwell-50/50 via-transparent to-accent/20"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col-reverse lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 lg:pr-12 mt-10 lg:mt-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-2 px-4 rounded-full bg-gradient-to-r from-mindwell-100 to-mindwell-200 text-mindwell-700 font-medium text-sm mb-6 border border-mindwell-300">
                ✨ Next-Gen AI Mental Health Platform
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-balance">
                Redefining Mental Health with
                <span className="text-gradient"> AI Companions</span>
              </h1>
              <p className="text-slate-600 text-xl mb-6 max-w-lg text-balance leading-relaxed">
                Experience personalized mental health support through our advanced AI avatars, designed to provide empathetic counseling and therapeutic guidance 24/7.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  AI Video Counseling
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Voice Cloning Technology
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Personalized Therapy
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <NavLink to="/consultation">
                  <Button size="lg" className="bg-gradient-to-r from-mindwell-500 to-mindwell-600 hover:from-mindwell-600 hover:to-mindwell-700 text-white shadow-lg">
                    <Video className="w-5 h-5 mr-2" />
                    Start AI Session
                  </Button>
                </NavLink>
                <Button variant="outline" size="lg" className="border-mindwell-200 hover:bg-mindwell-50">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <div className="aspect-square max-w-lg mx-auto overflow-hidden rounded-3xl glass-panel shadow-glass-strong">
                  <img 
                    src="https://images.unsplash.com/photo-1552308995-2baac1ad5490?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                    alt="AI Mental Health Platform" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mindwell-900/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="glass-panel rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mindwell-400 to-mindwell-600 flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Dr. Emma AI</p>
                          <p className="text-white/80 text-sm">Your AI Therapist</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-white/80 text-xs">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-accent/30 to-mindwell-200/50 rounded-3xl -z-10 animate-float"></div>
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-mindwell-100/50 to-slate-100/30 rounded-3xl -z-10 animate-float" style={{ animationDelay: '3s' }}></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-2 px-4 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-sm mb-6 border border-mindwell-200">
              🤖 Advanced AI Technology
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
              Revolutionary AI Mental Health Features
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg text-balance">
              Experience the future of mental health support with our cutting-edge AI avatars and personalized therapeutic interventions.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: "AI Video Counseling",
                description: "Face-to-face sessions with realistic AI therapists that respond with empathy and professional guidance.",
                color: "from-blue-400 to-blue-600"
              },
              {
                icon: MessageCircle,
                title: "Intelligent Chat Therapy",
                description: "Advanced conversational AI trained on evidence-based therapeutic approaches and real-time emotional analysis.",
                color: "from-green-400 to-green-600"
              },
              {
                icon: Brain,
                title: "Personalized AI Avatars",
                description: "Customizable AI companions that adapt to your personality, preferences, and therapeutic needs.",
                color: "from-purple-400 to-purple-600"
              },
              {
                icon: Sparkles,
                title: "Voice Cloning Technology",
                description: "Memorial chat feature with voice synthesis to connect with memories of loved ones.",
                color: "from-pink-400 to-pink-600"
              },
              {
                icon: Users,
                title: "Peer Support Network",
                description: "AI-moderated support groups and community connections for shared healing experiences.",
                color: "from-orange-400 to-orange-600"
              },
              {
                icon: Globe,
                title: "24/7 Global Access",
                description: "Round-the-clock mental health support available in multiple languages and time zones.",
                color: "from-teal-400 to-teal-600"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glass-panel hover-lift border-white/20 group cursor-pointer">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold group-hover:text-mindwell-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                    <div className="mt-4 flex items-center text-mindwell-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Learn more <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6">
              Our Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Meet Our Founder & CEO
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-balance">
              The visionary behind MindwellAI's mission to transform mental health support
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
            <div className="max-w-md animate-fade-in animate-float hover:scale-105 transition-transform duration-500">
              <div className="relative overflow-hidden rounded-2xl shadow-xl mb-6 border-4 border-mindwell-200 hover:border-mindwell-400 transition-colors duration-300">
                <img 
                  src="/lovable-uploads/b031e893-3424-4ef3-957f-289210685345.png" 
                  alt="Mr. Ratan Bajaj, Founder and CEO" 
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-xl font-bold">Mr. Ratan Bajaj</h3>
                  <p className="text-white/80">Visionary Leader</p>
                </div>
              </div>
            </div>
            
            <div className="max-w-xl animate-fade-in">
              <h3 className="text-2xl font-bold mb-2 text-mindwell-700">Mr. Ratan Bajaj</h3>
              <p className="text-mindwell-600 font-medium mb-6">Founder & Chief Executive Officer</p>
              <p className="text-slate-600 mb-4">
                Mr. Ratan Bajaj founded MindwellAI with a vision to democratize access to mental health support. With an extensive background in both technology and psychology, he recognized the potential for AI to bridge the gap in mental healthcare accessibility.
              </p>
              <p className="text-slate-600 mb-4">
                Under his leadership, MindwellAI has pioneered innovative approaches to AI-assisted therapy, combining cutting-edge technology with evidence-based psychological principles to create a platform that is both effective and accessible.
              </p>
              <p className="text-slate-600">
                "Mental health support should be available to everyone, regardless of location, financial means, or schedule. At MindwellAI, we're committed to making that vision a reality through compassionate technology."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6">
              Our Core Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              What Drives Our Innovation
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-balance">
              At MindwellAI, our values guide everything we create and every interaction we design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Privacy & Security",
                description: "We prioritize your confidentiality with end-to-end encryption and strict data protection policies."
              },
              {
                icon: Heart,
                title: "Empathy",
                description: "Our AI counselors are designed to understand and respond to emotional needs with genuine care."
              },
              {
                icon: Zap,
                title: "Innovation",
                description: "We continuously refine our technology to provide the most effective therapeutic experience."
              },
              {
                icon: Award,
                title: "Excellence",
                description: "We maintain high standards in our AI training, therapeutic approaches, and user experience."
              }
            ].map((value, index) => (
              <div key={index} className="glass-panel rounded-xl p-6 hover-lift animate-fade-in">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-mindwell-50 text-mindwell-600 mb-5">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Approach Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6 animate-fade-in">
                Our Therapeutic Approach
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance animate-fade-in">
                Science-Backed Methodology
              </h2>
              <p className="text-slate-600 mb-6 animate-fade-in">
                Our AI counselors utilize established therapeutic frameworks, including:
              </p>
              
              <div className="space-y-4 animate-fade-in">
                {[
                  {
                    title: "Cognitive Behavioral Therapy (CBT)",
                    description: "Helps identify and change negative thought patterns to improve emotional response and behavior."
                  },
                  {
                    title: "Mindfulness-Based Techniques",
                    description: "Incorporates present-moment awareness to reduce stress and anxiety."
                  },
                  {
                    title: "Solution-Focused Brief Therapy",
                    description: "Concentrates on finding solutions in the present and exploring hope for the future."
                  },
                  {
                    title: "Emotion-Focused Therapy",
                    description: "Helps identify, experience, express, and regulate emotions in a healthier way."
                  }
                ].map((approach, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg hover:border-mindwell-200 transition-colors">
                    <h3 className="font-medium text-mindwell-700 mb-1">{approach.title}</h3>
                    <p className="text-sm text-slate-600">{approach.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="relative glass-panel rounded-3xl overflow-hidden shadow-lg border border-white/50 animate-fade-in">
                  <div className="aspect-video">
                    <img 
                      src="https://images.unsplash.com/photo-1551739440-5dd934d3a94a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                      alt="Therapeutic approach" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">Continuous Improvement</h3>
                      <p className="text-white/80 text-sm">Our AI counselors learn and adapt from interactions to provide increasingly personalized support.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6">
              Our AI Counselors
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Meet Your Virtual Support Team
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-balance">
              Our AI counselors are designed with specific therapeutic specializations to provide tailored support for your unique needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Emma AI",
                specialty: "Anxiety & Stress Management",
                description: "Specialized in cognitive behavioral techniques for managing anxiety, panic, and stress-related concerns.",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
              },
              {
                name: "Dr. Marcus AI",
                specialty: "Depression & Mood Disorders",
                description: "Focused on evidence-based approaches for depression, bipolar disorder, and other mood-related challenges.",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
              },
              {
                name: "Dr. Sophia AI",
                specialty: "Relationship & Family Dynamics",
                description: "Expert in navigating relationship challenges, family conflicts, and interpersonal communication issues.",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
              }
            ].map((counselor, index) => (
              <div key={index} className="glass-panel rounded-xl p-6 hover-lift animate-fade-in">
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar src={counselor.avatar} size="xl" status="online" />
                  <h3 className="text-xl font-semibold mt-4">{counselor.name}</h3>
                  <p className="text-mindwell-600 text-sm font-medium">{counselor.specialty}</p>
                </div>
                <p className="text-slate-600 text-sm text-center mb-6">{counselor.description}</p>
                <NavLink to="/consultation" className="block">
                  <Button variant="outline" className="w-full">
                    Schedule Session
                  </Button>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Common Questions
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-balance">
              Find answers to frequently asked questions about our platform, technology, and therapeutic approach.
            </p>
          </div>
          
          <div className="space-y-6 animate-fade-in">
            {[
              {
                question: "How do AI counselors compare to human therapists?",
                answer: "AI counselors provide evidence-based therapeutic approaches similar to human therapists, with the advantages of 24/7 availability and complete privacy. While they don't replace human connection, they offer valuable support, especially for those who face barriers to traditional therapy."
              },
              {
                question: "Is my conversation data secure and private?",
                answer: "Absolutely. We use end-to-end encryption for all sessions, and your data is never shared with third parties. You can also delete your conversation history at any time from your account settings."
              },
              {
                question: "What mental health issues can the platform help with?",
                answer: "Our AI counselors are trained to support a wide range of concerns including anxiety, depression, stress management, relationship issues, grief, and personal growth. However, they are not equipped to handle crisis situations or severe mental health conditions that require immediate intervention."
              },
              {
                question: "How are the sessions structured?",
                answer: "Sessions typically last 30-45 minutes and adapt to your needs. Each session begins with a check-in about your current state, followed by exploration of specific concerns and practical strategies or insights. You can choose video, audio, or text-based communication."
              },
              {
                question: "What if I need human support during a crisis?",
                answer: "Our platform includes clear pathways to human support in crisis situations. The AI is programmed to recognize signs of severe distress and will provide immediate resources for appropriate emergency services and crisis helplines."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-lg hover:border-mindwell-200 transition-colors">
                <div className="p-6">
                  <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-mindwell-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance animate-fade-in">
            Begin Your Wellness Journey
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-balance animate-fade-in">
            Take the first step towards better mental well-being with personalized AI counseling sessions designed around your needs.
          </p>
          <div className="animate-fade-in">
            <NavLink to="/consultation">
              <Button size="lg" className="bg-mindwell-500 hover:bg-mindwell-600 text-white">
                Book Your First Session
              </Button>
            </NavLink>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
