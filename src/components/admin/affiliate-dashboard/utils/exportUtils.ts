
import { ChartDataItem } from '../types';
import { formatDate, formatCurrency, formatPercentage } from './formatters';

// Convert chart data to CSV format
export const chartDataToCsv = (chartData: ChartDataItem[]): string => {
  const headers = ['Date', 'Clicks', 'Conversions', 'Revenue'];
  const rows = chartData.map(item => [
    formatDate(item.date),
    item.clicks.toString(),
    item.conversions.toString(),
    formatCurrency(item.revenue)
  ]);

  const headerRow = headers.join(',');
  const dataRows = rows.map(row => row.join(','));
  
  return [headerRow, ...dataRows].join('\n');
};

// Export top products data to CSV format
export const topProductsToCsv = (topProducts: any[]): string => {
  const headers = ['Product', 'Clicks', 'Conversions', 'Revenue'];
  const rows = topProducts.map(product => [
    product.name,
    product.clicks.toString(),
    product.conversions.toString(),
    formatCurrency(product.revenue)
  ]);

  const headerRow = headers.join(',');
  const dataRows = rows.map(row => row.join(','));
  
  return [headerRow, ...dataRows].join('\n');
};

// Export affiliate performance data to JSON
export const exportToJson = (data: any): string => {
  return JSON.stringify(data, null, 2);
};
