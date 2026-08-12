import { useEffect, useMemo, useState } from "react";
import { Activity, Gauge, Mic, Waves, ShieldAlert, Trash2, RefreshCw } from "lucide-react";
import LandingNav from "@/components/layout/LandingNav";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import {
  readLocalMetrics,
  clearLocalMetrics,
  percentile,
  mean,
  type VoiceMetric,
} from "@/lib/clinicalMetrics";

const Stat = ({
  icon: Icon,
  label,
  value,
  sub,
  tone = "sage",
}: {
  icon: any;
  label: string;
  value: string;
  sub?: string;
  tone?: "sage" | "sky" | "amber" | "rose";
}) => {
  const tones: Record<string, string> = {
    sage: "bg-primary/10 text-primary",
    sky: "bg-secondary/20 text-secondary-foreground",
    amber: "bg-amber-500/10 text-amber-600",
    rose: "bg-rose-500/10 text-rose-600",
  };
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${tones[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-3xl font-display mt-1">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
};

const Bar = ({ label, value, max }: { label: string; value: number; max: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${max ? Math.min(100, (value / max) * 100) : 0}%` }}
      />
    </div>
  </div>
);

export default function ClinicalValidation() {
  const { user, loading } = useAuth();
  const [rows, setRows] = useState<VoiceMetric[]>([]);
  const [source, setSource] = useState<"local" | "server">("local");

  useSEO({
    title: "Clinical Validation Dashboard | WellMindAI",
    description:
      "Live quality telemetry for the voice therapy pipeline: transcription accuracy, latency budgets and CBT / PHQ-9 response adherence.",
    path: "/clinical-validation",
  });

  const load = async () => {
    const local = readLocalMetrics();
    setRows(local);
    setSource("local");
    try {
      const { data, error } = await (supabase as any)
        .from("clinical_validation_metrics")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (!error && Array.isArray(data) && data.length) {
        setRows(
          data.map((d: any) => ({
            ...d,
            adherence_flags: Array.isArray(d.adherence_flags) ? d.adherence_flags : [],
          })),
        );
        setSource("server");
      }
    } catch { /* table not provisioned yet — local buffer stands */ }
  };

  useEffect(() => {
    load();
    const onMetric = () => setRows(readLocalMetrics());
    window.addEventListener("wm:metric", onMetric as EventListener);
    return () => window.removeEventListener("wm:metric", onMetric as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const s = useMemo(() => {
    const total = rows.length;
    const withText = rows.filter((r) => r.stt_chars > 0);
    const captureRate = total ? (withText.length / total) * 100 : 0;
    const browserStt = rows.filter((r) => r.stt_source === "browser").length;
    const serverFallback = rows.filter((r) => r.stt_source === "server").length;
    const adherence = mean(rows.map((r) => r.adherence_score)) * 100;
    const flagCounts: Record<string, number> = {};
    rows.forEach((r) => (r.adherence_flags ?? []).forEach((f) => (flagCounts[f] = (flagCounts[f] ?? 0) + 1)));
    return {
      total,
      captureRate,
      browserStt,
      serverFallback,
      adherence,
      crisis: rows.filter((r) => r.crisis_flag).length,
      degraded: rows.filter((r) => r.degraded).length,
      sttP50: percentile(rows.map((r) => r.stt_ms), 50),
      sttP95: percentile(rows.map((r) => r.stt_ms), 95),
      llmP50: percentile(rows.map((r) => r.llm_ms), 50),
      llmP95: percentile(rows.map((r) => r.llm_ms), 95),
      ttsP50: percentile(rows.map((r) => r.tts_ms), 50),
      totalP50: percentile(rows.map((r) => r.total_ms), 50),
      totalP95: percentile(rows.map((r) => r.total_ms), 95),
      words: Math.round(mean(rows.map((r) => r.reply_words))),
      flags: Object.entries(flagCounts).sort((a, b) => b[1] - a[1]).slice(0, 6),
    };
  }, [rows]);

  return (
    <div className="min-h-screen bg-background">
      {!loading && user ? <Header /> : <LandingNav />}

      <main className="pt-28 pb-20 px-4 max-w-6xl mx-auto">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Quality assurance</p>
          <h1 className="text-3xl sm:text-4xl font-display">Clinical validation dashboard</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Live telemetry for the voice therapy pipeline — how accurately we hear people, how fast we answer,
            and how closely each spoken reply follows CBT / PHQ-9 / DSM-5 framing rules.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={load}
              className="h-9 px-4 rounded-full border border-border text-sm inline-flex items-center gap-2 hover:bg-muted"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button
              onClick={() => { clearLocalMetrics(); setRows([]); }}
              className="h-9 px-4 rounded-full border border-border text-sm inline-flex items-center gap-2 hover:bg-muted"
            >
              <Trash2 className="w-4 h-4" /> Clear local buffer
            </button>
            <span className="text-xs text-muted-foreground ml-1">
              source: {source === "server" ? "database" : "this device"}
            </span>
          </div>
        </header>

        {rows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No voice turns recorded yet. Send a voice note in the Yaro chat and the metrics land here instantly.
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Stat
                icon={Mic}
                label="Transcription capture"
                value={`${s.captureRate.toFixed(1)}%`}
                sub={`${s.browserStt} on-device · ${s.serverFallback} server fallback`}
              />
              <Stat
                icon={Gauge}
                label="End-to-end latency p50"
                value={`${(s.totalP50 / 1000).toFixed(1)}s`}
                sub={`p95 ${(s.totalP95 / 1000).toFixed(1)}s`}
                tone="sky"
              />
              <Stat
                icon={Activity}
                label="Response adherence"
                value={`${s.adherence.toFixed(0)}%`}
                sub={`avg ${s.words} words per voice reply`}
                tone={s.adherence >= 75 ? "sage" : "amber"}
              />
              <Stat
                icon={ShieldAlert}
                label="Safety flags"
                value={String(s.crisis)}
                sub={`${s.degraded} degraded turns of ${s.total}`}
                tone={s.crisis ? "rose" : "sage"}
              />
            </div>

            <section className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
                <h2 className="font-display text-lg flex items-center gap-2">
                  <Waves className="w-4 h-4 text-primary" /> Latency budget (ms)
                </h2>
                <Bar label="Speech-to-text p50" value={s.sttP50} max={s.totalP95 || 1} />
                <Bar label="Speech-to-text p95" value={s.sttP95} max={s.totalP95 || 1} />
                <Bar label="Therapist reasoning p50" value={s.llmP50} max={s.totalP95 || 1} />
                <Bar label="Therapist reasoning p95" value={s.llmP95} max={s.totalP95 || 1} />
                <Bar label="Voice synthesis p50" value={s.ttsP50} max={s.totalP95 || 1} />
                <p className="text-xs text-muted-foreground">
                  Target: full turn under 6s so the conversation still feels human.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6">
                <h2 className="font-display text-lg mb-4">Adherence deviations</h2>
                {s.flags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No deviations recorded — every reply acknowledged emotion, stayed brief and offered a
                    reflective step.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {s.flags.map(([flag, count]) => (
                      <li key={flag} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{flag.replace(/_/g, " ")}</span>
                        <span className="tabular-nums text-muted-foreground">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  Scored against the voice-note contract: acknowledge emotion first, 2–3 sentences, one
                  reflective question, a CBT-grounded step, never diagnose.
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card mt-6 overflow-hidden">
              <h2 className="font-display text-lg p-6 pb-3">Recent voice turns</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground border-y border-border">
                    <tr>
                      <th className="px-6 py-3">Time</th>
                      <th className="px-3 py-3">Lang</th>
                      <th className="px-3 py-3">STT</th>
                      <th className="px-3 py-3">Chars</th>
                      <th className="px-3 py-3">Reason</th>
                      <th className="px-3 py-3">Voice</th>
                      <th className="px-3 py-3">Total</th>
                      <th className="px-6 py-3">Adherence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 25).map((r) => (
                      <tr key={r.id} className="border-b border-border/60 last:border-0">
                        <td className="px-6 py-3 whitespace-nowrap text-muted-foreground">
                          {new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-3 py-3">{r.language ?? "auto"}</td>
                        <td className="px-3 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{r.stt_source}</span>{" "}
                          <span className="tabular-nums text-muted-foreground">{r.stt_ms}ms</span>
                        </td>
                        <td className="px-3 py-3 tabular-nums">{r.stt_chars}</td>
                        <td className="px-3 py-3 tabular-nums">{r.llm_ms}ms</td>
                        <td className="px-3 py-3 tabular-nums">{r.tts_ms}ms</td>
                        <td className="px-3 py-3 tabular-nums">{(r.total_ms / 1000).toFixed(1)}s</td>
                        <td className="px-6 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              r.adherence_score >= 0.75
                                ? "bg-primary/10 text-primary"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {Math.round(r.adherence_score * 100)}%
                          </span>
                          {r.crisis_flag && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600">
                              crisis
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
