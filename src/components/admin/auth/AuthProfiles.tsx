
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { socialSupabase as supabase } from "@/integrations/supabase/socialClient";
import { User, Eye, EyeOff, Mail, MailCheck } from "lucide-react";

const AuthProfiles = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      // Fetch all user profiles
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // For each profile, fetch additional data
      const profilesWithData = await Promise.all((data || []).map(async (profile) => {
        // Fetch post count
        const { count: postCount, error: postError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        if (postError) {
          console.error('Error fetching post count:', postError);
        }

        // Fetch friend count
        const { count: friendCount, error: friendError } = await supabase
          .from('friendships')
          .select('*', { count: 'exact', head: true })
          .or(`requestor_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
          .eq('status', 'accepted');

        if (friendError) {
          console.error('Error fetching friend count:', friendError);
        }

        return {
          ...profile,
          postCount: postCount || 0,
          friendCount: friendCount || 0
        };
      }));

      setProfiles(profilesWithData);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load user profiles",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProfileVisibility = async (profileId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_public: !currentValue })
        .eq('id', profileId);

      if (error) throw error;

      // Update local state
      setProfiles(prev => prev.map(profile => {
        if (profile.id === profileId) {
          return { ...profile, is_public: !currentValue };
        }
        return profile;
      }));

      toast({
        title: "Profile Updated",
        description: `Profile visibility set to ${!currentValue ? 'public' : 'private'}`,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile visibility",
        variant: "destructive"
      });
    }
  };

  const toggleNewsletter = async (profileId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ newsletter_subscribed: !currentValue })
        .eq('id', profileId);

      if (error) throw error;

      // Update local state
      setProfiles(prev => prev.map(profile => {
        if (profile.id === profileId) {
          return { ...profile, newsletter_subscribed: !currentValue };
        }
        return profile;
      }));

      toast({
        title: "Profile Updated",
        description: `Newsletter subscription ${!currentValue ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update newsletter subscription",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profiles</CardTitle>
        <CardDescription>
          Manage user profiles and their settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No user profiles found</p>
            ) : (
              profiles.map((profile) => (
                <div key={profile.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {profile.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt={profile.display_name} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://ext.same-assets.com/2651616194/3622592620.jpeg";
                            }} 
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{profile.display_name}</h3>
                        <div className="flex space-x-2 text-sm text-muted-foreground">
                          <span>{profile.postCount} posts</span>
                          <span>•</span>
                          <span>{profile.friendCount} friends</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Toggle
                        pressed={profile.is_public}
                        onPressedChange={() => toggleProfileVisibility(profile.id, profile.is_public)}
                        aria-label="Toggle profile visibility"
                        title={profile.is_public ? "Public Profile" : "Private Profile"}
                      >
                        {profile.is_public ? (
                          <Eye size={14} className="mr-1" />
                        ) : (
                          <EyeOff size={14} className="mr-1" />
                        )}
                        {profile.is_public ? "Public" : "Private"}
                      </Toggle>
                      <Toggle
                        pressed={profile.newsletter_subscribed}
                        onPressedChange={() => toggleNewsletter(profile.id, profile.newsletter_subscribed)}
                        aria-label="Toggle newsletter subscription"
                        title={profile.newsletter_subscribed ? "Newsletter Subscribed" : "Newsletter Unsubscribed"}
                      >
                        {profile.newsletter_subscribed ? (
                          <MailCheck size={14} className="mr-1" />
                        ) : (
                          <Mail size={14} className="mr-1" />
                        )}
                        {profile.newsletter_subscribed ? "Subscribed" : "Unsubscribed"}
                      </Toggle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedUser(expandedUser === profile.id ? null : profile.id)}
                      >
                        {expandedUser === profile.id ? "Hide Details" : "Show Details"}
                      </Button>
                    </div>
                  </div>
                  
                  {expandedUser === profile.id && (
                    <div className="mt-4 pl-16">
                      <Separator className="my-2" />
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Created</p>
                          <p className="text-sm">
                            {new Date(profile.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                          <p className="text-sm">
                            {new Date(profile.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Profile ID</p>
                          <p className="text-sm text-muted-foreground break-all">
                            {profile.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Bio</p>
                          <p className="text-sm text-muted-foreground">
                            {profile.bio || "No bio provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthProfiles;
