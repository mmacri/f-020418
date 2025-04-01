
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
      const { data: postsData, error: postsError } = await supabase.rpc('get_user_posts_with_details', {
        p_user_id: profileId
      });
      
      if (postsError) {
        console.error('Error fetching posts:', postsError);
      } else if (postsData && Array.isArray(postsData)) {
        setPosts(postsData.map(post => ({
          ...post,
          reaction_counts: post.reaction_counts || {
            like: 0,
            heart: 0,
            thumbs_up: 0,
            thumbs_down: 0
          },
          user: post.user || {
            id: profileId,
            display_name: 'Unknown User',
            bio: null,
            avatar_url: null,
            is_public: false,
            newsletter_subscribed: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          comments: post.comments || [],
          reactions: post.reactions || []
        })));
      }
      
      // If this is the current user, fetch their pending friend requests
      if (isCurrentUser) {
        const { data: friendRequestsData, error: friendRequestsError } = await supabase.rpc('get_pending_friend_requests', {
          p_user_id: profileId
        });
        
        if (friendRequestsError) {
          console.error('Error fetching friend requests:', friendRequestsError);
        } else if (friendRequestsData && Array.isArray(friendRequestsData)) {
          setPendingFriendRequests(friendRequestsData as Friendship[]);
        }
        
        // Fetch bookmarks for current user
        const { data: bookmarksData, error: bookmarksError } = await supabase.rpc('get_user_bookmarks_with_posts', {
          p_user_id: profileId
        });
        
        if (bookmarksError) {
          console.error('Error fetching bookmarks:', bookmarksError);
        } else if (bookmarksData && Array.isArray(bookmarksData)) {
          const processedBookmarks = bookmarksData.map(bookmark => ({
            id: bookmark.id,
            user_id: bookmark.user_id,
            post_id: bookmark.post_id,
            created_at: bookmark.created_at,
            post: bookmark.post ? {
              ...bookmark.post,
              reaction_counts: bookmark.post.reaction_counts || {
                like: 0,
                heart: 0,
                thumbs_up: 0,
                thumbs_down: 0
              },
              user: bookmark.post.user || {
                id: bookmark.post.user_id,
                display_name: 'Unknown User',
                bio: null,
                avatar_url: null,
                is_public: false,
                newsletter_subscribed: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              comments: bookmark.post.comments || [],
              reactions: bookmark.post.reactions || []
            } : null
          }));
          
          setBookmarks(processedBookmarks);
        }
      }
      
      // Fetch friendship status if not current user
      if (!isCurrentUser) {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData.session?.user.id;
        
        if (currentUserId) {
          const { data: friendshipData, error: friendshipError } = await supabase.rpc('get_friendship_status', {
            p_user_id: currentUserId,
            p_other_user_id: profileId
          });
          
          if (friendshipError) {
            console.error('Error checking friendship status:', friendshipError);
          } else if (friendshipData && Array.isArray(friendshipData) && friendshipData.length > 0) {
            setFriendshipStatus(friendshipData[0].status as 'none' | 'pending' | 'accepted' | 'requested');
          }
        }
      }
      
      // Fetch friends list (accepted friendships)
      const { data: friendshipsData, error: friendshipsError } = await supabase.rpc('get_user_friends', {
        p_user_id: profileId
      });
      
      if (friendshipsError) {
        console.error('Error fetching friendships:', friendshipsError);
      } else if (friendshipsData && Array.isArray(friendshipsData)) {
        setFriends(friendshipsData as unknown as Friendship[]);
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
