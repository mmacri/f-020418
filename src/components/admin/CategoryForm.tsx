
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { FileUpload } from '@/components/FileUpload';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  showInNavigation: boolean;
  navigationOrder: number;
}

interface CategoryFormProps {
  formData: CategoryFormData;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  imageMethod: 'url' | 'upload';
  onImageMethodChange: (value: 'url' | 'upload') => void;
  onFileChange: (file: File | null) => void;
}

const CategoryForm = ({
  formData,
  isEditing,
  onInputChange,
  onNameChange,
  onSubmit,
  onCancel,
  imageMethod,
  onImageMethodChange,
  onFileChange
}: CategoryFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Massage Guns"
            value={formData.name}
            onChange={onNameChange}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            name="slug"
            placeholder="e.g. massage-guns"
            value={formData.slug}
            onChange={onInputChange}
            required
          />
          <p className="text-xs text-gray-500">
            This will be used in the URL: /categories/{formData.slug}
          </p>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Brief description of this category"
            value={formData.description}
            onChange={onInputChange}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-3">
          <Label>Category Image</Label>
          <Tabs value={imageMethod} onValueChange={onImageMethodChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">Image URL</TabsTrigger>
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4 mt-2">
              <div className="grid gap-2">
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={onInputChange}
                />
                <p className="text-xs text-gray-500">
                  Enter a direct URL to an image for this category
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4 mt-2">
              <FileUpload 
                onFileChange={onFileChange}
                accept="image/*"
                maxSizeMB={2}
              />
              <p className="text-xs text-gray-500">
                Upload an image file (max 2MB). Supported formats: PNG, JPEG, GIF
              </p>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showInNavigation"
              name="showInNavigation"
              checked={formData.showInNavigation}
              onChange={onInputChange}
              className="rounded border-gray-300"
            />
            <Label htmlFor="showInNavigation">Show in Navigation</Label>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="navigationOrder">Navigation Order</Label>
            <Input
              id="navigationOrder"
              name="navigationOrder"
              type="number"
              min="0"
              value={formData.navigationOrder}
              onChange={onInputChange}
            />
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Category' : 'Create Category'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CategoryForm;
