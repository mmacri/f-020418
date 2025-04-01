
import { useState } from 'react';
import { socialSupabase as supabase } from '@/integrations/supabase/socialClient';
import { useToast } from '@/hooks/use-toast';

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
      
      // Send welcome email
      try {
        await fetch(`${window.location.origin}/api/send-welcome-email`, {
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
