import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Video, VideoOff, ShieldCheck } from "lucide-react";
import FreeVoiceSession from "@/components/ui-custom/FreeVoiceSession";
import yaroImg from "@/assets/yaro-robot.png";
import avaImg from "@/assets/sophia-avatar.jpg";

type Phase = "idle" | "listening" | "thinking" | "speaking" | "error";

interface Props {
  counselorId: "yaro" | "ava";
  counselorName: string;
  greeting?: string;
  systemPrompt?: string;
  onEnd: (summary: { seconds: number; phq9: number | null; gad7: number | null }) => void;
}

/**
 * In-house face-to-face therapy session. No third-party avatar vendor or credits:
 * your camera + a live animated counsellor, driven by the same clinical voice engine.
 */
const LiveAvatarSession = ({ counselorId, counselorName, greeting, systemPrompt, onEnd }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startRef = useRef(Date.now());
  const scoresRef = useRef<{ phq9: number | null; gad7: number | null }>({ phq9: null, gad7: null });
  const [camOn, setCamOn] = useState(true);
  const [camError, setCamError] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
        if (cancelled) return s.getTracks().forEach((t) => t.stop());
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch {
        setCamError(true);
        setCamOn(false);
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleCam = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCamOn(track.enabled);
  };

  const handlePhase = useCallback((p: Phase) => setPhase(p), []);
  const handleClinical = useCallback((c: { phq9: number; gad7: number }) => {
    scoresRef.current = { phq9: c.phq9, gad7: c.gad7 };
  }, []);

  const finish = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onEnd({ seconds: Math.round((Date.now() - startRef.current) / 1000), ...scoresRef.current });
  };

  const speaking = phase === "speaking";
  const img = counselorId === "yaro" ? yaroImg : avaImg;

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
      {/* Stage */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-secondary via-background to-accent/30 shadow-elegant sm:aspect-video lg:aspect-auto lg:min-h-[520px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <motion.span
              className="absolute -inset-8 rounded-full bg-primary/20 blur-2xl"
              animate={{ scale: speaking ? [1, 1.18, 1] : phase === "listening" ? [1, 1.05, 1] : 1, opacity: speaking ? [0.7, 0.35, 0.7] : 0.4 }}
              transition={{ duration: speaking ? 0.9 : 2.4, repeat: Infinity }}
            />
            <motion.img
              src={img}
              alt={`${counselorName}, your counsellor`}
              className={`relative h-56 w-56 object-cover shadow-xl sm:h-72 sm:w-72 ${counselorId === "yaro" ? "object-contain" : "rounded-full border-4 border-card"}`}
              animate={{ y: speaking ? [0, -4, 0, -2, 0] : [0, -6, 0], scale: speaking ? [1, 1.015, 1] : 1 }}
              transition={{ duration: speaking ? 0.6 : 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-card/85 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md">
          <span className={`h-2 w-2 rounded-full ${speaking ? "bg-primary animate-pulse" : phase === "listening" ? "bg-accent-foreground animate-pulse" : "bg-muted-foreground"}`} />
          {counselorName} · {speaking ? "speaking" : phase === "listening" ? "listening" : phase === "thinking" ? "thinking" : "connecting"}
        </div>
        <div className="absolute right-4 top-4 hidden items-center gap-1.5 rounded-full bg-card/85 px-3 py-1.5 text-xs text-foreground/70 backdrop-blur-md sm:inline-flex">
          <ShieldCheck className="h-3.5 w-3.5" /> private · not recorded
        </div>

        {/* Your camera */}
        <div className="absolute bottom-4 right-4 h-28 w-40 overflow-hidden rounded-2xl border-2 border-card bg-muted shadow-lg sm:h-36 sm:w-48">
          {camOn && !camError ? (
            <video ref={videoRef} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              {camError ? "camera off" : "you"}
            </div>
          )}
          {!camError && (
            <button
              onClick={toggleCam}
              aria-label={camOn ? "Turn camera off" : "Turn camera on"}
              className="absolute bottom-1.5 left-1.5 rounded-full bg-card/90 p-1.5 text-foreground"
            >
              {camOn ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Voice engine + transcript */}
      <FreeVoiceSession
        counselorName={counselorName}
        voiceGender={counselorId === "yaro" ? "male" : "female"}
        language="auto"
        systemPrompt={systemPrompt}
        greeting={greeting}
        onPhase={handlePhase}
        onClinical={handleClinical}
        onEnd={finish}
      />
    </div>
  );
};

export default LiveAvatarSession;
