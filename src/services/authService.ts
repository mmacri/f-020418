
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  getCurrentUser as getUserFromService, 
  login as userServiceLogin, 
  logout as userServiceLogout,
  isAdmin as checkIsAdmin
} from "@/services/userService";
import { supabase } from "@/integrations/supabase/client";

// Re-export getCurrentUser from userService
export const getCurrentUser = getUserFromService;

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
      
      // Fall back to existing user service if Supabase auth fails
      return await userServiceLogin({
        email: email,
        password: password
      });
    }
    
    if (data.user) {
      // Get user profile data including role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      // Check if user is admin
      if (profileData && profileData.role !== 'admin') {
        // Sign out non-admin users
        await supabase.auth.signOut();
        return {
          success: false,
          message: "Only administrators can log in to this application."
        };
      }
      
      // Convert Supabase user to our User format
      const userObject: User = {
        id: data.user.id,
        email: data.user.email || email,
        name: profileData?.display_name || email.split('@')[0],
        role: profileData?.role || 'user',
        avatar: profileData?.avatar_url || undefined
      };
      
      // Store auth token in localStorage for compatibility with existing code
      localStorage.setItem('authToken', data.session?.access_token || '');
      
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
    // Also run the existing logout for compatibility
    await userServiceLogout();
    
    // Redirect to home page after logout
    window.location.href = '/';
  } catch (error) {
    console.error("Logout error:", error);
    toast({
      title: "Error",
      description: "Failed to log out. Please try again.",
      variant: "destructive"
    });
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  // Check Supabase session first
  const { data } = await supabase.auth.getSession();
  if (data.session) return true;
  
  // Fall back to existing auth check for compatibility
  return localStorage.getItem('authToken') !== null;
};

// Get current user with Supabase enhancement
export const getUser = async (): Promise<User | null> => {
  try {
    // Try to get user from Supabase first
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      // Get user profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      return {
        id: data.user.id,
        email: data.user.email || '',
        name: profileData?.display_name || data.user.email?.split('@')[0] || '',
        role: profileData?.role || 'user',
        avatar: profileData?.avatar_url || undefined
      };
    }
    
    // Fall back to existing user service
    return getCurrentUser();
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
};

// Check if user has admin role with Supabase enhancement
export const isAdmin = async (): Promise<boolean> => {
  try {
    // Check Supabase user first
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      // Get user profile data to check role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      return profileData?.role === 'admin';
    }
    
    // Fall back to existing admin check
    return checkIsAdmin();
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
};

// Check if user is an admin and authenticated with Supabase enhancement
export const isAuthenticatedAdmin = async (): Promise<boolean> => {
  return await isAuthenticated() && await isAdmin();
};
