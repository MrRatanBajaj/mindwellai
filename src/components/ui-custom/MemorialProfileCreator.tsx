import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, Mic, MicOff, Image, Sparkles, User, Heart,
  X, Check, Camera, Volume2, Play, Pause, Loader2, Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MemorialProfileCreatorProps {
  onProfileCreated: () => void;
}

const MemorialProfileCreator: React.FC<MemorialProfileCreatorProps> = ({ onProfileCreated }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    biography: '',
    conversationStyle: 'warm',
    aiModel: 'microsoft/DialoGPT-medium'
  });
  
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [uploadedAudio, setUploadedAudio] = useState<File[]>([]);
  const [memories, setMemories] = useState([{ title: '', content: '' }]);
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const personalityTraits = [
    'Caring', 'Humorous', 'Wise', 'Gentle', 'Strong', 'Creative',
    'Adventurous', 'Patient', 'Optimistic', 'Thoughtful', 'Protective', 'Loving',
    'Playful', 'Serious', 'Encouraging', 'Artistic', 'Spiritual', 'Practical'
  ];

  const conversationStyles = [
    { value: 'warm', label: 'Warm & Affectionate' },
    { value: 'wise', label: 'Wise & Guiding' },
    { value: 'playful', label: 'Playful & Humorous' },
    { value: 'gentle', label: 'Gentle & Soothing' },
    { value: 'encouraging', label: 'Encouraging & Motivating' }
  ];

  const aiModels = [
    { value: 'microsoft/DialoGPT-medium', label: 'DialoGPT (Conversational)' },
    { value: 'facebook/blenderbot-400M-distill', label: 'BlenderBot (Empathetic)' },
    { value: 'microsoft/DialoGPT-large', label: 'DialoGPT Large (Advanced)' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTrait = (trait: string) => {
    setSelectedTraits(prev =>
      prev.includes(trait)
        ? prev.filter(t => t !== trait)
        : [...prev, trait]
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedPhotos(prev => [...prev, ...files]);
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedAudio(prev => [...prev, ...files]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const file = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        setUploadedAudio(prev => [...prev, file]);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access to record voice samples',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeAudio = (index: number) => {
    setUploadedAudio(prev => prev.filter((_, i) => i !== index));
  };

  const addMemory = () => {
    setMemories(prev => [...prev, { title: '', content: '' }]);
  };

  const updateMemory = (index: number, field: string, value: string) => {
    setMemories(prev => prev.map((memory, i) => 
      i === index ? { ...memory, [field]: value } : memory
    ));
  };

  const removeMemory = (index: number) => {
    if (memories.length > 1) {
      setMemories(prev => prev.filter((_, i) => i !== index));
    }
  };

  const uploadFiles = async (memorialId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let uploadedCount = 0;
    const totalFiles = uploadedPhotos.length + uploadedAudio.length;

    // Upload photos
    for (const photo of uploadedPhotos) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${user.id}/${memorialId}/photos/${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('memorial-photos')
        .upload(fileName, photo);

      if (!error) {
        // Create memory record for photo
        await supabase.from('memorial_memories').insert({
          memorial_id: memorialId,
          memory_type: 'photo',
          title: `Photo ${uploadedCount + 1}`,
          file_url: fileName
        });
      }
      
      uploadedCount++;
      setUploadProgress((uploadedCount / totalFiles) * 100);
    }

    // Upload audio files
    for (const audio of uploadedAudio) {
      const fileExt = audio.name.split('.').pop();
      const fileName = `${user.id}/${memorialId}/audio/${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('memorial-audio')
        .upload(fileName, audio);

      if (!error) {
        // Create memory record for audio
        await supabase.from('memorial_memories').insert({
          memorial_id: memorialId,
          memory_type: 'audio',
          title: `Voice Sample ${uploadedCount - uploadedPhotos.length + 1}`,
          file_url: fileName
        });
      }
      
      uploadedCount++;
      setUploadProgress((uploadedCount / totalFiles) * 100);
    }
  };

  const createMemorialProfile = async () => {
    if (!formData.name || !formData.relationship) {
      toast({
        title: 'Missing Information',
        description: 'Please provide at least a name and relationship',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create memorial profile
      const { data: profile, error } = await supabase
        .from('memorial_profiles')
        .insert({
          name: formData.name,
          relationship: formData.relationship,
          biography: formData.biography || null,
          personality_traits: selectedTraits.length > 0 ? selectedTraits : null,
          ai_model_preference: formData.aiModel,
          conversation_style: formData.conversationStyle,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Upload files and create memory records
      if (uploadedPhotos.length > 0 || uploadedAudio.length > 0) {
        await uploadFiles(profile.id);
      }

      // Create text memories
      for (const memory of memories) {
        if (memory.title && memory.content) {
          await supabase.from('memorial_memories').insert({
            memorial_id: profile.id,
            memory_type: 'text',
            title: memory.title,
            content: memory.content
          });
        }
      }

      toast({
        title: 'Memorial Created Successfully',
        description: `${formData.name}'s memorial profile has been created with AI capabilities`,
      });

      onProfileCreated();
    } catch (error) {
      console.error('Error creating memorial:', error);
      toast({
        title: 'Error',
        description: 'Failed to create memorial profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center justify-center space-x-2">
          <Heart className="w-6 h-6 text-rose-500" />
          <span>Create Memorial Profile</span>
        </CardTitle>
        <CardDescription className="text-slate-600">
          Step {step} of 4: Build an AI-powered memorial with photos, voice, and memories
        </CardDescription>
        <Progress value={(step / 4) * 100} className="w-full mt-4" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <User className="w-5 h-5 text-rose-500" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Memorial Name *
                </label>
                <Input 
                  placeholder="Enter the name of your loved one"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="border-slate-200 focus:border-rose-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Relationship *
                </label>
                <Input 
                  placeholder="e.g., Mother, Father, Grandparent"
                  value={formData.relationship}
                  onChange={(e) => handleInputChange('relationship', e.target.value)}
                  className="border-slate-200 focus:border-rose-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Biography
              </label>
              <Textarea
                placeholder="Tell us about their life, achievements, and what made them special..."
                value={formData.biography}
                onChange={(e) => handleInputChange('biography', e.target.value)}
                className="border-slate-200 focus:border-rose-500 h-32"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Conversation Style
                </label>
                <Select value={formData.conversationStyle} onValueChange={(value) => handleInputChange('conversationStyle', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select conversation style" />
                  </SelectTrigger>
                  <SelectContent>
                    {conversationStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  AI Model Preference
                </label>
                <Select value={formData.aiModel} onValueChange={(value) => handleInputChange('aiModel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Personality Traits */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <span>Personality Traits</span>
            </h3>
            <p className="text-slate-600">Select traits that best describe their personality</p>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {personalityTraits.map((trait) => (
                <Badge
                  key={trait}
                  variant={selectedTraits.includes(trait) ? "default" : "secondary"}
                  className={`cursor-pointer p-2 text-center transition-all ${
                    selectedTraits.includes(trait) 
                      ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                      : 'hover:bg-rose-100'
                  }`}
                  onClick={() => toggleTrait(trait)}
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Photos and Voice */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Camera className="w-5 h-5 text-rose-500" />
              <span>Photos & Voice Samples</span>
            </h3>
            
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Photos
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-rose-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Image className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Click to upload photos</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 50MB each</p>
                </label>
              </div>
              
              {uploadedPhotos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Recording */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Voice Samples
              </label>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={loading}
                  >
                    {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                  {isRecording && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-600">Recording...</span>
                    </div>
                  )}
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload" className="cursor-pointer">
                    <Volume2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Or upload audio files</p>
                    <p className="text-xs text-slate-500 mt-1">MP3, WAV up to 100MB each</p>
                  </label>
                </div>

                {uploadedAudio.length > 0 && (
                  <div className="space-y-2">
                    {uploadedAudio.map((audio, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Volume2 className="w-4 h-4 text-slate-600" />
                          <span className="text-sm font-medium">{audio.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAudio(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Memories */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>Special Memories</span>
            </h3>
            <p className="text-slate-600">Add important memories, stories, and phrases they used to say</p>
            
            {memories.map((memory, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium">Memory {index + 1}</h4>
                  {memories.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMemory(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Input
                    placeholder="Memory title (e.g., 'Mom's famous saying')"
                    value={memory.title}
                    onChange={(e) => updateMemory(index, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Describe the memory, story, or phrase..."
                    value={memory.content}
                    onChange={(e) => updateMemory(index, 'content', e.target.value)}
                    className="h-24"
                  />
                </div>
              </Card>
            ))}
            
            <Button
              variant="outline"
              onClick={addMemory}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Memory
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 4 ? (
            <Button onClick={nextStep} className="bg-rose-500 hover:bg-rose-600">
              Next
            </Button>
          ) : (
            <Button
              onClick={createMemorialProfile}
              disabled={loading}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Memorial...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Memorial Profile
                </>
              )}
            </Button>
          )}
        </div>

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-slate-600 mt-2">Uploading files... {Math.round(uploadProgress)}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemorialProfileCreator;