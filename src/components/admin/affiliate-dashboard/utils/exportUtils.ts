
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

// Export analytics data to CSV
export const exportAnalyticsData = (
  chartData: ChartDataItem[], 
  sourceData: {name: string; value: number}[], 
  topProducts: any[]
): string => {
  // First, add chart data
  const chartDataCsv = chartDataToCsv(chartData);
  
  // Then, add a section for source data
  const sourceDataHeaders = '\n\nTraffic Sources\nSource,Clicks';
  const sourceDataRows = sourceData.map(source => `${source.name},${source.value}`).join('\n');
  
  // Finally, add top products
  const topProductsCsv = topProductsToCsv(topProducts);
  
  return `${chartDataCsv}\n${sourceDataHeaders}\n${sourceDataRows}\n\nTop Products\n${topProductsCsv}`;
};

// Generic export to CSV function for analytics dashboard
export const exportToCSV = (data: any[], filename: string): string => {
  if (data.length === 0) return '';
  
  // Get headers from the first object's keys
  const headers = Object.keys(data[0]);
  const headerRow = headers.join(',');
  
  // Convert each row of data to CSV format
  const dataRows = data.map(row => {
    return headers.map(header => {
      // Handle special cases
      if (typeof row[header] === 'string' && row[header].includes(',')) {
        return `"${row[header]}"`;
      }
      return row[header];
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
};
