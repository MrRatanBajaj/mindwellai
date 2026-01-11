import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MeshPeer } from '@/hooks/useBluetoothMesh';
import {
  Bluetooth,
  BluetoothConnected,
  Radio,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Wifi,
  WifiOff,
  MessageCircle,
  Phone,
  Circle,
  Loader2,
  Zap,
  Shield
} from 'lucide-react';

interface MeshPeerCardProps {
  peer: MeshPeer;
  onConnect: (peerId: string) => void;
  onMessage: (peer: MeshPeer) => void;
  isConnecting: boolean;
  index: number;
}

const MeshPeerCard: React.FC<MeshPeerCardProps> = ({
  peer,
  onConnect,
  onMessage,
  isConnecting,
  index
}) => {
  const getSignalIcon = () => {
    if (peer.rssi >= -50) return SignalHigh;
    if (peer.rssi >= -65) return SignalMedium;
    return SignalLow;
  };

  const getSignalColor = () => {
    if (peer.rssi >= -50) return 'text-green-400';
    if (peer.rssi >= -65) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = () => {
    switch (peer.status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-orange-500';
      case 'away': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const SignalIcon = getSignalIcon();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
      className="group relative"
    >
      {/* Glow Effect */}
      <motion.div
        className={`absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl ${
          peer.isConnected 
            ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30' 
            : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20'
        }`}
      />

      <div className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
        peer.isConnected 
          ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/30' 
          : 'bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-500/50'
      }`}>
        {/* Signal Waves Animation */}
        {peer.isConnected && (
          <div className="absolute top-4 right-4">
            <motion.div
              className="absolute w-8 h-8 rounded-full border border-green-400/50"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-8 h-8 rounded-full border border-green-400/30"
              animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </div>
        )}

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <motion.div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold ${
                  peer.isConnected 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-600' 
                    : 'bg-gradient-to-br from-blue-400 to-purple-600'
                }`}
                animate={peer.isConnected ? {
                  boxShadow: [
                    '0 0 0 0 rgba(34, 197, 94, 0)',
                    '0 0 20px 5px rgba(34, 197, 94, 0.3)',
                    '0 0 0 0 rgba(34, 197, 94, 0)'
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {peer.name.charAt(0)}
              </motion.div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold">{peer.name}</h3>
                  <span className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                </div>
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <SignalIcon className={`w-4 h-4 ${getSignalColor()}`} />
                  <span>{peer.distance.toFixed(1)}m away</span>
                </div>
              </div>
            </div>

            {/* Connection Status */}
            {peer.isConnected ? (
              <BluetoothConnected className="w-6 h-6 text-green-400" />
            ) : (
              <Bluetooth className="w-6 h-6 text-blue-400/50" />
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-white/40 text-xs">RSSI</p>
              <p className={`font-semibold ${getSignalColor()}`}>{peer.rssi} dBm</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-white/40 text-xs">Hops</p>
              <p className="text-white font-semibold">{peer.hopCount}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-white/40 text-xs">Status</p>
              <p className="text-white font-semibold capitalize">{peer.status}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {peer.isRelay && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                <Radio className="w-3 h-3 mr-1" />
                Relay Node
              </Badge>
            )}
            {peer.hopCount === 0 && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Direct
              </Badge>
            )}
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Encrypted
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {peer.isConnected ? (
              <>
                <Button
                  onClick={() => onMessage(peer)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button
                  variant="outline"
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => onConnect(peer.id)}
                disabled={isConnecting || peer.status !== 'online'}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Bluetooth className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className={`h-1 ${
          peer.isConnected 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-blue-500 to-purple-500'
        }`} />
      </div>
    </motion.div>
  );
};

export default MeshPeerCard;
