
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminAuthStatus from './AdminAuthStatus';
import { useAuthentication } from '@/hooks/useAuthentication';
import { Badge } from '@/components/ui/badge';
import { Shield, KeyRound, Users, Settings } from 'lucide-react';

interface AdminAuthProps {
  onAuthSuccess?: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthSuccess }) => {
  const { isAuthenticated, isLoading, user } = useAuthentication();

  // Call onAuthSuccess if provided and user is authenticated
  React.useEffect(() => {
    if (isAuthenticated && onAuthSuccess) {
      onAuthSuccess();
    }
  }, [isAuthenticated, onAuthSuccess]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Authentication Management</h2>
        {isAuthenticated && !isLoading && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            Authenticated as {user?.email}
          </Badge>
        )}
      </div>

      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <Tabs defaultValue="status" className="w-full">
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="status" className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                <span>Authentication Status</span>
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex items-center gap-1.5">
                <KeyRound className="h-4 w-4" />
                <span>Permissions</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1.5">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="status">
              <AdminAuthStatus />
            </TabsContent>
            
            <TabsContent value="permissions">
              <Card>
                <CardHeader>
                  <CardTitle>User Permissions</CardTitle>
                  <CardDescription>
                    Manage user roles and permissions across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-6">
                  <div className="text-center text-muted-foreground space-y-4">
                    <p>User permissions management coming soon.</p>
                    <p className="text-sm">Future functionality will include:</p>
                    <ul className="text-left text-sm list-disc list-inside space-y-1">
                      <li>Role-based access control</li>
                      <li>Custom permission groups</li>
                      <li>API access management</li>
                      <li>Activity logging & auditing</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage users registered on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-6">
                  <div className="text-center text-muted-foreground space-y-4">
                    <p>User management features coming soon.</p>
                    <p className="text-sm">Future functionality will include:</p>
                    <ul className="text-left text-sm list-disc list-inside space-y-1">
                      <li>User search and filtering</li>
                      <li>User creation and invitation</li>
                      <li>Account suspension and deletion</li>
                      <li>Bulk user operations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Settings</CardTitle>
                  <CardDescription>
                    Configure authentication methods and security policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-6">
                  <div className="text-center text-muted-foreground space-y-4">
                    <p>Authentication settings coming soon.</p>
                    <p className="text-sm">Future functionality will include:</p>
                    <ul className="text-left text-sm list-disc list-inside space-y-1">
                      <li>Social login configuration</li>
                      <li>Two-factor authentication settings</li>
                      <li>Password policies</li>
                      <li>Session timeout configuration</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
