
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { localStorageKeys } from '@/lib/constants';

interface SaveComparisonFormProps {
  products: any[];
  visibleSpecs: Record<string, boolean>;
  onCancel: () => void;
}

export interface SavedComparison {
  id: string;
  name: string;
  productIds: number[];
  visibleSpecs: string[];
  dateCreated: string;
}

const SaveComparisonForm: React.FC<SaveComparisonFormProps> = ({ 
  products, 
  visibleSpecs,
  onCancel
}) => {
  const { toast } = useToast();
  const [comparisonName, setComparisonName] = React.useState<string>('');

  const saveComparisonSet = () => {
    if (!comparisonName.trim()) {
      toast({
        title: "Name Required",
        description: "Please provide a name for this comparison set.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Get existing comparisons from localStorage
      const savedComparisonsJson = localStorage.getItem(localStorageKeys.COMPARISON_PRODUCTS);
      const savedComparisons: SavedComparison[] = savedComparisonsJson ? 
        JSON.parse(savedComparisonsJson) : [];
      
      // Create new comparison object
      const newComparison: SavedComparison = {
        id: Date.now().toString(),
        name: comparisonName.trim(),
        productIds: products.map(p => p.id),
        visibleSpecs: Object.entries(visibleSpecs)
          .filter(([_, isVisible]) => isVisible)
          .map(([name]) => name),
        dateCreated: new Date().toISOString()
      };
      
      // Add to saved comparisons
      savedComparisons.push(newComparison);
      
      // Save back to localStorage
      localStorage.setItem(
        localStorageKeys.COMPARISON_PRODUCTS, 
        JSON.stringify(savedComparisons)
      );
      
      toast({
        title: "Comparison Saved",
        description: `"${comparisonName}" has been saved to your comparisons.`,
      });
      
      setComparisonName('');
      onCancel();
    } catch (error) {
      console.error("Error saving comparison:", error);
      toast({
        title: "Error Saving",
        description: "There was a problem saving your comparison.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={comparisonName}
        onChange={(e) => setComparisonName(e.target.value)}
        placeholder="Name this comparison"
        className="px-3 py-1 border rounded text-sm"
      />
      <Button size="sm" onClick={saveComparisonSet}>
        <Save className="h-4 w-4 mr-1" /> Save
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SaveComparisonForm;
