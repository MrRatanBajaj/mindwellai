import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  Crown,
  Calendar,
  Zap,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const getPlanDetails = (planId: string) => {
    const plans: Record<string, { name: string; sessions: number; color: string }> = {
      'free-trial': { name: 'Free Trial', sessions: 3, color: 'from-slate-500 to-slate-600' },
      'basic': { name: 'Basic Plan', sessions: 8, color: 'from-blue-500 to-blue-600' },
      'premium': { name: 'Premium Plan', sessions: 999, color: 'from-violet-500 to-purple-600' },
    };
    return plans[planId] || { name: planId, sessions: 0, color: 'from-slate-500 to-slate-600' };
  };

  if (loading) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  if (!subscription) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-start justify-between">
          <div>
            <Crown className="w-10 h-10 mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Active Subscription</h3>
            <p className="text-white/80 mb-6">
              Choose a plan to start your mental wellness journey
            </p>
            <NavLink to="/plans">
              <Button className="bg-white text-violet-600 hover:bg-white/90">
                <Zap className="w-4 h-4 mr-2" />
                View Plans
              </Button>
            </NavLink>
          </div>
        </div>
      </motion.div>
    );
  }

  const planDetails = getPlanDetails(subscription.plan_id);
  const daysRemaining = differenceInDays(
    new Date(subscription.current_period_end),
    new Date()
  );
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;
  const sessionsProgress = planDetails.sessions === 999 
    ? 100 
    : ((planDetails.sessions - subscription.sessions_remaining) / planDetails.sessions) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${planDetails.color} rounded-2xl p-8 text-white`}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-6 h-6" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              {subscription.status === 'active' ? 'Active' : subscription.status}
            </span>
          </div>
          <h3 className="text-2xl font-bold">{planDetails.name}</h3>
        </div>

        {isExpiringSoon && !isExpired && (
          <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Expires soon</span>
          </div>
        )}
        {subscription.status === 'active' && !isExpired && !isExpiringSoon && (
          <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Active</span>
          </div>
        )}
      </div>

      {/* Sessions Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span>Sessions Used</span>
          <span>
            {planDetails.sessions === 999 
              ? 'Unlimited' 
              : `${planDetails.sessions - subscription.sessions_remaining}/${planDetails.sessions}`}
          </span>
        </div>
        <Progress 
          value={sessionsProgress} 
          className="h-2 bg-white/20"
        />
      </div>

      {/* Billing Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
            <Calendar className="w-4 h-4" />
            <span>Current Period</span>
          </div>
          <p className="font-semibold">
            {format(new Date(subscription.current_period_start), 'MMM dd')} - {format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
            <RefreshCw className="w-4 h-4" />
            <span>Next Renewal</span>
          </div>
          <p className="font-semibold">
            {isExpired ? 'Expired' : `${daysRemaining} days left`}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {subscription.plan_id !== 'premium' && (
          <NavLink to="/plans" className="flex-1">
            <Button className="w-full bg-white text-violet-600 hover:bg-white/90">
              <Zap className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </NavLink>
        )}
        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
          Manage Subscription
        </Button>
      </div>
    </motion.div>
  );
};

export default SubscriptionStatus;
