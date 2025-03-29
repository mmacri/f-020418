
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { FileUpload } from '@/components/FileUpload';
import { Switch } from '@/components/ui/switch';

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
    <form onSubmit={onSubmit} className="text-foreground">
      <div className="grid gap-5 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-foreground">Category Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Massage Guns"
            value={formData.name}
            onChange={onNameChange}
            required
            className="bg-background border-input"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="slug" className="text-foreground">URL Slug</Label>
          <Input
            id="slug"
            name="slug"
            placeholder="e.g. massage-guns"
            value={formData.slug}
            onChange={onInputChange}
            required
            className="bg-background border-input"
          />
          <p className="text-xs text-muted-foreground">
            This will be used in the URL: /categories/{formData.slug}
          </p>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description" className="text-foreground">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Brief description of this category"
            value={formData.description}
            onChange={onInputChange}
            className="min-h-[100px] bg-background border-input"
          />
        </div>
        
        <div className="space-y-3">
          <Label className="text-foreground">Category Image</Label>
          <Tabs value={imageMethod} onValueChange={onImageMethodChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted text-muted-foreground">
              <TabsTrigger value="url" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                Image URL
              </TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                Upload Image
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4 mt-2">
              <div className="grid gap-2">
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={onInputChange}
                  className="bg-background border-input"
                />
                <p className="text-xs text-muted-foreground">
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
              <p className="text-xs text-muted-foreground">
                Upload an image file (max 2MB). Supported formats: PNG, JPEG, GIF
              </p>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showInNavigation" className="text-foreground">Show in Navigation</Label>
              <p className="text-xs text-muted-foreground">
                When enabled, this category will appear in the main navigation menu
              </p>
            </div>
            <Switch
              id="showInNavigation"
              name="showInNavigation"
              checked={formData.showInNavigation}
              onCheckedChange={(checked) => {
                const event = {
                  target: {
                    name: 'showInNavigation',
                    type: 'checkbox',
                    checked,
                  },
                } as React.ChangeEvent<HTMLInputElement>;
                onInputChange(event);
              }}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="navigationOrder" className="text-foreground">Navigation Order</Label>
            <Input
              id="navigationOrder"
              name="navigationOrder"
              type="number"
              min="0"
              value={formData.navigationOrder}
              onChange={onInputChange}
              className="bg-background border-input"
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers will appear first in the navigation menu
            </p>
          </div>
        </div>
      </div>
      
      <DialogFooter className="mt-6 gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-input text-foreground"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isEditing ? 'Update Category' : 'Create Category'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CategoryForm;
