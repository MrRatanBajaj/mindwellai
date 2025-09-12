-- Create user profiles table and secure AI counseling data
-- Step 1: Create profiles table for user data
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Step 2: Fix AI counseling data exposure - remove public access
DROP POLICY IF EXISTS "Users can create their own sessions" ON ai_counseling_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON ai_counseling_sessions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON ai_counseling_sessions;

-- Create secure policies for AI counseling sessions (no NULL user_id access)
CREATE POLICY "Authenticated users can create their own counseling sessions" 
ON ai_counseling_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can update only their own counseling sessions" 
ON ai_counseling_sessions 
FOR UPDATE 
USING (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can view only their own counseling sessions" 
ON ai_counseling_sessions 
FOR SELECT 
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Step 3: Fix AI counseling messages exposure
DROP POLICY IF EXISTS "Users can create messages in their sessions" ON ai_counseling_messages;
DROP POLICY IF EXISTS "Users can view messages from their sessions" ON ai_counseling_messages;

-- Create secure policies for AI counseling messages
CREATE POLICY "Users can create messages in their own sessions" 
ON ai_counseling_messages 
FOR INSERT 
WITH CHECK (session_id IN (
  SELECT ai_counseling_sessions.session_id
  FROM ai_counseling_sessions
  WHERE auth.uid() = ai_counseling_sessions.user_id AND ai_counseling_sessions.user_id IS NOT NULL
));

CREATE POLICY "Users can view messages from their own sessions" 
ON ai_counseling_messages 
FOR SELECT 
USING (session_id IN (
  SELECT ai_counseling_sessions.session_id
  FROM ai_counseling_sessions
  WHERE auth.uid() = ai_counseling_sessions.user_id AND ai_counseling_sessions.user_id IS NOT NULL
));

-- Step 4: Add trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
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

-- Create trigger for automatic profile creation on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Add trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Step 6: Secure the mindwellai table (if it's needed) or disable RLS if it's just a test table
ALTER TABLE public.mindwellai ENABLE ROW LEVEL SECURITY;

-- If mindwellai should be publicly readable, add this policy:
CREATE POLICY "Public read access to mindwellai" 
ON public.mindwellai 
FOR SELECT 
USING (true);