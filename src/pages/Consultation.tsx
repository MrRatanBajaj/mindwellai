import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TavusVideoConsultation from "@/components/ui-custom/TavusVideoConsultation";
import ElevenLabsPhoneCounselor from "@/components/ui-custom/ElevenLabsPhoneCounselor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Video, Phone, Shield, Clock, CheckCircle, Star, Sparkles, Heart, ArrowRight, Languages, Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DOCTOR_PROFILES, type DoctorType } from "@/lib/doctorProfiles";

type Mode = "selection" | "video" | "audio" | "completed";

// Exactly 3 counselors, each supporting both video + audio
const COUNSELORS: {
  type: DoctorType;
  tagline: string;
  accent: string;
  ring: string;
  glow: string;
  audioPrompt: string;
  audioFirstMessage: string;
}[] = [
  {
    type: "mental_health",
    tagline: "Calm, grounded listener for everyday stress & low moods.",
    accent: "from-emerald-400/30 via-teal-300/20 to-sky-300/30",
    ring: "ring-emerald-300/40",
    glow: "shadow-[0_0_60px_-15px_rgba(16,185,129,0.45)]",
    audioPrompt:
      "You are Dr. Maya, a warm CBT-trained mental wellness counselor. Speak gently in clear English. Validate feelings first, then offer one small grounding step.",
    audioFirstMessage:
      "Hi, this is Dr. Maya. I'm really glad you called. Take a breath — what's been on your mind today?",
  },
  {
    type: "anxiety_specialist",
    tagline: "Specialist for panic, racing thoughts & overwhelm.",
    accent: "from-violet-400/30 via-fuchsia-300/20 to-rose-300/30",
    ring: "ring-violet-300/40",
    glow: "shadow-[0_0_60px_-15px_rgba(139,92,246,0.45)]",
    audioPrompt:
      "You are Dr. Aria, a calm anxiety specialist. Speak slowly in soothing English. Guide the user through 4-7-8 breathing or 5-4-3-2-1 grounding when they sound activated.",
    audioFirstMessage:
      "Hello, this is Dr. Aria. I'm right here with you. Whenever you're ready — tell me what you're feeling in your body right now.",
  },
  {
    type: "life_coach",
    tagline: "Action-focused coach for goals, clarity & confidence.",
    accent: "from-amber-400/30 via-orange-300/20 to-rose-300/30",
    ring: "ring-amber-300/40",
    glow: "shadow-[0_0_60px_-15px_rgba(251,191,36,0.45)]",
    audioPrompt:
      "You are Dr. Aisha, an empowering ICF life coach. Speak in confident, encouraging English. Ask one powerful question at a time and help the user define one next step.",
    audioFirstMessage:
      "Hey, Dr. Aisha here. Love that you showed up. What's one thing you want more clarity on today?",
  },
];

const Consultation = () => {
  const [mode, setMode] = useState<Mode>("selection");
  const [activeType, setActiveType] = useState<DoctorType>("mental_health");

  const activeCounselor =
    COUNSELORS.find((c) => c.type === activeType) ?? COUNSELORS[0];
  const activeProfile = DOCTOR_PROFILES[activeType];

  const startVideo = (type: DoctorType) => {
    setActiveType(type);
    setMode("video");
  };
  const startAudio = (type: DoctorType) => {
    setActiveType(type);
    setMode("audio");
  };
  const handleEnd = () => setMode("completed");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          {mode === "selection" && (
            <motion.section
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative overflow-hidden"
            >
              {/* Ambient background */}
              <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-calm-sage/20 blur-3xl animate-pulse" />
                <div
                  className="absolute top-40 right-1/4 w-96 h-96 rounded-full bg-violet-300/20 blur-3xl animate-pulse"
                  style={{ animationDelay: "1.2s" }}
                />
                <div
                  className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-amber-300/20 blur-3xl animate-pulse"
                  style={{ animationDelay: "2.4s" }}
                />
              </div>

              {/* Hero */}
              <div className="max-w-5xl mx-auto px-6 pt-12 pb-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/70 backdrop-blur-md border border-border/50 text-xs text-foreground/80 mb-5">
                    <Zap className="w-3.5 h-3.5 text-calm-sage" />
                    <span>One tap. No forms. Instant session.</span>
                  </div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
                    Meet your counselor.
                    <br />
                    <span className="bg-gradient-to-r from-calm-sage via-violet-500 to-amber-500 bg-clip-text text-transparent">
                      Talk in seconds.
                    </span>
                  </h1>
                  <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                    Pick a face, then choose video or voice. We start the
                    session the moment you tap — no booking, no waiting.
                  </p>
                </motion.div>
              </div>

              {/* Counselor cards */}
              <div className="max-w-6xl mx-auto px-6 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {COUNSELORS.map((c, idx) => {
                    const profile = DOCTOR_PROFILES[c.type];
                    const Icon = profile.icon;
                    return (
                      <motion.div
                        key={c.type}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.1, duration: 0.5 }}
                        whileHover={{ y: -6 }}
                      >
                        <Card
                          className={cn(
                            "relative overflow-hidden border border-border/50 bg-card/80 backdrop-blur-xl transition-all duration-500 hover:border-calm-sage/40",
                            c.glow
                          )}
                        >
                          {/* Animated gradient backdrop */}
                          <div
                            className={cn(
                              "absolute inset-0 opacity-60 bg-gradient-to-br",
                              c.accent
                            )}
                          />
                          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/30 blur-2xl" />

                          <CardContent className="relative p-6 flex flex-col items-center text-center">
                            {/* Avatar with pulse rings */}
                            <div className="relative mb-5">
                              <motion.div
                                className={cn(
                                  "absolute inset-0 rounded-full ring-4",
                                  c.ring
                                )}
                                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                                transition={{ duration: 2.4, repeat: Infinity }}
                              />
                              <motion.div
                                className={cn(
                                  "absolute inset-0 rounded-full ring-2",
                                  c.ring
                                )}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                                transition={{ duration: 2.4, repeat: Infinity, delay: 0.6 }}
                              />
                              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-white to-white/60 backdrop-blur flex items-center justify-center shadow-xl">
                                <Icon className="w-11 h-11 text-foreground/80" />
                              </div>
                              <Badge className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 text-white border-0 text-[10px] px-2">
                                <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse" />
                                Online
                              </Badge>
                            </div>

                            <h3 className="font-display text-xl font-bold text-foreground">
                              {profile.name}
                            </h3>
                            <p className="text-sm text-foreground/70 mt-1 mb-1">
                              {profile.specialty}
                            </p>
                            <div className="flex items-center gap-1 mb-3">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="text-xs font-semibold">{profile.rating}</span>
                              <span className="text-xs text-muted-foreground">· 500+ sessions</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-5 min-h-[2.5rem]">
                              {c.tagline}
                            </p>

                            {/* Action buttons */}
                            <div className="w-full grid grid-cols-2 gap-2">
                              <Button
                                onClick={() => startVideo(c.type)}
                                className="bg-foreground hover:bg-foreground/90 text-background gap-1.5 h-11 rounded-xl group"
                              >
                                <Video className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Video
                              </Button>
                              <Button
                                onClick={() => startAudio(c.type)}
                                variant="outline"
                                className="border-foreground/20 hover:bg-foreground/5 gap-1.5 h-11 rounded-xl group"
                              >
                                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Voice
                              </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground/70 mt-3 flex items-center gap-1">
                              <Zap className="w-3 h-3" /> Starts instantly
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Trust strip */}
              <div className="max-w-4xl mx-auto px-6 pb-16">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
                >
                  {[
                    { icon: Shield, text: "HIPAA Compliant" },
                    { icon: Clock, text: "Available 24/7" },
                    { icon: Languages, text: "Real human-like voice" },
                    { icon: CheckCircle, text: "10,000+ Sessions" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-calm-sage" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.section>
          )}

          {mode === "video" && (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TavusVideoConsultation
                doctorType={activeType}
                onEndCall={handleEnd}
              />
            </motion.div>
          )}

          {mode === "audio" && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="min-h-[70vh] flex items-center justify-center px-6"
            >
              <ElevenLabsPhoneCounselor
                counselorName={activeProfile.name}
                specialty={activeProfile.specialty}
                personaPrompt={activeCounselor.audioPrompt}
                firstMessage={activeCounselor.audioFirstMessage}
                onEnd={handleEnd}
              />
            </motion.div>
          )}

          {mode === "completed" && (
            <motion.section
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 px-6 min-h-[70vh] flex items-center justify-center"
            >
              <div className="max-w-lg mx-auto text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 bg-calm-sage-light rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-calm-sage" />
                </motion.div>
                <h2 className="font-display text-2xl font-bold mb-3">
                  Session Complete
                </h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for showing up for yourself today. Reaching out is
                  an act of strength.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setMode("selection")}
                    className="bg-calm-sage hover:bg-calm-sage/90 text-white gap-2"
                  >
                    <Heart className="w-4 h-4" /> New Session
                  </Button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      {mode === "selection" && <Footer />}
    </div>
  );
};

export default Consultation;
