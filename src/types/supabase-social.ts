
import type { Database } from "@/integrations/supabase/types";

// Type representing our Database structure with additional tables
export type SocialDatabase = Database & {
  Tables: {
    user_profiles: {
      Row: {
        id: string;
        display_name: string;
        bio: string | null;
        avatar_url: string | null;
        is_public: boolean;
        newsletter_subscribed: boolean;
        created_at: string;
        updated_at: string;
      };
      Insert: {
        id: string;
        display_name: string;
        bio?: string | null;
        avatar_url?: string | null;
        is_public?: boolean;
        newsletter_subscribed?: boolean;
        created_at?: string;
        updated_at?: string;
      };
      Update: {
        id?: string;
        display_name?: string;
        bio?: string | null;
        avatar_url?: string | null;
        is_public?: boolean;
        newsletter_subscribed?: boolean;
        created_at?: string;
        updated_at?: string;
      };
    };
    posts: {
      Row: {
        id: string;
        user_id: string;
        content: string;
        image_url: string | null;
        created_at: string;
        updated_at: string;
      };
      Insert: {
        id?: string;
        user_id: string;
        content: string;
        image_url?: string | null;
        created_at?: string;
        updated_at?: string;
      };
      Update: {
        id?: string;
        user_id?: string;
        content?: string;
        image_url?: string | null;
        created_at?: string;
        updated_at?: string;
      };
    };
    comments: {
      Row: {
        id: string;
        post_id: string;
        user_id: string;
        content: string;
        created_at: string;
        updated_at: string;
      };
      Insert: {
        id?: string;
        post_id: string;
        user_id: string;
        content: string;
        created_at?: string;
        updated_at?: string;
      };
      Update: {
        id?: string;
        post_id?: string;
        user_id?: string;
        content?: string;
        created_at?: string;
        updated_at?: string;
      };
    };
    reactions: {
      Row: {
        id: string;
        post_id?: string;
        comment_id?: string;
        user_id: string;
        type: 'like' | 'heart' | 'thumbs_up' | 'thumbs_down';
        created_at: string;
      };
      Insert: {
        id?: string;
        post_id?: string;
        comment_id?: string;
        user_id: string;
        type: 'like' | 'heart' | 'thumbs_up' | 'thumbs_down';
        created_at?: string;
      };
      Update: {
        id?: string;
        post_id?: string;
        comment_id?: string;
        user_id?: string;
        type?: 'like' | 'heart' | 'thumbs_up' | 'thumbs_down';
        created_at?: string;
      };
    };
    friendships: {
      Row: {
        id: string;
        requestor_id: string;
        recipient_id: string;
        status: 'pending' | 'accepted' | 'rejected';
        created_at: string;
        updated_at: string;
      };
      Insert: {
        id?: string;
        requestor_id: string;
        recipient_id: string;
        status: 'pending' | 'accepted' | 'rejected';
        created_at?: string;
        updated_at?: string;
      };
      Update: {
        id?: string;
        requestor_id?: string;
        recipient_id?: string;
        status?: 'pending' | 'accepted' | 'rejected';
        created_at?: string;
        updated_at?: string;
      };
    };
  };
}

// Create a typed Supabase client
export type SocialSupabaseClient = ReturnType<typeof createClient<SocialDatabase>>;

// Helper function to create a client with the extended types
import { createClient } from '@supabase/supabase-js';
export const createSocialClient = (supabaseUrl: string, supabaseKey: string) => 
  createClient<SocialDatabase>(supabaseUrl, supabaseKey);
