
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { toast } from 'sonner';
import { MoreHorizontal, Shield, MessageCircle, UserPlus, UserX } from 'lucide-react';
import { UserProfile } from '@/types/social';

export default function AuthProfiles() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');

      if (error) throw error;
      
      // Cast data to UserProfile type
      const typedProfiles: UserProfile[] = data.map(profile => ({
        id: profile.id,
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        is_public: profile.is_public,
        newsletter_subscribed: profile.newsletter_subscribed,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }));
      
      setProfiles(typedProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async (userId: string) => {
    try {
      // Get post count
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id')
        .eq('user_id', userId);
        
      if (postsError) throw postsError;
      
      // Get friendship count
      const { data: friendshipsData, error: friendshipsError } = await supabase
        .from('friendships')
        .select('id')
        .or(`requestor_id.eq.${userId},recipient_id.eq.${userId}`)
        .eq('status', 'accepted');
        
      if (friendshipsError) throw friendshipsError;
      
      return {
        posts: postsData.length,
        friends: friendshipsData.length
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return { posts: 0, friends: 0 };
    }
  };

  const toggleProfileVisibility = async (profile: UserProfile) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_public: !profile.is_public })
        .eq('id', profile.id);
        
      if (error) throw error;
      
      setProfiles(prevProfiles => 
        prevProfiles.map(p => 
          p.id === profile.id ? { ...p, is_public: !p.is_public } : p
        )
      );
      
      toast.success(`Profile visibility ${!profile.is_public ? 'public' : 'private'}`);
    } catch (error) {
      console.error('Error toggling profile visibility:', error);
      toast.error('Failed to update profile');
    }
  };

  const toggleNewsletterSubscription = async (profile: UserProfile) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ newsletter_subscribed: !profile.newsletter_subscribed })
        .eq('id', profile.id);
        
      if (error) throw error;
      
      setProfiles(prevProfiles => 
        prevProfiles.map(p => 
          p.id === profile.id ? { ...p, newsletter_subscribed: !p.newsletter_subscribed } : p
        )
      );
      
      toast.success(`Newsletter subscription ${!profile.newsletter_subscribed ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling newsletter subscription:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profiles</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Public Profile</TableHead>
              <TableHead>Newsletter</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map(profile => (
              <ProfileRow 
                key={profile.id} 
                profile={profile} 
                toggleVisibility={toggleProfileVisibility}
                toggleNewsletter={toggleNewsletterSubscription}
                fetchStats={fetchUserStats}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface ProfileRowProps {
  profile: UserProfile;
  toggleVisibility: (profile: UserProfile) => Promise<void>;
  toggleNewsletter: (profile: UserProfile) => Promise<void>;
  fetchStats: (userId: string) => Promise<{posts: number, friends: number}>;
}

function ProfileRow({ profile, toggleVisibility, toggleNewsletter, fetchStats }: ProfileRowProps) {
  const [stats, setStats] = useState({ posts: 0, friends: 0 });
  const [loadingStats, setLoadingStats] = useState(false);
  
  useEffect(() => {
    const getStats = async () => {
      setLoadingStats(true);
      const userStats = await fetchStats(profile.id);
      setStats(userStats);
      setLoadingStats(false);
    };
    
    getStats();
  }, [profile.id, fetchStats]);
  
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.display_name} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=random`;
                }}
              />
            ) : (
              <span className="text-sm font-medium">
                {profile.display_name?.charAt(0).toUpperCase() || '?'}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium">{profile.display_name}</div>
            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
              {profile.bio || "No bio"}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        {loadingStats ? (
          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <div className="flex space-x-3 text-sm">
            <span className="flex items-center">
              <MessageCircle size={14} className="mr-1" /> {stats.posts}
            </span>
            <span className="flex items-center">
              <UserPlus size={14} className="mr-1" /> {stats.friends}
            </span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Switch 
          checked={profile.is_public}
          onCheckedChange={() => toggleVisibility(profile)}
        />
      </TableCell>
      <TableCell>
        <Switch 
          checked={profile.newsletter_subscribed}
          onCheckedChange={() => toggleNewsletter(profile)}
        />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => window.open(`/profile/${profile.id}`, '_blank')}>
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <UserX size={14} className="mr-2" /> Ban User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
