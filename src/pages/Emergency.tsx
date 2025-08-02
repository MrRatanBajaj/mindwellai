import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmergencyCounseling from '@/components/ui-custom/EmergencyCounseling';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Emergency = () => {
  const navigate = useNavigate();

  const handleStartSession = (type: 'video' | 'chat', urgency: string) => {
    if (type === 'video') {
      // Navigate to AI Video Call with emergency context
      navigate('/ai-therapist', { 
        state: { 
          mode: 'emergency-video', 
          urgency,
          counselorId: urgency === 'crisis' ? 'marcus' : 'emma' // Marcus for trauma/crisis, Emma for general
        } 
      });
    } else {
      // Navigate to AI Chat with emergency context
      navigate('/ai-therapist', { 
        state: { 
          mode: 'emergency-chat', 
          urgency,
          counselorId: urgency === 'crisis' ? 'marcus' : 'emma'
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Emergency Support</h1>
            <p className="text-xl text-muted-foreground">
              Immediate crisis intervention and mental health support
            </p>
          </div>
          
          <EmergencyCounseling onStartSession={handleStartSession} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Emergency;