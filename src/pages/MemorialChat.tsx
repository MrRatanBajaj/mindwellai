import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { 
  Heart, Clock, Sparkles, ArrowLeft, Shield, Brain, 
  Upload, Mic, Video, Image, MessageCircle, User,
  Headphones, Camera, FileAudio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    step: "01",
    icon: Image,
    title: "Upload Photo",
    desc: "Upload your loved one's photos. Our AI analyzes facial features to create a realistic 3D virtual avatar that looks just like them.",
    color: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-500",
  },
  {
    step: "02",
    icon: FileAudio,
    title: "Voice Cloning",
    desc: "Upload audio recordings of their voice. Our AI self-trains to clone their unique voice, tone, and speech patterns with remarkable accuracy.",
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-500",
  },
  {
    step: "03",
    icon: Video,
    title: "Upload Memories",
    desc: "Share videos, voice notes, messages, and stories. The more memories you share, the more authentic the digital simulation becomes.",
    color: "from-sky-500/20 to-blue-500/20",
    iconColor: "text-sky-500",
  },
  {
    step: "04",
    icon: Brain,
    title: "AI Simulation",
    desc: "Within minutes, our AI processes everything to create a digital human simulation — personality, mannerisms, and conversation style, all preserved.",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    step: "05",
    icon: MessageCircle,
    title: "Talk & Feel Connected",
    desc: "Have real conversations with the digital version of your loved one. See them, hear their voice, and feel their presence once again.",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
  },
];

const features = [
  { icon: User, label: "3D Avatar Creation", desc: "Photorealistic virtual human from photos" },
  { icon: Headphones, label: "AI Voice Clone", desc: "Self-trained voice from audio samples" },
  { icon: Brain, label: "Personality Modeling", desc: "Learns conversational patterns & memories" },
  { icon: Camera, label: "Video Memories", desc: "Integrate videos & recordings" },
  { icon: Shield, label: "Private & Encrypted", desc: "End-to-end encrypted, consent-first" },
  { icon: Heart, label: "Emotional Intelligence", desc: "Responds with warmth & empathy" },
];

const MemorialChat = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
            className="relative inline-block mb-8"
          >
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-calm-lavender via-calm-sky to-calm-sage-light flex items-center justify-center mx-auto shadow-lg">
              <Heart className="w-14 h-14 text-calm-sage" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Sparkles className="w-5 h-5 text-calm-sage/60 absolute -top-2 right-2" />
              <Heart className="w-4 h-4 text-pink-400/60 absolute bottom-0 -left-1" />
            </motion.div>
          </motion.div>

          <Badge className="bg-amber-50 text-amber-700 border-amber-200 mb-5 gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Coming Soon — Under Development
          </Badge>

          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Digital Immortality Project
          </h1>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-3">
            Reconnect with loved ones who have passed. Upload their photos, voice recordings, and memories — 
            our AI creates a lifelike digital simulation you can talk to, hear, and feel connected with again.
          </p>

          <p className="text-sm text-muted-foreground/70 max-w-lg mx-auto">
            Built with deep respect, privacy-first design, and cutting-edge AI technology.
          </p>
        </motion.div>

        {/* How It Works - Steps */}
        <div className="max-w-4xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xl md:text-2xl font-semibold text-foreground mb-10"
          >
            How It Works
          </motion.h2>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border/40 hover:border-border/80 hover:shadow-md transition-all"
              >
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                  <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground/60">STEP {step.step}</span>
                    <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-4xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xl md:text-2xl font-semibold text-foreground mb-8"
          >
            Key Features
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-4 rounded-xl bg-card border border-border/40 text-center hover:shadow-sm transition-shadow"
              >
                <f.icon className="w-5 h-5 text-calm-sage mx-auto mb-2" />
                <p className="text-xs font-semibold text-foreground">{f.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="bg-muted/50 rounded-2xl p-6 mb-6 border border-border/30">
            <div className="flex items-center justify-center gap-2 text-foreground mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm font-semibold">Currently Under Development</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              This feature is being built with the utmost care and sensitivity. 
              It is <strong>not yet publicly available</strong>. We are working to ensure the technology 
              is respectful, secure, and emotionally intelligent before release.
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              Want early access? Stay tuned for updates on our homepage.
            </p>
          </div>

          <NavLink to="/">
            <Button variant="outline" className="gap-2 border-border/60">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </NavLink>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default MemorialChat;
