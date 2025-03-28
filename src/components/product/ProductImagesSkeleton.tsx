
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductImagesSkeleton: React.FC = () => {
  return (
    <div className="md:w-1/2">
      <Skeleton className="aspect-w-1 aspect-h-1 h-[400px] w-full rounded-lg mb-4" />
      
      <div className="flex space-x-4 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-16 h-16 rounded-md" />
        ))}
      </div>
    </div>
  );
};

export default ProductImagesSkeleton;
