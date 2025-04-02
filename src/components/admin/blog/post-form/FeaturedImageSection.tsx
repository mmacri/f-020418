
import React from 'react';
import { Image } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { BlogPostFormValues } from './schema';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ImageWithFallback } from '@/lib/images';
import BlogImageUploader from '../BlogImageUploader';

export const FeaturedImageSection: React.FC = () => {
  const { control, setValue, watch } = useFormContext<BlogPostFormValues>();
  const imageUrl = watch('image') || watch('image_url');
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setValue('tags', tagsArray, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handleImageChange = (url: string) => {
    setValue('image', url, {
      shouldValidate: true,
      shouldDirty: true
    });
    setValue('image_url', url, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center">
        <Image className="mr-2 h-5 w-5" /> Featured Image
      </h3>
      
      <div className="space-y-2">
        <FormLabel>Cover Image</FormLabel>
        <div className="flex flex-col space-y-4">
          <BlogImageUploader
            currentImage={imageUrl}
            onImageChange={handleImageChange}
          />
          
          {imageUrl && (
            <div className="aspect-video bg-muted/20 rounded-md overflow-hidden border">
              <ImageWithFallback
                src={imageUrl}
                alt="Featured image"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
      
      <FormField
        control={control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags (comma separated)</FormLabel>
            <FormControl>
              <Input
                value={field.value?.join(', ')}
                onChange={handleTagsChange}
                placeholder="tag1, tag2, tag3"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
