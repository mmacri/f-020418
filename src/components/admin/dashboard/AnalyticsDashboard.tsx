
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bar, BarChart, Line, LineChart, PieChart, Pie, Cell, ResponsiveContainer, 
  CartesianGrid, XAxis, YAxis, Tooltip 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { supabase } from '@/integrations/supabase/client';
import { exportToCSV } from '@/components/admin/affiliate-dashboard/utils/exportUtils';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { useDashboard } from './DashboardContext';

const AnalyticsDashboard = () => {
  const { isLoading, setIsLoading } = useDashboard();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [pageViewsData, setPageViewsData] = useState<any[]>([]);
  const [trafficSourcesData, setTrafficSourcesData] = useState<any[]>([]);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [totalPageViews, setTotalPageViews] = useState(0);

  useEffect(() => {
    fetchAnalyticsData();
  }, [date]);

  const fetchAnalyticsData = async () => {
    if (!date?.from) return;
    
    setIsLoading(true);
    try {
      const startDate = date.from;
      const endDate = date.to || new Date();
      
      // Adjust end date to include the entire day
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      
      // Fetch page views
      const { data: pageViews, error: pageViewsError } = await supabase
        .from('page_views')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', adjustedEndDate.toISOString());
      
      if (pageViewsError) {
        console.error('Error fetching page views:', pageViewsError);
        toast.error('Failed to fetch page views data');
        return;
      }
      
      // Process data
      const processedPageViewsData = processPageViewsData(pageViews || []);
      const processedSourcesData = processTrafficSources(pageViews || []);
      
      // Set state
      setPageViewsData(processedPageViewsData);
      setTrafficSourcesData(processedSourcesData);
      setTotalPageViews(pageViews?.length || 0);
      
      // Count unique visitors
      const uniqueIps = new Set();
      pageViews?.forEach(view => {
        if (view.ip_address) uniqueIps.add(view.ip_address);
      });
      setUniqueVisitors(uniqueIps.size);
      
    } catch (error) {
      console.error('Error in fetchAnalyticsData:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const processPageViewsData = (data: any[]) => {
    // Group by day
    const dailyViews: Record<string, number> = {};
    
    data.forEach(view => {
      const date = new Date(view.created_at).toISOString().split('T')[0];
      dailyViews[date] = (dailyViews[date] || 0) + 1;
    });
    
    // Convert to array format
    return Object.entries(dailyViews).map(([date, views]) => ({
      name: date,
      views
    })).sort((a, b) => a.name.localeCompare(b.name));
  };

  const processTrafficSources = (data: any[]) => {
    // Group by referrer
    const sources: Record<string, number> = {};
    
    data.forEach(view => {
      let source = view.referrer;
      
      if (!source) source = 'Direct';
      else if (source.includes('google')) source = 'Google';
      else if (source.includes('bing')) source = 'Bing';
      else if (source.includes('yahoo')) source = 'Yahoo';
      else if (source.includes('facebook') || source.includes('instagram') || source.includes('twitter')) source = 'Social';
      else source = 'Other';
      
      sources[source] = (sources[source] || 0) + 1;
    });
    
    // Convert to array format for the chart
    return Object.entries(sources).map(([name, value]) => ({
      name,
      value
    }));
  };

  const exportData = (type: string) => {
    try {
      let data: any[] = [];
      let fileName = '';
      
      if (type === 'pageViews') {
        data = pageViewsData;
        fileName = `page_views_${new Date().toISOString().split('T')[0]}.csv`;
      } else if (type === 'sources') {
        data = trafficSourcesData;
        fileName = `traffic_sources_${new Date().toISOString().split('T')[0]}.csv`;
      }
      
      if (data.length === 0) {
        toast.error('No data to export');
        return;
      }
      
      // Create CSV and download
      const csvData = exportToCSV(data, fileName);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, fileName);
      
      toast.success(`Data exported to ${fileName}`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
                onSelect={(newDate) => {
                  setDate(newDate);
                }}
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
            <CardDescription>
              {date?.from
                ? date.to
                  ? `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
                  : `Since ${date.from.toLocaleDateString()}`
                : 'All time'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 w-1/3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{totalPageViews}</div>
                <div className="h-[80px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pageViewsData}>
                      <Bar dataKey="views" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <CardDescription>
              {date?.from
                ? date.to
                  ? `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
                  : `Since ${date.from.toLocaleDateString()}`
                : 'All time'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 w-1/3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{uniqueVisitors}</div>
                <div className="h-[80px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pageViewsData}>
                      <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Traffic Sources</CardTitle>
            <CardDescription>
              {date?.from
                ? date.to
                  ? `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
                  : `Since ${date.from.toLocaleDateString()}`
                : 'All time'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 w-1/3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <div className="text-2xl font-bold">{trafficSourcesData.length} sources</div>
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
              </>
            )}
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
    </div>
  );
};

export default AnalyticsDashboard;
