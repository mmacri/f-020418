
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
          // Check if relationships were properly loaded
          let requestorProfile: UserProfile;
          let recipientProfile: UserProfile;
          
          if (friendship.requestor && typeof friendship.requestor === 'object' && !('error' in friendship.requestor)) {
            requestorProfile = friendship.requestor as UserProfile;
          } else {
            // Fallback for missing requestor
            requestorProfile = {
              id: friendship.requestor_id,
              display_name: "Unknown User",
              bio: null,
              avatar_url: null,
              is_public: false,
              newsletter_subscribed: false,
              created_at: friendship.created_at,
              updated_at: friendship.created_at
            };
          }
          
          if (friendship.recipient && typeof friendship.recipient === 'object' && !('error' in friendship.recipient)) {
            recipientProfile = friendship.recipient as UserProfile;
          } else {
            // Fallback for missing recipient
            recipientProfile = {
              id: friendship.recipient_id,
              display_name: "Unknown User",
              bio: null,
              avatar_url: null,
              is_public: false,
              newsletter_subscribed: false,
              created_at: friendship.created_at,
              updated_at: friendship.created_at
            };
          }
          
          return {
            ...friendship,
            requestor: requestorProfile,
            recipient: recipientProfile
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
            let requestorProfile: UserProfile;
            
            if (request.requestor && typeof request.requestor === 'object' && !('error' in request.requestor)) {
              requestorProfile = request.requestor as UserProfile;
            } else {
              // Fallback for missing requestor
              requestorProfile = {
                id: request.requestor_id,
                display_name: "Unknown User",
                bio: null,
                avatar_url: null,
                is_public: false,
                newsletter_subscribed: false,
                created_at: request.created_at,
                updated_at: request.created_at
              };
            }
            
            return {
              ...request,
              requestor: requestorProfile
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
