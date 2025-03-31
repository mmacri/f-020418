
import React from 'react';
import { formatCurrency } from './utils/formatters';

interface TopProductsTableProps {
  products: any[];
  totals: {
    clicks: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  };
  isLoading?: boolean;
}

const TopProductsTable: React.FC<TopProductsTableProps> = ({ 
  products, 
  totals,
  isLoading = false
}) => {
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Handle empty data
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        No product data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-3 text-left">Product</th>
            <th className="py-3 text-left">ID</th>
            <th className="py-3 text-right">Clicks</th>
            <th className="py-3 text-right">Est. Conversions</th>
            <th className="py-3 text-right">Conv. Rate</th>
            <th className="py-3 text-right">% of Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="py-3">{product.name}</td>
              <td className="py-3 text-gray-500">{product.id}</td>
              <td className="py-3 text-right">{product.clicks}</td>
              <td className="py-3 text-right">
                {product.conversions}
              </td>
              <td className="py-3 text-right">
                {((product.conversions / product.clicks) * 100).toFixed(1)}%
              </td>
              <td className="py-3 text-right">
                {totals.clicks 
                  ? ((product.clicks / totals.clicks) * 100).toFixed(1) + '%' 
                  : '0%'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopProductsTable;
