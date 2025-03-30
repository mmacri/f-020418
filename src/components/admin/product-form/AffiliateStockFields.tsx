
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface AffiliateStockFieldsProps {
  affiliateLink: string;
  asin: string;
  inStock: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

const AffiliateStockFields = ({
  affiliateLink,
  asin,
  inStock,
  handleInputChange,
  handleSwitchChange
}: AffiliateStockFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Affiliate & Stock Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="affiliateLink">Affiliate Link</Label>
          <Input
            id="affiliateLink"
            name="affiliateLink"
            value={affiliateLink}
            onChange={handleInputChange}
            placeholder="https://www.amazon.com/dp/product-id?tag=yourtag-20"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="asin">Amazon ASIN</Label>
          <Input
            id="asin"
            name="asin"
            value={asin}
            onChange={handleInputChange}
            placeholder="B00ABCDEFG"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="inStock"
          checked={inStock}
          onCheckedChange={(checked) => handleSwitchChange('inStock', checked)}
        />
        <Label htmlFor="inStock">Product is in stock</Label>
      </div>
    </div>
  );
};

export default AffiliateStockFields;
