
import React from 'react';
import { useCategoryManagement } from './useCategoryManagement';
import {
  CategoryFormDialog,
  SubcategoryFormDialog,
  CategoriesHeader,
  CategoriesGrid
} from './index';

const AdminCategories = () => {
  const {
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
  } = useCategoryManagement();

  return (
    <div className="space-y-6">
      <CategoriesHeader onAddCategory={openNewCategoryForm} />
      
      <CategoriesGrid
        categories={categories}
        isLoading={isLoading}
        onEdit={openEditCategoryForm}
        onDelete={handleDeleteCategory}
        onAddSubcategory={openNewSubcategoryForm}
        onEditSubcategory={openEditSubcategoryForm}
        onDeleteSubcategory={handleDeleteSubcategory}
        onAddCategory={openNewCategoryForm}
      />
      
      {/* Category Form Dialog */}
      <CategoryFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        formData={formData}
        isEditing={isEditing}
        onInputChange={handleInputChange}
        onNameChange={handleNameChange}
        onSubmit={handleCategorySubmit}
        onCancel={() => setIsFormOpen(false)}
        isLoading={isSaving}
        imageMethod={imageMethod}
        onImageMethodChange={setImageMethod}
        onImageChange={handleImageChange}
      />
      
      {/* Subcategory Form Dialog */}
      <SubcategoryFormDialog
        isOpen={isSubcategoryFormOpen}
        onOpenChange={setIsSubcategoryFormOpen}
        formData={subcategoryFormData}
        isEditing={isEditing}
        selectedCategory={selectedCategory}
        onInputChange={handleSubcategoryInputChange}
        onNameChange={handleSubcategoryNameChange}
        onSubmit={handleSubcategorySubmit}
        onCancel={() => setIsSubcategoryFormOpen(false)}
        isLoading={isSaving}
        imageMethod={imageMethod}
        onImageMethodChange={setImageMethod}
        onImageChange={handleSubcategoryImageChange}
      />
    </div>
  );
};

export default AdminCategories;
