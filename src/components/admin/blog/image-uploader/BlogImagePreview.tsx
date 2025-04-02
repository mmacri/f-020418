
import React from 'react';
import { ImageWithFallback } from '@/lib/images';

interface BlogImagePreviewProps {
  title: string;
  imageUrl: string;
}

const BlogImagePreview: React.FC<BlogImagePreviewProps> = ({
  title,
  imageUrl
}) => {
  return (
    <div className="border rounded-md p-2 bg-muted/30">
      <p className="text-sm font-medium mb-2">{title}:</p>
      <div className="aspect-video bg-muted/20 rounded overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt="Blog image preview"
          className="h-full w-full object-contain"
          type="blog"
        />
      </div>
    </div>
  );
};

export default BlogImagePreview;
