import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ElevenLabsPhoneCounselor from "@/components/ui-custom/ElevenLabsPhoneCounselor";
import { Button } from "@/components/ui/button";
import { Phone, ArrowLeft, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNSELORS, getCounselor, type CounselorId } from "@/lib/counselors";
import { useSEO } from "@/hooks/useSEO";

const AudioConsultation = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"selection" | "live" | "done">("selection");
  const [activeId, setActiveId] = useState<CounselorId>("ava");
  const counselor = getCounselor(activeId);

  useSEO({
    title: "Audio call — Yaro or Ava | WellMind AI",
    description: "Real-time voice call with Yaro or Ava. Eyes closed, just talk. Private and encrypted.",
    path: "/consultation/audio",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <AnimatePresence mode="wait">
          {mode === "selection" && (
            <motion.section
              key="sel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto px-6"
            >
              <Button variant="ghost" onClick={() => navigate("/consultation")} className="mb-4 rounded-full">
                <ArrowLeft className="w-4 h-4 mr-1" /> back
              </Button>
              <div className="text-center mb-10">
                <p className="font-hand text-3xl text-primary mb-2">audio call.</p>
                <h1 className="font-display text-4xl md:text-5xl font-semibold">
                  Pick a voice. <span className="hand-underline">We dial in.</span>
                </h1>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {COUNSELORS.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.12 }}
                    className={`pastel-card hover-lift ${c.paperColor}`}
                    style={{ transform: i === 0 ? "rotate(-0.7deg)" : "rotate(0.7deg)" }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-36 h-36 rounded-full bg-card border-[3px] border-foreground/80 shadow-pencil flex items-center justify-center mb-3">
                        <span className="font-hand text-7xl text-foreground/80">{c.name[0]}</span>
                      </div>
                      <h2 className="font-display text-3xl font-semibold">{c.name}</h2>
                      <p className="font-hand text-2xl text-primary mt-1">{c.tagline}</p>
                      <p className="text-sm text-foreground/70 mt-3 max-w-xs">{c.bio}</p>
                      <Button
                        onClick={() => { setActiveId(c.id); setMode("live"); }}
                        className="mt-5 h-12 px-6 rounded-full bg-foreground text-background border-2 border-foreground hover:bg-foreground/90 font-semibold"
                      >
                        <Phone className="w-4 h-4 mr-2" /> Call {c.name}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {mode === "live" && (
            <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[70vh] flex flex-col items-center justify-center px-6">
              <Button variant="ghost" onClick={() => setMode("selection")} className="mb-4 rounded-full">
                <ArrowLeft className="w-4 h-4 mr-1" /> back
              </Button>
              <ElevenLabsPhoneCounselor
                counselorName={counselor.name}
                specialty="Mental wellness counselor"
                personaPrompt={counselor.audioPrompt}
                firstMessage={counselor.audioFirstMessage}
                onEnd={() => setMode("done")}
              />
            </motion.div>
          )}

          {mode === "done" && (
            <motion.section
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="min-h-[60vh] flex items-center justify-center px-6"
            >
              <div className="pastel-card max-w-md text-center">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="font-display text-2xl mb-2">Call ended</h2>
                <p className="font-hand text-2xl text-foreground/80 mb-6">proud of you for showing up.</p>
                <Button
                  onClick={() => setMode("selection")}
                  className="rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pencil"
                >
                  call again
                </Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      {mode === "selection" && <Footer />}
    </div>
  );
};

export default AudioConsultation;
