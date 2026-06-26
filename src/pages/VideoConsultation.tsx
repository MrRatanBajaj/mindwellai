import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Video, ArrowLeft, Heart, Shield, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNSELORS, getCounselor, type CounselorId } from "@/lib/counselors";
import { useSEO } from "@/hooks/useSEO";
import SoulMachinesSession from "@/components/ui-custom/SoulMachinesSession";
import TavusVideoConsultation from "@/components/ui-custom/TavusVideoConsultation";

const VideoConsultation = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"selection" | "live" | "done">("selection");
  const [activeId, setActiveId] = useState<CounselorId>("ava");
  const counselor = getCounselor(activeId);

  useSEO({
    title: "Video therapy — Yaro or Riya | WellMind AI",
    description: "Face-to-face AI therapy. Private, encrypted, session limits enforced server-side.",
    path: "/consultation/video",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <AnimatePresence mode="wait">
          {mode === "selection" && (
            <motion.section key="sel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-6">
              <Button variant="ghost" onClick={() => navigate("/consultation")} className="mb-4 rounded-full">
                <ArrowLeft className="w-4 h-4 mr-1" /> back
              </Button>
              <div className="text-center mb-10">
                <p className="font-hand text-3xl text-primary mb-2">video therapy.</p>
                <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
                  Pick a face.
                </h1>
                <p className="mt-3 text-foreground/70">A short call, just for you.</p>
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
                      <div className="w-28 h-28 rounded-full bg-[#3a322d] border border-[#F5EFE6]/20 flex items-center justify-center mb-4">
                        <span className="font-display text-5xl text-[#F5EFE6]">{c.name[0]}</span>
                      </div>
                      <h2 className="font-display text-3xl">{c.name}</h2>
                      <p className="text-sm text-[#F5EFE6]/70 mt-2 max-w-xs">{c.tagline}</p>
                      <Button
                        onClick={() => { setActiveId(c.id); setMode("live"); }}
                        className="mt-6 h-12 px-6 rounded-full bg-[#F5EFE6] text-[#2A2522] hover:bg-[#F5EFE6]/90 font-semibold"
                      >
                        <Video className="w-4 h-4 mr-2" /> Start with {c.name}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-foreground/60">
                <span className="inline-flex items-center gap-1.5"><Lock className="w-3 h-3" /> Encrypted in transit</span>
                <span className="inline-flex items-center gap-1.5"><Shield className="w-3 h-3" /> Session length is gated server-side</span>
              </div>
            </motion.section>
          )}

          {mode === "live" && (
            <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-4">
              <Button variant="ghost" onClick={() => setMode("selection")} className="mb-3 rounded-full">
                <ArrowLeft className="w-4 h-4 mr-1" /> end & back
              </Button>
              {activeId === "yaro" ? (
                <div className="rounded-3xl p-2 bg-[#2A2522]">
                  <SoulMachinesSession counselorId="yaro" counselorName="Yaro" />
                  <p className="text-center text-xs text-[#F5EFE6]/60 py-3">Yaro · digital human · encrypted</p>
                </div>
              ) : (
                <TavusVideoConsultation doctorType="general" onEndCall={() => setMode("done")} />
              )}
            </motion.div>
          )}

          {mode === "done" && (
            <motion.section key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="min-h-[60vh] flex items-center justify-center px-6">
              <div className="rounded-3xl p-10 bg-[#2A2522] text-[#F5EFE6] max-w-md text-center">
                <Heart className="w-12 h-12 text-[#E8B8A8] mx-auto mb-4" />
                <h2 className="font-display text-2xl mb-2">Session complete</h2>
                <p className="text-[#F5EFE6]/80 mb-6">Proud of you for showing up.</p>
                <Button onClick={() => setMode("selection")} className="rounded-full bg-[#F5EFE6] text-[#2A2522] hover:bg-[#F5EFE6]/90">new session</Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      {mode === "selection" && <Footer />}
    </div>
  );
};

export default VideoConsultation;
