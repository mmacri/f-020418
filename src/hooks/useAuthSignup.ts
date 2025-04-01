
import { useState } from 'react';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { useToast } from '@/hooks/use-toast';
import { createWelcomePost } from './social/utils';

export const useAuthSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const signUp = async (email: string, password: string, displayName?: string) => {
    setIsLoading(true);
    
    try {
      // Create user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: displayName || email.split('@')[0]
          }
        }
      });
      
      if (error) throw error;
      
      // User was created successfully
      if (data?.user?.id) {
        // Create welcome post from admin
        try {
          await createWelcomePost(data.user.id);
        } catch (welcomePostError) {
          console.error('Failed to create welcome post:', welcomePostError);
          // Continue with signup even if welcome post fails
        }
        
        // Send welcome email
        try {
          const currentUrl = window.location.origin;
          await fetch(`${currentUrl}/api/send-welcome-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email,
              name: displayName || email.split('@')[0]
            })
          });
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Continue with signup even if email fails
        }
      }
      
      toast({
        title: "Account created!",
        description: "Welcome to the community. You're now signed in."
      });
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      let message = 'An error occurred during signup';
      
      if (error.message) {
        if (error.message.includes('already registered')) {
          message = 'This email is already registered. Please log in instead.';
        } else {
          message = error.message;
        }
      }
      
      toast({
        title: "Signup failed",
        description: message,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signUp
  };
};
