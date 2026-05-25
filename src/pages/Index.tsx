import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FeedbackForm } from "@/components/ui-custom/FeedbackForm";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRight, Shield, Clock, Heart, Sparkles, Target, Compass,
  Users, Award, Quote, Star, CheckCircle2, Building2, Globe
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Logged-in users skip the landing page entirely and go to their dashboard.
  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const trustSignals = [
    { icon: Shield, label: "Private & Secure" },
    { icon: Clock, label: "Available 24/7" },
    { icon: Heart, label: "Evidence-Based" },
  ];

  const partners = [
    { name: "NIMH", desc: "Mental Health Research" },
    { name: "WHO", desc: "World Health" },
    { name: "iCall TISS", desc: "India Helpline" },
    { name: "Vandrevala", desc: "24/7 Support" },
    { name: "Mind UK", desc: "Mental Health Charity" },
    { name: "SAMHSA", desc: "Substance & Mental Health" },
  ];

  const testimonials = [
    {
      name: "Aarav S.",
      role: "Student, Pune",
      quote: "WellMindAI helped me through my exam anxiety. The journaling and counselor sessions made a real difference in my daily life.",
      rating: 5,
    },
    {
      name: "Priya M.",
      role: "Working Professional",
      quote: "Being able to talk to an AI counselor at 2 AM during a panic attack changed everything. It's like having a therapist in my pocket.",
      rating: 5,
    },
    {
      name: "Dr. Rohan K.",
      role: "Therapist",
      quote: "I recommend WellMindAI to my clients as a between-session support tool. The self-help library is genuinely high-quality.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-calm-sage-light/50 via-background to-background" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Your Mental Wellness Companion
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground leading-tight mb-6">
              A calmer mind starts{" "}
              <span className="text-primary">here</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              Sign in to unlock private journaling, evidence-based self-help, and 23 specialist AI counselors — all in one peaceful space.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <NavLink to="/auth">
                <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base font-medium">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </NavLink>
              <NavLink to="/auth">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-base">
                  Sign In
                </Button>
              </NavLink>
            </div>

            <div className="flex items-center justify-center gap-6 flex-wrap">
              {trustSignals.map((signal) => (
                <div key={signal.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <signal.icon className="w-4 h-4 text-primary" />
                  {signal.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-3">
              Why WellMindAI exists
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We believe mental wellness should be private, affordable, and available the moment you need it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="p-8 rounded-2xl border border-border bg-card h-full">
                <div className="w-12 h-12 rounded-xl bg-calm-sage-light flex items-center justify-center mb-5">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A world where everyone has a calm, judgment-free space to care for their mind — regardless of income, geography, or language.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-8 rounded-2xl border border-border bg-card h-full">
                <div className="w-12 h-12 rounded-xl bg-calm-lavender flex items-center justify-center mb-5">
                  <Compass className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To combine evidence-based therapy methods with AI so that emotional support is private, instant, and as warm as a real conversation.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-to-b from-background to-calm-sage-light/20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-display text-foreground mb-2">
              What we stand for
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "Privacy First", desc: "Your data is yours alone. End-to-end protected." },
              { icon: Heart, title: "Real Empathy", desc: "Warm, non-judgmental support — never robotic." },
              { icon: CheckCircle2, title: "Evidence-Based", desc: "CBT, DBT, ACT, and mindfulness — proven methods." },
              { icon: Globe, title: "Always Accessible", desc: "24/7 support, on any device, in your language." },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl bg-card border border-border"
              >
                <value.icon className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-semibold text-foreground mb-1">{value.title}</h4>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-calm-sage-light/60 text-sm text-foreground/80 mb-4">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              Trusted resources
            </div>
            <h2 className="text-2xl md:text-3xl font-display text-foreground mb-3">
              Backed by leading mental health organizations
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We integrate verified guidance and helpline resources from globally respected mental health bodies.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl border border-border bg-card text-center"
              >
                <div className="font-semibold text-foreground text-sm mb-1">{partner.name}</div>
                <div className="text-xs text-muted-foreground">{partner.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customers / Testimonials */}
      <section className="py-20 bg-gradient-to-b from-calm-lavender-light/20 via-background to-background">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-calm-lavender/40 text-sm text-foreground/80 mb-4">
              <Users className="w-3.5 h-3.5 text-accent-foreground" />
              Loved by 10,000+ users
            </div>
            <h2 className="text-2xl md:text-3xl font-display text-foreground mb-3">
              Real stories from our community
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-border bg-card flex flex-col"
              >
                <Quote className="w-7 h-7 text-primary/40 mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-4 flex-1">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact stats */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "10,000+", label: "Sessions Delivered" },
              { value: "23", label: "Specialist Counselors" },
              { value: "24/7", label: "Always Available" },
              { value: "4.9★", label: "Average Rating" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-calm-sage-light/30 border border-border text-center"
              >
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-calm-sage-light/30 to-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Award className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
              Start your wellness journey
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Create your free account and unlock journaling, self-help, and 23 specialist counselors instantly.
            </p>
            <NavLink to="/auth">
              <Button size="lg" className="px-8 py-6 text-base font-medium">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </NavLink>
          </motion.div>
        </div>
      </section>

      {/* Feedback */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-display text-foreground mb-2">
              Help Us Improve
            </h2>
            <p className="text-muted-foreground text-sm">
              Your feedback shapes the future of WellMindAI
            </p>
          </motion.div>
          <FeedbackForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
