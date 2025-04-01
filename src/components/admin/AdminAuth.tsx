
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminAuthStatus from './AdminAuthStatus';
import AuthPermissions from './auth/AuthPermissions';
import AuthUsers from './auth/AuthUsers';
import AuthSettings from './auth/AuthSettings';
import { useAuthentication } from '@/hooks/useAuthentication';
import { Badge } from '@/components/ui/badge';
import { Shield, KeyRound, Users, Settings } from 'lucide-react';

interface AdminAuthProps {
  onAuthSuccess?: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthSuccess }) => {
  const { isAuthenticated, isLoading, user } = useAuthentication();
  const [activeTab, setActiveTab] = useState<string>("status");

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              <AuthPermissions />
            </TabsContent>
            
            <TabsContent value="users">
              <AuthUsers />
            </TabsContent>
            
            <TabsContent value="settings">
              <AuthSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
