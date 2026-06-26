import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Video, ArrowLeft, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNSELORS, getCounselor, type CounselorId } from "@/lib/counselors";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSEO } from "@/hooks/useSEO";
import SoulMachinesSession from "@/components/ui-custom/SoulMachinesSession";

const VideoConsultation = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"selection" | "live" | "done">("selection");
  const [activeId, setActiveId] = useState<CounselorId>("ava");
  const counselor = getCounselor(activeId);

  useSEO({
    title: "Video therapy — Yaro or Ava | WellMind AI",
    description: "Face-to-face video therapy session with Yaro or Ava. Instant, private, server-enforced session limits.",
    path: "/consultation/video",
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
                <p className="font-hand text-3xl text-primary mb-2">video therapy.</p>
                <h1 className="font-display text-4xl md:text-5xl font-semibold">
                  Pick a face. <span className="hand-underline">We connect you.</span>
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
                        <Video className="w-4 h-4 mr-2" /> Start video with {c.name}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {mode === "live" && (
            <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GatedVideoCall
                counselor={counselor}
                onEnd={() => setMode("done")}
                onBack={() => setMode("selection")}
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
                <h2 className="font-display text-2xl mb-2">Session complete</h2>
                <p className="font-hand text-2xl text-foreground/80 mb-6">proud of you for showing up.</p>
                <Button
                  onClick={() => setMode("selection")}
                  className="rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pencil"
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

const GatedVideoCall = ({
  counselor, onEnd, onBack,
}: { counselor: ReturnType<typeof getCounselor>; onEnd: () => void; onBack: () => void; }) => {
  const [state, setState] = useState<"loading" | "live" | "blocked">("loading");
  const [blockedMsg, setBlockedMsg] = useState("");
  const [secs, setSecs] = useState(0);
  const [maxSecs, setMaxSecs] = useState(0);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const gate = await supabase.functions.invoke("video-session-gate", {
          body: { action: "start", counselor: counselor.id },
        });
        if (gate.error || gate.data?.allowed === false) {
          if (cancelled) return;
          setBlockedMsg(gate.data?.message || gate.error?.message || "Video unavailable on your current plan.");
          setState("blocked");
          return;
        }
        sessionIdRef.current = gate.data?.sessionId ?? null;
        setMaxSecs(gate.data?.maxSeconds ?? 120);
        if (!cancelled) setState("live");
      } catch (e) {
        if (cancelled) return;
        console.error("video start error:", e);
        setBlockedMsg(e instanceof Error ? e.message : "Couldn't start video session.");
        setState("blocked");
      }
    })();
    return () => { cancelled = true; };
  }, [counselor.id]);

  useEffect(() => {
    if (state !== "live") return;
    const tick = setInterval(() => setSecs((s) => s + 1), 1000);
    const beat = setInterval(async () => {
      if (!sessionIdRef.current) return;
      const { data } = await supabase.functions.invoke("video-session-gate", {
        body: { action: "heartbeat", sessionId: sessionIdRef.current, seconds: secs, counselor: counselor.id },
      });
      if (data?.shouldEnd) {
        toast.info("Time's up — upgrade for longer sessions.");
        endNow();
      }
    }, 15000);
    return () => { clearInterval(tick); clearInterval(beat); };
     
  }, [state, secs, counselor.id]);

  useEffect(() => {
    if (state === "live" && maxSecs > 0 && secs >= maxSecs) {
      toast.info("Session time reached.");
      endNow();
    }
     
  }, [secs, maxSecs, state]);

  const endNow = async () => {
    try {
      if (sessionIdRef.current) {
        await supabase.functions.invoke("video-session-gate", {
          body: { action: "end", sessionId: sessionIdRef.current, seconds: secs, counselor: counselor.id },
        });
      }
    } catch (e) { console.error(e); }
    onEnd();
  };

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  if (state === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="font-hand text-2xl mt-4">connecting to {counselor.name}…</p>
      </div>
    );
  }
  if (state === "blocked") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="pastel-card max-w-md text-center">
          <h2 className="font-display text-2xl mb-2">Video unavailable</h2>
          <p className="font-hand text-xl text-foreground/80 mb-5">{blockedMsg}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button variant="outline" onClick={onBack} className="rounded-full border-2 border-foreground">back</Button>
            <Button onClick={() => window.location.assign("/plans")} className="rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pencil">upgrade</Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" onClick={endNow} className="rounded-full">
          <ArrowLeft className="w-4 h-4 mr-1" /> end
        </Button>
        <div className="font-hand text-2xl text-primary">{fmt(secs)} / {fmt(maxSecs)}</div>
      </div>
      <div className="pastel-card p-2 bg-foreground/95">
        <SoulMachinesSession counselorId={counselor.id} counselorName={counselor.name} />
      </div>
      <p className="text-center text-xs text-foreground/60 mt-3">Soul Machines digital human · Encrypted · Server-enforced limit</p>
    </div>
  );
};

export default VideoConsultation;
