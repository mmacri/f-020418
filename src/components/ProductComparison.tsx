
import React from 'react';
import { formatPrice } from '@/lib/product-utils';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  brand: string;
  specifications?: Record<string, string>;
  features?: string[];
}

interface ProductComparisonProps {
  products: Product[];
  comparisonFields?: string[];
}

const ProductComparison: React.FC<ProductComparisonProps> = ({ 
  products,
  comparisonFields = ['Best For', 'Type', 'Material', 'Resistance Levels', 'Price']
}) => {
  // Define mock data for the comparison table
  const mockComparisonData: Record<string, Record<string, string>> = {
    'theraband-resistance-bands-set': {
      'Best For': 'Overall Recovery',
      'Type': 'Flat Band',
      'Material': 'Latex (Latex-free option)',
      'Resistance Levels': 'Multiple (3-6)'
    },
    'perform-better-mini-bands': {
      'Best For': 'Lower Body',
      'Type': 'Loop Band',
      'Material': 'Rubber',
      'Resistance Levels': '4 levels'
    },
    'rogue-monster-bands': {
      'Best For': 'Advanced Mobility',
      'Type': 'Large Loop',
      'Material': 'Natural Latex',
      'Resistance Levels': '7 levels'
    },
    'fit-simplify-set': {
      'Best For': 'Budget Option',
      'Type': 'Loop Band',
      'Material': 'Latex',
      'Resistance Levels': '5 levels'
    },
    'sklz-pro-bands': {
      'Best For': 'Upper Body',
      'Type': 'Tube with Handles',
      'Material': 'TPE',
      'Resistance Levels': '3 levels'
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-8">Quick Comparison</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-indigo-100">
                <th className="py-3 px-4 text-left">Product</th>
                {comparisonFields.map(field => (
                  <th key={field} className="py-3 px-4 text-left">{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const slug = product.name.toLowerCase().replace(/\s+/g, '-');
                const comparisonData = mockComparisonData[slug] || {};
                
                return (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{product.name.split(' ').slice(0, 2).join(' ')}</td>
                    {comparisonFields.map(field => {
                      if (field === 'Price') {
                        return (
                          <td key={field} className="py-3 px-4">
                            {formatPrice(product.price)}
                          </td>
                        );
                      }
                      return (
                        <td key={field} className="py-3 px-4">
                          {comparisonData[field] || '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProductComparison;
