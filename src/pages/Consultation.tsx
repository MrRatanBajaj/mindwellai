import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConsultationForm from "@/components/ui-custom/ConsultationForm";
import RegistrationForm from "@/components/ui-custom/RegistrationForm";
import EmergencyCounseling from "@/components/ui-custom/EmergencyCounseling";
import VideoCallSession from "@/components/ui-custom/VideoCallSession";
import TavusVideoConsultation from "@/components/ui-custom/TavusVideoConsultation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar, Shield, Video, Clock, AlertTriangle, CheckCircle, Star,
  ArrowRight, Search, Sparkles, Heart, Brain, MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DOCTOR_CARD_ORDER, DOCTOR_PROFILES, type DoctorType } from "@/lib/doctorProfiles";

type ConsultationStep = 'selection' | 'doctor-detail' | 'registration' | 'emergency' | 'scheduling' | 'video-call' | 'tavus-video' | 'ai-match' | 'completed';

const DOCTORS = DOCTOR_CARD_ORDER.map((type) => ({ type, ...DOCTOR_PROFILES[type] }));

const MATCH_QUESTIONS = [
  { q: "What best describes what you need help with?", opts: ["Anxiety or Stress", "Relationship issues", "Career guidance", "Physical health concern", "Grief or loss", "General wellness"] },
  { q: "What type of support feels most comfortable?", opts: ["A calm, nurturing voice", "Direct and practical advice", "Someone my age who gets it", "An experienced elder perspective"] },
  { q: "How urgently do you need support?", opts: ["I'd like to chat now", "This week would be fine", "Just exploring options"] },
];

const Consultation = () => {
  const [currentStep, setCurrentStep] = useState<ConsultationStep>('selection');
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [sessionType, setSessionType] = useState<'scheduled' | 'emergency'>('scheduled');
  const [selectedDoctorType, setSelectedDoctorType] = useState<DoctorType>('general');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [matchStep, setMatchStep] = useState(0);
  const [matchAnswers, setMatchAnswers] = useState<string[]>([]);
  const [matchedDoctor, setMatchedDoctor] = useState<typeof DOCTORS[0] | null>(null);

  const CATEGORIES: { label: string; types: DoctorType[] }[] = [
    { label: "All", types: [] },
    { label: "Mental Health", types: ['mental_health', 'male_therapist', 'elder_counselor', 'youth_counselor', 'relationship'] },
    { label: "Physical Health", types: ['general', 'cardiologist', 'dermatologist', 'pediatrician', 'neurologist', 'gynecologist'] },
    { label: "Lifestyle", types: ['nutritionist', 'career'] },
  ];

  const filteredDoctors = DOCTORS.filter(d => {
    const matchesSearch = searchQuery === "" ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === "All" ||
      CATEGORIES.find(c => c.label === activeCategory)?.types.includes(d.type);
    return matchesSearch && matchesCategory;
  });

  const selectedDoctor = DOCTORS.find(d => d.type === selectedDoctorType);

  const handleDoctorClick = (doctorType: DoctorType) => {
    setSelectedDoctorType(doctorType);
    setCurrentStep('doctor-detail');
  };

  const handleServiceSelection = (type: 'scheduled' | 'emergency') => {
    setSessionType(type);
    setCurrentStep(type === 'emergency' ? 'emergency' : 'registration');
  };

  const handleStartTavusConsultation = (doctorType: DoctorType) => {
    setSelectedDoctorType(doctorType);
    setCurrentStep('tavus-video');
  };

  const handleRegistrationComplete = (data: any) => {
    setRegistrationData(data);
    setCurrentStep('scheduling');
  };

  const handleEmergencySession = (type: 'video' | 'chat', urgency: string) => {
    if (type === 'video') setCurrentStep('video-call');
  };

  const handleCallEnd = () => setCurrentStep('completed');

  const handleMatchAnswer = (answer: string) => {
    const newAnswers = [...matchAnswers, answer];
    setMatchAnswers(newAnswers);
    if (matchStep < MATCH_QUESTIONS.length - 1) {
      setMatchStep(s => s + 1);
    } else {
      // Simple matching logic
      const a0 = newAnswers[0]?.toLowerCase() || "";
      let match: DoctorType = 'mental_health';
      if (a0.includes("relationship")) match = 'relationship';
      else if (a0.includes("career")) match = 'career';
      else if (a0.includes("physical")) match = 'general';
      else if (a0.includes("grief")) match = 'elder_counselor';
      else if (a0.includes("wellness")) match = 'nutritionist';

      const a1 = newAnswers[1]?.toLowerCase() || "";
      if (a1.includes("my age")) match = 'youth_counselor';
      else if (a1.includes("elder")) match = 'elder_counselor';

      setMatchedDoctor({ type: match, ...DOCTOR_PROFILES[match] });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'selection':
        return (
          <section className="min-h-screen bg-background">
            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-to-b from-calm-sage-light/40 via-calm-sky/20 to-background">
              <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-calm-sage-light border border-border/50 text-sm text-foreground/80 mb-6">
                    <Heart className="w-3.5 h-3.5 text-calm-sage" />
                    <span>Your wellness team, always ready</span>
                  </div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                    Book a Counselor
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                    Browse our 13 specialized AI counselors or let us match you with the right one.
                  </p>

                  {/* Mode toggle */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                    <Button variant="outline" onClick={() => {}} className="border-calm-sage/30 bg-calm-sage-light/50 text-foreground gap-2">
                      <Search className="w-4 h-4" /> Browse Specialists
                    </Button>
                    <Button
                      onClick={() => { setCurrentStep('ai-match'); setMatchStep(0); setMatchAnswers([]); setMatchedDoctor(null); }}
                      className="bg-calm-sage hover:bg-calm-sage/90 text-white gap-2"
                    >
                      <Sparkles className="w-4 h-4" /> AI Match Me
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-5xl mx-auto px-6 -mt-2 mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, specialty, or concern..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-card border-border/50 rounded-xl"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="max-w-6xl mx-auto px-6 mb-6">
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.label)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      activeCategory === cat.label
                        ? "bg-calm-sage text-white shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {cat.label}
                    {cat.label !== "All" && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({cat.types.length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctor Grid */}
            <div className="max-w-6xl mx-auto px-6 pb-12">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {filteredDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Card
                      className="group h-full cursor-pointer border border-border/50 hover:border-calm-sage/40 hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm"
                      onClick={() => handleDoctorClick(doctor.type)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4 mb-3">
                          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", "bg-calm-sage-light")}>
                            <doctor.icon className="w-5 h-5 text-calm-sage" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{doctor.name}</h3>
                            <p className="text-sm text-calm-sage">{doctor.specialty}</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-[10px] shrink-0">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" />Online
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{doctor.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {doctor.expertise.slice(0, 3).map(e => (
                            <Badge key={e} variant="secondary" className="text-[10px] px-2 py-0 bg-muted/60">{e}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-medium">{doctor.rating}</span>
                          </div>
                          <Button size="sm" className="h-8 bg-calm-sage hover:bg-calm-sage/90 text-white text-xs gap-1 rounded-lg">
                            <Video className="w-3 h-3" /> Consult
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {filteredDoctors.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>No counselors match your search. Try different keywords.</p>
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div className="max-w-4xl mx-auto px-6 pb-16">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-sm text-muted-foreground bg-background">Other options</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card className="cursor-pointer border border-border/50 hover:border-calm-sage/40 hover:shadow-md transition-all" onClick={() => handleServiceSelection('scheduled')}>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-calm-sage-light flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6 text-calm-sage" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Schedule Consultation</h3>
                      <p className="text-sm text-muted-foreground">Book a planned session at your convenience</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer border border-destructive/20 hover:border-destructive/40 hover:shadow-md transition-all" onClick={() => handleServiceSelection('emergency')}>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-destructive">Emergency Support</h3>
                      <p className="text-sm text-muted-foreground">Immediate crisis counseling, available 24/7</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Trust bar */}
            <div className="max-w-4xl mx-auto px-6 pb-12">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                {[
                  { icon: Shield, text: "HIPAA Compliant" },
                  { icon: Clock, text: "Available 24/7" },
                  { icon: CheckCircle, text: "10,000+ Sessions" },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-calm-sage" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'ai-match':
        return (
          <section className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
              <Button variant="ghost" onClick={() => { setCurrentStep('selection'); setMatchStep(0); setMatchAnswers([]); setMatchedDoctor(null); }} className="mb-6 text-muted-foreground">
                ← Back to all counselors
              </Button>

              {!matchedDoctor ? (
                <Card className="border border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 rounded-xl bg-calm-sage-light flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-7 h-7 text-calm-sage" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Question {matchStep + 1} of {MATCH_QUESTIONS.length}</p>
                      <div className="w-full bg-muted rounded-full h-1.5 mb-4">
                        <div className="bg-calm-sage h-1.5 rounded-full transition-all" style={{ width: `${((matchStep + 1) / MATCH_QUESTIONS.length) * 100}%` }} />
                      </div>
                      <h2 className="font-display text-xl font-bold">{MATCH_QUESTIONS[matchStep].q}</h2>
                    </div>
                    <div className="space-y-3">
                      <AnimatePresence mode="wait">
                        {MATCH_QUESTIONS[matchStep].opts.map((opt, i) => (
                          <motion.button
                            key={opt}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => handleMatchAnswer(opt)}
                            className="w-full text-left px-4 py-3 rounded-xl border border-border/50 hover:border-calm-sage/40 hover:bg-calm-sage-light/30 transition-all text-sm"
                          >
                            {opt}
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="border border-calm-sage/30 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-calm-sage-light flex items-center justify-center mx-auto mb-4">
                        <matchedDoctor.icon className="w-8 h-8 text-calm-sage" />
                      </div>
                      <Badge className="bg-calm-sage/10 text-calm-sage border-calm-sage/30 mb-3">Best Match</Badge>
                      <h2 className="font-display text-2xl font-bold mb-1">{matchedDoctor.name}</h2>
                      <p className="text-calm-sage mb-3">{matchedDoctor.specialty}</p>
                      <p className="text-sm text-muted-foreground mb-4">{matchedDoctor.description}</p>
                      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                        {matchedDoctor.expertise.map(e => (
                          <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                        ))}
                      </div>
                      <Button className="w-full bg-calm-sage hover:bg-calm-sage/90 text-white gap-2" onClick={() => handleDoctorClick(matchedDoctor.type)}>
                        <Video className="w-4 h-4" /> Start Consultation <ArrowRight className="w-4 h-4" />
                      </Button>
                      <button onClick={() => setCurrentStep('selection')} className="mt-3 text-sm text-muted-foreground hover:text-foreground">
                        Browse all counselors instead
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </section>
        );

      case 'doctor-detail':
        return selectedDoctor ? (
          <section className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-6 pt-10 pb-20">
              <Button variant="ghost" onClick={() => setCurrentStep('selection')} className="mb-6 text-muted-foreground">
                ← Back to all counselors
              </Button>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Profile Header */}
                <Card className="border border-border/50 overflow-hidden">
                  <div className={`h-32 bg-gradient-to-r ${selectedDoctor.gradient}`} />
                  <CardContent className="p-6 -mt-12">
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                      <div className="w-20 h-20 rounded-2xl bg-card border-4 border-background shadow-lg flex items-center justify-center shrink-0">
                        <selectedDoctor.icon className="w-9 h-9 text-calm-sage" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h1 className="font-display text-2xl font-bold text-foreground">{selectedDoctor.name}</h1>
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" />Online
                          </Badge>
                        </div>
                        <p className="text-calm-sage font-medium mt-1">{selectedDoctor.specialty}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="font-semibold">{selectedDoctor.rating}</span>
                          <span className="text-sm text-muted-foreground ml-1">• 500+ sessions</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* About */}
                <Card className="border border-border/50">
                  <CardContent className="p-6">
                    <h2 className="font-semibold text-lg mb-3">About</h2>
                    <p className="text-muted-foreground leading-relaxed">{selectedDoctor.description}</p>
                  </CardContent>
                </Card>

                {/* Expertise */}
                <Card className="border border-border/50">
                  <CardContent className="p-6">
                    <h2 className="font-semibold text-lg mb-3">Areas of Expertise</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.expertise.map(e => (
                        <Badge key={e} variant="secondary" className="px-3 py-1 text-sm bg-calm-sage-light text-foreground">{e}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Key Features */}
                <Card className="border border-border/50">
                  <CardContent className="p-6">
                    <h2 className="font-semibold text-lg mb-4">Session Highlights</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { icon: Video, title: "HD Video Call", desc: "Face-to-face AI consultation" },
                        { icon: Shield, title: "100% Private", desc: "End-to-end encrypted session" },
                        { icon: Clock, title: "No Wait Time", desc: "Start instantly, available 24/7" },
                      ].map(item => (
                        <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                          <item.icon className="w-5 h-5 text-calm-sage mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-calm-sage hover:bg-calm-sage/90 text-white gap-2 py-6 text-base"
                    onClick={() => handleStartTavusConsultation(selectedDoctor.type)}
                  >
                    <Video className="w-5 h-5" /> Start Video Consultation
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 gap-2 py-6 text-base border-calm-sage/30"
                    onClick={() => { setSelectedDoctorType(selectedDoctor.type); handleServiceSelection('scheduled'); }}
                  >
                    <Calendar className="w-5 h-5" /> Schedule for Later
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        ) : null;

      case 'registration':
        return (
          <section className="py-10 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Button variant="outline" onClick={() => setCurrentStep('selection')} className="mb-4">← Back</Button>
              </div>
              <RegistrationForm onComplete={handleRegistrationComplete} />
            </div>
          </section>
        );

      case 'emergency':
        return (
          <section className="py-10 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Button variant="outline" onClick={() => setCurrentStep('selection')} className="mb-4">← Back</Button>
              </div>
              <EmergencyCounseling onStartSession={handleEmergencySession} />
            </div>
          </section>
        );

      case 'scheduling':
        return (
          <section className="py-10 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Button variant="outline" onClick={() => setCurrentStep('registration')} className="mb-4">← Back</Button>
              </div>
              <ConsultationForm />
            </div>
          </section>
        );

      case 'video-call':
        return <VideoCallSession onEndCall={handleCallEnd} />;

      case 'tavus-video':
        return <TavusVideoConsultation doctorType={selectedDoctorType} onEndCall={handleCallEnd} />;

      case 'completed':
        return (
          <section className="py-20 px-6 min-h-screen flex items-center justify-center">
            <motion.div className="max-w-lg mx-auto text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-20 h-20 bg-calm-sage-light rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-calm-sage" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-3">Session Complete</h2>
              <p className="text-muted-foreground mb-6">Thank you for your consultation. Remember, taking care of your mental health is an act of strength.</p>
              <Button onClick={() => setCurrentStep('selection')} className="bg-calm-sage hover:bg-calm-sage/90 text-white">
                Start New Consultation
              </Button>
            </motion.div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-20">{renderStepContent()}</main>
      {(currentStep === 'selection' || currentStep === 'ai-match') && <Footer />}
    </div>
  );
};

export default Consultation;
