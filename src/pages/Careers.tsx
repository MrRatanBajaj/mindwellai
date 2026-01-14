import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Rocket, 
  Brain, 
  Code, 
  Heart,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  Building2,
  TrendingUp,
  Zap
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
  badgeColor?: string;
}

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
    icon: <Rocket className="w-6 h-6" />,
    badge: "Co-Founder",
    badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500"
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
    icon: <Brain className="w-6 h-6" />,
    badge: "AI/ML",
    badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-500"
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
    icon: <Code className="w-6 h-6" />,
    badge: "Engineering",
    badgeColor: "bg-gradient-to-r from-green-500 to-emerald-500"
  }
];

const Careers = () => {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    experienceYears: "",
    currentCompany: "",
    linkedinUrl: "",
    portfolioUrl: "",
    skills: "",
    whyJoin: "",
    availability: "",
    referralSource: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJob) {
      toast.error("Please select a position");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("job_applications").insert({
        position: selectedJob,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
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
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        experienceYears: "",
        currentCompany: "",
        linkedinUrl: "",
        portfolioUrl: "",
        skills: "",
        whyJoin: "",
        availability: "",
        referralSource: ""
      });
      setSelectedJob(null);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-mindwell-50/30">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mindwell-600/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-mindwell-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-gradient-to-r from-mindwell-500 to-purple-500 text-white px-4 py-1">
              <Sparkles className="w-4 h-4 mr-2" />
              We're Hiring!
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Join Our Mission to
              <span className="block bg-gradient-to-r from-mindwell-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Transform Mental Health
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              We're building the future of accessible mental healthcare with AI. 
              Join our founding team and make a lasting impact on millions of lives.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                <Building2 className="w-5 h-5 text-mindwell-600" />
                <span className="text-slate-700">Early-stage Startup</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                <MapPin className="w-5 h-5 text-mindwell-600" />
                <span className="text-slate-700">Delhi, India</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                <TrendingUp className="w-5 h-5 text-mindwell-600" />
                <span className="text-slate-700">Equity-based Compensation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Join MindWell AI?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Be part of something meaningful from the very beginning
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Heart className="w-8 h-8" />, title: "Impact Millions", desc: "Your work will directly help people struggling with mental health" },
              { icon: <Rocket className="w-8 h-8" />, title: "Ground Floor", desc: "Join as a founding member with significant equity" },
              { icon: <Zap className="w-8 h-8" />, title: "Cutting-edge Tech", desc: "Work with the latest AI, NLP, and voice technologies" },
              { icon: <Users className="w-8 h-8" />, title: "Great Team", desc: "Collaborate with passionate, mission-driven people" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-white to-mindwell-50/50 border-mindwell-100 hover:shadow-lg transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-mindwell-500 to-purple-500 rounded-2xl flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Open Positions</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Find your role in shaping the future of mental healthcare
            </p>
          </motion.div>

          <div className="space-y-6">
            {jobPositions.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden bg-white border-slate-200 hover:border-mindwell-300 transition-all">
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${job.badgeColor} flex items-center justify-center text-white shrink-0`}>
                          {job.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                            {job.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {job.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {job.compensation}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="self-start md:self-center">
                        {expandedJob === job.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
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
                        <div className="px-6 pb-6 border-t border-slate-100 pt-6">
                          <p className="text-slate-700 mb-6">{job.description}</p>
                          
                          <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-3">Responsibilities</h4>
                              <ul className="space-y-2">
                                {job.responsibilities.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                    <span className="w-1.5 h-1.5 bg-mindwell-500 rounded-full mt-2 shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-3">Requirements</h4>
                              <ul className="space-y-2">
                                {job.requirements.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-3">What You'll Get</h4>
                              <ul className="space-y-2">
                                {job.perks.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <Button 
                            onClick={() => setSelectedJob(job.id)}
                            className="bg-gradient-to-r from-mindwell-600 to-purple-600 hover:from-mindwell-700 hover:to-purple-700"
                          >
                            Apply for this Position
                            <Send className="w-4 h-4 ml-2" />
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
      <section id="application-form" className="py-16 bg-gradient-to-br from-mindwell-50 via-purple-50/30 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900">
                  Apply to Join Our Team
                </CardTitle>
                <p className="text-slate-600 mt-2">
                  {selectedJob 
                    ? `Applying for: ${jobPositions.find(j => j.id === selectedJob)?.title}`
                    : "Select a position above or fill out the form to express interest"
                  }
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Position Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Select Position *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {jobPositions.map((job) => (
                        <div
                          key={job.id}
                          onClick={() => setSelectedJob(job.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedJob === job.id
                              ? "border-mindwell-500 bg-mindwell-50"
                              : "border-slate-200 hover:border-mindwell-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${job.badgeColor} flex items-center justify-center text-white`}>
                              {job.icon}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">{job.title}</p>
                              <p className="text-xs text-slate-500">{job.type}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+91 XXXXX XXXXX"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Current Location *</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        placeholder="City, Country"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experienceYears">Years of Experience</Label>
                      <Input
                        id="experienceYears"
                        name="experienceYears"
                        type="number"
                        value={formData.experienceYears}
                        onChange={handleInputChange}
                        placeholder="e.g., 5"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentCompany">Current Company</Label>
                      <Input
                        id="currentCompany"
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleInputChange}
                        placeholder="Where do you work now?"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Links */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                      <Input
                        id="linkedinUrl"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="portfolioUrl">Portfolio / GitHub</Label>
                      <Input
                        id="portfolioUrl"
                        name="portfolioUrl"
                        value={formData.portfolioUrl}
                        onChange={handleInputChange}
                        placeholder="https://github.com/..."
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <Label htmlFor="skills">Key Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="React, TypeScript, Python, AI/ML..."
                      className="mt-1"
                    />
                  </div>

                  {/* Why Join */}
                  <div>
                    <Label htmlFor="whyJoin">Why do you want to join MindWell AI?</Label>
                    <Textarea
                      id="whyJoin"
                      name="whyJoin"
                      value={formData.whyJoin}
                      onChange={handleInputChange}
                      placeholder="Tell us about your passion for mental health and what excites you about this opportunity..."
                      className="mt-1 min-h-[120px]"
                    />
                  </div>

                  {/* Additional Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="availability">When can you start?</Label>
                      <Input
                        id="availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        placeholder="e.g., Immediately, 2 weeks notice"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="referralSource">How did you hear about us?</Label>
                      <Input
                        id="referralSource"
                        name="referralSource"
                        value={formData.referralSource}
                        onChange={handleInputChange}
                        placeholder="LinkedIn, Friend, Twitter..."
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting || !selectedJob}
                    className="w-full bg-gradient-to-r from-mindwell-600 to-purple-600 hover:from-mindwell-700 hover:to-purple-700 py-6 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-slate-500">
                    By submitting, you agree to our privacy policy. We'll review your application and get back to you within 7 days.
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
