
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { SubcategoryInput } from '@/services/categoryService';

interface SubcategoryFormProps {
  formData: SubcategoryInput & { showInNavigation?: boolean };
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const SubcategoryForm: React.FC<SubcategoryFormProps> = ({
  formData,
  isEditing,
  onInputChange,
  onNameChange,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="subcategoryName">Subcategory Name</Label>
        <Input
          id="subcategoryName"
          name="name"
          value={formData.name}
          onChange={onNameChange}
          placeholder="Enter subcategory name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subcategorySlug">Slug</Label>
        <Input
          id="subcategorySlug"
          name="slug"
          value={formData.slug}
          onChange={onInputChange}
          placeholder="Enter subcategory slug"
          required
        />
        <p className="text-xs text-muted-foreground">
          URL-friendly version of the name (e.g., "memory-foam")
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subcategoryDescription">Description</Label>
        <Textarea
          id="subcategoryDescription"
          name="description"
          value={formData.description || ''}
          onChange={onInputChange}
          placeholder="Brief description of this subcategory"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Checkbox
          id="subcategoryShowInNavigation"
          name="showInNavigation"
          checked={formData.showInNavigation}
          onCheckedChange={(checked) => {
            const event = {
              target: {
                name: 'showInNavigation',
                value: checked,
                type: 'checkbox',
                checked: checked === true
              }
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            onInputChange(event);
          }}
        />
        <Label htmlFor="subcategoryShowInNavigation" className="cursor-pointer">
          Show in navigation menus
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update' : 'Create'} Subcategory
        </Button>
      </div>
    </form>
  );
};

export default SubcategoryForm;
