
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryFieldsProps {
  categoryId: number | string;
  subcategory: string;
  categories: any[];
  subcategories: any[];
  handleCategoryChange: (value: string) => void;
  handleSubcategoryChange: (value: string) => void;
}

const CategoryFields = ({
  categoryId,
  subcategory,
  categories,
  subcategories,
  handleCategoryChange,
  handleSubcategoryChange
}: CategoryFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={String(categoryId)}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">None</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subcategory">Subcategory</Label>
        <Select
          value={subcategory}
          onValueChange={handleSubcategoryChange}
          disabled={subcategories.length === 0}
        >
          <SelectTrigger id="subcategory">
            <SelectValue placeholder={subcategories.length === 0 ? "Select a category first" : "Select a subcategory"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {subcategories.map((subcategory) => (
              <SelectItem key={subcategory.id} value={subcategory.slug}>
                {subcategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CategoryFields;
