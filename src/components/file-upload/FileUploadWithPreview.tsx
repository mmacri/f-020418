
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/file-upload";

export interface FileUploadWithPreviewProps {
  onFileChange: (url: string) => void;
  currentImage?: string;
  className?: string;
  accept?: string;
  maxSize?: number;
  bucket?: string;
  folder?: string;
  aspectRatio?: "square" | "landscape" | "portrait";
  imageType?: "product" | "category" | "blog" | "hero";
}

const FileUploadWithPreview = ({
  onFileChange,
  currentImage,
  className,
  accept = "image/*",
  maxSize = 5,
  bucket = "product-images",
  folder = "",
  aspectRatio = "square",
  imageType = "product"
}: FileUploadWithPreviewProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentImage changes
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (!file) {
      return;
    }

    // Basic validation
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    setError(null);
    
    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Start upload
    setIsUploading(true);
    setProgress(0);

    // Simulate progress - this would be replaced with real progress in a production app
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 90 ? 90 : newProgress;
      });
    }, 200);

    try {
      console.log(`Uploading file to ${bucket}/${folder} as type ${imageType}`);
      
      const result = await uploadFile(file, {
        bucket,
        folder,
        fileTypes: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        maxSize: maxSize * 1024 * 1024,
        imageType
      });
      
      clearInterval(progressInterval);
      
      if (result.error) {
        console.error('Upload error:', result.error);
        setError(result.error);
        setProgress(0);
      } else {
        console.log('Upload successful:', result.url);
        setProgress(100);
        // Small delay to show 100% progress
        setTimeout(() => {
          onFileChange(result.url);
        }, 300);
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error('Upload failed:', err);
      setError(err.message || 'Upload failed');
      setProgress(0);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const clearFile = () => {
    setPreview(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors",
          error ? "border-destructive" : "border-muted-foreground/25",
          isUploading ? "opacity-70 cursor-wait" : "cursor-pointer"
        )}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="relative w-full aspect-video bg-muted/20">
            <img 
              src={preview} 
              alt="File preview" 
              className="h-full max-h-[300px] mx-auto object-contain" 
            />
            {!isUploading && (
              <Button 
                type="button" 
                variant="destructive" 
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center gap-2">
            <div className="bg-muted rounded-full p-3">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium">
                Click to upload {isUploading ? '(uploading...)' : 'or drag and drop'}
              </p>
              <p className="text-sm text-muted-foreground">
                SVG, PNG, JPG or GIF (max. {maxSize}MB)
              </p>
            </div>
          </div>
        )}
        
        {isUploading && (
          <div className="mt-2">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-in-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {progress < 100 ? `Uploading... ${Math.round(progress)}%` : 'Upload complete!'}
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
      </div>
      
      {error && <p className="text-destructive text-sm">{error}</p>}
      
      {isUploading && (
        <div className="flex justify-center">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            disabled={!isUploading}
            onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel Upload
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploadWithPreview;
export type { FileUploadWithPreviewProps };
