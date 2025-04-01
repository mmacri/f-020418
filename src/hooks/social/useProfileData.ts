
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { UserProfile, Post, Friendship, Bookmark } from '@/types/social';

export const useProfileData = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pendingFriendRequests, setPendingFriendRequests] = useState<Friendship[]>([]);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
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
      
      // Fetch user's posts with linked user profiles, comments, and reactions
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          user:user_profiles(*),
          comments:comments(
            *,
            user:user_profiles(*)
          ),
          reactions:reactions(*)
        `)
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });
      
      if (postsError) {
        console.error('Error fetching posts:', postsError);
      } else {
        // Process posts to include reaction counts
        const processedPosts = postsData.map(post => {
          const reactions = post.reactions || [];
          
          // Count reactions by type
          const reactionCounts = {
            like: reactions.filter(r => r.type === 'like').length,
            heart: reactions.filter(r => r.type === 'heart').length,
            thumbs_up: reactions.filter(r => r.type === 'thumbs_up').length,
            thumbs_down: reactions.filter(r => r.type === 'thumbs_down').length
          };
          
          return {
            ...post,
            reaction_counts: reactionCounts
          };
        });
        
        setPosts(processedPosts);
      }
      
      // If this is the current user, fetch their pending friend requests
      if (isCurrentUser) {
        const { data: friendRequestsData, error: friendRequestsError } = await supabase
          .from('friendships')
          .select('*, requestor:user_profiles!requestor_id(*)')
          .eq('recipient_id', profileId)
          .eq('status', 'pending');
        
        if (friendRequestsError) {
          console.error('Error fetching friend requests:', friendRequestsError);
        } else {
          setPendingFriendRequests(friendRequestsData as Friendship[]);
        }
        
        // Fetch bookmarks for current user
        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from('bookmarks')
          .select(`
            *,
            post:posts(
              *,
              user:user_profiles(*),
              comments:comments(
                *,
                user:user_profiles(*)
              ),
              reactions:reactions(*)
            )
          `)
          .eq('user_id', profileId);
        
        if (bookmarksError) {
          console.error('Error fetching bookmarks:', bookmarksError);
        } else {
          // Process bookmarked posts to include reaction counts
          const processedBookmarks = bookmarksData.map(bookmark => {
            if (bookmark.post) {
              const post = bookmark.post;
              const reactions = post.reactions || [];
              
              // Count reactions by type
              post.reaction_counts = {
                like: reactions.filter(r => r.type === 'like').length,
                heart: reactions.filter(r => r.type === 'heart').length,
                thumbs_up: reactions.filter(r => r.type === 'thumbs_up').length,
                thumbs_down: reactions.filter(r => r.type === 'thumbs_down').length
              };
            }
            
            return {
              id: bookmark.id,
              user_id: bookmark.user_id,
              post_id: bookmark.post_id,
              created_at: bookmark.created_at,
              post: bookmark.post
            };
          });
          
          setBookmarks(processedBookmarks);
        }
      }
      
      // Fetch friendship status if not current user
      if (!isCurrentUser) {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData.session?.user.id;
        
        if (currentUserId) {
          // Check if there's a friend request from current user to profile
          const { data: outgoingRequest, error: outgoingError } = await supabase
            .from('friendships')
            .select('*')
            .eq('requestor_id', currentUserId)
            .eq('recipient_id', profileId)
            .maybeSingle();
          
          if (outgoingError) {
            console.error('Error checking outgoing friendship:', outgoingError);
          } else if (outgoingRequest) {
            setFriendshipStatus(outgoingRequest.status as 'pending' | 'accepted');
          } else {
            // Check if there's a friend request from profile to current user
            const { data: incomingRequest, error: incomingError } = await supabase
              .from('friendships')
              .select('*')
              .eq('requestor_id', profileId)
              .eq('recipient_id', currentUserId)
              .maybeSingle();
            
            if (incomingError) {
              console.error('Error checking incoming friendship:', incomingError);
            } else if (incomingRequest) {
              setFriendshipStatus(incomingRequest.status === 'pending' ? 'requested' : 'accepted');
            } else {
              setFriendshipStatus('none');
            }
          }
        }
      }
      
      // Fetch friends list (accepted friendships)
      const { data: friendshipsAsRequestor, error: requestorError } = await supabase
        .from('friendships')
        .select('*, recipient:user_profiles!recipient_id(*)')
        .eq('requestor_id', profileId)
        .eq('status', 'accepted');
      
      if (requestorError) {
        console.error('Error fetching friendships as requestor:', requestorError);
      }
      
      const { data: friendshipsAsRecipient, error: recipientError } = await supabase
        .from('friendships')
        .select('*, requestor:user_profiles!requestor_id(*)')
        .eq('recipient_id', profileId)
        .eq('status', 'accepted');
      
      if (recipientError) {
        console.error('Error fetching friendships as recipient:', recipientError);
      }
      
      // Combine both friendship lists
      const allFriendships = [
        ...(friendshipsAsRequestor || []),
        ...(friendshipsAsRecipient || [])
      ] as Friendship[];
      
      setFriends(allFriendships);
      
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
    posts,
    pendingFriendRequests,
    friends,
    bookmarks,
    isLoading,
    isCurrentUser,
    friendshipStatus,
    refetchProfile: () => fetchProfile(userId)
  };
};
