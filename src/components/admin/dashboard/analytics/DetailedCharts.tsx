
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, 
  CartesianGrid, XAxis, YAxis, Tooltip 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DetailedChartsProps {
  isLoading: boolean;
  pageViewsData: any[];
  trafficSourcesData: any[];
  uniqueVisitors: number;
  exportData: (type: string) => void;
}

const DetailedCharts: React.FC<DetailedChartsProps> = ({ 
  isLoading, 
  pageViewsData, 
  trafficSourcesData, 
  uniqueVisitors,
  exportData 
}) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Tabs defaultValue="pageViews">
      <TabsList>
        <TabsTrigger value="pageViews">Page Views</TabsTrigger>
        <TabsTrigger value="visitors">Visitors</TabsTrigger>
        <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
      </TabsList>
      <TabsContent value="pageViews" className="mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Page View Metrics</CardTitle>
              <CardDescription>Detailed page view analytics</CardDescription>
            </div>
            <Button variant="outline" onClick={() => exportData('pageViews')}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : pageViewsData.length > 0 ? (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pageViewsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No page view data available for the selected period
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="visitors" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Visitor Analytics</CardTitle>
            <CardDescription>Detailed visitor metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-4xl font-bold">{uniqueVisitors}</p>
                <p className="text-muted-foreground mt-2">Unique visitors in selected period</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="sources" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : trafficSourcesData.length > 0 ? (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSourcesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      dataKey="value"
                    >
                      {trafficSourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No traffic source data available for the selected period
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DetailedCharts;
