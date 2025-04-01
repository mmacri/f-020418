
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User } from "@/services/userService";
import ProfileForm from "./ProfileForm";
import RoleInformation from "./RoleInformation";

interface ProfileSettingsProps {
  user: User;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account information and public profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Role and Permissions</CardTitle>
          <CardDescription>
            View your current role and access level.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoleInformation user={user} />
          
          {user.role === "admin" && (
            <Alert className="mt-4">
              <AlertTitle>Admin Account</AlertTitle>
              <AlertDescription>
                You have administrator privileges. Be careful when making changes 
                to system settings and user accounts.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
