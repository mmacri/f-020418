
import { useState, useEffect, useCallback } from 'react';
import { 
  BlogPost, 
  BlogPostInput, 
  BlogCategory,
  getAllPosts, 
  createPost, 
  updatePost, 
  deletePost,
  getBlogCategories 
} from '@/services/blog';
import { useToast } from '@/hooks/use-toast';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
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
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreatePost = () => {
    setEditingPost(null);
    const defaultCategoryId = categories.length > 0 ? categories[0].id : '';
    const defaultCategoryName = categories.length > 0 ? categories[0].name : 'General';
    
    setIsDialogOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsDialogOpen(true);
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

  const handleSubmit = async (formData: BlogPostInput) => {
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
      
      fetchData();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: 'Error',
        description: 'Failed to save post. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.category && post.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return {
    posts: filteredPosts,
    categories,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    searchTerm,
    setSearchTerm,
    editingPost,
    handleCreatePost,
    handleEditPost,
    handleDeletePost,
    handleSubmit,
    fetchData
  };
};
