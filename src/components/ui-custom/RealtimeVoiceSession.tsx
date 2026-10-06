import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { onStopAllAudio } from "@/lib/audioGuard";

interface Props {
  counselorName: string;
  voiceGender: "male" | "female";
  systemPrompt?: string;
  onEnd?: () => void;
  /** called when the live voice can't start, so the page can use the backup voice */
  onFallback?: (reason: string) => void;
}

type Phase = "connecting" | "listening" | "speaking" | "error";
type Line = { who: "you" | "them"; text: string };

const PHASE_COPY: Record<Phase, string> = {
  connecting: "Settling in…",
  listening: "I'm listening. Take your time.",
  speaking: "",
  error: "",
};

/** Live, natural two-way voice call — feels like a phone call with a therapist. */
const RealtimeVoiceSession = ({ counselorName, voiceGender, systemPrompt, onEnd, onFallback }: Props) => {
  const [phase, setPhase] = useState<Phase>("connecting");
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  const hangup = useCallback(() => {
    try { pcRef.current?.close(); } catch { /* noop */ }
    micRef.current?.getTracks().forEach((t) => t.stop());
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.srcObject = null; }
    pcRef.current = null;
    micRef.current = null;
  }, []);

  useEffect(() => onStopAllAudio(hangup), [hangup]);
  useEffect(() => () => hangup(), [hangup]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("realtime-voice-session", {
          body: { gender: voiceGender, counselorName, prompt: systemPrompt },
        });
        if (error || !data?.client_secret) throw new Error(data?.error || error?.message || "Voice unavailable");

        const pc = new RTCPeerConnection();
        pcRef.current = pc;
        const el = new Audio();
        el.autoplay = true;
        audioRef.current = el;
        pc.ontrack = (e) => { el.srcObject = e.streams[0]; void el.play().catch(() => {}); };

        const mic = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
        micRef.current = mic;
        pc.addTrack(mic.getTracks()[0], mic);

        const dc = pc.createDataChannel("oai-events");
        dc.onopen = () => {
          dc.send(JSON.stringify({
            type: "response.create",
            response: { instructions: "Greet the person warmly in one or two short sentences, introduce yourself by name, and gently ask how they are feeling right now." },
          }));
        };
        dc.onmessage = (ev) => {
          try {
            const m = JSON.parse(ev.data);
            if (m.type === "output_audio_buffer.started") setPhase("speaking");
            if (m.type === "output_audio_buffer.stopped" || m.type === "input_audio_buffer.speech_started") setPhase("listening");
            if (m.type === "response.output_audio_transcript.done" && m.transcript)
              setLines((l) => [...l, { who: "them", text: m.transcript }].slice(-8));
            if (m.type === "conversation.item.input_audio_transcription.completed" && m.transcript?.trim())
              setLines((l) => [...l, { who: "you", text: m.transcript.trim() }].slice(-8));
          } catch { /* ignore */ }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        const r = await fetch("https://api.openai.com/v1/realtime/calls", {
          method: "POST",
          body: offer.sdp,
          headers: { Authorization: `Bearer ${data.client_secret}`, "Content-Type": "application/sdp" },
        });
        if (!r.ok) throw new Error(`Voice connection failed (${r.status})`);
        await pc.setRemoteDescription({ type: "answer", sdp: await r.text() });
        setPhase("listening");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Voice unavailable";
        console.error("[RealtimeVoice]", msg);
        hangup();
        setPhase("error");
        onFallback?.(msg);
      }
    })();
  }, [counselorName, voiceGender, systemPrompt, hangup, onFallback]);

  useEffect(() => {
    if (phase === "connecting" || phase === "error") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const toggleMute = () => {
    const track = micRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = muted;
    setMuted(!muted);
  };

  const end = () => { hangup(); onEnd?.(); };
  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const lastThem = [...lines].reverse().find((l) => l.who === "them");

  return (
    <div className="w-full max-w-xl">
      <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-elegant">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {phase === "connecting" ? "connecting" : `on call · ${mmss}`}
        </p>

        <div className="relative mx-auto my-8 flex h-44 w-44 items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute inset-0 rounded-full bg-primary/15"
              animate={phase === "speaking" ? { scale: [1, 1.35 + i * 0.12], opacity: [0.5, 0] } : { scale: 1, opacity: phase === "listening" ? 0.35 : 0.2 }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.45 }}
            />
          ))}
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
            {phase === "connecting" ? <Loader2 className="h-8 w-8 animate-spin" /> : <span className="font-display text-5xl">{counselorName[0]}</span>}
          </div>
        </div>

        <h2 className="font-display text-3xl text-foreground">{counselorName}</h2>
        <p className="mt-2 min-h-[3rem] text-base leading-relaxed text-foreground/75">
          {phase === "speaking" && lastThem ? `“${lastThem.text}”` : PHASE_COPY[phase] || (muted ? "You're muted. Unmute whenever you're ready." : "")}
        </p>

        {lines.length > 0 && (
          <div className="mt-6 max-h-48 space-y-2 overflow-y-auto rounded-2xl bg-secondary/50 p-4 text-left text-sm">
            {lines.map((l, i) => (
              <p key={i} className={l.who === "you" ? "text-foreground" : "text-foreground/70"}>
                <span className="mr-2 text-xs font-medium text-muted-foreground">{l.who === "you" ? "You" : counselorName}</span>
                {l.text}
              </p>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-4">
          <Button variant="outline" onClick={toggleMute} disabled={phase === "connecting"} className="h-14 w-14 rounded-full p-0" aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button onClick={end} variant="destructive" className="h-14 rounded-full px-8" aria-label="End call">
            <PhoneOff className="mr-2 h-5 w-5" /> End call
          </Button>
        </div>
        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="h-3 w-3" /> Speak naturally — you can interrupt anytime. In crisis, call Tele-MANAS 14416.
        </p>
      </div>
    </div>
  );
};

export default RealtimeVoiceSession;
