
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus } from 'lucide-react';
import { BlogImageDialog } from './index';

interface BlogImageUploaderProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  insertIntoEditor?: (imageUrl: string) => void;
}

const BlogImageUploader: React.FC<BlogImageUploaderProps> = ({
  currentImage,
  onImageChange,
  insertIntoEditor
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => setIsDialogOpen(true)} 
        className="flex items-center"
      >
        <ImagePlus className="h-4 w-4 mr-2" />
        {insertIntoEditor ? 'Insert Image' : 'Upload Cover Image'}
      </Button>
      
      <BlogImageDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentImage={currentImage}
        onImageChange={onImageChange}
        insertIntoEditor={insertIntoEditor}
      />
    </>
  );
};

export default BlogImageUploader;
