
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface FeaturesSectionProps {
  features: string[];
  handleFeatureChange: (index: number, value: string) => void;
  handleAddFeature: () => void;
  handleRemoveFeature: (index: number) => void;
}

const FeaturesSection = ({
  features,
  handleFeatureChange,
  handleAddFeature,
  handleRemoveFeature
}: FeaturesSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Features</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={handleAddFeature}
        >
          Add Feature
        </Button>
      </div>
      
      {features.map((feature, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={feature}
            onChange={(e) => handleFeatureChange(index, e.target.value)}
            placeholder={`Feature ${index + 1}`}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => handleRemoveFeature(index)}
            disabled={features.length <= 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FeaturesSection;
