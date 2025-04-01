
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { Friendship } from '@/types/social';
import { useToast } from '@/hooks/use-toast';

export const useFriendActions = (
  friendshipStatus: 'none' | 'pending' | 'accepted' | 'requested',
  onStatusChange: () => void
) => {
  const { toast } = useToast();

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
      
      onStatusChange();
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
      
      onStatusChange();
      
      const typedFriendship: Friendship = {
        id: data.id,
        requestor_id: data.requestor_id,
        recipient_id: data.recipient_id,
        status: data.status as 'pending' | 'accepted' | 'rejected',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      if (accept) {
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

  return {
    sendFriendRequest,
    respondToFriendRequest
  };
};
