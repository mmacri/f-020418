
import React from 'react';
import { Loader2 } from 'lucide-react';

const ProductsLoadingState = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default ProductsLoadingState;
