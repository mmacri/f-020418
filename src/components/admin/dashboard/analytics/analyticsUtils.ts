
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { exportToCSV } from '@/components/admin/affiliate-dashboard/utils/exportUtils';

// Process page views data
export const processPageViewsData = (data: any[]) => {
  // Group by day
  const dailyViews: Record<string, number> = {};
  
  data.forEach(view => {
    const date = new Date(view.created_at).toISOString().split('T')[0];
    dailyViews[date] = (dailyViews[date] || 0) + 1;
  });
  
  // Convert to array format
  return Object.entries(dailyViews).map(([date, views]) => ({
    name: date,
    views
  })).sort((a, b) => a.name.localeCompare(b.name));
};

// Process traffic sources data
export const processTrafficSources = (data: any[]) => {
  // Group by referrer
  const sources: Record<string, number> = {};
  
  data.forEach(view => {
    let source = view.referrer;
    
    if (!source) source = 'Direct';
    else if (source.includes('google')) source = 'Google';
    else if (source.includes('bing')) source = 'Bing';
    else if (source.includes('yahoo')) source = 'Yahoo';
    else if (source.includes('facebook') || source.includes('instagram') || source.includes('twitter')) source = 'Social';
    else source = 'Other';
    
    sources[source] = (sources[source] || 0) + 1;
  });
  
  // Convert to array format for the chart
  return Object.entries(sources).map(([name, value]) => ({
    name,
    value
  }));
};

// Export data helper
export const exportAnalyticsData = (type: string, pageViewsData: any[], trafficSourcesData: any[]) => {
  try {
    let data: any[] = [];
    let fileName = '';
    
    if (type === 'pageViews') {
      data = pageViewsData;
      fileName = `page_views_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (type === 'sources') {
      data = trafficSourcesData;
      fileName = `traffic_sources_${new Date().toISOString().split('T')[0]}.csv`;
    }
    
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    // Create CSV and download
    const csvData = exportToCSV(data, fileName);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, fileName);
    
    toast.success(`Data exported to ${fileName}`);
  } catch (error) {
    console.error('Error exporting data:', error);
    toast.error('Failed to export data');
  }
};
