import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Video, ArrowLeft, MoreVertical, Smile, Paperclip, Mic, Loader2, Check, CheckCheck, Globe, ShieldCheck, AlertTriangle, Lock, FileDown, Clock, Trash2, Play, Pause } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { generateSessionReportPDF } from "@/lib/sessionReport";
import { logVoiceMetric, scoreAdherence } from "@/lib/clinicalMetrics";


type Clinical = {
  phq9: { score: number; band: string; symptoms: string[] };
  gad7: { score: number; band: string; symptoms: string[] };
  pcl5: { symptoms: string[] };
  crisis: boolean;
  dsmHints: string[];
};
type Msg = {
  sender: "user" | "ai";
  content: string;
  ts: number;
  status?: "sent" | "delivered" | "read";
  audioUrl?: string;
  audioSeconds?: number;
  spoken?: boolean; // AI voice-note style reply (spoken aloud)
  replyAudioUrl?: string; // server-synthesised therapist voice note
};

type EngineStatus = "online" | "degraded" | "checking";

const QUICK_EMOJI = ["😊","🙏","😔","😢","😨","😡","❤️","💪","✨","🌧️","☀️","🫂"];

const LANGS = [
  { code: "auto", label: "Auto" },
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "hinglish", label: "Hing" },
  { code: "ta", label: "த" },
  { code: "bn", label: "বাং" },
  { code: "es", label: "ES" },
];

const GREETINGS: Record<string, string> = {
  auto: "Hi, I'm Yaro. Type in any language — Hindi, English, Hinglish, Tamil, whatever feels natural. What's on your mind today? 🌿",
  en: "Hi, I'm Yaro. I'm here to listen — no judgement, no rush. What's on your mind today? 🌿",
  hi: "नमस्ते, मैं यारो हूँ। मैं यहाँ सुनने के लिए हूँ — कोई judgement नहीं। आज मन में क्या है? 🌿",
  hinglish: "Hey, main Yaro hoon. Tension free baat karo — koi judge nahi karega. Aaj kya chal raha hai mann mein? 🌿",
  ta: "வணக்கம், நான் Yaro. நான் கேட்க இங்கே இருக்கிறேன். இன்று மனதில் என்ன? 🌿",
  bn: "নমস্কার, আমি Yaro. আমি শুনতে এখানে আছি। আজ মনে কী চলছে? 🌿",
  es: "Hola, soy Yaro. Estoy aquí para escucharte — sin juicio. ¿Qué tienes en mente hoy? 🌿",
};

interface Props {
  embedded?: boolean; // when true, render compact (no full-screen header)
}

export default function YaroChat({ embedded = false }: Props) {
  const navigate = useNavigate();
  const [lang, setLang] = useState<string>("auto");
  const [messages, setMessages] = useState<Msg[]>([
    { sender: "ai", content: GREETINGS.auto, ts: Date.now(), status: "read" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [clinical, setClinical] = useState<Clinical | null>(null);
  const [showClinical, setShowClinical] = useState(false);
  const [engineStatus, setEngineStatus] = useState<EngineStatus>("checking");
  const [lastError, setLastError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ── 2-minute free window for signed-out visitors ── */
  const { user } = useAuth();
  const TRIAL = 120;
  const KEY = "wm_yaro_trial_started_at";
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const locked = !user && secondsLeft === 0;

  useEffect(() => {
    if (user) { setSecondsLeft(null); return; }
    const saved = localStorage.getItem(KEY);
    if (!saved) return;
    setStartedAt(Number(saved));
    const left = Math.max(0, TRIAL - Math.floor((Date.now() - Number(saved)) / 1000));
    setSecondsLeft(left);
  }, [user]);

  useEffect(() => {
    if (user || secondsLeft === null || secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => (s === null ? s : Math.max(0, s - 1))), 1000);
    return () => clearInterval(t);
  }, [user, secondsLeft]);

  const [buildingReport, setBuildingReport] = useState(false);
  const downloadReport = async () => {
    setBuildingReport(true);
    try {
      await generateSessionReportPDF({
        sessionId: Math.random().toString(36).slice(2, 8).toUpperCase(),
        startedAt: startedAt ?? Date.now() - TRIAL * 1000,
        endedAt: Date.now(),
        messageCount: messages.filter((m) => m.sender === "user").length,
        language: LANGS.find((l) => l.code === lang)?.label ?? "Auto",
        transcript: messages.map(({ sender, content, ts }) => ({ sender, content, ts })),
        clinical,
      });
    } finally {
      setBuildingReport(false);
    }
  };


  // Health check — ping ai-counselor once on mount
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("ai-counselor", {
          body: { message: "ping", counselorId: "yaro", conversationHistory: [] },
        });
        if (error || !data) setEngineStatus("degraded");
        else {
          setEngineStatus((data as any)?.degraded ? "degraded" : "online");
          if ((data as any)?.degraded) setLastError("Primary AI credits/provider unavailable — safe local clinical fallback is active.");
        }
      } catch {
        setEngineStatus("degraded");
      }
    })();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = async (
    text?: string,
    voice?: { url: string; seconds: number; sttMs?: number; sttSource?: "browser" | "server" },
  ) => {
    const content = (text ?? input).trim();
    if (!content || sending || locked) return;
    if (!user && secondsLeft === null) {
      const now = Date.now();
      localStorage.setItem(KEY, String(now));
      setStartedAt(now);
      setSecondsLeft(TRIAL);
    }
    const userMsg: Msg = { sender: "user", content, ts: Date.now(), status: "sent", audioUrl: voice?.url, audioSeconds: voice?.seconds };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setSending(true);
    setShowEmoji(false);


    const langInstruction =
      lang === "auto"
        ? "Mirror the user's language exactly."
        : `Respond primarily in ${LANGS.find((l) => l.code === lang)?.label}.`;
    const voiceInstruction = voice
      ? " [VOICE_NOTE: the user spoke this. Reply as a warm spoken voice note — acknowledge the emotion first, then one gentle CBT-grounded reflection or question. 2-3 short sentences, plain speech, no markdown, no bullet lists, no emoji.]"
      : "";

    const tLlm = performance.now();
    try {
      const { data, error } = await supabase.functions.invoke("ai-counselor", {
        body: {
          message: `${content}\n\n[LANG_HINT: ${langInstruction}]${voiceInstruction}`,
          counselorId: "yaro",
          conversationHistory: next.slice(-12).map((m) => ({ sender: m.sender, content: m.content })),
        },
      });
      if (error) throw new Error(error.message || "Network error");
      const errMsg = (data as any)?.error;
      if (errMsg) throw new Error(String(errMsg));
      const llmMs = Math.round(performance.now() - tLlm);
      const reply = (data as any)?.response || (data as any)?.message || "I'm here. Tell me more.";
      const cl = (data as any)?.clinical as Clinical | undefined;
      if (cl) setClinical(cl);
      const degraded = Boolean((data as any)?.degraded);
      setLastError(degraded ? "Primary AI credits/provider unavailable — safe local clinical fallback is active." : null);
      setEngineStatus(degraded ? "degraded" : "online");
      const aiTs = Date.now();
      setMessages((m) =>
        m.map((x) => (x === userMsg ? { ...x, status: "read" as const } : x)).concat({
          sender: "ai",
          content: String(reply),
          ts: aiTs,
          status: "read",
          spoken: Boolean(voice),
        }),
      );

      if (voice) {
        setSynthesizing(true);
        const tTts = performance.now();
        const url = await synthesizeVoice(String(reply));
        const ttsMs = Math.round(performance.now() - tTts);
        setSynthesizing(false);
        if (url) setMessages((m) => m.map((x) => (x.ts === aiTs ? { ...x, replyAudioUrl: url } : x)));
        speakReply(aiTs, String(reply), url || undefined);

        const { score, flags } = scoreAdherence(String(reply));
        void logVoiceMetric({
          channel: "voice_note",
          language: lang === "auto" ? null : lang,
          stt_source: voice.sttSource ?? "browser",
          stt_ms: voice.sttMs ?? 0,
          stt_chars: content.length,
          llm_ms: llmMs,
          tts_ms: ttsMs,
          tts_source: url ? "server" : "browser",
          total_ms: (voice.sttMs ?? 0) + llmMs + ttsMs,
          reply_words: String(reply).split(/\s+/).filter(Boolean).length,
          adherence_score: score,
          adherence_flags: flags,
          crisis_flag: Boolean(cl?.crisis),
          degraded: degraded || !url,
        });
      }

    } catch (e: any) {
      const msg = e?.message || "Connection failed";
      setLastError(msg);
      setEngineStatus("degraded");
      setSynthesizing(false);
      setMessages((m) => [
        ...m,
        { sender: "ai", content: `${msg}. Try once more — I'm not going anywhere.`, ts: Date.now(), status: "read" },
      ]);
    } finally {
      setSending(false);
    }
  };


  const fmtTime = (t: number) =>
    new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  /* ── Yaro replies back as a spoken voice note ── */
  const [speakingTs, setSpeakingTs] = useState<number | null>(null);
  const aiAudioRef = useRef<HTMLAudioElement | null>(null);
  const ttsLocale = () =>
    lang === "hi" ? "hi-IN" : lang === "ta" ? "ta-IN" : lang === "bn" ? "bn-IN" : lang === "es" ? "es-ES" : "en-IN";

  const stopSpeaking = () => {
    try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
    try { aiAudioRef.current?.pause(); } catch { /* noop */ }
    aiAudioRef.current = null;
    setSpeakingTs(null);
  };

  /** Server-side clinical therapist voice. Returns an object URL, or "" on failure. */
  const synthesizeVoice = async (text: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke("yaro-tts", {
        body: { text, counselorId: "yaro" },
      });
      const b64 = (data as any)?.audioContent;
      if (error || !b64) return "";
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return URL.createObjectURL(new Blob([bytes], { type: "audio/mpeg" }));
    } catch {
      return "";
    }
  };

  const playVoiceUrl = (ts: number, url: string) => {
    stopSpeaking();
    const el = new Audio(url);
    aiAudioRef.current = el;
    el.onended = () => setSpeakingTs((c) => (c === ts ? null : c));
    el.onerror = () => setSpeakingTs((c) => (c === ts ? null : c));
    setSpeakingTs(ts);
    el.play().catch(() => setSpeakingTs((c) => (c === ts ? null : c)));
  };

  /** Browser fallback when the server voice is unavailable. */
  const speakReply = (ts: number, text: string, url?: string) => {
    if (url) return playVoiceUrl(ts, url);
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[*_#`]/g, ""));
      const voices = window.speechSynthesis.getVoices();
      const loc = ttsLocale();
      const pool = voices.filter((v) => v.lang?.toLowerCase().startsWith(loc.slice(0, 2)));
      u.voice = (pool.length ? pool : voices).find((v) => /male|ravi|rishi|daniel|alex|george|hemant/i.test(v.name))
        ?? (pool.length ? pool : voices)[0] ?? null;
      u.lang = loc;
      u.rate = 0.98;
      u.pitch = 0.92;
      u.onend = () => setSpeakingTs((c) => (c === ts ? null : c));
      u.onerror = () => setSpeakingTs((c) => (c === ts ? null : c));
      setSpeakingTs(ts);
      window.speechSynthesis.speak(u);
    } catch {
      setSpeakingTs(null);
    }
  };

  useEffect(() => () => { stopSpeaking(); }, []); // eslint-disable-line react-hooks/exhaustive-deps




  /* ── WhatsApp-style voice notes ── */
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [recLevel, setRecLevel] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recogRef = useRef<any>(null);
  const transcriptRef = useRef("");
  const cancelledRef = useRef(false);
  const rafRef = useRef<number>();
  const startedRecAtRef = useRef(0);

  const teardownRecorder = () => {
    try { recogRef.current?.stop(); } catch { /* noop */ }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current = null;
    recorderRef.current = null;
    setRecording(false);
    setRecLevel(0);
  };

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  /* server-side transcription fallback (works on Safari / any browser) */
  const transcribeOnServer = async (blob: Blob): Promise<string> => {
    try {
      const buf = new Uint8Array(await blob.arrayBuffer());
      let binary = "";
      const CH = 0x8000;
      for (let i = 0; i < buf.length; i += CH) binary += String.fromCharCode(...buf.subarray(i, i + CH));
      const base64 = btoa(binary);
      const { data, error } = await supabase.functions.invoke("speech-to-text", {
        body: {
          audio: base64,
          mimeType: (blob.type || "audio/webm").split(";")[0],
          language: ["hi", "ta", "bn", "es", "en"].includes(lang) ? lang : undefined,
        },
      });
      if (error) return "";
      return String((data as any)?.text ?? "").trim();
    } catch {
      return "";
    }
  };

  const startRecording = async () => {
    if (locked || sending) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      stopSpeaking();
      streamRef.current = stream;
      cancelledRef.current = false;
      transcriptRef.current = "";
      setVoiceNote("");
      setRecSeconds(0);
      startedRecAtRef.current = Date.now();
      chunksRef.current = [];

      const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find(
        (t) => (window as any).MediaRecorder?.isTypeSupported?.(t),
      );
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      recorderRef.current = rec;
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        const seconds = Math.max(1, Math.round((Date.now() - startedRecAtRef.current) / 1000));
        teardownRecorder();
        if (cancelledRef.current) return;
        const url = URL.createObjectURL(blob);
        setTranscribing(true);
        // give the browser speech engine a beat to flush its final result
        await new Promise((r) => setTimeout(r, 400));
        let text = transcriptRef.current.trim();
        if (!text) text = await transcribeOnServer(blob);
        setTranscribing(false);
        setVoiceNote("");
        if (!text) {
          setMessages((m) => [...m, {
            sender: "ai",
            content: "I couldn't catch that voice note — try again a little closer to the mic, or type it out. 🫂",
            ts: Date.now(), status: "read",
          }]);
          return;
        }
        send(text, { url, seconds });
      };
      rec.start();
      setRecording(true);


      // live transcription while recording
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        const recog = new SR();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = lang === "hi" ? "hi-IN" : lang === "ta" ? "ta-IN" : lang === "bn" ? "bn-IN" : lang === "es" ? "es-ES" : "en-IN";
        recog.onresult = (e: any) => {
          let partial = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const r = e.results[i];
            if (r.isFinal) transcriptRef.current += `${r[0].transcript} `;
            else partial += r[0].transcript;
          }
          setVoiceNote((transcriptRef.current + partial).trim());
        };
        recog.onerror = () => { /* keep recording; audio still sends */ };
        recogRef.current = recog;
        try { recog.start(); } catch { /* noop */ }
      }

      // level meter
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let peak = 0;
        for (let i = 0; i < buf.length; i++) peak = Math.max(peak, Math.abs(buf[i] - 128) / 128);
        setRecLevel(peak);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      setMessages((m) => [...m, {
        sender: "ai",
        content: "I need microphone permission for voice notes. Allow the mic and tap the mic button again.",
        ts: Date.now(), status: "read",
      }]);
    }
  };

  const stopAndSend = () => { cancelledRef.current = false; try { recorderRef.current?.stop(); } catch { teardownRecorder(); } };
  const cancelRecording = () => { cancelledRef.current = true; try { recorderRef.current?.stop(); } catch { teardownRecorder(); } setVoiceNote(""); };
  useEffect(() => () => teardownRecorder(), []); // eslint-disable-line react-hooks/exhaustive-deps


  // WhatsApp-ish chat background
  const bg = "bg-[#0b141a]";
  const wallpaper = {
    backgroundImage:
      "radial-gradient(circle at 25% 35%, rgba(56,142,142,0.08) 0, transparent 40%), radial-gradient(circle at 75% 75%, rgba(0,168,132,0.06) 0, transparent 40%)",
  } as const;

  return (
    <div className={`${embedded ? "rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto h-[640px]" : "max-w-2xl w-full mx-auto h-[calc(100vh-8rem)] max-h-[820px] rounded-3xl overflow-hidden shadow-2xl border border-white/10"} flex flex-col ${bg}`}>
      {/* Health banner */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 text-[11px] border-b ${
          engineStatus === "online"
            ? "bg-emerald-950/60 border-emerald-500/20 text-emerald-300"
            : engineStatus === "degraded"
            ? "bg-rose-950/60 border-rose-500/30 text-rose-300"
            : "bg-slate-900 border-white/10 text-white/60"
        }`}
      >
        {engineStatus === "degraded" ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
        <span className="truncate">
          {engineStatus === "online" && `Clinical engine online · DSM-5 · PHQ-9 · GAD-7 · PCL-5 · Crisis kill-switch active`}
          {engineStatus === "checking" && "Connecting to clinical engine…"}
          {engineStatus === "degraded" && (lastError || "Engine degraded — retrying on next message")}
        </span>
      </div>
      {/* Top contact bar — WhatsApp style */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-[#202c33] text-white">
        {!embedded && (
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center font-display text-lg shadow-md">Y</div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#202c33]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium leading-tight truncate">Yaro · WellMindAI</div>
          <div className="text-[11px] text-emerald-400 leading-tight truncate">{engineStatus === "online" ? "online" : "protected"} · clinical mode</div>
        </div>
        <button
          onClick={() => navigate("/consultation/video")}
          className="p-2.5 hover:bg-white/10 rounded-full"
          aria-label="Video call"
        >
          <Video className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate("/consultation/audio")}
          className="p-2.5 hover:bg-white/10 rounded-full"
          aria-label="Voice call"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowClinical((s) => !s)}
          className={`p-2.5 rounded-full ${showClinical ? "bg-emerald-500/20 text-emerald-300" : "hover:bg-white/10"}`}
          aria-label="Clinical insight"
          title="Real-time DSM-5 / PHQ-9 / GAD-7 signal"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {showClinical && clinical && (
        <div className="px-3 py-2 bg-[#0f1c22] border-b border-emerald-500/20 text-[11px] text-white/80 space-y-1">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span>PHQ-9 <b className="text-emerald-300">{clinical.phq9.score}</b> · {clinical.phq9.band}</span>
            <span>GAD-7 <b className="text-emerald-300">{clinical.gad7.score}</b> · {clinical.gad7.band}</span>
            {clinical.pcl5.symptoms.length > 0 && <span>PCL-5 signals: {clinical.pcl5.symptoms.length}</span>}
            {clinical.crisis && <span className="text-rose-400 font-semibold">C-SSRS: crisis flag</span>}
          </div>
          {clinical.dsmHints.length > 0 && (
            <div className="text-white/60">DSM/ICD hypotheses: {clinical.dsmHints.join(" · ")}</div>
          )}
          <div className="text-white/40">Silent pattern engine — not a diagnosis.</div>
        </div>
      )}

      {/* Language strip */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111b21] border-b border-white/5 overflow-x-auto">
        <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => {
              setLang(l.code);
              setMessages((m) => [...m, { sender: "ai", content: GREETINGS[l.code] ?? GREETINGS.auto, ts: Date.now(), status: "read" }]);
            }}
            className={`text-[11px] px-2.5 h-6 rounded-full whitespace-nowrap transition ${
              lang === l.code ? "bg-emerald-500 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={wallpaper}
        className={`flex-1 overflow-y-auto px-3 py-4 space-y-1.5 ${embedded ? "h-[420px]" : ""}`}
      >
        <div className="text-center my-2">
          <span className="text-[10px] uppercase tracking-widest bg-[#182229] text-white/60 px-3 py-1 rounded-md">
            End-to-end private · Today
          </span>
        </div>
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.18 }}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[78%] px-3 py-2 text-[14.5px] leading-snug shadow-sm whitespace-pre-wrap break-words ${
                  m.sender === "user"
                    ? "bg-[#005c4b] text-white rounded-2xl rounded-tr-sm"
                    : "bg-[#202c33] text-white rounded-2xl rounded-tl-sm"
                }`}
              >
                {m.audioUrl && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <audio src={m.audioUrl} controls className="h-8 max-w-[190px]" />
                    <span className="text-[10px] text-white/60 tabular-nums">
                      {Math.floor((m.audioSeconds ?? 0) / 60)}:{String((m.audioSeconds ?? 0) % 60).padStart(2, "0")}
                    </span>
                  </div>
                )}
                {m.sender === "ai" && m.spoken && (
                  <button
                    onClick={() => (speakingTs === m.ts ? stopSpeaking() : speakReply(m.ts, m.content))}
                    className="flex items-center gap-2 mb-1.5 w-full text-left"
                    aria-label={speakingTs === m.ts ? "Stop voice reply" : "Play voice reply"}
                  >
                    <span className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      {speakingTs === m.ts ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </span>
                    <span className="flex items-end gap-[2px] h-5 flex-1">
                      {Array.from({ length: 22 }).map((_, k) => (
                        <span
                          key={k}
                          className={`flex-1 rounded-full ${speakingTs === m.ts ? "bg-emerald-300" : "bg-white/30"}`}
                          style={{ height: 4 + ((k * 7) % 16) }}
                        />
                      ))}
                    </span>
                    <span className="text-[10px] text-white/50">voice</span>
                  </button>
                )}
                {m.audioUrl ? <span className="text-white/85 italic">{m.content}</span> : m.content}

                <div className="flex items-center justify-end gap-1 mt-1 -mb-0.5">
                  <span className="text-[10px] text-white/55">{fmtTime(m.ts)}</span>
                  {m.sender === "user" && (
                    m.status === "read"
                      ? <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                      : <Check className="w-3.5 h-3.5 text-white/55" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {sending && (
          <div className="flex justify-start">
            <div className="bg-[#202c33] text-white/70 px-3 py-2 rounded-2xl rounded-tl-sm text-sm flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Yaro is typing…
            </div>
          </div>
        )}
      </div>

      {/* Emoji strip */}
      {showEmoji && (
        <div className="px-3 py-2 bg-[#1f2c33] border-t border-white/5 flex gap-2 overflow-x-auto">
          {QUICK_EMOJI.map((e) => (
            <button
              key={e}
              onClick={() => setInput((v) => v + e)}
              className="text-2xl hover:scale-125 transition-transform"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Free-window countdown for signed-out visitors */}
      {!user && secondsLeft !== null && secondsLeft > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#101d24] border-t border-white/5 text-[11px] text-emerald-300">
          <Clock className="w-3.5 h-3.5" />
          <span className="tabular-nums">
            {String(Math.floor(secondsLeft / 60))}:{String(secondsLeft % 60).padStart(2, "0")}
          </span>
          <span className="text-white/50">free · then I'll save this and hand you a report</span>
        </div>
      )}

      {locked ? (
        <div className="px-5 py-6 bg-[#111b21] border-t border-emerald-500/20 text-center space-y-4">
          <div className="mx-auto w-11 h-11 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <Lock className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <p className="text-white font-medium">Your 2 free minutes are up.</p>
            <p className="text-white/60 text-sm mt-1">
              I've saved everything you said. Log in and we pick up exactly here — nothing lost.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link to="/auth?next=/chat/yaro">
              <button className="h-11 px-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium w-full sm:w-auto">
                Log in & continue free
              </button>
            </Link>
            <button
              onClick={downloadReport}
              disabled={buildingReport}
              className="h-11 px-5 rounded-full border border-white/15 text-white/85 hover:bg-white/5 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {buildingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              Download my report (PDF)
            </button>
          </div>
          <p className="text-[10px] text-white/40">
            Report uses PHQ-9 · GAD-7 · PCL-5 public-domain scoring. Screening only, not a diagnosis.
          </p>
        </div>
      ) : (
      /* Composer */
      recording ? (
        <div className="flex items-center gap-2 sm:gap-3 px-3 py-3 bg-[#202c33]">
          <button onClick={cancelRecording} className="p-2 text-red-400 hover:text-red-300 shrink-0" aria-label="Cancel voice note">
            <Trash2 className="w-5 h-5" />
          </button>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-white text-sm tabular-nums shrink-0">
            {Math.floor(recSeconds / 60)}:{String(recSeconds % 60).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-end gap-[3px] h-6">
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-full bg-emerald-400/80 transition-all duration-100"
                  style={{ height: Math.max(3, Math.min(24, recLevel * (0.5 + Math.random()) * 46)) }}
                />
              ))}
            </div>
            {voiceNote && <p className="text-[11px] text-white/50 truncate mt-1">{voiceNote}</p>}
          </div>
          <button
            onClick={stopAndSend}
            className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white shrink-0"
            aria-label="Send voice note"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      ) : (
      <div className="flex items-end gap-1 sm:gap-2 px-2 py-2 bg-[#202c33]">
        <button
          onClick={() => setShowEmoji((s) => !s)}
          className="p-2.5 text-white/70 hover:text-white"
          aria-label="Emoji"
        >
          <Smile className="w-6 h-6" />
        </button>
        <button
          onClick={() => navigate("/consultation/audio")}
          className="p-2.5 text-white/70 hover:text-white hidden sm:block"
          aria-label="Voice call"
        >
          <Phone className="w-5 h-5" />
        </button>
        <div className="flex-1 bg-[#2a3942] rounded-3xl px-4 py-2 min-w-0">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder={transcribing ? "Transcribing your voice note…" : "Message — any language…"}
            className="w-full bg-transparent resize-none text-white placeholder:text-white/40 text-[15px] outline-none max-h-32"
          />
        </div>
        {input.trim() ? (
          <button
            onClick={() => send()}
            disabled={sending}
            className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white shrink-0 disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={startRecording}
            disabled={transcribing}
            className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white shrink-0 disabled:opacity-60"
            aria-label="Record voice note"
          >
            {transcribing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
          </button>
        )}
      </div>
      )
      )}


      <div className="text-[10px] text-white/40 text-center py-1.5 bg-[#0b141a]">
        Trained on DSM-5 · ICD-11 · PHQ-9 · GAD-7 · PCL-5 · Crisis? Call iCall 9152987821
      </div>
    </div>
  );
}
