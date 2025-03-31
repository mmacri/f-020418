import React from 'react';
import { useDashboard } from './DashboardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const GeneralStats: React.FC = () => {
  const { timeframe, setTimeframe } = useDashboard();

  const handleTimeframeChange = (newTimeframe: 'week' | 'month' | 'quarter' | 'year') => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">General Statistics</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {timeframe === 'week' ? 'Last Week' : 
               timeframe === 'month' ? 'Last Month' : 
               timeframe === 'quarter' ? 'Last Quarter' : 'Last Year'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleTimeframeChange('week')}>
              Last Week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTimeframeChange('month')}>
              Last Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTimeframeChange('quarter')}>
              Last Quarter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTimeframeChange('year')}>
              Last Year
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+12%</span> from last {timeframe}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+4</span> new products this {timeframe}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+3</span> published this {timeframe}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* More stats sections could be added here */}
    </div>
  );
};

export default GeneralStats;
