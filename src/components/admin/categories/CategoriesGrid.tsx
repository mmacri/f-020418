
import React from 'react';
import { CategoryCard } from '@/components/admin';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Category, Subcategory } from '@/services/categoryService';

interface CategoriesGridProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddSubcategory: (category: Category) => void;
  onEditSubcategory: (subcategory: Subcategory) => void;
  onDeleteSubcategory: (subcategory: Subcategory) => void;
  onAddCategory: () => void;
}

const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  categories,
  isLoading,
  onEdit,
  onDelete,
  onAddSubcategory,
  onEditSubcategory,
  onDeleteSubcategory,
  onAddCategory
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg border-muted-foreground/20">
        <p className="text-muted-foreground">No categories yet. Create your first category to get started.</p>
        <Button onClick={onAddCategory} variant="outline" className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map(category => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSubcategory={onAddSubcategory}
          onEditSubcategory={onEditSubcategory}
          onDeleteSubcategory={onDeleteSubcategory}
        />
      ))}
    </div>
  );
};

export default CategoriesGrid;
