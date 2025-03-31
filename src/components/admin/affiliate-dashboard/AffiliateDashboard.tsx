
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
import { ChartDataItem } from './types';
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

  const handleClearData = () => {
    const result = window.confirm('Are you sure you want to clear all analytics data? This action cannot be undone.');
    
    if (result) {
      // In a real app, this would clear data from the database
      console.log('Clearing analytics data');
      
      // Reset the charts with smaller sample data
      const newData = generateMockData(timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90, true);
      setChartData(newData);
      
      // Update totals
      const calculatedTotals = calculateTotals(newData);
      setTotals(calculatedTotals);
    }
  };

  const handleExportData = () => {
    // In a real app, this would generate and download an export file
    console.log('Exporting analytics data');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Affiliate Performance Dashboard</h2>
          <p className="text-muted-foreground">Track your affiliate marketing metrics</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <DateRangeSelector timeframe={timeframe} setTimeframe={setTimeframe} />
          <ExportDataButton 
            chartData={chartData} 
            sourceData={sourceData} 
            productsData={topProducts} 
          />
          <ClearDataButton onClear={handleClearData} />
        </div>
      </div>

      <AffiliateStats totals={totals} chartData={chartData} />
      
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
              <ClicksChart data={chartData} />
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
              <TopProductsTable products={topProducts} />
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
              <TrafficSourcesChart data={sourceData} />
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
