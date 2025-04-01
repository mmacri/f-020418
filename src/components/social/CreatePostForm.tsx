
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { UserProfile } from '@/types/social';
import { Image, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CreatePostFormProps {
  profile: UserProfile;
  onCreatePost: (content: string, imageUrl?: string) => Promise<any>;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  profile,
  onCreatePost
}) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onCreatePost(content, imageUrl || undefined);
      setContent('');
      setImageUrl('');
      setShowImageInput(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name} />
            <AvatarFallback>{profile.display_name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            
            {showImageInput && (
              <Input
                type="url"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            )}
            
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowImageInput(!showImageInput)}
                className="text-muted-foreground gap-2"
              >
                <Image size={16} />
                <span>{showImageInput ? 'Remove Image' : 'Add Image'}</span>
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                className="gap-2"
              >
                <Send size={16} />
                <span>Post</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
