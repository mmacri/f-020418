
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number;
  growth: number;
  timeframe: string;
  isLoading: boolean;
  customLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  growth, 
  timeframe,
  isLoading,
  customLabel
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={`${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {growth > 0 ? '+' : ''}{growth}%
              </span> {customLabel || `from last ${timeframe}`}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
