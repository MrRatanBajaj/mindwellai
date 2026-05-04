import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface SubscriptionRouteProps {
  children: ReactNode;
}

/**
 * Gate: requires authenticated user AND an active paid subscription.
 * - Not logged in → /auth
 * - Logged in but no active sub → /plans
 */
export function SubscriptionRoute({ children }: SubscriptionRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [hasActiveSub, setHasActiveSub] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!user) {
        setChecking(false);
        return;
      }
      const { data } = await supabase
        .from('subscriptions')
        .select('status, current_period_end, plan_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      const active =
        !!data &&
        data.plan_id !== 'free' &&
        data.plan_id !== 'free-trial' &&
        (!data.current_period_end || new Date(data.current_period_end) > new Date());

      if (!cancelled) {
        setHasActiveSub(active);
        setChecking(false);
      }
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!hasActiveSub) return <Navigate to="/plans?gated=1" replace />;

  return <>{children}</>;
}
