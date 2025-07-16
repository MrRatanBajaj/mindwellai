
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
  Volume2
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
  const [peers, setPeers] = useState<PeerUser[]>(mockPeers);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isInGroupCall, setIsInGroupCall] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [searchRadius, setSearchRadius] = useState(5);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPeers(prevPeers => 
        prevPeers.map(peer => ({
          ...peer,
          isActive: Math.random() > 0.3 // 70% chance to be active
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const joinGroupCall = (groupName: string) => {
    setSelectedGroup(groupName);
    setIsInGroupCall(true);
  };

  const leaveGroupCall = () => {
    setIsInGroupCall(false);
    setSelectedGroup("");
    setIsMicOn(false);
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
                Connect with 
                <span className="bg-gradient-to-r from-mindwell-600 to-blue-600 bg-clip-text text-transparent"> Peers</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
                Find and connect with others nearby who share similar mental health journeys. 
                Join audio support groups for peer-to-peer healing.
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
              </div>
            </motion.div>
          </div>

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

          {/* Support Groups */}
          <div className="mb-12">
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
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Chat
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-mindwell-500 to-mindwell-600 hover:from-mindwell-600 hover:to-mindwell-700"
                            disabled={!peer.isActive}
                          >
                            <UserCheck className="w-3 h-3 mr-1" />
                            Connect
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
    </div>
  );
};

export default PeerConnect;
