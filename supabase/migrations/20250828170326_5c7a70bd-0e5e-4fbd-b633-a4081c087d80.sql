-- Fix security vulnerability in voice_chat_sessions table
-- Remove public access to sessions with NULL user_id

-- Drop the existing permissive policies
DROP POLICY IF EXISTS "Anyone can create voice sessions" ON voice_chat_sessions;
DROP POLICY IF EXISTS "Anyone can update voice sessions" ON voice_chat_sessions;
DROP POLICY IF EXISTS "Users can view their own voice sessions" ON voice_chat_sessions;

-- Create secure policies that only allow authenticated users to access their own sessions
CREATE POLICY "Authenticated users can create their own voice sessions" 
ON voice_chat_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update only their own voice sessions" 
ON voice_chat_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view only their own voice sessions" 
ON voice_chat_sessions 
FOR SELECT 
USING (auth.uid() = user_id);