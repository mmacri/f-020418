
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User } from "@/services/userService";
import ProfileForm from "./ProfileForm";
import RoleInformation from "./RoleInformation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfileSettingsProps {
  user: User;
  onProfileUpdate?: (updatedUser: User) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onProfileUpdate }) => {
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

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
          <ProfileForm user={user} onProfileUpdate={onProfileUpdate} />
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
          
          {isAdmin && (
            <div className="space-y-4 mt-4">
              <Alert>
                <AlertTitle>Admin Account</AlertTitle>
                <AlertDescription>
                  You have administrator privileges. Be careful when making changes 
                  to system settings and user accounts.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={() => navigate('/admin')}
                className="w-full"
              >
                Go to Admin Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
