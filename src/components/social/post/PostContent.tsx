
import React from 'react';
import { ImageWithFallback } from '@/lib/images/ImageWithFallback';
import { Post } from '@/types/social';

interface PostContentProps {
  post: Post;
}

export const PostContent: React.FC<PostContentProps> = ({ post }) => {
  return (
    <div className="mt-2">
      <div className="whitespace-pre-wrap break-words">
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
  );
};
