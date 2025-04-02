
import React, { useState } from 'react';
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
  const [formData, setFormData] = useState<BlogPostInput>({
    title: editingPost?.title || '',
    slug: editingPost?.slug || '',
    excerpt: editingPost?.excerpt || '',
    content: editingPost?.content || '',
    category: editingPost?.category || 'General',
    category_id: editingPost?.category_id || editingPost?.categoryId || '',
    image: editingPost?.image || editingPost?.image_url || '',
    published: editingPost?.published || false,
    tags: editingPost?.tags || [],
    date: editingPost?.date || new Date().toISOString().split('T')[0],
    author: editingPost?.author || 'Admin',
    scheduledDate: editingPost?.scheduledDate || editingPost?.scheduled_at || '',
    featured: editingPost?.featured || false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (partialData: Partial<BlogPostInput>) => {
    setFormData(prev => ({
      ...prev,
      ...partialData
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
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

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <BasicInfoSection 
            formData={formData} 
            onChange={handleFormChange}
          />
          
          <PublicationSection 
            formData={formData} 
            onChange={handleFormChange}
            categories={categories}
          />
          
          <FeaturedImageSection 
            formData={formData} 
            onChange={handleFormChange}
          />
          
          <SeoSection 
            formData={formData} 
            onChange={handleFormChange}
          />
          
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
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostForm;
