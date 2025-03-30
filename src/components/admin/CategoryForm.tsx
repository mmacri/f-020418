
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { CategoryInput } from '@/services/categoryService';
import FileUploadWithPreview from '@/components/FileUploadWithPreview';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CategoryFormProps {
  formData: CategoryInput & { showInNavigation?: boolean };
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  imageMethod?: 'url' | 'upload';
  onImageMethodChange?: (value: 'url' | 'upload') => void;
  onImageChange?: (url: string) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  formData,
  isEditing,
  onInputChange,
  onNameChange,
  onSubmit,
  onCancel,
  isLoading = false,
  imageMethod = 'url',
  onImageMethodChange,
  onImageChange
}) => {
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e);
  };

  const handleImageUpload = (url: string) => {
    if (onImageChange) {
      onImageChange(url);
    } else {
      // Fallback to using a simulated input change event
      const event = {
        target: {
          name: 'imageUrl',
          value: url
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(event);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="categoryName">Category Name</Label>
        <Input
          id="categoryName"
          name="name"
          value={formData.name}
          onChange={onNameChange}
          placeholder="Enter category name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categorySlug">Slug</Label>
        <Input
          id="categorySlug"
          name="slug"
          value={formData.slug}
          onChange={onInputChange}
          placeholder="Enter category slug"
          required
        />
        <p className="text-xs text-muted-foreground">
          URL-friendly version of the name (e.g., "massage-guns")
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryDescription">Description</Label>
        <Textarea
          id="categoryDescription"
          name="description"
          value={formData.description || ''}
          onChange={onInputChange}
          placeholder="Brief description of this category"
          rows={3}
        />
      </div>

      {/* Image Selection */}
      <div className="space-y-2">
        <Label>Category Image</Label>
        <RadioGroup 
          value={imageMethod} 
          onValueChange={(value: 'url' | 'upload') => onImageMethodChange && onImageMethodChange(value)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="url" id="categoryImageUrl" />
            <Label htmlFor="categoryImageUrl" className="cursor-pointer">Image URL</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upload" id="categoryImageUpload" />
            <Label htmlFor="categoryImageUpload" className="cursor-pointer">Upload Image</Label>
          </div>
        </RadioGroup>
      </div>

      {imageMethod === 'url' ? (
        <div className="space-y-2">
          <Label htmlFor="imageUrlInput">Image URL</Label>
          <Input
            id="imageUrlInput"
            name="imageUrl"
            value={formData.imageUrl || ''}
            onChange={handleImageUrlChange}
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-muted-foreground">
            URL to an image representing this category
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Upload Image</Label>
          <FileUploadWithPreview
            onFileChange={handleImageUpload}
            currentImage={formData.imageUrl}
            bucket="category-images"
            folder="categories"
            maxSize={5}
            aspectRatio="landscape"
          />
          <p className="text-xs text-muted-foreground">
            Recommended size: 1200x600 pixels, max 5MB
          </p>
        </div>
      )}

      <div className="flex items-center space-x-2 mt-4">
        <Checkbox
          id="categoryShowInNavigation"
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
        <Label htmlFor="categoryShowInNavigation" className="cursor-pointer">
          Show in navigation menus
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="navigationOrder">Navigation Order</Label>
        <Input
          id="navigationOrder"
          name="navigationOrder"
          type="number"
          value={formData.navigationOrder || 0}
          onChange={onInputChange}
          placeholder="0"
        />
        <p className="text-xs text-muted-foreground">
          Order in the navigation menu (lower numbers appear first)
        </p>
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
          {isEditing ? 'Update' : 'Create'} Category
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
