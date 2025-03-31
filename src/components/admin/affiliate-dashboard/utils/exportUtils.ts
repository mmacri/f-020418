
import { formatDateForFilename } from './formatters';

/**
 * Export data to CSV format
 */
export const exportToCSV = (data: any[], filename: string): string => {
  if (!data || data.length === 0) return '';
  
  // Get headers from the first row
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  let csv = headers.join(',') + '\n';
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Quote strings that contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csv += values.join(',') + '\n';
  });
  
  return csv;
};

/**
 * Export analytics data to CSV
 */
export const exportAnalyticsData = (chartData: any[], sourcesData: any[], productsData: any[]): string => {
  const timestamp = formatDateForFilename();
  
  // Prepare the full report
  let report = `# Analytics Export (${timestamp})\n\n`;
  
  // Add daily data
  report += "## Daily Metrics\n\n";
  report += exportToCSV(chartData, `daily-metrics-${timestamp}.csv`);
  
  // Add traffic sources data
  report += "\n\n## Traffic Sources\n\n";
  report += exportToCSV(sourcesData, `traffic-sources-${timestamp}.csv`);
  
  // Add top products data
  report += "\n\n## Top Products\n\n";
  report += exportToCSV(productsData, `top-products-${timestamp}.csv`);
  
  return report;
};

/**
 * Export data to Excel format
 * Note: In a real implementation, you would use a library like xlsx to create Excel files
 * For now, we'll just create a CSV and return it
 */
export const exportToExcel = (data: any[], filename: string): string => {
  return exportToCSV(data, filename);
};

/**
 * Export analytics data to Excel format
 */
export const exportAnalyticsDataToExcel = (chartData: any[], sourcesData: any[], productsData: any[]): string => {
  return exportAnalyticsData(chartData, sourcesData, productsData);
};
