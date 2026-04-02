import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, MapPin, Clock, Users, Rocket, Brain, Code, Heart,
  ChevronDown, ChevronUp, Send, Sparkles, Building2, TrendingUp, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface JobPosition {
  id: string;
  title: string;
  type: string;
  location: string;
  compensation: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  icon: React.ReactNode;
  badge?: string;
  badgeVariant: "co-founder" | "ai" | "engineering";
}

const badgeStyles = {
  "co-founder": "bg-calm-lavender/60 text-foreground",
  "ai": "bg-calm-sky-light/60 text-foreground",
  "engineering": "bg-calm-sage-light/60 text-foreground",
};

const iconBg = {
  "co-founder": "bg-calm-lavender/40",
  "ai": "bg-calm-sky-light/40",
  "engineering": "bg-calm-sage-light/40",
};

const jobPositions: JobPosition[] = [
  {
    id: "co-founder",
    title: "Co-Founder",
    type: "Full-time",
    location: "Delhi, India",
    compensation: "Equity-based (No initial salary)",
    description: "Join us as a Co-Founder and help build the future of mental health technology. We're looking for a passionate visionary who believes in making mental healthcare accessible to everyone through AI innovation.",
    responsibilities: [
      "Define and execute the company's strategic vision alongside the founding team",
      "Lead key business functions (operations, partnerships, or product)",
      "Drive fundraising efforts and investor relations",
      "Build and nurture a world-class team culture",
      "Represent MindWell AI at industry events and media",
      "Make critical decisions on product direction and company growth"
    ],
    requirements: [
      "5+ years of experience in tech startup, healthcare, or AI industry",
      "Proven leadership experience building and scaling teams",
      "Strong network in healthcare, tech, or VC communities",
      "Passionate about mental health and AI for social good",
      "Excellent communication and strategic thinking skills",
      "Willingness to commit full-time without initial compensation"
    ],
    perks: [
      "Significant equity stake (10-20%)",
      "Shape the future of mental healthcare",
      "Work with cutting-edge AI technology",
      "Flexible work arrangements",
      "Direct impact on millions of lives"
    ],
    icon: <Rocket className="w-5 h-5 text-calm-sage" />,
    badge: "Co-Founder",
    badgeVariant: "co-founder",
  },
  {
    id: "ai-ml-engineer",
    title: "AI/ML Engineer",
    type: "Full-time",
    location: "Delhi, India (Remote OK)",
    compensation: "Equity-based + Future salary",
    description: "Help us build the most empathetic AI counselor in the world. You'll work on cutting-edge NLP, voice synthesis, and emotion recognition systems to create AI that truly understands and helps people.",
    responsibilities: [
      "Design and implement advanced NLP models for therapeutic conversations",
      "Build emotion recognition and sentiment analysis systems",
      "Develop voice cloning and speech synthesis pipelines",
      "Optimize AI models for real-time performance",
      "Research and implement latest AI/ML techniques",
      "Collaborate with psychology experts for model training"
    ],
    requirements: [
      "3+ years experience in ML/AI development",
      "Strong proficiency in Python, PyTorch/TensorFlow",
      "Experience with LLMs, fine-tuning, and prompt engineering",
      "Knowledge of NLP, speech recognition, and synthesis",
      "Understanding of transformer architectures",
      "Published research or open-source contributions preferred"
    ],
    perks: [
      "Equity stake (2-5%)",
      "Work on life-changing AI technology",
      "Access to latest AI tools and compute",
      "Research publication opportunities",
      "Transition to competitive salary after funding"
    ],
    icon: <Brain className="w-5 h-5 text-calm-sage" />,
    badge: "AI/ML",
    badgeVariant: "ai",
  },
  {
    id: "software-engineer",
    title: "Software Engineer",
    type: "Full-time",
    location: "Delhi, India (Hybrid)",
    compensation: "Equity-based + Future salary",
    description: "Build the platform that will deliver mental health support to millions. You'll work on scalable systems, real-time communication, and beautiful user interfaces that make therapy accessible.",
    responsibilities: [
      "Develop and maintain our React/TypeScript frontend",
      "Build scalable backend services with Supabase and Edge Functions",
      "Implement real-time audio/video communication features",
      "Create intuitive and accessible user interfaces",
      "Optimize performance for mobile and web platforms",
      "Implement security best practices for healthcare data"
    ],
    requirements: [
      "2+ years experience in full-stack development",
      "Strong proficiency in React, TypeScript, and Node.js",
      "Experience with PostgreSQL and real-time databases",
      "Knowledge of WebRTC, audio/video streaming",
      "Understanding of responsive design and accessibility",
      "Interest in healthcare technology preferred"
    ],
    perks: [
      "Equity stake (1-3%)",
      "Shape the product from early stages",
      "Modern tech stack (React, Supabase, AI APIs)",
      "Flexible work hours",
      "Transition to competitive salary after funding"
    ],
    icon: <Code className="w-5 h-5 text-calm-sage" />,
    badge: "Engineering",
    badgeVariant: "engineering",
  }
];

const Careers = () => {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", location: "",
    experienceYears: "", currentCompany: "", linkedinUrl: "",
    portfolioUrl: "", skills: "", whyJoin: "", availability: "", referralSource: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) { toast.error("Please select a position"); return; }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("job_applications").insert({
        position: selectedJob,
        full_name: formData.fullName, email: formData.email,
        phone: formData.phone, location: formData.location,
        experience_years: formData.experienceYears ? parseInt(formData.experienceYears) : null,
        current_company: formData.currentCompany || null,
        linkedin_url: formData.linkedinUrl || null,
        portfolio_url: formData.portfolioUrl || null,
        skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : null,
        why_join: formData.whyJoin || null,
        availability: formData.availability || null,
        referral_source: formData.referralSource || null
      });
      if (error) throw error;
      toast.success("Application submitted successfully! We'll be in touch soon.");
      setFormData({ fullName: "", email: "", phone: "", location: "", experienceYears: "", currentCompany: "", linkedinUrl: "", portfolioUrl: "", skills: "", whyJoin: "", availability: "", referralSource: "" });
      setSelectedJob(null);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-5 bg-calm-sage-light/60 text-foreground border-calm-sage/20 gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-calm-sage" />
              We're Hiring
            </Badge>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Join Our Mission to{" "}
              <span className="text-calm-sage">Transform Mental Health</span>
            </h1>

            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              We're building the future of accessible mental healthcare with AI.
              Join our founding team and make a lasting impact on millions of lives.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: Building2, label: "Early-stage Startup" },
                { icon: MapPin, label: "Delhi, India" },
                { icon: TrendingUp, label: "Equity-based" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 bg-card border border-border/40 px-4 py-2 rounded-full text-sm text-muted-foreground"
                >
                  <item.icon className="w-4 h-4 text-calm-sage" />
                  {item.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-xl md:text-2xl font-semibold text-foreground text-center mb-8"
          >
            Why Join WellMind AI?
          </motion.h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Heart, title: "Impact Millions", desc: "Your work directly helps people with mental health" },
              { icon: Rocket, title: "Ground Floor", desc: "Founding member with significant equity" },
              { icon: Zap, title: "Cutting-edge Tech", desc: "Latest AI, NLP, and voice technologies" },
              { icon: Users, title: "Great Team", desc: "Passionate, mission-driven people" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-xl bg-card border border-border/40 text-center hover:shadow-sm transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-calm-sage-light/50 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-calm-sage" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-xl md:text-2xl font-semibold text-foreground text-center mb-8"
          >
            Open Positions
          </motion.h2>

          <div className="space-y-4">
            {jobPositions.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="overflow-hidden bg-card border-border/40 hover:border-border/80 transition-all">
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${iconBg[job.badgeVariant]} flex items-center justify-center shrink-0`}>
                          {job.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-semibold text-foreground">{job.title}</h3>
                            {job.badge && (
                              <Badge variant="secondary" className={`text-[10px] ${badgeStyles[job.badgeVariant]}`}>
                                {job.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                            <span className="flex items-center gap-1 hidden sm:flex"><Briefcase className="w-3 h-3" />{job.compensation}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        {expandedJob === job.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedJob === job.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-border/30 pt-5">
                          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{job.description}</p>

                          <div className="grid md:grid-cols-3 gap-5 mb-5">
                            <div>
                              <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Responsibilities</h4>
                              <ul className="space-y-1.5">
                                {job.responsibilities.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <span className="w-1 h-1 bg-calm-sage rounded-full mt-1.5 shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Requirements</h4>
                              <ul className="space-y-1.5">
                                {job.requirements.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <span className="w-1 h-1 bg-calm-lavender rounded-full mt-1.5 shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">What You'll Get</h4>
                              <ul className="space-y-1.5">
                                {job.perks.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <span className="w-1 h-1 bg-calm-sky rounded-full mt-1.5 shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <Button
                            onClick={() => { setSelectedJob(job.id); document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" }); }}
                            className="bg-calm-sage hover:bg-calm-sage/90 text-white text-sm rounded-xl"
                          >
                            Apply for this Position
                            <Send className="w-3.5 h-3.5 ml-2" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="bg-card border-border/40 shadow-soft">
              <CardHeader className="text-center pb-2">
                <CardTitle className="font-display text-xl md:text-2xl font-bold text-foreground">
                  Apply to Join Our Team
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedJob
                    ? `Applying for: ${jobPositions.find(j => j.id === selectedJob)?.title}`
                    : "Select a position above or fill out the form"}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Position Selection */}
                  <div>
                    <Label className="text-xs font-medium mb-2 block uppercase tracking-wide">Select Position *</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {jobPositions.map((job) => (
                        <div
                          key={job.id}
                          onClick={() => setSelectedJob(job.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedJob === job.id
                              ? "border-calm-sage bg-calm-sage-light/20"
                              : "border-border/40 hover:border-border/80"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg ${iconBg[job.badgeVariant]} flex items-center justify-center`}>
                              {job.icon}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground">{job.title}</p>
                              <p className="text-[10px] text-muted-foreground">{job.type}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><Label htmlFor="fullName" className="text-xs">Full Name *</Label>
                      <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Your full name" className="mt-1 h-10 bg-muted/30 border-border/50 rounded-xl text-sm" /></div>
                    <div><Label htmlFor="email" className="text-xs">Email *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="your@email.com" className="mt-1 h-10 bg-muted/30 border-border/50 rounded-xl text-sm" /></div>
                    <div><Label htmlFor="phone" className="text-xs">Phone *</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+91 XXXXX XXXXX" className="mt-1 h-10 bg-muted/30 border-border/50 rounded-xl text-sm" /></div>
                    <div><Label htmlFor="location" className="text-xs">Location *</Label>
                      <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required placeholder="City, Country" className="mt-1 h-10 bg-muted/30 border-border/50 rounded-xl text-sm" /></div>
                  </div>

                  {/* Experience */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><Label htmlFor="experienceYears" className="text-xs">Years of Experience</Label>
                      <Input id="experienceYears" name="experienceYears" type="number" value={formData.experienceYears} onChange={handleInputChange} placeholder="e.g., 5" className="mt-1 h-10 bg-muted/30 border-border/50 rounded-xl text-sm" /></div>
                    <div><Label htmlFor="currentCompany" className="text-xs">Current Company</Label>
                      <Input id="currentCompany" name="currentCompany" value={formData.currentCompany} onChange={handleInputChange} placeholder="Where do you work now?" className="mt-1 h-10 bg-muted/30 border-border/50 rounded-xl text-sm" /></div>
                  </div>

                  {/* Links */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><Label htmlFor="linkedinUrl" className="text-xs">LinkedIn Profile</Label>
                      <Input id="linkedinUrl" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." className="mt-1 h-10 bg-muted/30 border-border/50 rounded-xl text-sm" /></div>
                    <div><Label htmlFor="portfolioUrl" className="text-xs">Portfolio / GitHub</Label>
                      <Input id="portfolioUrl" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleInputChange} placeholder="https://github.com/..." className="mt-1 h-10 bg-muted/30 border-border/50 rounded-xl text-sm" /></div>
                  </div>

                  <div><Label htmlFor="skills" className="text-xs">Key Skills (comma-separated)</Label>
                    <Input id="skills" name="skills" value={formData.skills} onChange={handleInputChange} placeholder="React, TypeScript, Python, AI/ML..." className="mt-1 h-10 bg-muted/30 border-border/50 rounded-xl text-sm" /></div>

                  <div><Label htmlFor="whyJoin" className="text-xs">Why do you want to join WellMind AI?</Label>
                    <Textarea id="whyJoin" name="whyJoin" value={formData.whyJoin} onChange={handleInputChange} placeholder="Tell us about your passion for mental health..." className="mt-1 min-h-[100px] bg-muted/30 border-border/50 rounded-xl text-sm" /></div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><Label htmlFor="availability" className="text-xs">When can you start?</Label>
                      <Input id="availability" name="availability" value={formData.availability} onChange={handleInputChange} placeholder="e.g., Immediately" className="mt-1 h-10 bg-muted/30 border-border/50 rounded-xl text-sm" /></div>
                    <div><Label htmlFor="referralSource" className="text-xs">How did you hear about us?</Label>
                      <Input id="referralSource" name="referralSource" value={formData.referralSource} onChange={handleInputChange} placeholder="LinkedIn, Friend, Twitter..." className="mt-1 h-10 bg-muted/30 border-border/50 rounded-xl text-sm" /></div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedJob}
                    className="w-full h-11 bg-calm-sage hover:bg-calm-sage/90 text-white font-semibold rounded-xl"
                  >
                    {isSubmitting ? "Submitting..." : <><Send className="w-4 h-4 mr-2" /> Submit Application</>}
                  </Button>

                  <p className="text-center text-[10px] text-muted-foreground">
                    By submitting, you agree to our privacy policy. We'll review your application within 7 days.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
