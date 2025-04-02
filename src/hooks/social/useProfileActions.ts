
import { useState } from 'react';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { UserProfile } from '@/types/social';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/file-upload';

export const useProfileActions = (
  profile: UserProfile | null,
  refetchProfile: () => void
) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const updateProfile = async (updates: Partial<UserProfile>, avatarFile?: File): Promise<UserProfile | null> => {
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
      
      let avatarUrl = updates.avatar_url;
      if (avatarFile) {
        setIsUploading(true);
        toast({
          title: "Uploading avatar",
          description: "Please wait while we upload your profile picture"
        });
        
        const { url, error: uploadError } = await uploadFile(avatarFile, {
          bucket: 'social-images',
          folder: 'avatars',
          fileTypes: ['jpg', 'jpeg', 'png', 'webp'],
          maxSize: 2 * 1024 * 1024 // 2MB
        });
        
        setIsUploading(false);
        
        if (uploadError) {
          toast({
            title: "Error",
            description: uploadError,
            variant: "destructive"
          });
          return null;
        }
        
        avatarUrl = url;
      }
      
      const profileUpdates = {
        ...updates,
        ...(avatarUrl && { avatar_url: avatarUrl })
      };
      
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      let data;
      let error;
      
      if (!existingProfile) {
        const newProfile = {
          id: session.user.id,
          display_name: updates.display_name || session.user.email?.split('@')[0] || 'User',
          bio: updates.bio || null,
          avatar_url: avatarUrl || null,
          is_public: updates.is_public !== undefined ? updates.is_public : false,
          newsletter_subscribed: updates.newsletter_subscribed !== undefined ? updates.newsletter_subscribed : true
        };
        
        ({ data, error } = await supabase
          .from('user_profiles')
          .insert(newProfile)
          .select()
          .single());
      } else {
        ({ data, error } = await supabase
          .from('user_profiles')
          .update(profileUpdates)
          .eq('id', session.user.id)
          .select()
          .single());
      }
        
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
      
      // Call the refetchProfile function instead of directly setting the profile
      refetchProfile();
      
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
    deleteAccount,
    isUploading
  };
};
