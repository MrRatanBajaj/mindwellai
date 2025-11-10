-- Create therapy sessions table
CREATE TABLE IF NOT EXISTS public.therapy_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  counselor_name TEXT NOT NULL,
  specialty TEXT,
  session_type TEXT NOT NULL CHECK (session_type IN ('audio', 'video', 'chat')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'interrupted')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session messages table
CREATE TABLE IF NOT EXISTS public.session_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.therapy_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  audio_url TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_therapy_sessions_user_id ON public.therapy_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_therapy_sessions_started_at ON public.therapy_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_messages_session_id ON public.session_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_session_messages_timestamp ON public.session_messages(timestamp);

-- Enable Row Level Security
ALTER TABLE public.therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for therapy_sessions
CREATE POLICY "Users can view their own sessions"
  ON public.therapy_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON public.therapy_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.therapy_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON public.therapy_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for session_messages
CREATE POLICY "Users can view messages from their sessions"
  ON public.session_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.therapy_sessions
      WHERE therapy_sessions.id = session_messages.session_id
      AND therapy_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages for their sessions"
  ON public.session_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.therapy_sessions
      WHERE therapy_sessions.id = session_messages.session_id
      AND therapy_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages from their sessions"
  ON public.session_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.therapy_sessions
      WHERE therapy_sessions.id = session_messages.session_id
      AND therapy_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages from their sessions"
  ON public.session_messages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.therapy_sessions
      WHERE therapy_sessions.id = session_messages.session_id
      AND therapy_sessions.user_id = auth.uid()
    )
  );

-- Create storage bucket for session audio recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('session-recordings', 'session-recordings', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for session recordings storage
CREATE POLICY "Users can upload their own session recordings"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'session-recordings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own session recordings"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'session-recordings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own session recordings"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'session-recordings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own session recordings"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'session-recordings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create trigger to update updated_at
CREATE TRIGGER update_therapy_sessions_updated_at
  BEFORE UPDATE ON public.therapy_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();