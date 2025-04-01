
import { useState, useEffect } from 'react';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { UserProfile, Post, Comment, Reaction, Friendship, ReactionType } from '@/types/social';
import { useToast } from '@/hooks/use-toast';

export const useSocialProfile = (profileId?: string) => {
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
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', targetProfileId)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }
        
        // Make sure the profile data matches our UserProfile type
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
          // Fetch posts
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
          
          // Process posts to match our Post type
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
            
            // Cast the user property correctly from the join query
            let userProfile: UserProfile | undefined;
            if (post.user && !post.user.error) {
              userProfile = {
                id: post.user.id,
                display_name: post.user.display_name,
                avatar_url: post.user.avatar_url,
                bio: null,
                is_public: false,
                newsletter_subscribed: false,
                created_at: '',
                updated_at: ''
              };
            }
            
            // Create a properly typed Post object
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
          
          setPosts(postsWithReactions);
        }
        
        // Handle friendship status checking
        if (currentUserId && currentUserId !== targetProfileId) {
          // Check for sent friend requests
          const { data: sentRequestData } = await supabase
            .from('friendships')
            .select('*')
            .eq('requestor_id', currentUserId)
            .eq('recipient_id', targetProfileId)
            .single();
            
          // Check for received friend requests
          const { data: receivedRequestData } = await supabase
            .from('friendships')
            .select('*')
            .eq('requestor_id', targetProfileId)
            .eq('recipient_id', currentUserId)
            .single();
            
          if (sentRequestData) {
            // Cast status to the expected type
            const status = sentRequestData.status as 'pending' | 'accepted' | 'rejected';
            setFriendshipStatus(status === 'accepted' ? 'accepted' : 'pending');
          } else if (receivedRequestData) {
            // Cast status to the expected type
            const status = receivedRequestData.status as 'pending' | 'accepted' | 'rejected';
            setFriendshipStatus(status === 'accepted' ? 'accepted' : 'requested');
          }
        }
        
        // Fetch pending friend requests for current user
        if (currentUserId === targetProfileId) {
          const { data: pendingRequests, error: pendingError } = await supabase
            .from('friendships')
            .select(`
              *,
              requestor:user_profiles!friendships_requestor_id_fkey(id, display_name, avatar_url)
            `)
            .eq('recipient_id', currentUserId)
            .eq('status', 'pending');
            
          if (pendingError) {
            console.error('Error fetching pending requests:', pendingError);
          } else if (pendingRequests) {
            // Process pending requests to match our Friendship type
            const typedPendingRequests: Friendship[] = pendingRequests.map(request => {
              // Cast the requestor property correctly
              let requestorProfile: UserProfile | undefined;
              if (request.requestor && !request.requestor.error) {
                requestorProfile = {
                  id: request.requestor.id,
                  display_name: request.requestor.display_name,
                  avatar_url: request.requestor.avatar_url,
                  bio: null,
                  is_public: false,
                  newsletter_subscribed: false,
                  created_at: '',
                  updated_at: ''
                };
              }
              
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
          
          // Fetch friends as requestor
          const { data: friendsAsRequestor, error: requestorError } = await supabase
            .from('friendships')
            .select(`
              *,
              recipient:user_profiles!friendships_recipient_id_fkey(id, display_name, avatar_url)
            `)
            .eq('requestor_id', currentUserId)
            .eq('status', 'accepted');
          
          // Fetch friends as recipient
          const { data: friendsAsRecipient, error: recipientError } = await supabase
            .from('friendships')
            .select(`
              *,
              requestor:user_profiles!friendships_requestor_id_fkey(id, display_name, avatar_url)
            `)
            .eq('recipient_id', currentUserId)
            .eq('status', 'accepted');
            
          if (requestorError) {
            console.error('Error fetching friends as requestor:', requestorError);
          }
          
          if (recipientError) {
            console.error('Error fetching friends as recipient:', recipientError);
          }
          
          // Process friends to match our Friendship type
          const processedFriends: Friendship[] = [];
          
          if (friendsAsRequestor) {
            friendsAsRequestor.forEach(friendship => {
              // Cast the recipient property correctly
              let recipientProfile: UserProfile | undefined;
              if (friendship.recipient && !friendship.recipient.error) {
                recipientProfile = {
                  id: friendship.recipient.id,
                  display_name: friendship.recipient.display_name,
                  avatar_url: friendship.recipient.avatar_url,
                  bio: null,
                  is_public: false,
                  newsletter_subscribed: false,
                  created_at: '',
                  updated_at: ''
                };
              }
              
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
              // Cast the requestor property correctly
              let requestorProfile: UserProfile | undefined;
              if (friendship.requestor && !friendship.requestor.error) {
                requestorProfile = {
                  id: friendship.requestor.id,
                  display_name: friendship.requestor.display_name,
                  avatar_url: friendship.requestor.avatar_url,
                  bio: null,
                  is_public: false,
                  newsletter_subscribed: false,
                  created_at: '',
                  updated_at: ''
                };
              }
              
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
  
  const createPost = async (content: string, imageUrl?: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to create posts",
          variant: "destructive"
        });
        return null;
      }
      
      const newPost = {
        user_id: session.user.id,
        content,
        image_url: imageUrl || null
      };
      
      const { data, error } = await supabase
        .from('posts')
        .insert(newPost)
        .select(`
          *,
          user:user_profiles(id, display_name, avatar_url)
        `)
        .single();
        
      if (error) throw error;
      
      // Process the post to match our Post type
      let userProfile: UserProfile | undefined;
      if (data.user && !data.user.error) {
        userProfile = {
          id: data.user.id,
          display_name: data.user.display_name,
          avatar_url: data.user.avatar_url,
          bio: null,
          is_public: false,
          newsletter_subscribed: false,
          created_at: '',
          updated_at: ''
        };
      }
            
      const typedPost: Post = {
        id: data.id,
        user_id: data.user_id,
        content: data.content,
        image_url: data.image_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user: userProfile,
        reaction_counts: {
          like: 0,
          heart: 0,
          thumbs_up: 0,
          thumbs_down: 0
        }
      };
      
      setPosts(prev => [typedPost, ...prev]);
      return typedPost;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
      return null;
    }
  };
  
  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
        
      if (error) throw error;
      
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast({
        title: "Success",
        description: "Post deleted successfully"
      });
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const addComment = async (postId: string, content: string): Promise<Comment | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to comment",
          variant: "destructive"
        });
        return null;
      }
      
      const newComment = {
        post_id: postId,
        user_id: session.user.id,
        content
      };
      
      const { data, error } = await supabase
        .from('comments')
        .insert(newComment)
        .select(`
          *,
          user:user_profiles(id, display_name, avatar_url)
        `)
        .single();
        
      if (error) throw error;
      
      // Process the comment to match our Comment type
      let userProfile: UserProfile | undefined;
      if (data.user && !data.user.error) {
        userProfile = {
          id: data.user.id,
          display_name: data.user.display_name,
          avatar_url: data.user.avatar_url,
          bio: null,
          is_public: false,
          newsletter_subscribed: false,
          created_at: '',
          updated_at: ''
        };
      }
            
      const typedComment: Comment = {
        id: data.id,
        post_id: data.post_id,
        user_id: data.user_id,
        content: data.content,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user: userProfile
      };
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), typedComment]
          };
        }
        return post;
      }));
      
      return typedComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
      return null;
    }
  };
  
  const addReaction = async (type: ReactionType, postId?: string, commentId?: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to react",
          variant: "destructive"
        });
        return null;
      }
      
      if ((!postId && !commentId) || (postId && commentId)) {
        throw new Error("Invalid reaction target");
      }
      
      // Check if this reaction already exists
      const { data: existingReaction, error: checkError } = await supabase
        .from('reactions')
        .select('id')
        .eq('user_id', session.user.id)
        .eq(postId ? 'post_id' : 'comment_id', postId || commentId)
        .eq('type', type)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingReaction) {
        // Delete the existing reaction
        const { error: deleteError } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReaction.id);
          
        if (deleteError) throw deleteError;
        
        if (postId) {
          setPosts(prev => prev.map(post => {
            if (post.id === postId && post.reaction_counts) {
              const newCounts = { ...post.reaction_counts };
              newCounts[type]--;
              return { ...post, reaction_counts: newCounts };
            }
            return post;
          }));
        }
        
        return null;
      }
      
      // Create a new reaction
      const newReaction = {
        post_id: postId,
        comment_id: commentId,
        user_id: session.user.id,
        type
      };
      
      const { data, error } = await supabase
        .from('reactions')
        .insert(newReaction)
        .select()
        .single();
        
      if (error) throw error;
      
      if (postId) {
        setPosts(prev => prev.map(post => {
          if (post.id === postId && post.reaction_counts) {
            const newCounts = { ...post.reaction_counts };
            newCounts[type]++;
            return { ...post, reaction_counts: newCounts };
          }
          return post;
        }));
      }
      
      return data;
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive"
      });
      return null;
    }
  };
  
  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to update your profile",
          variant: "destructive"
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', session.user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Process the profile to match our UserProfile type
      const userProfile: UserProfile = {
        id: data.id,
        display_name: data.display_name,
        bio: data.bio,
        avatar_url: data.avatar_url,
        is_public: data.is_public,
        newsletter_subscribed: data.newsletter_subscribed,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setProfile(userProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      return userProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      return null;
    }
  };
  
  const sendFriendRequest = async (recipientId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to send friend requests",
          variant: "destructive"
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('friendships')
        .insert({
          requestor_id: session.user.id,
          recipient_id: recipientId,
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setFriendshipStatus('pending');
      toast({
        title: "Success",
        description: "Friend request sent"
      });
      
      const typedFriendship: Friendship = {
        id: data.id,
        requestor_id: data.requestor_id,
        recipient_id: data.recipient_id,
        status: data.status as 'pending' | 'accepted' | 'rejected',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      return typedFriendship;
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive"
      });
      return null;
    }
  };
  
  const respondToFriendRequest = async (friendshipId: string, accept: boolean) => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .update({
          status: accept ? 'accepted' : 'rejected'
        })
        .eq('id', friendshipId)
        .select()
        .single();
        
      if (error) throw error;
      
      // Filter out the responded request from pending requests
      setPendingFriendRequests(prev => prev.filter(req => req.id !== friendshipId));
      
      // Create a properly typed friendship object
      const typedFriendship: Friendship = {
        id: data.id,
        requestor_id: data.requestor_id,
        recipient_id: data.recipient_id,
        status: data.status as 'pending' | 'accepted' | 'rejected',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      if (accept) {
        setFriends(prev => [...prev, typedFriendship]);
        toast({
          title: "Success",
          description: "Friend request accepted"
        });
      } else {
        toast({
          title: "Success",
          description: "Friend request declined"
        });
      }
      
      return typedFriendship;
    } catch (error) {
      console.error('Error responding to friend request:', error);
      toast({
        title: "Error",
        description: "Failed to process friend request",
        variant: "destructive"
      });
      return null;
    }
  };
  
  const deleteAccount = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to delete your account",
          variant: "destructive"
        });
        return false;
      }
      
      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        const { error } = await supabase.auth.admin.deleteUser(session.user.id);
        
        if (error) throw error;
        
        await supabase.auth.signOut();
        
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted"
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return {
    profile,
    posts,
    pendingFriendRequests,
    friends,
    isLoading,
    isCurrentUser,
    friendshipStatus,
    createPost,
    deletePost,
    addComment,
    addReaction,
    updateProfile,
    sendFriendRequest,
    respondToFriendRequest,
    deleteAccount
  };
};
