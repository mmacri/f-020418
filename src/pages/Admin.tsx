
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
import SubcategoryManager from '@/components/admin/SubcategoryManager';
import { publishScheduledPosts } from '@/services/blog';
import { toast } from 'sonner';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminPage = () => {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user, isAdmin } = useAuthentication();
  const [activeTab, setActiveTab] = useState(tab || "dashboard");
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  useEffect(() => {
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

    // Check scheduled posts when page loads if user is authenticated
    if (isAuthenticated && isAdmin && !isLoading) {
      checkScheduledPosts();
    }
    
    if (tab) {
      setActiveTab(tab);
    }
  }, [isAuthenticated, isLoading, tab, user, isAdmin]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/${value}`);
  };

  console.log("Admin page state:", { isLoading, checkingAdmin, isAuthenticated, isAdmin, user });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    console.log("Not admin, showing unauthorized message");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAuthSuccess = () => {
    console.log("Authentication successful");
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
          <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
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
        <TabsContent value="subcategories">
          <SubcategoryManager />
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
