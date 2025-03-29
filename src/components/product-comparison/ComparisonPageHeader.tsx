
import React from 'react';

interface ComparisonPageHeaderProps {
  categoryName: string;
}

const ComparisonPageHeader: React.FC<ComparisonPageHeaderProps> = ({ categoryName }) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">
        {categoryName ? `${categoryName} Comparison` : 'Product Comparison'}
      </h1>
      <p className="text-gray-600 mb-8">
        Compare features, specifications, and prices of the top products to find the best one for your needs.
      </p>
    </>
  );
};

export default ComparisonPageHeader;
