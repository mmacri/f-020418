
import { supabase } from "@/integrations/supabase/client";
import { isAdmin as checkIsAdmin } from "@/services/userService";

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

// Check if user has admin role with Supabase enhancement
export const isAdmin = async (): Promise<boolean> => {
  try {
    // Check Supabase user first
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      console.log("Checking admin status for user:", data.user.id);
      
      // Get user profile data to check role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error("Error checking admin status:", profileError);
        return false;
      }
      
      const isAdminUser = profileData?.role === 'admin';
      console.log("Admin check result from Supabase:", isAdminUser, "Role:", profileData?.role);
      return isAdminUser;
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

// Check if user is an admin and authenticated
export const isAuthenticatedAdmin = async (): Promise<boolean> => {
  return await isAuthenticated() && await isAdmin();
};
