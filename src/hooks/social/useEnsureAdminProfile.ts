
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAndCreateProfile = async () => {
      if (!user?.id || !isAdmin) return;
      
      try {
        setIsCreating(true);
        setError(null);
        
        // Convert user.id to string if it's a number
        const userId = typeof user.id === 'number' ? user.id.toString() : user.id;
        
        console.log('Admin profile check - User ID:', userId);
        
        // Check if user already has a social profile
        const { data: existingProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, display_name')
          .eq('id', userId)
          .single();
        
        // If profile exists, we're done
        if (existingProfile) {
          console.log('Admin profile exists:', existingProfile);
          setIsComplete(true);
          return;
        }
        
        // If error is not "no rows returned", there's another issue
        if (profileError && !profileError.message.includes('contains 0 rows')) {
          console.error('Error checking for existing profile:', profileError);
          setError(`Failed to check for existing profile: ${profileError.message}`);
          return;
        }
        
        console.log('Creating new admin profile for ID:', userId);
        
        // Create a new profile for admin user
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            display_name: user.name || 'Administrator',
            is_public: true,
            newsletter_subscribed: true,
            bio: 'Site Administrator'
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating admin profile:', createError);
          setError(`Failed to create admin profile: ${createError.message}`);
          toast.error('Failed to create social profile for admin');
          return;
        }
        
        console.log('Admin profile created successfully:', newProfile);
        toast.success('Admin social profile created successfully');
        setIsComplete(true);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in admin profile creation:', error);
        setError(`Error in admin profile creation: ${errorMessage}`);
      } finally {
        setIsCreating(false);
      }
    };
    
    checkAndCreateProfile();
  }, [user, isAdmin]);
  
  return { isCreating, isComplete, error };
};
