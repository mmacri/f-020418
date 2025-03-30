
import { useState, useEffect } from 'react';
import { 
  login as authLogin, 
  logout as authLogout, 
  getUser, 
  isAuthenticated as checkIsAuthenticated 
} from '@/services/authService';
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

  useEffect(() => {
    // Function to check auth status
    const checkAuth = async () => {
      try {
        // First set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session) {
              const currentUser = await getUser();
              if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
              } else {
                setUser(null);
                setIsAuthenticated(false);
              }
            } else {
              setUser(null);
              setIsAuthenticated(false);
            }
            setIsLoading(false);
          }
        );

        // Then check current session
        const isUserAuthenticated = await checkIsAuthenticated();
        if (isUserAuthenticated) {
          const currentUser = await getUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          }
        }
        
        setIsLoading(false);
        
        // Clean up subscription
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await authLogin(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        return true;
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
      await authLogout();
      setUser(null);
      setIsAuthenticated(false);
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
