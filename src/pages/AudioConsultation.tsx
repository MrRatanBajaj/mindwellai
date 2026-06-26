import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ElevenLabsPhoneCounselor from "@/components/ui-custom/ElevenLabsPhoneCounselor";
import HumeEVISession from "@/components/ui-custom/HumeEVISession";
import { Button } from "@/components/ui/button";
import { Phone, ArrowLeft, Heart, Mic, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNSELORS, getCounselor, type CounselorId } from "@/lib/counselors";
import { useSEO } from "@/hooks/useSEO";

type Engine = "hume" | "elevenlabs";

const AudioConsultation = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"selection" | "live" | "done">("selection");
  const [activeId, setActiveId] = useState<CounselorId>("ava");
  const [engine, setEngine] = useState<Engine>("hume");
  const counselor = getCounselor(activeId);

  useSEO({
    title: "Audio therapy — Yaro or Riya | WellMind AI",
    description: "Voice-to-voice AI therapy. Hume EVI detects emotion in real-time, or use ElevenLabs Conversational AI.",
    path: "/consultation/audio",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <AnimatePresence mode="wait">
          {mode === "selection" && (
            <motion.section key="sel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto px-6">
              <Button variant="ghost" onClick={() => navigate("/consultation")} className="mb-4 rounded-full">
                <ArrowLeft className="w-4 h-4 mr-1" /> back
              </Button>
              <div className="text-center mb-8">
                <p className="font-hand text-3xl text-primary mb-2">audio therapy.</p>
                <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
                  Talk it out. <span className="hand-underline">We listen.</span>
                </h1>
              </div>

              {/* Engine toggle */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-full bg-secondary p-1 border border-border">
                  <button
                    onClick={() => setEngine("hume")}
                    className={`px-5 h-10 rounded-full text-sm font-medium flex items-center gap-1.5 transition ${engine === "hume" ? "bg-foreground text-background" : "text-foreground/70"}`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Hume EVI · emotion-aware
                  </button>
                  <button
                    onClick={() => setEngine("elevenlabs")}
                    className={`px-5 h-10 rounded-full text-sm font-medium transition ${engine === "elevenlabs" ? "bg-foreground text-background" : "text-foreground/70"}`}
                  >
                    ElevenLabs · fast
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {COUNSELORS.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.12 }}
                    className="rounded-3xl p-7 bg-[#2A2522] text-[#F5EFE6] shadow-crayon hover:translate-y-[-4px] transition-transform"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-32 h-32 rounded-full bg-[#3a322d] border border-[#F5EFE6]/20 flex items-center justify-center mb-4 relative">
                        <Mic className="w-12 h-12 text-[#E8B8A8]" />
                        <span className="absolute -bottom-2 right-2 font-display text-2xl bg-[#F5EFE6] text-[#2A2522] rounded-full w-10 h-10 flex items-center justify-center">{c.name[0]}</span>
                      </div>
                      <h2 className="font-display text-3xl">{c.name}</h2>
                      <p className="text-sm text-[#F5EFE6]/70 mt-2 max-w-xs">{c.tagline}</p>
                      <Button
                        onClick={() => { setActiveId(c.id); setMode("live"); }}
                        className="mt-6 h-12 px-6 rounded-full bg-[#F5EFE6] text-[#2A2522] hover:bg-[#F5EFE6]/90 font-semibold"
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
              {engine === "hume" ? (
                <HumeEVISession
                  counselorName={counselor.name}
                  systemPrompt={counselor.audioPrompt}
                  onEnd={() => setMode("done")}
                />
              ) : (
                <ElevenLabsPhoneCounselor
                  counselorName={counselor.name}
                  specialty="Mental wellness counselor"
                  personaPrompt={counselor.audioPrompt}
                  firstMessage={counselor.audioFirstMessage}
                  onEnd={() => setMode("done")}
                />
              )}
            </motion.div>
          )}

          {mode === "done" && (
            <motion.section key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="min-h-[60vh] flex items-center justify-center px-6">
              <div className="rounded-3xl p-10 bg-[#2A2522] text-[#F5EFE6] max-w-md text-center">
                <Heart className="w-12 h-12 text-[#E8B8A8] mx-auto mb-4" />
                <h2 className="font-display text-2xl mb-2">Call ended</h2>
                <p className="text-[#F5EFE6]/80 mb-6">Proud of you for showing up.</p>
                <Button onClick={() => setMode("selection")} className="rounded-full bg-[#F5EFE6] text-[#2A2522] hover:bg-[#F5EFE6]/90">call again</Button>
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
