
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, ExternalLink, Download, Bookmark } from "lucide-react";
import VideoPlayer from './VideoPlayer';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: any;
  type: 'course' | 'article' | 'exercise' | 'podcast';
}

const ResourceModal: React.FC<ResourceModalProps> = ({ isOpen, onClose, resource, type }) => {
  if (!resource) return null;

  const renderContent = () => {
    switch (type) {
      case 'course':
        return (
          <div className="space-y-6">
            <VideoPlayer
              title={resource.title}
              videoId={resource.videoId || "dQw4w9WgXcQ"}
              thumbnail={resource.image}
              duration={resource.duration}
              onClose={() => {}}
            />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{resource.lessons} Lessons</Badge>
                <Badge variant="outline">{resource.duration}</Badge>
                <Badge variant="outline">By {resource.creator}</Badge>
              </div>
              <p className="text-slate-600">{resource.description}</p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Course Outline:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Introduction to {resource.title}</li>
                  <li>• Understanding the fundamentals</li>
                  <li>• Practical techniques and strategies</li>
                  <li>• Real-world applications</li>
                  <li>• Progress assessment and next steps</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 'exercise':
        return (
          <div className="space-y-6">
            <VideoPlayer
              title={resource.title}
              videoId={resource.videoId || "ZToicYcHIOU"}
              thumbnail={resource.image}
              duration={resource.duration}
              onClose={() => {}}
            />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{resource.category}</Badge>
                <Badge variant="outline">{resource.duration}</Badge>
                <Badge variant="outline">By {resource.instructor}</Badge>
              </div>
              <p className="text-slate-600">{resource.description}</p>
              <div className="bg-mindwell-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Exercise Instructions:</h4>
                <ol className="space-y-2 text-sm">
                  <li>1. Find a comfortable, quiet space</li>
                  <li>2. Set aside the recommended time duration</li>
                  <li>3. Follow along with the guided instructions</li>
                  <li>4. Practice regularly for best results</li>
                </ol>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <img src={resource.image} alt={resource.title} className="w-full h-48 object-cover rounded-lg" />
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{resource.category || resource.readTime}</Badge>
              {resource.author && <Badge variant="outline">By {resource.author}</Badge>}
              {resource.host && <Badge variant="outline">Host: {resource.host}</Badge>}
            </div>
            <p className="text-slate-600">{resource.description}</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{resource.title}</DialogTitle>
        </DialogHeader>
        
        {renderContent()}
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <User className="w-4 h-4" />
            <span>Source: {resource.source}</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button size="sm" className="bg-mindwell-500 hover:bg-mindwell-600">
              <ExternalLink className="w-4 h-4 mr-1" />
              Visit Source
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceModal;
