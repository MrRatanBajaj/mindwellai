import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const VAPID_PUBLIC_KEY = 'BLBz-YrPwL4iFBqzYSgGj6gy4M1qYNDxLtCZN8xBVqBELqpXKPuqBQPDqZGTtmvPJqRVvAKjQVpGvQfYqN9QXZI';

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(supported);
      
      if ('Notification' in window) {
        setPermissionState(Notification.permission);
      }
    };
    
    checkSupport();
  }, []);

  useEffect(() => {
    const getExistingSubscription = async () => {
      if (!isSupported) return;
      
      try {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription = await registration.pushManager.getSubscription();
        setSubscription(existingSubscription);
      } catch (error) {
        console.error('Error getting existing subscription:', error);
      }
    };
    
    getExistingSubscription();
  }, [isSupported]);

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      throw new Error('Push notifications are not supported');
    }
    
    setIsLoading(true);
    
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }
      
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      
      // Subscribe to push
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
      
      setSubscription(pushSubscription);
      
      // Save to database
      const subscriptionJson = pushSubscription.toJSON();
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user?.id || null,
          endpoint: subscriptionJson.endpoint!,
          p256dh_key: subscriptionJson.keys?.p256dh || '',
          auth_key: subscriptionJson.keys?.auth || '',
          device_info: navigator.userAgent
        }, {
          onConflict: 'endpoint'
        });
      
      if (error) {
        console.error('Error saving subscription:', error);
        throw error;
      }
      
      return pushSubscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, user]);

  const unsubscribe = useCallback(async () => {
    if (!subscription) return;
    
    setIsLoading(true);
    
    try {
      await subscription.unsubscribe();
      
      // Remove from database
      const subscriptionJson = subscription.toJSON();
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', subscriptionJson.endpoint!);
      
      setSubscription(null);
    } catch (error) {
      console.error('Error unsubscribing:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  return {
    isSupported,
    subscription,
    permissionState,
    isLoading,
    subscribe,
    unsubscribe,
    isSubscribed: !!subscription
  };
}
