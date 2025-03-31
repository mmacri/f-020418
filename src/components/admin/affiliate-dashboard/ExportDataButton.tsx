
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download } from 'lucide-react';
import { PeriodType } from './types';

interface ExportDataButtonProps {
  onExport: (period?: PeriodType | 'custom' | 'all') => void;
  currentPeriod: PeriodType;
}

const ExportDataButton: React.FC<ExportDataButtonProps> = ({ onExport, currentPeriod }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48">
        <div className="flex flex-col space-y-1">
          <Button variant="ghost" size="sm" onClick={() => onExport(currentPeriod)} className="justify-start">
            Current Period
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onExport('7d')} className="justify-start">
            Last 7 Days
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onExport('30d')} className="justify-start">
            Last 30 Days
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onExport('all')} className="justify-start">
            All Time
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExportDataButton;
