import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConsultationForm from "@/components/ui-custom/ConsultationForm";
import RegistrationForm from "@/components/ui-custom/RegistrationForm";
import EmergencyCounseling from "@/components/ui-custom/EmergencyCounseling";
import VideoCallSession from "@/components/ui-custom/VideoCallSession";
import TavusVideoConsultation from "@/components/ui-custom/TavusVideoConsultation";
import MentalHealthChat from "@/components/ui-custom/MentalHealthChat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Shield, Video, MessageCircle, Clock, Heart, AlertTriangle, CheckCircle, Stethoscope, User, Brain, Activity, Baby, Apple, Sparkles } from "lucide-react";
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
  color: string;
  bgColor: string;
  hoverBorder: string;
}

const DOCTORS: DoctorCardInfo[] = [
  {
    type: 'general',
    name: 'Dr. Sarah',
    specialty: 'General Physician',
    description: 'General health consultations, symptom assessment, and wellness guidance',
    icon: Stethoscope,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    hoverBorder: 'hover:border-blue-300',
  },
  {
    type: 'mental_health',
    name: 'Dr. Emma',
    specialty: 'Mental Health Counselor',
    description: 'Anxiety, stress, depression support and emotional well-being',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    hoverBorder: 'hover:border-purple-300',
  },
  {
    type: 'cardiologist',
    name: 'Dr. James',
    specialty: 'Cardiologist',
    description: 'Heart health, blood pressure, and cardiovascular wellness',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    hoverBorder: 'hover:border-red-300',
  },
  {
    type: 'dermatologist',
    name: 'Dr. Michael',
    specialty: 'Dermatologist',
    description: 'Skin conditions, hair issues, and cosmetic dermatology advice',
    icon: Sparkles,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    hoverBorder: 'hover:border-amber-300',
  },
  {
    type: 'pediatrician',
    name: 'Dr. Lily',
    specialty: 'Pediatrician',
    description: 'Children\'s health, development milestones, and pediatric care',
    icon: Baby,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    hoverBorder: 'hover:border-pink-300',
  },
  {
    type: 'neurologist',
    name: 'Dr. Nathan',
    specialty: 'Neurologist',
    description: 'Brain health, headaches, memory, and nervous system issues',
    icon: Activity,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    hoverBorder: 'hover:border-indigo-300',
  },
  {
    type: 'gynecologist',
    name: 'Dr. Maya',
    specialty: 'Gynecologist',
    description: 'Women\'s reproductive health and wellness consultations',
    icon: User,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
    hoverBorder: 'hover:border-rose-300',
  },
  {
    type: 'nutritionist',
    name: 'Dr. Sophie',
    specialty: 'Nutritionist',
    description: 'Dietary health, weight management, and nutrition planning',
    icon: Apple,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    hoverBorder: 'hover:border-green-300',
  },
];

const Consultation = () => {
  const [currentStep, setCurrentStep] = useState<ConsultationStep>('selection');
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [sessionType, setSessionType] = useState<'scheduled' | 'emergency'>('scheduled');
  const [selectedDoctorType, setSelectedDoctorType] = useState<DoctorType>('general');

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

  const handleSchedulingComplete = () => {
    setCurrentStep('completed');
  };

  const handleCallEnd = () => {
    setCurrentStep('completed');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'selection':
        return (
          <section className="py-10 px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-sm mb-6">
                  <Video className="w-4 h-4" />
                  AI Video Consultation
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                  Choose Your AI Doctor
                </h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto text-balance">
                  Talk face-to-face with our AI healthcare professionals. Select a specialist based on your health concerns.
                </p>
              </motion.div>

              {/* AI Doctors Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {DOCTORS.map((doctor, index) => (
                  <motion.div
                    key={doctor.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={cn(
                        "h-full hover:shadow-xl transition-all duration-300 border-2 cursor-pointer group",
                        doctor.hoverBorder
                      )}
                      onClick={() => handleStartTavusConsultation(doctor.type)}
                    >
                      <CardHeader className="text-center pb-3">
                        <motion.div 
                          className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300",
                            doctor.bgColor,
                            "group-hover:scale-110"
                          )}
                          whileHover={{ rotate: 5 }}
                        >
                          <doctor.icon className={cn("w-8 h-8", doctor.color)} />
                        </motion.div>
                        <CardTitle className="text-lg mb-1">{doctor.name}</CardTitle>
                        <CardDescription className="text-sm font-medium">{doctor.specialty}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4 text-center line-clamp-2">
                          {doctor.description}
                        </p>
                        <Button 
                          className={cn(
                            "w-full",
                            doctor.type === 'general' && "bg-blue-600 hover:bg-blue-700",
                            doctor.type === 'mental_health' && "bg-purple-600 hover:bg-purple-700",
                            doctor.type === 'cardiologist' && "bg-red-600 hover:bg-red-700",
                            doctor.type === 'dermatologist' && "bg-amber-600 hover:bg-amber-700",
                            doctor.type === 'pediatrician' && "bg-pink-600 hover:bg-pink-700",
                            doctor.type === 'neurologist' && "bg-indigo-600 hover:bg-indigo-700",
                            doctor.type === 'gynecologist' && "bg-rose-600 hover:bg-rose-700",
                            doctor.type === 'nutritionist' && "bg-green-600 hover:bg-green-700",
                          )}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Start Call
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <div className="relative my-12">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground">Or choose another option</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Scheduled Consultation */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-mindwell-200 cursor-pointer group">
                    <CardHeader className="text-center pb-4">
                      <motion.div 
                        className="w-20 h-20 bg-mindwell-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-mindwell-200 transition-colors"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                      >
                        <Calendar className="w-10 h-10 text-mindwell-600" />
                      </motion.div>
                      <CardTitle className="text-2xl mb-2">Schedule Consultation</CardTitle>
                      <CardDescription className="text-base">
                        Book a planned session with our AI counselor at your convenience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {[
                          'Complete registration and assessment',
                          'Choose your preferred time slot',
                          'Structured 50-minute sessions',
                          'Follow-up care and resources'
                        ].map((item, i) => (
                          <div key={i} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={() => handleServiceSelection('scheduled')}
                        className="w-full bg-mindwell-500 hover:bg-mindwell-600 text-white py-3 mt-6"
                        size="lg"
                      >
                        Schedule Consultation
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Emergency Counseling */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200 cursor-pointer group">
                    <CardHeader className="text-center pb-4">
                      <motion.div 
                        className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors"
                        whileHover={{ scale: 1.05, rotate: -5 }}
                      >
                        <AlertTriangle className="w-10 h-10 text-red-600" />
                      </motion.div>
                      <CardTitle className="text-2xl mb-2 text-red-800">Emergency Support</CardTitle>
                      <CardDescription className="text-base">
                        Get immediate help from our AI crisis counselor
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {[
                          'Available 24/7 instantly',
                          'Crisis intervention trained AI',
                          'Video or chat support options',
                          'Connect to human support if needed'
                        ].map((item, i) => (
                          <div key={i} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={() => handleServiceSelection('emergency')}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 mt-6"
                        size="lg"
                      >
                        Get Emergency Help
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Features Overview */}
              <motion.div 
                className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  { icon: Shield, color: 'bg-blue-100', iconColor: 'text-blue-600', title: 'Secure & Private', desc: 'End-to-end encrypted sessions with complete confidentiality' },
                  { icon: Video, color: 'bg-green-100', iconColor: 'text-green-600', title: 'AI Avatar Counselor', desc: 'Interact with lifelike AI counselors trained in healthcare' },
                  { icon: Heart, color: 'bg-purple-100', iconColor: 'text-purple-600', title: 'Personalized Care', desc: 'Tailored approaches based on your unique health needs' },
                ].map((feature, i) => (
                  <div key={i} className="text-center">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4", feature.color)}>
                      <feature.icon className={cn("w-6 h-6", feature.iconColor)} />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>
        );

      case 'registration':
        return (
          <section className="py-10 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('selection')}
                  className="mb-4"
                >
                  ← Back to Service Selection
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
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('selection')}
                  className="mb-4"
                >
                  ← Back to Service Selection
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
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('registration')}
                  className="mb-4"
                >
                  ← Back to Registration
                </Button>
              </div>
              <div className="glass-panel rounded-xl p-6 md:p-10 shadow-lg animate-fade-in">
                <ConsultationForm />
              </div>
            </div>
          </section>
        );

      case 'video-call':
        return <VideoCallSession onEndCall={handleCallEnd} />;

      case 'tavus-video':
        return <TavusVideoConsultation doctorType={selectedDoctorType} onEndCall={handleCallEnd} />;

      case 'completed':
        return (
          <section className="py-20 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-4">Session Completed</h1>
              <p className="text-muted-foreground mb-8">
                Thank you for using our consultation services. Remember that support is always available when you need it.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  onClick={() => setCurrentStep('selection')}
                  className="bg-mindwell-500 hover:bg-mindwell-600"
                >
                  Book Another Session
                </Button>
                <Button variant="outline">
                  View Resources
                </Button>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const isVideoSession = currentStep === 'video-call' || currentStep === 'tavus-video';

  return (
    <div className="min-h-screen flex flex-col">
      {!isVideoSession && <Header />}
      
      {currentStep === 'selection' && (
        <section className="pt-24 pb-10 px-6 bg-gradient-to-b from-mindwell-50/50 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              AI Healthcare Consultation
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg"
            >
              Get instant medical guidance from our AI-powered healthcare specialists
            </motion.p>
          </div>
        </section>
      )}
      
      <main className="flex-1">
        {renderStepContent()}
      </main>
      
      {!isVideoSession && <Footer />}
    </div>
  );
};

export default Consultation;
