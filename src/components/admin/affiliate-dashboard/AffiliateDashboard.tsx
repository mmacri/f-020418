
import React, { useState, useEffect } from 'react';
import AffiliateStats from './AffiliateStats';
import DashboardHeader from './DashboardHeader';
import DashboardTabs from './DashboardTabs';
import { ChartDataItem, PeriodType } from './types';
import { supabase } from '@/integrations/supabase/client';
import { calculateTotals, formatCurrency } from './utils';
import { toast } from 'sonner';
import { exportAnalyticsData } from './utils/exportUtils';
import { saveAs } from 'file-saver';

const AffiliateDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [sourceData, setSourceData] = useState<{name: string; value: number}[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [totals, setTotals] = useState<{
    clicks: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  }>({ clicks: 0, conversions: 0, revenue: 0, conversionRate: 0 });
  const [chartView, setChartView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [clearPeriod, setClearPeriod] = useState<'current' | 'all'>('current');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<PeriodType>('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRealData();
  }, [timeframe]);

  const fetchRealData = async () => {
    setIsLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      if (timeframe === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (timeframe === 'month') {
        startDate.setDate(endDate.getDate() - 30);
      } else {
        startDate.setDate(endDate.getDate() - 90);
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
        setIsLoading(false);
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
      console.error('Error in fetchRealData:', error);
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

  const handleClearData = async (type: 'current' | 'all') => {
    setClearPeriod(type);
    setIsAlertOpen(true);
  };

  const handleConfirmClear = async () => {
    try {
      setIsLoading(true);
      
      let startDate: Date | undefined;
      const endDate = new Date();
      
      if (clearPeriod === 'current') {
        startDate = new Date();
        if (timeframe === 'week') {
          startDate.setDate(endDate.getDate() - 7);
        } else if (timeframe === 'month') {
          startDate.setDate(endDate.getDate() - 30);
        } else {
          startDate = undefined;
        }
      }
      
      let query = supabase
        .from('analytics_events')
        .delete()
        .eq('event_type', 'affiliate_click');
      
      if (startDate && clearPeriod === 'current') {
        query = query
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());
      }
      
      const { error } = await query;
      
      if (error) {
        console.error('Error clearing analytics data:', error);
        toast.error('Failed to clear analytics data');
      } else {
        toast.success(`${clearPeriod === 'all' ? 'All' : 'Current period'} analytics data cleared successfully`);
        fetchRealData();
      }
    } catch (error) {
      console.error('Error in handleConfirmClear:', error);
      toast.error('Error clearing analytics data');
    } finally {
      setIsAlertOpen(false);
      setIsLoading(false);
    }
  };

  const handleExportData = (period?: PeriodType | 'custom' | 'all') => {
    try {
      const exportPeriod = period || currentPeriod;
      const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
      const filename = `affiliate-data-${exportPeriod}-${timestamp}.csv`;
      
      const csvData = exportAnalyticsData(chartData, sourceData, topProducts);
      
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, filename);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    setIsCustomDateRange(true);
    
    if (range.from && range.to) {
      fetchCustomDateRangeData(range.from, range.to);
    }
  };

  const fetchCustomDateRangeData = async (from: Date, to: Date) => {
    setIsLoading(true);
    try {
      const endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);
      
      const { data: eventsData, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_type', 'affiliate_click')
        .gte('created_at', from.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) {
        console.error('Error fetching analytics data for custom range:', error);
        toast.error('Failed to fetch analytics data');
        return;
      }

      const processedChartData = processChartData(eventsData || [], from, endDate);
      const processedSourceData = processSourceData(eventsData || []);
      const processedTopProducts = processTopProducts(eventsData || []);
      
      setChartData(processedChartData);
      setSourceData(processedSourceData);
      setTopProducts(processedTopProducts);
      
      const calculatedTotals = calculateTotals(processedChartData);
      setTotals(calculatedTotals);
    } catch (error) {
      console.error('Error in fetchCustomDateRangeData:', error);
      toast.error('Error loading custom date range data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (period: PeriodType) => {
    setCurrentPeriod(period);
    setIsCustomDateRange(false);
    
    let newTimeframe: 'week' | 'month' | 'all';
    
    switch (period) {
      case '7d':
        newTimeframe = 'week';
        break;
      case '30d':
        newTimeframe = 'month';
        break;
      case '90d':
      case 'all':
        newTimeframe = 'all';
        break;
      default:
        newTimeframe = 'week';
    }
    
    setTimeframe(newTimeframe);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        currentPeriod={currentPeriod}
        dateRange={dateRange}
        isCustomDateRange={isCustomDateRange}
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        clearPeriod={clearPeriod}
        onDateRangeChange={handleDateRangeChange}
        onPeriodChange={handlePeriodChange}
        onExportData={handleExportData}
        onClearData={handleClearData}
        onConfirmClear={handleConfirmClear}
      />

      <AffiliateStats 
        analyticsData={{
          totalClicks: totals.clicks,
          uniqueProducts: topProducts.length,
          estimatedConversions: totals.conversions,
          estimatedRevenue: totals.revenue,
          conversionRate: totals.conversionRate,
          topProducts: topProducts.map(p => ({
            productId: p.id.toString(),
            productName: p.name,
            count: p.clicks,
            estimatedConversions: p.conversions
          })),
          clicksByDay: {},
          clicksBySource: {}
        }}
        calculateGrowth={(metric) => {
          return Math.floor(Math.random() * 10) - 3;
        }}
        formatCurrency={formatCurrency}
      />
      
      <DashboardTabs 
        chartData={chartData}
        sourceData={sourceData}
        topProducts={topProducts}
        totals={totals}
        chartView={chartView}
        setChartView={setChartView}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AffiliateDashboard;
