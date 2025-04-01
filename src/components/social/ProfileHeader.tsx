
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCircle, 
  Users, 
  MessageSquare, 
  Settings, 
  UserPlus, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserProfile, Friendship } from '@/types/social';

interface ProfileHeaderProps {
  profile: UserProfile;
  postCount: number;
  friendCount: number;
  isCurrentUser: boolean;
  friendshipStatus: 'none' | 'pending' | 'accepted' | 'requested';
  pendingRequests?: Friendship[];
  onSendFriendRequest?: (recipientId: string) => Promise<any>;
  onUpdateProfile?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  postCount,
  friendCount,
  isCurrentUser,
  friendshipStatus,
  pendingRequests,
  onSendFriendRequest,
  onUpdateProfile
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  
  const handleSendFriendRequest = async () => {
    if (!onSendFriendRequest) return;
    
    setIsRequesting(true);
    try {
      await onSendFriendRequest(profile.id);
    } finally {
      setIsRequesting(false);
    }
  };
  
  return (
    <div className="mb-8">
      <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
      
      <div className="px-4 sm:px-8 relative -mt-12 sm:-mt-16">
        <div className="flex flex-col sm:flex-row items-center sm:items-end">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white bg-white">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name} />
            <AvatarFallback className="text-2xl">
              {profile.display_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left flex-1 mb-4">
            <h1 className="text-2xl font-bold">{profile.display_name}</h1>
            {profile.bio && (
              <p className="text-muted-foreground mt-1 max-w-xl">
                {profile.bio}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge variant="secondary" className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{postCount} Posts</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{friendCount} Friends</span>
              </Badge>
              {!profile.is_public && (
                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                  Private Profile
                </Badge>
              )}
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 justify-center mb-4">
            {isCurrentUser ? (
              <>
                <Button variant="outline" className="gap-2" onClick={onUpdateProfile}>
                  <Settings size={16} />
                  <span>Edit Profile</span>
                </Button>
                {pendingRequests && pendingRequests.length > 0 && (
                  <Link to="/profile/requests">
                    <Button variant="secondary" className="gap-2">
                      <Clock size={16} />
                      <span>{pendingRequests.length} Friend Requests</span>
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                {friendshipStatus === 'none' && (
                  <Button 
                    onClick={handleSendFriendRequest} 
                    disabled={isRequesting}
                    className="gap-2"
                  >
                    <UserPlus size={16} />
                    <span>Add Friend</span>
                  </Button>
                )}
                {friendshipStatus === 'pending' && (
                  <Button variant="outline" disabled className="gap-2">
                    <Clock size={16} />
                    <span>Request Sent</span>
                  </Button>
                )}
                {friendshipStatus === 'requested' && (
                  <Button variant="secondary" className="gap-2">
                    <CheckCircle2 size={16} />
                    <span>Respond to Request</span>
                  </Button>
                )}
                {friendshipStatus === 'accepted' && (
                  <Button variant="outline" className="gap-2">
                    <CheckCircle2 size={16} />
                    <span>Friends</span>
                  </Button>
                )}
                <Link to={`/message/${profile.id}`}>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare size={16} />
                    <span>Message</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
