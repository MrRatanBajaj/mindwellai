
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Video, VideoOff, Mic, MicOff, Phone, MessageCircle, 
  Settings, Volume2, VolumeX, Monitor, MoreHorizontal 
} from "lucide-react";
import { toast } from "sonner";

interface VideoCallSessionProps {
  counselorName?: string;
  urgencyLevel?: string;
  onEndCall: () => void;
}

const VideoCallSession = ({ 
  counselorName = "Dr. Aria", 
  urgencyLevel = "medium",
  onEndCall 
}: VideoCallSessionProps) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    toast.success("Session ended. Take care of yourself!");
    onEndCall();
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast.info(isVideoOn ? "Camera turned off" : "Camera turned on");
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast.info(isAudioOn ? "Microphone muted" : "Microphone unmuted");
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast.info(isSpeakerOn ? "Speaker muted" : "Speaker unmuted");
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast.info(isScreenSharing ? "Screen sharing stopped" : "Screen sharing started");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast.info(isRecording ? "Recording stopped" : "Recording started");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <h2 className="text-white font-semibold">Emergency Counseling Session</h2>
            <p className="text-slate-300 text-sm">with {counselorName} • {formatDuration(callDuration)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {urgencyLevel === 'high' && (
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
              High Priority
            </span>
          )}
          {isRecording && (
            <div className="flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded text-xs">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Recording
            </div>
          )}
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 h-full">
          {/* AI Counselor Video */}
          <Card className="relative overflow-hidden bg-slate-800 border-slate-700">
            <CardContent className="p-0 h-full min-h-[400px]">
              <div className="relative h-full bg-gradient-to-br from-mindwell-600 to-mindwell-800 flex items-center justify-center">
                {/* AI Avatar Placeholder */}
                <div className="text-center text-white">
                  <div className="w-32 h-32 rounded-full bg-mindwell-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-4xl">👩‍⚕️</span>
                  </div>
                  <h3 className="text-xl font-semibold">{counselorName}</h3>
                  <p className="text-mindwell-200">AI Mental Health Counselor</p>
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-mindwell-200">Speaking...</span>
                  </div>
                </div>
                
                {/* Corner Label */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  AI Counselor
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Video */}
          <Card className="relative overflow-hidden bg-slate-800 border-slate-700">
            <CardContent className="p-0 h-full min-h-[400px]">
              <div className="relative h-full bg-slate-700 flex items-center justify-center">
                {isVideoOn ? (
                  <div className="text-center text-white">
                    <div className="w-24 h-24 rounded-full bg-slate-600 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👤</span>
                    </div>
                    <p className="text-slate-300">Your Video</p>
                  </div>
                ) : (
                  <div className="text-center text-slate-400">
                    <VideoOff className="w-16 h-16 mx-auto mb-4" />
                    <p>Camera is off</p>
                  </div>
                )}
                
                {/* Corner Label */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  You
                </div>
                
                {/* Audio indicator */}
                {!isAudioOn && (
                  <div className="absolute bottom-4 left-4 bg-red-600 text-white p-2 rounded-full">
                    <MicOff className="w-4 h-4" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800 p-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Video Toggle */}
          <Button
            onClick={toggleVideo}
            variant={isVideoOn ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          {/* Audio Toggle */}
          <Button
            onClick={toggleAudio}
            variant={isAudioOn ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          {/* Speaker Toggle */}
          <Button
            onClick={toggleSpeaker}
            variant={isSpeakerOn ? "default" : "secondary"}
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>

          {/* Screen Share */}
          <Button
            onClick={toggleScreenShare}
            variant={isScreenSharing ? "default" : "secondary"}
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            <Monitor className="w-5 h-5" />
          </Button>

          {/* Chat */}
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>

          {/* Record */}
          <Button
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "secondary"}
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white' : 'bg-red-500'}`} />
          </Button>

          {/* Settings */}
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* End Call */}
          <Button
            onClick={handleEndCall}
            variant="destructive"
            size="lg"
            className="rounded-full w-14 h-14 p-0 bg-red-600 hover:bg-red-700"
          >
            <Phone className="w-6 h-6" />
          </Button>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-center space-x-6 mt-4 text-slate-400 text-sm">
          <span>Session Time: {formatDuration(callDuration)}</span>
          <span>•</span>
          <span>Secure Connection</span>
          <span>•</span>
          <span>End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCallSession;
