
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { UserProfile } from "@/types/social";

interface ProfileAboutTabProps {
  profile: UserProfile;
  isCurrentUser: boolean;
}

export const ProfileAboutTab: React.FC<ProfileAboutTabProps> = ({
  profile,
  isCurrentUser
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Bio</h3>
            <p className="text-muted-foreground">
              {profile.bio || `${isCurrentUser ? "You haven't" : `${profile.display_name} hasn't`} added a bio yet.`}
            </p>
          </div>
          
          {isCurrentUser && (
            <div>
              <h3 className="text-lg font-medium mb-2">Profile Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Profile Visibility:</span>
                  <span className={profile.is_public ? "text-green-600" : "text-amber-600"}>
                    {profile.is_public ? "Public" : "Private"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Newsletter:</span>
                  <span className={profile.newsletter_subscribed ? "text-green-600" : "text-gray-600"}>
                    {profile.newsletter_subscribed ? "Subscribed" : "Not Subscribed"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
