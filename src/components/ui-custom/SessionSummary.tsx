import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  MessageSquare, 
  Download, 
  Share2, 
  Heart,
  Brain,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SessionSummaryProps {
  duration: number;
  messages: Message[];
  onClose: () => void;
  onNewSession: () => void;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({
  duration,
  messages,
  onClose,
  onNewSession,
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  const userMessages = messages.filter(m => m.role === 'user').length;
  const aiMessages = messages.filter(m => m.role === 'assistant').length;

  // Generate session insights
  const generateInsights = () => {
    const insights = [];
    if (messages.length > 6) {
      insights.push({ icon: MessageSquare, text: "Deep conversation achieved" });
    }
    if (duration > 300) {
      insights.push({ icon: Clock, text: "Extended session - great progress!" });
    }
    if (userMessages >= aiMessages) {
      insights.push({ icon: Heart, text: "Good engagement and sharing" });
    }
    if (insights.length === 0) {
      insights.push({ icon: Sparkles, text: "Session completed successfully" });
    }
    return insights;
  };

  const insights = generateInsights();

  const downloadTranscript = () => {
    const transcript = messages.map(m => 
      `[${m.timestamp.toLocaleTimeString()}] ${m.role === 'user' ? 'You' : 'Juli'}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `juli-session-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <Card className="w-full max-w-lg bg-card border-border shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Session Complete</CardTitle>
          <p className="text-muted-foreground">Thank you for sharing with Juli</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-semibold text-sm">{formatDuration(duration)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <MessageSquare className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Your Messages</p>
              <p className="font-semibold text-sm">{userMessages}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Brain className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Juli's Responses</p>
              <p className="font-semibold text-sm">{aiMessages}</p>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Session Insights</h4>
            <div className="flex flex-wrap gap-2">
              {insights.map((insight, i) => (
                <Badge key={i} variant="secondary" className="flex items-center gap-1">
                  <insight.icon className="h-3 w-3" />
                  {insight.text}
                </Badge>
              ))}
            </div>
          </div>

          {/* Transcript Preview */}
          {messages.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Conversation Preview</h4>
              <div className="max-h-32 overflow-y-auto bg-muted/30 rounded-lg p-3 space-y-2">
                {messages.slice(-4).map((msg) => (
                  <div key={msg.id} className="text-xs">
                    <span className="font-semibold text-primary">
                      {msg.role === 'user' ? 'You: ' : 'Juli: '}
                    </span>
                    <span className="text-muted-foreground">
                      {msg.content.slice(0, 80)}
                      {msg.content.length > 80 ? '...' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={downloadTranscript}
              disabled={messages.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Transcript
            </Button>
            <Button
              className="flex-1"
              onClick={onNewSession}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={onClose}
          >
            Close
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SessionSummary;
