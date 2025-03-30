
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import AdminAuthStatus from './AdminAuthStatus';
import { useAuthentication } from '@/hooks/useAuthentication';

interface AdminAuthProps {
  onAuthSuccess?: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthSuccess }) => {
  const { isAuthenticated } = useAuthentication();

  // Call onAuthSuccess if provided and user is authenticated
  React.useEffect(() => {
    if (isAuthenticated && onAuthSuccess) {
      onAuthSuccess();
    }
  }, [isAuthenticated, onAuthSuccess]);

  return (
    <div className="space-y-6">
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <Tabs defaultValue="status" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="status">Authentication Status</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="status">
              <AdminAuthStatus />
            </TabsContent>
            
            <TabsContent value="permissions">
              <div className="py-10 text-center text-muted-foreground">
                <p>User permissions management coming soon.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="py-10 text-center text-muted-foreground">
                <p>Authentication settings coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
