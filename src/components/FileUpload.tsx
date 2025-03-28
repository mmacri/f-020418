
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  currentImage?: string;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
}

export function FileUpload({
  onFileChange,
  currentImage,
  className,
  accept = "image/*",
  maxSizeMB = 5
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (!file) {
      setPreview(null);
      onFileChange(null);
      return;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    onFileChange(file);
  };

  const clearFile = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileChange(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer",
          error ? "border-destructive" : "border-muted-foreground/25"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="relative w-full aspect-video bg-muted/20">
            <img 
              src={preview} 
              alt="File preview" 
              className="h-full max-h-[300px] mx-auto object-contain" 
            />
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
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center gap-2">
            <div className="bg-muted rounded-full p-3">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-muted-foreground">
                SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
              </p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
