
import React from 'react';
import { AnalyticsSummary } from './types';

interface TopProductsTableProps {
  analyticsData: AnalyticsSummary | null;
}

const TopProductsTable: React.FC<TopProductsTableProps> = ({ analyticsData }) => {
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
          {analyticsData?.topProducts?.map((product) => (
            <tr key={product.productId} className="border-b">
              <td className="py-3">{product.productName}</td>
              <td className="py-3 text-gray-500">{product.productId}</td>
              <td className="py-3 text-right">{product.count}</td>
              <td className="py-3 text-right">
                {product.estimatedConversions || (product.count * 0.029).toFixed(1)}
              </td>
              <td className="py-3 text-right">2.9%</td>
              <td className="py-3 text-right">
                {analyticsData.totalClicks 
                  ? ((product.count / analyticsData.totalClicks) * 100).toFixed(1) + '%' 
                  : '0%'}
              </td>
            </tr>
          ))}
          {(!analyticsData?.topProducts || analyticsData.topProducts.length === 0) && (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500">
                No product data available yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TopProductsTable;
