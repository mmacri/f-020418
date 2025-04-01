
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { UserProfile, Post } from "@/types/social";
import { CreatePostForm } from "@/components/social/CreatePostForm";
import { PostCard } from "@/components/social/PostCard";

interface ProfilePostsTabProps {
  profile: UserProfile;
  posts: Post[];
  isCurrentUser: boolean;
  createPost: (content: string, imageUrl?: string) => Promise<any>;
  addComment: (postId: string, content: string) => Promise<any>;
  addReaction: (type: 'like' | 'heart' | 'thumbs_up' | 'thumbs_down', postId: string) => Promise<any>;
  deletePost: (postId: string) => Promise<boolean>;
}

export const ProfilePostsTab: React.FC<ProfilePostsTabProps> = ({
  profile,
  posts,
  isCurrentUser,
  createPost,
  addComment,
  addReaction,
  deletePost
}) => {
  return (
    <div className="space-y-4">
      {isCurrentUser && (
        <CreatePostForm profile={profile} onCreatePost={createPost} />
      )}
      
      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No posts yet</h3>
            <p className="text-muted-foreground">
              {isCurrentUser 
                ? "Create your first post to share with friends." 
                : `${profile.display_name} hasn't posted anything yet.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              isOwner={isCurrentUser}
              onAddComment={addComment}
              onAddReaction={addReaction}
              onDeletePost={deletePost}
            />
          ))}
        </div>
      )}
    </div>
  );
};
