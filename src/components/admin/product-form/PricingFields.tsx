
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PricingFieldsProps {
  price: number;
  comparePrice: number;
  brand: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PricingFields = ({
  price,
  comparePrice,
  brand,
  handleInputChange
}: PricingFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="comparePrice">Compare Price ($)</Label>
        <Input
          id="comparePrice"
          name="comparePrice"
          type="number"
          step="0.01"
          min="0"
          value={comparePrice}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          name="brand"
          value={brand}
          onChange={handleInputChange}
          placeholder="Brand name"
        />
      </div>
    </div>
  );
};

export default PricingFields;
