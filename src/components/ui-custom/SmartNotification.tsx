import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Sparkles, Heart, Moon, Coffee, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NotificationData {
  id: string;
  message: string;
  cta: string;
  ctaLink: string;
  icon: "bell" | "sparkles" | "heart" | "moon" | "coffee" | "zap";
  type: "reengagement" | "mood" | "time" | "relationship" | "achievement" | "weekend";
}

const getTimeBasedNotification = (): NotificationData | null => {
  const hour = new Date().getHours();
  const day = new Date().getDay();
  const isWeekend = day === 0 || day === 6;
  
  // Weekend notifications
  if (isWeekend) {
    const weekendNotifications: NotificationData[] = [
      {
        id: "weekend-1",
        message: "Weekend hai. Drama nahi, sirf thoda sukoon 😌",
        cta: "2 min ka break le lo",
        ctaLink: "/ai-voice-therapy",
        icon: "coffee",
        type: "weekend"
      },
      {
        id: "weekend-2",
        message: "Chill karo yaar! Overthinking ka subscription cancel karo 🧘",
        cta: "Bas ek check-in",
        ctaLink: "/ai-audio-call",
        icon: "sparkles",
        type: "weekend"
      }
    ];
    return weekendNotifications[Math.floor(Math.random() * weekendNotifications.length)];
  }
  
  // Morning (6 AM - 11 AM)
  if (hour >= 6 && hour < 11) {
    const morningNotifications: NotificationData[] = [
      {
        id: "morning-1",
        message: "Good morning! Aaj ka goal: Khud ke liye 5 min nikalna ☀️",
        cta: "Quick check-in karo",
        ctaLink: "/self-help",
        icon: "coffee",
        type: "time"
      },
      {
        id: "morning-2",
        message: "Subah subah positive vibes only! Chai ki tarah warm feel lo 🍵",
        cta: "Aaj ka mood set karo",
        ctaLink: "/ai-voice-therapy",
        icon: "heart",
        type: "time"
      }
    ];
    return morningNotifications[Math.floor(Math.random() * morningNotifications.length)];
  }
  
  // Afternoon (11 AM - 5 PM)
  if (hour >= 11 && hour < 17) {
    const afternoonNotifications: NotificationData[] = [
      {
        id: "afternoon-1",
        message: "Lunch break mein thoda mental break bhi le lo 🥗",
        cta: "2 min ka breather",
        ctaLink: "/self-help",
        icon: "zap",
        type: "time"
      },
      {
        id: "afternoon-2",
        message: "Meeting stress? Boss ka drama? Yahan sab theek hai 😌",
        cta: "Vent it out",
        ctaLink: "/ai-audio-call",
        icon: "sparkles",
        type: "time"
      }
    ];
    return afternoonNotifications[Math.floor(Math.random() * afternoonNotifications.length)];
  }
  
  // Evening (5 PM - 10 PM)
  if (hour >= 17 && hour < 22) {
    const eveningNotifications: NotificationData[] = [
      {
        id: "evening-1",
        message: "Raat = overthinking free trial 😵‍💫 Thoda mind ko pause de do",
        cta: "Bas ek check-in",
        ctaLink: "/ai-voice-therapy",
        icon: "moon",
        type: "time"
      },
      {
        id: "evening-2",
        message: "Day khatam ho raha hai, par tum amazing ho 💜",
        cta: "Self-love moment le lo",
        ctaLink: "/journal",
        icon: "heart",
        type: "time"
      },
      {
        id: "evening-3",
        message: "Seen pe chhod diya? Mind ko bhi chhod dete hain aaj 😌",
        cta: "Thoda unwind karo",
        ctaLink: "/ai-audio-call",
        icon: "sparkles",
        type: "relationship"
      }
    ];
    return eveningNotifications[Math.floor(Math.random() * eveningNotifications.length)];
  }
  
  // Late night (10 PM - 6 AM)
  const lateNightNotifications: NotificationData[] = [
    {
      id: "night-1",
      message: "Late night? Neend nahi aa rahi? Koi baat nahi, hum hain na 🌙",
      cta: "Thoda relax karo",
      ctaLink: "/ai-voice-therapy",
      icon: "moon",
      type: "time"
    },
    {
      id: "night-2",
      message: "3 baje overthinking? Yaar, ab so ja 😴 Par pehle sun lo...",
      cta: "Calm down session",
      ctaLink: "/ai-audio-call",
      icon: "moon",
      type: "time"
    }
  ];
  return lateNightNotifications[Math.floor(Math.random() * lateNightNotifications.length)];
};

const getReengagementNotification = (daysInactive: number): NotificationData | null => {
  if (daysInactive < 2) return null;
  
  const notifications: NotificationData[] = [
    {
      id: "reeng-1",
      message: `${daysInactive} din ho gaye! Yaad aa rahe the tum 🥺`,
      cta: "Wapas aao yaar",
      ctaLink: "/ai-voice-therapy",
      icon: "heart",
      type: "reengagement"
    },
    {
      id: "reeng-2",
      message: "Aaj ka din kaat lo... par khud ko mat kaato 😌 thoda sa check-in kar lo",
      cta: "2 min ka break",
      ctaLink: "/ai-audio-call",
      icon: "sparkles",
      type: "reengagement"
    },
    {
      id: "reeng-3",
      message: "Ghosting theek nahi hai... apne aap ko bhi nahi 👻",
      cta: "Quick hello karo",
      ctaLink: "/self-help",
      icon: "bell",
      type: "reengagement"
    }
  ];
  
  return notifications[Math.floor(Math.random() * notifications.length)];
};

const getRandomFunNotification = (): NotificationData => {
  const funNotifications: NotificationData[] = [
    {
      id: "fun-1",
      message: "Toxic ex nahi, toxic thoughts drop karo 🚮",
      cta: "Mind cleanse karo",
      ctaLink: "/ai-voice-therapy",
      icon: "zap",
      type: "relationship"
    },
    {
      id: "fun-2",
      message: "Red flags ignore karna band karo... apne emotions ke bhi 🚩",
      cta: "Thoda feel karo",
      ctaLink: "/journal",
      icon: "heart",
      type: "relationship"
    },
    {
      id: "fun-3",
      message: "Rishte complicated? At least self-love simple rakh lo 💜",
      cta: "Self-care time",
      ctaLink: "/self-help",
      icon: "sparkles",
      type: "relationship"
    },
    {
      id: "fun-4",
      message: "Proud of you 👏 Iss app ko open karna bhi green flag behavior hai 💚",
      cta: "Keep it up!",
      ctaLink: "/ai-audio-call",
      icon: "heart",
      type: "achievement"
    },
    {
      id: "fun-5",
      message: "Plot twist: You deserve happiness 🎬",
      cta: "Apna moment le lo",
      ctaLink: "/ai-voice-therapy",
      icon: "sparkles",
      type: "mood"
    }
  ];
  
  return funNotifications[Math.floor(Math.random() * funNotifications.length)];
};

const iconMap = {
  bell: Bell,
  sparkles: Sparkles,
  heart: Heart,
  moon: Moon,
  coffee: Coffee,
  zap: Zap
};

const SmartNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if notification was already shown today
    const lastShown = localStorage.getItem("smartNotificationLastShown");
    const today = new Date().toDateString();
    
    if (lastShown === today) {
      return; // Don't show notification if already shown today
    }
    
    // Get last visit date to calculate inactive days
    const lastVisit = localStorage.getItem("lastVisitDate");
    const now = new Date();
    let daysInactive = 0;
    
    if (lastVisit) {
      const lastVisitDate = new Date(lastVisit);
      daysInactive = Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    
    // Update last visit date
    localStorage.setItem("lastVisitDate", now.toISOString());
    
    // Determine which notification to show
    let selectedNotification: NotificationData | null = null;
    
    // Priority: Re-engagement > Time-based > Random fun
    if (daysInactive >= 3) {
      selectedNotification = getReengagementNotification(daysInactive);
    }
    
    if (!selectedNotification) {
      selectedNotification = getTimeBasedNotification();
    }
    
    if (!selectedNotification) {
      selectedNotification = getRandomFunNotification();
    }
    
    setNotification(selectedNotification);
    
    // Show notification after a small delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      localStorage.setItem("smartNotificationLastShown", today);
    }, 2000);
    
    // Auto-hide after 15 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 17000);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);
  
  const handleCTAClick = () => {
    if (notification?.ctaLink) {
      navigate(notification.ctaLink);
    }
    setIsVisible(false);
  };
  
  const handleDismiss = () => {
    setIsVisible(false);
  };
  
  if (!notification) return null;
  
  const IconComponent = iconMap[notification.icon];
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border border-white/10">
            {/* Animated gradient background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 animate-pulse" />
            </div>
            
            {/* Content */}
            <div className="relative p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-xs font-medium text-purple-300">WellMind AI</p>
                    <p className="text-[10px] text-white/50">just now</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>
              
              {/* Message */}
              <p className="text-sm md:text-base font-medium mb-4 leading-relaxed">
                {notification.message}
              </p>
              
              {/* CTA Button */}
              <Button
                onClick={handleCTAClick}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/25"
              >
                {notification.cta}
              </Button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-full blur-xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmartNotification;
