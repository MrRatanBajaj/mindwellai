import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { 
  Phone, Video, MessageCircle, Brain, Heart, Shield, 
  Sparkles, ArrowRight, Play, CheckCircle, Users,
  Clock, Star, Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PsychologyHero = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const testimonials = [
    { name: "Sarah M.", text: "Finally found peace after years of struggle", rating: 5 },
    { name: "James K.", text: "24/7 support changed my life completely", rating: 5 },
    { name: "Priya R.", text: "The AI counselor truly understands me", rating: 5 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const trustBadges = [
    { icon: Shield, text: "HIPAA Compliant", color: "text-emerald-600" },
    { icon: Clock, text: "24/7 Available", color: "text-blue-600" },
    { icon: Users, text: "50K+ Helped", color: "text-purple-600" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Calming Background Pattern - Psychology: Organic shapes reduce anxiety */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="calm-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-purple-900" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#calm-pattern)" />
        </svg>

        {/* Soft Gradient Orbs - Psychology: Warm colors evoke safety */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-200/40 to-purple-200/40 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-200/40 to-orange-200/40 blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content - Psychology: F-pattern reading, key info first */}
          <div className="space-y-8">
            {/* Trust Signal - Psychology: Social proof reduces uncertainty */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              {trustBadges.map((badge, i) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-sm"
                >
                  <badge.icon className={`w-4 h-4 ${badge.color}`} />
                  <span className="text-sm font-medium text-slate-700">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Headline - Psychology: Benefit-focused, emotional trigger */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                <span className="text-slate-900">Your Mind Deserves</span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Compassionate Care
                </span>
              </h1>
              
              {/* Subheadline - Psychology: Addresses pain points */}
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
                Connect with AI counselors trained in evidence-based therapy. 
                Private, judgment-free support available whenever you need it.
              </p>
            </motion.div>

            {/* CTA Buttons - Psychology: Clear hierarchy, action-oriented */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <NavLink to="/ai-voice-therapy">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 px-8 py-6 text-lg"
                >
                  <Phone className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Start Free Session
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </NavLink>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setIsVideoPlaying(true)}
                className="w-full sm:w-auto group border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 px-8 py-6 text-lg"
              >
                <Play className="w-5 h-5 mr-2 text-purple-600 group-hover:scale-110 transition-transform" />
                Watch How It Works
              </Button>
            </motion.div>

            {/* Rotating Testimonials - Psychology: Social proof + movement captures attention */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {testimonials[i - 1]?.name.charAt(0)}
                    </div>
                  ))}
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-700 font-medium">
                      "{testimonials[activeTestimonial].text}"
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      — {testimonials[activeTestimonial].name}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Interactive AI Counselor Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main Card - Psychology: Soft shadows = approachable */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 border border-white/50 overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Brain className="w-7 h-7 text-white" />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Dr. Maya AI</h3>
                      <p className="text-white/80 text-sm">Cognitive Behavioral Specialist</p>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                    Online
                  </Badge>
                </div>
              </div>

              {/* Communication Options - Psychology: Choice empowers users */}
              <div className="p-6 space-y-4">
                <p className="text-slate-600 text-center text-sm">
                  Choose how you'd like to connect:
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Video, label: "Video Call", path: "/consultation", color: "from-purple-500 to-purple-600" },
                    { icon: Phone, label: "Voice Call", path: "/ai-voice-therapy", color: "from-blue-500 to-blue-600" },
                    { icon: MessageCircle, label: "Chat", path: "/ai-therapist", color: "from-teal-500 to-teal-600" },
                  ].map((option, i) => (
                    <NavLink key={option.label} to={option.path}>
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${option.color} text-white shadow-lg cursor-pointer transition-all`}
                      >
                        <option.icon className="w-6 h-6" />
                        <span className="text-xs font-medium">{option.label}</span>
                      </motion.div>
                    </NavLink>
                  ))}
                </div>

                {/* Features List - Psychology: Checkmarks = trust signals */}
                <div className="mt-6 space-y-3">
                  {[
                    "Evidence-based therapy techniques",
                    "100% private & confidential",
                    "No waiting, instant connection",
                  ].map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="flex items-center gap-3 text-slate-600"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Active Sessions Indicator - Psychology: FOMO + social proof */}
              <div className="px-6 pb-6">
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-50 border border-purple-100"
                >
                  <Headphones className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-700 font-medium">
                    127 people in session right now
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Floating Elements - Psychology: Movement = life/energy */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl shadow-xl flex items-center justify-center"
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-xl flex items-center justify-center"
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl aspect-video bg-slate-900 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PsychologyHero;
