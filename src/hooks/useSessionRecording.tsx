import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export interface SessionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  audio_url?: string;
  timestamp: Date;
}

export const useSessionRecording = (
  sessionType: 'audio' | 'video' | 'chat',
  counselorName: string,
  specialty?: string
) => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const startTimeRef = useRef<Date | null>(null);

  const startSession = async () => {
    if (!user) {
      toast.error('Please log in to record sessions');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: user.id,
          counselor_name: counselorName,
          specialty: specialty || '',
          session_type: sessionType,
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setSessionId(data.id);
      setIsRecording(true);
      startTimeRef.current = new Date();
      
      console.log('Session started:', data.id);
      return data.id;
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start session recording');
      return null;
    }
  };

  const endSession = async () => {
    if (!sessionId || !startTimeRef.current) {
      return;
    }

    try {
      const endTime = new Date();
      const durationSeconds = Math.floor(
        (endTime.getTime() - startTimeRef.current.getTime()) / 1000
      );

      const { error } = await supabase
        .from('therapy_sessions')
        .update({
          ended_at: endTime.toISOString(),
          duration_seconds: durationSeconds,
          status: 'completed'
        })
        .eq('id', sessionId);

      if (error) throw error;

      console.log('Session ended:', sessionId);
      setIsRecording(false);
      toast.success('Session saved successfully');
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Failed to save session');
    }
  };

  const addMessage = async (
    role: 'user' | 'assistant' | 'system',
    content: string,
    audioUrl?: string
  ) => {
    if (!sessionId) {
      console.warn('No active session to add message to');
      return;
    }

    try {
      const message: SessionMessage = {
        role,
        content,
        audio_url: audioUrl,
        timestamp: new Date()
      };

      const { error } = await supabase
        .from('session_messages')
        .insert({
          session_id: sessionId,
          role,
          content,
          audio_url: audioUrl,
          timestamp: message.timestamp.toISOString()
        });

      if (error) throw error;

      setMessages(prev => [...prev, message]);
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const uploadAudio = async (audioBlob: Blob, messageId: string): Promise<string | null> => {
    if (!user || !sessionId) return null;

    try {
      const fileName = `${user.id}/${sessionId}/${messageId}_${Date.now()}.mp3`;
      
      const { data, error } = await supabase.storage
        .from('session-recordings')
        .upload(fileName, audioBlob, {
          contentType: 'audio/mpeg',
          upsert: false
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('session-recordings')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading audio:', error);
      return null;
    }
  };

  return {
    sessionId,
    isRecording,
    messages,
    startSession,
    endSession,
    addMessage,
    uploadAudio
  };
};