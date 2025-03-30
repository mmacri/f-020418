
import React, { useState, useEffect } from 'react';
import { getAnalyticsSummary } from '@/lib/analytics-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const summary = await getAnalyticsSummary();
        setAnalyticsData(summary);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!analyticsData) {
    return (
      <div className="p-6">
        <p>No analytics data available yet. Start tracking affiliate links to see data here.</p>
      </div>
    );
  }
  
  // Prepare chart data for clicks by day
  const prepareClicksByDayData = () => {
    // Safely check if clicksByDay exists in analyticsData
    if (!analyticsData || !analyticsData.clicksByDay || typeof analyticsData.clicksByDay !== 'object') {
      return [];
    }
    
    const now = new Date();
    const data = [];
    
    let daysToShow = 7;
    if (timeframe === 'month') daysToShow = 30;
    else if (timeframe === 'all') daysToShow = Object.keys(analyticsData.clicksByDay).length || 7;
    
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
    // Safely check if clicksBySource exists in analyticsData
    if (!analyticsData || !analyticsData.clicksBySource || typeof analyticsData.clicksBySource !== 'object') {
      return [];
    }
    
    return Object.entries(analyticsData.clicksBySource).map(([source, count]) => ({
      name: source || 'unknown',
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
            <div className="text-4xl font-bold">{analyticsData.totalClicks || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Products</CardTitle>
            <CardDescription>Unique products clicked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{analyticsData.uniqueProducts || 0}</div>
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
              {clicksByDayData.length > 0 ? (
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
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No click data available for this time period
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Clicks by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {clicksBySourceData.length > 0 ? (
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
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No source data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          {analyticsData.topProducts && analyticsData.topProducts.length > 0 ? (
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
          ) : (
            <div className="py-6 text-center text-gray-500">
              No product click data available yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
