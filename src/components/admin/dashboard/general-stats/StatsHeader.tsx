
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DashboardTimeframe } from '../DashboardContext';

interface StatsHeaderProps {
  timeframe: DashboardTimeframe;
  handleTimeframeChange: (newTimeframe: DashboardTimeframe) => void;
  exportStats: () => void;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ 
  timeframe, 
  handleTimeframeChange, 
  exportStats 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">General Statistics</h2>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {timeframe === 'week' ? 'Last Week' : 
               timeframe === 'month' ? 'Last Month' : 
               timeframe === 'quarter' ? 'Last Quarter' : 'Last Year'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleTimeframeChange('week')}>
              Last Week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTimeframeChange('month')}>
              Last Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTimeframeChange('quarter')}>
              Last Quarter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTimeframeChange('year')}>
              Last Year
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="icon" onClick={exportStats}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StatsHeader;
