
import React from 'react';
import { useDashboard } from '../DashboardContext';
import StatsHeader from './StatsHeader';
import StatsGrid from './StatsGrid';
import { useGeneralStats } from './useGeneralStats';

const GeneralStats: React.FC = () => {
  const { timeframe, setTimeframe, isLoading, setIsLoading } = useDashboard();
  const { stats, exportStats, fetchStats } = useGeneralStats(timeframe, setIsLoading);

  const handleTimeframeChange = (newTimeframe: 'week' | 'month' | 'quarter' | 'year') => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="space-y-4">
      <StatsHeader 
        timeframe={timeframe} 
        handleTimeframeChange={handleTimeframeChange} 
        exportStats={exportStats}
      />
      
      <StatsGrid 
        stats={stats} 
        timeframe={timeframe} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default GeneralStats;
