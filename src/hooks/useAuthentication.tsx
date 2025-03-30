
import { useState, useEffect, useCallback } from 'react';
import { 
  login as authLogin, 
  logout as authLogout, 
  getUser, 
  isAuthenticated as checkIsAuthenticated 
} from '@/services/auth';
import { User } from '@/services/userService';
import { supabase } from '@/integrations/supabase/client';

interface UseAuthenticationResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthentication = (): UseAuthenticationResult => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Function to get current user data
  const fetchUser = useCallback(async () => {
    try {
      // Get current user data from Supabase
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      if (supabaseUser) {
        // Get user profile from our database
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();
        
        const currentUser: User = {
          id: typeof supabaseUser.id === 'string' && supabaseUser.id.length > 8 
            ? parseInt(supabaseUser.id.substring(0, 8), 16) || 1 
            : 1,
          email: supabaseUser.email || '',
          name: profileData?.display_name || supabaseUser.email?.split('@')[0] || '',
          role: (profileData?.role as "admin" | "editor" | "user") || 'user',
          avatar: profileData?.avatar_url,
          createdAt: profileData?.created_at || new Date().toISOString(),
          updatedAt: profileData?.updated_at || new Date().toISOString()
        };
        
        console.log("Fetched user data:", currentUser);
        setUser(currentUser);
        return true;
      }
      
      // Fallback to legacy user service
      const legacyUser = await getUser();
      if (legacyUser) {
        setUser(legacyUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error fetching user:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    // Function to check auth status
    const checkAuth = async () => {
      try {
        console.log("Starting auth check");
        setIsLoading(true);
        
        // First check current session
        const { data: { session } } = await supabase.auth.getSession();
        const isUserAuthenticated = !!session || await checkIsAuthenticated();
        console.log("Is user authenticated:", isUserAuthenticated);
        
        if (isUserAuthenticated) {
          const success = await fetchUser();
          setIsAuthenticated(success);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        
        // Set up auth state listener
        const { data } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, !!session);
            
            if (session) {
              // Use setTimeout to prevent potential deadlocks with Supabase auth
              setTimeout(async () => {
                const success = await fetchUser();
                setIsAuthenticated(success);
              }, 0);
            } else {
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        );
        
        setIsLoading(false);
        
        // Clean up subscription
        return () => {
          data.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [fetchUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Attempting login for:", email);
      
      // Try Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Supabase login error:", error.message);
        
        // Fallback to legacy login
        const result = await authLogin(email, password);
        if (result.success && result.user) {
          setUser(result.user);
          setIsAuthenticated(true);
          return true;
        }
        return false;
      }
      
      if (data.user) {
        const success = await fetchUser();
        return success;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout");
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Also run legacy logout for compatibility
      await authLogout();
      
      setUser(null);
      setIsAuthenticated(false);
      console.log("Logout successful");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };
};
