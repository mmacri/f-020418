
import { useEffect, useState } from 'react';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { useAuthentication } from '@/hooks/useAuthentication';

/**
 * Hook to check if the current admin user has full access to social features
 * including the ability to view and manage all user content
 */
export const useAdminSocialAccess = () => {
  const { isAdmin, user } = useAuthentication();
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only check for admins
    if (!isAdmin || !user?.id) {
      setHasAccess(false);
      return;
    }

    const checkAdminAccess = async () => {
      setIsChecking(true);
      setError(null);
      try {
        // Convert user.id to string to ensure compatibility with Supabase
        const userId = String(user.id);
        
        console.log('Checking admin social access for user ID:', userId);
        
        // Check if the admin's user_id exists in user_profiles
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, display_name')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error('Error checking admin access:', error);
          setError(`Error checking admin access: ${error.message}`);
          setHasAccess(false);
          return;
        }
        
        console.log('Admin social profile found:', data);
        setHasAccess(true);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in admin access check:', error);
        setError(`Error in admin access check: ${errorMessage}`);
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAdminAccess();
  }, [isAdmin, user]);

  return { hasAccess, isChecking, error };
};
