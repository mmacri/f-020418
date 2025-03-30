
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '@/lib/file-upload';
import { toast } from 'sonner';

interface FileUploadWithPreviewProps {
  onFileChange: (url: string) => void;
  currentImage?: string;
  bucket: 'product-images' | 'category-images' | 'blog-images';
  folder?: string;
  maxSize?: number; // in MB
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  className?: string;
}

const FileUploadWithPreview: React.FC<FileUploadWithPreviewProps> = ({
  onFileChange,
  currentImage,
  bucket,
  folder,
  maxSize = 5, // Default max size: 5MB
  aspectRatio = 'landscape',
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const aspectRatioClass = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]'
  }[aspectRatio];
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload the file
    setIsUploading(true);
    
    try {
      const { url, error } = await uploadFile(file, {
        bucket,
        folder,
        fileTypes: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
        maxSize: maxSize * 1024 * 1024 // Convert MB to bytes
      });
      
      if (error) {
        toast.error(error);
        return;
      }
      
      toast.success('File uploaded successfully');
      onFileChange(url);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveImage = () => {
    setPreview(null);
    onFileChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,image/gif,image/webp"
      />
      
      {preview ? (
        <div className={`relative border rounded-md overflow-hidden ${aspectRatioClass} bg-muted/30`}>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 transition-opacity">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={handleButtonClick}
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Replace
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md ${aspectRatioClass} cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors border-muted-foreground/25`}
          onClick={handleButtonClick}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Click to upload an image or<br />drag and drop here
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                JPG, PNG, WEBP or GIF (max. {maxSize}MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadWithPreview;
