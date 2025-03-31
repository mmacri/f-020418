
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { DashboardTimeframe } from '../DashboardContext';

interface CountResult {
  count: number;
}

interface StatsData {
  totalUsers: number;
  activeProducts: number;
  blogPosts: number;
  userGrowth: number;
  productGrowth: number;
  blogGrowth: number;
}

export const useGeneralStats = (
  timeframe: DashboardTimeframe, 
  setIsLoading: (loading: boolean) => void
) => {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    activeProducts: 0,
    blogPosts: 0,
    userGrowth: 0,
    productGrowth: 0,
    blogGrowth: 0
  });

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
      const { data: currentUsersData, error: usersError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact' });
      
      const { data: previousUsersData } = await supabase
        .from('profiles')
        .select('count', { count: 'exact' })
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', startDate.toISOString());
      
      // Fetch products
      const { data: currentProductsData, error: productsError } = await supabase
        .from('products')
        .select('count', { count: 'exact' });
      
      const { data: previousProductsData } = await supabase
        .from('products')
        .select('count', { count: 'exact' })
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', startDate.toISOString());
      
      // Fetch blog posts
      const { data: currentBlogPostsData, error: blogError } = await supabase
        .from('blog_posts')
        .select('count', { count: 'exact' })
        .eq('published', true)
        .gte('created_at', startDate.toISOString());
      
      const { data: previousBlogPostsData } = await supabase
        .from('blog_posts')
        .select('count', { count: 'exact' })
        .eq('published', true)
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', startDate.toISOString());
      
      // Parse count results safely
      const currentUsers = currentUsersData ? (currentUsersData as unknown as CountResult).count : 0;
      const previousUsers = previousUsersData ? (previousUsersData as unknown as CountResult).count : 0;
      const currentProducts = currentProductsData ? (currentProductsData as unknown as CountResult).count : 0;
      const previousProducts = previousProductsData ? (previousProductsData as unknown as CountResult).count : 0;
      const currentBlogPosts = currentBlogPostsData ? (currentBlogPostsData as unknown as CountResult).count : 0;
      const previousBlogPosts = previousBlogPostsData ? (previousBlogPostsData as unknown as CountResult).count : 0;
      
      // Calculate growth percentages
      const userGrowth = calculateGrowth(currentUsers, previousUsers);
      const productGrowth = calculateGrowth(currentProducts, previousProducts);
      const blogGrowth = calculateGrowth(currentBlogPosts, previousBlogPosts);
      
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
      
      const totalUsers = totalUsersData ? (totalUsersData as unknown as CountResult).count : 0;
      const totalProducts = totalProductsData ? (totalProductsData as unknown as CountResult).count : 0;
      const totalBlogPosts = totalBlogPostsData ? (totalBlogPostsData as unknown as CountResult).count : 0;
      
      setStats({
        totalUsers,
        activeProducts: totalProducts,
        blogPosts: totalBlogPosts,
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

  useEffect(() => {
    fetchStats();
  }, [timeframe]);

  return {
    stats,
    exportStats,
    fetchStats
  };
};
