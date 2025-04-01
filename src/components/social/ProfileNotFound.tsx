
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { socialSupabase as supabase } from "@/integrations/supabase/socialClient";
import { useToast } from "@/hooks/use-toast";

export const ProfileNotFound = ({ userId, isCurrentUser }: { userId?: string, isCurrentUser: boolean }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const createProfile = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Unable to identify user. Please try logging in again.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get the current user's details
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const email = userData.user?.email || '';
      const displayName = email.split('@')[0];

      // Create a new profile
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          display_name: displayName,
          is_public: false,
          newsletter_subscribed: true,
          bio: null,
          avatar_url: null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your profile has been created!",
      });

      // Reload the page to show the new profile
      window.location.reload();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Profile Not Found</AlertTitle>
        <AlertDescription>
          {isCurrentUser 
            ? "You don't have a social profile set up yet." 
            : "Sorry, this profile doesn't exist or you don't have permission to view it."}
        </AlertDescription>
      </Alert>

      {isCurrentUser && (
        <div className="mt-4 space-y-4">
          <p className="text-muted-foreground">
            Would you like to create your profile now?
          </p>
          <div className="flex gap-3">
            <Button onClick={createProfile}>
              Create My Profile
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </div>
      )}
      
      {!isCurrentUser && (
        <Button variant="outline" onClick={() => navigate('/')} className="mt-4">
          Go Home
        </Button>
      )}
    </div>
  );
};

