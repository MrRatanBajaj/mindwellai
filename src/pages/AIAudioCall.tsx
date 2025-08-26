import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AIAudioCall from '@/components/ui-custom/AIAudioCall';

const AIAudioCallPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCallEnd = () => {
    // Optionally navigate back or show a summary
    console.log('Call ended');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-2xl font-bold text-center flex items-center gap-2">
            <Phone className="h-6 w-6 text-primary" />
            AI Audio Counseling
          </h1>
          
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Description */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="text-lg text-muted-foreground mb-4">
            Connect with our AI counselor through voice conversation. 
            Experience natural, empathetic support through advanced voice AI technology.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              What to expect:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Natural voice conversation with AI counselor</li>
              <li>• Real-time emotional support and guidance</li>
              <li>• Private and confidential session</li>
              <li>• Available 24/7 whenever you need support</li>
            </ul>
          </div>
        </div>

        {/* Audio Call Component */}
        <div className="flex justify-center">
          <AIAudioCall onCallEnd={handleCallEnd} />
        </div>

        {/* Additional Information */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-3 text-green-700 dark:text-green-400">
                Benefits of Voice Therapy
              </h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• More natural and expressive communication</li>
                <li>• Enhanced emotional connection</li>
                <li>• Immediate response and support</li>
                <li>• Helps practice verbal expression of feelings</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-3 text-purple-700 dark:text-purple-400">
                Privacy & Safety
              </h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Your conversations are not stored</li>
                <li>• End-to-end encrypted communication</li>
                <li>• No recording or data retention</li>
                <li>• Professional counseling backup available</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200 text-center">
            <strong>Crisis Support:</strong> If you're experiencing thoughts of self-harm or suicide, 
            please contact emergency services immediately or call a crisis helpline.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAudioCallPage;