
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PercentageChangeIndicatorProps {
  change: number;
  showIcon?: boolean;
  iconSize?: number;
  className?: string;
}

const PercentageChangeIndicator: React.FC<PercentageChangeIndicatorProps> = ({
  change,
  showIcon = true,
  iconSize = 16,
  className
}) => {
  if (change === 0) {
    return (
      <span className={cn("text-gray-500 flex items-center gap-1", className)}>
        {showIcon && <Minus size={iconSize} />}
        0%
      </span>
    );
  }
  
  const isPositive = change > 0;
  const IconComponent = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <span className={cn(
      "flex items-center gap-1", 
      isPositive ? "text-green-600" : "text-red-600",
      className
    )}>
      {showIcon && <IconComponent size={iconSize} />}
      {isPositive ? "+" : ""}{change}%
    </span>
  );
};

export default PercentageChangeIndicator;
