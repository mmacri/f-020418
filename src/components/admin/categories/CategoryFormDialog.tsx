
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import CategoryForm from '@/components/admin/CategoryForm';
import { CategoryInput } from '@/services/categoryService';

interface CategoryFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CategoryInput;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
  imageMethod: 'url' | 'upload';
  onImageMethodChange: (method: 'url' | 'upload') => void;
  onImageChange: (url: string) => void;
}

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  isEditing,
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
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update your category details below.'
              : 'Enter the details for your new category.'}
          </DialogDescription>
        </DialogHeader>
        
        <CategoryForm
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

export default CategoryFormDialog;
