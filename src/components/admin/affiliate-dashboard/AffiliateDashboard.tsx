
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAnalyticsSummary, clearAnalyticsData } from '@/lib/analytics-utils';
import { Activity, BarChart, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

// Import components
import AffiliateStats from './AffiliateStats';
import ClicksChart from './ClicksChart';
import TopProductsTable from './TopProductsTable';
import TrafficSourcesChart from './TrafficSourcesChart';
import AdvancedAnalytics from './AdvancedAnalytics';
import DateRangeSelector from './DateRangeSelector';
import ExportDataButton from './ExportDataButton';
import ClearDataButton from './ClearDataButton';

// Import types and utilities
import { AnalyticsSummary, ChartDataItem, PeriodType, ChartViewType } from './types';
import { prepareChartData, prepareSourceData, calculateGrowth, formatCurrency, handleExportData } from './utils';

const AffiliateDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
  const [period, setPeriod] = useState<PeriodType>('7d');
  const [chartView, setChartView] = useState<ChartViewType>('daily');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [clearPeriod, setClearPeriod] = useState<'current' | 'all'>('current');
  
  // Prepare chart data
  const chartData = prepareChartData(analyticsData, period, chartView);
  const sourceData = prepareSourceData(analyticsData);
  
  useEffect(() => {
    loadAnalyticsData();
  }, [period, dateRange, chartView]);
  
  const loadAnalyticsData = async () => {
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    
    if (isCustomDateRange) {
      startDate = dateRange.from;
      endDate = dateRange.to;
    } else {
      const now = new Date();
      if (period === '7d') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
      } else if (period === '30d') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
      }
      // For 'all', we don't set dates to get all data
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAnalyticsSummary(startDate, endDate);
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error loading analytics data:", error);
      setError("Failed to load analytics data");
      toast("Failed to load analytics data. Please try again later");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearData = (type: 'current' | 'all') => {
    setClearPeriod(type);
    setIsAlertOpen(true);
  };
  
  const confirmClearData = () => {
    clearAnalyticsData();
    loadAnalyticsData();
    toast(clearPeriod === 'all' 
        ? 'All analytics data has been cleared successfully.' 
        : `Analytics data for the ${period === '7d' ? 'last 7 days' : period === '30d' ? 'last 30 days' : 'selected date range'} has been cleared.`);
    setIsAlertOpen(false);
  };
  
  const onExportData = (exportPeriod?: PeriodType | 'custom' | 'all') => {
    const fileName = handleExportData(analyticsData, period, dateRange, isCustomDateRange, exportPeriod);
    if (fileName) {
      toast(`Analytics data has been exported to ${fileName}.csv.`);
    } else {
      toast('There was a problem exporting your data.');
    }
  };
  
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    setIsCustomDateRange(!!range.from && !!range.to);
    
    if (range.from && range.to) {
      setPeriod('7d'); // Default, will be overridden by custom date range
    }
  };
  
  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    setIsCustomDateRange(false);
    setDateRange({ from: undefined, to: undefined });
  };
  
  const growthCalculator = (metric: 'clicks' | 'conversions' | 'revenue'): number => {
    return calculateGrowth(analyticsData, chartData, metric);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button 
            onClick={loadAnalyticsData} 
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Affiliate Performance</h2>
        <div className="flex space-x-2">
          <ExportDataButton 
            onExport={onExportData} 
            currentPeriod={period} 
          />
          
          <ClearDataButton 
            onClear={handleClearData}
            isAlertOpen={isAlertOpen}
            setIsAlertOpen={setIsAlertOpen}
            clearPeriod={clearPeriod}
            period={period}
            onConfirmClear={confirmClearData}
          />
        </div>
      </div>
      
      <AffiliateStats 
        analyticsData={analyticsData} 
        calculateGrowth={growthCalculator} 
        formatCurrency={formatCurrency} 
      />
      
      <div className="flex justify-between items-center">
        <Tabs defaultValue="clicks" className="w-full">
          <TabsList>
            <TabsTrigger value="clicks">Clicks Over Time</TabsTrigger>
            <TabsTrigger value="products">Top Products</TabsTrigger>
            <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
          </TabsList>

          <DateRangeSelector
            period={period}
            dateRange={dateRange}
            isCustomDateRange={isCustomDateRange}
            onDateRangeChange={handleDateRangeChange}
            onPeriodChange={handlePeriodChange}
          />
        </Tabs>
      </div>
      
      <TabsContent value="clicks" className="pt-4">
        <ClicksChart
          chartData={chartData}
          chartView={chartView}
          setChartView={setChartView}
          formatCurrency={formatCurrency}
        />
      </TabsContent>
      
      <TabsContent value="products" className="pt-4">
        <TopProductsTable analyticsData={analyticsData} />
      </TabsContent>
      
      <TabsContent value="sources" className="pt-4">
        <TrafficSourcesChart
          analyticsData={analyticsData}
          prepareSourceData={() => sourceData}
        />
      </TabsContent>
      
      <TabsContent value="advanced" className="pt-4">
        <AdvancedAnalytics
          chartData={chartData}
          sourceData={sourceData}
          estimatedRevenue={analyticsData?.estimatedRevenue}
          formatCurrency={formatCurrency}
        />
      </TabsContent>
    </div>
  );
};

export default AffiliateDashboard;
