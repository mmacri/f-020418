
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
      
      // Fetch user's posts along with relations
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
        // Process posts data
        const processedPosts = postsData.map(post => {
          // Calculate reaction counts
          const like = post.reactions?.filter(r => r.type === 'like').length || 0;
          const heart = post.reactions?.filter(r => r.type === 'heart').length || 0;
          const thumbs_up = post.reactions?.filter(r => r.type === 'thumbs_up').length || 0;
          const thumbs_down = post.reactions?.filter(r => r.type === 'thumbs_down').length || 0;
          
          // Create a user object if user is missing
          const user = post.user || {
            id: profileId,
            display_name: 'Unknown User',
            bio: null,
            avatar_url: null,
            is_public: false,
            newsletter_subscribed: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // Ensure comments array
          const comments = post.comments || [];
          
          // Ensure reactions array
          const reactions = post.reactions || [];
          
          return {
            ...post,
            reaction_counts: {
              like,
              heart,
              thumbs_up,
              thumbs_down
            },
            user,
            comments,
            reactions
          } as Post;
        });
        
        setPosts(processedPosts);
      }
      
      // If this is the current user, fetch their pending friend requests
      if (isCurrentUser) {
        const { data: friendRequestsData, error: friendRequestsError } = await supabase
          .from('friendships')
          .select(`
            *,
            requestor:user_profiles(*)
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
          // Process bookmarks
          const processedBookmarks = bookmarksData.map(bookmark => {
            if (!bookmark.post) {
              return bookmark as Bookmark;
            }
            
            // Calculate reaction counts for the post
            const like = bookmark.post.reactions?.filter(r => r.type === 'like').length || 0;
            const heart = bookmark.post.reactions?.filter(r => r.type === 'heart').length || 0;
            const thumbs_up = bookmark.post.reactions?.filter(r => r.type === 'thumbs_up').length || 0;
            const thumbs_down = bookmark.post.reactions?.filter(r => r.type === 'thumbs_down').length || 0;
            
            // Create a user object if user is missing
            const user = bookmark.post.user || {
              id: bookmark.post.user_id,
              display_name: 'Unknown User',
              bio: null,
              avatar_url: null,
              is_public: false,
              newsletter_subscribed: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            // Ensure comments array
            const comments = bookmark.post.comments || [];
            
            // Ensure reactions array
            const reactions = bookmark.post.reactions || [];
            
            return {
              ...bookmark,
              post: {
                ...bookmark.post,
                reaction_counts: {
                  like,
                  heart,
                  thumbs_up,
                  thumbs_down
                },
                user,
                comments,
                reactions
              }
            } as Bookmark;
          });
          
          setBookmarks(processedBookmarks);
        }
      }
      
      // Fetch friendship status if not current user
      if (!isCurrentUser) {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData.session?.user.id;
        
        if (currentUserId) {
          // Check if there's a pending request from current user to other user
          const { data: outgoingRequest } = await supabase
            .from('friendships')
            .select('*')
            .eq('requestor_id', currentUserId)
            .eq('recipient_id', profileId)
            .eq('status', 'pending')
            .maybeSingle();
            
          if (outgoingRequest) {
            setFriendshipStatus('pending');
          } else {
            // Check if there's an accepted friendship
            const { data: acceptedFriendship } = await supabase
              .from('friendships')
              .select('*')
              .or(`requestor_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
              .or(`requestor_id.eq.${profileId},recipient_id.eq.${profileId}`)
              .eq('status', 'accepted')
              .maybeSingle();
              
            if (acceptedFriendship) {
              setFriendshipStatus('accepted');
            } else {
              // Check if there's a pending request from other user to current user
              const { data: incomingRequest } = await supabase
                .from('friendships')
                .select('*')
                .eq('requestor_id', profileId)
                .eq('recipient_id', currentUserId)
                .eq('status', 'pending')
                .maybeSingle();
                
              if (incomingRequest) {
                setFriendshipStatus('requested');
              } else {
                setFriendshipStatus('none');
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
          requestor:user_profiles(*),
          recipient:user_profiles(*)
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
