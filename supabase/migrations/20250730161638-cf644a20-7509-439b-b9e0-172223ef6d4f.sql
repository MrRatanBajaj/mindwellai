-- Create memorial profiles table
CREATE TABLE public.memorial_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  biography TEXT,
  personality_traits TEXT[],
  voice_id TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memorial memories table for storing uploaded content
CREATE TABLE public.memorial_memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memorial_id UUID NOT NULL REFERENCES public.memorial_profiles(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('text', 'photo', 'audio', 'story')),
  content TEXT,
  file_url TEXT,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memorial chat sessions table
CREATE TABLE public.memorial_chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  memorial_id UUID NOT NULL REFERENCES public.memorial_profiles(id) ON DELETE CASCADE,
  session_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memorial chat messages table
CREATE TABLE public.memorial_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.memorial_chat_sessions(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'memorial')),
  content TEXT NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.memorial_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for memorial_profiles
CREATE POLICY "Users can view their own memorial profiles" 
ON public.memorial_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memorial profiles" 
ON public.memorial_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memorial profiles" 
ON public.memorial_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memorial profiles" 
ON public.memorial_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for memorial_memories
CREATE POLICY "Users can view memories of their memorial profiles" 
ON public.memorial_memories 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.memorial_profiles 
  WHERE id = memorial_memories.memorial_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can create memories for their memorial profiles" 
ON public.memorial_memories 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.memorial_profiles 
  WHERE id = memorial_memories.memorial_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can update memories of their memorial profiles" 
ON public.memorial_memories 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.memorial_profiles 
  WHERE id = memorial_memories.memorial_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can delete memories of their memorial profiles" 
ON public.memorial_memories 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.memorial_profiles 
  WHERE id = memorial_memories.memorial_id 
  AND user_id = auth.uid()
));

-- Create RLS policies for memorial_chat_sessions
CREATE POLICY "Users can view their own chat sessions" 
ON public.memorial_chat_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions" 
ON public.memorial_chat_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" 
ON public.memorial_chat_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions" 
ON public.memorial_chat_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for memorial_chat_messages
CREATE POLICY "Users can view messages from their chat sessions" 
ON public.memorial_chat_messages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.memorial_chat_sessions 
  WHERE id = memorial_chat_messages.session_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can create messages in their chat sessions" 
ON public.memorial_chat_messages 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.memorial_chat_sessions 
  WHERE id = memorial_chat_messages.session_id 
  AND user_id = auth.uid()
));

-- Create indexes for better performance
CREATE INDEX idx_memorial_profiles_user_id ON public.memorial_profiles(user_id);
CREATE INDEX idx_memorial_memories_memorial_id ON public.memorial_memories(memorial_id);
CREATE INDEX idx_memorial_chat_sessions_user_id ON public.memorial_chat_sessions(user_id);
CREATE INDEX idx_memorial_chat_sessions_memorial_id ON public.memorial_chat_sessions(memorial_id);
CREATE INDEX idx_memorial_chat_messages_session_id ON public.memorial_chat_messages(session_id);
CREATE INDEX idx_memorial_chat_messages_created_at ON public.memorial_chat_messages(created_at);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_memorial_profiles_updated_at
  BEFORE UPDATE ON public.memorial_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memorial_chat_sessions_updated_at
  BEFORE UPDATE ON public.memorial_chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.memorial_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.memorial_memories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.memorial_chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.memorial_chat_messages;

ALTER TABLE public.memorial_profiles REPLICA IDENTITY FULL;
ALTER TABLE public.memorial_memories REPLICA IDENTITY FULL;
ALTER TABLE public.memorial_chat_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.memorial_chat_messages REPLICA IDENTITY FULL;