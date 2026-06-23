import { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ElevenLabsPhoneCounselor from "@/components/ui-custom/ElevenLabsPhoneCounselor";
import { Button } from "@/components/ui/button";
import { Video, Phone, Heart, Sparkles, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNSELORS, getCounselor, type CounselorId } from "@/lib/counselors";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Mode = "selection" | "video" | "audio" | "completed";

const Consultation = () => {
  const [mode, setMode] = useState<Mode>("selection");
  const [activeId, setActiveId] = useState<CounselorId>("ava");

  const counselor = getCounselor(activeId);

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
              <div className="text-center mb-12">
                <p className="font-hand text-3xl text-primary mb-2">say hi.</p>
                <h1 className="font-display text-4xl md:text-5xl font-semibold text-balance">
                  Two counselors. <span className="hand-underline">One tap to talk.</span>
                </h1>
                <p className="text-foreground/70 mt-4 max-w-md mx-auto">
                  No forms. No booking. Pick a face, tap video or voice, and we connect you instantly.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {COUNSELORS.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.12 }}
                    className={`pastel-card hover-lift ${c.paperColor} relative overflow-hidden`}
                    style={{ transform: i === 0 ? "rotate(-0.7deg)" : "rotate(0.7deg)" }}
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Face placeholder — crayon-style portrait container */}
                      <div className="relative mb-4">
                        <div className="w-36 h-36 rounded-full bg-card border-[3px] border-foreground/80 shadow-pencil flex items-center justify-center overflow-hidden">
                          <span className="font-hand text-7xl text-foreground/80">{c.name[0]}</span>
                        </div>
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-card border-2 border-foreground/80 text-xs font-semibold">
                          online
                        </span>
                      </div>

                      <h2 className="font-display text-3xl font-semibold">{c.name}</h2>
                      <p className="font-hand text-2xl text-primary mt-1">{c.tagline}</p>
                      <p className="text-sm text-foreground/70 mt-3 max-w-xs">{c.bio}</p>

                      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-6">
                        <Button
                          onClick={() => { setActiveId(c.id); setMode("video"); }}
                          className="h-12 rounded-full bg-foreground text-background border-2 border-foreground hover:bg-foreground/90 font-semibold"
                        >
                          <Video className="w-4 h-4 mr-1.5" /> Video
                        </Button>
                        <Button
                          onClick={() => { setActiveId(c.id); setMode("audio"); }}
                          variant="outline"
                          className="h-12 rounded-full border-2 border-foreground hover:bg-card/60 font-semibold"
                        >
                          <Phone className="w-4 h-4 mr-1.5" /> Voice
                        </Button>
                      </div>
                      <p className="text-xs text-foreground/60 mt-3 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> starts instantly
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {mode === "video" && (
            <motion.div key="vid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GatedVideoCall counselor={counselor} onEnd={() => setMode("completed")} onBack={() => setMode("selection")} />
            </motion.div>
          )}

          {mode === "audio" && (
            <motion.div key="aud" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[70vh] flex flex-col items-center justify-center px-6">
              <Button variant="ghost" onClick={() => setMode("selection")} className="mb-4 rounded-full">
                <ArrowLeft className="w-4 h-4 mr-1" /> back
              </Button>
              <ElevenLabsPhoneCounselor
                agentId={undefined}
                counselorName={counselor.name}
                specialty="Mental wellness counselor"
                personaPrompt={counselor.audioPrompt}
                firstMessage={counselor.audioFirstMessage}
                onEnd={() => setMode("completed")}
              />
            </motion.div>
          )}

          {mode === "completed" && (
            <motion.section
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="min-h-[60vh] flex items-center justify-center px-6"
            >
              <div className="pastel-card max-w-md text-center">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="font-display text-2xl mb-2">Session complete</h2>
                <p className="font-hand text-2xl text-foreground/80 mb-6">
                  proud of you for showing up.
                </p>
                <Button onClick={() => setMode("selection")} className="rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pencil">
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

/* ─── Gated video call — server enforces per-plan minute & session limits ─── */
const GatedVideoCall = ({
  counselor, onEnd, onBack,
}: { counselor: ReturnType<typeof getCounselor>; onEnd: () => void; onBack: () => void; }) => {
  const [state, setState] = useState<"loading" | "live" | "blocked">("loading");
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [blockedMsg, setBlockedMsg] = useState("");
  const [secs, setSecs] = useState(0);
  const [maxSecs, setMaxSecs] = useState(0);
  const sessionIdRef = useRef<string | null>(null);
  const tavusIdRef = useRef<string | null>(null);

  // Ask gate for permission, then create Tavus conversation
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const gate = await supabase.functions.invoke("video-session-gate", {
          body: { action: "start", counselor: counselor.id },
        });
        if (gate.error || !gate.data?.allowed) {
          if (cancelled) return;
          setBlockedMsg(gate.data?.message || gate.error?.message || "Video unavailable.");
          setState("blocked");
          return;
        }
        sessionIdRef.current = gate.data.sessionId;
        setMaxSecs(gate.data.maxSeconds);

        const persona = await supabase.functions.invoke("tavus-conversation", {
          body: { action: "create_persona", doctorType: counselor.doctorType },
        });
        if (persona.error || persona.data?.error) throw new Error(persona.data?.error || persona.error?.message);

        let convUrl = persona.data?.conversation_url as string | undefined;
        let convId = persona.data?.conversation_id as string | undefined;

        if (!convUrl && persona.data?.persona_id) {
          const conv = await supabase.functions.invoke("tavus-conversation", {
            body: { action: "create_conversation", personaId: persona.data.persona_id, doctorType: counselor.doctorType },
          });
          if (conv.error || conv.data?.error) throw new Error(conv.data?.error || conv.error?.message);
          convUrl = conv.data?.conversation_url;
          convId = conv.data?.conversation_id;
        }
        if (!convUrl) throw new Error("Could not start video session");
        if (cancelled) return;
        tavusIdRef.current = convId ?? null;
        setConversationUrl(convUrl);
        setState("live");
      } catch (e) {
        if (cancelled) return;
        console.error(e);
        setBlockedMsg(e instanceof Error ? e.message : "Couldn't start session");
        setState("blocked");
      }
    })();
    return () => { cancelled = true; };
  }, [counselor.id, counselor.doctorType]);

  // Local ticker + heartbeat
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
        await endNow();
      }
    }, 15000);
    return () => { clearInterval(tick); clearInterval(beat); };
  }, [state, secs, counselor.id]);

  // Auto-end if local seconds exceed max
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
      if (tavusIdRef.current) {
        await supabase.functions.invoke("tavus-conversation", {
          body: { action: "end_conversation", conversationId: tavusIdRef.current },
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
          <h2 className="font-display text-2xl mb-2">Video locked</h2>
          <p className="font-hand text-xl text-foreground/80 mb-5">{blockedMsg}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onBack} className="rounded-full border-2 border-foreground">back</Button>
            <Button onClick={() => window.location.assign("/subscription")} className="rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pencil">upgrade</Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" onClick={endNow} className="rounded-full"><ArrowLeft className="w-4 h-4 mr-1" /> end</Button>
        <div className="font-hand text-2xl text-primary">{fmt(secs)} / {fmt(maxSecs)}</div>
      </div>
      <div className="pastel-card p-2 bg-foreground/95">
        <iframe
          src={conversationUrl!}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="w-full aspect-video rounded-2xl border-0"
          title={`${counselor.name} video session`}
        />
      </div>
      <p className="text-center text-xs text-foreground/60 mt-3">Encrypted · Private · Server-enforced limit</p>
    </div>
  );
};

export default Consultation;
