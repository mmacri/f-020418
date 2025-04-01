
import React from "react";
import { User } from "@/services/userService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user, size = "md" }) => {
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getAvatarSize = () => {
    switch (size) {
      case "sm": return "h-8 w-8";
      case "lg": return "h-16 w-16";
      default: return "h-12 w-12"; // md
    }
  };

  return (
    <Avatar className={getAvatarSize()}>
      <AvatarImage 
        src={user.avatar} 
        alt={user.name || "User"} 
      />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitials(user.name || user.email)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
