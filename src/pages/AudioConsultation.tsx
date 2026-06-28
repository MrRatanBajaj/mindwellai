import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HumeEVISession from "@/components/ui-custom/HumeEVISession";
import { Button } from "@/components/ui/button";
import { Phone, ArrowLeft, Heart, Mic, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNSELORS, getCounselor, type CounselorId } from "@/lib/counselors";
import { useSEO } from "@/hooks/useSEO";

const LANGUAGES = [
  { code: "auto", label: "Auto-detect" },
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "hinglish", label: "Hinglish" },
  { code: "ta", label: "தமிழ்" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "es", label: "Español" },
];

const AudioConsultation = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"selection" | "live" | "done">("selection");
  const [activeId, setActiveId] = useState<CounselorId>("ava");
  const [language, setLanguage] = useState<string>("auto");
  const counselor = getCounselor(activeId);

  useSEO({
    title: "Audio therapy — Yaro or Ava | WellMindAI",
    description: "Voice-to-voice AI therapy in your language. Hume EVI detects emotion in real-time. Yaro (male) or Ava (female).",
    path: "/consultation/audio",
  });

  const langLabel = LANGUAGES.find((l) => l.code === language)?.label ?? "Auto";
  const languageInstruction =
    language === "auto"
      ? "Mirror the language the user speaks in (English, Hindi, Hinglish, Tamil, Bengali, Marathi, Spanish, etc.)."
      : `Respond primarily in ${langLabel}. If user switches language, follow them.`;

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
                <p className="text-foreground/70 mt-3">
                  Voice-to-voice with real emotion detection — in your language.
                </p>
              </div>

              {/* Language picker */}
              <div className="flex flex-col items-center gap-2 mb-8">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <Globe className="w-3.5 h-3.5" /> Response language
                </div>
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`px-3.5 h-9 rounded-full text-sm border transition ${
                        language === l.code
                          ? "bg-foreground text-background border-foreground"
                          : "bg-card text-foreground/80 border-border hover:border-foreground/40"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
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
                      <p className="text-xs uppercase tracking-widest text-[#F5EFE6]/60 mt-1">
                        {c.pronoun === "he" ? "Male voice" : "Female voice"}
                      </p>
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
              <HumeEVISession
                counselorName={counselor.name}
                voiceGender={counselor.pronoun === "he" ? "male" : "female"}
                systemPrompt={`${counselor.audioPrompt}\n\nLANGUAGE: ${languageInstruction}`}
                onEnd={() => setMode("done")}
              />
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
