
import React from 'react';
import StatCard from './StatCard';
import { DashboardTimeframe } from '../DashboardContext';

interface StatsGridProps {
  stats: {
    totalUsers: number;
    activeProducts: number;
    blogPosts: number;
    userGrowth: number;
    productGrowth: number;
    blogGrowth: number;
  };
  timeframe: DashboardTimeframe;
  isLoading: boolean;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, timeframe, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        growth={stats.userGrowth}
        timeframe={timeframe}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Active Products"
        value={stats.activeProducts}
        growth={stats.productGrowth}
        timeframe={timeframe}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Blog Posts"
        value={stats.blogPosts}
        growth={stats.blogGrowth}
        timeframe={timeframe}
        isLoading={isLoading}
        customLabel={`published this ${timeframe}`}
      />
    </div>
  );
};

export default StatsGrid;
