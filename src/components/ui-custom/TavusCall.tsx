import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, PhoneOff, ShieldCheck, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface TavusCallProps {
  /** "yaro" (male character) or "ava" (female character) */
  counselorId: "yaro" | "ava";
  counselorName: string;
  onEnd: () => void;
}

/**
 * Simple one-step video call.
 * Mount -> session is created -> live video. No mode pickers, no name form:
 * the signed-in profile name is passed to the counselor automatically.
 */
const TavusCall = ({ counselorId, counselorName, onEnd }: TavusCallProps) => {
  const { user } = useAuth();
  const [url, setUrl] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const startedRef = useRef(false);

  const displayName =
    (user?.user_metadata?.display_name as string | undefined)?.trim() ||
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "";
  const firstName = displayName.split(" ")[0] || "";

  const start = useCallback(async () => {
    setError(null);
    try {
      const { data: persona, error: pErr } = await supabase.functions.invoke("tavus-conversation", {
        body: { action: "create_persona", doctorType: counselorId, userName: firstName },
      });
      if (pErr) throw pErr;
      if (persona?.error) throw new Error(persona.error);

      if (persona?.conversation_url) {
        setUrl(persona.conversation_url);
        setConversationId(persona.conversation_id ?? null);
        return;
      }

      const { data: conv, error: cErr } = await supabase.functions.invoke("tavus-conversation", {
        body: {
          action: "create_conversation",
          doctorType: counselorId,
          personaId: persona?.persona_id,
          userName: firstName,
        },
      });
      if (cErr) throw cErr;
      if (conv?.error) throw new Error(conv.error);
      if (!conv?.conversation_url) throw new Error("No session URL returned");
      setUrl(conv.conversation_url);
      setConversationId(conv.conversation_id ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the session");
    }
  }, [counselorId, firstName]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    start();
  }, [start]);

  useEffect(() => {
    if (!url) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [url]);

  const end = useCallback(async () => {
    if (conversationId) {
      try {
        await supabase.functions.invoke("tavus-conversation", {
          body: { action: "end_conversation", conversationId },
        });
      } catch {
        /* best effort */
      }
    }
    onEnd();
  }, [conversationId, onEnd]);

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="overflow-hidden rounded-[2rem] border border-foreground/10 bg-[#14100E] shadow-2xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3 text-[#F5EFE6] sm:px-6">
          <div className="min-w-0">
            <p className="truncate font-display text-lg">{counselorName}</p>
            <p className="truncate text-xs text-[#F5EFE6]/60">
              {firstName ? `Session for ${firstName}` : "Private session"} · encrypted
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#F5EFE6]/70">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {mmss}
            </span>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" /> private
            </span>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full bg-black sm:aspect-video">
          {url ? (
            <iframe
              title={`Video session with ${counselorName}`}
              src={url}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-[#F5EFE6]">
              {error ? (
                <>
                  <AlertCircle className="h-7 w-7 text-rose-300" />
                  <p className="max-w-sm text-sm text-[#F5EFE6]/80">{error}</p>
                  <Button
                    onClick={() => {
                      setError(null);
                      start();
                    }}
                    className="mt-1 rounded-full bg-[#F5EFE6] text-[#2A2522] hover:bg-[#F5EFE6]/90"
                  >
                    Try again
                  </Button>
                </>
              ) : (
                <>
                  <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
                    <Loader2 className="h-8 w-8 animate-spin text-[#F5EFE6]/80" />
                  </motion.div>
                  <p className="text-sm text-[#F5EFE6]/75">
                    {counselorName} is joining{firstName ? `, ${firstName}` : ""}…
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center px-4 py-4">
          <Button onClick={end} className="h-12 rounded-full bg-rose-500 px-7 text-white hover:bg-rose-600">
            <PhoneOff className="mr-2 h-4 w-4" /> End session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TavusCall;
