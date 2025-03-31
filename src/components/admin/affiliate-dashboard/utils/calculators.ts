
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
 * Clear analytics data from storage
 */
export const clearAnalyticsData = (): void => {
  console.log('Analytics data cleared');
  // In a real app, this would clear data from storage
};
