import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, 
  Camera, Settings, Users, Maximize, Minimize,
  AlertTriangle, Shield, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VideoCallManagerProps {
  counselorName: string;
  urgencyLevel: string;
  onEndCall: () => void;
  onAIResponse?: (response: string) => void;
}

interface MediaConstraints {
  video: {
    width: { min: number; ideal: number; max: number };
    height: { min: number; ideal: number; max: number };
    frameRate: { ideal: number };
    facingMode: string;
  };
  audio: {
    echoCancellation: boolean;
    noiseSuppression: boolean;
    autoGainControl: boolean;
    sampleRate: number;
  };
}

const VideoCallManager = ({
  counselorName,
  urgencyLevel,
  onEndCall,
  onAIResponse
}: VideoCallManagerProps) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'failed'>('connecting');
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [aiSpeaking, setAiSpeaking] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const mediaConstraints: MediaConstraints = {
    video: {
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 },
      frameRate: { ideal: 30 },
      facingMode: 'user'
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 48000
    }
  };

  // WebRTC Configuration
  const rtcConfiguration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10
  };

  useEffect(() => {
    initializeCall();
    
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      cleanup();
      clearInterval(timer);
    };
  }, []);

  const initializeCall = async () => {
    try {
      await requestMediaPermissions();
      await setupPeerConnection();
      await connectToAIService();
    } catch (error) {
      console.error('Failed to initialize call:', error);
      setConnectionState('failed');
      toast.error('Failed to initialize video call', {
        description: 'Please check your camera and microphone permissions'
      });
    }
  };

  const requestMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      toast.success('Camera and microphone access granted', {
        description: 'Emergency video session is now active'
      });

      // Log permission grant
      await supabase
        .from('voice_chat_sessions')
        .insert({
          session_id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user_id: null,
          status: 'active',
          metadata: {
            permissions: { video: true, audio: true },
            urgency_level: urgencyLevel,
            counselor_name: counselorName,
            started_at: new Date().toISOString()
          }
        });

    } catch (error) {
      console.error('Media permission denied:', error);
      
      if (error instanceof Error && error.name === 'NotAllowedError') {
        toast.error('Camera/microphone access denied', {
          description: 'Please enable permissions for emergency support'
        });
      } else if (error instanceof Error && error.name === 'NotFoundError') {
        toast.error('No camera/microphone found', {
          description: 'Please connect a camera and microphone'
        });
      }
      throw error;
    }
  };

  const setupPeerConnection = async () => {
    const pc = new RTCPeerConnection(rtcConfiguration);
    setPeerConnection(pc);

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      const [stream] = event.streams;
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };

    // Monitor connection state
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState as 'connecting' | 'connected' | 'disconnected' | 'failed';
      setConnectionState(state);
      
      if (state === 'connected') {
        toast.success('Connected to AI counselor', {
          description: `Video session with ${counselorName} is active`
        });
      } else if (state === 'failed' || state === 'disconnected') {
        toast.error('Connection lost', {
          description: 'Attempting to reconnect to AI counselor'
        });
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate);
      }
    };

    return pc;
  };

  const connectToAIService = async () => {
    try {
      // Simulate AI avatar connection
      setTimeout(() => {
        setConnectionState('connected');
        createAIAvatarStream();
      }, 2000);
    } catch (error) {
      console.error('AI service connection failed:', error);
      throw error;
    }
  };

  const createAIAvatarStream = () => {
    // Create animated AI avatar
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    if (ctx && remoteVideoRef.current) {
      let frame = 0;
      
      const animate = () => {
        frame++;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create animated gradient background
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );
        
        const hue = (frame * 2) % 360;
        gradient.addColorStop(0, `hsl(${hue}, 70%, 60%)`);
        gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 50%, 30%)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw AI avatar
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80 + Math.sin(frame * 0.1) * 10;
        
        // Avatar circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        
        // Avatar face
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillText(aiSpeaking ? '🗣️' : '👩‍⚕️', centerX, centerY + 15);
        
        // Speaking indicator
        if (aiSpeaking) {
          for (let i = 0; i < 5; i++) {
            const waveHeight = Math.sin(frame * 0.3 + i * 0.5) * 20;
            ctx.beginPath();
            ctx.rect(centerX - 60 + i * 25, centerY + 100, 10, Math.abs(waveHeight) + 5);
            ctx.fillStyle = `hsl(${hue}, 80%, 70%)`;
            ctx.fill();
          }
        }
        
        // Counselor name
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(counselorName, centerX, centerY + 150);
        
        requestAnimationFrame(animate);
      };
      
      animate();
      
      // Convert canvas to stream
      const stream = canvas.captureStream(30);
      remoteVideoRef.current.srcObject = stream;
    }
  };

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
      
      toast.success(isVideoEnabled ? 'Camera turned off' : 'Camera turned on');
    }
  }, [localStream, isVideoEnabled]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
      
      toast.success(isAudioEnabled ? 'Microphone muted' : 'Microphone unmuted');
    }
  }, [localStream, isAudioEnabled]);

  const toggleRecording = useCallback(async () => {
    if (!isRecording && localStream) {
      try {
        const recorder = new MediaRecorder(localStream, {
          mimeType: 'audio/webm'
        });
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };
        
        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          audioChunks.current = [];
          
          // Convert to base64 and send to AI
          const reader = new FileReader();
          reader.onload = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            await processAudioWithAI(base64Audio);
          };
          reader.readAsDataURL(audioBlob);
        };
        
        mediaRecorder.current = recorder;
        recorder.start(1000); // Record in 1-second chunks
        setIsRecording(true);
        
        toast.success('Recording started for AI analysis');
      } catch (error) {
        console.error('Recording failed:', error);
        toast.error('Failed to start recording');
      }
    } else if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  }, [isRecording, localStream]);

  const processAudioWithAI = async (audioData: string) => {
    try {
      setAiSpeaking(true);
      
      const { data, error } = await supabase.functions.invoke('ai-counselor', {
        body: {
          audioData,
          counselorId: 'emma',
          urgencyLevel,
          sessionType: 'emergency_video'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Simulate AI response delay
      setTimeout(() => {
        setAiSpeaking(false);
        if (onAIResponse && data?.message) {
          onAIResponse(data.message);
        }
      }, 2000);

    } catch (error) {
      console.error('AI processing failed:', error);
      setAiSpeaking(false);
      toast.error('AI processing failed', {
        description: 'Please try speaking again'
      });
    }
  };

  const toggleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  }, [isFullScreen]);

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection) {
      peerConnection.close();
    }
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionIcon = () => {
    switch (connectionState) {
      case 'connecting':
        return <Zap className="w-4 h-4 animate-pulse text-yellow-400" />;
      case 'connected':
        return <Shield className="w-4 h-4 text-green-400" />;
      case 'disconnected':
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Zap className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50' : 'h-screen'} bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex items-center justify-between text-white shadow-lg">
        <div className="flex items-center space-x-3">
          {getConnectionIcon()}
          <div>
            <h2 className="font-bold text-lg">Emergency AI Counseling</h2>
            <p className="text-red-200 text-sm">
              {counselorName} • {formatDuration(callDuration)} • {connectionState}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {urgencyLevel === 'high' && (
            <span className="bg-red-500 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              HIGH PRIORITY
            </span>
          )}
          <Button
            onClick={toggleFullScreen}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-red-500"
          >
            {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Counselor Video */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900 shadow-2xl">
          <CardContent className="p-0 h-full min-h-[300px]">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
              {counselorName} - AI Counselor {aiSpeaking && '🗣️'}
            </div>
            <div className="absolute top-4 right-4 bg-green-600 px-3 py-1 rounded-full text-white text-xs font-medium">
              AI Active
            </div>
          </CardContent>
        </Card>

        {/* User Video */}
        <Card className="relative overflow-hidden bg-slate-800 shadow-2xl">
          <CardContent className="p-0 h-full min-h-[300px]">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${!isVideoEnabled ? 'opacity-30' : ''}`}
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
              You {isRecording && '🔴 Recording'}
            </div>
            {!isAudioEnabled && (
              <div className="absolute top-4 left-4 bg-red-600 text-white p-2 rounded-full">
                <MicOff className="w-4 h-4" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="bg-slate-900 p-6 border-t border-slate-700">
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={toggleVideo}
            variant={isVideoEnabled ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14 p-0"
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>
          
          <Button
            onClick={toggleAudio}
            variant={isAudioEnabled ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14 p-0"
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>

          <Button
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "secondary"}
            size="lg"
            className="rounded-full w-14 h-14 p-0"
          >
            <Camera className="w-6 h-6" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="rounded-full w-14 h-14 p-0"
          >
            <Settings className="w-6 h-6" />
          </Button>

          <Button
            onClick={onEndCall}
            variant="destructive"
            size="lg"
            className="rounded-full w-16 h-16 p-0 bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="w-7 h-7" />
          </Button>
        </div>
        
        <div className="text-center mt-4 text-sm text-slate-400">
          <p className="flex items-center justify-center space-x-6">
            <span className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>Secure & Encrypted</span>
            </span>
            <span className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>AI-Powered Support</span>
            </span>
            <span className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Crisis Intervention Active</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCallManager;