
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

  useEffect(() => {
    // Only check for admins
    if (!isAdmin || !user?.id) {
      setHasAccess(false);
      return;
    }

    const checkAdminAccess = async () => {
      setIsChecking(true);
      try {
        // Check if the admin's user_id exists in user_profiles
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error checking admin access:', error);
          setHasAccess(false);
          return;
        }
        
        setHasAccess(true);
      } catch (error) {
        console.error('Error in admin access check:', error);
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAdminAccess();
  }, [isAdmin, user]);

  return { hasAccess, isChecking };
};
