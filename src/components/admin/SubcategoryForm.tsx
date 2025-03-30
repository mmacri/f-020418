
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/FileUpload';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SubcategoryFormProps {
  formData: {
    name: string;
    slug: string;
    description: string;
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
  onFileChange?: (file: File | null) => void;
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
  onFileChange
}) => {
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
          value={formData.description}
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
            value={formData.imageUrl}
            onChange={onInputChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Upload Image</Label>
          <FileUpload
            onFileChange={onFileChange}
          />
          <p className="text-xs text-muted-foreground">
            Recommended size: 1200x600 pixels, max 5MB
          </p>
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
