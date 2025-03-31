
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { clearAnalyticsData } from '@/lib/analytics-utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar
} from "@/components/ui/calendar";

const AnalyticsDashboard: React.FC = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [clearPeriod, setClearPeriod] = useState<'current' | 'all'>('current');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  const handleClearData = (type: 'current' | 'all') => {
    setClearPeriod(type);
    setIsAlertOpen(true);
  };
  
  const confirmClearData = async () => {
    try {
      await clearAnalyticsData(dateRange.from, dateRange.to);
      toast(clearPeriod === 'all' 
        ? 'All analytics data has been cleared successfully.' 
        : 'Analytics data for the selected date range has been cleared.');
    } catch (error) {
      console.error('Error clearing analytics data:', error);
      toast('There was a problem clearing analytics data.');
    } finally {
      setIsAlertOpen(false);
    }
  };
  
  const handleExportData = () => {
    try {
      // Create a simple CSV of the date range
      const fileName = `analytics-export-${new Date().toISOString().split('T')[0]}`;
      
      let dateRangeText = '';
      if (dateRange.from && dateRange.to) {
        dateRangeText = `(${format(dateRange.from, 'MMM dd, yyyy')} to ${format(dateRange.to, 'MMM dd, yyyy')})`;
        fileName += `-${format(dateRange.from, 'yyyy-MM-dd')}-to-${format(dateRange.to, 'yyyy-MM-dd')}`;
      } else {
        dateRangeText = '(All Time)';
        fileName += '-all-time';
      }
      
      const csvData = [
        [`Analytics Data Export ${dateRangeText}`],
        ['Date', 'Page Views', 'Unique Visitors'],
        ['2023-01-01', '120', '45'],
        ['2023-01-02', '150', '62'],
        ['2023-01-03', '135', '58']
      ]
      .map(row => row.join(','))
      .join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast('Analytics data has been exported successfully.');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast('There was a problem exporting your data.');
    }
  };
  
  return (
    <div className="space-y-6">
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Analytics Data</AlertDialogTitle>
            <AlertDialogDescription>
              {clearPeriod === 'all' ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-500 inline-block mr-2" />
                  This will permanently delete <span className="font-bold">all</span> analytics data. This action cannot be undone.
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-500 inline-block mr-2" />
                  This will clear data for the selected date range. This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearData} className="bg-red-600 hover:bg-red-700">
              Yes, Clear Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48">
              <div className="flex flex-col space-y-1">
                <Button variant="ghost" size="sm" onClick={handleExportData} className="justify-start">
                  Selected Range
                </Button>
                <Button variant="ghost" size="sm" onClick={handleExportData} className="justify-start">
                  All Time
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                Clear Data
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48">
              <div className="flex flex-col space-y-1">
                <Button variant="ghost" size="sm" onClick={() => handleClearData('current')} className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
                  Selected Range
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleClearData('all')} className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
                  All Data
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Date Range Selection</CardTitle>
          <CardDescription>Select a date range to filter analytics data</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
            <CardDescription>Total page views in selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,234</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Unique Visitors</CardTitle>
            <CardDescription>Unique visitors in selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">567</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Avg. Session Duration</CardTitle>
            <CardDescription>Average time spent on site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3m 45s</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
