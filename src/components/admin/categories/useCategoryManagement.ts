
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  getCategoriesWithSubcategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  CategoryInput,
  Category,
  Subcategory
} from '@/services/categoryService';
import { generateSlug } from '@/lib/utils';

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubcategoryFormOpen, setIsSubcategoryFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CategoryInput>({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    showInNavigation: true,
    navigationOrder: 0
  });
  
  const [subcategoryFormData, setSubcategoryFormData] = useState<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    showInNavigation: boolean;
  }>({
    id: '',
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    showInNavigation: true
  });
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [imageMethod, setImageMethod] = useState<'url' | 'upload'>('url');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getCategoriesWithSubcategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox special case
    if (type === 'checkbox') {
      const isChecked = (e as React.ChangeEvent<HTMLInputElement>).target.checked;
      setFormData(prev => ({ ...prev, [name]: isChecked }));
      return;
    }
    
    // Handle number inputs
    if (name === 'navigationOrder') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubcategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox special case
    if (type === 'checkbox') {
      const isChecked = (e as React.ChangeEvent<HTMLInputElement>).target.checked;
      setSubcategoryFormData(prev => ({ ...prev, [name]: isChecked }));
      return;
    }
    
    setSubcategoryFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    setFormData(prev => ({ ...prev, name, slug }));
  };

  const handleSubcategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    setSubcategoryFormData(prev => ({ ...prev, name, slug }));
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubcategoryImageChange = (url: string) => {
    setSubcategoryFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const openNewCategoryForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      showInNavigation: true,
      navigationOrder: categories.length
    });
    setIsEditing(false);
    setIsFormOpen(true);
    setImageMethod('url');
  };

  const openEditCategoryForm = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      showInNavigation: category.showInNavigation !== false,
      navigationOrder: category.navigationOrder || 0
    });
    setIsEditing(true);
    setIsFormOpen(true);
    setSelectedCategory(category);
    setImageMethod('url');
  };

  const openNewSubcategoryForm = (category: Category) => {
    setSubcategoryFormData({
      id: '',
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      showInNavigation: true
    });
    setIsEditing(false);
    setIsSubcategoryFormOpen(true);
    setSelectedCategory(category);
    setImageMethod('url');
  };

  const openEditSubcategoryForm = (subcategory: Subcategory) => {
    setSubcategoryFormData({
      id: subcategory.id,
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || '',
      imageUrl: subcategory.imageUrl || '',
      showInNavigation: subcategory.showInNavigation !== false
    });
    
    // Find the parent category
    const parentCategory = categories.find(cat => 
      cat.subcategories?.some(sub => sub.id === subcategory.id)
    );
    
    if (parentCategory) {
      setSelectedCategory(parentCategory);
    }
    
    setIsEditing(true);
    setIsSubcategoryFormOpen(true);
    setImageMethod('url');
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    if (!formData.slug.trim()) {
      toast.error('Category slug is required');
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (isEditing && selectedCategory) {
        await updateCategory(selectedCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully');
      }
      setIsFormOpen(false);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subcategoryFormData.name.trim()) {
      toast.error('Subcategory name is required');
      return;
    }
    
    if (!subcategoryFormData.slug.trim()) {
      toast.error('Subcategory slug is required');
      return;
    }
    
    if (!selectedCategory) {
      toast.error('Parent category not selected');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const dataToSave = {
        ...subcategoryFormData,
      };
      
      if (isEditing) {
        await updateSubcategory(selectedCategory.id, subcategoryFormData.id, dataToSave);
        toast.success('Subcategory updated successfully');
      } else {
        await createSubcategory(selectedCategory.id, dataToSave);
        toast.success('Subcategory created successfully');
      }
      setIsSubcategoryFormOpen(false);
      loadCategories();
    } catch (error) {
      console.error('Error saving subcategory:', error);
      toast.error('Failed to save subcategory');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!window.confirm(`Are you sure you want to delete the category "${category.name}"? This will also delete all subcategories.`)) {
      return;
    }
    
    try {
      await deleteCategory(category.id);
      toast.success('Category deleted successfully');
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleDeleteSubcategory = async (subcategory: Subcategory) => {
    if (!window.confirm(`Are you sure you want to delete the subcategory "${subcategory.name}"?`)) {
      return;
    }
    
    // Find parent category
    const parentCategory = categories.find(cat => 
      cat.subcategories?.some(sub => sub.id === subcategory.id)
    );
    
    if (!parentCategory) {
      toast.error('Parent category not found');
      return;
    }
    
    try {
      await deleteSubcategory(parentCategory.id, subcategory.id);
      toast.success('Subcategory deleted successfully');
      loadCategories();
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Failed to delete subcategory');
    }
  };

  return {
    categories,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    isSubcategoryFormOpen,
    setIsSubcategoryFormOpen,
    isEditing,
    isSaving,
    formData,
    subcategoryFormData,
    selectedCategory,
    imageMethod,
    setImageMethod,
    handleInputChange,
    handleSubcategoryInputChange,
    handleNameChange,
    handleSubcategoryNameChange,
    handleImageChange,
    handleSubcategoryImageChange,
    openNewCategoryForm,
    openEditCategoryForm,
    openNewSubcategoryForm,
    openEditSubcategoryForm,
    handleCategorySubmit,
    handleSubcategorySubmit,
    handleDeleteCategory,
    handleDeleteSubcategory
  };
};
