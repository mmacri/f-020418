
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartDataItem, ChartViewType } from './types';

interface ClicksChartProps {
  chartData: ChartDataItem[];
  chartView: ChartViewType;
  setChartView: (view: ChartViewType) => void;
  formatCurrency: (amount: number) => string;
}

const ClicksChart: React.FC<ClicksChartProps> = ({ 
  chartData, 
  chartView, 
  setChartView, 
  formatCurrency 
}) => {
  return (
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
            onValueChange={(value) => setChartView(value as ChartViewType)}
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
          <LineChart data={chartData}>
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
  );
};

export default ClicksChart;
