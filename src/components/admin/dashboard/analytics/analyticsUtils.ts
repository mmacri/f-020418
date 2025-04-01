import { format, subDays } from 'date-fns';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

// Process raw page views data for charts
export const processPageViewsData = (pageViews: any[]) => {
  if (!pageViews || !pageViews.length) return [];

  // Group by day
  const viewsByDay: Record<string, number> = {};
  
  pageViews.forEach(view => {
    const day = view.created_at ? new Date(view.created_at).toISOString().split('T')[0] : null;
    if (day) {
      viewsByDay[day] = (viewsByDay[day] || 0) + 1;
    }
  });
  
  // Fill in missing days in the range
  const result = [];
  const sortedDays = Object.keys(viewsByDay).sort();
  
  if (sortedDays.length > 0) {
    const startDate = new Date(sortedDays[0]);
    const endDate = new Date(sortedDays[sortedDays.length - 1]);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const day = d.toISOString().split('T')[0];
      result.push({
        date: format(new Date(day), 'MMM dd'),
        fullDate: day,
        views: viewsByDay[day] || 0
      });
    }
  }
  
  // If there's no data or just one day, provide some context
  if (result.length <= 1) {
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const day = subDays(today, i).toISOString().split('T')[0];
      const formatted = format(new Date(day), 'MMM dd');
      
      // Only add if not already in results
      if (!result.find(item => item.fullDate === day)) {
        result.push({
          date: formatted,
          fullDate: day,
          views: viewsByDay[day] || 0
        });
      }
    }
  }
  
  return result;
};

// Process traffic sources
export const processTrafficSources = (pageViews: any[]) => {
  if (!pageViews || !pageViews.length) return [];

  const sourceCount: Record<string, number> = {};
  
  pageViews.forEach(view => {
    let source = 'Direct';
    
    if (view.referrer) {
      try {
        const url = new URL(view.referrer);
        source = url.hostname;
      } catch (e) {
        // If parsing fails, use the raw referrer string or a fallback
        source = view.referrer || 'Unknown';
      }
    }
    
    sourceCount[source] = (sourceCount[source] || 0) + 1;
  });
  
  // Convert to array for chart
  return Object.entries(sourceCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 sources
};

// Export analytics data
export const exportAnalyticsData = (type: string, pageViewsData: any[], sourcesData: any[]) => {
  try {
    let dataToExport;
    let filename;
    
    if (type === 'pageViews') {
      dataToExport = pageViewsData;
      filename = `page-views-${new Date().toISOString().split('T')[0]}.json`;
    } else if (type === 'sources') {
      dataToExport = sourcesData;
      filename = `traffic-sources-${new Date().toISOString().split('T')[0]}.json`;
    } else {
      dataToExport = { pageViews: pageViewsData, sources: sourcesData };
      filename = `analytics-data-${new Date().toISOString().split('T')[0]}.json`;
    }
    
    const jsonData = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    saveAs(blob, filename);
    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    toast.error('Failed to export data');
    return false;
  }
};

// Calculate percentage change between current and previous period
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  const change = ((current - previous) / previous) * 100;
  return Math.round(change * 10) / 10; // Round to 1 decimal place
};

// Format percentage change with + or - sign
export const formatPercentageChange = (change: number): string => {
  const prefix = change > 0 ? '+' : '';
  return `${prefix}${change}%`;
};
