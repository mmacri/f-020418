
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileLoadingSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <div className="h-32 sm:h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="px-4 sm:px-8 relative -mt-12 sm:-mt-16">
            <div className="flex flex-col sm:flex-row">
              <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-full" />
              <div className="mt-4 sm:mt-0 sm:ml-4 flex-1">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-full max-w-xl mb-2" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-60 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};
