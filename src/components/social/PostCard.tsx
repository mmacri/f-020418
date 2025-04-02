
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Post, Comment, ReactionType } from '@/types/social';
import { PostHeader } from './post/PostHeader';
import { PostContent } from './post/PostContent';
import { PostReactions } from './post/PostReactions';
import { PostComments } from './post/PostComments';

interface PostCardProps {
  post: Post;
  isOwner: boolean;
  onAddComment: (postId: string, content: string) => Promise<Comment | null>;
  onAddReaction: (type: ReactionType, postId: string) => Promise<any>;
  onDeletePost: (postId: string) => Promise<boolean>;
  isBookmarked?: boolean;
  onToggleBookmark?: (postId: string) => Promise<boolean>;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  isOwner,
  onAddComment,
  onAddReaction,
  onDeletePost,
  isBookmarked,
  onToggleBookmark
}) => {
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookmarkStatus, setBookmarkStatus] = useState(isBookmarked || false);
  
  useEffect(() => {
    if (isBookmarked !== undefined) {
      setBookmarkStatus(isBookmarked);
    }
  }, [isBookmarked]);
  
  const handleAddComment = async (content: string) => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(post.id, content);
      setShowComments(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReaction = (type: ReactionType) => {
    onAddReaction(type, post.id);
  };
  
  const handleDelete = async () => {
    await onDeletePost(post.id);
  };
  
  const handleToggleBookmark = async () => {
    if (onToggleBookmark) {
      const result = await onToggleBookmark(post.id);
      setBookmarkStatus(result);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <PostHeader 
          post={post} 
          isOwner={isOwner} 
          bookmarkStatus={bookmarkStatus}
          onToggleBookmark={onToggleBookmark ? handleToggleBookmark : undefined}
          onDelete={isOwner ? handleDelete : undefined}
        />
        
        <div className="ml-14">
          <PostContent post={post} />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col px-6 pt-0 pb-4">
        <PostReactions 
          post={post} 
          onReaction={handleReaction}
          onToggleComments={() => setShowComments(!showComments)}
          showComments={showComments}
        />
        
        {showComments && (
          <PostComments 
            post={post} 
            onAddComment={handleAddComment}
            isSubmitting={isSubmitting}
          />
        )}
      </CardFooter>
    </Card>
  );
};
