import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface PeerPresence {
  user_id: string;
  name: string;
  online_at: string;
  status: 'available' | 'busy' | 'in_call' | 'away';
  location?: {
    lat: number;
    lng: number;
  };
}

interface UsePeerPresenceReturn {
  onlineUsers: PeerPresence[];
  updateStatus: (status: PeerPresence['status']) => Promise<void>;
  updateLocation: (lat: number, lng: number) => Promise<void>;
  isConnected: boolean;
}

export const usePeerPresence = (channelName: string = 'global_presence'): UsePeerPresenceReturn => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<PeerPresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<any>(null);
  const currentStatusRef = useRef<PeerPresence['status']>('available');
  const currentLocationRef = useRef<{ lat: number; lng: number } | undefined>();

  useEffect(() => {
    if (!user) return;

    const initializePresence = async () => {
      // Create channel
      channelRef.current = supabase.channel(channelName);

      // Set up presence listeners
      channelRef.current
        .on('presence', { event: 'sync' }, () => {
          const presenceState = channelRef.current.presenceState();
          const users: PeerPresence[] = [];
          
          Object.keys(presenceState).forEach(key => {
            const presences = presenceState[key];
            presences.forEach((presence: any) => {
              if (presence.user_id !== user.id) {
                users.push(presence);
              }
            });
          });
          
          setOnlineUsers(users);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            // Track initial presence
            const initialPresence: PeerPresence = {
              user_id: user.id,
              name: user.email?.split('@')[0] || 'User',
              online_at: new Date().toISOString(),
              status: 'available',
              location: currentLocationRef.current
            };

            await channelRef.current.track(initialPresence);
            setIsConnected(true);
          }
        });
    };

    initializePresence();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [user, channelName]);

  const updateStatus = async (status: PeerPresence['status']) => {
    if (!channelRef.current || !user) return;

    currentStatusRef.current = status;
    
    const updatedPresence: PeerPresence = {
      user_id: user.id,
      name: user.email?.split('@')[0] || 'User',
      online_at: new Date().toISOString(),
      status,
      location: currentLocationRef.current
    };

    await channelRef.current.track(updatedPresence);
  };

  const updateLocation = async (lat: number, lng: number) => {
    if (!channelRef.current || !user) return;

    currentLocationRef.current = { lat, lng };
    
    const updatedPresence: PeerPresence = {
      user_id: user.id,
      name: user.email?.split('@')[0] || 'User',
      online_at: new Date().toISOString(),
      status: currentStatusRef.current,
      location: { lat, lng }
    };

    await channelRef.current.track(updatedPresence);
  };

  return {
    onlineUsers,
    updateStatus,
    updateLocation,
    isConnected
  };
};