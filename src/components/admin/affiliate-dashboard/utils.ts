
import { AnalyticsSummary, ChartDataItem } from './types';

export const prepareChartData = (
  analyticsData: AnalyticsSummary | null, 
  period: '7d' | '30d' | 'all', 
  chartView: 'daily' | 'weekly' | 'monthly'
): ChartDataItem[] => {
  if (!analyticsData || !analyticsData.clicksByDay || typeof analyticsData.clicksByDay !== 'object') {
    return [];
  }
  
  const clicksByDay = analyticsData.clicksByDay || {};
  const now = new Date();
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 365;
  
  const result = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const clicks = clicksByDay[dateString] || 0;
    
    result.push({
      date: dateString,
      clicks: clicks,
      conversions: Number((clicks * 0.029).toFixed(1)),
      revenue: Number((clicks * 0.029 * 4.5).toFixed(2))
    });
  }
  
  if (chartView !== 'daily') {
    const groupedData: {[key: string]: {clicks: number, conversions: number, revenue: number, count: number}} = {};
    
    result.forEach(day => {
      let groupKey: string;
      const date = new Date(day.date);
      
      if (chartView === 'weekly') {
        const weekNumber = Math.ceil((date.getDate() + (new Date(date.getFullYear(), date.getMonth(), 1).getDay())) / 7);
        groupKey = `Week ${weekNumber}, ${date.getFullYear()}`;
      } else {
        groupKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      }
      
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = { clicks: 0, conversions: 0, revenue: 0, count: 0 };
      }
      
      groupedData[groupKey].clicks += day.clicks;
      groupedData[groupKey].conversions += day.conversions;
      groupedData[groupKey].revenue += day.revenue;
      groupedData[groupKey].count++;
    });
    
    return Object.entries(groupedData).map(([key, data]) => ({
      date: key,
      clicks: data.clicks,
      conversions: Number(data.conversions.toFixed(1)),
      revenue: Number(data.revenue.toFixed(2))
    }));
  }
  
  return result;
};

export const prepareSourceData = (analyticsData: AnalyticsSummary | null): Array<{ name: string; value: number }> => {
  if (!analyticsData || !analyticsData.clicksBySource || typeof analyticsData.clicksBySource !== 'object') {
    return [];
  }
  
  const { clicksBySource } = analyticsData;
  return Object.entries(clicksBySource).map(([source, count]) => ({
    name: source || 'unknown',
    value: count
  }));
};

export const calculateGrowth = (
  analyticsData: AnalyticsSummary | null,
  chartData: ChartDataItem[],
  metric: 'clicks' | 'conversions' | 'revenue'
): number => {
  if (!analyticsData) return 0;
  
  if (chartData.length < 2) return 0;
  
  const midPoint = Math.floor(chartData.length / 2);
  const firstHalf = chartData.slice(0, midPoint);
  const secondHalf = chartData.slice(midPoint);
  
  const firstHalfTotal = firstHalf.reduce((sum, item) => sum + (item[metric] || 0), 0);
  const secondHalfTotal = secondHalf.reduce((sum, item) => sum + (item[metric] || 0), 0);
  
  if (firstHalfTotal === 0) return secondHalfTotal > 0 ? 100 : 0;
  
  return Math.round(((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const handleExportData = (
  analyticsData: AnalyticsSummary | null,
  period: '7d' | '30d' | 'all',
  dateRange: { from: Date | undefined; to: Date | undefined },
  isCustomDateRange: boolean,
  exportPeriod?: '7d' | '30d' | 'custom' | 'all'
): void => {
  if (!analyticsData) return;
  
  try {
    let periodToExport = exportPeriod || period;
    let fileNameBase = `affiliate-analytics-${new Date().toISOString().split('T')[0]}`;
    let dateRangeText = '';
    
    if (exportPeriod === '7d') {
      fileNameBase += '-last-7-days';
      dateRangeText = '(Last 7 Days)';
    } else if (exportPeriod === '30d') {
      fileNameBase += '-last-30-days';
      dateRangeText = '(Last 30 Days)';
    } else if (exportPeriod === 'custom' && dateRange.from && dateRange.to) {
      fileNameBase += `-${dateRange.from.toISOString().split('T')[0]}-to-${dateRange.to.toISOString().split('T')[0]}`;
      dateRangeText = `(${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()})`;
    } else if (exportPeriod === 'all') {
      fileNameBase += '-all-time';
      dateRangeText = '(All Time)';
    } else if (period === '7d') {
      dateRangeText = '(Last 7 Days)';
    } else if (period === '30d') {
      dateRangeText = '(Last 30 Days)';
    } else if (isCustomDateRange && dateRange.from && dateRange.to) {
      dateRangeText = `(${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()})`;
    } else {
      dateRangeText = '(All Time)';
    }
    
    const csvData = [
      [`Affiliate Analytics Export ${dateRangeText}`],
      ['Date', 'Clicks', 'Estimated Conversions', 'Estimated Revenue'],
      ...Object.entries(analyticsData.clicksByDay || {}).map(([date, clicks]) => {
        const conversions = clicks * 0.029; // Using average conversion rate
        const revenue = conversions * 4.5; // Using average commission
        return [date, clicks.toString(), conversions.toFixed(1), `$${revenue.toFixed(2)}`];
      })
    ]
    .map(row => row.join(','))
    .join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileNameBase}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    return fileNameBase;
  } catch (error) {
    console.error('Error exporting data:', error);
    return undefined;
  }
};
