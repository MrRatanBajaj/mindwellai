import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FeedbackForm } from "@/components/ui-custom/FeedbackForm";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, Calendar, Leaf, Briefcase,
  ArrowRight, Shield, Clock, Heart, Sparkles
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Leaf,
      title: "Self Help",
      description: "Curated guides, breathing exercises, and evidence-based techniques for everyday wellness.",
      path: "/self-help",
      bg: "bg-calm-sage-light",
      iconColor: "text-primary",
    },
    {
      icon: BookOpen,
      title: "Journaling",
      description: "Track your thoughts and moods with our private, guided journaling experience.",
      path: "/journal",
      bg: "bg-calm-lavender",
      iconColor: "text-accent-foreground",
    },
    {
      icon: Calendar,
      title: "Book a Counselor",
      description: "Schedule a session with our AI-powered counselors specialized in various areas.",
      path: "/consultation",
      bg: "bg-calm-sky",
      iconColor: "text-primary",
    },
    {
      icon: Briefcase,
      title: "Careers",
      description: "Join our mission to make mental health support accessible to everyone.",
      path: "/careers",
      bg: "bg-calm-sand",
      iconColor: "text-accent-foreground",
    },
  ];

  const trustSignals = [
    { icon: Shield, label: "Private & Secure" },
    { icon: Clock, label: "Available 24/7" },
    { icon: Heart, label: "Evidence-Based" },
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
              Journal your thoughts, explore self-help resources, and connect with counselors — all in one peaceful space.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <NavLink to="/auth">
                <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base font-medium">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </NavLink>
              <NavLink to="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-base">
                  Learn More
                </Button>
              </NavLink>
            </div>

            {/* Trust Signals */}
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

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
              Everything you need
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Simple tools designed to support your mental health journey, one step at a time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink to={feature.path}>
                  <div className="group p-8 rounded-2xl border border-border bg-card hover:shadow-card transition-all duration-300 h-full">
                    <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5`}>
                      <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </NavLink>
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
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
              Start your wellness journey
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Take the first step towards a calmer, more balanced life. It's free to get started.
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
              Your feedback shapes the future of WellMind
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
