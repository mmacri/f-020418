
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { useAuthentication } from '@/hooks/useAuthentication';

/**
 * Hook to ensure that admin users have a social profile
 * This is needed because admins might exist in the admin profiles table
 * but not have a corresponding entry in the social user_profiles table
 */
export const useEnsureAdminProfile = () => {
  const { user, isAdmin } = useAuthentication();
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const checkAndCreateProfile = async () => {
      if (!user?.id || !isAdmin) return;
      
      try {
        setIsCreating(true);
        
        // Check if user already has a social profile
        const { data: existingProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        
        // If profile exists, we're done
        if (existingProfile) {
          setIsComplete(true);
          return;
        }
        
        // If error is not "no rows returned", there's another issue
        if (profileError && !profileError.message.includes('contains 0 rows')) {
          console.error('Error checking for existing profile:', profileError);
          return;
        }
        
        // Create a new profile for admin user
        const { error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            display_name: user.name || 'Admin',
            is_public: true,
            newsletter_subscribed: true,
            bio: 'Site Administrator'
          });
        
        if (createError) {
          console.error('Error creating admin profile:', createError);
          toast.error('Failed to create social profile for admin');
          return;
        }
        
        toast.success('Admin social profile created successfully');
        setIsComplete(true);
        
      } catch (error) {
        console.error('Error in admin profile creation:', error);
      } finally {
        setIsCreating(false);
      }
    };
    
    checkAndCreateProfile();
  }, [user, isAdmin]);
  
  return { isCreating, isComplete };
};
