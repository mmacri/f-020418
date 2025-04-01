
import { useState, useEffect, useCallback } from 'react';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { Friendship, UserProfile } from '@/types/social';

export const useProfileFriends = (userId?: string, isCurrentUser: boolean = false) => {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [pendingFriendRequests, setPendingFriendRequests] = useState<Friendship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFriends = useCallback(async (profileId?: string) => {
    if (!profileId) return;
    
    try {
      setIsLoading(true);
      
      // Fetch friends list (accepted friendships)
      const { data: friendshipsData, error: friendshipsError } = await supabase
        .from('friendships')
        .select(`
          *,
          requestor:user_profiles!friendships_requestor_id_fkey(*),
          recipient:user_profiles!friendships_recipient_id_fkey(*)
        `)
        .or(`requestor_id.eq.${profileId},recipient_id.eq.${profileId}`)
        .eq('status', 'accepted');
      
      if (friendshipsError) {
        console.error('Error fetching friendships:', friendshipsError);
      } else if (friendshipsData) {
        const processedFriendships = friendshipsData.map(friendship => {
          // Ensure requestor and recipient are properly typed
          const requestor = friendship.requestor as UserProfile;
          const recipient = friendship.recipient as UserProfile;
          
          return {
            ...friendship,
            requestor,
            recipient
          } as Friendship;
        });
        
        setFriends(processedFriendships);
      }
      
      // If this is the current user, fetch their pending friend requests
      if (isCurrentUser) {
        const { data: friendRequestsData, error: friendRequestsError } = await supabase
          .from('friendships')
          .select(`
            *,
            requestor:user_profiles!friendships_requestor_id_fkey(*)
          `)
          .eq('recipient_id', profileId)
          .eq('status', 'pending');
        
        if (friendRequestsError) {
          console.error('Error fetching friend requests:', friendRequestsError);
        } else if (friendRequestsData) {
          const processedRequests = friendRequestsData.map(request => {
            const requestor = request.requestor as UserProfile;
            
            return {
              ...request,
              requestor
            } as Friendship;
          });
          
          setPendingFriendRequests(processedRequests);
        }
      }
      
    } catch (error) {
      console.error('Error fetching friends data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isCurrentUser]);

  useEffect(() => {
    fetchFriends(userId);
  }, [fetchFriends, userId]);

  return {
    friends,
    pendingFriendRequests,
    isLoading,
    refetchFriends: () => fetchFriends(userId)
  };
};
