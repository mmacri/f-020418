
import { UserProfile } from '@/types/social';

export const createEmptyUserProfile = (id: string = "", displayName: string = ""): UserProfile => ({
  id,
  display_name: displayName,
  bio: null,
  avatar_url: null,
  is_public: false,
  newsletter_subscribed: false,
  created_at: '',
  updated_at: ''
});

export const isSupabaseError = (obj: any): boolean => {
  return obj && typeof obj === 'object' && 'error' in obj;
};

export const extractUserProfileFromResult = (
  result: any, 
  userId: string, 
  fallbackName: string = "Unknown User"
): UserProfile => {
  if (!result || isSupabaseError(result)) {
    return createEmptyUserProfile(userId, fallbackName);
  }
  
  return {
    id: result.id || userId,
    display_name: result.display_name || fallbackName,
    avatar_url: result.avatar_url || null,
    bio: result.bio || null,
    is_public: !!result.is_public,
    newsletter_subscribed: !!result.newsletter_subscribed,
    created_at: result.created_at || '',
    updated_at: result.updated_at || ''
  };
};
