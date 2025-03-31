
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { AnalyticsSummary } from './types';

interface AffiliateStatsProps {
  analyticsData: AnalyticsSummary | null;
  calculateGrowth: (metric: 'clicks' | 'conversions' | 'revenue') => number;
  formatCurrency: (amount: number) => string;
}

const AffiliateStats: React.FC<AffiliateStatsProps> = ({ 
  analyticsData, 
  calculateGrowth, 
  formatCurrency 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total Clicks</CardTitle>
          <CardDescription>
            All affiliate link clicks
            {calculateGrowth('clicks') !== 0 && (
              <span className={`ml-2 ${calculateGrowth('clicks') > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculateGrowth('clicks') > 0 ? '+' : ''}{calculateGrowth('clicks')}%
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{analyticsData?.totalClicks || 0}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Unique Products</CardTitle>
          <CardDescription>Products with clicks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{analyticsData?.uniqueProducts || 0}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Est. Conversions</CardTitle>
          <CardDescription>
            Based on category averages
            {calculateGrowth('conversions') !== 0 && (
              <span className={`ml-2 ${calculateGrowth('conversions') > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculateGrowth('conversions') > 0 ? '+' : ''}{calculateGrowth('conversions')}%
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {analyticsData?.estimatedConversions ? 
              analyticsData.estimatedConversions.toFixed(1) : '0'}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Est. Revenue</CardTitle>
          <CardDescription>
            Commission-based estimate
            {calculateGrowth('revenue') !== 0 && (
              <span className={`ml-2 ${calculateGrowth('revenue') > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculateGrowth('revenue') > 0 ? '+' : ''}{calculateGrowth('revenue')}%
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {analyticsData?.estimatedRevenue ? 
              formatCurrency(analyticsData.estimatedRevenue) : '$0.00'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateStats;
