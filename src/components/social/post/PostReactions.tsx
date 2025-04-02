
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Post, ReactionType } from '@/types/social';

interface PostReactionsProps {
  post: Post;
  onReaction: (type: ReactionType) => void;
  onToggleComments: () => void;
  showComments: boolean;
}

export const PostReactions: React.FC<PostReactionsProps> = ({
  post,
  onReaction,
  onToggleComments,
  showComments
}) => {
  return (
    <div className="flex justify-between items-center w-full py-2">
      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReaction('heart')}
          className={`px-2 text-xs gap-1 ${post.reaction_counts?.heart ? 'text-pink-500' : 'text-muted-foreground'}`}
        >
          <Heart size={16} className={post.reaction_counts?.heart ? 'fill-pink-500' : ''} />
          {post.reaction_counts?.heart || 0}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReaction('thumbs_up')}
          className={`px-2 text-xs gap-1 ${post.reaction_counts?.thumbs_up ? 'text-green-500' : 'text-muted-foreground'}`}
        >
          <ThumbsUp size={16} className={post.reaction_counts?.thumbs_up ? 'fill-green-500' : ''} />
          {post.reaction_counts?.thumbs_up || 0}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReaction('thumbs_down')}
          className={`px-2 text-xs gap-1 ${post.reaction_counts?.thumbs_down ? 'text-red-500' : 'text-muted-foreground'}`}
        >
          <ThumbsDown size={16} className={post.reaction_counts?.thumbs_down ? 'fill-red-500' : ''} />
          {post.reaction_counts?.thumbs_down || 0}
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleComments}
        className="px-2 text-xs gap-1 text-muted-foreground"
      >
        <MessageSquare size={16} />
        {post.comments?.length || 0} Comments
      </Button>
    </div>
  );
};
