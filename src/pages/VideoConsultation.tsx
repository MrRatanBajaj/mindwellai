import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Video, ArrowLeft, Heart, Shield, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNSELORS, getCounselor, type CounselorId } from "@/lib/counselors";
import { useSEO } from "@/hooks/useSEO";
import TavusCall from "@/components/ui-custom/TavusCall";

const VideoConsultation = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"selection" | "live" | "done">("selection");
  const [activeId, setActiveId] = useState<CounselorId>("ava");
  const counselor = getCounselor(activeId);

  useSEO({
    title: "Video therapy — Yaro or Ava | WellMind AI",
    description: "Face-to-face AI therapy. Private, encrypted, session limits enforced server-side.",
    path: "/consultation/video",
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow pb-12 pt-24">
        <AnimatePresence mode="wait">
          {mode === "selection" && (
            <motion.section
              key="sel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-4xl px-6"
            >
              <Button variant="ghost" onClick={() => navigate("/consultation")} className="mb-4 rounded-full">
                <ArrowLeft className="mr-1 h-4 w-4" /> back
              </Button>
              <div className="mb-10 text-center">
                <p className="font-hand mb-2 text-3xl text-primary">video therapy.</p>
                <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">Pick a face.</h1>
                <p className="mt-3 text-foreground/70">One tap — the call starts right away.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {COUNSELORS.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.12 }}
                    className="rounded-3xl bg-[#2A2522] p-7 text-[#F5EFE6] shadow-crayon transition-transform hover:translate-y-[-4px]"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full border border-[#F5EFE6]/20 bg-[#3a322d]">
                        <span className="font-display text-5xl text-[#F5EFE6]">{c.name[0]}</span>
                      </div>
                      <h2 className="font-display text-3xl">{c.name}</h2>
                      <p className="mt-1 text-xs uppercase tracking-widest text-[#F5EFE6]/50">
                        {c.pronoun === "he" ? "male counsellor" : "female counsellor"}
                      </p>
                      <p className="mt-2 max-w-xs text-sm text-[#F5EFE6]/70">{c.tagline}</p>
                      <Button
                        onClick={() => {
                          setActiveId(c.id);
                          setMode("live");
                        }}
                        className="mt-6 h-12 rounded-full bg-[#F5EFE6] px-6 font-semibold text-[#2A2522] hover:bg-[#F5EFE6]/90"
                      >
                        <Video className="mr-2 h-4 w-4" /> Start video call with {c.name}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-foreground/60">
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3 w-3" /> Encrypted in transit
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-3 w-3" /> Session length is gated server-side
                </span>
              </div>
            </motion.section>
          )}

          {mode === "live" && (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-4xl px-4"
            >
              <Button variant="ghost" onClick={() => setMode("selection")} className="mb-3 rounded-full">
                <ArrowLeft className="mr-1 h-4 w-4" /> end &amp; back
              </Button>
              <TavusCall counselorId={activeId} counselorName={counselor.name} onEnd={() => setMode("done")} />
            </motion.div>
          )}

          {mode === "done" && (
            <motion.section
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex min-h-[60vh] items-center justify-center px-6"
            >
              <div className="max-w-md rounded-3xl bg-[#2A2522] p-10 text-center text-[#F5EFE6]">
                <Heart className="mx-auto mb-4 h-12 w-12 text-[#E8B8A8]" />
                <h2 className="mb-2 font-display text-2xl">Session complete</h2>
                <p className="mb-6 text-[#F5EFE6]/80">Proud of you for showing up.</p>
                <Button
                  onClick={() => setMode("selection")}
                  className="rounded-full bg-[#F5EFE6] text-[#2A2522] hover:bg-[#F5EFE6]/90"
                >
                  new session
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

export default VideoConsultation;
