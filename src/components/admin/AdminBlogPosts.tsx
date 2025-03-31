import React, { useState, useEffect } from 'react';
import { 
  getAllPosts, 
  createPost, 
  updatePost, 
  deletePost,
  BlogPost,
  BlogPostInput,
  BlogCategory,
  generateSeoSuggestions
} from '@/services/blog';
import { getBlogCategories } from '@/services/blog/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Pencil, Trash2, Search, Calendar, FileText, Image } from 'lucide-react';
import { format } from 'date-fns';

const AdminBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogPostInput>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'General',
    category_id: '',
    image: '',
    published: false,
    tags: [],
    date: new Date().toISOString().split('T')[0],
    author: 'Admin'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const categoriesData = await getBlogCategories();
      setCategories(categoriesData);
      
      const postsData = await getAllPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleCreatePost = () => {
    setEditingPost(null);
    const today = new Date().toISOString().split('T')[0];
    
    const defaultCategoryId = categories.length > 0 ? categories[0].id : '';
    const defaultCategoryName = categories.length > 0 ? categories[0].name : 'General';
    
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: defaultCategoryName,
      category_id: defaultCategoryId,
      image: '',
      published: false,
      tags: [],
      date: today,
      author: 'Admin'
    });
    setIsDialogOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || 'General',
      category_id: post.category_id || post.categoryId || '',
      image: post.image || post.image_url || '',
      published: post.published,
      tags: post.tags || [],
      date: post.date || new Date().toISOString().split('T')[0],
      author: post.author || 'Admin',
      scheduledDate: post.scheduledDate || post.scheduled_at || '',
      featured: post.featured || false
    });
    setIsDialogOpen(true);
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
    
    let postSlug = formData.slug;
    if (!postSlug) {
      postSlug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    try {
      const postData = {
        ...formData,
        slug: postSlug,
      };
      
      if (editingPost) {
        await updatePost(String(editingPost.id), postData);
        toast({
          title: 'Success',
          description: `Post "${formData.title}" has been updated.`,
        });
      } else {
        await createPost(postData);
        toast({
          title: 'Success',
          description: `Post "${formData.title}" has been created.`,
        });
      }
      
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: 'Error',
        description: 'Failed to save post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (post: BlogPost) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
      try {
        await deletePost(String(post.id));
        toast({
          title: 'Success',
          description: `Post "${post.title}" has been deleted.`,
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting post:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete post. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.category && post.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-foreground">Blog Posts</h2>
        <div className="flex w-full sm:w-auto space-x-2">
          <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search blog posts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleCreatePost}
            size="default"
            className="whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Post
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="border border-border shadow-sm bg-card">
          <CardContent className="pt-6 text-center py-12">
            <p className="mb-6 text-foreground text-lg">
              {searchTerm ? 'No blog posts match your search.' : 'No blog posts found. Create your first blog post to get started.'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={handleCreatePost}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Add Blog Post
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    {post.published ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : post.scheduledDate && new Date(post.scheduledDate) > new Date() ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Scheduled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(post.date)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPost(post)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePost(post)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={8}
                  required
                />
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
                <Image className="mr-2 h-5 w-5" /> Media & Tags
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="image">Featured Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
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
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingPost ? 'Update' : 'Create'} Post
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlogPosts;
