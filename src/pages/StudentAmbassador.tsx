import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap, Award, BookOpen, Heart, Users, CheckCircle2, Sparkles, Crown,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PERKS = [
  { icon: Crown, t: "Free Premium for 1 year", d: "Unlimited Virtual Human, voice, and chat therapy — on us." },
  { icon: Award, t: "Certificate of Impact", d: "Verified, LinkedIn-ready. Counts towards CV + scholarships." },
  { icon: Heart, t: "Wellness leadership badge", d: "Featured on our Wall and college page. Become the voice on campus." },
  { icon: BookOpen, t: "Workshops & training", d: "Monthly sessions with India's top counselors & psychologists." },
  { icon: Users, t: "Build your own peer circle", d: "Tools to run wellness events, journaling clubs, and crisis-aware groups." },
  { icon: Sparkles, t: "Cash bonuses", d: "₹500 for every classmate you onboard. ₹5,000 milestone payouts." },
];

const RESPONSIBILITIES = [
  "Spread mental health awareness on your campus — 1 post/week.",
  "Host 1 small wellness event or journaling circle per month.",
  "Be a friendly first point of contact for peers in distress (we train you).",
  "Share honest feedback to shape India's most loved wellness tool.",
];

export default function StudentAmbassador() {
  useSEO({
    title: "Student Ambassador — WellMindAI Campus Wellness Leaders",
    description: "Become a WellMindAI Student Ambassador. Free 1-year Premium, certificate, cash bonuses, and training from India's top counselors.",
    path: "/student-ambassador",
  });

  const [form, setForm] = useState({
    name: "", email: "", college: "", year: "1st", city: "", motivation: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.college.trim()) {
      toast.error("Please fill name, email, and college.");
      return;
    }
    if (!/\.(edu|ac\.in|edu\.in)$/i.test(form.email) && !/(college|university|institute|school)/i.test(form.email)) {
      const ok = window.confirm("This doesn't look like a student email. Continue anyway? (Verification will happen manually.)");
      if (!ok) return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        source: "student_ambassador",
        status: "new",
        landing_page: "/student-ambassador",
        location_city: form.city || null,
        notes: JSON.stringify({
          college: form.college,
          year: form.year,
          motivation: form.motivation,
        }),
      });
      if (error) throw error;
      setDone(true);
      toast.success("Application received! Welcome aboard, future ambassador.");
    } catch (err: any) {
      toast.error(err?.message || "Could not submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-20">
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <GraduationCap className="w-3.5 h-3.5" /> Campus Wellness Leadership
            </div>
            <h1 className="font-display text-4xl md:text-6xl mb-4 tracking-tight">
              Be the <span className="text-primary serif-italic">friend</span> every campus needs.
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join 500+ Student Ambassadors making mental health <span className="font-semibold text-foreground">normal, accessible, and free</span> across Indian colleges.
            </p>
          </motion.div>
        </section>

        {/* PERKS GRID */}
        <section className="max-w-5xl mx-auto px-6 mb-14">
          <h2 className="font-display text-3xl text-center mb-8">What you get</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {PERKS.map((p) => (
              <div key={p.t} className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg mb-1.5">{p.t}</h3>
                <p className="text-sm text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RESPONSIBILITIES */}
        <section className="max-w-3xl mx-auto px-6 mb-14">
          <Card>
            <CardHeader>
              <CardTitle>What we'll ask from you</CardTitle>
              <p className="text-sm text-muted-foreground">Light commitment — about 2 hours/week. We provide all materials and training.</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {RESPONSIBILITIES.map((r) => (
                  <li key={r} className="flex gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* APPLY */}
        <section className="max-w-2xl mx-auto px-6">
          <Card className="border-primary/20 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Apply now
              </CardTitle>
              <p className="text-sm text-muted-foreground">Rolling admissions. Approval within 5 working days.</p>
            </CardHeader>
            <CardContent>
              {done ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="font-display text-xl mb-1">You're in motion!</h3>
                  <p className="text-sm text-muted-foreground">We'll email <span className="font-medium">{form.email}</span> with onboarding details within 5 days.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Full name</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">College email</Label>
                      <Input type="email" placeholder="you@college.edu" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">College / University</Label>
                    <Input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Year of study</Label>
                      <select className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
                        <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option><option>Masters</option><option>PhD</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">City</Label>
                      <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Why do you want to be an ambassador? (optional)</Label>
                    <Textarea rows={3} value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Submitting…" : "Become an Ambassador"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
