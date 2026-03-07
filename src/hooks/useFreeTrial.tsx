import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface FreeTrialState {
  loading: boolean;
  trialUsed: boolean;
  trialDurationSeconds: number;
  trialRemainingSeconds: number;
}

const FREE_TRIAL_LIMIT = 15 * 60; // 15 minutes in seconds

export function useFreeTrial() {
  const { user } = useAuth();
  const [state, setState] = useState<FreeTrialState>({
    loading: true,
    trialUsed: false,
    trialDurationSeconds: 0,
    trialRemainingSeconds: FREE_TRIAL_LIMIT,
  });

  const fetchTrialStatus = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('free_trial_used, free_trial_duration_seconds')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching trial status:', error);
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      const used = data?.free_trial_used ?? false;
      const duration = data?.free_trial_duration_seconds ?? 0;

      setState({
        loading: false,
        trialUsed: used,
        trialDurationSeconds: duration,
        trialRemainingSeconds: Math.max(0, FREE_TRIAL_LIMIT - duration),
      });
    } catch (err) {
      console.error('Trial status error:', err);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    fetchTrialStatus();
  }, [fetchTrialStatus]);

  const updateTrialDuration = useCallback(async (durationSeconds: number) => {
    if (!user) return;

    const totalDuration = state.trialDurationSeconds + durationSeconds;
    const isUsed = totalDuration >= FREE_TRIAL_LIMIT;

    try {
      await supabase
        .from('profiles')
        .update({
          free_trial_duration_seconds: totalDuration,
          free_trial_used: isUsed,
        })
        .eq('user_id', user.id);

      setState(prev => ({
        ...prev,
        trialDurationSeconds: totalDuration,
        trialUsed: isUsed,
        trialRemainingSeconds: Math.max(0, FREE_TRIAL_LIMIT - totalDuration),
      }));
    } catch (err) {
      console.error('Update trial error:', err);
    }
  }, [user, state.trialDurationSeconds]);

  const markTrialUsed = useCallback(async () => {
    if (!user) return;

    try {
      await supabase
        .from('profiles')
        .update({ free_trial_used: true })
        .eq('user_id', user.id);

      setState(prev => ({
        ...prev,
        trialUsed: true,
        trialRemainingSeconds: 0,
      }));
    } catch (err) {
      console.error('Mark trial error:', err);
    }
  }, [user]);

  return {
    ...state,
    FREE_TRIAL_LIMIT,
    updateTrialDuration,
    markTrialUsed,
    refetch: fetchTrialStatus,
  };
}
