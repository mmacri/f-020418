
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChartDataItem, PeriodType } from '../types';
import { calculateTotals } from '../utils';

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

  const processChartData = (events: any[], startDate: Date, endDate: Date): ChartDataItem[] => {
    const result: ChartDataItem[] = [];
    const dateMap: Record<string, { clicks: number, conversions: number, revenue: number }> = {};
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      dateMap[dateString] = { clicks: 0, conversions: 0, revenue: 0 };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    events.forEach(event => {
      if (!event.data) return;
      
      const date = new Date(event.created_at).toISOString().split('T')[0];
      if (dateMap[date]) {
        dateMap[date].clicks += 1;
        dateMap[date].conversions += 0.029;
        dateMap[date].revenue += 1.25;
      }
    });
    
    Object.entries(dateMap).forEach(([date, metrics]) => {
      result.push({
        date,
        clicks: metrics.clicks,
        conversions: parseFloat(metrics.conversions.toFixed(1)),
        revenue: parseFloat(metrics.revenue.toFixed(2))
      });
    });
    
    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const processSourceData = (events: any[]): {name: string; value: number}[] => {
    const sourceCounts: Record<string, number> = {};
    
    events.forEach(event => {
      if (!event.data) return;
      
      const source = event.data.source || 'unknown';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    
    return Object.entries(sourceCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  const processTopProducts = (events: any[]): any[] => {
    const productCounts: Record<string, {
      id: string;
      name: string;
      clicks: number;
      conversions: number;
      revenue: number;
    }> = {};
    
    events.forEach(event => {
      if (!event.data || !event.data.productId) return;
      
      const productId = String(event.data.productId);
      const productName = event.data.productName || 'Unknown Product';
      
      if (!productCounts[productId]) {
        productCounts[productId] = {
          id: productId,
          name: productName,
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      }
      
      productCounts[productId].clicks += 1;
      productCounts[productId].conversions += 0.029;
      productCounts[productId].revenue += 1.25;
    });
    
    return Object.values(productCounts)
      .map(product => ({
        ...product,
        conversions: parseFloat(product.conversions.toFixed(1)),
        revenue: parseFloat(product.revenue.toFixed(2))
      }))
      .sort((a, b) => b.clicks - a.clicks);
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
