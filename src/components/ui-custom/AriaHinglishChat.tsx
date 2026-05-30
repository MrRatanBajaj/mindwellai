import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { AriaPersona } from "@/lib/ariaPersonas";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  persona: AriaPersona;
}

const AriaHinglishChat = ({ persona }: Props) => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: persona.firstMessage },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset greeting when persona changes
  useEffect(() => {
    setMessages([{ role: "assistant", content: persona.firstMessage }]);
  }, [persona.id, persona.firstMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("naina-chat", {
        body: { messages: next, personaPrompt: persona.prompt },
      });
      if (error) throw error;
      const reply = (data as { reply?: string })?.reply || "Main yahan hoon, thoda aur batao...";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error(e);
      toast.error("Connection issue. Phir try karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card/90 backdrop-blur-md shadow-elegant overflow-hidden flex flex-col h-[560px]">
      <div className="px-5 py-4 border-b border-border bg-secondary/40 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Heart className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg leading-tight text-foreground">Dr. Aria</p>
          <p className="text-xs text-muted-foreground truncate">
            {persona.emoji} {persona.label} · Hinglish chat
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                    : "text-foreground"
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm pl-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Aria soch rahi hai...
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
        className="px-3 py-3 border-t border-border bg-card flex items-center gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hindi ya English mein likho..."
          disabled={loading}
          className="flex-1"
          autoFocus
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default AriaHinglishChat;
