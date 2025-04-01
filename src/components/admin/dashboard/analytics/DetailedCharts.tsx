
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';

interface DetailedChartsProps {
  isLoading: boolean;
  pageViewsData: any[];
  trafficSourcesData: any[];
  uniqueVisitors: number;
  exportData: (type: string) => void;
  error: string | null;
}

const DetailedCharts: React.FC<DetailedChartsProps> = ({
  isLoading,
  pageViewsData,
  trafficSourcesData,
  uniqueVisitors,
  exportData,
  error
}) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>Visualize your traffic data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-60 text-muted-foreground gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>Unable to load data: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Analytics</CardTitle>
        <CardDescription>Visualize your traffic data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pageViews">
          <TabsList className="mb-4">
            <TabsTrigger value="pageViews">Page Views</TabsTrigger>
            <TabsTrigger value="trafficSources">Traffic Sources</TabsTrigger>
          </TabsList>
          <TabsContent value="pageViews">
            <div className="h-80">
              {isLoading ? (
                <div className="animate-pulse flex items-center justify-center h-full">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              ) : pageViewsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pageViewsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" name="Page Views" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No page view data available for this time period
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="trafficSources">
            <div className="h-80">
              {isLoading ? (
                <div className="animate-pulse flex items-center justify-center h-full">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              ) : trafficSourcesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSourcesData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {trafficSourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} visits`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No source data available yet
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetailedCharts;
