
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyProductsStateProps {
  searchTerm: string;
  onCreateProduct: () => void;
}

const EmptyProductsState = ({ searchTerm, onCreateProduct }: EmptyProductsStateProps) => {
  return (
    <Card className="border border-border shadow-sm bg-card">
      <CardContent className="pt-6 text-center py-12">
        <p className="mb-6 text-foreground text-lg">
          {searchTerm ? 'No products match your search.' : 'No products found. Create your first product to get started.'}
        </p>
        {!searchTerm && (
          <Button 
            onClick={onCreateProduct}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <PlusCircle className="h-5 w-5 mr-2" /> Add Product
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyProductsState;
