
import React from 'react';
import DateRangeSelector from './DateRangeSelector';
import ExportDataButton from './ExportDataButton';
import ClearDataButton from './ClearDataButton';
import { PeriodType } from './types';

interface DashboardHeaderProps {
  currentPeriod: PeriodType;
  dateRange: { from: Date | undefined; to: Date | undefined };
  isCustomDateRange: boolean;
  isAlertOpen: boolean;
  setIsAlertOpen: (open: boolean) => void;
  clearPeriod: 'current' | 'all';
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  onPeriodChange: (period: PeriodType) => void;
  onExportData: (period?: PeriodType | 'custom' | 'all') => void;
  onClearData: (type: 'current' | 'all') => void;
  onConfirmClear: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentPeriod,
  dateRange,
  isCustomDateRange,
  isAlertOpen,
  setIsAlertOpen,
  clearPeriod,
  onDateRangeChange,
  onPeriodChange,
  onExportData,
  onClearData,
  onConfirmClear
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold">Affiliate Performance Dashboard</h2>
        <p className="text-muted-foreground">Track your affiliate marketing metrics</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <DateRangeSelector 
          period={currentPeriod}
          dateRange={dateRange}
          isCustomDateRange={isCustomDateRange}
          onDateRangeChange={onDateRangeChange}
          onPeriodChange={onPeriodChange}
        />
        <ExportDataButton 
          onExport={onExportData}
          currentPeriod={currentPeriod}
        />
        <ClearDataButton 
          onClear={onClearData}
          isAlertOpen={isAlertOpen}
          setIsAlertOpen={setIsAlertOpen}
          clearPeriod={clearPeriod}
          period={currentPeriod}
          onConfirmClear={onConfirmClear}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
