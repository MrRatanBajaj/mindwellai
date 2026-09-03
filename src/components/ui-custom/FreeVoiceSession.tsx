import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, Loader2, Volume2, AlertTriangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/**
 * Voice therapy with real turn-taking.
 * Two-way spoken conversation with per-turn DSM-5 / PHQ-9 / GAD-7 / PCL-5 / C-SSRS
 * pattern analysis. The mic is hard-stopped while the counsellor speaks (no echo loop).
 */

interface Props {
  counselorName: string;
  voiceGender: "male" | "female";
  language: string;
  systemPrompt?: string;
  onEnd?: () => void;
}

type Clinical = {
  phq9: { score: number; band: string; symptoms: string[] };
  gad7: { score: number; band: string; symptoms: string[] };
  pcl5: { symptoms: string[] };
  crisis: boolean;
  dsmHints: string[];
};

const LOCALE: Record<string, string> = {
  auto: "en-IN",
  en: "en-IN",
  hi: "hi-IN",
  hinglish: "en-IN",
  ta: "ta-IN",
  bn: "bn-IN",
  mr: "mr-IN",
  es: "es-ES",
};

type Turn = { who: "you" | "them"; text: string };
type Phase = "idle" | "listening" | "thinking" | "speaking" | "error";

const FreeVoiceSession = ({ counselorName, voiceGender, language, systemPrompt, onEnd }: Props) => {
  const [supported, setSupported] = useState(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const [micDenied, setMicDenied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [interim, setInterim] = useState("");
  const [clinical, setClinical] = useState<Clinical | null>(null);
  const [level, setLevel] = useState(0);

  const recogRef = useRef<any>(null);
  const historyRef = useRef<{ sender: "user" | "ai"; content: string }[]>([]);
  const aliveRef = useRef(true);
  const busyRef = useRef(false); // thinking or speaking → mic must stay off
  const mutedRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>();

  const locale = LOCALE[language] ?? "en-IN";
  const replyLocaleRef = useRef(locale);

  /* ── mic level meter (visual proof the mic is live) ── */
  const startMeter = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let peak = 0;
        for (let i = 0; i < buf.length; i++) peak = Math.max(peak, Math.abs(buf[i] - 128) / 128);
        setLevel(peak);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
      return true;
    } catch {
      setMicDenied(true);
      setNotice("Microphone blocked. Allow mic access in your browser, then reload this page.");
      return false;
    }
  }, []);

  /* ── speak, with mic hard-stopped so it never hears itself ── */
  const speak = useCallback(
    (text: string) =>
      new Promise<void>((resolve) => {
        if (!("speechSynthesis" in window)) return resolve();
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        const spokenLocale = replyLocaleRef.current || locale;
        const voices = window.speechSynthesis.getVoices();
        const wanted = voiceGender === "male"
          ? /male|ravi|daniel|alex|rishi|george|hemant/i
          : /female|kalpana|samantha|veena|zira|karen|lekha|swara/i;
        const byLang = voices.filter((v) => v.lang?.toLowerCase().startsWith(spokenLocale.slice(0, 2)));
        const pool = byLang.length ? byLang : voices;
        u.voice = pool.find((v) => wanted.test(v.name)) ?? pool[0] ?? null;
        u.lang = spokenLocale;
        u.rate = 0.97;
        u.pitch = voiceGender === "male" ? 0.9 : 1.1;
        let done = false;
        const finish = () => { if (!done) { done = true; resolve(); } };
        u.onend = finish;
        u.onerror = finish;
        window.speechSynthesis.speak(u);
        // safety net: some browsers never fire onend
        setTimeout(finish, Math.min(30000, 2500 + text.length * 75));
      }),
    [voiceGender, locale],
  );

  const stopMic = useCallback(() => {
    try { recogRef.current?.stop(); } catch { /* noop */ }
  }, []);

  const startMic = useCallback(() => {
    if (!aliveRef.current || busyRef.current || mutedRef.current || micDenied) return;
    try {
      recogRef.current?.start();
      setPhase("listening");
    } catch { /* already running */ }
  }, [micDenied]);

  const respond = useCallback(
    async (userText: string) => {
      busyRef.current = true;
      stopMic();
      setPhase("thinking");
      historyRef.current = [...historyRef.current, { sender: "user" as const, content: userText }].slice(-14);

      let reply = "";
      try {
        const { data, error } = await supabase.functions.invoke("ai-counselor", {
          body: {
            message: `${userText}\n\n[VOICE_MODE: this is a spoken call. Reply in 2-3 short spoken sentences, no markdown, no emoji, no lists. Use CBT / DBT / grounding micro-steps. ${systemPrompt ?? ""}]`,
            counselorId: voiceGender === "male" ? "yaro" : "ava",
            conversationHistory: historyRef.current,
          },
        });
        if (error) throw error;
        reply = String((data as any)?.response || (data as any)?.message || "");
        const detected = String((data as any)?.language || "");
        if (detected) replyLocaleRef.current = LOCALE[detected] ?? locale;
        const cl = (data as any)?.clinical as Clinical | undefined;
        if (cl) setClinical(cl);
        setNotice((data as any)?.degraded ? "Running on the safe local clinical fallback right now." : null);
      } catch {
        setNotice("Connection hiccup — I'm still here, say that again.");
      }
      if (!reply) reply = "I'm still here with you. Tell me a little more about that.";

      historyRef.current = [...historyRef.current, { sender: "ai" as const, content: reply }].slice(-14);
      setTurns((t) => [...t, { who: "them", text: reply }]);
      setPhase("speaking");
      await speak(reply);
      busyRef.current = false;
      if (aliveRef.current) startMic();
    },
    [speak, systemPrompt, voiceGender, startMic, stopMic, locale],
  );

  /* ── set up recognition once per locale ── */
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }

    aliveRef.current = true;
    let cancelled = false;

    const recog = new SR();
    recog.continuous = false;      // one utterance per turn → no echo, no runaway
    recog.interimResults = true;
    recog.maxAlternatives = 1;
    recog.lang = locale;

    recog.onresult = (e: any) => {
      let final = "";
      let partial = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else partial += r[0].transcript;
      }
      setInterim(partial);
      if (final.trim()) {
        setInterim("");
        setTurns((t) => [...t, { who: "you", text: final.trim() }]);
        respond(final.trim());
      }
    };

    recog.onend = () => {
      if (!aliveRef.current) { setPhase("idle"); return; }
      if (busyRef.current || mutedRef.current) return;
      setTimeout(() => startMic(), 250); // auto re-arm for the next turn
    };

    recog.onerror = (e: any) => {
      const err = e?.error;
      if (err === "not-allowed" || err === "service-not-allowed") {
        setMicDenied(true);
        setPhase("error");
        setNotice("Microphone blocked. Allow mic access in your browser, then reload.");
        return;
      }
      if (err === "no-speech" || err === "aborted") return; // normal, onend re-arms
      setNotice("Speech service blipped — retrying.");
    };

    recogRef.current = recog;

    (async () => {
      const ok = await startMeter();
      if (cancelled || !ok) return;
      busyRef.current = true;
      setPhase("speaking");
      await speak(
        voiceGender === "male"
          ? `Hey, I'm ${counselorName}. I'm listening — take your time, speak in whatever language feels natural.`
          : `Hi, I'm ${counselorName}. I'm right here — take your time, speak in whatever language feels natural.`,
      );
      busyRef.current = false;
      if (!cancelled) startMic();
    })();

    return () => {
      cancelled = true;
      aliveRef.current = false;
      try { recog.abort?.(); recog.stop(); } catch { /* noop */ }
      window.speechSynthesis?.cancel();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    if (next) {
      window.speechSynthesis?.cancel();
      stopMic();
      setPhase("idle");
    } else {
      startMic();
    }
  };

  const end = () => {
    aliveRef.current = false;
    stopMic();
    window.speechSynthesis?.cancel();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onEnd?.();
  };

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  if (!supported) {
    return (
      <div className="w-full max-w-md mx-auto rounded-[1.75rem] bg-card border border-border p-6 sm:p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-primary mx-auto mb-3" />
        <h3 className="font-display text-xl sm:text-2xl mb-2">Voice needs Chrome, Edge or Android</h3>
        <p className="text-foreground/70 text-sm mb-5">
          This browser has no live speech engine. Keep talking by text — same clinical brain, same Yaro.
        </p>
        <Button asChild className="rounded-full"><a href="/chat/yaro">Continue by text</a></Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[min(28rem,100%)] mx-auto rounded-[1.75rem] bg-card border border-border shadow-elegant p-5 sm:p-8 text-center">
      <div className="relative mx-auto w-28 h-28 sm:w-36 sm:h-36 mb-5">
        <motion.span
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{
            scale: phase === "speaking" ? [1, 1.25, 1] : 1 + Math.min(level * 0.6, 0.35),
            opacity: [0.6, 0.25, 0.6],
          }}
          transition={{ duration: phase === "speaking" ? 1.1 : 1.8, repeat: Infinity }}
        />
        <div className="absolute inset-4 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground font-display text-3xl sm:text-4xl">
          {counselorName[0]}
        </div>
      </div>

      <h3 className="font-display text-xl sm:text-2xl text-foreground">{counselorName}</h3>
      <p className="text-sm text-foreground/60 mt-1 flex items-center justify-center gap-2 flex-wrap">
        {phase === "thinking" ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" /> thinking…</>)
          : phase === "speaking" ? (<><Volume2 className="w-3.5 h-3.5" /> speaking…</>)
          : phase === "listening" ? "listening…"
          : muted ? "mic off" : phase === "error" ? "mic blocked" : "connecting…"}
        <span className="tabular-nums text-foreground/40">· {mmss}</span>
      </p>

      {/* live mic bars */}
      <div className="mt-4 flex items-end justify-center gap-1 h-8">
        {Array.from({ length: 16 }).map((_, i) => {
          const active = phase === "listening" || phase === "speaking";
          const h = active
            ? Math.max(4, Math.min(32, (phase === "speaking" ? 0.35 + Math.random() * 0.5 : level * (0.6 + Math.random())) * 40))
            : 4;
          return <span key={i} className="w-1 rounded-full bg-primary/70 transition-all duration-100" style={{ height: h }} />;
        })}
      </div>

      {clinical && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-[10px]">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-foreground/70">
            <Activity className="w-3 h-3" /> live analysis
          </span>
          <span className="px-2 py-1 rounded-full bg-secondary text-foreground/70">PHQ-9 {clinical.phq9.score} · {clinical.phq9.band}</span>
          <span className="px-2 py-1 rounded-full bg-secondary text-foreground/70">GAD-7 {clinical.gad7.score} · {clinical.gad7.band}</span>
          {clinical.pcl5.symptoms.length > 0 && (
            <span className="px-2 py-1 rounded-full bg-secondary text-foreground/70">PCL-5 signals {clinical.pcl5.symptoms.length}</span>
          )}
          {clinical.crisis && (
            <a href="tel:14416" className="px-2 py-1 rounded-full bg-destructive text-destructive-foreground font-semibold">
              SOS · call Tele-MANAS 14416
            </a>
          )}

        </div>
      )}

      <div className="mt-4 min-h-[64px] max-h-32 overflow-y-auto rounded-2xl bg-secondary/60 border border-border p-3 text-sm text-foreground/80 text-left">
        {interim && <p className="italic text-foreground/50">{interim}</p>}
        {[...turns].slice(-2).map((t, i) => (
          <p key={i} className={t.who === "you" ? "text-foreground/60" : "text-foreground"}>
            <b>{t.who === "you" ? "You" : counselorName}:</b> {t.text}
          </p>
        ))}
        {!turns.length && !interim && <p className="text-foreground/50">Just start talking — in any language.</p>}
      </div>

      {notice && <p className="mt-3 text-[11px] text-destructive/80">{notice}</p>}

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button onClick={toggleMute} variant="outline" size="icon" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full">
          {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
        <Button onClick={end} size="icon" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-destructive hover:bg-destructive/90">
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
      <p className="mt-4 text-[11px] text-foreground/45">
        MindCore-3B provides clinical decision-support and CBT/DBT grounding, not direct medical prescriptions ·
        nothing recorded · crisis? Tele-MANAS 14416
      </p>

    </div>
  );
};

export default FreeVoiceSession;
