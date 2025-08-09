import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmergencyCounseling from '@/components/ui-custom/EmergencyCounseling';
import VideoCallManager from '@/components/ui-custom/VideoCallManager';
import EmergencyAIChat from '@/components/ui-custom/EmergencyAIChat';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Emergency = () => {
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState<'none' | 'video' | 'chat'>('none');
  const [sessionConfig, setSessionConfig] = useState<{
    urgency: string;
    counselorId: string;
  }>({ urgency: '', counselorId: 'emma' });

  const handleStartSession = (type: 'video' | 'chat', urgency: string) => {
    const counselorId = urgency === 'high' ? 'marcus' : 'emma'; // Marcus for crisis, Emma for general
    
    setSessionConfig({ urgency, counselorId });
    setCurrentSession(type);
  };

  const handleEndSession = () => {
    setCurrentSession('none');
    setSessionConfig({ urgency: '', counselorId: 'emma' });
  };

  // Render active session
  if (currentSession === 'video') {
    return (
      <VideoCallManager
        counselorName={sessionConfig.counselorId === 'marcus' ? 'Dr. Marcus Chen' : 'Dr. Emma Rodriguez'}
        urgencyLevel={sessionConfig.urgency}
        onEndCall={handleEndSession}
        onAIResponse={(response) => {
          console.log('AI Response:', response);
        }}
      />
    );
  }

  if (currentSession === 'chat') {
    return (
      <EmergencyAIChat
        urgencyLevel={sessionConfig.urgency}
        counselorId={sessionConfig.counselorId}
        onEndSession={handleEndSession}
      />
    );
  }

  // Default emergency page
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