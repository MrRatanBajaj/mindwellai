import { Link } from "react-router-dom";
import { Check, X, Sparkles, Shield } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const COMPETITORS = [
  { name: "Wysa", price: "$99/mo (₹8,200)", langs: "English only", clinical: "CBT bot", crisis: "Escalation to text" },
  { name: "Woebot", price: "$39/mo (₹3,250)", langs: "English only", clinical: "CBT scripts", crisis: "Basic redirect" },
  { name: "Lyra Health", price: "Employer-only", langs: "English", clinical: "Human therapists", crisis: "Enterprise flow" },
  { name: "Talkspace", price: "$276/mo (₹23,000)", langs: "English", clinical: "Licensed therapists", crisis: "Emergency line" },
  { name: "BetterHelp", price: "$260/mo (₹21,600)", langs: "English + a few", clinical: "Licensed therapists", crisis: "Emergency redirect" },
  { name: "Ginger", price: "Employer-only", langs: "English", clinical: "Coaches + therapists", crisis: "24/7 coach" },
  { name: "Amaha (InnerHour)", price: "₹2,400/mo", langs: "English, Hindi (limited)", clinical: "Human + self-help", crisis: "Human callback" },
  { name: "Mfine (mental)", price: "₹1,500/session", langs: "English, Hindi", clinical: "Psychiatrists", clinicalCrisis: "Rx" },
];

const YOU = {
  name: "WellMindAI (Yaro & Ava)",
  price: "Free chat · ₹99 video · ₹499/mo unlimited",
  langs: "Hindi, English, Hinglish, Tamil, Bengali, Marathi, Spanish + more",
  clinical: "DSM-5, ICD-11, PHQ-9, GAD-7, PCL-5 silent pattern engine",
  crisis: "Real-time C-SSRS kill-switch + iCall/Vandrevala/KIRAN handoff",
};

const Compare = () => {
  useSEO({
    title: "WellMindAI vs Wysa, Woebot, Lyra, Talkspace, BetterHelp — Best AI therapy 2026",
    description:
      "Honest side-by-side: WellMindAI vs Wysa, Woebot, Lyra Health, Talkspace, BetterHelp, Ginger, Amaha and Mfine. Multilingual (Hindi/English/Hinglish), DSM-5/PHQ-9/GAD-7 trained, free chat, ₹99 video therapy.",
    path: "/compare",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-28 pb-16 px-6 max-w-6xl mx-auto">
        <section className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" /> 2026 comparison · updated monthly
          </div>
          <h1 className="font-display text-4xl md:text-5xl mb-4">
            The honest WellMindAI comparison: Wysa, Woebot, Lyra, Talkspace, BetterHelp &amp; more
          </h1>
          <p className="text-foreground/70 text-lg">
            Every major AI &amp; human therapy app — priced, translated, and clinically scored side-by-side. No cherry-picking.
          </p>
        </section>

        {/* Winner card */}
        <section className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 md:p-8 mb-10">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-2xl">Why WellMindAI wins for Indian users in 2026</h2>
              <p className="text-foreground/70 mt-1">
                Only platform that combines free multilingual chat, ₹99 video sessions, and a live DSM-5/PHQ-9/GAD-7/PCL-5 pattern engine.
                No cultural translation needed — Yaro replies in your language, in your idiom.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-3 mt-5">
            {[
              ["Free chat therapy", "No signup, no card"],
              ["9+ Indian languages", "Auto-detect Hinglish"],
              ["₹99 video / ₹499 unlimited", "vs ₹8,000+ competitors"],
              ["Crisis kill-switch", "C-SSRS + iCall handoff"],
            ].map(([t, s]) => (
              <div key={t} className="rounded-2xl bg-card border border-foreground/10 p-4">
                <div className="font-display text-base">{t}</div>
                <div className="text-xs text-muted-foreground mt-1">{s}</div>
              </div>
            ))}
          </div>
          <Button asChild className="mt-6 h-12 px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link to="/chat/yaro">Try Yaro free — no signup →</Link>
          </Button>
        </section>

        {/* Comparison table */}
        <section className="overflow-x-auto rounded-3xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-4 py-3 font-display">Platform</th>
                <th className="text-left px-4 py-3 font-display">Price</th>
                <th className="text-left px-4 py-3 font-display">Languages</th>
                <th className="text-left px-4 py-3 font-display">Clinical approach</th>
                <th className="text-left px-4 py-3 font-display">Crisis handling</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-emerald-500/5 border-t border-emerald-500/20">
                <td className="px-4 py-3 font-semibold flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> {YOU.name}</td>
                <td className="px-4 py-3">{YOU.price}</td>
                <td className="px-4 py-3">{YOU.langs}</td>
                <td className="px-4 py-3">{YOU.clinical}</td>
                <td className="px-4 py-3">{YOU.crisis}</td>
              </tr>
              {COMPETITORS.map((c) => (
                <tr key={c.name} className="border-t border-border/60">
                  <td className="px-4 py-3 flex items-center gap-2"><X className="w-4 h-4 text-muted-foreground" /> {c.name}</td>
                  <td className="px-4 py-3">{c.price}</td>
                  <td className="px-4 py-3">{c.langs}</td>
                  <td className="px-4 py-3">{c.clinical}</td>
                  <td className="px-4 py-3">{(c as { crisis?: string; clinicalCrisis?: string }).crisis ?? (c as { clinicalCrisis?: string }).clinicalCrisis ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* SEO long-tail content */}
        <section className="prose prose-neutral max-w-none mt-12 space-y-6 text-foreground/80">
          <h2 className="font-display text-3xl">WellMindAI vs Wysa alternative — which is better in India?</h2>
          <p>
            <strong>Wysa</strong> pioneered the CBT chatbot format, but its English-only interface leaves the majority of Indian users translating their pain
            before they can share it. WellMindAI's Yaro replies natively in Hindi, Hinglish and eight other languages — the difference between clinical
            distance and being actually understood at 3 AM.
          </p>

          <h2 className="font-display text-3xl">WellMindAI vs Woebot — CBT depth vs multilingual empathy</h2>
          <p>
            <strong>Woebot</strong> runs scripted CBT modules; useful, but rigid. WellMindAI layers CBT + DBT + MI + ACT on top of a real-time
            DSM-5 pattern engine (PHQ-9 / GAD-7 / PCL-5), and hands off to a licensed human the moment the C-SSRS kill-switch flips.
          </p>

          <h2 className="font-display text-3xl">WellMindAI vs Lyra Health, Ginger and enterprise EAPs</h2>
          <p>
            <strong>Lyra Health</strong> and <strong>Ginger</strong> require an employer contract. WellMindAI's B2B tier (from ₹49/seat/year for colleges)
            offers the same rigor at 1/40th the cost, plus a direct-to-consumer path so employees keep support even after leaving the company.
          </p>

          <h2 className="font-display text-3xl">WellMindAI vs Talkspace and BetterHelp — human therapy price gap</h2>
          <p>
            <strong>Talkspace</strong> and <strong>BetterHelp</strong> deliver licensed human therapy but at $260–$276/mo — out of reach for most Indian users.
            WellMindAI pairs a 24/7 AI companion with ₹99 on-demand video sessions from vetted Indian counselors.
          </p>

          <h2 className="font-display text-3xl">WellMindAI vs Amaha (InnerHour) and Mfine</h2>
          <p>
            Indian competitors like <strong>Amaha</strong> and <strong>Mfine</strong> focus on psychiatry appointments; useful when you need medication,
            but not for the daily emotional weight. WellMindAI's Yaro is grief-counsellor first, gently escalating to human clinicians only when the pattern engine flags it.
          </p>

          <h2 className="font-display text-3xl">FAQ — WellMindAI vs the competition</h2>
          <p><strong>Is WellMindAI really free?</strong> Yes — Yaro chat is free forever. Video sessions start at ₹99. No hidden trial timers.</p>
          <p><strong>Does it replace a human therapist?</strong> No AI does. Yaro is your daily companion; we hand off to human counselors for diagnosis, medication and long-term care.</p>
          <p><strong>Is my data safe?</strong> HIPAA-informed, RLS-scoped, zero conversation retention on our central servers.</p>
        </section>

        <div className="text-center mt-14">
          <Button asChild className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-base">
            <Link to="/chat/yaro">Talk to Yaro free →</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Compare;
