
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroImageActionsProps {
  handleSave: () => void;
  handleReset: () => void;
}

const HeroImageActions: React.FC<HeroImageActionsProps> = ({
  handleSave,
  handleReset,
}) => {
  return (
    <div className="flex gap-4">
      <Button 
        onClick={handleSave} 
        className="bg-indigo-600 hover:bg-indigo-700" 
        aria-label="Save hero image changes"
      >
        Save Changes
      </Button>
      <Button 
        variant="outline" 
        onClick={handleReset} 
        aria-label="Reset hero image to default"
      >
        Reset to Default
      </Button>
    </div>
  );
};

export default HeroImageActions;
