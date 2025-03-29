
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminAuth from "@/components/admin/AdminAuth";
import HeroImageSettings from "@/components/admin/HeroImageSettings";
import ImageSettingsPanel from "@/components/admin/ImageSettingsPanel";
import { isAdmin } from "@/services/authService";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAdminUser = await isAdmin();
      setAuthenticated(isAdminUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Get current path to set active tab
  const currentPath = location.pathname.split("/").pop() || "dashboard";
  
  const handleTabChange = (value: string) => {
    navigate(`/admin/${value}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <Card className="p-8">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="mt-4">Loading admin panel...</p>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!authenticated) {
    return <AdminAuth onAuthSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-gray-500">Manage your website content and settings</p>
        </div>

        <Tabs value={currentPath} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="hero">Hero Image</TabsTrigger>
            <TabsTrigger value="image-settings">Image Settings</TabsTrigger>
          </TabsList>

          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/blog" element={<AdminBlog />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="/hero" element={<HeroImageSettings />} />
            <Route path="/image-settings" element={<ImageSettingsPanel />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;
