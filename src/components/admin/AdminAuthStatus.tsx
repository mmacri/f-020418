import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthentication } from '@/hooks/useAuthentication';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, LogOut, Settings, User } from 'lucide-react';

const AdminAuthStatus = () => {
  const { user, logout } = useAuthentication();
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const [sessionExpiry, setSessionExpiry] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthDetails = async () => {
      // Get current session
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        // Last login time (from session created_at)
        // Access with caution since the property might not be available
        const sessionCreatedAt = (data.session as any).created_at;
        if (sessionCreatedAt) {
          const loginDate = new Date(sessionCreatedAt);
          setLastLogin(loginDate.toLocaleString());
        }
        
        // Session expiry (if available)
        if (data.session.expires_at) {
          const expiryDate = new Date(data.session.expires_at * 1000);
          setSessionExpiry(expiryDate.toLocaleString());
        }
      }
    };

    fetchAuthDetails();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-500" />
          <span>Authentication Status</span>
        </CardTitle>
        <CardDescription>Current authentication information</CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col space-y-4">
        {user ? (
          <>
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar || ''} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">ROLE</p>
                <div className="mt-1 flex items-center">
                  <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">STATUS</p>
                <div className="mt-1 flex items-center">
                  <CheckCircle className="mr-1.5 h-4 w-4 text-green-500" />
                  <span className="text-sm">Authenticated</span>
                </div>
              </div>
            </div>
            
            {lastLogin && (
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">LAST LOGIN</p>
                <p className="mt-1 text-sm">{lastLogin}</p>
              </div>
            )}
            
            {sessionExpiry && (
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">SESSION EXPIRES</p>
                <p className="mt-1 text-sm">{sessionExpiry}</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center space-x-2 py-6">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <span>Not authenticated</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
          <Settings className="mr-2 h-4 w-4" />
          Profile Settings
        </Button>
        
        <Button variant="destructive" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminAuthStatus;
