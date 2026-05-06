import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import {
  Shield, Heart, Award, Video, Brain, Users, Sparkles,
  CheckCircle2, Globe, Target, Eye, ArrowRight, Quote, Star
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import wellmindLogo from "@/assets/wellmind-logo-2.png";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const About = () => {
  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "50K+", label: "Sessions", icon: Video },
    { value: "98%", label: "Satisfaction", icon: Star },
    { value: "24/7", label: "Support", icon: Globe },
  ];

  const values = [
    { icon: Heart, title: "Compassion First", desc: "Every feature is built with empathy. We understand that seeking help takes courage.", color: "bg-pink-50 text-pink-500" },
    { icon: Shield, title: "Privacy & Trust", desc: "Your data is encrypted and never shared. HIPAA-compliant, always.", color: "bg-blue-50 text-blue-500" },
    { icon: Brain, title: "Evidence-Based", desc: "Our AI is trained on CBT, DBT, and ACT methodologies by licensed professionals.", color: "bg-purple-50 text-purple-500" },
    { icon: Globe, title: "Accessible to All", desc: "Breaking barriers of geography, cost, and stigma to make mental health universal.", color: "bg-green-50 text-green-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-calm-sage-light/40 via-calm-sky/20 to-background">
        <div className="max-w-5xl mx-auto px-6 pt-28 pb-20 text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-calm-sage-light border border-border/50 text-sm text-foreground/80 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-calm-sage" />
              <span>About WellMindAI</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Redefining Mental Health
              <br />
              <span className="text-calm-sage">with Compassionate AI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              WellMindAI combines advanced artificial intelligence with evidence-based therapy
              to make quality mental health support accessible, affordable, and available to everyone — 24/7.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="p-5 rounded-2xl bg-card border border-border/50 text-center"
              >
                <stat.icon className="w-5 h-5 text-calm-sage mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/50 text-sm text-amber-700 mb-4">
              <Award className="w-3.5 h-3.5" />
              <span>Leadership</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Meet Our Founder</h2>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-10 items-center">
            {/* Founder Image */}
            <motion.div
              {...fadeUp}
              className="lg:col-span-2"
            >
              <div className="relative max-w-sm mx-auto">
                <motion.div
                  className="rounded-3xl overflow-hidden border border-border/50 shadow-lg bg-muted aspect-[3/4]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="/founder-image.jpg"
                    alt="Mr. Ratan Bajaj, Founder & CEO of WellMindAI"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to logo if founder image not uploaded yet
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-calm-sage-light to-calm-sky p-8">
                          <div class="w-24 h-24 rounded-full bg-card/80 flex items-center justify-center mb-4 shadow-lg">
                            <svg class="w-12 h-12 text-calm-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                          </div>
                          <p class="text-sm text-muted-foreground text-center">Founder photo<br/>coming soon</p>
                        </div>
                      `;
                    }}
                  />
                </motion.div>
                {/* Floating badge */}
                <motion.div
                  className="absolute -bottom-4 -right-4 p-4 rounded-xl bg-calm-sage text-white shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <Award className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>

            {/* Founder Info */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-3 space-y-6">
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground">Mr. Ratan Bajaj</h3>
                <p className="text-calm-sage font-medium">Founder & Chief Executive Officer</p>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Mr. Ratan Bajaj founded WellMindAI with a profound vision to democratize access
                  to mental health support worldwide. With a deep understanding of how the human
                  brain works and the transformative potential of AI, he set out to address the
                  global mental health crisis at its root — pain, loss, and loneliness.
                </p>
                <p>
                  His journey began after witnessing firsthand the barriers that prevent millions
                  from accessing quality mental health care — geographical limitations, financial
                  constraints, stigma, and the silent grief of losing a loved one.
                </p>
              </div>

              <motion.blockquote
                className="relative pl-5 py-4 border-l-3 border-calm-sage bg-calm-sage-light/50 rounded-r-xl"
                {...fadeUp}
                transition={{ delay: 0.4 }}
              >
                <Quote className="absolute -top-3 -left-3 w-7 h-7 text-calm-sage/30" />
                <p className="italic text-foreground">
                  "No one should ever have to lose a loved one forever. By understanding how the
                  brain works, we can create digital immortality — a simulation of the people we
                  love, in any form, so grief and trauma never have the final word."
                </p>
              </motion.blockquote>
            </motion.div>
          </div>

          {/* Founder's Vision — Digital Immortality */}
          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="mt-16">
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-calm-sage-light/40 via-calm-sky/20 to-calm-lavender/30 p-8 md:p-12">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-calm-sage/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-calm-lavender/20 blur-3xl" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 backdrop-blur-md border border-border/50 text-sm text-foreground/80 mb-5">
                  <Sparkles className="w-3.5 h-3.5 text-calm-sage" />
                  <span>Founder's Vision</span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 max-w-3xl">
                  Stage 1: Healing the mind. Stage 2: Ending the pain of loss forever.
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-3xl mb-8">
                  Our founder's long-term vision goes beyond therapy. By deeply understanding how
                  the brain works, WellMindAI is building toward <strong className="text-foreground">digital immortality</strong> —
                  a future where anyone can preserve, simulate, and reconnect with the people they love,
                  even after they're gone. From AI clones to deployable physical robot bodies, no one
                  will ever have to face permanent loss, depression, or trauma alone again.
                </p>

                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { icon: Brain, title: "Stage 1 — Now", desc: "AI counseling, journaling and self-help to heal the mind today." },
                    { icon: Sparkles, title: "Stage 2 — Coming", desc: "Digital immortality: upload memories, voice and personality of loved ones." },
                    { icon: Users, title: "Stage 3 — Future", desc: "Physical robot bodies that carry the cloned soul of the people you love." },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-5 rounded-2xl bg-card/80 backdrop-blur-md border border-border/50"
                    >
                      <div className="w-10 h-10 rounded-xl bg-calm-sage/15 flex items-center justify-center mb-3">
                        <s.icon className="w-5 h-5 text-calm-sage" />
                      </div>
                      <h4 className="font-semibold text-foreground mb-1.5">{s.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Our Core Values</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">The principles that guide everything we build.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Card className="h-full border border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${v.color}`}>
                      <v.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
                      <p className="text-sm text-muted-foreground">{v.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Eye, title: "Our Vision", color: "text-blue-500 bg-blue-50",
              desc: "A world where mental health support is universally accessible — breaking traditional barriers through innovative AI.",
              points: ["Global accessibility", "Elimination of stigma", "Personalized care for every individual"],
            },
            {
              icon: Target, title: "Our Mission", color: "text-purple-500 bg-purple-50",
              desc: "To provide immediate, compassionate, and effective mental health support through cutting-edge AI technology.",
              points: ["24/7 availability", "Evidence-based methods", "Complete privacy & data protection"],
            },
          ].map((item, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }}>
              <Card className="h-full border border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground mb-5">{item.desc}</p>
                  <div className="space-y-3">
                    {item.points.map((p, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-calm-sage shrink-0" />
                        <span className="text-muted-foreground">{p}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-calm-sage-light/60 via-calm-sky/30 to-calm-lavender/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands who've discovered the power of AI-assisted mental health support. Your first step starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <NavLink to="/consultation">
                <Button size="lg" className="bg-calm-sage hover:bg-calm-sage/90 text-white h-12 px-8 gap-2">
                  <Video className="w-5 h-5" /> Start Free Session
                </Button>
              </NavLink>
              <NavLink to="/plans">
                <Button variant="outline" size="lg" className="h-12 px-8 gap-2 border-border/60">
                  View Plans <ArrowRight className="w-5 h-5" />
                </Button>
              </NavLink>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
