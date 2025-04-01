
import React, { useState, useEffect, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useDashboard } from './DashboardContext';
import {
  AnalyticsHeader,
  AnalyticsSummaryCards,
  DetailedCharts,
  processPageViewsData,
  processTrafficSources,
  exportAnalyticsData
} from './analytics';

const AnalyticsDashboard = () => {
  const { isLoading, setIsLoading } = useDashboard();
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [pageViewsData, setPageViewsData] = useState<any[]>([]);
  const [trafficSourcesData, setTrafficSourcesData] = useState<any[]>([]);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [totalPageViews, setTotalPageViews] = useState(0);

  const fetchAnalyticsData = useCallback(async () => {
    if (!date?.from) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const startDate = date.from;
      const endDate = date.to || new Date();
      
      // Adjust end date to include the entire day
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      
      // Fetch page views
      const { data: pageViews, error: pageViewsError } = await supabase
        .from('page_views')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', adjustedEndDate.toISOString());
      
      if (pageViewsError) {
        console.error('Error fetching page views:', pageViewsError);
        setError('Failed to fetch page views data');
        toast.error('Failed to fetch page views data');
        return;
      }
      
      // Process data
      const processedPageViewsData = processPageViewsData(pageViews || []);
      const processedSourcesData = processTrafficSources(pageViews || []);
      
      // Set state
      setPageViewsData(processedPageViewsData);
      setTrafficSourcesData(processedSourcesData);
      setTotalPageViews(pageViews?.length || 0);
      
      // Count unique visitors
      const uniqueIps = new Set();
      pageViews?.forEach(view => {
        if (view.ip_address) uniqueIps.add(view.ip_address);
      });
      setUniqueVisitors(uniqueIps.size);
      
    } catch (error) {
      console.error('Error in fetchAnalyticsData:', error);
      setError('Failed to load analytics data');
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  }, [date, setIsLoading]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleExportData = (type: string) => {
    exportAnalyticsData(type, pageViewsData, trafficSourcesData);
    toast.success(`${type} data exported successfully`);
  };

  const handleRefresh = () => {
    fetchAnalyticsData();
    toast.success('Analytics data refreshed');
  };

  return (
    <div className="space-y-4">
      <AnalyticsHeader 
        date={date} 
        setDate={setDate} 
        onRefresh={handleRefresh}
      />
      
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
          {error}
        </div>
      )}
      
      <AnalyticsSummaryCards
        isLoading={isLoading}
        pageViewsData={pageViewsData}
        trafficSourcesData={trafficSourcesData}
        uniqueVisitors={uniqueVisitors}
        totalPageViews={totalPageViews}
        date={date}
        exportData={handleExportData}
        error={error}
      />

      <DetailedCharts
        isLoading={isLoading}
        pageViewsData={pageViewsData}
        trafficSourcesData={trafficSourcesData}
        uniqueVisitors={uniqueVisitors}
        exportData={handleExportData}
        error={error}
      />
    </div>
  );
};

export default AnalyticsDashboard;
