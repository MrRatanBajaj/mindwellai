import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MemorialProfileCreator from '@/components/ui-custom/MemorialProfileCreator';
import MemorialChatInterface from '@/components/ui-custom/MemorialChatInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, MessageSquare, Calendar, Star, Users, 
  Sparkles, Camera, HeartHandshake, Volume2, Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface MemorialProfile {
  id: string;
  name: string;
  relationship: string;
  biography?: string;
  personality_traits?: string[];
  voice_id?: string;
  profile_image_url?: string;
  ai_model_preference?: string;
  conversation_style?: string;
  created_at: string;
}

const MemorialChat = () => {
  const [activeView, setActiveView] = useState<'main' | 'create' | 'chat'>('main');
  const [selectedMemorial, setSelectedMemorial] = useState<MemorialProfile | null>(null);
  const [memorialProfiles, setMemorialProfiles] = useState<MemorialProfile[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    loadMemorialProfiles();
  }, []);

  const loadMemorialProfiles = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('memorial_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemorialProfiles(profiles || []);
    } catch (error) {
      console.error('Error loading memorial profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load memorial profiles',
        variant: 'destructive'
      });
    }
  };

  const handleProfileCreated = async () => {
    await loadMemorialProfiles();
    setActiveView('main');
    toast({
      title: 'Memorial Created',
      description: 'Your memorial profile has been created successfully!',
    });
  };

  const startChat = (memorial: MemorialProfile) => {
    setSelectedMemorial(memorial);
    setActiveView('chat');
  };

  const backToMain = () => {
    setActiveView('main');
    setSelectedMemorial(null);
  };

  // Render different views based on activeView state
  if (activeView === 'create') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-rose-50">
        <Header />
        <div className="pt-32 pb-20 px-6 flex-1">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={backToMain}
                className="mb-4"
              >
                ← Back to Memorial Profiles
              </Button>
            </div>
            
            <MemorialProfileCreator onProfileCreated={handleProfileCreated} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (activeView === 'chat' && selectedMemorial) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-rose-50">
        <Header />
        <div className="pt-32 pb-20 px-6 flex-1">
          <MemorialChatInterface 
            memorial={selectedMemorial} 
            onBack={backToMain} 
          />
        </div>
        <Footer />
      </div>
    );
  }

  // Main view - Memorial profiles list
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-rose-50">
      <Header />
      
      <div className="pt-32 pb-20 px-6 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 py-2 px-4 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200 mb-6">
              <Heart className="w-4 h-4 text-rose-600 animate-pulse" />
              <span className="text-rose-700 font-medium text-sm">Memorial AI Connection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-rose-800 bg-clip-text text-transparent">
              Stay Connected with Loved Ones
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Create AI-powered memorial profiles to chat with memories of your family members on special occasions and important moments.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-4">
              <Button
                onClick={() => setActiveView('create')}
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-4 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Memorial
              </Button>
              
              {memorialProfiles.length > 0 && (
                <Button
                  variant="outline"
                  className="px-8 py-4 text-lg border-rose-200 text-rose-600 hover:bg-rose-50"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Connect & Chat
                </Button>
              )}
            </div>
          </div>

          {/* Memorial Profiles Grid */}
          {memorialProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memorialProfiles.map((profile) => (
                <Card 
                  key={profile.id} 
                  className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  onClick={() => startChat(profile)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-lg mx-auto">
                        <AvatarImage src={profile.profile_image_url} />
                        <AvatarFallback className="bg-rose-100 text-rose-600 text-lg font-semibold">
                          {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white animate-pulse" />
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                      {profile.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {profile.relationship}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {profile.biography && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {profile.biography}
                      </p>
                    )}
                    
                    {/* Personality Traits */}
                    {profile.personality_traits && profile.personality_traits.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {profile.personality_traits.slice(0, 3).map((trait) => (
                          <Badge key={trait} variant="secondary" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                        {profile.personality_traits.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.personality_traits.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>Created {formatDistanceToNow(new Date(profile.created_at))} ago</span>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          profile.conversation_style === 'warm' ? 'border-rose-200 text-rose-600' :
                          profile.conversation_style === 'wise' ? 'border-blue-200 text-blue-600' :
                          profile.conversation_style === 'playful' ? 'border-yellow-200 text-yellow-600' :
                          'border-slate-200 text-slate-600'
                        }`}
                      >
                        {profile.conversation_style || 'warm'}
                      </Badge>
                    </div>
                    
                    {/* AI Model Info */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span className="text-slate-600">AI-Powered</span>
                      </div>
                      <span className="text-slate-500">
                        {profile.ai_model_preference?.split('/')[1] || 'DialoGPT'}
                      </span>
                    </div>
                    
                    {/* Chat Button */}
                    <div className="pt-2 border-t border-slate-100">
                      <Button 
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white group-hover:shadow-lg transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          startChat(profile);
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Start Conversation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="text-center py-12">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-12 h-12 text-rose-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Create Your First Memorial
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Start by creating an AI-powered memorial profile of a loved one. Upload photos, voice recordings, and memories to bring their spirit back to life.
                </p>
                
                <Button
                  onClick={() => setActiveView('create')}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-4 text-lg shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Memorial Profile
                </Button>
                
                <div className="grid grid-cols-3 gap-4 mt-12 text-center">
                  <div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Camera className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-slate-700 mb-1">Upload Photos</h4>
                    <p className="text-xs text-slate-500">Add memories through pictures</p>
                  </div>
                  
                  <div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Volume2 className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-slate-700 mb-1">Voice Samples</h4>
                    <p className="text-xs text-slate-500">Preserve their voice forever</p>
                  </div>
                  
                  <div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-slate-700 mb-1">AI Chat</h4>
                    <p className="text-xs text-slate-500">Have conversations with memories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Powered by Advanced AI Technology
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Our AI uses Hugging Face models, voice cloning, and real-time processing to create meaningful conversations with your loved ones' memories.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Hugging Face AI</h3>
                  <p className="text-sm text-slate-600">
                    Advanced conversational AI models that understand context and emotions
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Voice Cloning</h3>
                  <p className="text-sm text-slate-600">
                    ElevenLabs technology recreates their voice for authentic conversations
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Real-time Chat</h3>
                  <p className="text-sm text-slate-600">
                    Live database updates and instant AI responses powered by Supabase
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MemorialChat;