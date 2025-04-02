
import React from 'react';
import { 
  Button
} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Loader2, X, Save } from 'lucide-react';
import { BlogPost, BlogPostInput, BlogCategory } from '@/services/blog';
import { BasicInfoSection } from './BasicInfoSection';
import { PublicationSection } from './PublicationSection';
import { FeaturedImageSection } from './FeaturedImageSection';
import { SeoSection } from './SeoSection';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogPostSchema, BlogPostFormValues } from './schema';
import { useToast } from '@/hooks/use-toast';

interface BlogPostFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingPost: BlogPost | null;
  onSubmit: (formData: BlogPostInput) => Promise<void>;
  categories: BlogCategory[];
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({
  isOpen,
  onClose,
  editingPost,
  onSubmit,
  categories
}) => {
  const { toast } = useToast();
  
  // Initialize form with default values or editing post values
  const methods = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: editingPost?.title || '',
      slug: editingPost?.slug || '',
      excerpt: editingPost?.excerpt || '',
      content: editingPost?.content || '',
      category: editingPost?.category || 'General',
      category_id: editingPost?.category_id || editingPost?.categoryId || '',
      image: editingPost?.image || editingPost?.image_url || '',
      image_url: editingPost?.image || editingPost?.image_url || '',
      published: editingPost?.published || false,
      tags: editingPost?.tags || [],
      date: editingPost?.date || new Date().toISOString().split('T')[0],
      author: editingPost?.author || 'Admin',
      scheduledDate: editingPost?.scheduledDate || editingPost?.scheduled_at || '',
      featured: editingPost?.featured || false,
      seoTitle: editingPost?.seoTitle || '',
      seoDescription: editingPost?.seoDescription || '',
      seoKeywords: editingPost?.seoKeywords || []
    }
  });
  
  const { handleSubmit, formState } = methods;
  const { isSubmitting } = formState;

  const handleFormSubmit = async (data: BlogPostFormValues) => {
    try {
      // Prepare the data for the API
      const formData: BlogPostInput = {
        ...data,
        // Map category_id to category if applicable
        category: categories.find(c => c.id === data.category_id)?.name || data.category
      };
      
      await onSubmit(formData);
      toast({
        title: editingPost ? 'Post Updated' : 'Post Created',
        description: `Successfully ${editingPost ? 'updated' : 'created'} the blog post.`
      });
      onClose();
    } catch (error) {
      console.error('Error submitting post:', error);
      toast({
        title: 'Error',
        description: `Failed to ${editingPost ? 'update' : 'create'} the blog post.`,
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
          <DialogDescription>
            {editingPost 
              ? 'Update the blog post details below.' 
              : 'Add the details for your new blog post.'}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
            <BasicInfoSection />
            <PublicationSection categories={categories} />
            <FeaturedImageSection />
            <SeoSection />
            
            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {editingPost ? 'Update' : 'Create'} Post
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostForm;
