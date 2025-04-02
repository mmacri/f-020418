import React, { useState, useRef, useEffect } from 'react';
import { uploadFile } from '@/lib/file-upload';
import { useToast } from '@/hooks/use-toast';
import FileInput from './FileInput';
import UploadProgress from './UploadProgress';
import ImagePreview from './ImagePreview';

export interface FileUploadWithPreviewProps {
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
  folder = 'uploads',
  maxSize = 2,
  aspectRatio = 'square',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Set initial preview based on currentImage prop
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSize}MB.`);
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize}MB.`,
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WEBP).');
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, GIF, or WEBP image.",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress(10); // Start progress

    try {
      // Show temporary preview immediately for better UX
      const localPreviewUrl = URL.createObjectURL(file);
      // Only set temporary preview if we don't already have an image
      if (!preview) {
        setPreview(localPreviewUrl);
      }
      
      setProgress(30); // Update progress

      // Upload to storage with image type based on aspect ratio
      console.log(`Uploading file to bucket: ${bucket}, folder: ${folder}`);
      toast({
        title: "Uploading image",
        description: "Your image is being uploaded and optimized...",
      });

      // Determine image type based on bucket and aspect ratio
      const imageType = bucket === 'blog-images' 
        ? 'blog'
        : bucket === 'category-images'
          ? 'category'
          : folder === 'hero'
            ? 'hero'
            : 'product';

      const { url, error } = await uploadFile(file, {
        bucket,
        folder,
        fileTypes: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        maxSize: maxSize * 1024 * 1024,
        imageType
      });

      setProgress(90); // Almost done

      if (error) {
        setError(error);
        toast({
          title: "Upload failed",
          description: error,
          variant: "destructive",
        });
        
        // Clean up the object URL
        URL.revokeObjectURL(localPreviewUrl);
        
        // Keep existing preview if there was an error
        if (currentImage) {
          setPreview(currentImage);
        }
        return;
      }

      console.log('File uploaded successfully:', url);
      
      // Clean up the temporary object URL
      URL.revokeObjectURL(localPreviewUrl);
      
      // Now that we have the real URL, update the preview
      setPreview(url);
      setProgress(100); // Done
      
      toast({
        title: "Upload complete",
        description: "Your image was uploaded successfully.",
      });

      // Pass the URL back to the parent component
      onFileChange(url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 1000); // Keep progress visible briefly
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Let parent component know the image was cleared
    onFileChange('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <FileInput 
        onChange={handleFileSelect} 
        disabled={isUploading} 
        error={error} 
        inputRef={fileInputRef} 
      />
      
      <UploadProgress 
        progress={progress} 
        isVisible={isUploading} 
      />
      
      <ImagePreview 
        preview={preview} 
        isUploading={isUploading} 
        onClear={clearPreview} 
        aspectRatio={aspectRatio} 
      />
    </div>
  );
};

export default FileUploadWithPreview;
