import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthentication } from '@/hooks/useAuthentication';
import { 
  AdminDashboard, 
  AdminProducts, 
  AdminBlog, 
  AdminSettings, 
  AdminAuth,
  AdminCategoryContent
} from '@/components/admin';
// Import directly from the file since it doesn't have a default export
// import AdminCategories from '@/components/admin/AdminCategories';

const AdminPage = () => {
  const { tab } = useParams<{ tab: string }>();
  const { isAuthenticated, isLoading } = useAuthentication();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simulate admin check (replace with actual logic)
    const checkAdminStatus = async () => {
      // In a real application, you would check the user's role or permissions
      // against a backend service.
      // For this example, we'll just set isAdmin to true after a short delay.
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsAdmin(true);
    };

    if (isAuthenticated) {
      checkAdminStatus();
    }
  }, [isAuthenticated]);

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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Admin Dashboard</h1>

      <Tabs defaultValue={tab || "dashboard"} className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
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
          <AdminCategoryContent />
        </TabsContent>
        <TabsContent value="blog">
          <AdminBlog />
        </TabsContent>
        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
        <TabsContent value="auth">
          <AdminAuth />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
