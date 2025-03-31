
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CategoriesHeaderProps {
  onAddCategory: () => void;
}

const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({ onAddCategory }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold">Categories</h2>
      <Button onClick={onAddCategory}>
        <Plus className="mr-2 h-4 w-4" /> Add Category
      </Button>
    </div>
  );
};

export default CategoriesHeader;
