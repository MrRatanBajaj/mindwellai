
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Phone, Video, MessageCircle, Clock, Heart } from "lucide-react";
import { toast } from "sonner";

interface EmergencyCounselingProps {
  onStartSession: (type: 'video' | 'chat', urgency: string) => void;
}

const EmergencyCounseling = ({ onStartSession }: EmergencyCounselingProps) => {
  const [urgencyLevel, setUrgencyLevel] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleEmergencyCall = () => {
    window.open("tel:988", "_self"); // National Suicide Prevention Lifeline
  };

  const handleStartSession = async (type: 'video' | 'chat') => {
    if (!urgencyLevel) {
      toast.error("Please select urgency level");
      return;
    }

    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      onStartSession(type, urgencyLevel);
      toast.success(`Connecting you to an AI counselor via ${type}...`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Crisis Warning */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
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
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 988 (Crisis Lifeline)
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open("tel:911", "_self")}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergency 911
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency AI Counseling */}
      <Card>
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
                <SelectItem value="high">High - Need immediate support</SelectItem>
                <SelectItem value="medium">Medium - Struggling but safe</SelectItem>
                <SelectItem value="low">Low - Just need someone to talk to</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Session Type Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-mindwell-200">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-mindwell-100 rounded-full flex items-center justify-center mx-auto">
                    <Video className="w-6 h-6 text-mindwell-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Video Session</h3>
                    <p className="text-sm text-slate-600">Face-to-face with AI Avatar</p>
                  </div>
                  <Button
                    onClick={() => handleStartSession('video')}
                    disabled={!urgencyLevel || isConnecting}
                    className="w-full bg-mindwell-500 hover:bg-mindwell-600"
                  >
                    {isConnecting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Start Video Session"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow border-mindwell-200">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Chat Session</h3>
                    <p className="text-sm text-slate-600">Text-based support</p>
                  </div>
                  <Button
                    onClick={() => handleStartSession('chat')}
                    disabled={!urgencyLevel || isConnecting}
                    variant="outline"
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    {isConnecting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Start Chat Session"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available 24/7 Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-semibold">Available 24/7</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Our AI counselors are available around the clock for immediate support
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyCounseling;
