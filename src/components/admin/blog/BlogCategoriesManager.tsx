
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Pencil, Trash2, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Define types for blog categories
interface BlogCategory {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
  createdAt: string;
}

const BlogCategoriesManager = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const { toast } = useToast();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      // Mock data for demo - in a real app, this would come from an API
      const mockCategories: BlogCategory[] = [
        {
          id: 1,
          name: 'Recovery Tips',
          slug: 'recovery-tips',
          description: 'Tips and advice for recovery',
          postCount: 12,
          createdAt: '2023-08-15T00:00:00Z'
        },
        {
          id: 2,
          name: 'Product Reviews',
          slug: 'product-reviews',
          description: 'Reviews of recovery products',
          postCount: 8,
          createdAt: '2023-09-10T00:00:00Z'
        },
        {
          id: 3,
          name: 'News',
          slug: 'news',
          description: 'Latest news in the recovery space',
          postCount: 5,
          createdAt: '2023-10-05T00:00:00Z'
        },
        {
          id: 4,
          name: 'Guides',
          slug: 'guides',
          description: 'Comprehensive guides for recovery',
          postCount: 7,
          createdAt: '2023-11-20T00:00:00Z'
        }
      ];
      
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog categories. Please try again.',
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

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Ensure slug is created if empty
    let categorySlug = formData.slug;
    if (!categorySlug) {
      categorySlug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    try {
      // In a real app, this would be an API call
      if (editingCategory) {
        // Update existing category
        const updatedCategories = categories.map(cat => 
          cat.id === editingCategory.id 
            ? { 
                ...cat, 
                name: formData.name, 
                slug: categorySlug, 
                description: formData.description 
              } 
            : cat
        );
        setCategories(updatedCategories);
        
        toast({
          title: 'Success',
          description: `Category "${formData.name}" has been updated.`,
        });
      } else {
        // Create new category
        const newCategory: BlogCategory = {
          id: Date.now().toString(), // Mock ID generation
          name: formData.name,
          slug: categorySlug,
          description: formData.description,
          postCount: 0,
          createdAt: new Date().toISOString()
        };
        
        setCategories([...categories, newCategory]);
        
        toast({
          title: 'Success',
          description: `Category "${formData.name}" has been created.`,
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'Error',
        description: 'Failed to save category. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category: BlogCategory) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      try {
        // In a real app, this would be an API call
        const filteredCategories = categories.filter(cat => cat.id !== category.id);
        setCategories(filteredCategories);
        
        toast({
          title: 'Success',
          description: `Category "${category.name}" has been deleted.`,
        });
      } catch (error) {
        console.error('Error deleting category:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete category. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-foreground">Blog Categories</h2>
        <div className="flex w-full sm:w-auto space-x-2">
          <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search categories..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleCreateCategory}
            size="default"
            className="whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <Card className="border border-border shadow-sm bg-card">
          <CardContent className="pt-6 text-center py-12">
            <p className="mb-6 text-foreground text-lg">
              {searchTerm ? 'No categories match your search.' : 'No categories found. Create your first category to get started.'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={handleCreateCategory}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Add Category
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.postCount || 0}</TableCell>
                  <TableCell>{formatDate(category.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
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
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Update the category details below.' 
                : 'Add the details for your new blog category.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
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
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Brief description of this category"
              />
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
                {editingCategory ? 'Update' : 'Create'} Category
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogCategoriesManager;
