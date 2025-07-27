
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Avatar from "@/components/ui-custom/Avatar";
import { 
  Heart, Upload, Mic, Play, Pause, Volume2, Image, 
  MessageSquare, Calendar, Star, ArrowLeft, Send,
  Clock, Users, Sparkles, Camera, HeartHandshake
} from "lucide-react";

const MemorialChat = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedMemorial, setSelectedMemorial] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const memorialProfiles = [
    {
      id: 1,
      name: "Mom",
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80",
      lastActive: "2 hours ago",
      voiceSamples: 25,
      memories: 150,
      specialDate: "Birthday Tomorrow"
    },
    {
      id: 2,
      name: "Dad",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80",
      lastActive: "1 day ago",
      voiceSamples: 18,
      memories: 95,
      specialDate: "Anniversary Next Week"
    },
    {
      id: 3,
      name: "Grandma",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80",
      lastActive: "3 days ago",
      voiceSamples: 32,
      memories: 200,
      specialDate: "Christmas Coming"
    }
  ];

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

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

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-1 shadow-lg border border-slate-200">
              <button
                onClick={() => setActiveTab("create")}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === "create"
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg"
                    : "text-slate-600 hover:text-rose-600"
                }`}
              >
                Create Memorial
              </button>
              <button
                onClick={() => setActiveTab("connect")}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === "connect"
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg"
                    : "text-slate-600 hover:text-rose-600"
                }`}
              >
                Connect & Chat
              </button>
            </div>
          </div>

          {/* Create Memorial Tab */}
          {activeTab === "create" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center justify-center space-x-2">
                    <Upload className="w-6 h-6 text-rose-500" />
                    <span>Create Memorial Profile</span>
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Upload photos and voice recordings to create an AI memorial of your loved one
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Memorial Name
                    </label>
                    <Input 
                      placeholder="Enter the name of your loved one"
                      className="border-slate-200 focus:border-rose-500 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Relationship
                    </label>
                    <Input 
                      placeholder="e.g., Mother, Father, Grandparent..."
                      className="border-slate-200 focus:border-rose-500 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Upload Photos
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-rose-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Image className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">Click to upload photos</p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB each</p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Voice Recordings
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsRecording(!isRecording)}
                          className={`${isRecording ? 'bg-red-50 border-red-200 text-red-700' : 'border-slate-200'}`}
                        >
                          <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
                          {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </Button>
                        <span className="text-sm text-slate-500">
                          {isRecording ? 'Recording...' : 'Click to record voice sample'}
                        </span>
                      </div>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          multiple
                          accept="audio/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="audio-upload"
                        />
                        <label htmlFor="audio-upload" className="cursor-pointer">
                          <Volume2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-600">Or upload audio files</p>
                          <p className="text-xs text-slate-500 mt-1">MP3, WAV up to 50MB each</p>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Special Memories & Phrases
                    </label>
                    <Textarea
                      placeholder="Share special phrases, memories, or things they used to say..."
                      className="border-slate-200 focus:border-rose-500 focus:ring-rose-500 h-32"
                    />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Memorial Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Preview Section */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center justify-center space-x-2">
                    <Camera className="w-6 h-6 text-blue-500" />
                    <span>Preview</span>
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    See how your memorial profile will look
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <Avatar 
                        src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
                        size="xl"
                        className="border-4 border-white shadow-xl"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mt-4">Mom</h3>
                    <p className="text-slate-600">Always in our hearts</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-600">Voice Samples</span>
                      <Badge variant="outline" className="text-rose-600 border-rose-200">
                        0 uploaded
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-600">Photos</span>
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        0 uploaded
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-600">Memories</span>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        0 added
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
                    <p className="text-sm text-slate-600 mb-2">
                      💡 <strong>Tip:</strong> Upload at least 5 voice samples and 10 photos for the best AI experience.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Connect & Chat Tab */}
          {activeTab === "connect" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Memorial Profiles List */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                      <HeartHandshake className="w-5 h-5 text-rose-500" />
                      <span>Memorial Profiles</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {memorialProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        onClick={() => setSelectedMemorial(profile)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                          selectedMemorial?.id === profile.id
                            ? 'bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200'
                            : 'bg-white border border-slate-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar src={profile.image} size="md" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800">{profile.name}</h4>
                            <p className="text-xs text-slate-500">{profile.lastActive}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="text-slate-600">{profile.voiceSamples} voice samples</span>
                          <Badge variant="outline" className="text-rose-600 border-rose-200 text-xs">
                            {profile.specialDate}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Interface */}
              <div className="lg:col-span-2">
                {selectedMemorial ? (
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm h-[600px] flex flex-col">
                    <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-200">
                      <div className="flex items-center space-x-3">
                        <Avatar src={selectedMemorial.image} size="md" />
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-slate-800">
                            Chat with {selectedMemorial.name}
                          </CardTitle>
                          <CardDescription className="text-slate-600">
                            {selectedMemorial.specialDate} • {selectedMemorial.memories} memories available
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 p-6 overflow-y-auto">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Avatar src={selectedMemorial.image} size="sm" />
                          <div className="bg-slate-100 rounded-lg p-3 max-w-xs">
                            <p className="text-sm text-slate-700">
                              Hello sweetheart! I'm so happy you're here. I've been thinking about you on this special day.
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Button size="sm" variant="ghost" className="h-6 px-2">
                                <Volume2 className="w-3 h-3" />
                              </Button>
                              <span className="text-xs text-slate-500">Just now</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 justify-end">
                          <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg p-3 max-w-xs">
                            <p className="text-sm">
                              Hi Mom, I really miss you today. It's your birthday and I wish you were here to celebrate with us.
                            </p>
                            <span className="text-xs text-rose-100 mt-2 block">2 min ago</span>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Avatar src={selectedMemorial.image} size="sm" />
                          <div className="bg-slate-100 rounded-lg p-3 max-w-xs">
                            <p className="text-sm text-slate-700">
                              Oh my dear, I'm always with you in spirit. Remember what I used to say - every birthday is a celebration of the love we shared, not just the years that passed.
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Button size="sm" variant="ghost" className="h-6 px-2">
                                <Volume2 className="w-3 h-3" />
                              </Button>
                              <span className="text-xs text-slate-500">Just now</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <div className="p-4 border-t border-slate-200">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsRecording(!isRecording)}
                          className={`${isRecording ? 'bg-red-50 border-red-200 text-red-700' : 'border-slate-200'}`}
                        >
                          <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
                        </Button>
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 border-slate-200 focus:border-rose-500 focus:ring-rose-500"
                        />
                        <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm h-[600px] flex items-center justify-center">
                    <div className="text-center">
                      <Heart className="w-16 h-16 text-rose-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-600 mb-2">
                        Select a Memorial Profile
                      </h3>
                      <p className="text-slate-500">
                        Choose a loved one to start chatting and sharing memories
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MemorialChat;
