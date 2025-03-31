
import React, { useState, useEffect } from 'react';
import { useAuthentication } from '@/hooks/useAuthentication';
import { isAdmin, isAuthenticated } from '@/services/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ClipboardCheck, 
  ClipboardX, 
  Database, 
  Key, 
  RefreshCw, 
  ShieldCheck, 
  User, 
  AlertTriangle,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminAuthStatus = () => {
  const { user, isAuthenticated: authHookStatus } = useAuthentication();
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

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
          toast.error('Failed to fetch profile data');
        } else {
          setProfileData(profile);
        }
      }

      toast.success('Authentication status refreshed');
    } catch (error) {
      console.error('Error checking status:', error);
      toast.error('Failed to check authentication status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(message);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">User Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert className={authHookStatus ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-orange-500 bg-orange-50 dark:bg-orange-950/20"}>
              <div className="flex items-start">
                {authHookStatus ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                )}
                <div className="ml-3">
                  <AlertTitle>Authentication Hook Status</AlertTitle>
                  <AlertDescription>
                    {authHookStatus 
                      ? "You are authenticated according to the authentication hook." 
                      : "You are not authenticated according to the authentication hook."}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
            
            <Alert className={authStatus ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-orange-500 bg-orange-50 dark:bg-orange-950/20"}>
              <div className="flex items-start">
                {authStatus ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                )}
                <div className="ml-3">
                  <AlertTitle>Authentication Service Status</AlertTitle>
                  <AlertDescription>
                    {authStatus === null 
                      ? "Checking authentication status..." 
                      : authStatus 
                        ? "You are authenticated according to the authentication service." 
                        : "You are not authenticated according to the authentication service."}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </div>
          
          <Alert className={adminStatus ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-red-500 bg-red-50 dark:bg-red-950/20"}>
            <div className="flex items-start">
              {adminStatus ? (
                <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <ClipboardX className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div className="ml-3">
                <AlertTitle>Admin Status</AlertTitle>
                <AlertDescription>
                  {adminStatus === null 
                    ? "Checking admin status..." 
                    : adminStatus 
                      ? "You have admin privileges." 
                      : "You do not have admin privileges."}
                </AlertDescription>
              </div>
            </div>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Authentication Summary
              </CardTitle>
              <CardDescription>
                Current user authentication status and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <h3 className="text-sm font-medium mb-2">User Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Email:</span> {user?.email || "Not authenticated"}</p>
                    <p><span className="text-muted-foreground">Name:</span> {user?.name || "Not set"}</p>
                    <p><span className="text-muted-foreground">Role:</span> {user?.role || "None"}</p>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <h3 className="text-sm font-medium mb-2">Session Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">User ID:</span> {user?.id || "Not available"}</p>
                    <p><span className="text-muted-foreground">Status:</span> {authHookStatus ? "Active" : "Inactive"}</p>
                    <p><span className="text-muted-foreground">Admin:</span> {adminStatus ? "Yes" : "No"}</p>
                  </div>
                </div>
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
                    Refreshing Status...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Authentication Status
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" /> Supabase Authentication Data
              </CardTitle>
              <CardDescription>
                Detailed Supabase authentication and profile data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center justify-between">
                    <span>Supabase User:</span>
                    {supabaseUser && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs" 
                        onClick={() => copyToClipboard(JSON.stringify(supabaseUser, null, 2), 'User data copied to clipboard')}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    )}
                  </h3>
                  {supabaseUser ? (
                    <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                      {JSON.stringify(supabaseUser, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">No Supabase user data available</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center justify-between">
                    <span>Profile Data:</span>
                    {profileData && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs" 
                        onClick={() => copyToClipboard(JSON.stringify(profileData, null, 2), 'Profile data copied to clipboard')}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    )}
                  </h3>
                  {profileData ? (
                    <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                      {JSON.stringify(profileData, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">No profile data available</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center justify-between">
                    <span>Authentication Hook User:</span>
                    {user && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs" 
                        onClick={() => copyToClipboard(JSON.stringify(user, null, 2), 'Hook user data copied to clipboard')}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    )}
                  </h3>
                  {user ? (
                    <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                      {JSON.stringify(user, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">No user data available from hook</p>
                  )}
                </div>
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
                    Refreshing Data...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Authentication Data
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAuthStatus;
