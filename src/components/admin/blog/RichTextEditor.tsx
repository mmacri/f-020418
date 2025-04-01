
import React, { useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  rows = 10,
  placeholder = "Write your content here..."
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    adjustHeight();
    textarea.addEventListener('input', adjustHeight);
    return () => textarea.removeEventListener('input', adjustHeight);
  }, [value]);

  // Basic Markdown highlighting could be added here in a more complex implementation

  return (
    <div className="rich-text-editor">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="min-h-[200px] font-mono"
      />
      
      <div className="text-xs text-muted-foreground mt-2">
        <p>Supports Markdown: **bold**, *italic*, [link](url), ![image](url), # Heading, etc.</p>
      </div>
    </div>
  );
};

export default RichTextEditor;
