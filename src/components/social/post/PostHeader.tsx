
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bookmark, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '@/types/social';

interface PostHeaderProps {
  post: Post;
  isOwner: boolean;
  bookmarkStatus: boolean;
  onToggleBookmark?: () => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  post,
  isOwner,
  bookmarkStatus,
  onToggleBookmark,
  onDelete
}) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await onDelete?.();
    }
  };

  return (
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
          
          <div className="flex gap-2">
            {onToggleBookmark && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleBookmark}
                className={`h-8 w-8 ${bookmarkStatus ? 'text-blue-500' : 'text-muted-foreground'}`}
              >
                <Bookmark size={16} className={bookmarkStatus ? 'fill-blue-500' : ''} />
              </Button>
            )}
            
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
        </div>
      </div>
    </div>
  );
};
