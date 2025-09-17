import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  Send,
  UserX,
  Circle
} from 'lucide-react';

interface PeerUser {
  id: string;
  name: string;
  avatar: string;
  distance: string;
  issue: string;
  isActive: boolean;
  isInCall: boolean;
  supportGroup: string;
  joinedDate: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface PeerCommunicationProps {
  peer: PeerUser;
  isOpen: boolean;
  onClose: () => void;
}

const PeerCommunication: React.FC<PeerCommunicationProps> = ({ peer, isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Communication states
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  
  // Chat states
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  
  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && user) {
      initializeCommunication();
    }
    
    return () => {
      cleanup();
    };
  }, [isOpen, user]);

  const initializeCommunication = async () => {
    try {
      // Create Supabase channel for this peer connection
      const channelName = `peer_${[user?.id, peer.id].sort().join('_')}`;
      channelRef.current = supabase.channel(channelName);

      // Set up realtime listeners
      channelRef.current
        .on('presence', { event: 'sync' }, handlePresenceSync)
        .on('presence', { event: 'join' }, handlePresenceJoin)
        .on('presence', { event: 'leave' }, handlePresenceLeave)
        .on('broadcast', { event: 'offer' }, handleOffer)
        .on('broadcast', { event: 'answer' }, handleAnswer)
        .on('broadcast', { event: 'ice-candidate' }, handleIceCandidate)
        .on('broadcast', { event: 'call-end' }, handleCallEnd)
        .on('broadcast', { event: 'message' }, handleMessage)
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channelRef.current?.track({
              user_id: user?.id,
              name: user?.email?.split('@')[0] || 'User',
              online_at: new Date().toISOString(),
              status: 'available'
            });
          }
        });

      setIsConnected(true);
      
      toast({
        title: "Connected",
        description: `Connected to ${peer.name}`,
      });
    } catch (error) {
      console.error('Error initializing communication:', error);
      toast({
        title: "Connection Error",
        description: "Could not connect to peer",
        variant: "destructive"
      });
    }
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }
  };

  const handlePresenceSync = () => {
    const presenceState = channelRef.current?.presenceState();
    console.log('Presence sync:', presenceState);
  };

  const handlePresenceJoin = ({ key, newPresences }: any) => {
    console.log('User joined:', key, newPresences);
  };

  const handlePresenceLeave = ({ key, leftPresences }: any) => {
    console.log('User left:', key, leftPresences);
    if (isCallActive) {
      endCall();
    }
  };

  const startCall = async (video: boolean = false) => {
    setIsConnecting(true);
    setIsVideoCall(video);
    
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: video
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Add local stream
      stream.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnectionRef.current.ontrack = (event) => {
        remoteStreamRef.current = event.streams[0];
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          channelRef.current?.send({
            type: 'broadcast',
            event: 'ice-candidate',
            payload: { candidate: event.candidate }
          });
        }
      };

      // Create offer
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      // Send offer to peer
      channelRef.current?.send({
        type: 'broadcast',
        event: 'offer',
        payload: { offer, video }
      });

      setIsCallActive(true);
      setIsConnecting(false);
      
      toast({
        title: "Call Started",
        description: `${video ? 'Video' : 'Audio'} call initiated`,
      });

    } catch (error) {
      console.error('Error starting call:', error);
      setIsConnecting(false);
      toast({
        title: "Call Error",
        description: "Could not start call",
        variant: "destructive"
      });
    }
  };

  const handleOffer = async ({ payload }: any) => {
    const { offer, video } = payload;
    setIsVideoCall(video);

    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: video
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Add local stream
      stream.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnectionRef.current.ontrack = (event) => {
        remoteStreamRef.current = event.streams[0];
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          channelRef.current?.send({
            type: 'broadcast',
            event: 'ice-candidate',
            payload: { candidate: event.candidate }
          });
        }
      };

      // Set remote description and create answer
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      // Send answer
      channelRef.current?.send({
        type: 'broadcast',
        event: 'answer',
        payload: { answer }
      });

      setIsCallActive(true);
      
      toast({
        title: "Call Accepted",
        description: `${video ? 'Video' : 'Audio'} call connected`,
      });

    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async ({ payload }: any) => {
    const { answer } = payload;
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.setRemoteDescription(answer);
    }
  };

  const handleIceCandidate = async ({ payload }: any) => {
    const { candidate } = payload;
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.addIceCandidate(candidate);
    }
  };

  const handleCallEnd = () => {
    endCall();
    toast({
      title: "Call Ended",
      description: "The call has been ended",
    });
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    setIsCallActive(false);
    setIsVideoCall(false);
    setIsConnecting(false);
    
    // Notify peer
    channelRef.current?.send({
      type: 'broadcast',
      event: 'call-end',
      payload: {}
    });
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: user?.id || 'unknown',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    
    channelRef.current?.send({
      type: 'broadcast',
      event: 'message',
      payload: message
    });

    setNewMessage('');
  };

  const handleMessage = ({ payload }: any) => {
    const message = payload as Message;
    if (message.sender !== user?.id) {
      setMessages(prev => [...prev, message]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-mindwell-500 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mindwell-400 to-mindwell-600 flex items-center justify-center text-white text-xl font-bold">
                    {peer.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{peer.name}</h3>
                    <p className="text-white/80 text-sm">{peer.distance} away • {peer.issue}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isConnected && (
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      <Circle className="w-2 h-2 mr-1 fill-white" />
                      Connected
                    </Badge>
                  )}
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <UserX className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
              {/* Video Area */}
              <div className="flex-1 bg-slate-900 relative">
                {isCallActive ? (
                  <>
                    {/* Remote Video */}
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Local Video (Picture-in-Picture) */}
                    {isVideoCall && (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute top-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-white/50"
                      />
                    )}
                    
                    {/* Call Controls */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                      <Button
                        onClick={toggleMute}
                        variant={isMuted ? "destructive" : "secondary"}
                        size="lg"
                        className="rounded-full w-12 h-12"
                      >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </Button>
                      
                      {isVideoCall && (
                        <Button
                          onClick={toggleVideo}
                          variant={!isVideoEnabled ? "destructive" : "secondary"}
                          size="lg"
                          className="rounded-full w-12 h-12"
                        >
                          {!isVideoEnabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                        variant="secondary"
                        size="lg"
                        className="rounded-full w-12 h-12"
                      >
                        {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      </Button>
                      
                      <Button
                        onClick={endCall}
                        variant="destructive"
                        size="lg"
                        className="rounded-full w-12 h-12"
                      >
                        <PhoneOff className="w-5 h-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-mindwell-400 to-mindwell-600 flex items-center justify-center text-3xl font-bold">
                        {peer.avatar}
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">{peer.name}</h3>
                      <p className="text-white/70 mb-8">{peer.issue}</p>
                      
                      <div className="flex gap-4 justify-center">
                        <Button
                          onClick={() => startCall(false)}
                          disabled={isConnecting}
                          size="lg"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Phone className="w-5 h-5 mr-2" />
                          Audio Call
                        </Button>
                        <Button
                          onClick={() => startCall(true)}
                          disabled={isConnecting}
                          size="lg"
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Video className="w-5 h-5 mr-2" />
                          Video Call
                        </Button>
                      </div>
                      
                      {isConnecting && (
                        <p className="text-white/70 mt-4">Connecting...</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Sidebar */}
              {showChat && (
                <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
                  <div className="p-4 border-b border-slate-200">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </h3>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          message.sender === user?.id
                            ? 'bg-mindwell-500 text-white'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-slate-200">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PeerCommunication;