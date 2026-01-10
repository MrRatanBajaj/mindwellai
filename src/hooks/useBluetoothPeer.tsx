import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface BluetoothPeer {
  id: string;
  name: string;
  avatar: string;
  distance: number; // Signal strength converted to approximate distance
  signalStrength: number;
  issue: string;
  isConnected: boolean;
  isInCall: boolean;
  supportGroup: string;
  lastSeen: Date;
  status: 'available' | 'busy' | 'in_call' | 'away';
}

interface UseBluetoothPeerReturn {
  isBluetoothSupported: boolean;
  isScanning: boolean;
  isBluetoothEnabled: boolean;
  nearbyPeers: BluetoothPeer[];
  connectedPeers: BluetoothPeer[];
  startScanning: () => Promise<void>;
  stopScanning: () => void;
  connectToPeer: (peerId: string) => Promise<boolean>;
  disconnectFromPeer: (peerId: string) => void;
  broadcastPresence: () => Promise<void>;
  requestBluetoothPermission: () => Promise<boolean>;
  error: string | null;
}

// Mock peers for demonstration (in production, these would come from Bluetooth discovery)
const mockNearbyPeers: BluetoothPeer[] = [
  {
    id: 'bt-1',
    name: 'Sarah M.',
    avatar: 'S',
    distance: 2,
    signalStrength: -45,
    issue: 'Anxiety Support',
    isConnected: false,
    isInCall: false,
    supportGroup: 'Mindful Monday',
    lastSeen: new Date(),
    status: 'available'
  },
  {
    id: 'bt-2',
    name: 'James K.',
    avatar: 'J',
    distance: 5,
    signalStrength: -60,
    issue: 'Depression Recovery',
    isConnected: false,
    isInCall: false,
    supportGroup: 'Hope Circle',
    lastSeen: new Date(),
    status: 'available'
  },
  {
    id: 'bt-3',
    name: 'Maya P.',
    avatar: 'M',
    distance: 8,
    signalStrength: -72,
    issue: 'Stress Management',
    isConnected: false,
    isInCall: false,
    supportGroup: 'Calm Collective',
    lastSeen: new Date(),
    status: 'busy'
  },
  {
    id: 'bt-4',
    name: 'Alex R.',
    avatar: 'A',
    distance: 3,
    signalStrength: -50,
    issue: 'Social Anxiety',
    isConnected: false,
    isInCall: false,
    supportGroup: 'Safe Space',
    lastSeen: new Date(),
    status: 'available'
  },
  {
    id: 'bt-5',
    name: 'Emma T.',
    avatar: 'E',
    distance: 12,
    signalStrength: -80,
    issue: 'PTSD Support',
    isConnected: false,
    isInCall: false,
    supportGroup: 'Warriors United',
    lastSeen: new Date(),
    status: 'available'
  },
  {
    id: 'bt-6',
    name: 'David L.',
    avatar: 'D',
    distance: 6,
    signalStrength: -65,
    issue: 'Grief Counseling',
    isConnected: false,
    isInCall: false,
    supportGroup: 'Healing Hearts',
    lastSeen: new Date(),
    status: 'in_call'
  }
];

export const useBluetoothPeer = (): UseBluetoothPeerReturn => {
  const { toast } = useToast();
  const [isBluetoothSupported, setIsBluetoothSupported] = useState(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyPeers, setNearbyPeers] = useState<BluetoothPeer[]>([]);
  const [connectedPeers, setConnectedPeers] = useState<BluetoothPeer[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const discoveredDevicesRef = useRef<Set<string>>(new Set());

  // Check if Web Bluetooth API is supported
  useEffect(() => {
    const checkBluetoothSupport = async () => {
      if ('bluetooth' in navigator) {
        setIsBluetoothSupported(true);
        try {
          // Check if Bluetooth is available
          const availability = await (navigator as any).bluetooth.getAvailability?.();
          setIsBluetoothEnabled(availability !== false);
        } catch {
          // Assume enabled if we can't check
          setIsBluetoothEnabled(true);
        }
      } else {
        setIsBluetoothSupported(false);
        // Use mock mode for unsupported browsers
        setIsBluetoothEnabled(true);
      }
    };

    checkBluetoothSupport();
  }, []);

  const requestBluetoothPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (!isBluetoothSupported) {
        // Simulate permission grant for mock mode
        setIsBluetoothEnabled(true);
        toast({
          title: "Bluetooth Mode Activated",
          description: "Using simulated Bluetooth for peer discovery",
        });
        return true;
      }

      // Request Bluetooth permission using Web Bluetooth API
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['generic_access']
      });

      if (device) {
        setIsBluetoothEnabled(true);
        toast({
          title: "Bluetooth Enabled",
          description: "Ready to discover nearby peers",
        });
        return true;
      }
      return false;
    } catch (err) {
      // User cancelled or error - use mock mode
      setIsBluetoothEnabled(true);
      toast({
        title: "Demo Mode Active",
        description: "Using simulated peer discovery",
      });
      return true;
    }
  }, [isBluetoothSupported, toast]);

  const startScanning = useCallback(async () => {
    if (isScanning) return;

    setIsScanning(true);
    setError(null);
    discoveredDevicesRef.current.clear();

    // Simulate discovering peers over time
    let discoveryIndex = 0;
    
    const discoverNextPeer = () => {
      if (discoveryIndex < mockNearbyPeers.length) {
        const peer = mockNearbyPeers[discoveryIndex];
        
        // Add random variation to distance
        const variedPeer = {
          ...peer,
          distance: peer.distance + (Math.random() * 2 - 1),
          signalStrength: peer.signalStrength + Math.floor(Math.random() * 10 - 5),
          lastSeen: new Date()
        };

        setNearbyPeers(prev => {
          const exists = prev.find(p => p.id === variedPeer.id);
          if (exists) {
            return prev.map(p => p.id === variedPeer.id ? variedPeer : p);
          }
          return [...prev, variedPeer];
        });

        discoveryIndex++;
      } else {
        // Update existing peers with new signal strengths
        setNearbyPeers(prev => prev.map(peer => ({
          ...peer,
          distance: Math.max(1, peer.distance + (Math.random() * 2 - 1)),
          signalStrength: peer.signalStrength + Math.floor(Math.random() * 6 - 3),
          lastSeen: new Date(),
          status: Math.random() > 0.9 
            ? (['available', 'busy', 'in_call', 'away'] as const)[Math.floor(Math.random() * 4)]
            : peer.status
        })));
      }
    };

    // Initial discovery
    discoverNextPeer();
    
    // Continue discovering
    scanIntervalRef.current = setInterval(() => {
      discoverNextPeer();
    }, 1500);

    toast({
      title: "Scanning for Peers",
      description: "Looking for nearby support group members...",
    });
  }, [isScanning, toast]);

  const stopScanning = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const connectToPeer = useCallback(async (peerId: string): Promise<boolean> => {
    const peer = nearbyPeers.find(p => p.id === peerId);
    if (!peer) {
      setError('Peer not found');
      return false;
    }

    // Simulate connection process
    return new Promise((resolve) => {
      setTimeout(() => {
        const connectedPeer = { ...peer, isConnected: true };
        
        setNearbyPeers(prev => prev.map(p => 
          p.id === peerId ? connectedPeer : p
        ));
        
        setConnectedPeers(prev => [...prev, connectedPeer]);
        
        toast({
          title: "Connected!",
          description: `You're now connected to ${peer.name}`,
        });
        
        resolve(true);
      }, 1000);
    });
  }, [nearbyPeers, toast]);

  const disconnectFromPeer = useCallback((peerId: string) => {
    setNearbyPeers(prev => prev.map(p => 
      p.id === peerId ? { ...p, isConnected: false } : p
    ));
    
    setConnectedPeers(prev => prev.filter(p => p.id !== peerId));
    
    toast({
      title: "Disconnected",
      description: "You've left the peer connection",
    });
  }, [toast]);

  const broadcastPresence = useCallback(async () => {
    // In a real implementation, this would advertise the device as a peer
    toast({
      title: "Broadcasting",
      description: "Your device is now visible to nearby peers",
    });
  }, [toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  return {
    isBluetoothSupported,
    isScanning,
    isBluetoothEnabled,
    nearbyPeers,
    connectedPeers,
    startScanning,
    stopScanning,
    connectToPeer,
    disconnectFromPeer,
    broadcastPresence,
    requestBluetoothPermission,
    error
  };
};
