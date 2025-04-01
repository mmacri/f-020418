
import { UserProfile, Post } from '@/types/social';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';

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

// Check if admin profile exists, create if not
export const checkAndCreateAdminProfile = async (): Promise<UserProfile | null> => {
  const adminEmail = 'admin@recoveryessentials.com';
  
  try {
    // Get or create admin user
    let adminUserId;
    
    // Check if admin exists
    const { data: existingAdmin, error: adminFetchError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('display_name', 'Admin')
      .maybeSingle();
      
    if (adminFetchError && adminFetchError.code !== 'PGRST116') {
      console.error('Error checking for admin:', adminFetchError);
      return null;
    }
    
    if (existingAdmin) {
      return null; // Admin already exists
    }
    
    // Try to find if there's any user with admin role
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);
      
    if (!adminsError && admins && admins.length > 0) {
      adminUserId = admins[0].id;
    } else {
      // Create admin user if doesn't exist
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: 'Admin123!', // Use a strong password
        options: {
          data: {
            name: 'Admin'
          }
        }
      });
      
      if (signUpError) {
        console.error('Error creating admin user:', signUpError);
        return null;
      }
      
      adminUserId = user?.id;
      
      if (!adminUserId) {
        console.error('Failed to get admin user ID');
        return null;
      }
      
      // Set admin role in profiles table
      await supabase
        .from('profiles')
        .upsert({
          id: adminUserId,
          display_name: 'Admin',
          role: 'admin'
        });
    }
    
    // Create admin profile in user_profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: adminUserId,
        display_name: 'Admin',
        bio: 'Site administrator',
        is_public: true,
        avatar_url: 'https://ext.same-assets.com/2651616194/3622592620.jpeg'
      })
      .select()
      .single();
      
    if (profileError) {
      console.error('Error creating admin profile:', profileError);
      return null;
    }
    
    return profileData as UserProfile;
  } catch (error) {
    console.error('Error in admin profile creation:', error);
    return null;
  }
};

// Create welcome post from admin
export const createWelcomePost = async (): Promise<Post | null> => {
  try {
    // Get admin user
    const { data: adminProfile, error: adminError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('display_name', 'Admin')
      .single();
      
    if (adminError) {
      console.error('Error finding admin profile:', adminError);
      return null;
    }
    
    // Get hero image for welcome post
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('value')
      .eq('id', 'hero_image')
      .maybeSingle();
      
    // Default hero image if not found
    let heroImageUrl = 'https://ext.same-assets.com/2651616194/3622592620.jpeg';
    
    if (!settingsError && settings && settings.value) {
      heroImageUrl = settings.value.url || heroImageUrl;
    }
    
    // Create welcome post
    const welcomePost = {
      user_id: adminProfile.id,
      content: "Welcome to the community! This is a place to share your recovery journey, wellness experiences, and connect with others. Feel free to post reviews, ask questions, and make friends. We're excited to have you join us!",
      image_url: heroImageUrl
    };
    
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert(welcomePost)
      .select()
      .single();
      
    if (postError) {
      console.error('Error creating welcome post:', postError);
      return null;
    }
    
    return post as Post;
  } catch (error) {
    console.error('Error creating welcome post:', error);
    return null;
  }
};
