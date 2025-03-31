
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, Line, LineChart, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, Calendar as CalendarIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DateRange } from 'react-day-picker';

// Mock data for demonstration
const pageViewsData = [
  { name: 'Mon', views: 540 },
  { name: 'Tue', views: 620 },
  { name: 'Wed', views: 480 },
  { name: 'Thu', views: 570 },
  { name: 'Fri', views: 650 },
  { name: 'Sat', views: 400 },
  { name: 'Sun', views: 380 },
];

const trafficSourcesData = [
  { name: 'Organic', value: 35 },
  { name: 'Direct', value: 25 },
  { name: 'Referral', value: 20 },
  { name: 'Social', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  const exportData = (type: string) => {
    let fileData = '';
    let fileNameTemplate = 'analytics_data_';
    
    if (type === 'pageViews') {
      fileData = JSON.stringify(pageViewsData);
      fileNameTemplate += 'page_views';
    } else if (type === 'sources') {
      fileData = JSON.stringify(trafficSourcesData);
      fileNameTemplate += 'traffic_sources';
    }
    
    const fileName = `${fileNameTemplate}_${new Date().toISOString().split('T')[0]}.json`;
    
    // Create blob and download
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {date?.from ? (
                    date.to ? (
                      <>
                        {date.from.toLocaleDateString()} -{' '}
                        {date.to.toLocaleDateString()}
                      </>
                    ) : (
                      date.from.toLocaleDateString()
                    )
                  ) : (
                    'Select a date'
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate as any}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,640</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last week
            </p>
            <div className="h-[80px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pageViewsData}>
                  <Bar dataKey="views" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,840</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last week
            </p>
            <div className="h-[80px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pageViewsData}>
                  <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Traffic Sources</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div className="text-2xl font-bold">5 sources</div>
              <Button size="sm" variant="ghost" onClick={() => exportData('sources')} className="h-8 px-2">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[80px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourcesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trafficSourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

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
              {/* Page view metrics table would go here */}
              <div className="text-center py-8 text-muted-foreground">
                Detailed analytics visualization will be here
              </div>
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
              {/* Visitor metrics would go here */}
              <div className="text-center py-8 text-muted-foreground">
                Visitor analytics visualization will be here
              </div>
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
              {/* Traffic sources visualization would go here */}
              <div className="text-center py-8 text-muted-foreground">
                Traffic sources visualization will be here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
