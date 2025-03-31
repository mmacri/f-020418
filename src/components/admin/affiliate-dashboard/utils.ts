
// Export existing functions from the original file
export * from './types';

/**
 * Generate mock analytics data for demonstration
 */
export const generateMockData = (days = 14) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    
    const clicks = Math.floor(Math.random() * 500) + 50;
    const conversions = Math.floor(clicks * (Math.random() * 0.05 + 0.01));
    const revenue = conversions * (Math.random() * 40 + 20);
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      clicks,
      conversions,
      revenue: parseFloat(revenue.toFixed(2))
    });
  }
  
  return data;
};

/**
 * Generate mock traffic source data
 */
export const generateSourceData = () => {
  return [
    { name: 'Direct', value: Math.floor(Math.random() * 300) + 100 },
    { name: 'Organic', value: Math.floor(Math.random() * 500) + 200 },
    { name: 'Social', value: Math.floor(Math.random() * 350) + 150 },
    { name: 'Referral', value: Math.floor(Math.random() * 200) + 80 },
    { name: 'Email', value: Math.floor(Math.random() * 150) + 50 }
  ];
};

/**
 * Generate mock top products data
 */
export const generateTopProductsData = () => {
  return [
    {
      id: 1,
      name: 'Premium Massage Gun',
      clicks: Math.floor(Math.random() * 200) + 100,
      conversions: Math.floor(Math.random() * 20) + 5,
      revenue: parseFloat((Math.random() * 500 + 200).toFixed(2))
    },
    {
      id: 2,
      name: 'Vibrating Foam Roller',
      clicks: Math.floor(Math.random() * 150) + 80,
      conversions: Math.floor(Math.random() * 15) + 3,
      revenue: parseFloat((Math.random() * 350 + 150).toFixed(2))
    },
    {
      id: 3,
      name: 'Resistance Bands Set',
      clicks: Math.floor(Math.random() * 120) + 60,
      conversions: Math.floor(Math.random() * 12) + 2,
      revenue: parseFloat((Math.random() * 250 + 100).toFixed(2))
    },
    {
      id: 4,
      name: 'Compression Leg Sleeves',
      clicks: Math.floor(Math.random() * 100) + 40,
      conversions: Math.floor(Math.random() * 10) + 1,
      revenue: parseFloat((Math.random() * 200 + 80).toFixed(2))
    },
    {
      id: 5,
      name: 'Recovery Slide Sandals',
      clicks: Math.floor(Math.random() * 80) + 30,
      conversions: Math.floor(Math.random() * 8) + 1,
      revenue: parseFloat((Math.random() * 150 + 60).toFixed(2))
    }
  ];
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Calculate total metrics from chart data
 */
export const calculateTotals = (data: any[]) => {
  const totals = data.reduce(
    (acc, item) => {
      acc.clicks += item.clicks || 0;
      acc.conversions += item.conversions || 0;
      acc.revenue += item.revenue || 0;
      return acc;
    },
    { clicks: 0, conversions: 0, revenue: 0 }
  );
  
  totals.conversionRate = totals.clicks > 0 
    ? (totals.conversions / totals.clicks) * 100 
    : 0;
  
  return totals;
};

/**
 * Find the date with the highest metric value
 */
export const findBestDay = (data: any[], metric: string): string => {
  if (!data || data.length === 0) return "N/A";
  
  const bestDay = data.reduce((best, current) => {
    return (current[metric] > best[metric]) ? current : best;
  }, data[0]);
  
  return bestDay.date;
};

/**
 * Format date for export filenames
 */
export const formatDateForFilename = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

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
 * Clear analytics data from storage
 */
export const clearAnalyticsData = (): void => {
  console.log('Analytics data cleared');
  // In a real app, this would clear data from storage
};
