import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { BluetoothPeer } from '@/hooks/useBluetoothPeer';
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Volume2,
  VolumeX,
  MessageCircle,
  Send,
  Users,
  Circle,
  Heart,
  Waves,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface GroupTherapyRoomProps {
  isOpen: boolean;
  onClose: () => void;
  connectedPeers: BluetoothPeer[];
  groupName: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

const GroupTherapyRoom: React.FC<GroupTherapyRoomProps> = ({
  isOpen,
  onClose,
  connectedPeers,
  groupName
}) => {
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'System',
      content: `Welcome to ${groupName}! This is a safe space for sharing and support.`,
      timestamp: new Date(),
      isSystem: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState<Record<string, number>>({});
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize audio
  useEffect(() => {
    if (isOpen && !isMuted) {
      initializeAudio();
    }
    return () => {
      cleanupAudio();
    };
  }, [isOpen, isMuted]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate active speaker rotation
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      const speakers = [...connectedPeers, { id: 'me', name: 'You' }];
      const randomSpeaker = speakers[Math.floor(Math.random() * speakers.length)];
      setActiveSpeaker(randomSpeaker.id);
      
      // Simulate audio levels
      const levels: Record<string, number> = {};
      connectedPeers.forEach(peer => {
        levels[peer.id] = Math.random() * 0.8;
      });
      levels['me'] = isMuted ? 0 : Math.random() * 0.9;
      setAudioLevels(levels);
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, connectedPeers, isMuted]);

  const initializeAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      toast({
        title: "Audio Connected",
        description: "Your microphone is now active",
      });
    } catch (err) {
      console.error('Audio initialization error:', err);
    }
  };

  const cleanupAudio = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleLeave = () => {
    cleanupAudio();
    onClose();
    toast({
      title: "Left Group",
      description: `You've left ${groupName}`,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ 
            scale: isMinimized ? 0.5 : 1, 
            opacity: 1, 
            y: 0,
            width: isMinimized ? '300px' : '100%',
            height: isMinimized ? 'auto' : '100%'
          }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl ${
            isMinimized ? 'max-w-[300px]' : 'max-w-6xl max-h-[90vh]'
          }`}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Header */}
          <div className="relative bg-black/30 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(168, 85, 247, 0)',
                      '0 0 20px 5px rgba(168, 85, 247, 0.4)',
                      '0 0 0 0 rgba(168, 85, 247, 0)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Users className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white">{groupName}</h2>
                  <p className="text-white/60 text-sm flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                    {connectedPeers.length + 1} participants active
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsMinimized(!isMinimized)}
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={handleLeave}
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-red-400 hover:bg-red-500/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex h-[calc(90vh-140px)]">
              {/* Main Content - Participants Grid */}
              <div className="flex-1 p-6 overflow-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Current User */}
                  <motion.div
                    className={`relative aspect-square rounded-2xl overflow-hidden ${
                      activeSpeaker === 'me' ? 'ring-4 ring-green-400' : ''
                    }`}
                    animate={{
                      scale: activeSpeaker === 'me' ? 1.02 : 1
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex flex-col items-center justify-center">
                      <motion.div
                        className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold mb-3"
                        animate={activeSpeaker === 'me' ? {
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ duration: 0.5, repeat: activeSpeaker === 'me' ? Infinity : 0 }}
                      >
                        You
                      </motion.div>
                      <span className="text-white font-medium">You (Host)</span>
                      
                      {/* Audio Visualizer */}
                      {!isMuted && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-green-400 rounded-full"
                              animate={{
                                height: [4, 20 + Math.random() * 20, 4]
                              }}
                              transition={{
                                duration: 0.3,
                                repeat: Infinity,
                                delay: i * 0.1
                              }}
                            />
                          ))}
                        </div>
                      )}
                      
                      {isMuted && (
                        <Badge className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500/80">
                          <MicOff className="w-3 h-3 mr-1" />
                          Muted
                        </Badge>
                      )}
                    </div>
                  </motion.div>

                  {/* Connected Peers */}
                  {connectedPeers.map((peer, index) => (
                    <motion.div
                      key={peer.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: activeSpeaker === peer.id ? 1.02 : 1 
                      }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative aspect-square rounded-2xl overflow-hidden ${
                        activeSpeaker === peer.id ? 'ring-4 ring-green-400' : ''
                      }`}
                    >
                      <div 
                        className="absolute inset-0 flex flex-col items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, hsl(${(index * 40) % 360}, 70%, 50%), hsl(${(index * 40 + 60) % 360}, 70%, 40%))`
                        }}
                      >
                        <motion.div
                          className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold mb-3"
                          animate={activeSpeaker === peer.id ? {
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{ duration: 0.5, repeat: activeSpeaker === peer.id ? Infinity : 0 }}
                        >
                          {peer.avatar}
                        </motion.div>
                        <span className="text-white font-medium">{peer.name}</span>
                        <span className="text-white/60 text-sm">{peer.issue}</span>
                        
                        {/* Audio Visualizer */}
                        {peer.status !== 'away' && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1 bg-white/80 rounded-full"
                                animate={{
                                  height: [4, 10 + (audioLevels[peer.id] || 0) * 30, 4]
                                }}
                                transition={{
                                  duration: 0.4,
                                  repeat: Infinity,
                                  delay: i * 0.08
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Emotional Support Banner */}
                <motion.div
                  className="mt-6 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Heart className="w-6 h-6 text-pink-400" />
                    </motion.div>
                    <p className="text-white/80">
                      Remember: Everything shared here stays here. You're among friends who understand.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Chat Sidebar */}
              {showChat && (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="w-80 bg-black/40 backdrop-blur-sm border-l border-white/10 flex flex-col"
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Group Chat
                    </h3>
                  </div>
                  
                  <div className="flex-1 overflow-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${message.isSystem ? 'text-center' : ''}`}
                      >
                        {message.isSystem ? (
                          <p className="text-white/40 text-sm italic">{message.content}</p>
                        ) : (
                          <div className={`${message.sender === 'You' ? 'ml-auto' : ''} max-w-[80%]`}>
                            <p className="text-white/60 text-xs mb-1">{message.sender}</p>
                            <div className={`p-3 rounded-xl ${
                              message.sender === 'You' 
                                ? 'bg-purple-500/50 ml-auto' 
                                : 'bg-white/10'
                            }`}>
                              <p className="text-white text-sm">{message.content}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  
                  <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="icon"
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Control Bar */}
          <div className="relative bg-black/40 backdrop-blur-sm border-t border-white/10 p-4">
            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {isMuted ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  !isSpeakerOn ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {isSpeakerOn ? (
                  <Volume2 className="w-6 h-6 text-white" />
                ) : (
                  <VolumeX className="w-6 h-6 text-white" />
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowChat(!showChat)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  showChat ? 'bg-purple-500' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLeave}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
              >
                <PhoneOff className="w-6 h-6 text-white" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GroupTherapyRoom;
