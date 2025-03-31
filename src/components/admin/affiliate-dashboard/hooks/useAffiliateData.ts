
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChartDataItem } from '../types';
import { calculateTotals } from '../utils/calculators';
import { processChartData, processSourceData, processTopProducts } from '../utils/dataProcessors';

interface UseAffiliateDataProps {
  timeframe: 'week' | 'month' | 'all';
  dateRange?: { from: Date | undefined; to: Date | undefined };
  isCustomDateRange?: boolean;
}

export const useAffiliateData = ({ 
  timeframe, 
  dateRange, 
  isCustomDateRange = false 
}: UseAffiliateDataProps) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [sourceData, setSourceData] = useState<{name: string; value: number}[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [totals, setTotals] = useState<{
    clicks: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  }>({ clicks: 0, conversions: 0, revenue: 0, conversionRate: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [timeframe, isCustomDateRange, dateRange?.from, dateRange?.to]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let startDate: Date;
      let endDate = new Date();
      
      if (isCustomDateRange && dateRange?.from && dateRange?.to) {
        startDate = new Date(dateRange.from);
        endDate = new Date(dateRange.to);
        // Set end date to end of day
        endDate.setHours(23, 59, 59, 999);
      } else {
        startDate = new Date();
        if (timeframe === 'week') {
          startDate.setDate(endDate.getDate() - 7);
        } else if (timeframe === 'month') {
          startDate.setDate(endDate.getDate() - 30);
        } else {
          startDate.setDate(endDate.getDate() - 90);
        }
      }

      const { data: eventsData, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_type', 'affiliate_click')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) {
        console.error('Error fetching analytics data:', error);
        toast.error('Failed to fetch analytics data');
        return;
      }

      const processedChartData = processChartData(eventsData || [], startDate, endDate);
      const processedSourceData = processSourceData(eventsData || []);
      const processedTopProducts = processTopProducts(eventsData || []);
      
      setChartData(processedChartData);
      setSourceData(processedSourceData);
      setTopProducts(processedTopProducts);
      
      const calculatedTotals = calculateTotals(processedChartData);
      setTotals(calculatedTotals);
    } catch (error) {
      console.error('Error in fetchData:', error);
      toast.error('Error loading analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    chartData,
    sourceData,
    topProducts,
    totals,
    isLoading,
    fetchData
  };
};
