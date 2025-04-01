
import { useState, useEffect } from 'react';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { UserProfile, Post, Friendship, ReactionType } from '@/types/social';
import { useToast } from '@/hooks/use-toast';
import { ProfileState } from './types';
import { extractUserProfileFromResult, isSupabaseError } from './utils';

export const useProfileData = (profileId?: string): ProfileState => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pendingFriendRequests, setPendingFriendRequests] = useState<Friendship[]>([]);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'pending' | 'accepted' | 'requested'>('none');
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id;
        
        const targetProfileId = profileId || currentUserId;
        
        if (!targetProfileId) {
          setIsLoading(false);
          return;
        }
        
        setIsCurrentUser(currentUserId === targetProfileId);
        
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', targetProfileId)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }
        
        const userProfile: UserProfile = {
          id: profileData.id,
          display_name: profileData.display_name,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url,
          is_public: profileData.is_public,
          newsletter_subscribed: profileData.newsletter_subscribed,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at
        };
        
        setProfile(userProfile);
        
        if (profileData.is_public || currentUserId === targetProfileId) {
          const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select(`
              *,
              user:user_profiles(id, display_name, avatar_url)
            `)
            .eq('user_id', targetProfileId)
            .order('created_at', { ascending: false });
            
          if (postsError) {
            console.error('Error fetching posts:', postsError);
            throw postsError;
          }
          
          const postsWithReactions = await Promise.all(postsData.map(async (post) => {
            const { data: reactionsData, error: reactionsError } = await supabase
              .from('reactions')
              .select('type, id')
              .eq('post_id', post.id);
              
            if (reactionsError) {
              console.error('Error fetching reactions:', reactionsError);
              return post;
            }
            
            const reaction_counts = {
              like: 0,
              heart: 0,
              thumbs_up: 0,
              thumbs_down: 0
            };
            
            reactionsData.forEach((reaction) => {
              if (reaction.type && typeof reaction.type === 'string') {
                const reactionType = reaction.type as ReactionType;
                reaction_counts[reactionType]++;
              }
            });
            
            const userProfile = extractUserProfileFromResult(post.user, post.user_id);
            
            const typedPost: Post = {
              id: post.id,
              user_id: post.user_id,
              content: post.content,
              image_url: post.image_url,
              created_at: post.created_at,
              updated_at: post.updated_at,
              user: userProfile,
              reaction_counts
            };
            
            return typedPost;
          }));
          
          setPosts(postsWithReactions as Post[]);
        }
        
        if (currentUserId && currentUserId !== targetProfileId) {
          const { data: sentRequestData } = await supabase
            .from('friendships')
            .select('*')
            .eq('requestor_id', currentUserId)
            .eq('recipient_id', targetProfileId)
            .single();
            
          const { data: receivedRequestData } = await supabase
            .from('friendships')
            .select('*')
            .eq('requestor_id', targetProfileId)
            .eq('recipient_id', currentUserId)
            .single();
            
          if (sentRequestData) {
            const status = sentRequestData.status as 'pending' | 'accepted' | 'rejected';
            setFriendshipStatus(status === 'accepted' ? 'accepted' : 'pending');
          } else if (receivedRequestData) {
            const status = receivedRequestData.status as 'pending' | 'accepted' | 'rejected';
            setFriendshipStatus(status === 'accepted' ? 'accepted' : 'requested');
          }
        }
        
        if (currentUserId === targetProfileId) {
          await fetchFriendRequests(currentUserId);
          await fetchFriends(currentUserId);
        }
      } catch (error) {
        console.error('Error in profile loading:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [profileId, toast]);

  const fetchFriendRequests = async (userId: string) => {
    const { data: pendingRequests, error: pendingError } = await supabase
      .from('friendships')
      .select(`
        *,
        requestor:user_profiles!friendships_requestor_id_fkey(id, display_name, avatar_url)
      `)
      .eq('recipient_id', userId)
      .eq('status', 'pending');
      
    if (pendingError) {
      console.error('Error fetching pending requests:', pendingError);
      return;
    }
    
    if (pendingRequests) {
      const typedPendingRequests: Friendship[] = pendingRequests.map(request => {
        const requestorProfile = extractUserProfileFromResult(
          request.requestor, 
          request.requestor_id, 
          "Unknown User"
        );
        
        return {
          id: request.id,
          requestor_id: request.requestor_id,
          recipient_id: request.recipient_id,
          status: request.status as 'pending' | 'accepted' | 'rejected',
          created_at: request.created_at,
          updated_at: request.updated_at,
          requestor: requestorProfile
        };
      });
      
      setPendingFriendRequests(typedPendingRequests);
    }
  };

  const fetchFriends = async (userId: string) => {
    const { data: friendsAsRequestor, error: requestorError } = await supabase
      .from('friendships')
      .select(`
        *,
        recipient:user_profiles!friendships_recipient_id_fkey(id, display_name, avatar_url)
      `)
      .eq('requestor_id', userId)
      .eq('status', 'accepted');
    
    const { data: friendsAsRecipient, error: recipientError } = await supabase
      .from('friendships')
      .select(`
        *,
        requestor:user_profiles!friendships_requestor_id_fkey(id, display_name, avatar_url)
      `)
      .eq('recipient_id', userId)
      .eq('status', 'accepted');
      
    if (requestorError) {
      console.error('Error fetching friends as requestor:', requestorError);
    }
    
    if (recipientError) {
      console.error('Error fetching friends as recipient:', recipientError);
    }
    
    const processedFriends: Friendship[] = [];
    
    if (friendsAsRequestor) {
      friendsAsRequestor.forEach(friendship => {
        const recipientProfile = extractUserProfileFromResult(
          friendship.recipient, 
          friendship.recipient_id, 
          "Unknown User"
        );
        
        processedFriends.push({
          id: friendship.id,
          requestor_id: friendship.requestor_id,
          recipient_id: friendship.recipient_id,
          status: friendship.status as 'pending' | 'accepted' | 'rejected',
          created_at: friendship.created_at,
          updated_at: friendship.updated_at,
          recipient: recipientProfile
        });
      });
    }
    
    if (friendsAsRecipient) {
      friendsAsRecipient.forEach(friendship => {
        const requestorProfile = extractUserProfileFromResult(
          friendship.requestor, 
          friendship.requestor_id, 
          "Unknown User"
        );
        
        processedFriends.push({
          id: friendship.id,
          requestor_id: friendship.requestor_id,
          recipient_id: friendship.recipient_id,
          status: friendship.status as 'pending' | 'accepted' | 'rejected',
          created_at: friendship.created_at,
          updated_at: friendship.updated_at,
          requestor: requestorProfile
        });
      });
    }
    
    setFriends(processedFriends);
  };

  return {
    profile,
    posts,
    pendingFriendRequests,
    friends,
    isLoading,
    isCurrentUser,
    friendshipStatus
  };
};
