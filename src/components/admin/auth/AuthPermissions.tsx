
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Info, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define the types of permissions
interface Permission {
  id: string;
  name: string;
  description: string;
  roles: Record<string, boolean>;
}

const defaultPermissions: Permission[] = [
  {
    id: 'manage_products',
    name: 'Manage Products',
    description: 'Create, update, and delete products',
    roles: { admin: true, editor: true, user: false }
  },
  {
    id: 'manage_categories',
    name: 'Manage Categories',
    description: 'Create, update, and delete categories',
    roles: { admin: true, editor: true, user: false }
  },
  {
    id: 'manage_blog',
    name: 'Manage Blog',
    description: 'Create, update, and delete blog posts',
    roles: { admin: true, editor: true, user: false }
  },
  {
    id: 'manage_users',
    name: 'Manage Users',
    description: 'View and manage user accounts',
    roles: { admin: true, editor: false, user: false }
  },
  {
    id: 'access_settings',
    name: 'Access Settings',
    description: 'View and modify system settings',
    roles: { admin: true, editor: false, user: false }
  },
  {
    id: 'manage_media',
    name: 'Manage Media',
    description: 'Upload and manage media files',
    roles: { admin: true, editor: true, user: false }
  }
];

const AuthPermissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>(defaultPermissions);
  const [isSaving, setIsSaving] = useState(false);

  const handleTogglePermission = (permissionId: string, role: string) => {
    setPermissions(prevPermissions => 
      prevPermissions.map(permission => 
        permission.id === permissionId
          ? { 
              ...permission, 
              roles: { 
                ...permission.roles, 
                [role]: !permission.roles[role] 
              } 
            }
          : permission
      )
    );
  };

  const handleSavePermissions = () => {
    setIsSaving(true);
    
    // Simulate API call to save permissions
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Permissions saved successfully");
      
      // In a real application, you would save the permissions to a database
      // For example:
      // savePermissionsToDatabase(permissions);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Permission Management</AlertTitle>
        <AlertDescription>
          Configure which roles have access to different parts of the application.
          Changes will apply to all users with the selected roles.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Role-Based Permissions</CardTitle>
          <CardDescription>
            Define which roles have access to which features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Permission</TableHead>
                <TableHead className="w-[350px]">Description</TableHead>
                <TableHead className="text-center">Admin</TableHead>
                <TableHead className="text-center">Editor</TableHead>
                <TableHead className="text-center">User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map(permission => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>{permission.description}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch
                        id={`${permission.id}-admin`}
                        checked={permission.roles.admin}
                        onCheckedChange={() => handleTogglePermission(permission.id, 'admin')}
                        disabled={permission.id === 'manage_users' || permission.id === 'access_settings'}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch
                        id={`${permission.id}-editor`}
                        checked={permission.roles.editor}
                        onCheckedChange={() => handleTogglePermission(permission.id, 'editor')}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch
                        id={`${permission.id}-user`}
                        checked={permission.roles.user}
                        onCheckedChange={() => handleTogglePermission(permission.id, 'user')}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 flex items-center gap-2">
            <Button 
              onClick={handleSavePermissions} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Permissions"}
            </Button>
            <p className="text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                Admin roles always have admin privileges
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPermissions;
