import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  Crown, Calendar, Zap, MessageSquare, Mic, Video,
  AlertCircle, CheckCircle, XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { isFounder } from "@/lib/founderAccess";
import { getPlan, type Plan } from "@/lib/pricing";

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  sessions_remaining: number;
  current_period_start: string;
  current_period_end: string;
}

const SubscriptionStatus = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [videoSecondsUsed, setVideoSecondsUsed] = useState(0);
  const [audioSecondsUsed, setAudioSecondsUsed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      try {
        const { data: sub } = await supabase
          .from("subscriptions").select("*")
          .eq("user_id", user.id).maybeSingle();
        setSubscription(sub as Subscription | null);

        if (sub) {
          const start = (sub as any).current_period_start || new Date().toISOString();
          const [v, a] = await Promise.all([
            supabase.from("video_usage").select("seconds")
              .eq("user_id", user.id).gte("started_at", start),
            supabase.from("audio_usage" as any).select("seconds")
              .eq("user_id", user.id).gte("started_at", start),
          ]);
          setVideoSecondsUsed((v.data ?? []).reduce((s, r: any) => s + (r.seconds ?? 0), 0));
          setAudioSecondsUsed((a.data ?? []).reduce((s, r: any) => s + (r.seconds ?? 0), 0));
        }
      } catch (e) {
        console.error("sub fetch", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleCancel = async () => {
    if (!subscription || !user) return;
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        sessions_remaining: 0,
        current_period_end: new Date().toISOString(),
      })
      .eq("user_id", user.id);
    if (error) return toast.error("Could not cancel. Please try again.");
    toast.success("Subscription cancelled.");
    setSubscription({ ...subscription, status: "cancelled", sessions_remaining: 0 });
  };

  if (loading) return <Skeleton className="h-64 w-full rounded-3xl" />;

  if (isFounder(user?.email)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-8 bg-gradient-to-br from-amber-500 via-orange-500 to-pink-600 text-white"
      >
        <Crown className="w-10 h-10 mb-4" />
        <h3 className="font-display text-2xl mb-2">Founder Access</h3>
        <p className="text-white/90">Unlimited access — no plan required.</p>
      </motion.div>
    );
  }

  const isCancelled = subscription?.status === "cancelled";
  if (!subscription || isCancelled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-10 bg-card border border-border text-center"
      >
        <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-display text-2xl mb-2">
          {isCancelled ? "Subscription Cancelled" : "No Active Subscription"}
        </h3>
        <p className="text-muted-foreground mb-6">
          Start with our ₹99/week plan — unlimited chat + voice & video therapy.
        </p>
        <NavLink to="/plans">
          <Button size="lg" className="rounded-full">
            <Zap className="w-4 h-4 mr-2" /> View Plans
          </Button>
        </NavLink>
      </motion.div>
    );
  }

  const plan: Plan | undefined = getPlan(subscription.plan_id);
  const daysRemaining = differenceInDays(new Date(subscription.current_period_end), new Date());
  const isExpiringSoon = daysRemaining <= 2 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  const vMax = (plan?.quota.videoMinutes ?? 0) * 60;
  const aMax = (plan?.quota.audioMinutes ?? 0) * 60;
  const vPct = vMax ? Math.min(100, (videoSecondsUsed / vMax) * 100) : 0;
  const aPct = aMax ? Math.min(100, (audioSecondsUsed / aMax) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-card border border-border overflow-hidden"
    >
      {/* Header band */}
      <div className="p-7 bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
              {subscription.status === "active" ? "Active" : subscription.status}
            </span>
            <h3 className="font-display text-3xl mt-2">{plan?.name || subscription.plan_id}</h3>
            <p className="text-sm opacity-90 mt-1">{plan?.tagline}</p>
          </div>
          {isExpiringSoon && (
            <span className="inline-flex items-center gap-1.5 bg-amber-500/30 px-3 py-1.5 rounded-full text-xs">
              <AlertCircle className="w-3.5 h-3.5" /> Expires soon
            </span>
          )}
          {!isExpiringSoon && !isExpired && (
            <span className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-xs">
              <CheckCircle className="w-3.5 h-3.5" /> {daysRemaining}d left
            </span>
          )}
        </div>
      </div>

      {/* Quota panels */}
      <div className="p-7 space-y-5">
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-secondary/40 p-4">
            <div className="flex items-center gap-2 text-sm font-medium mb-1.5">
              <MessageSquare className="w-4 h-4 text-primary" /> Chat
            </div>
            <p className="text-xs text-muted-foreground">Unlimited</p>
          </div>
          <div className="rounded-2xl bg-secondary/40 p-4">
            <div className="flex items-center gap-2 text-sm font-medium mb-1.5">
              <Mic className="w-4 h-4 text-primary" /> Voice
            </div>
            <Progress value={aPct} className="h-1.5 mb-1" />
            <p className="text-xs text-muted-foreground">
              {Math.round(audioSecondsUsed / 60)} / {plan?.quota.audioMinutes ?? 0} min used
            </p>
          </div>
          <div className="rounded-2xl bg-secondary/40 p-4">
            <div className="flex items-center gap-2 text-sm font-medium mb-1.5">
              <Video className="w-4 h-4 text-primary" /> Video
            </div>
            <Progress value={vPct} className="h-1.5 mb-1" />
            <p className="text-xs text-muted-foreground">
              {Math.round(videoSecondsUsed / 60)} / {plan?.quota.videoMinutes ?? 0} min used
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 p-4 flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {format(new Date(subscription.current_period_start), "MMM dd")} →{" "}
            {format(new Date(subscription.current_period_end), "MMM dd, yyyy")}
          </span>
          <span className="ml-auto font-medium">
            {isExpired ? "Expired" : `${daysRemaining}d remaining`}
          </span>
        </div>

        <div className="flex gap-3">
          {subscription.plan_id !== "pro_ultimate" && (
            <NavLink to="/plans" className="flex-1">
              <Button className="w-full rounded-full">
                <Zap className="w-4 h-4 mr-2" /> Upgrade
              </Button>
            </NavLink>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="rounded-full">
                <XCircle className="w-4 h-4 mr-2" /> Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your access ends immediately. You can resubscribe anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep plan</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel}>Yes, cancel</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionStatus;
