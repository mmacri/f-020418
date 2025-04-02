
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BlogImageTabs } from './index';

interface BlogImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  insertIntoEditor?: (imageUrl: string) => void;
}

const BlogImageDialog: React.FC<BlogImageDialogProps> = ({
  isOpen,
  onClose,
  currentImage,
  onImageChange,
  insertIntoEditor
}) => {
  const handleImageSelect = (url: string) => {
    onImageChange(url);
    if (insertIntoEditor) {
      insertIntoEditor(url);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{insertIntoEditor ? 'Insert Image' : 'Upload Blog Image'}</DialogTitle>
        </DialogHeader>
        
        <BlogImageTabs
          currentImage={currentImage}
          onImageSelect={handleImageSelect}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BlogImageDialog;
