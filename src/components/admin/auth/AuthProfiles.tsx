
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  Search, 
  UserCircle,
  Users,
  UserCheck,
  UserX,
  MessageSquare,
  Eye,
  EyeOff,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean;
  newsletter_subscribed: boolean;
  created_at: string;
  updated_at: string;
  email?: string; // Joined from auth.users
  postsCount?: number;
  friendsCount?: number;
}

const AuthProfiles: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data } = await supabase.rpc('is_admin');
      setIsAdmin(!!data);
    };
    
    const loadProfiles = async () => {
      setIsLoading(true);
      
      try {
        // Fetch profiles with join to auth.users for email
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*, auth.users!inner(email)');
          
        if (error) {
          throw error;
        }
        
        // Format the data to match our interface
        const formattedProfiles = data.map((profile: any) => ({
          ...profile,
          email: profile.users?.email
        }));
        
        // Get post counts
        const postsPromises = formattedProfiles.map(async (profile: UserProfile) => {
          const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);
            
          return {
            ...profile,
            postsCount: count || 0
          };
        });
        
        // Get friendship counts
        const friendsPromises = formattedProfiles.map(async (profile: UserProfile) => {
          const { count } = await supabase
            .from('friendships')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'accepted')
            .or(`requestor_id.eq.${profile.id},recipient_id.eq.${profile.id}`);
            
          return {
            ...profile,
            friendsCount: count || 0
          };
        });
        
        // Combine all data
        const profilesWithCounts = await Promise.all(
          postsPromises.map(async (profilePromise, index) => {
            const profileWithPosts = await profilePromise;
            const profileWithFriends = await friendsPromises[index];
            
            return {
              ...profileWithPosts,
              friendsCount: profileWithFriends.friendsCount
            };
          })
        );
        
        setProfiles(profilesWithCounts);
      } catch (error) {
        console.error('Error loading profiles:', error);
        toast.error('Failed to load user profiles');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
    loadProfiles();
  }, []);
  
  const toggleProfileVisibility = async (profileId: string, isCurrentlyPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_public: !isCurrentlyPublic })
        .eq('id', profileId);
        
      if (error) throw error;
      
      // Update local state
      setProfiles(profiles.map(profile => 
        profile.id === profileId 
          ? { ...profile, is_public: !isCurrentlyPublic } 
          : profile
      ));
      
      toast.success(`Profile is now ${!isCurrentlyPublic ? 'public' : 'private'}`);
    } catch (error) {
      console.error('Error toggling profile visibility:', error);
      toast.error('Failed to update profile visibility');
    }
  };
  
  const toggleNewsletterSubscription = async (profileId: string, isCurrentlySubscribed: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ newsletter_subscribed: !isCurrentlySubscribed })
        .eq('id', profileId);
        
      if (error) throw error;
      
      // Update local state
      setProfiles(profiles.map(profile => 
        profile.id === profileId 
          ? { ...profile, newsletter_subscribed: !isCurrentlySubscribed } 
          : profile
      ));
      
      toast.success(`User ${!isCurrentlySubscribed ? 'subscribed to' : 'unsubscribed from'} newsletter`);
    } catch (error) {
      console.error('Error toggling newsletter subscription:', error);
      toast.error('Failed to update newsletter subscription');
    }
  };
  
  const deleteProfile = async (profileId: string) => {
    // This will cascade delete the user due to the FK constraint
    if (window.confirm('This will permanently delete the user account. Continue?')) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(profileId);
        
        if (error) throw error;
        
        // Update local state
        setProfiles(profiles.filter(profile => profile.id !== profileId));
        toast.success('User account deleted successfully');
      } catch (error) {
        console.error('Error deleting user account:', error);
        toast.error('Failed to delete user account');
      }
    }
  };
  
  // Filter profiles based on search query
  const filteredProfiles = profiles.filter(profile =>
    profile.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (profile.email && profile.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (profile.bio && profile.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You need administrator privileges to view and manage user profiles.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">User Profiles</CardTitle>
            <CardDescription>
              View and manage user profiles, posts, and newsletter subscriptions
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Mail className="h-4 w-4" />
              <span>Send Newsletter</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <UserCheck className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search profiles..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posts</TableHead>
                    <TableHead>Friends</TableHead>
                    <TableHead>Newsletter</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No profiles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name} />
                              <AvatarFallback>{profile.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{profile.display_name}</div>
                              <div className="text-xs text-muted-foreground">{profile.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={profile.is_public ? "default" : "outline"} className="gap-1 px-2">
                            {profile.is_public ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            <span>{profile.is_public ? "Public" : "Private"}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{profile.postsCount}</TableCell>
                        <TableCell>{profile.friendsCount}</TableCell>
                        <TableCell>
                          <Switch
                            checked={profile.newsletter_subscribed}
                            onCheckedChange={() => toggleNewsletterSubscription(profile.id, profile.newsletter_subscribed)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleProfileVisibility(profile.id, profile.is_public)}
                              title={profile.is_public ? "Make private" : "Make public"}
                            >
                              {profile.is_public ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View profile"
                              asChild
                            >
                              <a href={`/profile/${profile.id}`}>
                                <UserCircle className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View posts"
                              asChild
                            >
                              <a href={`/profile/${profile.id}/posts`}>
                                <MessageSquare className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete user"
                              onClick={() => deleteProfile(profile.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthProfiles;
