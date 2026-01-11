import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MeshMessage, MeshPeer } from '@/hooks/useBluetoothMesh';
import {
  Send,
  Lock,
  Unlock,
  Radio,
  Wifi,
  X,
  MessageCircle,
  Shield,
  Zap,
  Users
} from 'lucide-react';

interface BluetoothMeshChatProps {
  isOpen: boolean;
  onClose: () => void;
  messages: MeshMessage[];
  connectedPeers: MeshPeer[];
  onSendMessage: (to: string | 'broadcast', content: string, encrypt?: boolean) => Promise<boolean>;
  myName: string;
  myPeerId: string;
}

const BluetoothMeshChat: React.FC<BluetoothMeshChatProps> = ({
  isOpen,
  onClose,
  messages,
  connectedPeers,
  onSendMessage,
  myName,
  myPeerId
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [sendingTo, setSendingTo] = useState<string | 'broadcast'>('broadcast');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const success = await onSendMessage(sendingTo, newMessage.trim(), isEncrypted);
    if (success) {
      setNewMessage('');
    }
    setIsSending(false);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-4xl h-[85vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(59, 130, 246, 0)',
                      '0 0 20px 5px rgba(59, 130, 246, 0.3)',
                      '0 0 0 0 rgba(59, 130, 246, 0)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Radio className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    Mesh Chat
                    {isEncrypted && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        <Lock className="w-3 h-3 mr-1" />
                        E2E Encrypted
                      </Badge>
                    )}
                  </h2>
                  <p className="text-white/60 text-sm flex items-center gap-2">
                    <Wifi className="w-3 h-3" />
                    {connectedPeers.length} peers connected • No internet required
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Connected Peers Avatars */}
                <div className="flex -space-x-2 mr-4">
                  {connectedPeers.slice(0, 5).map((peer, i) => (
                    <motion.div
                      key={peer.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold border-2 border-slate-800"
                      title={peer.name}
                    >
                      {peer.name.charAt(0)}
                    </motion.div>
                  ))}
                  {connectedPeers.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold border-2 border-slate-800">
                      +{connectedPeers.length - 5}
                    </div>
                  )}
                </div>

                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features Bar */}
            <div className="flex items-center gap-4 mt-4">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Decentralized
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Zap className="w-3 h-3 mr-1" />
                Mesh Network
              </Badge>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                <Users className="w-3 h-3 mr-1" />
                P2P Direct
              </Badge>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="h-[calc(85vh-200px)] p-4">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => {
                  const isOwn = message.from === myName || message.from === myPeerId;
                  const isSystem = message.from === 'system';

                  if (isSystem) {
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center"
                      >
                        <span className="text-white/40 text-sm bg-white/5 px-4 py-2 rounded-full">
                          {message.content}
                        </span>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: isOwn ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : ''}`}>
                          <span className="text-white/60 text-xs font-medium">
                            {isOwn ? 'You' : message.from}
                          </span>
                          {message.hopCount > 0 && (
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs py-0">
                              {message.hopCount} hop{message.hopCount > 1 ? 's' : ''}
                            </Badge>
                          )}
                          {message.encrypted && (
                            <Lock className="w-3 h-3 text-green-400" />
                          )}
                        </div>
                        <motion.div
                          className={`p-4 rounded-2xl ${
                            isOwn
                              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                              : 'bg-white/10 text-white'
                          }`}
                          whileHover={{ scale: 1.01 }}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </motion.div>
                        <span className={`text-white/40 text-xs mt-1 block ${isOwn ? 'text-right' : ''}`}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-white/10 p-4 bg-black/30">
            <div className="flex items-center gap-3">
              {/* Send To Selector */}
              <select
                value={sendingTo}
                onChange={(e) => setSendingTo(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="broadcast">Everyone</option>
                {connectedPeers.map(peer => (
                  <option key={peer.id} value={peer.id}>{peer.name}</option>
                ))}
              </select>

              {/* Encryption Toggle */}
              <Button
                onClick={() => setIsEncrypted(!isEncrypted)}
                variant="ghost"
                size="icon"
                className={`${
                  isEncrypted 
                    ? 'text-green-400 hover:text-green-300 bg-green-500/10' 
                    : 'text-white/40 hover:text-white/60'
                }`}
                title={isEncrypted ? 'Encryption ON' : 'Encryption OFF'}
              >
                {isEncrypted ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </Button>

              {/* Message Input */}
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 pr-12 rounded-xl"
                  disabled={isSending}
                />
                <motion.div
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  animate={isSending ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isSending ? Infinity : 0 }}
                >
                  <MessageCircle className="w-4 h-4 text-white/30" />
                </motion.div>
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={!newMessage.trim() || isSending}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl px-6"
              >
                <Send className={`w-4 h-4 ${isSending ? 'animate-pulse' : ''}`} />
              </Button>
            </div>

            {/* Info Bar */}
            <div className="flex items-center justify-between mt-3 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Radio className="w-3 h-3" />
                Messages stored in RAM only • Auto-delete after 5 min
              </span>
              <span className="flex items-center gap-1">
                {isEncrypted && <Shield className="w-3 h-3 text-green-400" />}
                End-to-end encrypted
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BluetoothMeshChat;
