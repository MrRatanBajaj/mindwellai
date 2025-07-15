
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Phone, Video, MessageCircle, Clock, Heart, User } from "lucide-react";
import { toast } from "sonner";

interface EmergencyCounselingProps {
  onStartSession: (type: 'video' | 'chat', urgency: string) => void;
}

const EmergencyCounseling = ({ onStartSession }: EmergencyCounselingProps) => {
  const [urgencyLevel, setUrgencyLevel] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionType, setConnectionType] = useState<'video' | 'chat' | null>(null);

  const handleEmergencyCall = () => {
    window.open("tel:988", "_self");
  };

  const handleStartSession = async (type: 'video' | 'chat') => {
    if (!urgencyLevel) {
      toast.error("Please select urgency level");
      return;
    }

    setIsConnecting(true);
    setConnectionType(type);
    
    // Show connection progress
    toast.info(`Connecting you to an AI counselor...`, {
      description: type === 'video' ? 'Preparing digital avatar counselor' : 'Loading AI chat assistant'
    });
    
    // Simulate connection delay with progress updates
    setTimeout(() => {
      if (type === 'video') {
        toast.success("Digital avatar counselor ready!");
      } else {
        toast.success("AI chat counselor connected!");
      }
      setIsConnecting(false);
      setConnectionType(null);
      onStartSession(type, urgencyLevel);
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Crisis Warning */}
      <Card className="border-red-200 bg-red-50 animate-scale-in">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
            <CardTitle className="text-red-800">Crisis Support</CardTitle>
          </div>
          <CardDescription className="text-red-700">
            If you are in immediate danger or having thoughts of self-harm, please call emergency services or the crisis hotline immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleEmergencyCall}
              className="bg-red-600 hover:bg-red-700 text-white hover:scale-105 transition-all duration-200"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 988 (Crisis Lifeline)
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open("tel:911", "_self")}
              className="border-red-300 text-red-700 hover:bg-red-50 hover:scale-105 transition-all duration-200"
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergency 911
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency AI Counseling */}
      <Card className="animate-slide-in-right">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-mindwell-600" />
            <CardTitle>Emergency AI Counseling</CardTitle>
          </div>
          <CardDescription>
            Get immediate support from our AI counselor trained in crisis intervention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Urgency Level Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">How urgent is your situation?</label>
            <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">🔴 High - Need immediate support</SelectItem>
                <SelectItem value="medium">🟡 Medium - Struggling but safe</SelectItem>
                <SelectItem value="low">🟢 Low - Just need someone to talk to</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Session Type Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video Session Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-mindwell-200 hover:border-mindwell-400 group">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-mindwell-100 to-mindwell-200 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Video className="w-8 h-8 text-mindwell-600" />
                    </div>
                    {isConnecting && connectionType === 'video' && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">Video Session</h3>
                    <p className="text-sm text-slate-600 mb-2">Face-to-face with AI Avatar</p>
                    <div className="flex items-center justify-center space-x-1 text-xs text-mindwell-600">
                      <User className="w-3 h-3" />
                      <span>Digital Human Counselor</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Real-time facial expressions</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Voice interaction capability</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Empathetic AI responses</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleStartSession('video')}
                      disabled={!urgencyLevel || isConnecting}
                      className="w-full bg-mindwell-500 hover:bg-mindwell-600 group-hover:scale-105 transition-all duration-200"
                    >
                      {isConnecting && connectionType === 'video' ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Activating Avatar...
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4 mr-2" />
                          Start Video Session
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Session Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-blue-200 hover:border-blue-400 group">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <MessageCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    {isConnecting && connectionType === 'chat' && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">Chat Session</h3>
                    <p className="text-sm text-slate-600 mb-2">Text-based support</p>
                    <div className="flex items-center justify-center space-x-1 text-xs text-blue-600">
                      <MessageCircle className="w-3 h-3" />
                      <span>AI Mental Health Assistant</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Trained on therapy techniques</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Crisis intervention protocols</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>24/7 availability</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleStartSession('chat')}
                      disabled={!urgencyLevel || isConnecting}
                      variant="outline"
                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 group-hover:scale-105 transition-all duration-200"
                    >
                      {isConnecting && connectionType === 'chat' ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Loading AI Model...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Start Chat Session
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available 24/7 Notice */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-semibold">Available 24/7</span>
            </div>
            <p className="text-green-700 text-sm">
              Our AI counselors are available around the clock for immediate support. 
              Digital avatar technology provides human-like interaction with advanced emotional intelligence.
            </p>
          </div>

          {/* Connection Status */}
          {isConnecting && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <p className="text-blue-800 font-medium">
                    {connectionType === 'video' ? 'Initializing Digital Avatar...' : 'Loading AI Model...'}
                  </p>
                  <p className="text-blue-600 text-sm">
                    {connectionType === 'video' 
                      ? 'Setting up virtual counselor with facial expressions and voice' 
                      : 'Loading pre-trained mental health support model'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyCounseling;
