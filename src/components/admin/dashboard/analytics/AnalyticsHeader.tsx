
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface AnalyticsHeaderProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ date, setDate }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {date?.from ? (
                  date.to ? (
                    <>
                      {date.from.toLocaleDateString()} -{' '}
                      {date.to.toLocaleDateString()}
                    </>
                  ) : (
                    date.from.toLocaleDateString()
                  )
                ) : (
                  'Select a date'
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
