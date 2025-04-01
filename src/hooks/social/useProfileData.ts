
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { UserProfile } from '@/types/social';

export const useProfileData = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'pending' | 'accepted' | 'requested'>('none');

  // Fetch profile data
  const fetchProfile = useCallback(async (profileId?: string) => {
    try {
      setIsLoading(true);
      
      if (!profileId) {
        // If no userId provided, get the current user's profile
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          console.error('Error getting session:', sessionError);
          setIsLoading(false);
          return;
        }
        
        profileId = sessionData.session.user.id;
        setIsCurrentUser(true);
      } else {
        // Check if the profile belongs to the current user
        const { data: sessionData } = await supabase.auth.getSession();
        setIsCurrentUser(sessionData.session?.user.id === profileId);
      }
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error('Failed to load profile data');
        setIsLoading(false);
        return;
      }
      
      // If profile not found, try to check if auth user exists
      if (!profileData) {
        const { data: authUserData, error: authUserError } = await supabase.auth.admin.getUserById(profileId);
        
        if (authUserError || !authUserData.user) {
          console.error('Error fetching auth user:', authUserError);
          toast.error('User not found');
          setIsLoading(false);
          return;
        }
        
        // Create a new profile for the user
        if (isCurrentUser) {
          const { data: newProfile, error: createProfileError } = await supabase
            .from('user_profiles')
            .insert({
              id: profileId,
              display_name: authUserData.user.email?.split('@')[0] || 'New User',
              is_public: false,
              newsletter_subscribed: true
            })
            .select('*')
            .single();
          
          if (createProfileError) {
            console.error('Error creating profile:', createProfileError);
            toast.error('Failed to create profile');
            setIsLoading(false);
            return;
          }
          
          setProfile(newProfile as UserProfile);
        } else {
          setIsLoading(false);
          return;
        }
      } else {
        setProfile(profileData as UserProfile);
      }
      
      // Fetch friendship status if not current user
      if (!isCurrentUser) {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData.session?.user.id;
        
        if (currentUserId) {
          // Query friendships table to get status
          const { data: friendshipData, error: friendshipError } = await supabase
            .from('friendships')
            .select('*')
            .or(`requestor_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
            .or(`requestor_id.eq.${profileId},recipient_id.eq.${profileId}`);
          
          if (friendshipError) {
            console.error('Error fetching friendship status:', friendshipError);
          } else if (friendshipData && friendshipData.length > 0) {
            const friendship = friendshipData[0];
            
            if (friendship.status === 'accepted') {
              setFriendshipStatus('accepted');
            } else if (friendship.status === 'pending') {
              if (friendship.requestor_id === currentUserId) {
                setFriendshipStatus('requested');
              } else {
                setFriendshipStatus('pending');
              }
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast.error('An error occurred while loading profile data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchProfile(userId);
  }, [fetchProfile, userId]);

  return {
    profile,
    isLoading,
    isCurrentUser,
    friendshipStatus,
    refetchProfile: () => fetchProfile(userId)
  };
};
