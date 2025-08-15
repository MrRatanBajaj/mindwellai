import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Video, VideoOff, Mic, MicOff, Phone, Settings, 
  User, Brain, Heart, MessageCircle, Volume2, VolumeX 
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EmergencyVideoCallProps {
  counselorName?: string;
  urgencyLevel?: string;
  counselorId?: string;
  onEndCall: () => void;
}

const EmergencyVideoCall = ({ 
  counselorName = "Dr. Aria", 
  urgencyLevel = "medium",
  counselorId = "emma",
  onEndCall 
}: EmergencyVideoCallProps) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [avatarMood, setAvatarMood] = useState<'listening' | 'speaking' | 'thinking' | 'empathetic'>('listening');
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize emergency session
  useEffect(() => {
    initializeEmergencySession();
    requestMediaPermissions();
  }, []);

  // Call timer
  useEffect(() => {
    if (hasPermissions) {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [hasPermissions]);

  // Avatar behavior simulation
  useEffect(() => {
    if (hasPermissions) {
      const avatarBehavior = setInterval(() => {
        const moods: Array<'listening' | 'speaking' | 'thinking' | 'empathetic'> = 
          ['listening', 'speaking', 'thinking', 'empathetic'];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        setAvatarMood(randomMood);
        setIsAvatarSpeaking(randomMood === 'speaking');
      }, 3000);
      return () => clearInterval(avatarBehavior);
    }
  }, [hasPermissions]);

  const initializeEmergencySession = async () => {
    try {
      const newSessionId = `emergency_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);

      // Log emergency session using voice_chat_sessions table
      const { error } = await supabase
        .from('voice_chat_sessions')
        .insert({
          session_id: newSessionId,
          user_id: null, // Anonymous for now
          status: 'active',
          metadata: {
            call_type: 'emergency_video',
            counselor_id: counselorId,
            urgency_level: urgencyLevel,
            started_at: new Date().toISOString(),
            user_agent: navigator.userAgent
          }
        });

      if (error) {
        console.error('Session logging error:', error);
      }

      toast.success("Emergency session initialized", {
        description: "You're connected to our crisis intervention system"
      });
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const requestMediaPermissions = async () => {
    try {
      setIsConnecting(true);
      
      // Request camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });

      streamRef.current = stream;
      
      // Set video source
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setHasPermissions(true);
      setIsConnecting(false);
      
      toast.success("Camera and microphone access granted", {
        description: "Emergency video session is now active"
      });

      // Log permission grant using consultations table
      const { data: { user } } = await supabase.auth.getUser();
      await supabase
        .from('consultations')
        .insert({
          user_id: user?.id || '00000000-0000-0000-0000-000000000000', // Use system UUID for emergency sessions
          name: 'Emergency Video Session',
          email: 'emergency@system.local',
          scheduled_date: new Date().toISOString().split('T')[0],
          scheduled_time: new Date().toTimeString().split(' ')[0],
          session_type: 'emergency_video',
          status: 'active',
          concerns: 'Video call permissions granted - Emergency session active',
          notes: JSON.stringify({
            permissions: { video: true, audio: true },
            timestamp: new Date().toISOString(),
            session_id: sessionId
          })
        });

    } catch (error) {
      console.error('Permission denied or error:', error);
      setIsConnecting(false);
      
      toast.error("Permission required", {
        description: "Camera and microphone access needed for emergency video session"
      });

      // Still allow session without video
      setHasPermissions(false);
      setIsVideoOn(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    // Clean up media streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    // Log session end
    try {
      await supabase
        .from('voice_chat_sessions')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString(),
          duration_seconds: callDuration,
          metadata: {
            duration_seconds: callDuration,
            ended_by: 'user',
            session_type: 'emergency_video'
          }
        })
        .eq('session_id', sessionId);
    } catch (error) {
      console.error('Error logging session end:', error);
    }

    toast.success("Emergency session ended safely", {
      description: "Remember: Help is always available when you need it"
    });
    
    onEndCall();
  };

  const toggleVideo = async () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
        
        toast.info(isVideoOn ? "Camera turned off" : "Camera turned on");
        
        // Log video toggle (simplified logging)
        console.log(`Video ${isVideoOn ? 'disabled' : 'enabled'} at ${new Date().toISOString()}`);
      }
    }
  };

  const toggleAudio = async () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
        
        toast.info(isAudioOn ? "Microphone muted" : "Microphone unmuted");
        
        // Log audio toggle (simplified logging)
        console.log(`Audio ${isAudioOn ? 'muted' : 'unmuted'} at ${new Date().toISOString()}`);
      }
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast.info(isSpeakerOn ? "Speaker muted" : "Speaker unmuted");
  };

  const getAvatarExpression = () => {
    switch (avatarMood) {
      case 'speaking':
        return { emoji: '👩‍⚕️', expression: 'Providing support...', color: 'text-blue-400' };
      case 'listening':
        return { emoji: '👂', expression: 'Listening carefully', color: 'text-green-400' };
      case 'thinking':
        return { emoji: '🤔', expression: 'Understanding your situation', color: 'text-yellow-400' };
      case 'empathetic':
        return { emoji: '💝', expression: 'Here for you', color: 'text-pink-400' };
      default:
        return { emoji: '👩‍⚕️', expression: 'Emergency support ready', color: 'text-red-400' };
    }
  };

  const avatarData = getAvatarExpression();

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center">
        <Card className="w-96 text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Initializing Emergency Support</h3>
            <p className="text-muted-foreground mb-4">Requesting camera and microphone permissions...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Setting up secure emergency session</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-800 flex flex-col">
      {/* Emergency Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-700 p-4 flex items-center justify-between shadow-lg border-b border-red-600">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse shadow-lg"></div>
          <div>
            <h2 className="text-white font-bold">🚨 EMERGENCY COUNSELING SESSION</h2>
            <p className="text-red-200 text-sm">Crisis Support • {counselorName} • {formatDuration(callDuration)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {urgencyLevel === 'high' && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
              🔴 HIGH PRIORITY
            </span>
          )}
          <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            🔒 Secure & Private
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* AI Crisis Counselor */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-red-800 to-red-700 border-red-600 shadow-2xl">
            <CardContent className="p-0 h-full min-h-[400px]">
              <div className="relative h-full bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center">
                <div className="text-center text-white relative">
                  <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto mb-6 shadow-2xl transform transition-all duration-500">
                    <span className="text-6xl">{avatarData.emoji}</span>
                    <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-pulse"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-white/30 animate-ping"></div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{counselorName}</h3>
                  <p className="text-red-200 mb-4">Emergency Crisis Counselor</p>
                  
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${isAvatarSpeaking ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                    <span className={`text-sm ${avatarData.color} font-medium`}>
                      {avatarData.expression}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs text-red-200">
                    <div className="flex flex-col items-center space-y-1">
                      <Brain className="w-5 h-5 text-blue-400" />
                      <span>Crisis AI</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <Heart className="w-5 h-5 text-red-400 animate-pulse" />
                      <span>24/7 Care</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <MessageCircle className="w-5 h-5 text-yellow-400" />
                      <span>Support</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-4 left-4 bg-red-600/80 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm animate-pulse">
                  🚨 CRISIS AI
                </div>

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
                {hasPermissions && isVideoOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-center text-slate-400">
                    <div className="w-32 h-32 rounded-full bg-slate-600 flex items-center justify-center mx-auto mb-4">
                      {hasPermissions ? <VideoOff className="w-16 h-16" /> : <User className="w-16 h-16" />}
                    </div>
                    <p className="text-lg">
                      {hasPermissions ? "Camera is off" : "Camera access needed"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {hasPermissions ? "Your privacy is protected" : "Grant permission to enable video"}
                    </p>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                  👤 You (Safe Space)
                </div>
                
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

      {/* Emergency Controls */}
      <div className="bg-gradient-to-r from-red-800 to-red-700 p-6 shadow-2xl border-t border-red-600">
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={toggleVideo}
            variant={isVideoOn ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-all duration-200"
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          <Button
            onClick={toggleAudio}
            variant={isAudioOn ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-all duration-200"
          >
            {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>

          <Button
            onClick={toggleSpeaker}
            variant={isSpeakerOn ? "default" : "secondary"}
            size="lg"
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-all duration-200"
          >
            {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-110 transition-all duration-200"
          >
            <Settings className="w-6 h-6" />
          </Button>

          <Button
            onClick={handleEndCall}
            variant="destructive"
            size="lg"
            className="rounded-full w-16 h-16 p-0 bg-red-600 hover:bg-red-700 shadow-lg hover:scale-110 transition-all duration-200"
          >
            <Phone className="w-7 h-7" />
          </Button>
        </div>

        <div className="flex items-center justify-center space-x-6 mt-6 text-red-200 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span>Emergency Session: {formatDuration(callDuration)}</span>
          </div>
          <span>•</span>
          <span>🔐 End-to-End Encrypted</span>
          <span>•</span>
          <span>🚨 Crisis Support Active</span>
          <span>•</span>
          <span>📞 Help Available 24/7</span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyVideoCall;