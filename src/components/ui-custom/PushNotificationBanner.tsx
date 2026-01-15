import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';

export function PushNotificationBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const { isSupported, isSubscribed, subscribe, isLoading, permissionState } = usePushNotifications();

  useEffect(() => {
    // Check if we should show the banner
    const hasDeclined = localStorage.getItem('push-notification-declined');
    const shouldShow = isSupported && !isSubscribed && permissionState !== 'denied' && !hasDeclined;
    
    // Show after 5 seconds
    if (shouldShow) {
      const timer = setTimeout(() => setIsVisible(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, isSubscribed, permissionState]);

  const handleSubscribe = async () => {
    try {
      await subscribe();
      toast.success('🎉 Notifications enabled! Ab tum miss nahi karoge kuch bhi.');
      setIsVisible(false);
    } catch (error) {
      console.error('Subscription error:', error);
      if (permissionState === 'denied') {
        toast.error('Please enable notifications in your browser settings');
      } else {
        toast.error('Could not enable notifications');
      }
    }
  };

  const handleDecline = () => {
    localStorage.setItem('push-notification-declined', 'true');
    setIsVisible(false);
  };

  if (!isSupported) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20">
            <button
              onClick={handleDecline}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Stay Connected! 🔔
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  Phone pe notifications lo - overthinking ka reminder, self-care tips, aur thoda humor 😌
                </p>
                
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="bg-white text-primary hover:bg-white/90 font-semibold"
                    size="sm"
                  >
                    {isLoading ? 'Enabling...' : 'Enable 🚀'}
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    size="sm"
                  >
                    Not now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
