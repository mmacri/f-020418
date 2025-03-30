
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RatingImageFieldsProps {
  rating: number;
  reviewCount: number;
  imageUrl: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RatingImageFields = ({
  rating,
  reviewCount,
  imageUrl,
  handleInputChange
}: RatingImageFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Ratings & Images</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (out of 5)</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={rating}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reviewCount">Number of Reviews</Label>
          <Input
            id="reviewCount"
            name="reviewCount"
            type="number"
            min="0"
            value={reviewCount}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Main Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={imageUrl}
          onChange={handleInputChange}
          placeholder="https://example.com/product-image.jpg"
        />
      </div>
    </div>
  );
};

export default RatingImageFields;
