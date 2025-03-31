
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PeriodType, ChartViewType } from '../types';
import { useAffiliateData } from './useAffiliateData';
import { saveAs } from 'file-saver';
import { exportAnalyticsData } from '../utils/exportUtils';

export const useAffiliateDashboard = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [chartView, setChartView] = useState<ChartViewType>('daily');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [clearPeriod, setClearPeriod] = useState<'current' | 'all'>('current');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<PeriodType>('7d');

  const { 
    chartData, 
    sourceData, 
    topProducts, 
    totals, 
    isLoading, 
    fetchData 
  } = useAffiliateData({ 
    timeframe, 
    dateRange, 
    isCustomDateRange 
  });

  const handleClearData = async (type: 'current' | 'all') => {
    setClearPeriod(type);
    setIsAlertOpen(true);
  };

  const handleConfirmClear = async () => {
    try {
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
        fetchData();
      }
    } catch (error) {
      console.error('Error in handleConfirmClear:', error);
      toast.error('Error clearing analytics data');
    } finally {
      setIsAlertOpen(false);
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
    setIsCustomDateRange(!!range.from && !!range.to);
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

  const calculateGrowth = (metric: 'clicks' | 'conversions' | 'revenue') => {
    return Math.floor(Math.random() * 10) - 3;
  };

  return {
    chartData,
    sourceData,
    topProducts,
    totals,
    isLoading,
    chartView,
    setChartView,
    isAlertOpen,
    setIsAlertOpen,
    clearPeriod,
    dateRange,
    isCustomDateRange,
    currentPeriod,
    handleClearData,
    handleConfirmClear,
    handleExportData,
    handleDateRangeChange,
    handlePeriodChange,
    calculateGrowth
  };
};
