
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { 
  getBlogCategories, 
  addBlogCategory, 
  updateBlogCategory, 
  deleteBlogCategory,
  BlogCategory
} from '@/services/blog';

const BlogCategoriesManager = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<BlogCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const fetchedCategories = await getBlogCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories. Please try again.',
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

    // Auto-generate slug from name if slug field hasn't been manually edited
    if (name === 'name' && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }));
    }
  };

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: BlogCategory) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (category: BlogCategory) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
      try {
        await deleteBlogCategory(category.id);
        toast({
          title: 'Success',
          description: `Category "${category.name}" has been deleted.`,
        });
        fetchCategories();
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

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.slug.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category slug is required.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (currentCategory) {
        // Update existing category
        await updateBlogCategory(currentCategory.id, formData);
        toast({
          title: 'Success',
          description: `Category "${formData.name}" has been updated.`,
        });
      } else {
        // Add new category
        await addBlogCategory(formData);
        toast({
          title: 'Success',
          description: `Category "${formData.name}" has been created.`,
        });
      }
      
      setIsDialogOpen(false);
      fetchCategories();
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Blog Categories</CardTitle>
        <Button onClick={handleAddCategory} size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No categories found. Create your first category to get started.</p>
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-gray-500">{category.slug}</TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {category.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
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
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentCategory ? 'Edit Category' : 'Add Category'}
              </DialogTitle>
              <DialogDescription>
                {currentCategory
                  ? 'Edit the details of this category.'
                  : 'Create a new category for organizing blog posts.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
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
                  required
                />
                <p className="text-xs text-gray-500">
                  Used in URLs, e.g., /blog/category/your-slug
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {currentCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BlogCategoriesManager;
