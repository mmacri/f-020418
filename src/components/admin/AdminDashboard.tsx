
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AffiliateDashboard from './AffiliateDashboard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart, Users, TrendingUp, TrendingDown, Zap, Download, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AdminDashboard = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('week');
  const [isClearStatsDialogOpen, setIsClearStatsDialogOpen] = useState(false);
  const [clearPeriod, setClearPeriod] = useState<'current' | 'all'>('current');
  const [generalStats, setGeneralStats] = useState({
    totalUsers: 1283,
    activeUsers: 724,
    averageSessionTime: '3m 42s',
    bounceRate: '32%',
    growthRate: '+12.4%'
  });
  
  useEffect(() => {
    const fetchGeneralStats = async () => {
      try {
        let stats;
        if (timeframe === 'week') {
          stats = {
            totalUsers: 1283,
            activeUsers: 724,
            averageSessionTime: '3m 42s',
            bounceRate: '32%',
            growthRate: '+12.4%'
          };
        } else if (timeframe === 'month') {
          stats = {
            totalUsers: 5429,
            activeUsers: 3218,
            averageSessionTime: '4m 12s',
            bounceRate: '28%',
            growthRate: '+8.7%'
          };
        } else {
          stats = {
            totalUsers: 15872,
            activeUsers: 9426,
            averageSessionTime: '4m 51s',
            bounceRate: '26%',
            growthRate: '+15.2%'
          };
        }
        setGeneralStats(stats);
      } catch (error) {
        console.error('Error fetching general stats:', error);
      }
    };
    
    fetchGeneralStats();
  }, [timeframe]);
  
  const handleClearStats = (period: 'current' | 'all') => {
    setClearPeriod(period);
    setIsClearStatsDialogOpen(true);
  };
  
  const confirmClearStats = async () => {
    try {
      if (clearPeriod === 'all') {
        const { error } = await supabase
          .from('page_views')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (error) {
          throw error;
        }
      } else {
        const now = new Date();
        let startDate: Date;
        
        if (timeframe === 'week') {
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
        } else if (timeframe === 'month') {
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
        } else {
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 3);
        }
        
        const { error } = await supabase
          .from('page_views')
          .delete()
          .gte('created_at', startDate.toISOString());
        
        if (error) {
          throw error;
        }
      }
      
      setGeneralStats({
        totalUsers: clearPeriod === 'all' ? 0 : generalStats.totalUsers / 2,
        activeUsers: clearPeriod === 'all' ? 0 : generalStats.activeUsers / 2,
        averageSessionTime: clearPeriod === 'all' ? '0m 0s' : generalStats.averageSessionTime,
        bounceRate: clearPeriod === 'all' ? '0%' : generalStats.bounceRate,
        growthRate: clearPeriod === 'all' ? '0%' : '0%'
      });
      
      toast({
        description: clearPeriod === 'all' 
          ? 'All general statistics have been cleared.' 
          : `Statistics for the ${timeframe === 'week' ? 'last week' : timeframe === 'month' ? 'last month' : 'last quarter'} have been cleared.`,
      });
    } catch (error) {
      console.error('Error clearing stats:', error);
      toast({
        description: 'Failed to clear statistics. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsClearStatsDialogOpen(false);
    }
  };
  
  const handleExportStats = (exportPeriod?: 'week' | 'month' | 'quarter' | 'all') => {
    try {
      const periodToExport = exportPeriod || timeframe;
      let periodName: string;
      
      switch (periodToExport) {
        case 'week':
          periodName = 'Last Week';
          break;
        case 'month':
          periodName = 'Last Month';
          break;
        case 'quarter':
          periodName = 'Last Quarter';
          break;
        default:
          periodName = 'All Time';
      }
      
      const csvData = [
        [`General Statistics Export (${periodName})`],
        ['Metric', 'Value'],
        ['Total Users', generalStats.totalUsers.toString()],
        ['Active Users', generalStats.activeUsers.toString()],
        ['Average Session Time', generalStats.averageSessionTime],
        ['Bounce Rate', generalStats.bounceRate],
        ['Growth Rate', generalStats.growthRate],
        ['', ''],
        ['Export Date', new Date().toISOString()],
      ]
      .map(row => row.join(','))
      .join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `general-stats-${periodToExport}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        description: `General statistics for ${periodName.toLowerCase()} have been exported successfully.`,
      });
    } catch (error) {
      console.error('Error exporting general stats:', error);
      toast({
        description: 'There was a problem exporting your data.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <AlertDialog open={isClearStatsDialogOpen} onOpenChange={setIsClearStatsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Statistics Data</AlertDialogTitle>
            <AlertDialogDescription>
              {clearPeriod === 'all' ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-500 inline-block mr-2" />
                  This will permanently delete <span className="font-bold">all</span> general statistics data. This action cannot be undone.
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-500 inline-block mr-2" />
                  This will clear general statistics for the {timeframe === 'week' ? 'last week' : timeframe === 'month' ? 'last month' : 'last quarter'}. This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearStats} className="bg-red-600 hover:bg-red-700">
              Yes, Clear Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button 
                  variant={timeframe === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTimeframe('week')}
                >
                  Last Week
                </Button>
                <Button 
                  variant={timeframe === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTimeframe('month')}
                >
                  Last Month
                </Button>
                <Button 
                  variant={timeframe === 'quarter' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTimeframe('quarter')}
                >
                  Last Quarter
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      Export Stats
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-48">
                    <div className="flex flex-col space-y-1">
                      <Button variant="ghost" size="sm" onClick={() => handleExportStats('week')} className="justify-start">
                        Last Week
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleExportStats('month')} className="justify-start">
                        Last Month
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleExportStats('quarter')} className="justify-start">
                        Last Quarter
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleExportStats('all')} className="justify-start">
                        All Time
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 flex items-center gap-1">
                      <Trash2 className="h-4 w-4" />
                      Clear Stats
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-48">
                    <div className="flex flex-col space-y-1">
                      <Button variant="ghost" size="sm" onClick={() => handleClearStats('current')} className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
                        Current Period
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleClearStats('all')} className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
                        All Stats
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="h-5 w-5 text-blue-500" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{generalStats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">{generalStats.growthRate}</span> from last {timeframe}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{generalStats.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+8.1%</span> from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Avg. Session Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{generalStats.averageSessionTime}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+12s</span> from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    Bounce Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{generalStats.bounceRate}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-500 font-medium">+2.1%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-3 md:col-span-2">
                <CardHeader>
                  <CardTitle>Traffic Overview</CardTitle>
                  <CardDescription>Website visitor statistics</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="flex items-center justify-center h-full bg-slate-50 rounded-md">
                    <p className="text-muted-foreground">Detailed traffic graphs coming soon</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-3 md:col-span-1">
                <CardHeader>
                  <CardTitle>Top Countries</CardTitle>
                  <CardDescription>User distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>United States</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '42%'}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>United Kingdom</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '18%'}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Canada</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '15%'}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Australia</span>
                      <span className="font-medium">9%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '9%'}}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Other</span>
                      <span className="font-medium">16%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '16%'}}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
