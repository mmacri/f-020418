
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, UserCircle, Bookmark } from "lucide-react";

interface ProfileTabListProps {
  isCurrentUser: boolean;
  isAdmin: boolean;
}

export const ProfileTabList: React.FC<ProfileTabListProps> = ({
  isCurrentUser,
  isAdmin
}) => {
  return (
    <TabsList className="grid w-full md:w-auto grid-cols-4 max-w-[500px]">
      <TabsTrigger value="posts" className="flex items-center gap-2">
        <MessageSquare size={16} />
        <span className="hidden sm:inline">Posts</span>
      </TabsTrigger>
      <TabsTrigger value="friends" className="flex items-center gap-2">
        <Users size={16} />
        <span className="hidden sm:inline">Friends</span>
      </TabsTrigger>
      {(isCurrentUser || isAdmin) && (
        <TabsTrigger value="bookmarks" className="flex items-center gap-2">
          <Bookmark size={16} />
          <span className="hidden sm:inline">Bookmarks</span>
        </TabsTrigger>
      )}
      <TabsTrigger value="about" className="flex items-center gap-2">
        <UserCircle size={16} />
        <span className="hidden sm:inline">About</span>
      </TabsTrigger>
    </TabsList>
  );
};
