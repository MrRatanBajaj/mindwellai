import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BluetoothPeerCard from "@/components/ui-custom/BluetoothPeerCard";
import GroupTherapyRoom from "@/components/ui-custom/GroupTherapyRoom";
import PeerCommunication from "@/components/ui-custom/PeerCommunication";
import { useBluetoothPeer, BluetoothPeer } from "@/hooks/useBluetoothPeer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { 
  Bluetooth, 
  BluetoothSearching,
  BluetoothConnected,
  Radio,
  Waves,
  Users,
  Circle,
  Heart,
  Shield,
  Sparkles,
  Zap,
  Globe,
  Phone,
  MessageCircle,
  Brain,
  Headphones
} from "lucide-react";

const PeerConnect = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    isBluetoothSupported,
    isBluetoothEnabled,
    isScanning,
    nearbyPeers,
    connectedPeers,
    startScanning,
    stopScanning,
    connectToPeer,
    requestBluetoothPermission,
    broadcastPresence
  } = useBluetoothPeer();

  const [showGroupRoom, setShowGroupRoom] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState<BluetoothPeer | null>(null);
  const [showPeerCall, setShowPeerCall] = useState(false);
  const [connectingPeerId, setConnectingPeerId] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Request Bluetooth permission on mount
  useEffect(() => {
    if (isBluetoothEnabled) {
      setHasPermission(true);
    }
  }, [isBluetoothEnabled]);

  const handleEnableBluetooth = async () => {
    const granted = await requestBluetoothPermission();
    if (granted) {
      setHasPermission(true);
      await startScanning();
      await broadcastPresence();
    }
  };

  const handleConnect = async (peerId: string) => {
    setConnectingPeerId(peerId);
    const success = await connectToPeer(peerId);
    setConnectingPeerId(null);
    
    if (success) {
      toast({
        title: "Connected!",
        description: "You can now start a call or chat",
      });
    }
  };

  const handleStartCall = (peer: BluetoothPeer) => {
    setSelectedPeer(peer);
    setShowPeerCall(true);
  };

  const handleJoinGroup = () => {
    if (connectedPeers.length === 0) {
      toast({
        title: "No Connections",
        description: "Connect with at least one peer first",
        variant: "destructive"
      });
      return;
    }
    setShowGroupRoom(true);
  };

  const activePeers = nearbyPeers.filter(p => p.status === 'available');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <Header />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Bluetooth Radar Animation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {isScanning && (
            <>
              <motion.div
                className="absolute w-[600px] h-[600px] rounded-full border border-blue-400/20"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                style={{ left: '-300px', top: '-300px' }}
              />
              <motion.div
                className="absolute w-[600px] h-[600px] rounded-full border border-purple-400/20"
                animate={{
                  scale: [1, 2.5, 1],
                  opacity: [0.3, 0, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 1
                }}
                style={{ left: '-300px', top: '-300px' }}
              />
            </>
          )}
        </div>

        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -200, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      <main className="relative pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Bluetooth className="w-5 h-5 text-blue-400" />
              </motion.div>
              <span className="text-white/80 font-medium">Bluetooth Peer Discovery</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-white">Peer </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Therapy Connect
              </span>
            </h1>
            
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
              Connect with nearby peers using Bluetooth for secure, private group therapy sessions. 
              Find support from those who truly understand.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <Circle className="w-2 h-2 fill-green-400 mr-2" />
                {activePeers.length} Available Nearby
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <BluetoothConnected className="w-4 h-4 mr-2" />
                {connectedPeers.length} Connected
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                <Radio className="w-4 h-4 mr-2" />
                {isScanning ? 'Scanning...' : 'Ready'}
              </Badge>
            </div>
          </motion.div>

          {/* Bluetooth Permission / Scanning Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
              <CardContent className="p-8">
                {!hasPermission ? (
                  <div className="text-center">
                    <motion.div
                      className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(59, 130, 246, 0)',
                          '0 0 40px 20px rgba(59, 130, 246, 0.3)',
                          '0 0 0 0 rgba(59, 130, 246, 0)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Bluetooth className="w-12 h-12 text-white" />
                    </motion.div>
                    
                    <h2 className="text-2xl font-bold text-white mb-3">Enable Bluetooth Discovery</h2>
                    <p className="text-white/60 mb-6 max-w-md mx-auto">
                      Turn on Bluetooth to discover and connect with peers nearby for secure, 
                      private therapy sessions.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button
                        onClick={handleEnableBluetooth}
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8"
                      >
                        <Bluetooth className="w-5 h-5 mr-2" />
                        Enable Bluetooth
                      </Button>
                    </div>
                    
                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      {[
                        { icon: Shield, title: "Secure", desc: "End-to-end encrypted" },
                        { icon: Radio, title: "Local", desc: "No internet required" },
                        { icon: Users, title: "Private", desc: "Anonymous connections" }
                      ].map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="flex items-center gap-3 p-4 rounded-xl bg-white/5"
                        >
                          <feature.icon className="w-6 h-6 text-blue-400" />
                          <div className="text-left">
                            <p className="text-white font-medium">{feature.title}</p>
                            <p className="text-white/50 text-sm">{feature.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Scanning Controls */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            isScanning 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                              : 'bg-white/10'
                          }`}
                          animate={isScanning ? {
                            rotate: 360
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          {isScanning ? (
                            <BluetoothSearching className="w-8 h-8 text-white" />
                          ) : (
                            <Bluetooth className="w-8 h-8 text-white/60" />
                          )}
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {isScanning ? 'Scanning for Peers...' : 'Bluetooth Ready'}
                          </h3>
                          <p className="text-white/60">
                            {nearbyPeers.length} peers discovered nearby
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        {isScanning ? (
                          <Button
                            onClick={stopScanning}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            Stop Scanning
                          </Button>
                        ) : (
                          <Button
                            onClick={startScanning}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          >
                            <BluetoothSearching className="w-4 h-4 mr-2" />
                            Start Scanning
                          </Button>
                        )}
                        
                        <Button
                          onClick={handleJoinGroup}
                          disabled={connectedPeers.length === 0}
                          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Start Group Session
                        </Button>
                      </div>
                    </div>

                    {/* Connected Peers Banner */}
                    {connectedPeers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-8 p-4 rounded-xl bg-green-500/10 border border-green-500/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BluetoothConnected className="w-6 h-6 text-green-400" />
                            <span className="text-green-400 font-medium">
                              {connectedPeers.length} Peer{connectedPeers.length > 1 ? 's' : ''} Connected
                            </span>
                          </div>
                          <div className="flex -space-x-3">
                            {connectedPeers.slice(0, 5).map((peer, i) => (
                              <motion.div
                                key={peer.id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold border-2 border-slate-900"
                              >
                                {peer.avatar}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Nearby Peers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AnimatePresence mode="popLayout">
                        {nearbyPeers.map((peer, index) => (
                          <BluetoothPeerCard
                            key={peer.id}
                            peer={peer}
                            onConnect={handleConnect}
                            onCall={handleStartCall}
                            isConnecting={connectingPeerId === peer.id}
                            index={index}
                          />
                        ))}
                      </AnimatePresence>
                    </div>

                    {nearbyPeers.length === 0 && isScanning && (
                      <div className="text-center py-16">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Waves className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
                        </motion.div>
                        <p className="text-white/60">Searching for nearby peers...</p>
                        <p className="text-white/40 text-sm mt-2">
                          Make sure other peers have Bluetooth enabled
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {[
              {
                icon: Bluetooth,
                title: "Bluetooth Discovery",
                desc: "Find peers within 10m range",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Phone,
                title: "Voice Calls",
                desc: "Crystal clear P2P audio",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Users,
                title: "Group Therapy",
                desc: "Up to 8 participants",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Shield,
                title: "100% Private",
                desc: "No data leaves device",
                color: "from-orange-500 to-red-500"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                  style={{ 
                    background: `linear-gradient(135deg, ${feature.color.split(' ')[0].replace('from-', '')} 0%, ${feature.color.split(' ')[1].replace('to-', '')} 100%)` 
                  }}
                />
                <Card className="relative bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/60 text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {[
                { step: "1", title: "Enable Bluetooth", icon: Bluetooth },
                { step: "2", title: "Discover Peers", icon: BluetoothSearching },
                { step: "3", title: "Connect", icon: BluetoothConnected },
                { step: "4", title: "Start Therapy", icon: Heart }
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {step.step}
                      </div>
                    </div>
                    <p className="text-white/80 mt-3 font-medium">{step.title}</p>
                  </motion.div>
                  {i < 3 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="hidden md:block w-16 h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50"
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

      {/* Group Therapy Room Modal */}
      <GroupTherapyRoom
        isOpen={showGroupRoom}
        onClose={() => setShowGroupRoom(false)}
        connectedPeers={connectedPeers}
        groupName="Bluetooth Support Circle"
      />

      {/* Peer Communication Modal */}
      {selectedPeer && (
        <PeerCommunication
          peer={{
            id: selectedPeer.id,
            name: selectedPeer.name,
            avatar: selectedPeer.avatar,
            distance: `${Math.round(selectedPeer.distance)}m`,
            issue: selectedPeer.issue,
            isActive: true,
            isInCall: false,
            supportGroup: selectedPeer.supportGroup,
            joinedDate: "Recently"
          }}
          isOpen={showPeerCall}
          onClose={() => {
            setShowPeerCall(false);
            setSelectedPeer(null);
          }}
        />
      )}
    </div>
  );
};

export default PeerConnect;
