
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
import { Calendar, Shield, Video, MessageCircle, Clock, Heart, AlertTriangle, CheckCircle, Stethoscope, User, Brain } from "lucide-react";

type ConsultationStep = 'selection' | 'registration' | 'emergency' | 'scheduling' | 'video-call' | 'tavus-video' | 'completed';
type DoctorType = 'general' | 'dermatologist' | 'mental_health';

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
    // Chat is handled by the existing MentalHealthChat component
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
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6 animate-fade-in">
                  Choose Your Service
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance animate-fade-in">
                  How Can We Help You Today?
                </h1>
                <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto text-balance animate-fade-in">
                  Select the type of support you need. We offer both scheduled consultations and immediate emergency support.
                </p>
              </div>

              {/* AI Video Consultation Options */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-center mb-6">AI Video Consultation</h2>
                <p className="text-center text-muted-foreground mb-8">Talk face-to-face with our AI healthcare professionals</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* General Physician */}
                  <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer group animate-fade-in">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                        <Stethoscope className="w-8 h-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl mb-1">Dr. Sarah</CardTitle>
                      <CardDescription>General Physician</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 text-center">
                        General health consultations, symptom assessment, and wellness guidance
                      </p>
                      <Button 
                        onClick={() => handleStartTavusConsultation('general')}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Start Video Call
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Dermatologist */}
                  <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 cursor-pointer group animate-fade-in">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                        <User className="w-8 h-8 text-green-600" />
                      </div>
                      <CardTitle className="text-xl mb-1">Dr. Michael</CardTitle>
                      <CardDescription>Dermatologist</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 text-center">
                        Skin conditions, hair issues, and cosmetic dermatology advice
                      </p>
                      <Button 
                        onClick={() => handleStartTavusConsultation('dermatologist')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Start Video Call
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Mental Health */}
                  <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 cursor-pointer group animate-fade-in">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                        <Brain className="w-8 h-8 text-purple-600" />
                      </div>
                      <CardTitle className="text-xl mb-1">Dr. Emma</CardTitle>
                      <CardDescription>Mental Health Counselor</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 text-center">
                        Anxiety, stress, depression support and emotional well-being
                      </p>
                      <Button 
                        onClick={() => handleStartTavusConsultation('mental_health')}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Start Video Call
                      </Button>
                    </CardContent>
                  </Card>
                </div>
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Scheduled Consultation */}
                <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-mindwell-200 cursor-pointer group animate-fade-in">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 bg-mindwell-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-mindwell-200 transition-colors">
                      <Calendar className="w-10 h-10 text-mindwell-600" />
                    </div>
                    <CardTitle className="text-2xl mb-2">Schedule Consultation</CardTitle>
                    <CardDescription className="text-base">
                      Book a planned session with our AI counselor at your convenience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Complete registration and assessment</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Choose your preferred time slot</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Structured 50-minute sessions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Follow-up care and resources</span>
                      </div>
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

                {/* Emergency Counseling */}
                <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200 cursor-pointer group animate-fade-in">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                      <AlertTriangle className="w-10 h-10 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl mb-2 text-red-800">Emergency Support</CardTitle>
                    <CardDescription className="text-base">
                      Get immediate help from our AI crisis counselor
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Available 24/7 instantly</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Crisis intervention trained AI</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Video or chat support options</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Connect to human support if needed</span>
                      </div>
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
              </div>

              {/* Features Overview */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center animate-fade-in">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Secure & Private</h3>
                  <p className="text-slate-600 text-sm">End-to-end encrypted sessions with complete confidentiality</p>
                </div>
                <div className="text-center animate-fade-in">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">AI Avatar Counselor</h3>
                  <p className="text-slate-600 text-sm">Interact with lifelike AI counselors trained in mental health</p>
                </div>
                <div className="text-center animate-fade-in">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Personalized Care</h3>
                  <p className="text-slate-600 text-sm">Tailored therapy approaches based on your unique needs</p>
                </div>
              </div>
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
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Session Completed</h1>
              <p className="text-slate-600 mb-8">
                Thank you for using our counseling services. Remember that support is always available when you need it.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => setCurrentStep('selection')}
                  className="bg-mindwell-500 hover:bg-mindwell-600 mr-4"
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
        <section className="pt-32 pb-10 px-6 bg-gradient-to-br from-mindwell-50 to-blue-50">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-white/80 text-mindwell-700 font-medium text-xs mb-6 animate-fade-in">
              MindwellAI Counseling Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance animate-fade-in">
              Professional Mental Health Support
            </h1>
            <p className="text-slate-600 text-xl mb-8 max-w-3xl mx-auto text-balance animate-fade-in">
              Connect with AI counselors trained in evidence-based therapy techniques. Get the support you need, when you need it.
            </p>
          </div>
        </section>
      )}

      {renderStepContent()}
      
      {/* Live AI Chat Component - Only show when not in video call */}
      {!isVideoSession && <MentalHealthChat />}
      
      {!isVideoSession && <Footer />}
    </div>
  );
};

export default Consultation;
