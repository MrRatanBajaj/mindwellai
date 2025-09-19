import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  BookOpen, 
  Video, 
  Headphones, 
  FileText, 
  Link, 
  Heart,
  Share2,
  Plus,
  Search,
  Filter,
  ThumbsUp,
  Clock,
  Eye,
  Star,
  User
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'exercise' | 'tool' | 'worksheet';
  category: string;
  url?: string;
  content?: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  likes: number;
  views: number;
  rating: number;
  tags: string[];
  therapyModels: string[];
  isLiked?: boolean;
  isSaved?: boolean;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'CBT Thought Record Worksheet',
    description: 'A structured worksheet to identify and challenge negative thought patterns',
    type: 'worksheet',
    category: 'Cognitive Behavioral Therapy',
    content: 'Downloadable PDF worksheet for tracking thoughts, emotions, and behaviors',
    author: 'Dr. Sarah Chen',
    authorAvatar: 'SC',
    createdAt: '2 hours ago',
    likes: 47,
    views: 234,
    rating: 4.8,
    tags: ['CBT', 'Anxiety', 'Depression', 'Thought patterns'],
    therapyModels: ['cbt'],
    isLiked: false,
    isSaved: true
  },
  {
    id: '2',
    title: 'Mindfulness Body Scan Meditation',
    description: '15-minute guided meditation for stress relief and present-moment awareness',
    type: 'audio',
    category: 'Mindfulness',
    url: 'https://example.com/meditation',
    author: 'Maya Rodriguez',
    authorAvatar: 'MR',
    createdAt: '1 day ago',
    likes: 89,
    views: 567,
    rating: 4.9,
    tags: ['Mindfulness', 'Meditation', 'Stress', 'Relaxation'],
    therapyModels: ['mindfulness'],
    isLiked: true,
    isSaved: false
  },
  {
    id: '3',
    title: 'DBT Emotional Regulation Techniques',
    description: 'Video explaining TIPP skills for managing intense emotions',
    type: 'video',
    category: 'Dialectical Behavior Therapy',
    url: 'https://youtube.com/watch?v=example',
    author: 'Alex Thompson',
    authorAvatar: 'AT',
    createdAt: '3 days ago',
    likes: 156,
    views: 892,
    rating: 4.7,
    tags: ['DBT', 'Emotional regulation', 'Crisis skills', 'TIPP'],
    therapyModels: ['dbt'],
    isLiked: false,
    isSaved: true
  },
  {
    id: '4',
    title: 'Grounding Techniques for Anxiety',
    description: 'Quick and effective grounding exercises for panic attacks and overwhelming anxiety',
    type: 'exercise',
    category: 'Anxiety Management',
    content: '5-4-3-2-1 technique and other grounding methods',
    author: 'Jordan Kim',
    authorAvatar: 'JK',
    createdAt: '1 week ago',
    likes: 203,
    views: 1245,
    rating: 4.9,
    tags: ['Anxiety', 'Panic attacks', 'Grounding', 'Coping skills'],
    therapyModels: ['cbt', 'mindfulness'],
    isLiked: true,
    isSaved: true
  }
];

const ResourceSharing: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [filteredResources, setFilteredResources] = useState<Resource[]>(mockResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'article' as Resource['type'],
    category: '',
    url: '',
    content: '',
    tags: '',
    therapyModels: [] as string[]
  });

  // Filter resources based on search and filters
  useEffect(() => {
    let filtered = resources;

    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    setFilteredResources(filtered);
  }, [resources, searchQuery, selectedType, selectedCategory]);

  const handleLike = (resourceId: string) => {
    setResources(prev => prev.map(resource =>
      resource.id === resourceId
        ? {
            ...resource,
            likes: resource.isLiked ? resource.likes - 1 : resource.likes + 1,
            isLiked: !resource.isLiked
          }
        : resource
    ));
  };

  const handleSave = (resourceId: string) => {
    setResources(prev => prev.map(resource =>
      resource.id === resourceId
        ? { ...resource, isSaved: !resource.isSaved }
        : resource
    ));
    
    const resource = resources.find(r => r.id === resourceId);
    toast({
      title: resource?.isSaved ? "Removed from saved" : "Saved successfully",
      description: resource?.isSaved ? "Resource removed from your saved items" : "Resource added to your saved items",
    });
  };

  const handleAddResource = () => {
    if (!newResource.title || !newResource.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least title and description",
        variant: "destructive"
      });
      return;
    }

    const resource: Resource = {
      id: Date.now().toString(),
      ...newResource,
      author: user?.email?.split('@')[0] || 'Anonymous',
      authorAvatar: user?.email?.charAt(0).toUpperCase() || 'A',
      createdAt: 'Just now',
      likes: 0,
      views: 0,
      rating: 0,
      tags: newResource.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isLiked: false,
      isSaved: false
    };

    setResources(prev => [resource, ...prev]);
    setNewResource({
      title: '',
      description: '',
      type: 'article',
      category: '',
      url: '',
      content: '',
      tags: '',
      therapyModels: []
    });
    setShowAddForm(false);

    toast({
      title: "Resource Added",
      description: "Your resource has been shared with the community",
    });
  };

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article':
        return FileText;
      case 'video':
        return Video;
      case 'audio':
        return Headphones;
      case 'exercise':
        return Heart;
      case 'tool':
        return Link;
      case 'worksheet':
        return BookOpen;
      default:
        return FileText;
    }
  };

  const resourceTypes = ['all', 'article', 'video', 'audio', 'exercise', 'tool', 'worksheet'];
  const categories = ['all', 'Cognitive Behavioral Therapy', 'Dialectical Behavior Therapy', 'Mindfulness', 'Anxiety Management', 'Depression Support'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Resource Library</h2>
          <p className="text-slate-600">Share and discover helpful mental health resources</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-mindwell-500 to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Share Resource
        </Button>
      </div>

      {/* Add Resource Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Share a New Resource</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Resource title"
                    value={newResource.title}
                    onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <select
                    className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-mindwell-500"
                    value={newResource.type}
                    onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value as Resource['type'] }))}
                  >
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="exercise">Exercise</option>
                    <option value="tool">Tool</option>
                    <option value="worksheet">Worksheet</option>
                  </select>
                </div>
                
                <Textarea
                  placeholder="Description"
                  value={newResource.description}
                  onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Category"
                    value={newResource.category}
                    onChange={(e) => setNewResource(prev => ({ ...prev, category: e.target.value }))}
                  />
                  <Input
                    placeholder="URL (optional)"
                    value={newResource.url}
                    onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>
                
                <Input
                  placeholder="Tags (comma separated)"
                  value={newResource.tags}
                  onChange={(e) => setNewResource(prev => ({ ...prev, tags: e.target.value }))}
                />
                
                <div className="flex gap-2">
                  <Button onClick={handleAddResource}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Resource
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-mindwell-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {resourceTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              
              <select
                className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-mindwell-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid gap-6">
        {filteredResources.map((resource) => {
          const TypeIcon = getTypeIcon(resource.type);
          
          return (
            <motion.div
              key={resource.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-mindwell-400 to-mindwell-600 flex items-center justify-center text-white">
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-slate-800">{resource.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        
                        <p className="text-slate-600 mb-3">{resource.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{resource.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{resource.createdAt}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{resource.views}</span>
                          </div>
                          {resource.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{resource.rating}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {resource.tags.slice(0, 4).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {resource.tags.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{resource.tags.length - 4} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(resource.id)}
                            className={resource.isLiked ? 'text-red-600' : 'text-slate-600'}
                          >
                            <ThumbsUp className={`w-4 h-4 mr-1 ${resource.isLiked ? 'fill-current' : ''}`} />
                            {resource.likes}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSave(resource.id)}
                            className={resource.isSaved ? 'text-blue-600' : 'text-slate-600'}
                          >
                            <BookOpen className={`w-4 h-4 mr-1 ${resource.isSaved ? 'fill-current' : ''}`} />
                            {resource.isSaved ? 'Saved' : 'Save'}
                          </Button>
                          
                          {resource.url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <Link className="w-4 h-4 mr-1" />
                                View
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No resources found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ResourceSharing;