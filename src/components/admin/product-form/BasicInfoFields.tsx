
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoFieldsProps {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoFields = ({
  name,
  slug,
  shortDescription,
  description,
  handleInputChange
}: BasicInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={handleInputChange}
            placeholder="auto-generated-if-left-empty"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description</Label>
        <Input
          id="shortDescription"
          name="shortDescription"
          value={shortDescription}
          onChange={handleInputChange}
          placeholder="Brief description (shown in listings)"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Full Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={handleInputChange}
          rows={4}
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoFields;
