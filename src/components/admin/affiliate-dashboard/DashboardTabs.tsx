
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClicksChart } from './';
import { TrafficSourcesChart } from './';
import { TopProductsTable } from './';

interface DashboardTabsProps {
  chartData: any[];
  sourceData: any[];
  topProducts: any[];
  totals: {
    clicks: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  };
  chartView: 'daily' | 'weekly' | 'monthly';
  setChartView: (view: 'daily' | 'weekly' | 'monthly') => void;
  isLoading?: boolean;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  chartData,
  sourceData,
  topProducts,
  totals,
  chartView,
  setChartView,
  isLoading = false
}) => {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
        <TabsTrigger value="products">Top Products</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Click Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-end space-x-2 mb-4">
              <button 
                onClick={() => setChartView('daily')}
                className={`text-sm px-3 py-1 rounded-md ${chartView === 'daily' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                Daily
              </button>
              <button 
                onClick={() => setChartView('weekly')}
                className={`text-sm px-3 py-1 rounded-md ${chartView === 'weekly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                Weekly
              </button>
              <button 
                onClick={() => setChartView('monthly')}
                className={`text-sm px-3 py-1 rounded-md ${chartView === 'monthly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </button>
            </div>
            
            <div className="h-96">
              <ClicksChart 
                data={chartData} 
                viewMode={chartView} 
                isLoading={isLoading} 
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="traffic" className="pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <TrafficSourcesChart 
                data={sourceData} 
                isLoading={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="products" className="pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Products Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProductsTable 
              products={topProducts}
              totals={totals}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
