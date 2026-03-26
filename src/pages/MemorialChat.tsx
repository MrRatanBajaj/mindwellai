import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Heart, Clock, Sparkles, ArrowLeft, Shield, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const MemorialChat = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl"
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

          {/* Badge */}
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 mb-5 gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Coming Soon
          </Badge>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Digital Immortality Project
          </h1>

          <p className="text-muted-foreground mb-6 leading-relaxed max-w-md mx-auto">
            Preserve and reconnect with the essence of loved ones through AI-powered conversations.
            Voice cloning, personality modeling, and memory preservation — a thoughtful bridge between past and present.
          </p>

          {/* Feature preview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { icon: Brain, label: "AI Personality Modeling", desc: "Recreate conversational patterns" },
              { icon: Heart, label: "Memory Preservation", desc: "Store stories and moments" },
              { icon: Shield, label: "Private & Respectful", desc: "Encrypted, consent-first" },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-4 rounded-xl bg-card border border-border/50 text-center"
              >
                <f.icon className="w-5 h-5 text-calm-sage mx-auto mb-2" />
                <p className="text-xs font-medium text-foreground">{f.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Status */}
          <div className="bg-muted/50 rounded-xl p-5 mb-6 border border-border/30">
            <div className="flex items-center justify-center gap-2 text-foreground mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm font-medium">Under Development</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This feature is being built with care and deep respect for the sensitivity it requires.
              It is not yet publicly available.
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
