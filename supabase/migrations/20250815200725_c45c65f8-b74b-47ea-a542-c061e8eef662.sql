-- Enhanced Memorial AI Connection Database Setup
-- Add storage buckets for memorial content
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('memorial-photos', 'memorial-photos', false, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('memorial-audio', 'memorial-audio', false, 104857600, ARRAY['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/mp4'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for memorial photos
CREATE POLICY "Users can view their memorial photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'memorial-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their memorial photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'memorial-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their memorial photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'memorial-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their memorial photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'memorial-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for memorial audio
CREATE POLICY "Users can view their memorial audio" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'memorial-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their memorial audio" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'memorial-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their memorial audio" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'memorial-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their memorial audio" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'memorial-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable real-time for memorial tables
ALTER TABLE memorial_profiles REPLICA IDENTITY FULL;
ALTER TABLE memorial_memories REPLICA IDENTITY FULL;
ALTER TABLE memorial_chat_sessions REPLICA IDENTITY FULL;
ALTER TABLE memorial_chat_messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE memorial_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE memorial_memories;
ALTER PUBLICATION supabase_realtime ADD TABLE memorial_chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE memorial_chat_messages;

-- Add AI-related fields to memorial profiles
ALTER TABLE memorial_profiles 
ADD COLUMN IF NOT EXISTS ai_model_preference TEXT DEFAULT 'microsoft/DialoGPT-medium',
ADD COLUMN IF NOT EXISTS voice_clone_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS conversation_style TEXT DEFAULT 'warm',
ADD COLUMN IF NOT EXISTS memory_context JSONB DEFAULT '{}';

-- Add AI fields to chat messages  
ALTER TABLE memorial_chat_messages
ADD COLUMN IF NOT EXISTS ai_response_metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS emotion_analysis JSONB DEFAULT '{}';

-- Create index for better AI query performance
CREATE INDEX IF NOT EXISTS idx_memorial_profiles_ai_model ON memorial_profiles(ai_model_preference);
CREATE INDEX IF NOT EXISTS idx_memorial_chat_messages_session ON memorial_chat_messages(session_id, created_at);

-- Update memorial memories to support more metadata
ALTER TABLE memorial_memories 
ADD COLUMN IF NOT EXISTS ai_processed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS embedding_vector TEXT,
ADD COLUMN IF NOT EXISTS memory_tags TEXT[];

CREATE INDEX IF NOT EXISTS idx_memorial_memories_ai_processed ON memorial_memories(ai_processed);
CREATE INDEX IF NOT EXISTS idx_memorial_memories_tags ON memorial_memories USING GIN(memory_tags);