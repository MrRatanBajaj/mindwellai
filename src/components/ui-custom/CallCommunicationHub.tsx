import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { 
  Phone, Video, MessageCircle, Mic, PhoneCall, 
  Clock, Shield, Zap, Heart, Brain, Users,
  ArrowRight, CheckCircle, Sparkles, Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CallCommunicationHub = () => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const communicationModes = [
    {
      id: "video",
      icon: Video,
      title: "Video Therapy",
      description: "Face-to-face AI counseling with visual engagement",
      path: "/consultation",
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      features: ["Visual connection", "Body language analysis", "Screen sharing"],
      waitTime: "Instant",
      popular: true,
    },
    {
      id: "voice",
      icon: Phone,
      title: "Voice Call",
      description: "Talk naturally with real-time voice AI therapy",
      path: "/ai-voice-therapy",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      features: ["Natural conversation", "Voice emotion detection", "Hands-free"],
      waitTime: "Instant",
      popular: false,
    },
    {
      id: "chat",
      icon: MessageCircle,
      title: "Text Chat",
      description: "Type your thoughts at your own pace",
      path: "/ai-therapist",
      color: "from-teal-500 to-emerald-600",
      bgColor: "bg-teal-50",
      features: ["Take your time", "Re-read responses", "Save transcripts"],
      waitTime: "Instant",
      popular: false,
    },
    {
      id: "emergency",
      icon: PhoneCall,
      title: "Crisis Support",
      description: "Immediate help for urgent situations",
      path: "/emergency",
      color: "from-rose-500 to-red-600",
      bgColor: "bg-rose-50",
      features: ["24/7 available", "Priority connection", "Safety resources"],
      waitTime: "Immediate",
      popular: false,
    },
  ];

  const stats = [
    { value: "2M+", label: "Sessions Completed", icon: Headphones },
    { value: "4.9", label: "User Rating", icon: Heart },
    { value: "<30s", label: "Avg Wait Time", icon: Clock },
    { value: "100%", label: "Private & Secure", icon: Shield },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-0 px-4 py-1.5">
            <Sparkles className="w-3 h-3 mr-1" />
            Multiple Ways to Connect
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Choose Your 
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Comfort Zone</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everyone communicates differently. Select the mode that feels right for you.
          </p>
        </motion.div>

        {/* Communication Modes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {communicationModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink to={mode.path}>
                <Card 
                  className={`relative h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 ${
                    selectedMode === mode.id ? 'border-purple-400 shadow-lg' : 'border-transparent'
                  }`}
                  onMouseEnter={() => setSelectedMode(mode.id)}
                  onMouseLeave={() => setSelectedMode(null)}
                >
                  {mode.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <mode.icon className="w-7 h-7 text-white" />
                    </motion.div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{mode.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 flex-grow">{mode.description}</p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {mode.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-xs text-slate-500">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Wait Time */}
                    <div className={`flex items-center justify-between p-3 rounded-xl ${mode.bgColor}`}>
                      <span className="text-xs text-slate-600">Wait time:</span>
                      <span className="text-sm font-bold text-slate-900">{mode.waitTime}</span>
                    </div>

                    {/* Hover Arrow */}
                    <AnimatePresence>
                      {selectedMode === mode.id && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="absolute bottom-6 right-6"
                        >
                          <ArrowRight className="w-5 h-5 text-purple-600" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </NavLink>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 mb-3">
                <stat.icon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 mb-4">Not sure where to start?</p>
          <NavLink to="/ai-therapist">
            <Button size="lg" variant="outline" className="border-2 border-purple-200 hover:bg-purple-50 px-8">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Take a Quick Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
};

export default CallCommunicationHub;
