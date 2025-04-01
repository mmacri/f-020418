
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { toast } from 'sonner';

// Generate a unique file name for uploaded images
export const generateFileName = (userId: string, fileName: string): string => {
  const timestamp = new Date().getTime();
  const extension = fileName.split('.').pop();
  return `${userId}-${timestamp}.${extension}`;
};

// Upload profile avatar image
export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate a unique file path for the avatar
    const filePath = `avatars/${userId}/${generateFileName(userId, file.name)}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('social-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('social-images')
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadProfileImage:', error);
    throw error;
  }
};

// Upload post image
export const uploadPostImage = async (file: File, userId: string): Promise<string> => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate a unique file path for the post image
    const filePath = `posts/${userId}/${generateFileName(userId, file.name)}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('social-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading post image:', error);
      throw error;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('social-images')
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadPostImage:', error);
    throw error;
  }
};

// Create a welcome post from admin to new users
export const createWelcomePost = async (recipientId: string): Promise<boolean> => {
  try {
    // Get admin user (assumed to be the first user in the system or a specific ID)
    const { data: adminProfiles, error: adminError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('display_name', 'Admin')
      .maybeSingle();
    
    if (adminError) {
      console.error('Error finding admin profile:', adminError);
      return false;
    }
    
    let adminId: string;
    
    if (!adminProfiles) {
      // Create an admin profile if it doesn't exist
      const { data: adminAuth, error: authError } = await supabase.auth.getSession();
      
      if (authError || !adminAuth.session) {
        console.error('Error getting current user session:', authError);
        return false;
      }
      
      const { data: newAdmin, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          id: adminAuth.session.user.id,
          display_name: 'Admin',
          is_public: true,
          newsletter_subscribed: true
        })
        .select('*')
        .single();
      
      if (createError) {
        console.error('Error creating admin profile:', createError);
        return false;
      }
      
      adminId = newAdmin.id;
    } else {
      adminId = adminProfiles.id;
    }
    
    // Get the recipient's display name
    const { data: recipient, error: recipientError } = await supabase
      .from('user_profiles')
      .select('display_name')
      .eq('id', recipientId)
      .single();
    
    if (recipientError) {
      console.error('Error getting recipient profile:', recipientError);
      return false;
    }
    
    // Get hero image for the post
    const heroImageUrl = localStorage.getItem('hero_image') || 
                         'https://ext.same-assets.com/1001010126/hero-default.jpg';
    
    // Create welcome post
    const welcomeMessage = `
Welcome to the community, ${recipient.display_name}! 

We're excited to have you join us. This is a place to share your reviews, ideas, and wellness experiences with like-minded people. Feel free to post about your favorite recovery products, share tips, and connect with others on their wellness journeys.

Looking forward to seeing your contributions and building meaningful connections!
    `;
    
    const { error: postError } = await supabase
      .from('posts')
      .insert({
        user_id: adminId,
        content: welcomeMessage,
        image_url: heroImageUrl
      });
    
    if (postError) {
      console.error('Error creating welcome post:', postError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in createWelcomePost:', error);
    return false;
  }
};

// Helper function to get user profile by ID
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};
