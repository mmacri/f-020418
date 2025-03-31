
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AnalyticsSummary } from './types';

interface TrafficSourcesChartProps {
  analyticsData: AnalyticsSummary | null;
  prepareSourceData: () => Array<{ name: string; value: number }>;
}

const TrafficSourcesChart: React.FC<TrafficSourcesChartProps> = ({ 
  analyticsData, 
  prepareSourceData 
}) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#4CAF50', '#9C27B0'];

  return (
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
  );
};

export default TrafficSourcesChart;
