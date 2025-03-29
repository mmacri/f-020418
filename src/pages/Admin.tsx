
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AdminAuth, AdminProducts, AdminBlog, AdminCategories, AdminCategoryContent, AdminDashboard, AdminSettings } from "@/components/admin";
import HeroImageSettings from "@/components/admin/HeroImageSettings";
import { isAdmin, isAuthenticated } from "@/services/authService";

const Admin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    if (isAuthenticated() && isAdmin()) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      // Redirect non-admin users to home page
      toast({
        title: "Access denied",
        description: "You need administrator privileges to access this page",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthorized(true);
    toast({
      title: "Login successful",
      description: "Welcome to the admin dashboard",
    });
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <AdminAuth onAuthSuccess={handleAuthSuccess} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={() => {
              navigate("/");
            }}
          >
            View Website
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-7 w-full mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="content">Category Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="products">
            <AdminProducts />
          </TabsContent>
          
          <TabsContent value="blog">
            <AdminBlog />
          </TabsContent>
          
          <TabsContent value="categories">
            <AdminCategories />
          </TabsContent>
          
          <TabsContent value="content">
            <AdminCategoryContent />
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-6">
              <AdminSettings />
              <HeroImageSettings />
            </div>
          </TabsContent>
          
          <TabsContent value="help">
            <Card>
              <CardHeader>
                <CardTitle>Admin Help Documentation</CardTitle>
                <CardDescription>
                  Learn how to manage your affiliate marketing website efficiently.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Getting Started</h3>
                  <p className="text-gray-500">
                    This admin dashboard allows you to manage all aspects of your Recovery Essentials website.
                    Use the tabs above to navigate between different sections.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Product Management</h3>
                  <p className="text-gray-500">
                    Add, edit, and delete products with their Amazon affiliate links.
                    Make sure to include high-quality images and detailed descriptions.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Blog Management</h3>
                  <p className="text-gray-500">
                    Create and manage blog posts to drive traffic and improve SEO.
                    You can use the rich text editor to format your content.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">User Management</h3>
                  <p className="text-gray-500">
                    Update your profile details and password in the Settings tab.
                    Admins can manage user accounts and permissions.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Data Storage</h3>
                  <p className="text-gray-500">
                    Currently, all data is stored in your browser's localStorage.
                    Use the export functionality in Settings to back up your data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
