
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ClicksChart from './ClicksChart';
import TopProductsTable from './TopProductsTable';
import TrafficSourcesChart from './TrafficSourcesChart';
import AdvancedAnalytics from './AdvancedAnalytics';
import { ChartDataItem, ChartViewType } from './types';
import { formatCurrency } from './utils';

interface DashboardTabsProps {
  chartData: ChartDataItem[];
  sourceData: {name: string; value: number}[];
  topProducts: any[];
  totals: {
    clicks: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  };
  chartView: ChartViewType;
  setChartView: (view: ChartViewType) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  chartData,
  sourceData,
  topProducts,
  totals,
  chartView,
  setChartView
}) => {
  return (
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
  );
};

export default DashboardTabs;
