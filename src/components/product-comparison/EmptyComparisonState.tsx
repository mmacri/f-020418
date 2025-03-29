
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyComparisonStateProps {
  onGoBack: () => void;
}

const EmptyComparisonState: React.FC<EmptyComparisonStateProps> = ({ onGoBack }) => {
  return (
    <div className="text-center py-10">
      <h2 className="text-xl font-semibold mb-2">Not enough products to compare</h2>
      <p className="text-gray-600 mb-4">Please select at least two products to compare</p>
      <Button onClick={onGoBack}>
        Go Back
      </Button>
    </div>
  );
};

export default EmptyComparisonState;
