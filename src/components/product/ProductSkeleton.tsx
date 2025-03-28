
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image Skeleton */}
        <div className="md:w-1/2">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          
          <div className="flex mt-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-md" />
            ))}
          </div>
        </div>
        
        {/* Product Info Skeleton */}
        <div className="md:w-1/2">
          <Skeleton className="h-10 w-3/4 mb-4" />
          
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-4 mr-1 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
          
          <Skeleton className="h-8 w-1/3 mb-6" />
          
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          
          <div className="mb-6">
            <Skeleton className="h-12 w-40 rounded-md mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <Skeleton className="h-5 w-1/4 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Features skeleton */}
      <div className="mt-16">
        <Skeleton className="h-8 w-1/4 mb-6" />
        
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6">
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Reviews skeleton */}
      <div className="mt-16">
        <Skeleton className="h-8 w-1/4 mb-6" />
        
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <Skeleton className="h-5 w-40 mb-2" />
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Skeleton key={j} className="h-4 w-4 mr-1 rounded-full" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
