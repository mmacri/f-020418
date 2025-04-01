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
        
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', targetProfileId)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }
        
        setProfile(profileData);
        
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
              reaction_counts[reaction.type as keyof typeof reaction_counts]++;
            });
            
            return {
              ...post,
              reaction_counts
            };
          }));
          
          setPosts(postsWithReactions);
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
            setFriendshipStatus(sentRequestData.status === 'accepted' ? 'accepted' : 'pending');
          } else if (receivedRequestData) {
            setFriendshipStatus(receivedRequestData.status === 'accepted' ? 'accepted' : 'requested');
          }
        }
        
        if (currentUserId === targetProfileId) {
          const { data: pendingRequests } = await supabase
            .from('friendships')
            .select(`
              *,
              requestor:user_profiles!friendships_requestor_id_fkey(id, display_name, avatar_url)
            `)
            .eq('recipient_id', currentUserId)
            .eq('status', 'pending');
            
          if (pendingRequests) {
            setPendingFriendRequests(pendingRequests);
          }
          
          const { data: friendsAsRequestor } = await supabase
            .from('friendships')
            .select(`
              *,
              recipient:user_profiles!friendships_recipient_id_fkey(id, display_name, avatar_url)
            `)
            .eq('requestor_id', currentUserId)
            .eq('status', 'accepted');
            
          const { data: friendsAsRecipient } = await supabase
            .from('friendships')
            .select(`
              *,
              requestor:user_profiles!friendships_requestor_id_fkey(id, display_name, avatar_url)
            `)
            .eq('recipient_id', currentUserId)
            .eq('status', 'accepted');
            
          const allFriends = [
            ...(friendsAsRequestor || []),
            ...(friendsAsRecipient || [])
          ];
          
          setFriends(allFriends);
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
      
      setPosts(prev => [data, ...prev]);
      return data;
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
  
  const addComment = async (postId: string, content: string) => {
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
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), data]
          };
        }
        return post;
      }));
      
      return data;
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
  
  const addReaction = async (type: 'like' | 'heart' | 'thumbs_up' | 'thumbs_down', postId?: string, commentId?: string) => {
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
      
      const newReaction = {
        post_id: postId,
        comment_id: commentId,
        user_id: session.user.id,
        type
      };
      
      const { data: existingReaction, error: checkError } = await supabase
        .from('reactions')
        .select('id')
        .eq('user_id', session.user.id)
        .eq(postId ? 'post_id' : 'comment_id', postId || commentId)
        .eq('type', type)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingReaction) {
        const { error: deleteError } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReaction.id);
          
        if (deleteError) throw deleteError;
        
        if (postId) {
          setPosts(prev => prev.map(post => {
            if (post.id === postId) {
              const newCounts = { ...post.reaction_counts };
              newCounts[type]--;
              return { ...post, reaction_counts: newCounts };
            }
            return post;
          }));
        }
        
        return null;
      }
      
      const { data, error } = await supabase
        .from('reactions')
        .insert(newReaction)
        .select()
        .single();
        
      if (error) throw error;
      
      if (postId) {
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
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
  
  const updateProfile = async (updates: Partial<UserProfile>) => {
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
      
      setProfile(data);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      return data;
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
      
      return data;
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
      
      setPendingFriendRequests(prev => prev.filter(req => req.id !== friendshipId));
      
      if (accept) {
        setFriends(prev => [...prev, data]);
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
      
      return data;
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
