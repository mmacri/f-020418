
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductInfoSkeleton: React.FC = () => {
  return (
    <div className="md:w-1/2">
      <Skeleton className="h-6 w-24 mb-2" />
      <Skeleton className="h-9 w-3/4 mb-2" />
      
      <div className="flex items-center mb-4">
        <div className="flex mr-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-4 w-4 mr-1 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-4 w-32" />
      </div>
      
      <Skeleton className="h-8 w-1/3 mb-6" />
      
      <div className="mb-6">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
      </div>
      
      <div className="mb-8 flex space-x-4">
        <Skeleton className="h-10 w-40 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <Skeleton className="h-6 w-40 mb-3" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductInfoSkeleton;
