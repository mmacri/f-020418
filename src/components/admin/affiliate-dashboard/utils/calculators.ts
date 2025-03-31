
import { ChartDataItem } from '../types';

export const calculateTotals = (chartData: ChartDataItem[]) => {
  const totalClicks = chartData.reduce((sum, item) => sum + item.clicks, 0);
  const totalConversions = chartData.reduce((sum, item) => sum + item.conversions, 0);
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  
  const conversionRate = totalClicks > 0 
    ? (totalConversions / totalClicks) * 100 
    : 0;
  
  return {
    clicks: totalClicks,
    conversions: totalConversions,
    revenue: parseFloat(totalRevenue.toFixed(2)),
    conversionRate: parseFloat(conversionRate.toFixed(1))
  };
};
