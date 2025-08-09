-- Create AI counseling sessions table
CREATE TABLE public.ai_counseling_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  user_id UUID,
  counselor_id TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('emergency_chat', 'emergency_video', 'regular_chat', 'video_call')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'terminated')),
  urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI counseling messages table
CREATE TABLE public.ai_counseling_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai', 'system')),
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'normal' CHECK (message_type IN ('normal', 'user_input', 'ai_response', 'system_alert', 'crisis', 'emergency')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_counseling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_counseling_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for sessions
CREATE POLICY "Users can view their own sessions" 
ON public.ai_counseling_sessions 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own sessions" 
ON public.ai_counseling_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own sessions" 
ON public.ai_counseling_sessions 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policies for messages
CREATE POLICY "Users can view messages from their sessions" 
ON public.ai_counseling_messages 
FOR SELECT 
USING (
  session_id IN (
    SELECT session_id FROM public.ai_counseling_sessions 
    WHERE auth.uid() = user_id OR user_id IS NULL
  )
);

CREATE POLICY "Users can create messages in their sessions" 
ON public.ai_counseling_messages 
FOR INSERT 
WITH CHECK (
  session_id IN (
    SELECT session_id FROM public.ai_counseling_sessions 
    WHERE auth.uid() = user_id OR user_id IS NULL
  )
);

-- Create indexes for performance
CREATE INDEX idx_ai_counseling_sessions_user_id ON public.ai_counseling_sessions(user_id);
CREATE INDEX idx_ai_counseling_sessions_session_id ON public.ai_counseling_sessions(session_id);
CREATE INDEX idx_ai_counseling_sessions_status ON public.ai_counseling_sessions(status);
CREATE INDEX idx_ai_counseling_messages_session_id ON public.ai_counseling_messages(session_id);
CREATE INDEX idx_ai_counseling_messages_timestamp ON public.ai_counseling_messages(timestamp);

-- Add foreign key relationship
ALTER TABLE public.ai_counseling_messages 
ADD CONSTRAINT fk_ai_counseling_messages_session 
FOREIGN KEY (session_id) REFERENCES public.ai_counseling_sessions(session_id) 
ON DELETE CASCADE;

-- Create trigger for updated_at
CREATE TRIGGER update_ai_counseling_sessions_updated_at
BEFORE UPDATE ON public.ai_counseling_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();