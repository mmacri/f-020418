
import { toast } from "sonner";
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
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }
      
      // Check if user is admin - don't block non-admin users from logging in
      // We'll check admin permissions in the Admin component instead
      const isUserAdmin = profileData?.role === 'admin';
      
      // Convert Supabase user to our User format with proper type conversion
      const userObject: User = {
        id: typeof data.user.id === 'string' && data.user.id.length > 8 
          ? parseInt(data.user.id.substring(0, 8), 16) || 1 
          : 1, // Convert UUID to number or use default
        email: data.user.email || email,
        name: profileData?.display_name || email.split('@')[0],
        role: (profileData?.role as "admin" | "editor" | "user") || 'user',
        avatar: profileData?.avatar_url,
        createdAt: profileData?.created_at || new Date().toISOString(),
        updatedAt: profileData?.updated_at || new Date().toISOString()
      };
      
      // Store auth token in localStorage for compatibility with existing code
      localStorage.setItem('authToken', data.session?.access_token || '');
      
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
    // Also run the existing logout for compatibility
    await userServiceLogout();
    
    toast.success("You have been successfully logged out.");
    
    // Remove token from localStorage
    localStorage.removeItem('authToken');
    
    // Redirect to home page after logout
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Failed to log out. Please try again.");
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    // Check Supabase session first
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      console.log("User is authenticated via Supabase session");
      return true;
    }
    
    // Fall back to existing auth check for compatibility
    const hasAuthToken = localStorage.getItem('authToken') !== null;
    console.log("Auth token check:", hasAuthToken);
    return hasAuthToken;
  } catch (error) {
    console.error("Authentication check error:", error);
    return false;
  }
};

// Get current user with Supabase enhancement
export const getUser = async (): Promise<User | null> => {
  try {
    // Try to get user from Supabase first
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      console.log("Supabase user:", data.user);
      // Get user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }
      
      if (profileData) {
        return {
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
      }
    }
    
    // Fall back to existing user service
    const currentUser = await getCurrentUser();
    console.log("Legacy user service:", currentUser);
    return currentUser;
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
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error("Error checking admin status:", profileError);
      }
      
      return profileData?.role === 'admin';
    }
    
    // Fall back to existing admin check
    const isLegacyAdmin = await checkIsAdmin();
    console.log("Legacy admin check:", isLegacyAdmin);
    return isLegacyAdmin;
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
};

// Check if user is an admin and authenticated with Supabase enhancement
export const isAuthenticatedAdmin = async (): Promise<boolean> => {
  return await isAuthenticated() && await isAdmin();
};
