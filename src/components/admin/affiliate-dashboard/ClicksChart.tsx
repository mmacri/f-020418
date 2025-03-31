
import React from 'react';
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
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Affiliate Clicks Over Time</h3>
          <p className="text-sm text-muted-foreground">
            Track how your affiliate links are performing
          </p>
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
      </div>
      
      <div className="h-[calc(100%-60px)]">
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
      </div>
    </div>
  );
};

export default ClicksChart;
