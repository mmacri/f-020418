
import React from 'react';
import { Loader2 } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  isVisible: boolean;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="w-full space-y-1">
      <div className="bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-blue-600 mt-1 flex items-center">
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        Uploading... {progress}%
      </p>
    </div>
  );
};

export default UploadProgress;
