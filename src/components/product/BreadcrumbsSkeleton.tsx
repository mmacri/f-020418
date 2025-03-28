
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const BreadcrumbsSkeleton: React.FC = () => {
  return (
    <nav className="flex text-sm mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </ol>
    </nav>
  );
};

export default BreadcrumbsSkeleton;
