import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BluetoothPeer } from '@/hooks/useBluetoothPeer';
import { 
  Bluetooth, 
  Phone, 
  MessageCircle, 
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Circle,
  Waves,
  Radio
} from 'lucide-react';

interface BluetoothPeerCardProps {
  peer: BluetoothPeer;
  onConnect: (peerId: string) => void;
  onCall: (peer: BluetoothPeer) => void;
  isConnecting?: boolean;
  index: number;
}

const BluetoothPeerCard: React.FC<BluetoothPeerCardProps> = ({
  peer,
  onConnect,
  onCall,
  isConnecting,
  index
}) => {
  const getSignalIcon = (strength: number) => {
    if (strength > -50) return <SignalHigh className="w-4 h-4 text-green-500" />;
    if (strength > -65) return <SignalMedium className="w-4 h-4 text-yellow-500" />;
    if (strength > -75) return <SignalLow className="w-4 h-4 text-orange-500" />;
    return <Signal className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'in_call': return 'bg-red-500';
      case 'away': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'in_call': return 'In Call';
      case 'away': return 'Away';
      default: return 'Unknown';
    }
  };

  const distanceInMeters = Math.round(peer.distance * 100) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group"
    >
      {/* Bluetooth Signal Animation Ring */}
      <motion.div
        className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, ${peer.isConnected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)'} 0%, transparent 70%)`
        }}
      />
      
      {/* Pulsing Bluetooth Rings */}
      {peer.isConnected && (
        <>
          <motion.div
            className="absolute -inset-4 rounded-3xl border-2 border-green-400/30"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -inset-6 rounded-3xl border-2 border-green-400/20"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </>
      )}

      <div className={`relative bg-white rounded-xl border-2 overflow-hidden shadow-lg transition-all duration-300 ${
        peer.isConnected 
          ? 'border-green-400 shadow-green-100' 
          : 'border-slate-200 hover:border-blue-300 hover:shadow-blue-100'
      }`}>
        {/* Card Header with Bluetooth Badge */}
        <div className="relative bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {/* Avatar with Status */}
            <div className="relative">
              <motion.div
                className={`w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg ${
                  peer.status === 'available' ? 'ring-4 ring-green-400/50' : ''
                }`}
                animate={peer.isConnected ? {
                  boxShadow: [
                    '0 0 0 0 rgba(34, 197, 94, 0)',
                    '0 0 0 10px rgba(34, 197, 94, 0.3)',
                    '0 0 0 0 rgba(34, 197, 94, 0)'
                  ]
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              >
                {peer.avatar}
              </motion.div>
              
              {/* Status Indicator */}
              <motion.div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${getStatusColor(peer.status)} border-2 border-white flex items-center justify-center`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {peer.status === 'in_call' && (
                  <Phone className="w-2.5 h-2.5 text-white" />
                )}
              </motion.div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-800 truncate">{peer.name}</h3>
                <motion.div
                  animate={{ rotate: peer.isConnected ? 360 : 0 }}
                  transition={{ duration: 2, repeat: peer.isConnected ? Infinity : 0, ease: "linear" }}
                >
                  <Bluetooth className={`w-4 h-4 ${peer.isConnected ? 'text-green-500' : 'text-blue-400'}`} />
                </motion.div>
              </div>
              <p className="text-sm text-slate-500 truncate">{peer.issue}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Radio className="w-3 h-3" />
                  {distanceInMeters}m away
                </span>
                <span className="text-xs flex items-center gap-1">
                  {getSignalIcon(peer.signalStrength)}
                  {Math.abs(peer.signalStrength)} dBm
                </span>
              </div>
            </div>
          </div>

          {/* Connection Status Badge */}
          <Badge 
            className={`absolute top-2 right-2 ${
              peer.isConnected 
                ? 'bg-green-100 text-green-700 border-green-300' 
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}
          >
            {peer.isConnected ? (
              <span className="flex items-center gap-1">
                <Circle className="w-2 h-2 fill-green-500" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Waves className="w-3 h-3" />
                Nearby
              </span>
            )}
          </Badge>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="text-xs">
              {peer.supportGroup}
            </Badge>
            <span className="text-xs text-slate-400">
              {getStatusLabel(peer.status)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!peer.isConnected ? (
              <Button
                onClick={() => onConnect(peer.id)}
                disabled={isConnecting || peer.status === 'in_call'}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                size="sm"
              >
                {isConnecting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Bluetooth className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <>
                    <Bluetooth className="w-4 h-4 mr-1" />
                    Connect
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => onCall(peer)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  size="sm"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Signal Strength Indicator Bar */}
        <div className="h-1 bg-slate-100">
          <motion.div
            className={`h-full ${
              peer.signalStrength > -50 ? 'bg-green-500' :
              peer.signalStrength > -65 ? 'bg-yellow-500' :
              peer.signalStrength > -75 ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.min(100, Math.max(10, 100 + peer.signalStrength))}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BluetoothPeerCard;
