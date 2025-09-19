import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Brain, 
  Heart, 
  Users, 
  BookOpen, 
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  MessageSquare
} from 'lucide-react';

interface TherapyModel {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  techniques: string[];
  suitableFor: string[];
  onlineUsers: number;
}

interface UserPreferences {
  selectedModels: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  issues: string[];
}

const therapyModels: TherapyModel[] = [
  {
    id: 'cbt',
    name: 'Cognitive Behavioral Therapy',
    abbreviation: 'CBT',
    description: 'Focus on changing negative thought patterns and behaviors',
    icon: Brain,
    color: 'from-blue-500 to-indigo-600',
    techniques: ['Thought challenging', 'Behavioral activation', 'Exposure therapy'],
    suitableFor: ['Anxiety', 'Depression', 'PTSD', 'Phobias'],
    onlineUsers: 127
  },
  {
    id: 'dbt',
    name: 'Dialectical Behavior Therapy',
    abbreviation: 'DBT',
    description: 'Skills for emotional regulation and interpersonal effectiveness',
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    techniques: ['Mindfulness', 'Distress tolerance', 'Emotion regulation'],
    suitableFor: ['BPD', 'Self-harm', 'Emotional dysregulation'],
    onlineUsers: 89
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness-Based Therapy',
    abbreviation: 'MBCT',
    description: 'Present-moment awareness and acceptance practices',
    icon: Lightbulb,
    color: 'from-green-500 to-emerald-600',
    techniques: ['Meditation', 'Body scanning', 'Breathing exercises'],
    suitableFor: ['Stress', 'Anxiety', 'Depression relapse prevention'],
    onlineUsers: 156
  },
  {
    id: 'psychodynamic',
    name: 'Psychodynamic Therapy',
    abbreviation: 'PDT',
    description: 'Explore unconscious patterns and past experiences',
    icon: BookOpen,
    color: 'from-purple-500 to-violet-600',
    techniques: ['Free association', 'Dream analysis', 'Transference'],
    suitableFor: ['Relationship issues', 'Self-understanding', 'Trauma'],
    onlineUsers: 67
  }
];

interface TherapyModelMatcherProps {
  onMatch: (peers: any[]) => void;
}

const TherapyModelMatcher: React.FC<TherapyModelMatcherProps> = ({ onMatch }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    selectedModels: [],
    experience: 'beginner',
    issues: []
  });
  const [isMatching, setIsMatching] = useState(false);
  const [matchedPeers, setMatchedPeers] = useState<any[]>([]);

  const handleModelSelect = (modelId: string) => {
    setPreferences(prev => ({
      ...prev,
      selectedModels: prev.selectedModels.includes(modelId)
        ? prev.selectedModels.filter(id => id !== modelId)
        : [...prev.selectedModels, modelId]
    }));
  };

  const handleIssueToggle = (issue: string) => {
    setPreferences(prev => ({
      ...prev,
      issues: prev.issues.includes(issue)
        ? prev.issues.filter(i => i !== issue)
        : [...prev.issues, issue]
    }));
  };

  const findMatches = async () => {
    if (preferences.selectedModels.length === 0) {
      toast({
        title: "Select Therapy Models",
        description: "Please select at least one therapy model to find matches",
        variant: "destructive"
      });
      return;
    }

    setIsMatching(true);

    // Simulate matching process
    setTimeout(() => {
      const mockMatches = [
        {
          id: '1',
          name: 'Sarah M.',
          avatar: 'S',
          models: ['cbt', 'mindfulness'],
          experience: 'intermediate',
          issues: ['Anxiety', 'Stress'],
          matchScore: 95,
          distance: '0.5 km',
          lastActive: '2 minutes ago',
          isOnline: true
        },
        {
          id: '2',
          name: 'Alex R.',
          avatar: 'A',
          models: ['dbt', 'cbt'],
          experience: 'beginner',
          issues: ['Depression', 'Self-harm'],
          matchScore: 87,
          distance: '1.2 km',
          lastActive: '5 minutes ago',
          isOnline: true
        },
        {
          id: '3',
          name: 'Maya P.',
          avatar: 'M',
          models: ['mindfulness', 'psychodynamic'],
          experience: 'advanced',
          issues: ['Trauma', 'Relationships'],
          matchScore: 78,
          distance: '2.1 km',
          lastActive: '1 hour ago',
          isOnline: false
        }
      ];

      const filteredMatches = mockMatches.filter(peer => 
        peer.models.some(model => preferences.selectedModels.includes(model))
      );

      setMatchedPeers(filteredMatches);
      setIsMatching(false);
      onMatch(filteredMatches);

      toast({
        title: "Matches Found",
        description: `Found ${filteredMatches.length} compatible peers`,
      });
    }, 2000);
  };

  const commonIssues = [
    'Anxiety', 'Depression', 'Stress', 'PTSD', 'Trauma', 'Relationships',
    'Self-harm', 'Grief', 'Addiction', 'Eating disorders', 'Sleep issues'
  ];

  return (
    <div className="space-y-6">
      {/* Therapy Models Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-mindwell-600" />
            Choose Your Therapy Models
          </CardTitle>
          <p className="text-slate-600 text-sm">
            Select the therapeutic approaches you're interested in or currently using
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {therapyModels.map((model) => {
              const Icon = model.icon;
              const isSelected = preferences.selectedModels.includes(model.id);
              
              return (
                <motion.div
                  key={model.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'ring-2 ring-mindwell-500 shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleModelSelect(model.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center text-white`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">{model.abbreviation}</h3>
                            <p className="text-xs text-slate-600">{model.name}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-mindwell-600" />
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-3">{model.description}</p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="secondary" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {model.onlineUsers} online
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Experience Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-mindwell-600" />
            Your Experience Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <Button
                key={level}
                variant={preferences.experience === level ? "default" : "outline"}
                onClick={() => setPreferences(prev => ({ ...prev, experience: level as any }))}
                className="capitalize"
              >
                {level}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Issues Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-mindwell-600" />
            Areas You're Working On
          </CardTitle>
          <p className="text-slate-600 text-sm">
            Select the issues you'd like support with (optional)
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {commonIssues.map((issue) => (
              <Badge
                key={issue}
                variant={preferences.issues.includes(issue) ? "default" : "outline"}
                className="cursor-pointer hover:bg-mindwell-50"
                onClick={() => handleIssueToggle(issue)}
              >
                {issue}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Find Matches Button */}
      <div className="text-center">
        <Button
          onClick={findMatches}
          disabled={isMatching || preferences.selectedModels.length === 0}
          size="lg"
          className="bg-gradient-to-r from-mindwell-500 to-blue-600 hover:from-mindwell-600 hover:to-blue-700"
        >
          {isMatching ? (
            <>
              <Clock className="w-5 h-5 mr-2 animate-spin" />
              Finding Matches...
            </>
          ) : (
            <>
              <Users className="w-5 h-5 mr-2" />
              Find Compatible Peers
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Matched Peers */}
      <AnimatePresence>
        {matchedPeers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Your Matches ({matchedPeers.length})
            </h3>
            
            <div className="grid gap-4">
              {matchedPeers.map((peer) => (
                <Card key={peer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mindwell-400 to-mindwell-600 flex items-center justify-center text-white font-bold text-lg">
                          {peer.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-800">{peer.name}</h4>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {peer.matchScore}% match
                            </Badge>
                            {peer.isOnline && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Online
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                            <span>{peer.distance}</span>
                            <span>•</span>
                            <span>{peer.experience} level</span>
                            <span>•</span>
                            <span>{peer.lastActive}</span>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {peer.models.map((modelId: string) => {
                              const model = therapyModels.find(m => m.id === modelId);
                              return model ? (
                                <Badge key={modelId} variant="outline" className="text-xs">
                                  {model.abbreviation}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TherapyModelMatcher;