
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ClicksChartProps {
  data: any[];
  viewMode: 'daily' | 'weekly' | 'monthly';
  isLoading?: boolean;
}

const ClicksChart: React.FC<ClicksChartProps> = ({ data, viewMode, isLoading = false }) => {
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No analytics data available
      </div>
    );
  }

  // For weekly/monthly view, we need to aggregate the data
  const getAggregatedData = () => {
    if (viewMode === 'daily') return data;

    const aggregated: Record<string, { date: string, clicks: number, conversions: number, revenue: number }> = {};
    
    data.forEach(item => {
      const date = new Date(item.date);
      let key: string;
      
      if (viewMode === 'weekly') {
        // Get the week number
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        key = `Week ${weekNumber}, ${date.getFullYear()}`;
      } else { // monthly
        key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      }
      
      if (!aggregated[key]) {
        aggregated[key] = { date: key, clicks: 0, conversions: 0, revenue: 0 };
      }
      
      aggregated[key].clicks += item.clicks;
      aggregated[key].conversions += item.conversions;
      aggregated[key].revenue += item.revenue;
    });
    
    return Object.values(aggregated);
  };

  const chartData = getAggregatedData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      {viewMode === 'daily' ? (
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="clicks" fill="#4f46e5" name="Clicks" />
          <Bar dataKey="conversions" fill="#ef4444" name="Est. Conversions" />
        </BarChart>
      ) : (
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="clicks" stroke="#4f46e5" name="Clicks" />
          <Line type="monotone" dataKey="conversions" stroke="#ef4444" name="Est. Conversions" />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
};

export default ClicksChart;
