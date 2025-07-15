
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Video, VideoOff, Mic, MicOff, Phone, MessageCircle, 
  Settings, Volume2, VolumeX, Monitor, MoreHorizontal, 
  User, Brain, Heart, Smile
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
  const [avatarMood, setAvatarMood] = useState<'listening' | 'speaking' | 'thinking' | 'empathetic'>('listening');
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate avatar behavior
  useEffect(() => {
    const avatarBehavior = setInterval(() => {
      const moods: Array<'listening' | 'speaking' | 'thinking' | 'empathetic'> = 
        ['listening', 'speaking', 'thinking', 'empathetic'];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      setAvatarMood(randomMood);
      setIsAvatarSpeaking(randomMood === 'speaking');
    }, 4000);

    return () => clearInterval(avatarBehavior);
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

  const getAvatarExpression = () => {
    switch (avatarMood) {
      case 'speaking':
        return { emoji: '👩‍⚕️', expression: 'Speaking...', color: 'text-blue-400' };
      case 'listening':
        return { emoji: '👂', expression: 'Listening attentively', color: 'text-green-400' };
      case 'thinking':
        return { emoji: '🤔', expression: 'Processing your thoughts', color: 'text-yellow-400' };
      case 'empathetic':
        return { emoji: '💝', expression: 'Understanding your feelings', color: 'text-pink-400' };
      default:
        return { emoji: '👩‍⚕️', expression: 'Ready to help', color: 'text-mindwell-400' };
    }
  };

  const avatarData = getAvatarExpression();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
          <div>
            <h2 className="text-white font-semibold">Emergency Counseling Session</h2>
            <p className="text-slate-300 text-sm">with {counselorName} • {formatDuration(callDuration)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {urgencyLevel === 'high' && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
              High Priority
            </span>
          )}
          {isRecording && (
            <div className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded-full text-xs animate-fade-in">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Recording
            </div>
          )}
          <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            🔒 Encrypted
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-full">
          {/* AI Counselor Video - Enhanced Digital Avatar */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 shadow-2xl">
            <CardContent className="p-0 h-full min-h-[400px]">
              <div className="relative h-full bg-gradient-to-br from-mindwell-600 via-mindwell-700 to-mindwell-800 flex items-center justify-center">
                {/* Digital Avatar */}
                <div className="text-center text-white relative">
                  {/* Avatar Container with Animation */}
                  <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-mindwell-400 to-mindwell-600 flex items-center justify-center mx-auto mb-6 shadow-2xl transform transition-all duration-500 hover:scale-105">
                    <span className="text-6xl animate-bounce">{avatarData.emoji}</span>
                    
                    {/* Breathing Animation Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-white/30 animate-pulse"></div>
                  </div>

                  {/* Counselor Info */}
                  <h3 className="text-2xl font-bold mb-2">{counselorName}</h3>
                  <p className="text-mindwell-200 mb-4">AI Mental Health Counselor</p>
                  
                  {/* Avatar Status */}
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${isAvatarSpeaking ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                    <span className={`text-sm ${avatarData.color} font-medium`}>
                      {avatarData.expression}
                    </span>
                  </div>

                  {/* AI Capabilities */}
                  <div className="grid grid-cols-3 gap-4 text-xs text-mindwell-200">
                    <div className="flex flex-col items-center space-y-1">
                      <Brain className="w-5 h-5 text-blue-400" />
                      <span>AI Brain</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <Heart className="w-5 h-5 text-red-400" />
                      <span>Empathy</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <Smile className="w-5 h-5 text-yellow-400" />
                      <span>Support</span>
                    </div>
                  </div>
                </div>
                
                {/* Corner Label */}
                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                  🤖 AI Counselor
                </div>

                {/* Voice Visualization */}
                {isAvatarSpeaking && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white rounded-full animate-bounce"
                        style={{
                          height: `${Math.random() * 20 + 10}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Video */}
          <Card className="relative overflow-hidden bg-slate-800 border-slate-600 shadow-2xl">
            <CardContent className="p-0 h-full min-h-[400px]">
              <div className="relative h-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                {isVideoOn ? (
                  <div className="text-center text-white">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <User className="w-16 h-16 text-slate-300" />
                    </div>
                    <p className="text-slate-300">Your Video</p>
                    <p className="text-slate-400 text-sm mt-2">Looking good! 😊</p>
                  </div>
                ) : (
                  <div className="text-center text-slate-400">
                    <div className="w-24 h-24 rounded-full bg-slate-600 flex items-center justify-center mx-auto mb-4">
                      <VideoOff className="w-12 h-12" />
                    </div>
                    <p className="text-lg">Camera is off</p>
                    <p className="text-sm text-slate-500">Your privacy is protected</p>
                  </div>
                )}
                
                {/* Corner Label */}
                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                  👤 You
                </div>
                
                {/* Audio indicator */}
                {!isAudioOn && (
                  <div className="absolute bottom-4 left-4 bg-red-600 text-white p-3 rounded-full shadow-lg animate-pulse">
                    <MicOff className="w-5 h-5" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 shadow-2xl">
        <div className="flex items-center justify-center space-x-4">
          {/* Video Toggle */}
          <Button
            onClick={toggleVideo}
            variant={isVideoOn ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-all duration-200"
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          {/* Audio Toggle */}
          <Button
            onClick={toggleAudio}
            variant={isAudioOn ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-all duration-200"
          >
            {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>

          {/* Speaker Toggle */}
          <Button
            onClick={toggleSpeaker}
            variant={isSpeakerOn ? "default" : "secondary"}
            size="lg"
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-all duration-200"
          >
            {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </Button>

          {/* Screen Share */}
          <Button
            onClick={toggleScreenShare}
            variant={isScreenSharing ? "default" : "secondary"}
            size="lg"
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-all duration-200"
          >
            <Monitor className="w-6 h-6" />
          </Button>

          {/* Chat */}
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-all duration-200"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>

          {/* Record */}
          <Button
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "secondary"}
            size="lg"
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-all duration-200"
          >
            <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-red-500'}`} />
          </Button>

          {/* Settings */}
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-all duration-200"
          >
            <Settings className="w-6 h-6" />
          </Button>

          {/* End Call */}
          <Button
            onClick={handleEndCall}
            variant="destructive"
            size="lg"
            className="rounded-full w-16 h-16 p-0 bg-red-600 hover:bg-red-700 shadow-lg hover:scale-110 transition-all duration-200"
          >
            <Phone className="w-7 h-7" />
          </Button>
        </div>

        {/* Session Info */}
        <div className="flex items-center justify-center space-x-6 mt-6 text-slate-300 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Session Time: {formatDuration(callDuration)}</span>
          </div>
          <span>•</span>
          <span>🔐 Secure Connection</span>
          <span>•</span>
          <span>🤖 AI Avatar Active</span>
          <span>•</span>
          <span>End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCallSession;
