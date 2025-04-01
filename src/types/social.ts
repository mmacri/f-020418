
export interface UserProfile {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean;
  newsletter_subscribed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
  reactions?: Reaction[];
  comments?: Comment[];
  reaction_counts?: {
    like: number;
    heart: number;
    thumbs_up: number;
    thumbs_down: number;
  };
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
  reactions?: Reaction[];
  reaction_counts?: {
    like: number;
    heart: number;
    thumbs_up: number;
    thumbs_down: number;
  };
}

export interface Reaction {
  id: string;
  post_id?: string;
  comment_id?: string;
  user_id: string;
  type: 'like' | 'heart' | 'thumbs_up' | 'thumbs_down';
  created_at: string;
}

export interface Friendship {
  id: string;
  requestor_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  requestor?: UserProfile;
  recipient?: UserProfile;
}

export type ReactionType = 'like' | 'heart' | 'thumbs_up' | 'thumbs_down';
