-- Create analytics table for tracking real-time site visits and user interactions
CREATE TABLE public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- References auth.users but nullable for anonymous visits
  event_type TEXT NOT NULL,
  event_data JSONB,
  page_url TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT
);

-- Enable Row Level Security
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics - anyone can insert, only admins can view
CREATE POLICY "Anyone can track analytics events" 
ON public.analytics 
FOR INSERT 
WITH CHECK (true);

-- Create consultations table for booking system
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- References auth.users but nullable for anonymous bookings
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  concerns TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  session_type TEXT DEFAULT 'ai_counselor' CHECK (session_type IN ('ai_counselor', 'human_therapist', 'group_session')),
  duration_minutes INTEGER DEFAULT 50,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Create policies for consultations
CREATE POLICY "Users can view their own consultations" 
ON public.consultations 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create consultations" 
ON public.consultations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own consultations" 
ON public.consultations 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create voice_chat_sessions table for tracking voice interactions
CREATE TABLE public.voice_chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- References auth.users but nullable for anonymous sessions
  session_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'disconnected')),
  participants_count INTEGER DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE public.voice_chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for voice chat sessions
CREATE POLICY "Users can view their own voice sessions" 
ON public.voice_chat_sessions 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create voice sessions" 
ON public.voice_chat_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update voice sessions" 
ON public.voice_chat_sessions 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_consultations_updated_at
BEFORE UPDATE ON public.consultations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at);
CREATE INDEX idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX idx_consultations_scheduled_date ON public.consultations(scheduled_date);
CREATE INDEX idx_consultations_user_id ON public.consultations(user_id);
CREATE INDEX idx_voice_sessions_session_id ON public.voice_chat_sessions(session_id);

-- Enable realtime for all tables
ALTER TABLE public.analytics REPLICA IDENTITY FULL;
ALTER TABLE public.consultations REPLICA IDENTITY FULL;
ALTER TABLE public.voice_chat_sessions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.voice_chat_sessions;