
import React, { useState, useEffect } from 'react';
import AffiliateStats from './AffiliateStats';
import DashboardHeader from './DashboardHeader';
import DashboardTabs from './DashboardTabs';
import { ChartDataItem, PeriodType } from './types';
import { 
  generateMockData, 
  generateSourceData, 
  generateTopProductsData, 
  calculateTotals,
  formatCurrency
} from './utils';

const AffiliateDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [sourceData, setSourceData] = useState<{name: string; value: number}[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [totals, setTotals] = useState<{
    clicks: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  }>({ clicks: 0, conversions: 0, revenue: 0, conversionRate: 0 });
  const [chartView, setChartView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [clearPeriod, setClearPeriod] = useState<'current' | 'all'>('current');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<PeriodType>('7d');

  useEffect(() => {
    // Generate mock data based on timeframe
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
    const data = generateMockData(days);
    const sources = generateSourceData();
    const products = generateTopProductsData();
    
    setChartData(data);
    setSourceData(sources);
    setTopProducts(products);
    
    // Calculate totals
    const calculatedTotals = calculateTotals(data);
    setTotals(calculatedTotals);
  }, [timeframe]);

  const handleClearData = (type: 'current' | 'all') => {
    setClearPeriod(type);
    setIsAlertOpen(true);
  };

  const handleConfirmClear = () => {
    // In a real app, this would clear data from the database
    console.log(`Clearing ${clearPeriod} analytics data`);
    
    // Reset the charts with smaller sample data
    const newData = generateMockData(timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90);
    setChartData(newData);
    
    // Update totals
    const calculatedTotals = calculateTotals(newData);
    setTotals(calculatedTotals);
    
    setIsAlertOpen(false);
  };

  const handleExportData = (period?: PeriodType | 'custom' | 'all') => {
    // In a real app, this would generate and download an export file
    console.log('Exporting analytics data for period:', period || currentPeriod);
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    setIsCustomDateRange(true);
  };

  const handlePeriodChange = (period: PeriodType) => {
    setCurrentPeriod(period);
    setIsCustomDateRange(false);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        currentPeriod={currentPeriod}
        dateRange={dateRange}
        isCustomDateRange={isCustomDateRange}
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        clearPeriod={clearPeriod}
        onDateRangeChange={handleDateRangeChange}
        onPeriodChange={handlePeriodChange}
        onExportData={handleExportData}
        onClearData={handleClearData}
        onConfirmClear={handleConfirmClear}
      />

      <AffiliateStats 
        analyticsData={{
          totalClicks: totals.clicks,
          uniqueProducts: topProducts.length,
          estimatedConversions: totals.conversions,
          estimatedRevenue: totals.revenue,
          conversionRate: totals.conversionRate,
          topProducts: topProducts.map(p => ({
            productId: p.id.toString(),
            productName: p.name,
            count: p.clicks,
            estimatedConversions: p.conversions
          })),
          clicksByDay: {},
          clicksBySource: {}
        }}
        calculateGrowth={(metric) => Math.floor(Math.random() * 10) - 3} // Mocked growth calculation
        formatCurrency={formatCurrency}
      />
      
      <DashboardTabs 
        chartData={chartData}
        sourceData={sourceData}
        topProducts={topProducts}
        totals={totals}
        chartView={chartView}
        setChartView={setChartView}
      />
    </div>
  );
};

export default AffiliateDashboard;
