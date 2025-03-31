
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { PeriodType } from './types';

interface DateRangeSelectorProps {
  period: PeriodType;
  dateRange: { from: Date | undefined; to: Date | undefined };
  isCustomDateRange: boolean;
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  onPeriodChange: (period: PeriodType) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  period,
  dateRange,
  isCustomDateRange,
  onDateRangeChange,
  onPeriodChange
}) => {
  return (
    <div className="flex space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {isCustomDateRange && dateRange.from && dateRange.to ? (
              `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
            ) : (
              "Pick a date range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      <Button 
        variant={period === '7d' && !isCustomDateRange ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onPeriodChange('7d')}
      >
        Last 7 Days
      </Button>
      <Button 
        variant={period === '30d' && !isCustomDateRange ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onPeriodChange('30d')}
      >
        Last 30 Days
      </Button>
      <Button 
        variant={period === 'all' && !isCustomDateRange ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onPeriodChange('all')}
      >
        All Time
      </Button>
    </div>
  );
};

export default DateRangeSelector;
