
import React, { useState, useEffect } from 'react';
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
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [pageViewsData, setPageViewsData] = useState<any[]>([]);
  const [trafficSourcesData, setTrafficSourcesData] = useState<any[]>([]);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [totalPageViews, setTotalPageViews] = useState(0);

  useEffect(() => {
    fetchAnalyticsData();
  }, [date]);

  const fetchAnalyticsData = async () => {
    if (!date?.from) return;
    
    setIsLoading(true);
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
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = (type: string) => {
    exportAnalyticsData(type, pageViewsData, trafficSourcesData);
  };

  return (
    <div className="space-y-4">
      <AnalyticsHeader date={date} setDate={setDate} />
      
      <AnalyticsSummaryCards
        isLoading={isLoading}
        pageViewsData={pageViewsData}
        trafficSourcesData={trafficSourcesData}
        uniqueVisitors={uniqueVisitors}
        totalPageViews={totalPageViews}
        date={date}
        exportData={handleExportData}
      />

      <DetailedCharts
        isLoading={isLoading}
        pageViewsData={pageViewsData}
        trafficSourcesData={trafficSourcesData}
        uniqueVisitors={uniqueVisitors}
        exportData={handleExportData}
      />
    </div>
  );
};

export default AnalyticsDashboard;
