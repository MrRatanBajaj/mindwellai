import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call - In production, this would connect to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for now (would be replaced with actual API call)
      const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
      const newFeedback = {
        ...formData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      existingFeedback.push(newFeedback);
      localStorage.setItem('feedback', JSON.stringify(existingFeedback));
      
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
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
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
            <Label htmlFor="feedback">Your Feedback *</Label>
            <Textarea
              id="feedback"
              required
              value={formData.feedback}
              onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
              placeholder="Share your experience, what you liked, what could be improved..."
              className="min-h-[100px]"
            />
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
            className="w-full" 
            disabled={isSubmitting || !formData.feedback.trim()}
          >
            {isSubmitting ? (
              <>Submitting...</>
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