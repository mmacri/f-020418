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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { BlogPost, BlogPostInput, BlogCategory, generateSeoSuggestions } from '@/services/blog';
import { Loader2, FileText, Calendar, Image, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from './RichTextEditor';
import BlogImageUploader from './BlogImageUploader';
import { ImageWithFallback } from '@/lib/images';
import { format } from 'date-fns';

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
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find(cat => cat.id === value);
    
    setFormData(prev => ({
      ...prev,
      category_id: value,
      category: selectedCategory ? selectedCategory.name : 'General'
    }));
  };

  const handleContentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl,
      image_url: imageUrl
    }));
  };

  const handleGenerateSeoSuggestions = () => {
    if (!formData.title || !formData.excerpt) {
      toast({
        title: 'Missing Info',
        description: 'Please add a title and excerpt before generating SEO suggestions.',
      });
      return;
    }

    const tempPost = {
      ...formData,
      id: 0,
      createdAt: '',
      updatedAt: '',
      published: true,
      date: new Date().toLocaleDateString()
    } as BlogPost;

    const seoSuggestions = generateSeoSuggestions(tempPost);
    
    setFormData(prev => ({
      ...prev,
      seoTitle: seoSuggestions.title,
      seoDescription: seoSuggestions.description,
      seoKeywords: seoSuggestions.keywords
    }));

    toast({
      title: 'SEO Suggestions Generated',
      description: 'SEO title, description, and keywords have been updated.'
    });
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
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <FileText className="mr-2 h-5 w-5" /> Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="auto-generated-if-left-empty"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={2}
                placeholder="A brief summary of the post"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <div className="border rounded-md p-2 bg-card">
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  rows={12}
                />
              </div>
              <div className="flex justify-end mt-2">
                <BlogImageUploader
                  onImageChange={handleImageChange}
                  insertIntoEditor={(url) => {
                    const imageMarkdown = `![Image](${url})`;
                    handleContentChange(formData.content + (formData.content.endsWith('\n') ? '' : '\n') + imageMarkdown + '\n');
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Calendar className="mr-2 h-5 w-5" /> Publication Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Publication Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Schedule Post (Optional)</Label>
                <Input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => handleSwitchChange('published', checked)}
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={!!formData.featured}
                onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
              />
              <Label htmlFor="featured">Featured post (shows at the top of the blog page)</Label>
            </div>
          </div>
          
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
            
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                name="seoTitle"
                value={formData.seoTitle || ''}
                onChange={handleInputChange}
                placeholder="SEO optimized title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                name="seoDescription"
                value={formData.seoDescription || ''}
                onChange={handleInputChange}
                rows={2}
                placeholder="SEO optimized description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seoKeywords">SEO Keywords (comma separated)</Label>
              <Input
                id="seoKeywords"
                name="seoKeywords"
                value={formData.seoKeywords?.join(', ') || ''}
                onChange={(e) => {
                  const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                  setFormData(prev => ({ ...prev, seoKeywords: keywords }));
                }}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
          
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
