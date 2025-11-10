import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, Clock, Calendar, Video, Mic, MessageCircle,
  FileText, Play, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TherapySession {
  id: string;
  counselor_name: string;
  specialty: string | null;
  session_type: 'audio' | 'video' | 'chat';
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  status: string;
}

interface SessionMessage {
  id: string;
  role: string;
  content: string;
  audio_url: string | null;
  timestamp: string;
}

const SessionHistory = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('started_at', { ascending: false });

      if (error) throw error;

      setSessions((data || []) as TherapySession[]);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Failed to load session history');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    if (selectedSession === sessionId) {
      setSelectedSession(null);
      return;
    }

    setIsLoadingMessages(true);
    setSelectedSession(sessionId);

    try {
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load session messages');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const downloadTranscript = async (session: TherapySession) => {
    try {
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      const transcript = data
        .map(msg => `[${format(new Date(msg.timestamp), 'HH:mm:ss')}] ${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n\n');

      const header = `Therapy Session Transcript
Counselor: ${session.counselor_name}
${session.specialty ? `Specialty: ${session.specialty}` : ''}
Date: ${format(new Date(session.started_at), 'PPP')}
Duration: ${formatDuration(session.duration_seconds || 0)}
Type: ${session.session_type.toUpperCase()}

-----------------------------------

`;

      const blob = new Blob([header + transcript], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `session_${format(new Date(session.started_at), 'yyyy-MM-dd_HHmm')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Transcript downloaded successfully');
    } catch (error) {
      console.error('Error downloading transcript:', error);
      toast.error('Failed to download transcript');
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session? This cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('therapy_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast.success('Session deleted successfully');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Mic className="w-4 h-4" />;
      case 'chat':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="glass-panel">
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Sessions Yet</h3>
          <p className="text-muted-foreground">
            Your therapy session history will appear here once you complete your first session.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Session History</h2>
          <p className="text-muted-foreground">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
      </div>

      {sessions.map((session, index) => (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="glass-panel hover-lift">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      "p-2 rounded-lg",
                      session.session_type === 'video' && "bg-purple-100 text-purple-600",
                      session.session_type === 'audio' && "bg-blue-100 text-blue-600",
                      session.session_type === 'chat' && "bg-green-100 text-green-600"
                    )}>
                      {getSessionIcon(session.session_type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{session.counselor_name}</CardTitle>
                      {session.specialty && (
                        <p className="text-sm text-muted-foreground">{session.specialty}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(session.started_at), 'PPP')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {format(new Date(session.started_at), 'p')}
                    </Badge>
                    {session.duration_seconds && (
                      <Badge variant="outline" className="text-xs">
                        {formatDuration(session.duration_seconds)}
                      </Badge>
                    )}
                    <Badge 
                      variant={session.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {session.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadTranscript(session)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadMessages(session.id)}
                  >
                    {selectedSession === session.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSession(session.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {selectedSession === session.id && (
              <CardContent>
                {isLoadingMessages ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading messages...</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {messages.map((message, idx) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3 p-4 rounded-lg",
                          message.role === 'user' 
                            ? "bg-primary/5 ml-8" 
                            : "bg-muted mr-8"
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {message.role === 'user' ? 'You' : session.counselor_name}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(message.timestamp), 'HH:mm:ss')}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                          {message.audio_url && (
                            <audio 
                              controls 
                              className="mt-2 w-full h-10"
                              src={message.audio_url}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default SessionHistory;