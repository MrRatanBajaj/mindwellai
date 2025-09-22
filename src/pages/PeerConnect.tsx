
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AIAudioCounselor from "@/components/ui-custom/AIAudioCounselor";
import PeerCommunication from "@/components/ui-custom/PeerCommunication";
import TherapyModelMatcher from "@/components/ui-custom/TherapyModelMatcher";
import ResourceSharing from "@/components/ui-custom/ResourceSharing";
import { usePeerPresence } from "@/hooks/usePeerPresence";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, 
  MapPin, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Circle,
  Heart,
  MessageCircle,
  UserCheck,
  Volume2,
  Bot,
  Sparkles,
  Headphones,
  Video,
  Navigation,
  Brain,
  BookOpen,
  CheckCircle,
  Check,
  Clock,
  Shield
} from "lucide-react";

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

const mockPeers: PeerUser[] = [
  {
    id: "1",
    name: "Sarah M.",
    avatar: "S",
    distance: "0.5 km",
    issue: "Anxiety Support",
    isActive: true,
    isInCall: false,
    supportGroup: "Mindful Monday",
    joinedDate: "2 weeks ago"
  },
  {
    id: "2",
    name: "John D.",
    avatar: "J",
    distance: "1.2 km",
    issue: "Depression Recovery",
    isActive: true,
    isInCall: true,
    supportGroup: "Hope Circle",
    joinedDate: "1 month ago"
  },
  {
    id: "3",
    name: "Maya P.",
    avatar: "M",
    distance: "2.1 km",
    issue: "Stress Management",
    isActive: false,
    isInCall: false,
    supportGroup: "Calm Collective",
    joinedDate: "3 days ago"
  },
  {
    id: "4",
    name: "Alex R.",
    avatar: "A",
    distance: "0.8 km",
    issue: "Anxiety Support",
    isActive: true,
    isInCall: false,
    supportGroup: "Mindful Monday",
    joinedDate: "1 week ago"
  }
];

const PeerConnect = () => {
  const { user } = useAuth();
  const { onlineUsers, updateStatus, updateLocation, isConnected } = usePeerPresence('peer_connect');
  const [peers, setPeers] = useState<PeerUser[]>(mockPeers);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isInGroupCall, setIsInGroupCall] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [searchRadius, setSearchRadius] = useState(5);
  const [showAICounselor, setShowAICounselor] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState<PeerUser | null>(null);
  const [showPeerCommunication, setShowPeerCommunication] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [therapyMatches, setTherapyMatches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("groups");

  // Get user's location for distance calculations
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          updateLocation(latitude, longitude);
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, [updateLocation]);

  // Update peers with real online users
  useEffect(() => {
    if (onlineUsers.length > 0) {
      // Merge real online users with mock data
      const updatedPeers = mockPeers.map(mockPeer => {
        const onlineUser = onlineUsers.find(u => u.user_id === mockPeer.id);
        if (onlineUser) {
          return {
            ...mockPeer,
            isActive: true,
            isInCall: onlineUser.status === 'in_call'
          };
        }
        return {
          ...mockPeer,
          isActive: false
        };
      });
      
      // Add real users not in mock data
      onlineUsers.forEach(onlineUser => {
        if (!mockPeers.find(p => p.id === onlineUser.user_id)) {
          updatedPeers.push({
            id: onlineUser.user_id,
            name: onlineUser.name,
            avatar: onlineUser.name.charAt(0).toUpperCase(),
            distance: "Unknown",
            issue: "General Support",
            isActive: true,
            isInCall: onlineUser.status === 'in_call',
            supportGroup: "Community",
            joinedDate: "Recently"
          });
        }
      });
      
      setPeers(updatedPeers);
    }
  }, [onlineUsers]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPeers(prevPeers => 
        prevPeers.map(peer => ({
          ...peer,
          isActive: onlineUsers.some(u => u.user_id === peer.id) || Math.random() > 0.7
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [onlineUsers]);

  const joinGroupCall = async (groupName: string) => {
    setSelectedGroup(groupName);
    setIsInGroupCall(true);
    await updateStatus('in_call');
  };

  const leaveGroupCall = async () => {
    setIsInGroupCall(false);
    setSelectedGroup("");
    setIsMicOn(false);
    await updateStatus('available');
  };

  const connectToPeer = (peer: PeerUser) => {
    setSelectedPeer(peer);
    setShowPeerCommunication(true);
    updateStatus('busy');
  };

  const closePeerCommunication = () => {
    setShowPeerCommunication(false);
    setSelectedPeer(null);
    updateStatus('available');
  };

  const handleTherapyMatches = (matches: any[]) => {
    setTherapyMatches(matches);
    setActiveTab("therapy-matches");
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const activePeers = peers.filter(peer => peer.isActive);
  const groupedPeers = peers.reduce((acc, peer) => {
    if (!acc[peer.supportGroup]) {
      acc[peer.supportGroup] = [];
    }
    acc[peer.supportGroup].push(peer);
    return acc;
  }, {} as Record<string, PeerUser[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindwell-50 via-white to-blue-50">
      <Header />
      
      <main className="pt-24 pb-16 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                Mental Health 
                <span className="bg-gradient-to-r from-mindwell-600 to-blue-600 bg-clip-text text-transparent"> Therapy Connect</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
                Connect with peers based on therapy models, share resources, and engage with AI counseling.
                Find your therapeutic community and access 24/7 mental health support.
              </p>
              
              {/* Search Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-mindwell-600" />
                  <span className="text-slate-700">Search within:</span>
                  <select 
                    value={searchRadius} 
                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                    className="px-3 py-1 rounded-lg border border-slate-300 focus:ring-2 focus:ring-mindwell-500 focus:border-transparent"
                  >
                    <option value={1}>1 km</option>
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={25}>25 km</option>
                  </select>
                </div>
                
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Circle className="w-3 h-3 mr-1 fill-green-500" />
                  {activePeers.length} Active Now
                </Badge>
                
                {isConnected && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Navigation className="w-3 h-3 mr-1" />
                    Real-time Connected
                  </Badge>
                )}
                
                {userLocation && (
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    Location Enabled
                  </Badge>
                )}
              </div>
            </motion.div>
          </div>

          {/* AI Audio Counselor Feature - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-mindwell-500 via-blue-500 to-purple-600 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-mindwell-500/90 via-blue-500/90 to-purple-600/90" />
              
              {/* Free Session Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-green-500 text-white font-bold px-3 py-1 text-sm animate-pulse">
                  🆓 30 MIN FREE
                </Badge>
              </div>

              <CardContent className="relative p-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="relative">
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Bot className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      {/* AI Activity Indicator */}
                      <div className="absolute -bottom-1 -left-1 flex gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        AI Mental Health Counselor
                        <Sparkles className="w-6 h-6 text-yellow-300" />
                      </h2>
                      <p className="text-white/95 mb-3 text-lg">
                        Talk with Dr. Alex - Pre-trained AI therapist with advanced mental health expertise
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Two-Way Voice
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          <Brain className="w-3 h-3 mr-1" />
                          CBT/DBT Trained
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          HIPAA Compliant
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          24/7 Available
                        </Badge>
                      </div>
                      
                      {/* Feature Highlights */}
                      <div className="space-y-2 text-sm text-white/90">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-300" />
                          <span>Real-time voice conversation with empathetic AI</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-300" />
                          <span>Trained on evidence-based therapy techniques</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-300" />
                          <span>30-minute free session for new users</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => setShowAICounselor(true)}
                      size="lg"
                      className="bg-white text-mindwell-600 hover:bg-white/90 font-bold px-8 py-4 text-lg shadow-lg"
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      Start Free Session
                    </Button>
                    <p className="text-xs text-white/80 text-center max-w-xs">
                      No signup required • Completely confidential
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Group Call Status */}
          <AnimatePresence>
            {isInGroupCall && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-8"
              >
                <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Volume2 className="w-8 h-8" />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -inset-2 bg-white/20 rounded-full"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">Connected to {selectedGroup}</h3>
                          <p className="text-green-100">Audio group session in progress</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={toggleMic}
                          variant={isMicOn ? "secondary" : "outline"}
                          size="sm"
                          className={isMicOn ? "bg-white text-green-600" : "border-white text-white hover:bg-white hover:text-green-600"}
                        >
                          {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={leaveGroupCall}
                          variant="destructive"
                          size="sm"
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <PhoneOff className="w-4 h-4 mr-2" />
                          Leave
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Support Groups
              </TabsTrigger>
              <TabsTrigger value="therapy-finder" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Therapy Finder
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="therapy-matches" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Matches ({therapyMatches.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="groups" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-mindwell-600" />
                  Active Support Groups
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(groupedPeers).map(([groupName, groupPeers]) => (
                <motion.div
                  key={groupName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-mindwell-300">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg">{groupName}</span>
                        <div className="flex items-center gap-1">
                          {groupPeers.filter(p => p.isActive).map((peer, index) => (
                            <motion.div
                              key={peer.id}
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                            >
                              <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                            </motion.div>
                          ))}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users className="w-4 h-4" />
                          {groupPeers.length} members • {groupPeers.filter(p => p.isActive).length} active
                        </div>
                        
                        <div className="flex -space-x-2">
                          {groupPeers.slice(0, 4).map((peer) => (
                            <div
                              key={peer.id}
                              className={`relative w-8 h-8 rounded-full bg-gradient-to-br from-mindwell-400 to-mindwell-600 flex items-center justify-center text-white text-sm font-medium border-2 border-white ${
                                peer.isActive ? 'ring-2 ring-green-400' : ''
                              }`}
                            >
                              {peer.avatar}
                              {peer.isActive && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                              )}
                            </div>
                          ))}
                          {groupPeers.length > 4 && (
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium border-2 border-white">
                              +{groupPeers.length - 4}
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => joinGroupCall(groupName)}
                          disabled={isInGroupCall}
                          className="w-full bg-gradient-to-r from-mindwell-500 to-mindwell-600 hover:from-mindwell-600 hover:to-mindwell-700"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          {isInGroupCall ? 'In Call' : 'Join Audio Group'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="therapy-finder" className="space-y-6">
              <TherapyModelMatcher onMatch={handleTherapyMatches} />
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <ResourceSharing />
            </TabsContent>

            <TabsContent value="therapy-matches" className="space-y-6">
              {therapyMatches.length > 0 ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Therapy Matches</h2>
                    <p className="text-slate-600">Connect with peers who share your therapeutic interests</p>
                  </div>
                  
                  <div className="grid gap-4">
                    {therapyMatches.map((match) => (
                      <Card key={match.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mindwell-400 to-mindwell-600 flex items-center justify-center text-white font-bold text-lg">
                                {match.avatar}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-slate-800">{match.name}</h3>
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    {match.matchScore}% match
                                  </Badge>
                                  {match.isOnline && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                      <Circle className="w-2 h-2 mr-1 fill-blue-600" />
                                      Online
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                                  <span>{match.distance}</span>
                                  <span>•</span>
                                  <span>{match.experience} level</span>
                                  <span>•</span>
                                  <span>{match.lastActive}</span>
                                </div>
                                <div className="flex gap-1 mb-2">
                                  {match.models.map((model: string) => (
                                    <Badge key={model} variant="outline" className="text-xs">
                                      {model.toUpperCase()}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex gap-1">
                                  {match.issues.map((issue: string) => (
                                    <Badge key={issue} variant="secondary" className="text-xs bg-slate-100">
                                      {issue}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => connectToPeer({
                                  id: match.id,
                                  name: match.name,
                                  avatar: match.avatar,
                                  distance: match.distance,
                                  issue: match.issues.join(', '),
                                  isActive: match.isOnline,
                                  isInCall: false,
                                  supportGroup: 'Therapy Connect',
                                  joinedDate: 'Recently'
                                })}
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Connect
                              </Button>
                              <Button variant="outline" size="sm">
                                <Video className="w-4 h-4 mr-1" />
                                Video
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">No Matches Yet</h3>
                  <p className="text-slate-500 mb-4">Use the Therapy Finder to discover compatible peers</p>
                  <Button onClick={() => setActiveTab("therapy-finder")}>
                    Find Therapy Matches
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Nearby Peers */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-mindwell-600" />
              Nearby Peers
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {peers.map((peer, index) => (
                <motion.div
                  key={peer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Card className={`hover:shadow-lg transition-all duration-300 ${
                    peer.isActive ? 'border-green-200 bg-green-50/30' : 'border-slate-200'
                  }`}>
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <div className="relative mx-auto w-16 h-16">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-mindwell-400 to-mindwell-600 flex items-center justify-center text-white text-xl font-bold ${
                            peer.isActive ? 'ring-4 ring-green-200' : ''
                          }`}>
                            {peer.avatar}
                          </div>
                          
                          {peer.isActive && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                            >
                              <Circle className="w-2 h-2 fill-white text-white" />
                            </motion.div>
                          )}
                          
                          {peer.isInCall && (
                            <div className="absolute -top-1 -left-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                              <Phone className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-slate-800">{peer.name}</h3>
                          <p className="text-sm text-slate-600 mb-2">{peer.distance} away</p>
                          
                          <Badge variant="outline" className="text-xs mb-2">
                            {peer.issue}
                          </Badge>
                          
                          <p className="text-xs text-slate-500">
                            {peer.supportGroup} • Joined {peer.joinedDate}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-mindwell-300 text-mindwell-700 hover:bg-mindwell-50"
                            onClick={() => connectToPeer(peer)}
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Chat
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            disabled={!peer.isActive}
                            onClick={() => connectToPeer(peer)}
                          >
                            <Video className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* AI Audio Counselor Modal */}
      <AIAudioCounselor 
        isOpen={showAICounselor} 
        onClose={() => setShowAICounselor(false)} 
      />
      
      {/* Peer Communication Modal */}
      {selectedPeer && (
        <PeerCommunication
          peer={selectedPeer}
          isOpen={showPeerCommunication}
          onClose={closePeerCommunication}
        />
      )}
    </div>
  );
};

export default PeerConnect;
