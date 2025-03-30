
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';

interface ProductsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateProduct: () => void;
}

const ProductsHeader = ({ searchTerm, onSearchChange, onCreateProduct }: ProductsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <h2 className="text-3xl font-bold text-foreground">Products</h2>
      <div className="flex w-full sm:w-auto space-x-2">
        <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button 
          onClick={onCreateProduct}
          size="default"
          className="whitespace-nowrap"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>
    </div>
  );
};

export default ProductsHeader;
