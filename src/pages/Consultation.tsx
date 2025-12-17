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
import { Calendar, Shield, Video, Clock, Heart, AlertTriangle, CheckCircle, Stethoscope, User, Brain, Activity, Baby, Apple, Sparkles, Phone, Star, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ConsultationStep = 'selection' | 'registration' | 'emergency' | 'scheduling' | 'video-call' | 'tavus-video' | 'completed';
type DoctorType = 'general' | 'dermatologist' | 'mental_health' | 'cardiologist' | 'pediatrician' | 'neurologist' | 'gynecologist' | 'nutritionist';

interface DoctorCardInfo {
  type: DoctorType;
  name: string;
  specialty: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  accent: string;
  rating: number;
  available: boolean;
}

const DOCTORS: DoctorCardInfo[] = [
  {
    type: 'general',
    name: 'Dr. Sarah',
    specialty: 'General Physician',
    description: 'General health consultations and wellness guidance',
    icon: Stethoscope,
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    accent: 'blue',
    rating: 4.9,
    available: true,
  },
  {
    type: 'mental_health',
    name: 'Dr. Emma',
    specialty: 'Mental Health Counselor',
    description: 'Anxiety, stress, and emotional well-being support',
    icon: Brain,
    gradient: 'from-purple-500 via-purple-600 to-violet-600',
    accent: 'purple',
    rating: 4.8,
    available: true,
  },
  {
    type: 'cardiologist',
    name: 'Dr. James',
    specialty: 'Cardiologist',
    description: 'Heart health and cardiovascular wellness',
    icon: Heart,
    gradient: 'from-red-500 via-rose-500 to-pink-600',
    accent: 'red',
    rating: 4.9,
    available: true,
  },
  {
    type: 'dermatologist',
    name: 'Dr. Michael',
    specialty: 'Dermatologist',
    description: 'Skin conditions and cosmetic dermatology',
    icon: Sparkles,
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    accent: 'amber',
    rating: 4.7,
    available: true,
  },
  {
    type: 'pediatrician',
    name: 'Dr. Lily',
    specialty: 'Pediatrician',
    description: 'Children\'s health and development',
    icon: Baby,
    gradient: 'from-pink-500 via-pink-600 to-rose-500',
    accent: 'pink',
    rating: 4.9,
    available: true,
  },
  {
    type: 'neurologist',
    name: 'Dr. Nathan',
    specialty: 'Neurologist',
    description: 'Brain health and nervous system',
    icon: Activity,
    gradient: 'from-indigo-500 via-indigo-600 to-blue-600',
    accent: 'indigo',
    rating: 4.8,
    available: true,
  },
  {
    type: 'gynecologist',
    name: 'Dr. Maya',
    specialty: 'Gynecologist',
    description: 'Women\'s reproductive health',
    icon: User,
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    accent: 'rose',
    rating: 4.9,
    available: true,
  },
  {
    type: 'nutritionist',
    name: 'Dr. Sophie',
    specialty: 'Nutritionist',
    description: 'Dietary health and nutrition planning',
    icon: Apple,
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    accent: 'green',
    rating: 4.8,
    available: true,
  },
];

const Consultation = () => {
  const [currentStep, setCurrentStep] = useState<ConsultationStep>('selection');
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [sessionType, setSessionType] = useState<'scheduled' | 'emergency'>('scheduled');
  const [selectedDoctorType, setSelectedDoctorType] = useState<DoctorType>('general');
  const [hoveredDoctor, setHoveredDoctor] = useState<string | null>(null);

  const handleServiceSelection = (type: 'scheduled' | 'emergency') => {
    setSessionType(type);
    if (type === 'emergency') {
      setCurrentStep('emergency');
    } else {
      setCurrentStep('registration');
    }
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
    if (type === 'video') {
      setCurrentStep('video-call');
    }
  };

  const handleCallEnd = () => {
    setCurrentStep('completed');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'selection':
        return (
          <section className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-12">
                <motion.div 
                  className="text-center max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">AI-Powered Healthcare</span>
                  </motion.div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                    Meet Your AI
                    <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Healthcare Team
                    </span>
                  </h1>
                  
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Connect instantly with specialized AI doctors for personalized medical guidance. 
                    Available 24/7 with HD video consultations.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                    {[
                      { icon: Video, text: 'HD Video Call' },
                      { icon: Shield, text: 'HIPAA Compliant' },
                      { icon: Clock, text: 'Available 24/7' },
                      { icon: Star, text: '4.9 Rating' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50"
                      >
                        <item.icon className="w-4 h-4 text-primary" />
                        <span>{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-16">
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {DOCTORS.map((doctor, index) => (
                  <motion.div
                    key={doctor.type}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onMouseEnter={() => setHoveredDoctor(doctor.type)}
                    onMouseLeave={() => setHoveredDoctor(null)}
                  >
                    <Card 
                      className={cn(
                        "group relative h-full overflow-hidden cursor-pointer transition-all duration-500",
                        "border-2 border-transparent hover:border-primary/30",
                        "hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2",
                        hoveredDoctor === doctor.type && "scale-[1.02]"
                      )}
                      onClick={() => handleStartTavusConsultation(doctor.type)}
                    >
                      {/* Gradient Background */}
                      <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        `bg-gradient-to-br ${doctor.gradient}`
                      )} style={{ opacity: hoveredDoctor === doctor.type ? 0.05 : 0 }} />
                      
                      <CardContent className="relative p-6">
                        {/* Status Badge */}
                        <div className="flex justify-between items-start mb-4">
                          <motion.div 
                            className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center",
                              `bg-gradient-to-br ${doctor.gradient}`,
                              "shadow-lg"
                            )}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <doctor.icon className="w-7 h-7 text-white" />
                          </motion.div>
                          
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "bg-green-500/10 text-green-600 border-green-500/30",
                              "flex items-center gap-1"
                            )}
                          >
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Online
                          </Badge>
                        </div>

                        {/* Doctor Info */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-foreground mb-1">{doctor.name}</h3>
                          <p className="text-sm font-medium text-primary">{doctor.specialty}</p>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {doctor.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={cn(
                                  "w-3.5 h-3.5",
                                  i < Math.floor(doctor.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted"
                                )} 
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{doctor.rating}</span>
                        </div>

                        {/* CTA Button */}
                        <Button 
                          className={cn(
                            "w-full group/btn relative overflow-hidden",
                            `bg-gradient-to-r ${doctor.gradient}`,
                            "hover:shadow-lg transition-all duration-300"
                          )}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Start Consultation
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </span>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Additional Options */}
              <motion.div 
                className="mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="relative mb-10">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-sm text-muted-foreground bg-background">
                      Or explore other options
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {/* Schedule Consultation */}
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Card 
                      className="group cursor-pointer border-2 hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
                      onClick={() => handleServiceSelection('scheduled')}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardContent className="relative p-8">
                        <div className="flex items-start gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                            <Calendar className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">Schedule Consultation</h3>
                            <p className="text-muted-foreground mb-4">
                              Book a planned session with our AI counselor at your convenience
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {['50-min sessions', 'Follow-up care', 'Resources'].map((item) => (
                                <Badge key={item} variant="secondary" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Emergency Support */}
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Card 
                      className="group cursor-pointer border-2 border-red-500/20 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 overflow-hidden"
                      onClick={() => handleServiceSelection('emergency')}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardContent className="relative p-8">
                        <div className="flex items-start gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                            <AlertTriangle className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 text-red-600">Emergency Support</h3>
                            <p className="text-muted-foreground mb-4">
                              Get immediate help from our AI crisis counselor
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {['Available 24/7', 'Crisis trained', 'Instant connect'].map((item) => (
                                <Badge key={item} variant="secondary" className="text-xs bg-red-500/10 text-red-600 border-red-500/20">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                className="mt-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-sm text-muted-foreground mb-6">Trusted by thousands of patients worldwide</p>
                <div className="flex flex-wrap justify-center gap-8 items-center opacity-50">
                  {['10,000+ Consultations', 'HIPAA Compliant', '99.9% Uptime', '24/7 Support'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        );

      case 'registration':
        return (
          <section className="py-10 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Button variant="outline" onClick={() => setCurrentStep('selection')} className="mb-4">
                  ← Back
                </Button>
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
                <Button variant="outline" onClick={() => setCurrentStep('selection')} className="mb-4">
                  ← Back
                </Button>
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
                <Button variant="outline" onClick={() => setCurrentStep('registration')} className="mb-4">
                  ← Back
                </Button>
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
            <motion.div 
              className="max-w-lg mx-auto text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Session Complete</h2>
              <p className="text-muted-foreground mb-8">
                Thank you for your consultation. Take care of your health!
              </p>
              <Button 
                onClick={() => setCurrentStep('selection')}
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-500"
              >
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
      <main className="flex-grow pt-20">
        {renderStepContent()}
      </main>
      {currentStep === 'selection' && <Footer />}
    </div>
  );
};

export default Consultation;
