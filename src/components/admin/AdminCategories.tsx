import React, { useState, useEffect } from 'react';
import { 
  getNavigationCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '@/services/categoryService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Plus } from 'lucide-react';
import CategoryCard from './CategoryCard';
import CategoryForm from './CategoryForm';
import SubcategoryForm from './SubcategoryForm';
import SubcategoryList from './SubcategoryList';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageMethod, setImageMethod] = useState<'url' | 'upload'>('url');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    showInNavigation: true,
    navigationOrder: 0,
    subcategories: []
  });
  const [subcategoryFormData, setSubcategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    showInNavigation: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleCategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCategoryNameChange = (e) => {
    const name = e.target.value;
    setCategoryFormData({
      ...categoryFormData,
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

  const handleOpenCreateCategoryModal = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      showInNavigation: true,
      navigationOrder: categories.length + 1,
      subcategories: []
    });
    setImageMethod('url');
    setUploadedImage(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      showInNavigation: category.showInNavigation !== false,
      navigationOrder: category.navigationOrder || 0,
      subcategories: category.subcategories || []
    });
    setImageMethod('url');
    setUploadedImage(null);
    setIsCategoryModalOpen(true);
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = categoryFormData.imageUrl;
      
      if (imageMethod === 'upload' && uploadedImage) {
        finalImageUrl = URL.createObjectURL(uploadedImage);
      }
      
      const dataToSave = {
        ...categoryFormData,
        imageUrl: finalImageUrl,
      };
      
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          ...dataToSave,
          subcategories: editingCategory.subcategories,
        });
        toast({
          title: 'Success',
          description: `Category "${categoryFormData.name}" has been updated.`,
        });
      } else {
        await createCategory({
          ...dataToSave,
          subcategories: [],
        });
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

  const handleSubcategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSubcategoryFormData({
      ...subcategoryFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubcategoryNameChange = (e) => {
    const name = e.target.value;
    setSubcategoryFormData({
      ...subcategoryFormData,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  };

  const handleOpenCreateSubcategoryModal = (category) => {
    setSelectedCategory(category);
    setEditingSubcategory(null);
    setSubcategoryFormData({
      name: '',
      slug: '',
      description: '',
      showInNavigation: true,
    });
    setIsSubcategoryModalOpen(true);
  };

  const handleOpenEditSubcategoryModal = (category, subcategory) => {
    setSelectedCategory(category);
    setEditingSubcategory(subcategory);
    setSubcategoryFormData({
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || '',
      showInNavigation: subcategory.showInNavigation !== false,
    });
    setIsSubcategoryModalOpen(true);
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
      if (editingSubcategory) {
        await updateSubcategory(selectedCategory.id, editingSubcategory.id, subcategoryFormData);
        toast({
          title: 'Success',
          description: `Subcategory "${subcategoryFormData.name}" has been updated.`,
        });
      } else {
        await createSubcategory(selectedCategory.id, subcategoryFormData);
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

  const handleDeleteSubcategory = async (category, subcategory) => {
    if (window.confirm(`Are you sure you want to delete subcategory "${subcategory.name}"? This action cannot be undone.`)) {
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
          description: 'Failed to delete subcategory. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-foreground">Categories</h2>
        <Button 
          onClick={handleOpenCreateCategoryModal}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 font-medium shadow-md border border-primary/20 transition-all hover:scale-[1.03] active:scale-[0.97]"
        >
          <PlusCircle className="h-5 w-5 mr-2" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-foreground">Loading categories...</div>
      ) : categories.length === 0 ? (
        <Card className="border border-border shadow-sm bg-card">
          <CardContent className="pt-6 text-center py-12">
            <p className="mb-6 text-foreground text-lg">No categories found. Create your first category to get started.</p>
            <Button 
              onClick={handleOpenCreateCategoryModal}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 font-medium shadow-md border border-primary/20 transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Add Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category.id} className="border border-border shadow-sm bg-card overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">/{category.slug}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleOpenEditCategoryModal(category)}
                        variant="outline" 
                        size="sm"
                      >
                        Edit Category
                      </Button>
                      <Button 
                        onClick={() => handleDeleteCategory(category)}
                        variant="destructive" 
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-foreground mb-5">
                    {category.description || <span className="text-muted-foreground italic">No description</span>}
                  </p>
                  
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-foreground">Subcategories</h4>
                      <Button 
                        onClick={() => handleOpenCreateSubcategoryModal(category)}
                        variant="ghost" 
                        size="sm"
                        className="text-xs"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Subcategory
                      </Button>
                    </div>
                    <SubcategoryList 
                      subcategories={category.subcategories} 
                      onEdit={(subcategory) => handleOpenEditSubcategoryModal(category, subcategory)}
                      onDelete={(subcategory) => handleDeleteSubcategory(category, subcategory)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-background border border-border shadow-lg">
          <DialogHeader className="p-6 pb-2 bg-background border-b border-border/50">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Configure the category details below. Categories are used to organize your products.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 pb-6">
            <CategoryForm 
              formData={categoryFormData}
              isEditing={!!editingCategory}
              onInputChange={handleCategoryInputChange}
              onNameChange={handleCategoryNameChange}
              onSubmit={handleSubmitCategory}
              onCancel={() => setIsCategoryModalOpen(false)}
              imageMethod={imageMethod}
              onImageMethodChange={handleImageMethodChange}
              onFileChange={handleFileChange}
              isLoading={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubcategoryModalOpen} onOpenChange={setIsSubcategoryModalOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-background border border-border shadow-lg">
          <DialogHeader className="p-6 pb-2 bg-background border-b border-border/50">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {editingSubcategory 
                ? `Edit Subcategory: ${editingSubcategory.name}` 
                : `Add Subcategory to ${selectedCategory?.name || 'Category'}`}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Configure the subcategory details below. Subcategories help further organize products within a category.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 pb-6">
            <SubcategoryForm 
              formData={subcategoryFormData}
              isEditing={!!editingSubcategory}
              onInputChange={handleSubcategoryInputChange}
              onNameChange={handleSubcategoryNameChange}
              onSubmit={handleSubmitSubcategory}
              onCancel={() => setIsSubcategoryModalOpen(false)}
              isLoading={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
