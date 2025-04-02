
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Send } from 'lucide-react';
import { Post, Comment } from '@/types/social';
import { formatDistanceToNow } from 'date-fns';

interface PostCommentsProps {
  post: Post;
  onAddComment: (content: string) => Promise<void>;
  isSubmitting: boolean;
}

export const PostComments: React.FC<PostCommentsProps> = ({
  post,
  onAddComment,
  isSubmitting
}) => {
  const [commentText, setCommentText] = useState('');

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await onAddComment(commentText);
    setCommentText('');
  };

  return (
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
  );
};
