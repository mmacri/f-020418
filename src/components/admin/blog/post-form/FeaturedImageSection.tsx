
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Image } from 'lucide-react';
import { BlogPostInput } from '@/services/blog';
import { ImageWithFallback } from '@/lib/images';
import BlogImageUploader from '../BlogImageUploader';

interface FeaturedImageSectionProps {
  formData: BlogPostInput;
  onChange: (data: Partial<BlogPostInput>) => void;
}

export const FeaturedImageSection: React.FC<FeaturedImageSectionProps> = ({ 
  formData, 
  onChange 
}) => {
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    onChange({ tags: tagsArray });
  };

  const handleImageChange = (imageUrl: string) => {
    onChange({ 
      image: imageUrl,
      image_url: imageUrl
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center">
        <Image className="mr-2 h-5 w-5" /> Featured Image
      </h3>
      
      <div className="space-y-2">
        <Label>Cover Image</Label>
        <div className="flex flex-col space-y-4">
          <BlogImageUploader
            currentImage={formData.image || formData.image_url}
            onImageChange={handleImageChange}
          />
          
          {(formData.image || formData.image_url) && (
            <div className="aspect-video bg-muted/20 rounded-md overflow-hidden border">
              <ImageWithFallback
                src={formData.image || formData.image_url || ''}
                alt="Featured image"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          name="tags"
          value={formData.tags?.join(', ')}
          onChange={handleTagsChange}
          placeholder="tag1, tag2, tag3"
        />
      </div>
    </div>
  );
};
