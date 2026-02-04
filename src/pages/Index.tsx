import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FeedbackForm } from "@/components/ui-custom/FeedbackForm";
import SmartNotification from "@/components/ui-custom/SmartNotification";
import { PushNotificationBanner } from "@/components/ui-custom/PushNotificationBanner";
import HowItWorks from "@/components/ui-custom/HowItWorks";
import MentalHealthStats from "@/components/ui-custom/MentalHealthStats";
import MindAnimation from "@/components/ui-custom/MindAnimation";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { 
  Brain, Shield, Clock, Heart, 
  ArrowRight, CheckCircle, Play,
  Video, Phone, MessageCircle, Sparkles, Flag
} from "lucide-react";

const Index = () => {
  const [isRepublicDay, setIsRepublicDay] = useState(false);

  useEffect(() => {
    const checkRepublicDay = () => {
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
      
      // Check if it's 26th January
      const isJan26 = istNow.getMonth() === 0 && istNow.getDate() === 26;
      setIsRepublicDay(isJan26);
    };

    checkRepublicDay();
    const interval = setInterval(checkRepublicDay, 60000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Bank-level encryption for your privacy",
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Support whenever you need it",
    },
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Evidence-based therapeutic techniques",
    },
    {
      icon: Heart,
      title: "Judgment-Free",
      description: "Safe space for your thoughts",
    },
  ];

  const services = [
    {
      icon: Video,
      title: "Video Therapy",
      description: "Face-to-face AI counseling",
      path: "/consultation",
      color: "bg-violet-500",
    },
    {
      icon: Phone,
      title: "Voice Calls",
      description: "Natural voice conversations",
      path: "/ai-voice-therapy",
      color: "bg-blue-500",
    },
    {
      icon: MessageCircle,
      title: "Text Chat",
      description: "Type at your own pace",
      path: "/ai-therapist",
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SmartNotification />
      <Header />
      
      {/* Hero Section - Clean & Professional */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Subtle gradient background */}
        <div className={`absolute inset-0 ${isRepublicDay ? 'bg-gradient-to-br from-orange-50 via-white to-green-50' : 'bg-gradient-to-br from-slate-50 via-white to-violet-50/30'}`} />
        
        {/* Mind Animation - Top Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-8 right-4 md:right-8 lg:right-16 hidden md:block z-10"
        >
          <MindAnimation />
        </motion.div>
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Republic Day Special Banner */}
              <AnimatePresence>
                {isRepublicDay && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="mb-6"
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF9933] via-white to-[#138808] p-[2px]">
                      <div className="bg-slate-900 rounded-2xl px-6 py-4">
                        <div className="flex items-center gap-4">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <span className="text-3xl">🇮🇳</span>
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg">
                              Happy 76th Republic Day!
                            </h3>
                            <p className="text-slate-300 text-sm">
                              Celebrating the spirit of our Constitution • Jai Hind! 🪷
                            </p>
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Flag className="w-8 h-8 text-[#FF9933]" />
                          </motion.div>
                        </div>
                        
                        {/* Animated Ashoka Chakra */}
                        <div className="flex justify-center mt-4">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 rounded-full border-4 border-[#000080] flex items-center justify-center"
                          >
                            <div className="relative w-full h-full">
                              {[...Array(24)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-0.5 h-2 bg-[#000080] left-1/2 top-1/2 origin-bottom"
                                  style={{ 
                                    transform: `translateX(-50%) translateY(-100%) rotate(${i * 15}deg)` 
                                  }}
                                />
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isRepublicDay ? 'bg-gradient-to-r from-orange-100 via-white to-green-100 text-slate-700 border border-slate-200' : 'bg-violet-100 text-violet-700'} text-sm font-medium mb-6`}>
                <Sparkles className="w-4 h-4" />
                AI-Powered Mental Wellness
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Your Personal
                <span className="block text-violet-600">AI Therapist</span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 max-w-md">
                Professional mental health support, available 24/7. Evidence-based therapy techniques delivered through advanced AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <NavLink to="/ai-voice-therapy">
                  <Button size="lg" className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-base font-semibold shadow-lg shadow-violet-200">
                    Start Free Session
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </NavLink>
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-6">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>No credit card</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Service Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {services.map((service, index) => (
                <NavLink key={service.title} to={service.path}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 8, scale: 1.02 }}
                    className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-violet-200 transition-all cursor-pointer"
                  >
                    <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center shrink-0`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-lg">{service.title}</h3>
                      <p className="text-slate-500 text-sm">{service.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </NavLink>
              ))}

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl text-white mt-6"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">2M+</div>
                  <div className="text-white/70 text-xs">Sessions</div>
                </div>
                <div className="text-center border-x border-white/20">
                  <div className="text-2xl font-bold">4.9</div>
                  <div className="text-white/70 text-xs">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-white/70 text-xs">Available</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Minimal */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-slate-500 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Mental Health Statistics */}
      <MentalHealthStats />

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start Your Wellness Journey
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join thousands who have found support through our AI-powered platform. 
              Your first session is completely free.
            </p>
            <NavLink to="/ai-voice-therapy">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-base font-semibold">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </NavLink>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Feedback Form Section */}
      <section className="py-20 bg-gradient-to-b from-violet-50/50 to-white relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="relative max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-4"
            >
              <MessageCircle className="w-4 h-4" />
              Beta Feedback
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Help Us Improve
            </h2>
            <p className="text-slate-600">
              Your feedback shapes the future of mental wellness technology
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <FeedbackForm />
          </motion.div>
        </div>
      </section>

      <Footer />
      <PushNotificationBanner />
    </div>
  );
};

export default Index;
