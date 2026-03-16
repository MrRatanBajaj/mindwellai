import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useSecurityMonitoring } from './useSecurityMonitoring';

export function useSessionManagement() {
  const { user, session } = useAuth();
  const { logSecurityEvent } = useSecurityMonitoring();

  // Track active session using a random session ID (never store access tokens)
  const createSession = useCallback(async () => {
    if (user && session) {
      try {
        // Generate a random session ID for tracking - NEVER store the access token
        const trackingSessionId = crypto.randomUUID();

        const { error } = await supabase
          .from('user_sessions')
          .upsert({
            user_id: user.id,
            session_token: trackingSessionId, // Store random ID, not the JWT
            user_agent: navigator.userAgent,
            last_activity: new Date().toISOString(),
            is_active: true,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }, { onConflict: 'session_token' });

        if (error) {
          if (error.code !== '23505') {
            console.error('Failed to create session record:', error);
          }
        } else {
          // Store tracking session ID locally for activity updates
          sessionStorage.setItem('tracking_session_id', trackingSessionId);
        }
      } catch (error) {
        console.error('Session creation error:', error);
      }
    }
  }, [user, session]);

  // Update session activity using the tracking session ID
  const updateActivity = useCallback(async () => {
    if (user) {
      try {
        const trackingSessionId = sessionStorage.getItem('tracking_session_id');
        if (!trackingSessionId) return;

        await supabase
          .from('user_sessions')
          .update({ 
            last_activity: new Date().toISOString()
          })
          .eq('session_token', trackingSessionId)
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Failed to update session activity:', error);
      }
    }
  }, [user]);

  // Clean up expired sessions
  const cleanupSessions = useCallback(async () => {
    try {
      await supabase.rpc('cleanup_expired_sessions');
    } catch (error) {
      console.error('Failed to cleanup sessions:', error);
    }
  }, []);

  // Terminate session on logout
  const terminateSession = useCallback(async () => {
    if (user) {
      try {
        const trackingSessionId = sessionStorage.getItem('tracking_session_id');
        if (!trackingSessionId) return;

        await supabase
          .from('user_sessions')
          .update({ 
            is_active: false,
            last_activity: new Date().toISOString()
          })
          .eq('session_token', trackingSessionId)
          .eq('user_id', user.id);

        await logSecurityEvent({
          event_type: 'session_terminated',
          metadata: { 
            timestamp: new Date().toISOString()
          }
        });

        sessionStorage.removeItem('tracking_session_id');
      } catch (error) {
        console.error('Failed to terminate session:', error);
      }
    }
  }, [user, logSecurityEvent]);

  // Create session when user logs in
  useEffect(() => {
    if (user && session) {
      createSession();
    }
  }, [user, session, createSession]);

  // Update activity periodically
  useEffect(() => {
    if (user && session) {
      const interval = setInterval(updateActivity, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user, session, updateActivity]);

  // Update activity on user interaction (debounced)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleActivity = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateActivity, 30000); // Debounce to max once per 30s
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      clearTimeout(timeout);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);

  // Cleanup sessions periodically
  useEffect(() => {
    const interval = setInterval(cleanupSessions, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cleanupSessions]);

  return {
    createSession,
    updateActivity,
    terminateSession,
    cleanupSessions
  };
}
