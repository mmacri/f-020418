import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getNavigationCategories } from '@/services/categoryService';

interface CategoryFieldsProps {
  categoryId: number | string;
  subcategory: string;
  handleCategoryChange: (value: string) => void;
  handleSubcategoryChange: (value: string) => void;
  categories?: any[];
  subcategories?: any[];
}

const CategoryFields = ({
  categoryId,
  subcategory,
  handleCategoryChange,
  handleSubcategoryChange,
  categories: propCategories,
  subcategories: propSubcategories
}: CategoryFieldsProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (propCategories && propCategories.length > 0) {
          setCategories(propCategories);
          setLoading(false);
          return;
        }
        
        const result = await getNavigationCategories();
        setCategories(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [propCategories]);

  useEffect(() => {
    if (propSubcategories && propSubcategories.length > 0) {
      setSubcategories(propSubcategories);
      return;
    }
    
    if (categoryId && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.id.toString() === categoryId.toString());
      if (selectedCategory && selectedCategory.subcategories) {
        setSubcategories(selectedCategory.subcategories);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  }, [categoryId, categories, propSubcategories]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={categoryId ? categoryId.toString() : "0"}
          onValueChange={handleCategoryChange}
          disabled={loading}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder={loading ? "Loading categories..." : "Select a category"} />
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
          value={subcategory || "none"}
          onValueChange={handleSubcategoryChange}
          disabled={subcategories.length === 0 || loading}
        >
          <SelectTrigger id="subcategory">
            <SelectValue placeholder={
              loading ? "Loading..." : 
              subcategories.length === 0 ? "Select a category first" : 
              "Select a subcategory"
            } />
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
