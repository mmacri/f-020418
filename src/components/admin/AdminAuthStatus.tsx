
import React, { useState, useEffect } from 'react';
import { useAuthentication } from '@/hooks/useAuthentication';
import { isAdmin, isAuthenticated } from '@/services/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck, ClipboardX, Database, Key, RefreshCw, ShieldCheck, User } from 'lucide-react';

const AdminAuthStatus = () => {
  const { user, isAuthenticated: authHookStatus } = useAuthentication();
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);

  const checkStatus = async () => {
    setLoading(true);
    try {
      // Check authentication status
      const isUserAuthenticated = await isAuthenticated();
      setAuthStatus(isUserAuthenticated);
      
      // Check admin status
      const isUserAdmin = await isAdmin();
      setAdminStatus(isUserAdmin);
      
      // Get Supabase user data
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setSupabaseUser(currentUser);
      
      // If user exists, get profile data
      if (currentUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile data:', error);
        } else {
          setProfileData(profile);
        }
      }
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="space-y-6">
      <Alert className={authHookStatus ? "border-green-500" : "border-orange-500"}>
        <User className={`h-4 w-4 ${authHookStatus ? "text-green-500" : "text-orange-500"}`} />
        <AlertTitle>Authentication Hook Status</AlertTitle>
        <AlertDescription>
          {authHookStatus 
            ? "You are authenticated according to the authentication hook." 
            : "You are not authenticated according to the authentication hook."}
        </AlertDescription>
      </Alert>
      
      <Alert className={authStatus ? "border-green-500" : "border-orange-500"}>
        <Key className={`h-4 w-4 ${authStatus ? "text-green-500" : "text-orange-500"}`} />
        <AlertTitle>Authentication Service Status</AlertTitle>
        <AlertDescription>
          {authStatus === null 
            ? "Checking authentication status..." 
            : authStatus 
              ? "You are authenticated according to the authentication service." 
              : "You are not authenticated according to the authentication service."}
        </AlertDescription>
      </Alert>
      
      <Alert className={adminStatus ? "border-green-500" : "border-red-500"}>
        <ShieldCheck className={`h-4 w-4 ${adminStatus ? "text-green-500" : "text-red-500"}`} />
        <AlertTitle>Admin Status</AlertTitle>
        <AlertDescription>
          {adminStatus === null 
            ? "Checking admin status..." 
            : adminStatus 
              ? "You have admin privileges." 
              : "You do not have admin privileges."}
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Supabase Data
          </CardTitle>
          <CardDescription>
            Current Supabase authentication and profile data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Supabase User:</h3>
            {supabaseUser ? (
              <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-40">
                {JSON.stringify(supabaseUser, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">No Supabase user data available</p>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Profile Data:</h3>
            {profileData ? (
              <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-40">
                {JSON.stringify(profileData, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">No profile data available</p>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Authentication Hook User:</h3>
            {user ? (
              <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-40">
                {JSON.stringify(user, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">No user data available from hook</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={checkStatus} 
            disabled={loading} 
            variant="outline" 
            className="w-full"
            size="sm"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking Status...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminAuthStatus;
