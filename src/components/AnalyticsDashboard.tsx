
import React, { useState, useEffect } from 'react';
import { getAnalyticsSummary } from '@/lib/analytics-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  
  useEffect(() => {
    const summary = getAnalyticsSummary();
    setAnalyticsData(summary);
  }, []);
  
  if (!analyticsData) {
    return (
      <div className="p-6">
        <p>Loading analytics data...</p>
      </div>
    );
  }
  
  // Prepare chart data for clicks by day
  const prepareClicksByDayData = () => {
    const now = new Date();
    const data = [];
    
    let daysToShow = 7;
    if (timeframe === 'month') daysToShow = 30;
    else if (timeframe === 'all') daysToShow = Object.keys(analyticsData.clicksByDay).length;
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      data.unshift({
        date: dateString,
        clicks: analyticsData.clicksByDay[dateString] || 0
      });
    }
    
    return data;
  };
  
  // Prepare chart data for clicks by source
  const prepareClicksBySourceData = () => {
    return Object.entries(analyticsData.clicksBySource).map(([source, count]) => ({
      name: source,
      value: count
    }));
  };
  
  const clicksByDayData = prepareClicksByDayData();
  const clicksBySourceData = prepareClicksBySourceData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Total Clicks</CardTitle>
            <CardDescription>All affiliate link clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{analyticsData.totalClicks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Products</CardTitle>
            <CardDescription>Unique products clicked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{analyticsData.uniqueProducts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Conversion Rate</CardTitle>
            <CardDescription>Estimated based on industry average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">~3.2%</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clicks Over Time</CardTitle>
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={() => setTimeframe('week')}
                className={`px-3 py-1 text-sm rounded-md ${timeframe === 'week' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-500'}`}
              >
                7 Days
              </button>
              <button 
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1 text-sm rounded-md ${timeframe === 'month' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-500'}`}
              >
                30 Days
              </button>
              <button 
                onClick={() => setTimeframe('all')}
                className={`px-3 py-1 text-sm rounded-md ${timeframe === 'all' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-500'}`}
              >
                All Time
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={clicksByDayData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Clicks by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clicksBySourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {clicksBySourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Product</th>
                  <th className="text-right py-2 px-4">Clicks</th>
                  <th className="text-right py-2 px-4">Est. Conversions</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topProducts.map((product: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{product.productName}</td>
                    <td className="text-right py-2 px-4">{product.count}</td>
                    <td className="text-right py-2 px-4">{Math.round(product.count * 0.032)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
