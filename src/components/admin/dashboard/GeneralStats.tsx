
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

const GeneralStats: React.FC = () => {
  const { timeframe, setTimeframe, isLoading, setIsLoading } = useDashboard();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProducts: 0,
    blogPosts: 0,
    userGrowth: 0,
    productGrowth: 0,
    blogGrowth: 0
  });

  useEffect(() => {
    fetchStats();
  }, [timeframe]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Determine time range
      const endDate = new Date();
      const startDate = new Date();
      let previousStartDate = new Date();
      
      if (timeframe === 'week') {
        startDate.setDate(endDate.getDate() - 7);
        previousStartDate.setDate(endDate.getDate() - 14);
      } else if (timeframe === 'month') {
        startDate.setDate(endDate.getDate() - 30);
        previousStartDate.setDate(endDate.getDate() - 60);
      } else if (timeframe === 'quarter') {
        startDate.setDate(endDate.getDate() - 90);
        previousStartDate.setDate(endDate.getDate() - 180);
      } else { // year
        startDate.setDate(endDate.getDate() - 365);
        previousStartDate.setDate(endDate.getDate() - 730);
      }
      
      // Fetch users
      const { data: currentUsers, error: usersError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact' })
        .gte('created_at', startDate.toISOString());
      
      const { data: previousUsers } = await supabase
        .from('profiles')
        .select('count', { count: 'exact' })
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', startDate.toISOString());
      
      // Fetch products
      const { data: currentProducts, error: productsError } = await supabase
        .from('products')
        .select('count', { count: 'exact' })
        .gte('created_at', startDate.toISOString());
      
      const { data: previousProducts } = await supabase
        .from('products')
        .select('count', { count: 'exact' })
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', startDate.toISOString());
      
      // Fetch blog posts
      const { data: currentBlogPosts, error: blogError } = await supabase
        .from('blog_posts')
        .select('count', { count: 'exact' })
        .eq('published', true)
        .gte('created_at', startDate.toISOString());
      
      const { data: previousBlogPosts } = await supabase
        .from('blog_posts')
        .select('count', { count: 'exact' })
        .eq('published', true)
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', startDate.toISOString());
      
      // Calculate growth percentages
      const userGrowth = calculateGrowth(
        currentUsers?.count || 0,
        previousUsers?.count || 0
      );
      
      const productGrowth = calculateGrowth(
        currentProducts?.count || 0,
        previousProducts?.count || 0
      );
      
      const blogGrowth = calculateGrowth(
        currentBlogPosts?.count || 0,
        previousBlogPosts?.count || 0
      );
      
      // Get total counts (all time)
      const { data: totalUsersData } = await supabase
        .from('profiles')
        .select('count', { count: 'exact' });
      
      const { data: totalProductsData } = await supabase
        .from('products')
        .select('count', { count: 'exact' });
      
      const { data: totalBlogPostsData } = await supabase
        .from('blog_posts')
        .select('count', { count: 'exact' })
        .eq('published', true);
      
      setStats({
        totalUsers: totalUsersData?.count || 0,
        activeProducts: totalProductsData?.count || 0,
        blogPosts: totalBlogPostsData?.count || 0,
        userGrowth,
        productGrowth,
        blogGrowth
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const handleTimeframeChange = (newTimeframe: 'week' | 'month' | 'quarter' | 'year') => {
    setTimeframe(newTimeframe);
  };

  const exportStats = () => {
    try {
      // Create CSV data
      const csvData = `Metric,Value,Growth (%)\nUsers,${stats.totalUsers},${stats.userGrowth}\nProducts,${stats.activeProducts},${stats.productGrowth}\nBlog Posts,${stats.blogPosts},${stats.blogGrowth}`;
      
      // Create and download file
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `general-stats-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`);
      
      toast.success('Statistics exported successfully');
    } catch (error) {
      console.error('Error exporting stats:', error);
      toast.error('Failed to export statistics');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">General Statistics</h2>
        <div className="flex items-center gap-2">
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
          <Button variant="outline" size="icon" onClick={exportStats}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={`${stats.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.userGrowth > 0 ? '+' : ''}{stats.userGrowth}%
                  </span> from last {timeframe}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={`${stats.productGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.productGrowth > 0 ? '+' : ''}{stats.productGrowth}%
                  </span> from last {timeframe}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.blogPosts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={`${stats.blogGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.blogGrowth > 0 ? '+' : ''}{stats.blogGrowth}%
                  </span> published this {timeframe}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralStats;
