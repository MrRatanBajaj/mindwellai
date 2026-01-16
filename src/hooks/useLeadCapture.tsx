import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LeadData {
  email?: string;
  name?: string;
  phone?: string;
  location_city?: string;
  location_country?: string;
  location_region?: string;
  ip_address?: string;
  device_info?: string;
  referrer?: string;
  landing_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  source?: string;
}

interface LocationData {
  city?: string;
  country?: string;
  region?: string;
  ip?: string;
}

export function useLeadCapture() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  // Check if lead already captured in this session
  useEffect(() => {
    const leadCaptured = localStorage.getItem('mindwell_lead_captured');
    if (leadCaptured) {
      setHasSubmitted(true);
    }
  }, []);

  // Auto-detect location using free IP geolocation API
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Using ipapi.co free tier (1000 requests/day)
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          setLocationData({
            city: data.city,
            country: data.country_name,
            region: data.region,
            ip: data.ip
          });
        }
      } catch (error) {
        console.log('Could not fetch location data');
      }
    };

    fetchLocation();
  }, []);

  // Get UTM parameters from URL
  const getUtmParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined
    };
  }, []);

  // Get device info
  const getDeviceInfo = useCallback(() => {
    const ua = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad/.test(ua);
    const browser = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)/)?.[0] || 'Unknown';
    return `${isMobile ? 'Mobile' : 'Desktop'} - ${browser}`;
  }, []);

  // Submit lead data
  const submitLead = useCallback(async (userData: { email?: string; name?: string; phone?: string }) => {
    if (isSubmitting || hasSubmitted) return { success: false };

    setIsSubmitting(true);

    try {
      const utmParams = getUtmParams();
      
      const leadData: LeadData = {
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        location_city: locationData?.city,
        location_country: locationData?.country,
        location_region: locationData?.region,
        device_info: getDeviceInfo(),
        referrer: document.referrer || undefined,
        landing_page: window.location.pathname,
        source: 'website',
        ...utmParams
      };

      const { error } = await supabase
        .from('leads')
        .insert(leadData);

      if (error) throw error;

      localStorage.setItem('mindwell_lead_captured', 'true');
      localStorage.setItem('mindwell_lead_captured_at', new Date().toISOString());
      setHasSubmitted(true);

      return { success: true };
    } catch (error) {
      console.error('Error submitting lead:', error);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, hasSubmitted, locationData, getUtmParams, getDeviceInfo]);

  // Track anonymous visit (without email)
  const trackAnonymousVisit = useCallback(async () => {
    const visitTracked = sessionStorage.getItem('mindwell_visit_tracked');
    if (visitTracked) return;

    try {
      const utmParams = getUtmParams();
      
      const visitData: LeadData = {
        location_city: locationData?.city,
        location_country: locationData?.country,
        location_region: locationData?.region,
        device_info: getDeviceInfo(),
        referrer: document.referrer || undefined,
        landing_page: window.location.pathname,
        source: 'anonymous_visit',
        ...utmParams
      };

      await supabase.from('leads').insert(visitData);
      sessionStorage.setItem('mindwell_visit_tracked', 'true');
    } catch (error) {
      console.log('Could not track anonymous visit');
    }
  }, [locationData, getUtmParams, getDeviceInfo]);

  return {
    submitLead,
    trackAnonymousVisit,
    isSubmitting,
    hasSubmitted,
    locationData
  };
}
