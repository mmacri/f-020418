
import React, { useState, useEffect } from 'react';
import AffiliateStats from './AffiliateStats';
import ClicksChart from './ClicksChart';
import TopProductsTable from './TopProductsTable';
import TrafficSourcesChart from './TrafficSourcesChart';
import DateRangeSelector from './DateRangeSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import AdvancedAnalytics from './AdvancedAnalytics';
import { ChartDataItem, PeriodType } from './types';
import ClearDataButton from './ClearDataButton';
import ExportDataButton from './ExportDataButton';
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
            onDateRangeChange={handleDateRangeChange}
            onPeriodChange={handlePeriodChange}
          />
          <ExportDataButton 
            onExport={handleExportData}
            currentPeriod={currentPeriod}
          />
          <ClearDataButton 
            onClear={handleClearData}
            isAlertOpen={isAlertOpen}
            setIsAlertOpen={setIsAlertOpen}
            clearPeriod={clearPeriod}
            period={currentPeriod}
            onConfirmClear={handleConfirmClear}
          />
        </div>
      </div>

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
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
              <CardDescription>
                Clicks and conversions over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ClicksChart 
                chartData={chartData}
                chartView={chartView}
                setChartView={setChartView}
                formatCurrency={formatCurrency}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>
                Products generating the most affiliate revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopProductsTable 
                analyticsData={{
                  totalClicks: totals.clicks,
                  uniqueProducts: topProducts.length,
                  topProducts: topProducts.map(p => ({
                    productId: p.id.toString(),
                    productName: p.name,
                    count: p.clicks,
                    estimatedConversions: p.conversions
                  })),
                  clicksByDay: {},
                  clicksBySource: {}
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sources" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Where your affiliate clicks are coming from
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <TrafficSourcesChart 
                analyticsData={{
                  totalClicks: totals.clicks,
                  uniqueProducts: topProducts.length,
                  clicksBySource: Object.fromEntries(
                    sourceData.map(source => [source.name, source.value])
                  ),
                  topProducts: [],
                  clicksByDay: {}
                }}
                prepareSourceData={() => sourceData}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4 pt-4">
          <AdvancedAnalytics 
            chartData={chartData} 
            sourceData={sourceData} 
            estimatedRevenue={totals.revenue}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AffiliateDashboard;
