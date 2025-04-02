
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
      // Create local preview immediately for better UX
      const localPreviewUrl = URL.createObjectURL(file);
      // Don't set the preview yet, wait for upload to avoid showing blob URLs that cause errors
      
      setProgress(30); // Update progress

      // Upload to storage
      console.log(`Uploading file to bucket: ${bucket}, folder: ${folder}`);
      toast({
        title: "Uploading image",
        description: "Your image is being uploaded...",
      });

      const { url, error } = await uploadFile(file, {
        bucket,
        folder,
        fileTypes: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        maxSize: maxSize * 1024 * 1024
      });

      setProgress(90); // Almost done

      if (error) {
        setError(error);
        toast({
          title: "Upload failed",
          description: error,
          variant: "destructive",
        });
        // Clean up the object URL to avoid memory leaks
        URL.revokeObjectURL(localPreviewUrl);
        return;
      }

      console.log('File uploaded successfully:', url);
      
      // Clean up the object URL to avoid memory leaks
      URL.revokeObjectURL(localPreviewUrl);
      
      // Update the preview with the actual remote URL
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
