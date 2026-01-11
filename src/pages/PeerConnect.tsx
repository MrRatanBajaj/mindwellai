import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MeshPeerCard from "@/components/ui-custom/MeshPeerCard";
import BluetoothMeshChat from "@/components/ui-custom/BluetoothMeshChat";
import GroupTherapyRoom from "@/components/ui-custom/GroupTherapyRoom";
import { useBluetoothMesh, MeshPeer } from "@/hooks/useBluetoothMesh";
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
  MessageCircle,
  Lock,
  Wifi,
  WifiOff,
  Network,
  GitBranch,
  Edit3,
  Check
} from "lucide-react";

const PeerConnect = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    isSupported,
    isEnabled,
    isScanning,
    peers,
    messages,
    myPeerId,
    myName,
    error,
    setMyName,
    requestPermission,
    startScanning,
    stopScanning,
    connectToPeer,
    disconnectFromPeer,
    sendMessage,
    getConnectedPeers
  } = useBluetoothMesh();

  const [showGroupRoom, setShowGroupRoom] = useState(false);
  const [showMeshChat, setShowMeshChat] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState<MeshPeer | null>(null);
  const [connectingPeerId, setConnectingPeerId] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(myName);

  const connectedPeers = getConnectedPeers();
  const onlinePeers = peers.filter(p => p.status === 'online');

  useEffect(() => {
    if (isEnabled) {
      setHasPermission(true);
    }
  }, [isEnabled]);

  useEffect(() => {
    setTempName(myName);
  }, [myName]);

  const handleEnableBluetooth = async () => {
    const granted = await requestPermission();
    if (granted) {
      setHasPermission(true);
      await startScanning();
    }
  };

  const handleConnect = async (peerId: string) => {
    setConnectingPeerId(peerId);
    const success = await connectToPeer(peerId);
    setConnectingPeerId(null);
    
    if (success) {
      const peer = peers.find(p => p.id === peerId);
      if (peer) {
        setSelectedPeer(peer);
      }
    }
  };

  const handleStartChat = (peer: MeshPeer) => {
    setSelectedPeer(peer);
    setShowMeshChat(true);
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

  const handleSaveName = () => {
    if (tempName.trim()) {
      setMyName(tempName.trim());
      setIsEditingName(false);
      toast({
        title: "Name Updated",
        description: `You'll appear as "${tempName.trim()}" to other peers`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
      <Header />
      
      {/* Animated Mesh Network Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Mesh Network Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {[...Array(15)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="url(#meshGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}
        </svg>

        {/* Bluetooth Radar Animation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {isScanning && (
            <>
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute w-[600px] h-[600px] rounded-full border border-blue-400/20"
                  style={{ left: '-300px', top: '-300px' }}
                  animate={{
                    scale: [1, 2 + ring * 0.5, 1],
                    opacity: [0.4, 0, 0.4]
                  }}
                  transition={{
                    duration: 3 + ring,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: ring * 0.5
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Floating Nodes */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 80 - 40, 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Network className="w-5 h-5 text-blue-400" />
              </motion.div>
              <span className="text-blue-300 font-medium">Bluetooth Mesh Network</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs ml-2">
                No Internet Required
              </Badge>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-white">BitChat </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Peer Connect
              </span>
            </h1>
            
            <p className="text-xl text-white/60 max-w-3xl mx-auto mb-8">
              Decentralized, encrypted peer-to-peer communication using Bluetooth mesh networking. 
              Messages hop between devices, extending range beyond single connections. 
              <span className="text-blue-400 font-medium"> No servers. No internet. Complete privacy.</span>
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <Circle className="w-2 h-2 fill-green-400 mr-2" />
                {onlinePeers.length} Peers Online
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <BluetoothConnected className="w-4 h-4 mr-2" />
                {connectedPeers.length} Connected
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                <Radio className="w-4 h-4 mr-2" />
                {isScanning ? 'Scanning...' : 'Ready'}
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-4 py-2">
                <Lock className="w-4 h-4 mr-2" />
                E2E Encrypted
              </Badge>
            </div>
          </motion.div>

          {/* Main Control Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
              <CardContent className="p-8">
                {!hasPermission ? (
                  /* Permission Request UI */
                  <div className="text-center">
                    <motion.div
                      className="w-28 h-28 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative"
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(59, 130, 246, 0)',
                          '0 0 60px 20px rgba(59, 130, 246, 0.3)',
                          '0 0 0 0 rgba(59, 130, 246, 0)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Bluetooth className="w-14 h-14 text-white" />
                      <motion.div
                        className="absolute -inset-2 rounded-2xl border-2 border-blue-400/50"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    
                    <h2 className="text-3xl font-bold text-white mb-3">Enable Bluetooth Mesh</h2>
                    <p className="text-white/60 mb-8 max-w-lg mx-auto">
                      Join the decentralized mesh network to discover and connect with peers. 
                      Your messages are end-to-end encrypted and stored only in RAM.
                    </p>
                    
                    <Button
                      onClick={handleEnableBluetooth}
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-10 py-6 text-lg"
                    >
                      <Bluetooth className="w-6 h-6 mr-2" />
                      Enable Bluetooth Mesh
                    </Button>
                    
                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
                      {[
                        { icon: WifiOff, title: "Offline First", desc: "Works without internet" },
                        { icon: Lock, title: "E2E Encrypted", desc: "Secure communication" },
                        { icon: GitBranch, title: "Mesh Hopping", desc: "Extended range ~100m+" },
                        { icon: Shield, title: "RAM Only", desc: "Auto-delete messages" }
                      ].map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                            <feature.icon className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="text-left">
                            <p className="text-white font-medium text-sm">{feature.title}</p>
                            <p className="text-white/50 text-xs">{feature.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Active Mesh Network UI */
                  <div>
                    {/* User Identity & Controls */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold"
                          animate={{
                            boxShadow: isScanning ? [
                              '0 0 0 0 rgba(59, 130, 246, 0)',
                              '0 0 20px 5px rgba(59, 130, 246, 0.4)',
                              '0 0 0 0 rgba(59, 130, 246, 0)'
                            ] : 'none'
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          {myName.charAt(0).toUpperCase()}
                        </motion.div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {isEditingName ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={tempName}
                                  onChange={(e) => setTempName(e.target.value)}
                                  className="h-8 w-40 bg-white/10 border-white/20 text-white"
                                  onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                                  autoFocus
                                />
                                <Button size="sm" onClick={handleSaveName} className="h-8 bg-green-500 hover:bg-green-600">
                                  <Check className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <h3 className="text-xl font-bold text-white">{myName}</h3>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setIsEditingName(true)}
                                  className="h-6 px-2 text-white/50 hover:text-white"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                          </div>
                          <p className="text-white/50 text-sm flex items-center gap-2">
                            <Circle className="w-2 h-2 fill-green-400 text-green-400" />
                            Broadcasting on mesh network
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {isScanning ? (
                          <Button
                            onClick={stopScanning}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <BluetoothSearching className="w-4 h-4 mr-2 animate-pulse" />
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
                        
                        {connectedPeers.length > 0 && (
                          <>
                            <Button
                              onClick={() => setShowMeshChat(true)}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Open Chat ({messages.length})
                            </Button>
                            <Button
                              onClick={handleJoinGroup}
                              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                            >
                              <Users className="w-4 h-4 mr-2" />
                              Group Session
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Connected Peers Banner */}
                    <AnimatePresence>
                      {connectedPeers.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-8 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <motion.div
                                className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <BluetoothConnected className="w-5 h-5 text-green-400" />
                              </motion.div>
                              <div>
                                <span className="text-green-400 font-medium">
                                  {connectedPeers.length} Peer{connectedPeers.length > 1 ? 's' : ''} in Mesh
                                </span>
                                <p className="text-white/50 text-sm">
                                  Messages are relayed through {peers.filter(p => p.isRelay).length} relay nodes
                                </p>
                              </div>
                            </div>
                            <div className="flex -space-x-3">
                              {connectedPeers.slice(0, 6).map((peer, i) => (
                                <motion.div
                                  key={peer.id}
                                  initial={{ scale: 0, x: 20 }}
                                  animate={{ scale: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold border-2 border-slate-900"
                                  title={peer.name}
                                >
                                  {peer.name.charAt(0)}
                                </motion.div>
                              ))}
                              {connectedPeers.length > 6 && (
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm font-bold border-2 border-slate-900">
                                  +{connectedPeers.length - 6}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Nearby Peers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AnimatePresence mode="popLayout">
                        {peers.map((peer, index) => (
                          <MeshPeerCard
                            key={peer.id}
                            peer={peer}
                            onConnect={handleConnect}
                            onMessage={handleStartChat}
                            isConnecting={connectingPeerId === peer.id}
                            index={index}
                          />
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {peers.length === 0 && isScanning && (
                      <div className="text-center py-20">
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Radio className="w-20 h-20 text-blue-400/50 mx-auto mb-6" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2">Scanning for Peers...</h3>
                        <p className="text-white/60 max-w-md mx-auto">
                          Looking for nearby devices with Bluetooth enabled. 
                          Make sure others are broadcasting on the mesh network.
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-6">
                          {[1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              className="w-3 h-3 rounded-full bg-blue-400"
                              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
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
                icon: Network,
                title: "Mesh Network",
                desc: "Messages hop between devices",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Lock,
                title: "End-to-End Encrypted",
                desc: "AES-256 encryption",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: WifiOff,
                title: "No Internet",
                desc: "100% offline operation",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Shield,
                title: "RAM Storage",
                desc: "Auto-delete after 5 min",
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
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 rounded-2xl`} />
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

          {/* How Mesh Works */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">How Bluetooth Mesh Works</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      step: "1",
                      title: "Direct Connection",
                      desc: "Phones connect via BLE, forming a local network (~30m range)",
                      icon: Bluetooth
                    },
                    {
                      step: "2",
                      title: "Message Hopping",
                      desc: "If recipient isn't nearby, messages hop through other devices",
                      icon: GitBranch
                    },
                    {
                      step: "3",
                      title: "E2E Encryption",
                      desc: "All messages encrypted with AES-256, no central servers",
                      icon: Lock
                    },
                    {
                      step: "4",
                      title: "Auto Cleanup",
                      desc: "Messages stored in RAM only, auto-delete with TTL expiry",
                      icon: Shield
                    }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="relative text-center"
                    >
                      <div className="relative inline-block mb-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                          <item.icon className="w-10 h-10 text-blue-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {item.step}
                        </div>
                      </div>
                      <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                      <p className="text-white/60 text-sm">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Network Diagram */}
                <div className="mt-10 p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <span className="text-white/60 text-sm">Your Device</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-500" />
                      <span className="text-white/60 text-sm">Relay Node</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <span className="text-white/60 text-sm">Connected Peer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-500" />
                      <span className="text-white/60 text-sm">Discoverable</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />

      {/* Mesh Chat Modal */}
      <BluetoothMeshChat
        isOpen={showMeshChat}
        onClose={() => setShowMeshChat(false)}
        messages={messages}
        connectedPeers={connectedPeers}
        onSendMessage={sendMessage}
        myName={myName}
        myPeerId={myPeerId}
      />

      {/* Group Therapy Room Modal */}
      <GroupTherapyRoom
        isOpen={showGroupRoom}
        onClose={() => setShowGroupRoom(false)}
        connectedPeers={connectedPeers.map(p => ({
          id: p.id,
          name: p.name,
          avatar: p.name.charAt(0),
          distance: p.distance,
          signalStrength: p.rssi,
          issue: 'Peer Support',
          isConnected: true,
          isInCall: false,
          supportGroup: 'Mesh Network',
          lastSeen: p.lastSeen,
          status: p.status === 'online' ? 'available' : p.status === 'busy' ? 'busy' : 'away'
        }))}
        groupName="Bluetooth Mesh Support Circle"
      />
    </div>
  );
};

export default PeerConnect;
