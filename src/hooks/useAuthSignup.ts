
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
        console.log("User created successfully with ID:", data.user.id);
        
        // Create a profile entry for the new user
        try {
          // First check if profile already exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (!existingProfile) {
            console.log("Creating new profile for user:", data.user.id);
            // Create a profile for the new user
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({ 
                id: data.user.id,
                display_name: displayName || email.split('@')[0],
                email: email,
                role: 'user' // Default role is user, admin can upgrade later
              });
            
            if (profileError) {
              console.error('Error creating profile:', profileError);
            } else {
              console.log("Profile created successfully");
            }
          } else {
            console.log("Profile already exists for user");
          }
        } catch (profileError) {
          console.error('Failed to check or create profile:', profileError);
        }
        
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
        description: "Welcome to the community. Please check your email to confirm your account before logging in."
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
