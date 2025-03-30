import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import CategoryForm from './CategoryForm';
import SubcategoryForm from './SubcategoryForm';
import CategoryCard from './CategoryCard';
import { getCategoriesWithSubcategories, createCategory, updateCategory, deleteCategory, createSubcategory, updateSubcategory, deleteSubcategory } from '@/services/categoryService';

const initialCategoryForm = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  showInNavigation: true,
  navigationOrder: 0,
  subcategories: []
};

const initialSubcategoryForm = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  showInNavigation: true
};

const AdminCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState(initialCategoryForm);
  const [subcategoryFormData, setSubcategoryFormData] = useState(initialSubcategoryForm);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageMethod, setImageMethod] = useState<'url' | 'upload'>('url');
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getCategoriesWithSubcategories();
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

  const handleCategoryFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubcategoryFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSubcategoryFormData({
      ...subcategoryFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCategoryNameChange = (e) => {
    const { value } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      name: value,
      slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  };

  const handleSubcategoryNameChange = (e) => {
    const { value } = e.target;
    setSubcategoryFormData({
      ...subcategoryFormData,
      name: value,
      slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  };

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryFormData({
        ...category,
        showInNavigation: category.showInNavigation !== false,
      });
    } else {
      setEditingCategory(null);
      setCategoryFormData(initialCategoryForm);
    }
    setIsCategoryModalOpen(true);
  };

  const openSubcategoryModal = (category, subcategory = null) => {
    setSelectedCategory(category);
    if (subcategory) {
      setEditingSubcategory(subcategory);
      setSubcategoryFormData({
        ...subcategory,
        showInNavigation: subcategory.showInNavigation !== false,
      });
      setImageMethod(subcategory.imageUrl ? 'url' : 'upload');
    } else {
      setEditingSubcategory(null);
      setSubcategoryFormData(initialSubcategoryForm);
      setImageMethod('url');
    }
    setIsSubcategoryModalOpen(true);
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryFormData);
        toast({
          title: 'Success',
          description: `Category "${categoryFormData.name}" has been updated.`,
        });
      } else {
        await createCategory(categoryFormData);
        toast({
          title: 'Success',
          description: `Category "${categoryFormData.name}" has been created.`,
        });
      }
      
      setIsCategoryModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save category. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSubcategory = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!selectedCategory) {
      toast({
        title: 'Error',
        description: 'No category selected.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Handle image upload if needed
      let finalImageUrl = subcategoryFormData.imageUrl;
      
      if (imageMethod === 'upload' && uploadedImage) {
        // In a real app, you would upload to a server here
        // For now, we'll use URL.createObjectURL for demo purposes
        finalImageUrl = URL.createObjectURL(uploadedImage);
      }
      
      const dataToSave = {
        ...subcategoryFormData,
        imageUrl: finalImageUrl,
      };
      
      if (editingSubcategory) {
        await updateSubcategory(selectedCategory.id, editingSubcategory.id, dataToSave);
        toast({
          title: 'Success',
          description: `Subcategory "${subcategoryFormData.name}" has been updated.`,
        });
      } else {
        await createSubcategory(selectedCategory.id, dataToSave);
        toast({
          title: 'Success',
          description: `Subcategory "${subcategoryFormData.name}" has been created.`,
        });
      }
      
      setIsSubcategoryModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving subcategory:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save subcategory. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This will also delete all its subcategories.`)) {
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
          description: error.message || 'Failed to delete category. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteSubcategory = async (category, subcategory) => {
    if (window.confirm(`Are you sure you want to delete subcategory "${subcategory.name}"?`)) {
      try {
        await deleteSubcategory(category.id, subcategory.id);
        toast({
          title: 'Success',
          description: `Subcategory "${subcategory.name}" has been deleted.`,
        });
        fetchCategories();
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete subcategory. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleFileChange = (file) => {
    setUploadedImage(file);
  };

  const handleImageMethodChange = (value: 'url' | 'upload') => {
    setImageMethod(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Categories Management</h2>
        <Button onClick={() => openCategoryModal()}>Add Category</Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={() => openCategoryModal(category)}
              onDelete={() => handleDeleteCategory(category)}
              onAddSubcategory={() => openSubcategoryModal(category)}
              onEditSubcategory={(subcategory) => openSubcategoryModal(category, subcategory)}
              onDeleteSubcategory={(subcategory) => handleDeleteSubcategory(category, subcategory)}
            />
          ))}
        </div>
      )}
      
      {/* Category Form Modal */}
      <Sheet open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <SheetContent className="md:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</SheetTitle>
          </SheetHeader>
          <CategoryForm
            formData={categoryFormData}
            isEditing={!!editingCategory}
            onInputChange={handleCategoryFormChange}
            onNameChange={handleCategoryNameChange}
            onSubmit={handleSubmitCategory}
            onCancel={() => setIsCategoryModalOpen(false)}
            isLoading={isSubmitting}
          />
        </SheetContent>
      </Sheet>
      
      {/* Subcategory Form Modal */}
      <Sheet open={isSubcategoryModalOpen} onOpenChange={setIsSubcategoryModalOpen}>
        <SheetContent className="md:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
              {selectedCategory && (
                <span className="block text-sm font-normal mt-1 text-muted-foreground">
                  For category: {selectedCategory.name}
                </span>
              )}
            </SheetTitle>
          </SheetHeader>
          <SubcategoryForm
            formData={subcategoryFormData}
            isEditing={!!editingSubcategory}
            onInputChange={handleSubcategoryFormChange}
            onNameChange={handleSubcategoryNameChange}
            onSubmit={handleSubmitSubcategory}
            onCancel={() => setIsSubcategoryModalOpen(false)}
            isLoading={isSubmitting}
            imageMethod={imageMethod}
            onImageMethodChange={handleImageMethodChange}
            onFileChange={handleFileChange}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminCategories;
