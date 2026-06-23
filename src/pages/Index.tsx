import { useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Phone, Video, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useSEO({
    title: "WellMindAI — talk to someone, gently.",
    description: "Two counselors. One tap. Voice or video mental wellness sessions, drawn with care.",
    path: "/",
  });

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* HERO — peach + sage split, hand-drawn */}
      <section className="relative flex-grow pt-24 pb-20 overflow-hidden">
        {/* Sage corner wash */}
        <div aria-hidden className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-pastel-sage opacity-80 blur-2xl -z-10" />
        <div aria-hidden className="absolute -bottom-32 -left-20 w-[36rem] h-[36rem] rounded-full bg-pastel-cream opacity-80 blur-2xl -z-10" />

        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="font-hand text-3xl text-primary mb-3">hi, you.</p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] font-semibold tracking-tight mb-6 text-balance">
              you, <span className="hand-underline">gently</span>
              <br /> held.
            </h1>
            <p className="text-lg text-foreground/75 max-w-md mb-8 leading-relaxed">
              Two counselors. One tap. Voice or video — whenever the noise gets too loud.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="h-14 px-7 rounded-full text-base font-semibold bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pencil hover:rotate-[-1deg] transition-transform"
              >
                Start talking <ArrowRight className="w-5 h-5 ml-1.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/about")}
                className="h-14 px-7 rounded-full text-base font-semibold border-2 border-foreground bg-card hover:bg-card/80"
              >
                why wellmind
              </Button>
            </div>
            <p className="font-hand text-xl text-foreground/60 mt-6">
              7 days free. no card. anonymous.
            </p>
          </motion.div>

          {/* Right — two stacked counselor cards, hand-drawn */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="relative h-[28rem]"
          >
            {[
              { name: "Ava", color: "bg-pastel-peach", rotate: "-rotate-3", top: "top-0 left-0" },
              { name: "Yaro", color: "bg-pastel-sage", rotate: "rotate-3", top: "bottom-0 right-0" },
            ].map((c) => (
              <div
                key={c.name}
                className={`absolute ${c.top} ${c.color} pastel-card w-64 ${c.rotate} hover-lift`}
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-card border-[3px] border-foreground/80 shadow-pencil flex items-center justify-center">
                  <span className="font-hand text-5xl">{c.name[0]}</span>
                </div>
                <h3 className="text-center font-display text-2xl mt-3">{c.name}</h3>
                <p className="text-center font-hand text-xl text-primary">here for you</p>
                <div className="flex gap-2 justify-center mt-3">
                  <span className="w-9 h-9 rounded-full bg-card border-2 border-foreground/80 flex items-center justify-center"><Video className="w-4 h-4" /></span>
                  <span className="w-9 h-9 rounded-full bg-card border-2 border-foreground/80 flex items-center justify-center"><Phone className="w-4 h-4" /></span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Three soft promises — minimal, hand-drawn */}
      <section className="bg-pastel-cream border-t-2 border-foreground/10 py-16">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            { hand: "tap", title: "one tap to talk", body: "No booking, no forms. Pick a face, choose voice or video." },
            { hand: "feel", title: "no judgment", body: "Trained in CBT, ACT, DBT. We listen first, advise gently." },
            { hand: "safe", title: "yours alone", body: "End-to-end encrypted. Anonymous by default." },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="pastel-card hover-lift"
              style={{ transform: `rotate(${(i - 1) * 0.6}deg)` }}
            >
              <p className="font-hand text-3xl text-primary mb-1">{c.hand}</p>
              <h3 className="font-display text-xl mb-2">{c.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quiet CTA */}
      <section className="py-20 bg-pastel-peach border-t-2 border-foreground/10">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
          <p className="font-hand text-4xl text-foreground/90 mb-2">you don't have to figure it out alone.</p>
          <h2 className="font-display text-3xl md:text-4xl mb-6">Try a free 7-day session.</h2>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="h-14 px-8 rounded-full bg-foreground text-background border-2 border-foreground hover:bg-foreground/90 font-semibold"
          >
            Begin <ArrowRight className="w-5 h-5 ml-1.5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
