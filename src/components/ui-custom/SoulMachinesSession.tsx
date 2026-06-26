import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Props {
  counselorId: "yaro" | "ava";
  counselorName: string;
}

/** Embeds a Soul Machines Workforce digital human via the share URL. */
const SoulMachinesSession = ({ counselorId, counselorName }: Props) => {
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.functions.invoke("soulmachines-config", {
        body: { counselor: counselorId },
      });
      if (cancelled) return;
      if (error || data?.error) {
        setErr(data?.error ?? error?.message ?? "Could not load digital human.");
        return;
      }
      setUrl(data?.url ?? null);
    })();
    return () => { cancelled = true; };
  }, [counselorId]);

  if (err) {
    return (
      <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-foreground/30 flex items-center justify-center p-6 text-center">
        <div>
          <p className="font-display text-lg mb-2">Digital human unavailable</p>
          <p className="font-hand text-foreground/70">{err}</p>
        </div>
      </div>
    );
  }
  if (!url) {
    return (
      <div className="aspect-video w-full rounded-2xl bg-foreground/95 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-background" />
      </div>
    );
  }
  return (
    <iframe
      src={url}
      title={`${counselorName} — Soul Machines session`}
      allow="camera; microphone; autoplay; fullscreen; display-capture"
      className="w-full aspect-video rounded-2xl border-0"
    />
  );
};

export default SoulMachinesSession;
