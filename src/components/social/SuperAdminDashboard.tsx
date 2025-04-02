
import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MessageSquare, Users, Settings, Shield } from "lucide-react";
import { AdminSocialFeed } from "./AdminSocialFeed";

export const SuperAdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Routes>
        <Route path="/" element={<SuperAdminHome />} />
        <Route path="/social-feed" element={<AdminSocialFeed />} />
      </Routes>
    </div>
  );
};

const SuperAdminHome: React.FC = () => {
  return (
    <Card className="mb-8">
      <CardHeader className="bg-primary/10">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <CardTitle>Super Admin Dashboard</CardTitle>
            <CardDescription>
              This account is designated as the super administrator without a social profile
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Super Administrator Account</AlertTitle>
          <AlertDescription>
            This is the main administrative account for Recovery Essentials. As the super admin, 
            you can manage all social profiles and content but don't have your own social profile.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <Link to="/admin" className="no-underline">
            <Card className="hover:bg-accent/10 transition-colors cursor-pointer h-full">
              <CardHeader>
                <Settings className="h-5 w-5 mb-2 text-primary" />
                <CardTitle className="text-lg">Admin Dashboard</CardTitle>
                <CardDescription>Manage site settings and content</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link to="/admin/auth" className="no-underline">
            <Card className="hover:bg-accent/10 transition-colors cursor-pointer h-full">
              <CardHeader>
                <Users className="h-5 w-5 mb-2 text-primary" />
                <CardTitle className="text-lg">User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link to="/social-feed" className="no-underline">
            <Card className="hover:bg-accent/10 transition-colors cursor-pointer h-full">
              <CardHeader>
                <MessageSquare className="h-5 w-5 mb-2 text-primary" />
                <CardTitle className="text-lg">Social Feed</CardTitle>
                <CardDescription>View and moderate social content</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
