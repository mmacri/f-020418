
import React, { useState, useEffect } from 'react';
import { getNavigationCategories, createCategory, updateCategory, deleteCategory } from '@/services/categoryService';
import { getCategoryContent } from '@/services/categoryContentService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpRight, Edit, Trash2, PlusCircle, ChevronRight, Folder, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AdminCategoryContent from './AdminCategoryContent';

// Component to manage categories in admin dashboard
const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    showInNavigation: true,
    navigationOrder: 0,
  });
  const { toast } = useToast();

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getNavigationCategories();
      setCategories(data);
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  };

  // Open modal for creating a new category
  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      showInNavigation: true,
      navigationOrder: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing category
  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      showInNavigation: category.showInNavigation !== false,
      navigationOrder: category.navigationOrder || 0,
    });
    setIsModalOpen(true);
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Update existing category
        await updateCategory(editingCategory.id, {
          ...formData,
          subcategories: editingCategory.subcategories,
        });
        toast({
          title: 'Success',
          description: `Category "${formData.name}" has been updated.`,
        });
      } else {
        // Create new category
        await createCategory({
          ...formData,
          subcategories: [],
        });
        toast({
          title: 'Success',
          description: `Category "${formData.name}" has been created.`,
        });
      }
      
      // Close modal and refresh categories
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save category. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      try {
        await deleteCategory(category.id);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Categories</h2>
        <Button onClick={handleOpenCreateModal}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading categories...</div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="mb-4">No categories found. Create your first category to get started.</p>
            <Button onClick={handleOpenCreateModal}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenEditModal(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                {category.showInNavigation !== false && (
                  <Badge variant="outline" className="bg-green-50">Navigation</Badge>
                )}
                <CardDescription className="mt-2 line-clamp-2">
                  {category.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Slug:</span> {category.slug}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Subcategories:</span> {category.subcategories?.length || 0}
                  </div>
                  {category.navigationOrder !== undefined && (
                    <div className="text-sm">
                      <span className="font-medium">Nav Order:</span> {category.navigationOrder}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  asChild
                >
                  <a href={`/categories/${category.slug}`} target="_blank" rel="noopener noreferrer">
                    View Category <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
            </DialogTitle>
            <DialogDescription>
              Configure the category details below. Categories are used to organize your products.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Massage Guns"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="e.g. massage-guns"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500">
                  This will be used in the URL: /categories/{formData.slug}
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of this category"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showInNavigation"
                    name="showInNavigation"
                    checked={formData.showInNavigation}
                    onChange={handleInputChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="showInNavigation">Show in Navigation</Label>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="navigationOrder">Navigation Order</Label>
                  <Input
                    id="navigationOrder"
                    name="navigationOrder"
                    type="number"
                    min="0"
                    value={formData.navigationOrder}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
