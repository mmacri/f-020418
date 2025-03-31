
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import SubcategoryForm from '@/components/admin/SubcategoryForm';
import { Category } from '@/services/categoryService';

interface SubcategoryFormData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  showInNavigation: boolean;
}

interface SubcategoryFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: SubcategoryFormData;
  isEditing: boolean;
  selectedCategory: Category | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
  imageMethod: 'url' | 'upload';
  onImageMethodChange: (method: 'url' | 'upload') => void;
  onImageChange: (url: string) => void;
}

const SubcategoryFormDialog: React.FC<SubcategoryFormDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  isEditing,
  selectedCategory,
  onInputChange,
  onNameChange,
  onSubmit,
  onCancel,
  isLoading,
  imageMethod,
  onImageMethodChange,
  onImageChange
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Subcategory' : 'Add New Subcategory'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update your subcategory details below.'
              : `Add a new subcategory to ${selectedCategory?.name || 'category'}.`}
          </DialogDescription>
        </DialogHeader>
        
        <SubcategoryForm
          formData={formData}
          isEditing={isEditing}
          onInputChange={onInputChange}
          onNameChange={onNameChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
          imageMethod={imageMethod}
          onImageMethodChange={onImageMethodChange}
          onImageChange={onImageChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SubcategoryFormDialog;
