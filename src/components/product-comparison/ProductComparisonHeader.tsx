
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import CustomizeSpecsDropdown from './CustomizeSpecsDropdown';
import SaveComparisonForm from './SaveComparisonForm';

interface ProductComparisonHeaderProps {
  products: any[];
  specKeys: string[];
  visibleSpecs: Record<string, boolean>;
  visibleSpecCount: number;
  totalSpecCount: number;
  onToggleSpec: (specName: string) => void;
}

const ProductComparisonHeader: React.FC<ProductComparisonHeaderProps> = ({
  products,
  specKeys,
  visibleSpecs,
  visibleSpecCount,
  totalSpecCount,
  onToggleSpec
}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
      <div>
        <h2 className="text-xl font-semibold">Comparing {products.length} Products</h2>
        <p className="text-sm text-gray-500">
          {visibleSpecCount} of {totalSpecCount} specifications visible
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        {isSaving ? (
          <SaveComparisonForm 
            products={products} 
            visibleSpecs={visibleSpecs} 
            onCancel={() => setIsSaving(false)} 
          />
        ) : (
          <Button size="sm" variant="outline" onClick={() => setIsSaving(true)}>
            <Save className="h-4 w-4 mr-1" /> Save Comparison
          </Button>
        )}
        
        <CustomizeSpecsDropdown 
          specKeys={specKeys}
          visibleSpecs={visibleSpecs}
          onToggleSpec={onToggleSpec}
        />
      </div>
    </div>
  );
};

export default ProductComparisonHeader;
