
import { useState } from 'react';
import { Post, Comment, ReactionType } from '@/types/social';

interface UsePostCardProps {
  post: Post;
  onAddComment: (postId: string, content: string) => Promise<Comment | null>;
  onAddReaction: (type: ReactionType, postId: string) => Promise<any>;
  onDeletePost: (postId: string) => Promise<boolean>;
  isBookmarked?: boolean;
  onToggleBookmark?: (postId: string) => Promise<boolean>;
}

export const usePostCard = ({
  post,
  onAddComment,
  onAddReaction,
  onDeletePost,
  isBookmarked,
  onToggleBookmark
}: UsePostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookmarkStatus, setBookmarkStatus] = useState(isBookmarked || false);
  
  const handleAddComment = async (content: string) => {
    if (!content.trim()) return null;
    
    setIsSubmitting(true);
    try {
      const comment = await onAddComment(post.id, content);
      setShowComments(true);
      return comment;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReaction = (type: ReactionType) => {
    return onAddReaction(type, post.id);
  };
  
  const handleDelete = async () => {
    return onDeletePost(post.id);
  };
  
  const handleToggleBookmark = async () => {
    if (!onToggleBookmark) return false;
    
    const result = await onToggleBookmark(post.id);
    setBookmarkStatus(result);
    return result;
  };
  
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  
  return {
    showComments,
    isSubmitting,
    bookmarkStatus,
    setBookmarkStatus,
    handleAddComment,
    handleReaction,
    handleDelete,
    handleToggleBookmark,
    toggleComments
  };
};
