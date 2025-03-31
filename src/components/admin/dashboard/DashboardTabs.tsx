
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, BarChart, TrendingUp } from 'lucide-react';
import AffiliateDashboard from '../AffiliateDashboard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import GeneralStats from './GeneralStats';

const DashboardTabs: React.FC = () => {
  const [timeframe, setTimeframe] = React.useState<'week' | 'month' | 'quarter'>('week');

  return (
    <Tabs defaultValue="affiliate">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="affiliate" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span>Affiliate Performance</span>
        </TabsTrigger>
        <TabsTrigger value="traffic" className="flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          <span>Traffic Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <span>General Stats</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="affiliate" className="pt-6">
        <AffiliateDashboard />
      </TabsContent>
      
      <TabsContent value="traffic" className="pt-6">
        <AnalyticsDashboard />
      </TabsContent>
      
      <TabsContent value="general" className="pt-6">
        <GeneralStats timeframe={timeframe} setTimeframe={setTimeframe} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
