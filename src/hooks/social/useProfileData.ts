
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { UserProfile, Post, Friendship, Bookmark, Comment, Reaction } from '@/types/social';

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
      
      // Fetch user's posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          user:user_profiles(*),
          comments:comments(*, user:user_profiles(*)),
          reactions:reactions(*)
        `)
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });
      
      if (postsError) {
        console.error('Error fetching posts:', postsError);
      } else if (postsData) {
        // Process posts with reaction counts
        const processedPosts = await Promise.all(postsData.map(async (post) => {
          // Get reaction counts
          const { data: reactionData } = await supabase
            .from('reactions')
            .select('type, id')
            .eq('post_id', post.id);
          
          // Create reaction counts object
          const reactionCounts = {
            like: 0,
            heart: 0,
            thumbs_up: 0,
            thumbs_down: 0
          };
          
          if (reactionData) {
            reactionData.forEach(reaction => {
              const type = reaction.type as keyof typeof reactionCounts;
              if (reactionCounts[type] !== undefined) {
                reactionCounts[type]++;
              }
            });
          }
          
          // Correctly cast types to match our application's type definitions
          return {
            ...post,
            user: post.user as UserProfile,
            comments: (post.comments || []) as unknown as Comment[],
            reactions: (post.reactions || []) as unknown as Reaction[],
            reaction_counts: reactionCounts
          } as Post;
        }));
        
        setPosts(processedPosts);
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
          setPendingFriendRequests(friendRequestsData as unknown as Friendship[]);
        }
        
        // Fetch bookmarks for current user
        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from('bookmarks')
          .select(`
            *,
            post:posts(
              *,
              user:user_profiles(*),
              comments:comments(*, user:user_profiles(*)),
              reactions:reactions(*)
            )
          `)
          .eq('user_id', profileId);
        
        if (bookmarksError) {
          console.error('Error fetching bookmarks:', bookmarksError);
        } else if (bookmarksData) {
          // Process bookmarks with reaction counts
          const processedBookmarks = await Promise.all(bookmarksData.map(async (bookmark) => {
            if (!bookmark.post) {
              return {
                id: bookmark.id,
                user_id: bookmark.user_id,
                post_id: bookmark.post_id,
                created_at: bookmark.created_at
              } as Bookmark;
            }
            
            // Get reaction counts for the post
            const { data: reactionData } = await supabase
              .from('reactions')
              .select('type, id')
              .eq('post_id', bookmark.post.id);
            
            // Create reaction counts object
            const reactionCounts = {
              like: 0,
              heart: 0,
              thumbs_up: 0,
              thumbs_down: 0
            };
            
            if (reactionData) {
              reactionData.forEach(reaction => {
                const type = reaction.type as keyof typeof reactionCounts;
                if (reactionCounts[type] !== undefined) {
                  reactionCounts[type]++;
                }
              });
            }
            
            // Correctly cast types
            return {
              id: bookmark.id,
              user_id: bookmark.user_id,
              post_id: bookmark.post_id,
              created_at: bookmark.created_at,
              post: {
                ...bookmark.post,
                user: bookmark.post.user as UserProfile,
                comments: (bookmark.post.comments || []) as unknown as Comment[],
                reactions: (bookmark.post.reactions || []) as unknown as Reaction[],
                reaction_counts: reactionCounts
              } as Post
            } as Bookmark;
          }));
          
          setBookmarks(processedBookmarks);
        }
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
