
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { ChartDataItem } from './types';

interface AdvancedAnalyticsProps {
  chartData: ChartDataItem[];
  sourceData: Array<{ name: string; value: number }>;
  estimatedRevenue?: number;
  formatCurrency: (amount: number) => string;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ 
  chartData, 
  sourceData, 
  estimatedRevenue = 0,
  formatCurrency 
}) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#4CAF50', '#9C27B0'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rate Analysis</CardTitle>
          <CardDescription>
            Estimated conversions across different sources
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer
            config={{
              conversion: {
                label: "Conversion Rate",
                color: "#10b981"
              }
            }}
          >
            <BarChart
              data={sourceData.map(source => ({
                name: source.name,
                conversionRate: (2.5 + Math.random() * 1.5).toFixed(1), // Simulated varying conversion rates
                clicks: source.value
              }))}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} tickFormatter={(value) => `${value}%`} />
              <ChartTooltip content={
                <ChartTooltipContent 
                  formatter={(value, name) => {
                    if (name === 'conversionRate') {
                      return [`${value}%`, 'Conversion Rate'];
                    }
                    return [value, name];
                  }}
                />
              } />
              <Bar dataKey="conversionRate" name="conversion" fill="#10b981" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>
            Estimated revenue by product category
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Massage Guns', value: estimatedRevenue * 0.4 },
                  { name: 'Foam Rollers', value: estimatedRevenue * 0.3 },
                  { name: 'Compression', value: estimatedRevenue * 0.2 },
                  { name: 'Other', value: estimatedRevenue * 0.1 }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${formatCurrency(Number(value))}`}
              >
                {[0, 1, 2, 3].map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value) => [formatCurrency(Number(value)), 'Est. Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Conversion Performance Over Time</CardTitle>
          <CardDescription>
            How conversion rates are trending
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer
            config={{
              conversionRate: {
                label: "Conversion Rate",
                color: "#8884d8"
              }
            }}
          >
            <LineChart 
              data={chartData.map(day => ({
                ...day,
                conversionRate: day.clicks > 0 ? (day.conversions / day.clicks) * 100 : 0
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} tickFormatter={(value) => `${value}%`} />
              <ChartTooltip content={
                <ChartTooltipContent 
                  formatter={(value, name) => {
                    if (name === 'conversionRate') {
                      return [`${Number(value).toFixed(2)}%`, 'Conversion Rate'];
                    }
                    return [value, name];
                  }}
                />
              } />
              <Line type="monotone" dataKey="conversionRate" name="conversionRate" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;
