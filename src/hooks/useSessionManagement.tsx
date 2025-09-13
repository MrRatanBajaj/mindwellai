import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useSecurityMonitoring } from './useSecurityMonitoring';

export function useSessionManagement() {
  const { user, session } = useAuth();
  const { logSecurityEvent } = useSecurityMonitoring();

  // Track active session
  const createSession = useCallback(async () => {
    if (user && session) {
      try {
        const { error } = await supabase
          .from('user_sessions')
          .insert({
            user_id: user.id,
            session_token: session.access_token,
            user_agent: navigator.userAgent,
            last_activity: new Date().toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
          });

        if (error) {
          console.error('Failed to create session record:', error);
        } else {
          await logSecurityEvent({
            event_type: 'session_created',
            metadata: { 
              session_id: session.access_token.substring(0, 8) + '...',
              timestamp: new Date().toISOString()
            }
          });
        }
      } catch (error) {
        console.error('Session creation error:', error);
      }
    }
  }, [user, session, logSecurityEvent]);

  // Update session activity
  const updateActivity = useCallback(async () => {
    if (user && session) {
      try {
        await supabase
          .from('user_sessions')
          .update({ 
            last_activity: new Date().toISOString()
          })
          .eq('session_token', session.access_token)
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Failed to update session activity:', error);
      }
    }
  }, [user, session]);

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
    if (user && session) {
      try {
        await supabase
          .from('user_sessions')
          .update({ 
            is_active: false,
            last_activity: new Date().toISOString()
          })
          .eq('session_token', session.access_token)
          .eq('user_id', user.id);

        await logSecurityEvent({
          event_type: 'session_terminated',
          metadata: { 
            session_id: session.access_token.substring(0, 8) + '...',
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Failed to terminate session:', error);
      }
    }
  }, [user, session, logSecurityEvent]);

  // Create session when user logs in
  useEffect(() => {
    if (user && session) {
      createSession();
    }
  }, [user, session, createSession]);

  // Update activity periodically
  useEffect(() => {
    if (user && session) {
      const interval = setInterval(updateActivity, 5 * 60 * 1000); // Every 5 minutes
      return () => clearInterval(interval);
    }
  }, [user, session, updateActivity]);

  // Update activity on user interaction
  useEffect(() => {
    const handleActivity = () => {
      updateActivity();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);

  // Cleanup sessions periodically
  useEffect(() => {
    const interval = setInterval(cleanupSessions, 60 * 60 * 1000); // Every hour
    return () => clearInterval(interval);
  }, [cleanupSessions]);

  return {
    createSession,
    updateActivity,
    terminateSession,
    cleanupSessions
  };
}