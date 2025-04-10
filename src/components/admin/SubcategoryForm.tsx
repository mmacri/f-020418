
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Subcategory } from '@/services/categoryService';
import FileUploadWithPreview from '@/components/FileUploadWithPreview';

interface SubcategoryFormProps {
  formData: {
    id?: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    showInNavigation: boolean;
  };
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
  imageMethod: 'url' | 'upload';
  onImageMethodChange?: (value: 'url' | 'upload') => void;
  onImageChange?: (url: string) => void;
}

const SubcategoryForm: React.FC<SubcategoryFormProps> = ({
  formData,
  isEditing,
  onInputChange,
  onNameChange,
  onSubmit,
  onCancel,
  isLoading,
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
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Subcategory Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onNameChange}
          placeholder="e.g., Premium Massage Guns"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={onInputChange}
          placeholder="e.g., premium-massage-guns"
          required
        />
        <p className="text-xs text-muted-foreground">
          Used in the URL: /categories/parent-category/{formData.slug}
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={onInputChange}
          placeholder="Briefly describe this subcategory..."
          rows={3}
        />
      </div>

      {/* Image Selection */}
      <div className="space-y-2">
        <Label>Subcategory Image</Label>
        <RadioGroup 
          value={imageMethod} 
          onValueChange={(value: 'url' | 'upload') => onImageMethodChange && onImageMethodChange(value)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="url" id="url" />
            <Label htmlFor="url" className="cursor-pointer">Image URL</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upload" id="upload" />
            <Label htmlFor="upload" className="cursor-pointer">Upload Image</Label>
          </div>
        </RadioGroup>
      </div>

      {imageMethod === 'url' ? (
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl || ''}
            onChange={handleImageUrlChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Upload Image</Label>
          <FileUploadWithPreview
            onFileChange={handleImageUpload}
            currentImage={formData.imageUrl}
            bucket="category-images"
            folder="subcategories"
            maxSize={5}
            aspectRatio="landscape"
          />
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Switch
          id="showInNavigation"
          name="showInNavigation"
          checked={formData.showInNavigation}
          onCheckedChange={(checked) => 
            onInputChange({
              target: { name: 'showInNavigation', value: checked, type: 'checkbox', checked }
            } as any)
          }
        />
        <Label htmlFor="showInNavigation">Show in navigation</Label>
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
        <Button 
          type="submit"
          disabled={isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEditing ? (
            'Update Subcategory'
          ) : (
            'Create Subcategory'
          )}
        </Button>
      </div>
    </form>
  );
};

export default SubcategoryForm;
