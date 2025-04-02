
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BlogPostFormValues } from './schema';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { generateSeoSuggestions } from '@/services/blog';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@/services/blog';

export const SeoSection: React.FC = () => {
  const { toast } = useToast();
  const { control, setValue, watch, getValues } = useFormContext<BlogPostFormValues>();
  
  const handleSeoKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
    setValue('seoKeywords', keywords, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handleGenerateSeoSuggestions = () => {
    const title = getValues('title');
    const excerpt = getValues('excerpt');
    
    if (!title || !excerpt) {
      toast({
        title: 'Missing Info',
        description: 'Please add a title and excerpt before generating SEO suggestions.',
      });
      return;
    }

    // Create a temporary BlogPost object with required fields
    const tempPost: BlogPost = {
      id: 0,
      title: getValues('title') || '',
      slug: getValues('slug') || '',
      excerpt: getValues('excerpt') || '',
      content: getValues('content') || '',
      published: true,
      date: getValues('date') || new Date().toLocaleDateString(),
      createdAt: '',
      updatedAt: '',
      categoryId: getValues('category_id'),
      category: getValues('category'),
      author: getValues('author') || 'Admin',
      image: getValues('image'),
      image_url: getValues('image_url'),
      tags: getValues('tags') || [],
      featured: getValues('featured') || false,
      seoTitle: getValues('seoTitle'),
      seoDescription: getValues('seoDescription'),
      seoKeywords: getValues('seoKeywords') || []
    };

    const seoSuggestions = generateSeoSuggestions(tempPost);
    
    setValue('seoTitle', seoSuggestions.title, {
      shouldValidate: true,
      shouldDirty: true
    });
    setValue('seoDescription', seoSuggestions.description, {
      shouldValidate: true,
      shouldDirty: true
    });
    setValue('seoKeywords', seoSuggestions.keywords, {
      shouldValidate: true,
      shouldDirty: true
    });

    toast({
      title: 'SEO Suggestions Generated',
      description: 'SEO title, description, and keywords have been updated.'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">SEO Details</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={handleGenerateSeoSuggestions}
        >
          Generate SEO Suggestions
        </Button>
      </div>
      
      <FormField
        control={control}
        name="seoTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SEO Title</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="SEO optimized title"
              />
            </FormControl>
            <FormDescription>
              Optimized title for search engines (defaults to post title if empty)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="seoDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SEO Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                rows={2}
                placeholder="SEO optimized description"
              />
            </FormControl>
            <FormDescription>
              Brief description for search engines (defaults to excerpt if empty)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="seoKeywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SEO Keywords (comma separated)</FormLabel>
            <FormControl>
              <Input
                value={field.value?.join(', ') || ''}
                onChange={handleSeoKeywordsChange}
                placeholder="keyword1, keyword2, keyword3"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
