
import React from "react";

interface ProfileAvatarProps {
  avatarUrl?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl }) => {
  if (!avatarUrl) return null;
  
  return (
    <div className="mt-2">
      <p className="text-sm font-medium mb-2">Current Avatar:</p>
      <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
        <img 
          src={avatarUrl} 
          alt="Profile avatar" 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://ext.same-assets.com/2651616194/3622592620.jpeg";
          }}
        />
      </div>
    </div>
  );
};

export default ProfileAvatar;
