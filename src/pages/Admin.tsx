import React, { useState, useEffect } from 'react';
import { Navigate, useParams, useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthentication } from '@/hooks/useAuthentication';
import { 
  AdminDashboard, 
  AdminProducts, 
  AdminBlog, 
  AdminSettings, 
  AdminAuth,
  AdminCategoryContent,
  SubcategoryList
} from '@/components/admin';
import AdminCategories from '@/components/admin/AdminCategories';
import { publishScheduledPosts } from '@/services/blogService';
import { toast } from 'sonner';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const AdminPage = () => {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthentication();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState(tab || "dashboard");

  useEffect(() => {
    // Check for scheduled posts and publish them
    const checkScheduledPosts = async () => {
      try {
        const publishedCount = await publishScheduledPosts();
        if (publishedCount > 0) {
          toast.success(`${publishedCount} scheduled ${publishedCount === 1 ? 'post' : 'posts'} published`);
        }
      } catch (error) {
        console.error("Error checking scheduled posts:", error);
      }
    };

    // Check admin status via Supabase
    const checkAdminStatus = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if user has admin role in profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error("Error checking admin status:", error);
            setIsAdmin(false);
            return;
          }
          
          setIsAdmin(data?.role === 'admin');
          
          // Check for scheduled posts if user is admin
          if (data?.role === 'admin') {
            await checkScheduledPosts();
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error in admin check:", error);
        setIsAdmin(false);
      }
    };

    if (isAuthenticated) {
      checkAdminStatus();
    }
    
    // Set active tab from URL parameter
    if (tab) {
      setActiveTab(tab);
    }
  }, [isAuthenticated, tab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/${value}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleAuthSuccess = () => {
    console.log("Authentication successful");
    // Additional auth success handling logic
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" size="sm" asChild className="flex items-center gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            <span>Back to Main Site</span>
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <AdminDashboard />
        </TabsContent>
        <TabsContent value="products">
          <AdminProducts />
        </TabsContent>
        <TabsContent value="categories">
          <AdminCategories />
        </TabsContent>
        <TabsContent value="content">
          <AdminCategoryContent />
        </TabsContent>
        <TabsContent value="blog">
          <AdminBlog />
        </TabsContent>
        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
        <TabsContent value="auth">
          <AdminAuth onAuthSuccess={handleAuthSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
