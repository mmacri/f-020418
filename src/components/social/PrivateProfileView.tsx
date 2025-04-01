
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, UserCircle } from "lucide-react";
import { UserProfile } from "@/types/social";

interface PrivateProfileViewProps {
  profile: UserProfile;
  friendshipStatus: 'none' | 'pending' | 'accepted' | 'requested';
  onSendFriendRequest: (recipientId: string) => Promise<any>;
}

export const PrivateProfileView: React.FC<PrivateProfileViewProps> = ({
  profile,
  friendshipStatus,
  onSendFriendRequest
}) => {
  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <div className="mb-8">
        <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
        <div className="px-4 sm:px-8 relative -mt-12 sm:-mt-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-end">
            <div className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white bg-white rounded-full flex items-center justify-center">
              <UserCircle className="h-16 w-16 sm:h-24 sm:w-24 text-gray-300" />
            </div>
            
            <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left flex-1 mb-4">
              <h1 className="text-2xl font-bold">{profile.display_name}</h1>
              <div className="mt-2">
                <div className="inline-block bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1 text-sm">
                  Private Profile
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-8 text-center">
          <div className="mb-4 text-amber-500">
            <AlertTriangle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">This profile is private</h2>
          <p className="text-muted-foreground mb-4">
            {profile.display_name} has set their profile to private. 
            {friendshipStatus === 'pending' 
              ? " Your friend request is pending." 
              : " Send a friend request to connect."}
          </p>
          
          {friendshipStatus === 'none' && (
            <button 
              onClick={() => onSendFriendRequest(profile.id)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Send Friend Request
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
