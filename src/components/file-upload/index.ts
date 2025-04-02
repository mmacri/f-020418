
import FileUploadWithPreview from './FileUploadWithPreview';

// Export sub-components for direct use if needed
export { 
  FileUploadWithPreview,
  default as ImagePreview
} from './ImagePreview';
export { default as UploadProgress } from './UploadProgress';
export { default as FileInput } from './FileInput';

// Default export for backward compatibility
export default FileUploadWithPreview;
