import { useConversation } from "@11labs/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff, Volume2, Loader2, Heart, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface Props {
  agentId?: string;
  counselorName?: string;
  specialty?: string;
  autoStart?: boolean;
  onEnd?: () => void;
  /** Hinglish system prompt override for this call (e.g. from ARIA_PERSONAS). */
  personaPrompt?: string;
  /** Hinglish opening line spoken by Aria. */
  firstMessage?: string;
}


/**
 * ElevenLabs-powered phone-call counselor.
 * Auto-rings on mount (like an actual incoming call), then connects to the agent.
 */
const ElevenLabsPhoneCounselor = ({
  agentId,
  counselorName = "Dr. Aria",
  specialty = "AI Mental Wellness Counselor",
  autoStart = true,
  onEnd,
  personaPrompt,
  firstMessage,
}: Props) => {

  const [phase, setPhase] = useState<"ringing" | "connecting" | "in-call" | "ended">("ringing");
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const started = useRef(false);

  const conversation = useConversation({
    onConnect: () => {
      setPhase("in-call");
      toast.success(`Connected with ${counselorName}`);
    },
    onDisconnect: () => {
      setPhase("ended");
    },
    onError: (e) => {
      console.error("ElevenLabs error:", e);
      toast.error("Call dropped. Please try again.");
      setPhase("ended");
    },
  });

  const startCall = useCallback(async () => {
    if (started.current) return;
    started.current = true;
    setPhase("connecting");
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const { data, error } = await supabase.functions.invoke("elevenlabs-conversation-token", {
        body: { agentId },
      });
      if (error || !data?.signedUrl) {
        throw new Error(error?.message || "No signed URL");
      }
      const overrides =
        personaPrompt || firstMessage
          ? {
              agent: {
                ...(personaPrompt ? { prompt: { prompt: personaPrompt } } : {}),
                ...(firstMessage ? { firstMessage } : {}),
                language: "hi",
              },
            }
          : undefined;
      await conversation.startSession({
        signedUrl: data.signedUrl,
        ...(overrides ? { overrides } : {}),
      } as Parameters<typeof conversation.startSession>[0]);
    } catch (e) {

      console.error(e);
      toast.error(
        e instanceof Error && /mic|permission|NotAllowed/i.test(e.message)
          ? "Please allow microphone access to take the call."
          : "Could not start the call. Please retry.",
      );
      setPhase("ended");
      started.current = false;
    }
  }, [agentId, conversation, personaPrompt, firstMessage]);

  // Auto-ring then connect
  useEffect(() => {
    if (!autoStart) return;
    const t = setTimeout(() => { startCall(); }, 1400);
    return () => clearTimeout(t);
  }, [autoStart, startCall]);

  // Timer
  useEffect(() => {
    if (phase !== "in-call") return;
    const i = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(i);
  }, [phase]);

  const endCall = async () => {
    try { await conversation.endSession(); } catch { /* ignore */ }
    setPhase("ended");
    onEnd?.();
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const ringing = phase === "ringing" || phase === "connecting";
  const live = phase === "in-call";

  return (
    <div className="relative mx-auto max-w-md w-full rounded-[2rem] overflow-hidden bg-investor text-primary-foreground shadow-elegant">
      {/* Status bar */}
      <div className="flex items-center justify-between px-6 pt-6 text-[11px] uppercase tracking-[0.18em] opacity-80">
        <span>WellMindAI</span>
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${live ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"}`} />
          {ringing ? "Ringing…" : live ? "Encrypted call" : "Call ended"}
        </span>
      </div>

      <div className="px-6 py-12 text-center">
        <p className="text-xs opacity-70 mb-1 tracking-widest uppercase">Incoming call</p>
        <h2 className="font-display text-4xl mb-1">{counselorName}</h2>
        <p className="text-sm opacity-80 serif-italic">{specialty}</p>

        <div className="relative my-10 inline-block">
          <motion.div
            className="absolute inset-0 rounded-full bg-accent/30"
            animate={ringing ? { scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] } : live ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: ringing ? 2 : 1.6, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-accent/20"
            animate={ringing ? { scale: [1, 2.2, 1], opacity: [0.4, 0, 0.4] } : {}}
            transition={{ duration: 2.4, repeat: Infinity, delay: 0.4 }}
          />
          <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-accent to-primary-glow flex items-center justify-center ring-4 ring-accent/40">
            <Heart className="w-14 h-14 text-primary" strokeWidth={1.6} />
          </div>
        </div>

        {live && (
          <div className="text-3xl font-display tabular-nums mb-2">{fmt(duration)}</div>
        )}
        {live && (
          <p className="text-xs opacity-75 mb-2">
            {conversation.isSpeaking ? `${counselorName} is speaking…` : "Listening to you"}
          </p>
        )}
        {phase === "ended" && (
          <p className="text-sm opacity-80 mt-2">Call ended. Take care of yourself today.</p>
        )}
      </div>

      {/* Controls */}
      <div className="px-8 pb-10 flex items-center justify-center gap-6">
        {live ? (
          <>
            <button
              onClick={() => { setMuted((m) => !m); conversation.setVolume({ volume: muted ? 1 : 0 }); }}
              className="w-14 h-14 rounded-full bg-foreground/15 backdrop-blur flex items-center justify-center hover:bg-foreground/25 transition"
              aria-label="Mute"
            >
              {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={endCall}
              className="w-20 h-20 rounded-full bg-destructive hover:bg-destructive/90 flex items-center justify-center shadow-lg"
              aria-label="End call"
            >
              <PhoneOff className="w-8 h-8 text-destructive-foreground" />
            </button>

            <div className="w-14 h-14 rounded-full bg-foreground/15 backdrop-blur flex items-center justify-center">
              <Volume2 className="w-6 h-6" />
            </div>
          </>
        ) : ringing ? (
          <button
            onClick={endCall}
            className="w-20 h-20 rounded-full bg-destructive hover:bg-destructive/90 flex items-center justify-center"
            aria-label="Cancel call"
          >
            {phase === "connecting"
              ? <Loader2 className="w-8 h-8 text-destructive-foreground animate-spin" />
              : <PhoneOff className="w-8 h-8 text-destructive-foreground" />}
          </button>
        ) : (
          <button
            onClick={() => { started.current = false; setPhase("ringing"); setDuration(0); startCall(); }}
            className="px-6 h-14 rounded-full bg-accent text-accent-foreground font-semibold flex items-center gap-2 shadow-gold"
          >
            <Phone className="w-5 h-5" /> Call again
          </button>
        )}
      </div>

      <div className="bg-foreground/10 backdrop-blur px-6 py-3 flex items-center justify-center gap-2 text-[11px] opacity-80">
        <Shield className="w-3 h-3" /> End-to-end encrypted • Private to you
      </div>
    </div>
  );
};

export default ElevenLabsPhoneCounselor;
