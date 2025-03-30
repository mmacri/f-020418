
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AffiliateDashboard from './AffiliateDashboard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart, Users, TrendingUp, TrendingDown, Zap } from 'lucide-react';

const AdminDashboard = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('week');
  
  // These would normally be fetched from an API
  const generalStats = {
    totalUsers: 1283,
    activeUsers: 724,
    averageSessionTime: '3m 42s',
    bounceRate: '32%',
    growthRate: '+12.4%'
  };
  
  return (
    <div className="space-y-6">
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
                    <span className="text-green-500 font-medium">{generalStats.growthRate}</span> from last month
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
