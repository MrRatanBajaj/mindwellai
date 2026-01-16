import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MapPin, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLeadCapture } from '@/hooks/useLeadCapture';
import { toast } from 'sonner';

export function LeadCapturePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { submitLead, isSubmitting, hasSubmitted, locationData, trackAnonymousVisit } = useLeadCapture();

  useEffect(() => {
    // Don't show if already submitted
    if (hasSubmitted) return;

    // Check if dismissed recently (within 24 hours)
    const dismissedAt = localStorage.getItem('mindwell_lead_dismissed_at');
    if (dismissedAt) {
      const dismissedTime = new Date(dismissedAt).getTime();
      const now = Date.now();
      const hoursSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) return;
    }

    // Show popup after 5 seconds of being on the page
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    // Track anonymous visit after 3 seconds
    const visitTimer = setTimeout(() => {
      if (locationData) {
        trackAnonymousVisit();
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(visitTimer);
    };
  }, [hasSubmitted, locationData, trackAnonymousVisit]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('mindwell_lead_dismissed_at', new Date().toISOString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    const result = await submitLead({ email, name });
    
    if (result.success) {
      toast.success('Welcome to MindWell! 🎉', {
        description: 'Check your inbox for exclusive wellness tips'
      });
      setIsVisible(false);
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (hasSubmitted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-2xl border border-primary/20 shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
              
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors z-10"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              <div className="relative p-6 space-y-4">
                {/* Header */}
                <div className="text-center space-y-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground mb-2"
                  >
                    <Sparkles className="w-7 h-7" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-foreground">
                    Hey there! 👋
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Join 10,000+ people on their mental wellness journey
                  </p>
                </div>

                {/* Location indicator */}
                {locationData?.city && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Connecting from {locationData.city}, {locationData.country}</span>
                  </motion.div>
                )}

                {/* Benefits */}
                <div className="flex items-center justify-center gap-2 py-2">
                  <div className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                    <Gift className="w-3 h-3" />
                    <span>Free wellness tips</span>
                  </div>
                  <div className="text-xs bg-secondary/10 text-secondary-foreground px-3 py-1.5 rounded-full">
                    No spam 🙅
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background/50 border-primary/20 focus:border-primary"
                  />
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50 border-primary/20 focus:border-primary"
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                    ) : (
                      "Join the Community ✨"
                    )}
                  </Button>
                </form>

                {/* Privacy note */}
                <p className="text-[10px] text-center text-muted-foreground">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
