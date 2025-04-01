
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Post, Comment } from '@/types/social';
import { formatDistanceToNow } from 'date-fns';
import { ImageWithFallback } from '@/lib/images/ImageWithFallback';
import {
  MessageSquare,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Send
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  isOwner: boolean;
  onAddComment: (postId: string, content: string) => Promise<Comment | null>;
  onAddReaction: (type: 'like' | 'heart' | 'thumbs_up' | 'thumbs_down', postId: string) => Promise<any>;
  onDeletePost: (postId: string) => Promise<boolean>;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  isOwner,
  onAddComment,
  onAddReaction,
  onDeletePost
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(post.id, commentText);
      setCommentText('');
      setShowComments(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReaction = (type: 'like' | 'heart' | 'thumbs_up' | 'thumbs_down') => {
    onAddReaction(type, post.id);
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await onDeletePost(post.id);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Link to={`/profile/${post.user?.id}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.user?.avatar_url || undefined} alt={post.user?.display_name || ""} />
              <AvatarFallback>
                {post.user?.display_name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <Link to={`/profile/${post.user?.id}`} className="font-semibold hover:underline">
                  {post.user?.display_name || "Unknown User"}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
              
              {isOwner && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDelete}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
            
            <div className="mt-2 whitespace-pre-wrap break-words">
              {post.content}
            </div>
            
            {post.image_url && (
              <div className="mt-3 rounded-md overflow-hidden">
                <ImageWithFallback
                  src={post.image_url}
                  alt="Post image"
                  className="max-h-96 w-full object-cover"
                  fallbackSrc="https://ext.same-assets.com/2651616194/3622592620.jpeg"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col px-6 pt-0 pb-4">
        <div className="flex justify-between items-center w-full py-2">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('heart')}
              className={`px-2 text-xs gap-1 ${post.reaction_counts?.heart ? 'text-pink-500' : 'text-muted-foreground'}`}
            >
              <Heart size={16} className={post.reaction_counts?.heart ? 'fill-pink-500' : ''} />
              {post.reaction_counts?.heart || 0}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('thumbs_up')}
              className={`px-2 text-xs gap-1 ${post.reaction_counts?.thumbs_up ? 'text-green-500' : 'text-muted-foreground'}`}
            >
              <ThumbsUp size={16} className={post.reaction_counts?.thumbs_up ? 'fill-green-500' : ''} />
              {post.reaction_counts?.thumbs_up || 0}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('thumbs_down')}
              className={`px-2 text-xs gap-1 ${post.reaction_counts?.thumbs_down ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <ThumbsDown size={16} className={post.reaction_counts?.thumbs_down ? 'fill-red-500' : ''} />
              {post.reaction_counts?.thumbs_down || 0}
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="px-2 text-xs gap-1 text-muted-foreground"
          >
            <MessageSquare size={16} />
            {post.comments?.length || 0} Comments
          </Button>
        </div>
        
        {showComments && (
          <>
            <Separator className="my-2" />
            
            <div className="w-full mt-2">
              <div className="flex items-start gap-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[60px] text-sm"
                />
                <Button 
                  size="icon" 
                  onClick={handleAddComment} 
                  disabled={isSubmitting || !commentText.trim()}
                >
                  <Send size={16} />
                </Button>
              </div>
              
              {post.comments && post.comments.length > 0 && (
                <div className="mt-4 space-y-3">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user?.avatar_url || undefined} />
                        <AvatarFallback>
                          {comment.user?.display_name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-muted p-2 rounded-lg">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">
                            {comment.user?.display_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
