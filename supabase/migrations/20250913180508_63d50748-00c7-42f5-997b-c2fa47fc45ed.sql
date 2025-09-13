-- Fix security warnings from the linter

-- 1. Fix function search path issues for handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- 2. Fix function search path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. Fix function search path for log_security_event
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_user_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    event_type,
    user_id,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    p_event_type,
    p_user_id,
    p_ip_address,
    p_user_agent,
    p_metadata
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- 4. Fix function search path for cleanup_expired_sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  cleaned_count INTEGER;
BEGIN
  UPDATE public.user_sessions 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Log cleanup event
  PERFORM public.log_security_event(
    'session_cleanup',
    NULL,
    NULL,
    NULL,
    jsonb_build_object('cleaned_sessions', cleaned_count)
  );
  
  RETURN cleaned_count;
END;
$$;