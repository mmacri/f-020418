
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { UserProfile, Post } from "@/types/social";
import { CreatePostForm } from "@/components/social/CreatePostForm";
import { PostCard } from "@/components/social/PostCard";

interface ProfilePostsTabProps {
  profile: UserProfile;
  posts: Post[];
  isCurrentUser: boolean;
  createPost: (content: string, imageFile?: File) => Promise<any>;
  addComment: (postId: string, content: string) => Promise<any>;
  addReaction: (type: 'like' | 'heart' | 'thumbs_up' | 'thumbs_down', postId: string) => Promise<any>;
  deletePost: (postId: string) => Promise<boolean>;
  bookmarkPost?: (postId: string) => Promise<boolean>;
  isBookmarked?: (postId: string) => Promise<boolean>;
  isUploading?: boolean;
}

export const ProfilePostsTab: React.FC<ProfilePostsTabProps> = ({
  profile,
  posts,
  isCurrentUser,
  createPost,
  addComment,
  addReaction,
  deletePost,
  bookmarkPost,
  isBookmarked,
  isUploading
}) => {
  const [postBookmarkStates, setPostBookmarkStates] = useState<Record<string, boolean>>({});
  
  // Load initial bookmark states if function is provided
  useEffect(() => {
    const loadBookmarkStates = async () => {
      if (isBookmarked && posts.length > 0) {
        const bookmarkStates: Record<string, boolean> = {};
        
        // Check bookmark status for each post
        for (const post of posts) {
          bookmarkStates[post.id] = await isBookmarked(post.id);
        }
        
        setPostBookmarkStates(bookmarkStates);
      }
    };
    
    loadBookmarkStates();
  }, [posts, isBookmarked]);
  
  // Handle bookmark toggle
  const handleToggleBookmark = async (postId: string) => {
    if (bookmarkPost) {
      const isNowBookmarked = await bookmarkPost(postId);
      setPostBookmarkStates(prev => ({
        ...prev,
        [postId]: isNowBookmarked
      }));
      return isNowBookmarked;
    }
    return false;
  };

  return (
    <div className="space-y-4">
      {isCurrentUser && (
        <CreatePostForm 
          profile={profile} 
          onCreatePost={createPost} 
          isUploading={isUploading}
        />
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
              isBookmarked={postBookmarkStates[post.id]}
              onToggleBookmark={() => handleToggleBookmark(post.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
