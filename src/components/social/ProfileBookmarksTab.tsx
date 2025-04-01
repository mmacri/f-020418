
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { UserProfile, Bookmark as BookmarkType } from "@/types/social";
import { PostCard } from "@/components/social/PostCard";

interface ProfileBookmarksTabProps {
  profile: UserProfile;
  bookmarks: BookmarkType[];
  addComment: (postId: string, content: string) => Promise<any>;
  addReaction: (type: 'like' | 'heart' | 'thumbs_up' | 'thumbs_down', postId: string) => Promise<any>;
  bookmarkPost: (postId: string) => Promise<boolean>;
}

export const ProfileBookmarksTab: React.FC<ProfileBookmarksTabProps> = ({
  profile,
  bookmarks,
  addComment,
  addReaction,
  bookmarkPost
}) => {
  return (
    <div className="space-y-4">
      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground">
              You haven't bookmarked any posts yet. When you find posts you'd like to save, click the bookmark icon to add them here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => bookmark.post && (
            <PostCard 
              key={bookmark.id} 
              post={bookmark.post} 
              isOwner={profile.id === bookmark.post.user_id}
              onAddComment={addComment}
              onAddReaction={addReaction}
              onDeletePost={() => Promise.resolve(false)}
              isBookmarked={true}
              onToggleBookmark={() => bookmarkPost(bookmark.post_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
