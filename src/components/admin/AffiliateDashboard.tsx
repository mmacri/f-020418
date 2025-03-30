
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
import { Calendar as CalendarIcon, Download, Filter, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

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
  dailyPerformance?: {
    date: string;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
}

const AffiliateDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('7d');
  const [chartView, setChartView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [comparisonPeriod, setComparisonPeriod] = useState<boolean>(false);
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
      const data = await getAnalyticsSummary(startDate, endDate);
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error loading analytics data:", error);
      toast({
        title: "Failed to load analytics data",
        description: "Please try again later",
        variant: "destructive"
      });
    }
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

  const handleExportData = () => {
    if (!analyticsData) return;
    
    try {
      // Format data for export
      const csvData = [
        // Headers
        ['Date', 'Clicks', 'Estimated Conversions', 'Estimated Revenue'],
        // Data rows
        ...Object.entries(analyticsData.clicksByDay).map(([date, clicks]) => {
          const conversions = clicks * 0.029; // Using average conversion rate
          const revenue = conversions * 4.5; // Using average commission
          return [date, clicks.toString(), conversions.toFixed(1), revenue.toFixed(2)];
        })
      ]
      .map(row => row.join(','))
      .join('\n');
      
      // Create and download the file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `affiliate-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: 'Export Successful',
        description: 'Analytics data has been exported to CSV.',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export Failed',
        description: 'There was a problem exporting your data.',
        variant: 'destructive',
      });
    }
  };
  
  const prepareChartData = () => {
    if (!analyticsData) return [];
    
    const clicksByDay = analyticsData.clicksByDay || {};
    const now = new Date();
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 365;
    
    const result = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const clicks = clicksByDay[dateString] || 0;
      
      result.push({
        date: dateString,
        clicks: clicks,
        conversions: Number((clicks * 0.029).toFixed(1)),
        revenue: Number((clicks * 0.029 * 4.5).toFixed(2))
      });
    }
    
    // If we want to group by week or month
    if (chartView !== 'daily') {
      const groupedData: {[key: string]: {clicks: number, conversions: number, revenue: number, count: number}} = {};
      
      result.forEach(day => {
        let groupKey: string;
        const date = new Date(day.date);
        
        if (chartView === 'weekly') {
          // Get the week number and year
          const weekNumber = Math.ceil((date.getDate() + (new Date(date.getFullYear(), date.getMonth(), 1).getDay())) / 7);
          groupKey = `Week ${weekNumber}, ${date.getFullYear()}`;
        } else {
          // Monthly grouping
          groupKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        }
        
        if (!groupedData[groupKey]) {
          groupedData[groupKey] = { clicks: 0, conversions: 0, revenue: 0, count: 0 };
        }
        
        groupedData[groupKey].clicks += day.clicks;
        groupedData[groupKey].conversions += day.conversions;
        groupedData[groupKey].revenue += day.revenue;
        groupedData[groupKey].count++;
      });
      
      return Object.entries(groupedData).map(([key, data]) => ({
        date: key,
        clicks: data.clicks,
        conversions: Number(data.conversions.toFixed(1)),
        revenue: Number(data.revenue.toFixed(2))
      }));
    }
    
    return result;
  };
  
  const prepareSourceData = () => {
    if (!analyticsData || !analyticsData.clicksBySource) return [];
    
    const { clicksBySource } = analyticsData;
    return Object.entries(clicksBySource).map(([source, count]) => ({
      name: source || 'unknown',
      value: count
    }));
  };
  
  const calculateGrowth = (metric: 'clicks' | 'conversions' | 'revenue'): number => {
    if (!analyticsData) return 0;
    
    const data = prepareChartData();
    if (data.length < 2) return 0;
    
    // For period comparison, compare first half vs second half
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint);
    const secondHalf = data.slice(midPoint);
    
    const firstHalfTotal = firstHalf.reduce((sum, item) => sum + item[metric], 0);
    const secondHalfTotal = secondHalf.reduce((sum, item) => sum + item[metric], 0);
    
    if (firstHalfTotal === 0) return secondHalfTotal > 0 ? 100 : 0;
    
    return Math.round(((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100);
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
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportData} className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" onClick={handleClearData} className="text-red-600 border-red-600 hover:bg-red-50">
            Clear Analytics Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Clicks</CardTitle>
            <CardDescription>
              All affiliate link clicks
              {calculateGrowth('clicks') !== 0 && (
                <span className={`ml-2 ${calculateGrowth('clicks') > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateGrowth('clicks') > 0 ? '+' : ''}{calculateGrowth('clicks')}%
                </span>
              )}
            </CardDescription>
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
            <CardDescription>
              Based on category averages
              {calculateGrowth('conversions') !== 0 && (
                <span className={`ml-2 ${calculateGrowth('conversions') > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateGrowth('conversions') > 0 ? '+' : ''}{calculateGrowth('conversions')}%
                </span>
              )}
            </CardDescription>
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
            <CardDescription>
              Commission-based estimate
              {calculateGrowth('revenue') !== 0 && (
                <span className={`ml-2 ${calculateGrowth('revenue') > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateGrowth('revenue') > 0 ? '+' : ''}{calculateGrowth('revenue')}%
                </span>
              )}
            </CardDescription>
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
            <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
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
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Affiliate Clicks Over Time</CardTitle>
              <CardDescription>
                Track how your affiliate links are performing
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={chartView}
                onValueChange={(value) => setChartView(value as 'daily' | 'weekly' | 'monthly')}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="View by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer 
              config={{
                clicks: {
                  label: "Clicks",
                  color: "#4f46e5"
                },
                conversions: {
                  label: "Conversions",
                  color: "#10b981"
                },
                revenue: {
                  label: "Revenue",
                  color: "#f59e0b"
                }
              }}
            >
              <LineChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={
                  <ChartTooltipContent 
                    formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [formatCurrency(Number(value)), 'Est. Revenue'];
                      }
                      if (name === 'conversions') {
                        return [Number(value).toFixed(1), 'Est. Conversions'];
                      }
                      return [value, 'Clicks'];
                    }}
                  />
                } />
                <Line type="monotone" dataKey="clicks" name="clicks" stroke="#4f46e5" strokeWidth={2} />
                <Line type="monotone" dataKey="conversions" name="conversions" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                {chartView !== 'daily' && (
                  <Line type="monotone" dataKey="revenue" name="revenue" stroke="#f59e0b" strokeWidth={2} />
                )}
              </LineChart>
            </ChartContainer>
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
      
      <TabsContent value="advanced" className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate Analysis</CardTitle>
              <CardDescription>
                Estimated conversions across different sources
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  conversion: {
                    label: "Conversion Rate",
                    color: "#10b981"
                  }
                }}
              >
                <BarChart
                  data={prepareSourceData().map(source => ({
                    name: source.name,
                    conversionRate: (2.5 + Math.random() * 1.5).toFixed(1), // Simulated varying conversion rates
                    clicks: source.value
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} tickFormatter={(value) => `${value}%`} />
                  <ChartTooltip content={
                    <ChartTooltipContent 
                      formatter={(value, name) => {
                        if (name === 'conversionRate') {
                          return [`${value}%`, 'Conversion Rate'];
                        }
                        return [value, name];
                      }}
                    />
                  } />
                  <Bar dataKey="conversionRate" name="conversion" fill="#10b981" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>
                Estimated revenue by product category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Massage Guns', value: analyticsData?.estimatedRevenue ? analyticsData.estimatedRevenue * 0.4 : 0 },
                      { name: 'Foam Rollers', value: analyticsData?.estimatedRevenue ? analyticsData.estimatedRevenue * 0.3 : 0 },
                      { name: 'Compression', value: analyticsData?.estimatedRevenue ? analyticsData.estimatedRevenue * 0.2 : 0 },
                      { name: 'Other', value: analyticsData?.estimatedRevenue ? analyticsData.estimatedRevenue * 0.1 : 0 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${formatCurrency(Number(value))}`}
                  >
                    {[0, 1, 2, 3].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Est. Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Conversion Performance Over Time</CardTitle>
              <CardDescription>
                How conversion rates are trending
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  conversionRate: {
                    label: "Conversion Rate",
                    color: "#8884d8"
                  }
                }}
              >
                <LineChart 
                  data={prepareChartData().map(day => ({
                    ...day,
                    conversionRate: day.clicks > 0 ? (day.conversions / day.clicks) * 100 : 0
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} tickFormatter={(value) => `${value}%`} />
                  <ChartTooltip content={
                    <ChartTooltipContent 
                      formatter={(value, name) => {
                        if (name === 'conversionRate') {
                          return [`${Number(value).toFixed(2)}%`, 'Conversion Rate'];
                        }
                        return [value, name];
                      }}
                    />
                  } />
                  <Line type="monotone" dataKey="conversionRate" name="conversionRate" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </div>
  );
};

export default AffiliateDashboard;
