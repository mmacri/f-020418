
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { getNavigationCategories } from '@/services/categoryService';
import { toast } from 'sonner';

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
  const [showCreateCategory, setShowCreateCategory] = useState<boolean>(false);

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

  const handleResetSubcategory = () => {
    handleSubcategoryChange('none');
    toast('Subcategory association removed');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="category">Category</Label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => setShowCreateCategory(!showCreateCategory)}
              className="h-8 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              {showCreateCategory ? 'Cancel' : 'New'}
            </Button>
          </div>
          <Select
            value={categoryId ? categoryId.toString() : "no-category"}
            onValueChange={handleCategoryChange}
            disabled={loading}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder={loading ? "Loading categories..." : "Select a category"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-category">None</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="subcategory">Subcategory</Label>
            {subcategory && subcategory !== 'none' && (
              <Button 
                type="button"
                variant="ghost" 
                size="sm"
                onClick={handleResetSubcategory}
                className="h-8 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
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
      
      {showCreateCategory && (
        <div className="p-4 border rounded-md bg-slate-50">
          <p className="text-sm text-muted-foreground mb-2">
            Category management is available in the Categories tab of the Admin Dashboard
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCreateCategory(false)}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryFields;
