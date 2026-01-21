import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bell, Sparkles, RefreshCw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Pre-defined Zomato-style notifications
const PRESET_NOTIFICATIONS = [
  {
    title: "WellMind AI 🧠",
    body: "Aaj ka din kaat lo… par khud ko mat kaato 😌 thoda sa check-in kar lo 🪁",
    category: "re-engagement"
  },
  {
    title: "Evening Reminder 🌙",
    body: "Raat = overthinking free trial 😵‍💫 Thoda mind ko pause de do.",
    category: "time-based"
  },
  {
    title: "Relationship Humor 💕",
    body: "Seen pe chhod diya? Mind ko bhi chhod dete hain aaj 😌",
    category: "humor"
  },
  {
    title: "Weekend Vibes ✨",
    body: "Weekend hai. Drama nahi, sirf thoda sukoon 😌",
    category: "weekend"
  },
  {
    title: "Self Care 💚",
    body: "Proud of you 👏 Aaj ka effort = green flag behavior 💚",
    category: "encouragement"
  },
  {
    title: "Check-in Time 🎯",
    body: "2 min ka break le lo - apne aap se baat karo 💭",
    category: "cta"
  }
];

export function NotificationAdmin() {
  const [title, setTitle] = useState('WellMind AI 🧠');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  const fetchSubscriberCount = async () => {
    setIsLoadingCount(true);
    try {
      const { count, error } = await supabase
        .from('push_subscriptions')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      setSubscriberCount(count || 0);
    } catch (error) {
      console.error('Error fetching count:', error);
      toast.error('Could not fetch subscriber count');
    } finally {
      setIsLoadingCount(false);
    }
  };

  const sendNotification = async () => {
    if (!title || !body) {
      toast.error('Please enter title and message');
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          notification: {
            title,
            body,
            icon: '/favicon.ico',
            tag: 'mindwell-admin',
            data: { url: '/' }
          }
        }
      });

      if (error) throw error;

      toast.success(`🚀 Notification sent to ${data.successful || 0} subscribers!`);
      console.log('Send result:', data);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  const usePreset = (preset: typeof PRESET_NOTIFICATIONS[0]) => {
    setTitle(preset.title);
    setBody(preset.body);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notification Admin
        </CardTitle>
        <CardDescription>
          Send Zomato-style notifications to all subscribers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subscriber count */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">
              {subscriberCount !== null ? `${subscriberCount} subscribers` : 'Click to check'}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchSubscriberCount} disabled={isLoadingCount}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoadingCount ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Preset notifications */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Quick Presets
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {PRESET_NOTIFICATIONS.map((preset, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => usePreset(preset)}
                className="p-2 text-xs text-left bg-muted hover:bg-muted/80 rounded-lg border border-border transition-colors"
              >
                <span className="font-medium block truncate">{preset.title}</span>
                <span className="text-muted-foreground truncate block">{preset.body.slice(0, 30)}...</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom notification form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title..."
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Message (Hinglish + Emojis encouraged! 😌)</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your Gen-Z friendly notification..."
              className="mt-1 min-h-[100px]"
            />
          </div>
        </div>

        {/* Preview */}
        {(title || body) && (
          <div className="p-4 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-xl text-white">
            <p className="text-xs text-zinc-400 mb-2">Preview:</p>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{title || 'Title'}</p>
                <p className="text-sm text-zinc-300">{body || 'Message...'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Send button */}
        <Button 
          onClick={sendNotification} 
          disabled={isSending || !title || !body}
          className="w-full"
          size="lg"
        >
          {isSending ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send to All Subscribers
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
