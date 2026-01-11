import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Custom service and characteristic UUIDs for our mesh network
const MESH_SERVICE_UUID = '00001820-0000-1000-8000-00805f9b34fb';
const MESH_CHARACTERISTIC_UUID = '00002a80-0000-1000-8000-00805f9b34fb';

export interface MeshPeer {
  id: string;
  name: string;
  deviceId: string;
  rssi: number;
  distance: number;
  isConnected: boolean;
  isRelay: boolean;
  hopCount: number;
  lastSeen: Date;
  status: 'online' | 'away' | 'busy';
  publicKey?: string;
}

export interface MeshMessage {
  id: string;
  from: string;
  to: string | 'broadcast';
  content: string;
  encrypted: boolean;
  ttl: number;
  hopCount: number;
  timestamp: Date;
  type: 'text' | 'presence' | 'discovery' | 'ack';
  signature?: string;
}

interface BluetoothMeshState {
  isSupported: boolean;
  isEnabled: boolean;
  isScanning: boolean;
  isAdvertising: boolean;
  peers: MeshPeer[];
  messages: MeshMessage[];
  myPeerId: string;
  myName: string;
  error: string | null;
}

// Simple encryption using SubtleCrypto
async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey', 'deriveBits']
  );
}

async function encryptMessage(message: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

async function decryptMessage(encryptedData: string, key: CryptoKey): Promise<string> {
  const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return new TextDecoder().decode(decrypted);
}

function generatePeerId(): string {
  return `peer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function rssiToDistance(rssi: number): number {
  // Approximate distance based on RSSI (in meters)
  const txPower = -59; // Assumed TX power at 1 meter
  if (rssi === 0) return -1;
  const ratio = rssi / txPower;
  if (ratio < 1.0) {
    return Math.pow(ratio, 10);
  }
  return 0.89976 * Math.pow(ratio, 7.7095) + 0.111;
}

export const useBluetoothMesh = () => {
  const { toast } = useToast();
  const [state, setState] = useState<BluetoothMeshState>({
    isSupported: false,
    isEnabled: false,
    isScanning: false,
    isAdvertising: false,
    peers: [],
    messages: [],
    myPeerId: generatePeerId(),
    myName: `User-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    error: null
  });

  const bluetoothDeviceRef = useRef<any>(null);
  const gattServerRef = useRef<any>(null);
  const characteristicRef = useRef<any>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageBufferRef = useRef<Map<string, MeshMessage>>(new Map());
  const encryptionKeyRef = useRef<CryptoKey | null>(null);
  const connectedDevicesRef = useRef<Map<string, any>>(new Map());

  // Check Bluetooth support
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported = 'bluetooth' in navigator;
      let isEnabled = false;

      if (isSupported) {
        try {
          const availability = await (navigator as any).bluetooth?.getAvailability?.();
          isEnabled = availability !== false;
        } catch {
          isEnabled = true; // Assume enabled if we can't check
        }
      }

      // Generate encryption key
      try {
        const keyMaterial = await crypto.subtle.generateKey(
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );
        encryptionKeyRef.current = keyMaterial;
      } catch (err) {
        console.error('Failed to generate encryption key:', err);
      }

      setState(prev => ({ ...prev, isSupported, isEnabled }));
    };

    checkSupport();

    // Listen for Bluetooth availability changes
    if ('bluetooth' in navigator) {
      (navigator as any).bluetooth?.addEventListener?.('availabilitychanged', (e: any) => {
        setState(prev => ({ ...prev, isEnabled: e.value }));
      });
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanning();
      disconnectAll();
    };
  }, []);

  const setMyName = useCallback((name: string) => {
    setState(prev => ({ ...prev, myName: name }));
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (!state.isSupported) {
        // Fall back to simulation mode
        setState(prev => ({ ...prev, isEnabled: true }));
        toast({
          title: "Demo Mode",
          description: "Bluetooth not supported. Using simulation mode.",
        });
        return true;
      }

      // Request Bluetooth device to trigger permission dialog
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [MESH_SERVICE_UUID, 'generic_access']
      });

      if (device) {
        bluetoothDeviceRef.current = device;
        setState(prev => ({ ...prev, isEnabled: true }));
        toast({
          title: "Bluetooth Enabled",
          description: "Ready to discover and connect with peers",
        });
        return true;
      }
      return false;
    } catch (err: any) {
      if (err.name === 'NotFoundError' || err.message?.includes('cancelled')) {
        // User cancelled - enable simulation mode
        setState(prev => ({ ...prev, isEnabled: true }));
        toast({
          title: "Demo Mode Activated",
          description: "Using simulated peer discovery",
        });
        return true;
      }
      setState(prev => ({ ...prev, error: err.message }));
      return false;
    }
  }, [state.isSupported, toast]);

  const connectToDevice = useCallback(async (device: any): Promise<boolean> => {
    try {
      if (!device.gatt) return false;

      const server = await device.gatt.connect();
      gattServerRef.current = server;

      // Try to get our custom service
      try {
        const service = await server.getPrimaryService(MESH_SERVICE_UUID);
        const characteristic = await service.getCharacteristic(MESH_CHARACTERISTIC_UUID);
        characteristicRef.current = characteristic;

        // Listen for incoming messages
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleIncomingData);

        connectedDevicesRef.current.set(device.id, device);
        return true;
      } catch {
        // Device doesn't have our service, still track as connected
        connectedDevicesRef.current.set(device.id, device);
        return true;
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      return false;
    }
  }, []);

  const handleIncomingData = useCallback((event: Event) => {
    const characteristic = event.target as any;
    const value = characteristic.value;
    if (!value) return;

    try {
      const decoder = new TextDecoder();
      const data = decoder.decode(value);
      const message: MeshMessage = JSON.parse(data);

      // Check if we've already processed this message
      if (messageBufferRef.current.has(message.id)) return;

      // Add to buffer with TTL
      messageBufferRef.current.set(message.id, message);

      // Remove from buffer after TTL expires (default 5 minutes)
      setTimeout(() => {
        messageBufferRef.current.delete(message.id);
      }, 5 * 60 * 1000);

      if (message.type === 'text') {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, message]
        }));
      } else if (message.type === 'presence') {
        handlePresenceMessage(message);
      } else if (message.type === 'discovery') {
        handleDiscoveryMessage(message);
      }

      // Relay message if TTL > 0 (mesh hopping)
      if (message.ttl > 0 && message.to === 'broadcast') {
        relayMessage({
          ...message,
          ttl: message.ttl - 1,
          hopCount: message.hopCount + 1
        });
      }
    } catch (err) {
      console.error('Failed to parse incoming message:', err);
    }
  }, []);

  const handlePresenceMessage = useCallback((message: MeshMessage) => {
    try {
      const presenceData = JSON.parse(message.content);
      setState(prev => {
        const existingPeerIndex = prev.peers.findIndex(p => p.id === message.from);
        if (existingPeerIndex >= 0) {
          const updatedPeers = [...prev.peers];
          updatedPeers[existingPeerIndex] = {
            ...updatedPeers[existingPeerIndex],
            ...presenceData,
            lastSeen: new Date(),
            hopCount: message.hopCount
          };
          return { ...prev, peers: updatedPeers };
        } else {
          return {
            ...prev,
            peers: [...prev.peers, {
              id: message.from,
              name: presenceData.name,
              deviceId: presenceData.deviceId || message.from,
              rssi: presenceData.rssi || -60,
              distance: rssiToDistance(presenceData.rssi || -60),
              isConnected: false,
              isRelay: message.hopCount > 0,
              hopCount: message.hopCount,
              lastSeen: new Date(),
              status: presenceData.status || 'online'
            }]
          };
        }
      });
    } catch (err) {
      console.error('Failed to parse presence message:', err);
    }
  }, []);

  const handleDiscoveryMessage = useCallback((message: MeshMessage) => {
    // Respond with our presence
    broadcastPresence();
  }, []);

  const relayMessage = useCallback(async (message: MeshMessage) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(message));

    connectedDevicesRef.current.forEach(async (device) => {
      try {
        if (device.gatt?.connected) {
          const server = device.gatt;
          const service = await server.getPrimaryService(MESH_SERVICE_UUID);
          const characteristic = await service.getCharacteristic(MESH_CHARACTERISTIC_UUID);
          await characteristic.writeValue(data);
        }
      } catch (err) {
        console.error('Failed to relay message:', err);
      }
    });
  }, []);

  const startScanning = useCallback(async () => {
    if (state.isScanning) return;

    setState(prev => ({ ...prev, isScanning: true, error: null }));

    try {
      if (state.isSupported && 'requestLEScan' in (navigator as any).bluetooth) {
        // Use Web Bluetooth Scanning API (if available)
        const options = {
          filters: [{ services: [MESH_SERVICE_UUID] }],
          keepRepeatedDevices: true
        };

        try {
          await (navigator as any).bluetooth.requestLEScan(options);
          (navigator as any).bluetooth.addEventListener('advertisementreceived', handleAdvertisement);
        } catch (err) {
          // Scanning API not available, use device request method
          startSimulatedDiscovery();
        }
      } else {
        // Use simulated discovery for unsupported browsers
        startSimulatedDiscovery();
      }

      // Broadcast our presence periodically
      broadcastPresence();
      const presenceInterval = setInterval(broadcastPresence, 5000);
      scanIntervalRef.current = presenceInterval;

      toast({
        title: "Scanning Started",
        description: "Looking for nearby peers...",
      });
    } catch (err: any) {
      setState(prev => ({ ...prev, isScanning: false, error: err.message }));
    }
  }, [state.isScanning, state.isSupported, toast]);

  const handleAdvertisement = useCallback((event: any) => {
    const { device, rssi, manufacturerData, serviceData } = event;

    setState(prev => {
      const existingPeer = prev.peers.find(p => p.deviceId === device.id);
      if (existingPeer) {
        return {
          ...prev,
          peers: prev.peers.map(p =>
            p.deviceId === device.id
              ? { ...p, rssi, distance: rssiToDistance(rssi), lastSeen: new Date() }
              : p
          )
        };
      }

      const newPeer: MeshPeer = {
        id: generatePeerId(),
        name: device.name || `Device-${device.id.substring(0, 6)}`,
        deviceId: device.id,
        rssi: rssi || -60,
        distance: rssiToDistance(rssi || -60),
        isConnected: false,
        isRelay: false,
        hopCount: 0,
        lastSeen: new Date(),
        status: 'online'
      };

      return { ...prev, peers: [...prev.peers, newPeer] };
    });
  }, []);

  const startSimulatedDiscovery = useCallback(() => {
    // Simulate discovering peers for demo purposes
    const simulatedPeers: Partial<MeshPeer>[] = [
      { name: 'Sarah M.', status: 'online', rssi: -45 },
      { name: 'James K.', status: 'online', rssi: -55 },
      { name: 'Maya P.', status: 'busy', rssi: -65 },
      { name: 'Alex R.', status: 'online', rssi: -48 },
      { name: 'Emma T.', status: 'away', rssi: -72 },
      { name: 'David L.', status: 'online', rssi: -58 }
    ];

    let discoveryIndex = 0;
    const discoveryInterval = setInterval(() => {
      if (discoveryIndex < simulatedPeers.length) {
        const simPeer = simulatedPeers[discoveryIndex];
        const rssi = simPeer.rssi! + Math.floor(Math.random() * 10 - 5);
        
        const newPeer: MeshPeer = {
          id: generatePeerId(),
          name: simPeer.name!,
          deviceId: `sim-${discoveryIndex}`,
          rssi,
          distance: rssiToDistance(rssi),
          isConnected: false,
          isRelay: Math.random() > 0.7,
          hopCount: Math.random() > 0.5 ? Math.floor(Math.random() * 3) : 0,
          lastSeen: new Date(),
          status: simPeer.status as 'online' | 'away' | 'busy'
        };

        setState(prev => ({
          ...prev,
          peers: [...prev.peers.filter(p => p.deviceId !== newPeer.deviceId), newPeer]
        }));

        discoveryIndex++;
      } else {
        // Update existing peers with new RSSI values
        setState(prev => ({
          ...prev,
          peers: prev.peers.map(p => ({
            ...p,
            rssi: p.rssi + Math.floor(Math.random() * 6 - 3),
            distance: rssiToDistance(p.rssi + Math.floor(Math.random() * 6 - 3)),
            lastSeen: new Date()
          }))
        }));
      }
    }, 1500);

    scanIntervalRef.current = discoveryInterval;
  }, []);

  const stopScanning = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    try {
      if ('bluetooth' in navigator) {
        (navigator as any).bluetooth?.removeEventListener?.('advertisementreceived', handleAdvertisement);
      }
    } catch {}

    setState(prev => ({ ...prev, isScanning: false }));
  }, [handleAdvertisement]);

  const broadcastPresence = useCallback(async () => {
    const presenceMessage: MeshMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      from: state.myPeerId,
      to: 'broadcast',
      content: JSON.stringify({
        name: state.myName,
        status: 'online',
        timestamp: Date.now()
      }),
      encrypted: false,
      ttl: 3, // Allow 3 hops
      hopCount: 0,
      timestamp: new Date(),
      type: 'presence'
    };

    await relayMessage(presenceMessage);
  }, [state.myPeerId, state.myName, relayMessage]);

  const connectToPeer = useCallback(async (peerId: string): Promise<boolean> => {
    const peer = state.peers.find(p => p.id === peerId);
    if (!peer) return false;

    setState(prev => ({
      ...prev,
      peers: prev.peers.map(p =>
        p.id === peerId ? { ...p, isConnected: true } : p
      )
    }));

    // Add system message
    const systemMessage: MeshMessage = {
      id: `msg-${Date.now()}`,
      from: 'system',
      to: 'local',
      content: `Connected to ${peer.name}${peer.hopCount > 0 ? ` (via ${peer.hopCount} relay${peer.hopCount > 1 ? 's' : ''})` : ''}`,
      encrypted: false,
      ttl: 0,
      hopCount: 0,
      timestamp: new Date(),
      type: 'text'
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, systemMessage]
    }));

    toast({
      title: "Connected!",
      description: `You're now connected to ${peer.name}`,
    });

    return true;
  }, [state.peers, toast]);

  const disconnectFromPeer = useCallback((peerId: string) => {
    const peer = state.peers.find(p => p.id === peerId);
    
    setState(prev => ({
      ...prev,
      peers: prev.peers.map(p =>
        p.id === peerId ? { ...p, isConnected: false } : p
      )
    }));

    if (peer) {
      toast({
        title: "Disconnected",
        description: `Disconnected from ${peer.name}`,
      });
    }
  }, [state.peers, toast]);

  const disconnectAll = useCallback(() => {
    connectedDevicesRef.current.forEach((device) => {
      device.gatt?.disconnect();
    });
    connectedDevicesRef.current.clear();
    gattServerRef.current = null;
    characteristicRef.current = null;

    setState(prev => ({
      ...prev,
      peers: prev.peers.map(p => ({ ...p, isConnected: false }))
    }));
  }, []);

  const sendMessage = useCallback(async (
    to: string | 'broadcast',
    content: string,
    encrypt: boolean = true
  ): Promise<boolean> => {
    try {
      let finalContent = content;
      
      if (encrypt && encryptionKeyRef.current) {
        finalContent = await encryptMessage(content, encryptionKeyRef.current);
      }

      const message: MeshMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        from: state.myPeerId,
        to,
        content: finalContent,
        encrypted: encrypt,
        ttl: 5, // Allow 5 hops for messages
        hopCount: 0,
        timestamp: new Date(),
        type: 'text'
      };

      // Store in local messages with decrypted content for display
      const displayMessage: MeshMessage = {
        ...message,
        content, // Original unencrypted content for local display
        from: state.myName
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, displayMessage]
      }));

      // Send through mesh network
      await relayMessage(message);

      return true;
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setState(prev => ({ ...prev, error: err.message }));
      return false;
    }
  }, [state.myPeerId, state.myName, relayMessage]);

  const getConnectedPeers = useCallback(() => {
    return state.peers.filter(p => p.isConnected);
  }, [state.peers]);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
  }, []);

  return {
    ...state,
    setMyName,
    requestPermission,
    startScanning,
    stopScanning,
    connectToPeer,
    disconnectFromPeer,
    disconnectAll,
    sendMessage,
    broadcastPresence,
    getConnectedPeers,
    clearMessages
  };
};
