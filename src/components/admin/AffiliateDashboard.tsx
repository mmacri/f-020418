
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAnalyticsSummary, clearAnalyticsData } from '@/lib/analytics-utils';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface AnalyticsSummary {
  totalClicks: number;
  uniqueProducts: number;
  clicksByDay: Record<string, number>;
  topProducts: Array<{
    productId: string;
    productName: string;
    count: number;
    estimatedConversions?: number;
  }>;
  clicksBySource: Record<string, number>;
  estimatedConversions?: number;
  conversionRate?: number;
  estimatedRevenue?: number;
}

const AffiliateDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('7d');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    loadAnalyticsData();
  }, [period, dateRange]);
  
  const loadAnalyticsData = () => {
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
    
    const data = getAnalyticsSummary(startDate, endDate);
    setAnalyticsData(data);
  };
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      clearAnalyticsData();
      loadAnalyticsData();
      toast({
        title: 'Data Cleared',
        description: 'All analytics data has been cleared successfully.',
      });
    }
  };
  
  const handlePeriodChange = (newPeriod: '7d' | '30d' | 'all') => {
    setPeriod(newPeriod);
    setIsCustomDateRange(false);
  };
  
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    if (range.from && range.to) {
      setIsCustomDateRange(true);
    }
  };
  
  const prepareChartData = () => {
    if (!analyticsData) return [];
    
    const clicksByDay = analyticsData.clicksByDay;
    const now = new Date();
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 365;
    
    const result = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      result.push({
        date: dateString,
        clicks: clicksByDay[dateString] || 0,
        conversions: (clicksByDay[dateString] || 0) * 0.029
      });
    }
    
    return result;
  };
  
  const prepareSourceData = () => {
    if (!analyticsData) return [];
    
    const { clicksBySource } = analyticsData;
    return Object.entries(clicksBySource).map(([source, count]) => ({
      name: source || 'unknown',
      value: count
    }));
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#4CAF50', '#9C27B0'];
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Affiliate Performance</h2>
        <Button variant="outline" onClick={handleClearData} className="text-red-600 border-red-600 hover:bg-red-50">
          Clear Analytics Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Clicks</CardTitle>
            <CardDescription>All affiliate link clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData?.totalClicks || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Unique Products</CardTitle>
            <CardDescription>Products with clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData?.uniqueProducts || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Est. Conversions</CardTitle>
            <CardDescription>Based on category averages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analyticsData?.estimatedConversions ? 
                analyticsData.estimatedConversions.toFixed(1) : '0'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Est. Revenue</CardTitle>
            <CardDescription>Commission-based estimate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analyticsData?.estimatedRevenue ? 
                formatCurrency(analyticsData.estimatedRevenue) : '$0.00'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        <Tabs defaultValue="clicks" className="w-full">
          <TabsList>
            <TabsTrigger value="clicks">Clicks Over Time</TabsTrigger>
            <TabsTrigger value="products">Top Products</TabsTrigger>
            <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {isCustomDateRange && dateRange.from && dateRange.to ? (
                  `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                ) : (
                  "Pick a date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            variant={period === '7d' && !isCustomDateRange ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handlePeriodChange('7d')}
          >
            Last 7 Days
          </Button>
          <Button 
            variant={period === '30d' && !isCustomDateRange ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handlePeriodChange('30d')}
          >
            Last 30 Days
          </Button>
          <Button 
            variant={period === 'all' && !isCustomDateRange ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handlePeriodChange('all')}
          >
            All Time
          </Button>
        </div>
      </div>
      
      <TabsContent value="clicks" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Affiliate Clicks Over Time</CardTitle>
            <CardDescription>
              Track how your affiliate links are performing
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'conversions') {
                      return [Number(value).toFixed(1), 'Est. Conversions'];
                    }
                    return [value, name === 'clicks' ? 'Clicks' : name];
                  }}
                />
                <Line type="monotone" dataKey="clicks" stroke="#4f46e5" strokeWidth={2} />
                <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="products" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Clicks</CardTitle>
            <CardDescription>
              Products generating the most affiliate clicks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left">Product</th>
                    <th className="py-3 text-left">ID</th>
                    <th className="py-3 text-right">Clicks</th>
                    <th className="py-3 text-right">Est. Conversions</th>
                    <th className="py-3 text-right">Conv. Rate</th>
                    <th className="py-3 text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData?.topProducts?.map((product, index) => (
                    <tr key={product.productId} className="border-b">
                      <td className="py-3">{product.productName}</td>
                      <td className="py-3 text-gray-500">{product.productId}</td>
                      <td className="py-3 text-right">{product.count}</td>
                      <td className="py-3 text-right">
                        {product.estimatedConversions || (product.count * 0.029).toFixed(1)}
                      </td>
                      <td className="py-3 text-right">2.9%</td>
                      <td className="py-3 text-right">
                        {analyticsData.totalClicks 
                          ? ((product.count / analyticsData.totalClicks) * 100).toFixed(1) + '%' 
                          : '0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="sources" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>
              Where affiliate clicks are coming from
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            {analyticsData && analyticsData.totalClicks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareSourceData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareSourceData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500">
                No source data available yet
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default AffiliateDashboard;
