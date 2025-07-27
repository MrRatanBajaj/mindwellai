import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Send, MessageSquare, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    rating: 0,
    feedback: '',
    suggestions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Insert feedback into Supabase
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            name: formData.name || null,
            email: formData.email || null,
            category: formData.category,
            rating: formData.rating,
            feedback: formData.feedback,
            suggestions: formData.suggestions || null
          }
        ]);
      if (error) {
        throw error;
      }
      
      toast({
        title: "Feedback Submitted!",
        description: "Thank you for helping us improve MindWelAI.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        category: '',
        rating: 0,
        feedback: '',
        suggestions: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic would go here
      toast({
        title: "Voice recording stopped",
        description: "Voice features will be available soon!",
      });
    } else {
      setIsRecording(true);
      // Start recording logic would go here
      toast({
        title: "Voice recording started",
        description: "Speak your feedback now...",
      });
      
      // Auto-stop after 30 seconds for demo
      setTimeout(() => {
        setIsRecording(false);
      }, 30000);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 animate-scale-in">
          <MessageSquare className="h-5 w-5" />
          Beta Testing Feedback
        </CardTitle>
        <p className="text-muted-foreground">
          Help us improve MindWelAI by sharing your experience and suggestions.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Feedback Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ui-ux">UI/UX Design</SelectItem>
                <SelectItem value="features">Features</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="consultation">Consultation Experience</SelectItem>
                <SelectItem value="peer-connect">Peer Connection</SelectItem>
                <SelectItem value="memorial-chat">Memorial Chat</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="flex items-center gap-2">
              Your Feedback *
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleRecording}
                className={`ml-auto transition-colors ${
                  isRecording ? 'bg-red-500 text-white hover:bg-red-600' : ''
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4 mr-1" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-1" />
                    Voice Feedback
                  </>
                )}
              </Button>
            </Label>
            <Textarea
              id="feedback"
              required
              value={formData.feedback}
              onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
              placeholder="Share your experience, what you liked, what could be improved..."
              className={`min-h-[100px] transition-all duration-300 ${
                isRecording ? 'border-red-500 bg-red-50/50' : ''
              }`}
            />
            {isRecording && (
              <div className="flex items-center gap-2 text-red-500 animate-pulse">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Recording... Speak your feedback now
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="suggestions">Suggestions for Improvement</Label>
            <Textarea
              id="suggestions"
              value={formData.suggestions}
              onChange={(e) => setFormData(prev => ({ ...prev, suggestions: e.target.value }))}
              placeholder="Any specific features or improvements you'd like to see..."
              className="min-h-[80px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full hover-scale transition-all duration-300" 
            disabled={isSubmitting || !formData.feedback.trim()}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};