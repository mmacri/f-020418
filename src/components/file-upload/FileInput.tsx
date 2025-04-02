
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface FileInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  id?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  onChange,
  disabled = false,
  error = null,
  inputRef,
  id = "image-upload"
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Upload Image</Label>
      <Input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        onChange={onChange}
        disabled={disabled}
      />
      {error && (
        <div className="flex items-center text-sm text-red-500 mt-1">
          <AlertCircle className="h-4 w-4 mr-1" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileInput;
