
import { toast } from "sonner";
import { User } from "@/services/userService";
import { supabase } from "@/integrations/supabase/client";

// Enhanced login function that uses Supabase auth
export const login = async (email: string, password: string): Promise<{
  success: boolean;
  user?: User;
  message?: string;
}> => {
  try {
    // Try Supabase authentication first
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) {
      console.error("Supabase auth error:", error);
      return {
        success: false,
        message: error.message
      };
    }
    
    if (data.user) {
      // Get user profile data including role
      let profileData;
      
      // Try to get from user_profiles first (new table)
      const { data: userProfileData, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (!userProfileError && userProfileData) {
        profileData = {
          display_name: userProfileData.display_name,
          avatar_url: userProfileData.avatar_url,
          role: 'user' // Default role for social profiles
        };
      } else {
        // Fallback to profiles table
        const { data: legacyProfileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (!profileError && legacyProfileData) {
          profileData = legacyProfileData;
        }
      }
      
      // Convert Supabase user to our User format with proper type conversion
      const userObject: User = {
        id: typeof data.user.id === 'string' && data.user.id.length > 8 
          ? parseInt(data.user.id.substring(0, 8), 16) || 1 
          : 1, // Convert UUID to number or use default
        email: data.user.email || email,
        name: profileData?.display_name || profileData?.avatar_url || email.split('@')[0],
        role: (profileData?.role as "admin" | "editor" | "user") || 'user',
        avatar: profileData?.avatar_url,
        createdAt: profileData?.created_at || new Date().toISOString(),
        updatedAt: profileData?.updated_at || new Date().toISOString()
      };
      
      // Store auth token in localStorage for compatibility with existing code
      localStorage.setItem('authToken', data.session?.access_token || '');
      
      // Also store the user object in localStorage for fallback
      localStorage.setItem('currentUser', JSON.stringify(userObject));
      
      toast.success(`Welcome back, ${userObject.name}!`);
      
      return {
        success: true,
        user: userObject
      };
    }
    
    return {
      success: false,
      message: "Authentication failed."
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during login."
    };
  }
};

// Enhanced logout function that uses Supabase auth
export const logout = async (): Promise<void> => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    toast.success("You have been successfully logged out.");
    
    // Remove token and user from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Failed to log out. Please try again.");
  }
};

// Get current user with Supabase enhancement
export const getUser = async (): Promise<User | null> => {
  try {
    // Try to get user from Supabase first
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      console.log("Supabase user:", data.user);
      
      // Try to get from user_profiles first (new table)
      let profileData;
      
      const { data: userProfileData, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (!userProfileError && userProfileData) {
        profileData = {
          display_name: userProfileData.display_name,
          avatar_url: userProfileData.avatar_url,
          role: 'user' // Default role for social profiles
        };
      } else {
        // Fallback to profiles table
        const { data: legacyProfileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (!profileError && legacyProfileData) {
          profileData = legacyProfileData;
        }
      }
      
      if (profileData) {
        const user = {
          id: typeof data.user.id === 'string' && data.user.id.length > 8 
            ? parseInt(data.user.id.substring(0, 8), 16) || 1 
            : 1,
          email: data.user.email || '',
          name: profileData.display_name || data.user.email?.split('@')[0] || '',
          role: (profileData.role as "admin" | "editor" | "user") || 'user',
          avatar: profileData.avatar_url,
          createdAt: profileData.created_at || new Date().toISOString(),
          updatedAt: profileData.updated_at || new Date().toISOString()
        };
        
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        return user;
      }
    }
    
    // If no Supabase user, try to get from localStorage
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
    
    return null;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
};
