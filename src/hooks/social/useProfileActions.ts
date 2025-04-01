
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { UserProfile, Friendship } from '@/types/social';
import { useToast } from '@/hooks/use-toast';

export const useProfileActions = (profile: UserProfile | null, setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>) => {
  const { toast } = useToast();

  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to update your profile",
          variant: "destructive"
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', session.user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      const userProfile: UserProfile = {
        id: data.id,
        display_name: data.display_name,
        bio: data.bio,
        avatar_url: data.avatar_url,
        is_public: data.is_public,
        newsletter_subscribed: data.newsletter_subscribed,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setProfile(userProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      return userProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      return null;
    }
  };
  
  const deleteAccount = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to delete your account",
          variant: "destructive"
        });
        return false;
      }
      
      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        const { error } = await supabase.auth.admin.deleteUser(session.user.id);
        
        if (error) throw error;
        
        await supabase.auth.signOut();
        
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted"
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    updateProfile,
    deleteAccount
  };
};
