
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface AnalyticsSummaryCardsProps {
  isLoading: boolean;
  pageViewsData: any[];
  trafficSourcesData: any[];
  uniqueVisitors: number;
  totalPageViews: number;
  date: DateRange | undefined;
  exportData: (type: string) => void;
}

const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({
  isLoading,
  pageViewsData,
  trafficSourcesData,
  uniqueVisitors,
  totalPageViews,
  date,
  exportData
}) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const formatDateRange = () => {
    if (!date?.from) return 'All time';
    
    return date.to
      ? `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
      : `Since ${date.from.toLocaleDateString()}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Page Views</CardTitle>
          <CardDescription>
            {formatDateRange()}
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
            {formatDateRange()}
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
            {formatDateRange()}
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
  );
};

export default AnalyticsSummaryCards;
