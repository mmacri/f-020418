
import React, { useState, useEffect } from 'react';
import { getNavigationCategories, createCategory, updateCategory, deleteCategory } from '@/services/categoryService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import CategoryCard from './CategoryCard';
import CategoryForm from './CategoryForm';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imageMethod, setImageMethod] = useState<'url' | 'upload'>('url');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    showInNavigation: true,
    navigationOrder: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  };

  const handleImageMethodChange = (value: 'url' | 'upload') => {
    setImageMethod(value);
  };
  
  const handleFileChange = (file: File | null) => {
    setUploadedImage(file);
  };

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
    setImageMethod('url');
    setUploadedImage(null);
    setIsModalOpen(true);
  };

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
    setImageMethod('url');
    setUploadedImage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // If using file upload and a file exists, we would usually upload it to a server here
      // For this example, we'll handle it as if the upload was successful
      let finalImageUrl = formData.imageUrl;
      
      if (imageMethod === 'upload' && uploadedImage) {
        // In a real implementation, you would upload the file to a server
        // and get the URL back. Here we're just creating a local URL for demo
        finalImageUrl = URL.createObjectURL(uploadedImage);
        
        // You should implement a real file upload here:
        // const uploadResult = await uploadFile(uploadedImage);
        // finalImageUrl = uploadResult.url;
      }
      
      const dataToSave = {
        ...formData,
        imageUrl: finalImageUrl,
      };
      
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          ...dataToSave,
          subcategories: editingCategory.subcategories,
        });
        toast({
          title: 'Success',
          description: `Category "${formData.name}" has been updated.`,
        });
      } else {
        await createCategory({
          ...dataToSave,
          subcategories: [],
        });
        toast({
          title: 'Success',
          description: `Category "${formData.name}" has been created.`,
        });
      }
      
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
            <CategoryCard 
              key={category.id}
              category={category}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteCategory}
            />
          ))}
        </div>
      )}

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
          
          <CategoryForm 
            formData={formData}
            isEditing={!!editingCategory}
            onInputChange={handleInputChange}
            onNameChange={handleNameChange}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            imageMethod={imageMethod}
            onImageMethodChange={handleImageMethodChange}
            onFileChange={handleFileChange}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
