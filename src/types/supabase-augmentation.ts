
// Import the Database type but rename it to avoid conflicts
import type { Database as OriginalDatabase } from '@/integrations/supabase/types';

// Augment the Database type with our custom types for RPC functions
export type RPCFunctions = {
  public: {
    Tables: OriginalDatabase['public']['Tables'];
    Views: OriginalDatabase['public']['Views'];
    Functions: {
      get_bookmark_by_post_and_user: {
        Args: { p_user_id: string; p_post_id: string };
        Returns: Array<{ id: string; user_id: string; post_id: string; created_at: string }>;
      };
      delete_bookmark: {
        Args: { p_user_id: string; p_post_id: string };
        Returns: void;
      };
      insert_bookmark: {
        Args: { p_user_id: string; p_post_id: string };
        Returns: void;
      };
      get_user_posts_with_details: {
        Args: { p_user_id: string };
        Returns: Array<{
          id: string;
          user_id: string;
          content: string;
          image_url: string | null;
          created_at: string;
          updated_at: string;
          user: {
            id: string;
            display_name: string;
            bio: string | null;
            avatar_url: string | null;
            is_public: boolean;
            newsletter_subscribed: boolean;
            created_at: string;
            updated_at: string;
          };
          comments: Array<{
            id: string;
            post_id: string;
            user_id: string;
            content: string;
            created_at: string;
            updated_at: string;
            user: {
              id: string;
              display_name: string;
              bio: string | null;
              avatar_url: string | null;
              is_public: boolean;
              newsletter_subscribed: boolean;
              created_at: string;
              updated_at: string;
            };
          }>;
          reactions: Array<{
            id: string;
            post_id: string;
            user_id: string;
            type: string;
            created_at: string;
          }>;
          reaction_counts: {
            like: number;
            heart: number;
            thumbs_up: number;
            thumbs_down: number;
          };
        }>;
      };
      get_pending_friend_requests: {
        Args: { p_user_id: string };
        Returns: Array<{
          id: string;
          requestor_id: string;
          recipient_id: string;
          status: string;
          created_at: string;
          updated_at: string;
          requestor: {
            id: string;
            display_name: string;
            bio: string | null;
            avatar_url: string | null;
            is_public: boolean;
            newsletter_subscribed: boolean;
            created_at: string;
            updated_at: string;
          };
        }>;
      };
      get_user_bookmarks_with_posts: {
        Args: { p_user_id: string };
        Returns: Array<{
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
          post: {
            id: string;
            user_id: string;
            content: string;
            image_url: string | null;
            created_at: string;
            updated_at: string;
            user: {
              id: string;
              display_name: string;
              bio: string | null;
              avatar_url: string | null;
              is_public: boolean;
              newsletter_subscribed: boolean;
              created_at: string;
              updated_at: string;
            };
            comments: Array<{
              id: string;
              post_id: string;
              user_id: string;
              content: string;
              created_at: string;
              updated_at: string;
              user: {
                id: string;
                display_name: string;
                bio: string | null;
                avatar_url: string | null;
                is_public: boolean;
                newsletter_subscribed: boolean;
                created_at: string;
                updated_at: string;
              };
            }>;
            reactions: Array<{
              id: string;
              post_id: string;
              user_id: string;
              type: string;
              created_at: string;
            }>;
            reaction_counts: {
              like: number;
              heart: number;
              thumbs_up: number;
              thumbs_down: number;
            };
          };
        }>;
      };
      get_friendship_status: {
        Args: { p_user_id: string; p_other_user_id: string };
        Returns: Array<{
          status: 'none' | 'pending' | 'accepted' | 'requested';
        }>;
      };
      get_user_friends: {
        Args: { p_user_id: string };
        Returns: Array<{
          id: string;
          requestor_id: string;
          recipient_id: string;
          status: string;
          created_at: string;
          updated_at: string;
          requestor?: {
            id: string;
            display_name: string;
            bio: string | null;
            avatar_url: string | null;
            is_public: boolean;
            newsletter_subscribed: boolean;
            created_at: string;
            updated_at: string;
          };
          recipient?: {
            id: string;
            display_name: string;
            bio: string | null;
            avatar_url: string | null;
            is_public: boolean;
            newsletter_subscribed: boolean;
            created_at: string;
            updated_at: string;
          };
        }>;
      };
    };
  };
};

// Create a typed supabase client for RPC calls
import { createClient } from '@supabase/supabase-js';

export type TypedSupabaseClient = ReturnType<typeof createClient<RPCFunctions>>;
