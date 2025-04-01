
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { UserProfile, Friendship } from "@/types/social";
import { FriendRequestCard } from "@/components/social/FriendRequestCard";

interface ProfileFriendsTabProps {
  profile: UserProfile;
  friends: Friendship[];
  pendingFriendRequests: Friendship[];
  isCurrentUser: boolean;
  respondToFriendRequest: (requestId: string, accept: boolean) => Promise<any>;
}

export const ProfileFriendsTab: React.FC<ProfileFriendsTabProps> = ({
  profile,
  friends,
  pendingFriendRequests,
  isCurrentUser,
  respondToFriendRequest
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      {isCurrentUser && pendingFriendRequests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Friend Requests ({pendingFriendRequests.length})</h3>
          <div className="space-y-3">
            {pendingFriendRequests.map((request) => (
              <FriendRequestCard 
                key={request.id} 
                request={request} 
                onRespond={respondToFriendRequest} 
              />
            ))}
          </div>
        </div>
      )}
      
      <h3 className="text-lg font-medium mb-3">Friends ({friends.length})</h3>
      
      {friends.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No friends yet</h3>
            <p className="text-muted-foreground">
              {isCurrentUser 
                ? "Connect with others by sending friend requests." 
                : `${profile.display_name} hasn't added any friends yet.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {friends.map((friendship) => {
            const friendProfile = friendship.requestor?.id === profile.id
              ? friendship.recipient
              : friendship.requestor;
              
            if (!friendProfile) return null;
            
            return (
              <Card key={friendship.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4" onClick={() => navigate(`/profile/${friendProfile.id}`)} style={{ cursor: 'pointer' }}>
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                        {friendProfile.avatar_url ? (
                          <img 
                            src={friendProfile.avatar_url} 
                            alt={friendProfile.display_name} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://ext.same-assets.com/2651616194/3622592620.jpeg";
                            }} 
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground">
                            {friendProfile.display_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">{friendProfile.display_name}</h4>
                      <p className="text-sm text-muted-foreground">Friends</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
