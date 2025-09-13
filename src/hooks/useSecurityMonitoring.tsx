import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SecurityEvent {
  event_type: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

export function useSecurityMonitoring() {
  const { user } = useAuth();

  const logSecurityEvent = async (event: SecurityEvent) => {
    try {
      await supabase.rpc('log_security_event', {
        p_event_type: event.event_type,
        p_user_id: event.user_id || user?.id || null,
        p_ip_address: null, // Cannot get IP from client-side
        p_user_agent: navigator.userAgent,
        p_metadata: event.metadata || {}
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const logLoginAttempt = (success: boolean, email?: string) => {
    logSecurityEvent({
      event_type: success ? 'login_success' : 'login_failed',
      metadata: { email, timestamp: new Date().toISOString() }
    });
  };

  const logSignupAttempt = (success: boolean, email?: string) => {
    logSecurityEvent({
      event_type: success ? 'signup_success' : 'signup_failed',
      metadata: { email, timestamp: new Date().toISOString() }
    });
  };

  const logLogout = () => {
    logSecurityEvent({
      event_type: 'logout',
      metadata: { timestamp: new Date().toISOString() }
    });
  };

  const logSuspiciousActivity = (activity: string, details?: Record<string, any>) => {
    logSecurityEvent({
      event_type: 'suspicious_activity',
      metadata: { activity, details, timestamp: new Date().toISOString() }
    });
  };

  // Track page views for security monitoring
  useEffect(() => {
    const handlePageView = () => {
      if (user) {
        logSecurityEvent({
          event_type: 'page_view',
          metadata: { 
            path: window.location.pathname,
            timestamp: new Date().toISOString()
          }
        });
      }
    };

    // Log initial page view
    handlePageView();

    // Listen for navigation changes
    window.addEventListener('popstate', handlePageView);
    
    return () => {
      window.removeEventListener('popstate', handlePageView);
    };
  }, [user]);

  return {
    logSecurityEvent,
    logLoginAttempt,
    logSignupAttempt,
    logLogout,
    logSuspiciousActivity
  };
}