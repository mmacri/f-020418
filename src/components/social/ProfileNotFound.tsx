
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserX } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileNotFoundProps {
  userId?: string;
  isCurrentUser: boolean;
  onCreateProfile?: (displayName: string) => Promise<any>;
}

export const ProfileNotFound: React.FC<ProfileNotFoundProps> = ({ 
  userId, 
  isCurrentUser,
  onCreateProfile 
}) => {
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreateProfile = async () => {
    if (!displayName.trim() || !onCreateProfile) return;
    
    setIsSubmitting(true);
    try {
      await onCreateProfile(displayName);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-6 pb-8 text-center">
          <UserX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          
          {isCurrentUser ? (
            <>
              <p className="text-muted-foreground mb-8">
                It looks like you don't have a profile set up yet. 
                Create one now to start connecting with others.
              </p>
              
              {onCreateProfile && (
                <div className="space-y-4">
                  <div className="max-w-md mx-auto">
                    <Input
                      placeholder="Enter your display name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="mb-4"
                    />
                    
                    <Button 
                      onClick={handleCreateProfile}
                      disabled={!displayName.trim() || isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? "Creating Profile..." : "Create Profile"}
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-8">
                The profile you're looking for doesn't exist or has been removed.
              </p>
              <div className="flex justify-center space-x-4">
                <Button asChild>
                  <Link to="/profile">Go to Your Profile</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
