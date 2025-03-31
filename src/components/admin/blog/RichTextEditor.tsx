
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  rows = 15,
  className = '',
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  
  const getSelectionRange = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { start: 0, end: 0, text: '' };
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value.substring(start, end);
    
    return { start, end, text };
  };
  
  const replaceSelection = (startTag: string, endTag: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const { start, end, text } = getSelectionRange();
    
    // If no text is selected, insert tags at cursor position
    if (start === end) {
      const newValue = value.substring(0, start) + startTag + endTag + value.substring(end);
      onChange(newValue);
      
      // Set cursor position between tags
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + startTag.length;
        textarea.selectionEnd = start + startTag.length;
      }, 0);
    } else {
      // Wrap selected text with tags
      const newValue = value.substring(0, start) + startTag + text + endTag + value.substring(end);
      onChange(newValue);
      
      // Select the newly wrapped text
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + startTag.length;
        textarea.selectionEnd = start + startTag.length + text.length;
      }, 0);
    }
  };
  
  const handleBold = () => {
    replaceSelection('**', '**');
  };
  
  const handleItalic = () => {
    replaceSelection('*', '*');
  };
  
  const handleBulletList = () => {
    const { start, text } = getSelectionRange();
    
    // Check if cursor is at beginning of line
    const isStartOfLine = start === 0 || value.charAt(start - 1) === '\n';
    
    if (text) {
      // Split selected text into lines
      const lines = text.split('\n');
      const formattedLines = lines.map(line => `- ${line}`).join('\n');
      replaceSelection(isStartOfLine ? '' : '\n', '');
      replaceSelection(formattedLines, '\n');
    } else {
      replaceSelection(isStartOfLine ? '- ' : '\n- ', '');
    }
  };
  
  const handleNumberedList = () => {
    const { start, text } = getSelectionRange();
    
    // Check if cursor is at beginning of line
    const isStartOfLine = start === 0 || value.charAt(start - 1) === '\n';
    
    if (text) {
      // Split selected text into lines
      const lines = text.split('\n');
      const formattedLines = lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
      replaceSelection(isStartOfLine ? '' : '\n', '');
      replaceSelection(formattedLines, '\n');
    } else {
      replaceSelection(isStartOfLine ? '1. ' : '\n1. ', '');
    }
  };
  
  const handleLink = () => {
    if (linkUrl && linkText) {
      replaceSelection(`[${linkText}](${linkUrl})`, '');
      setLinkUrl('');
      setLinkText('');
    } else if (linkUrl) {
      const { text } = getSelectionRange();
      replaceSelection(`[${text || linkUrl}](${linkUrl})`, '');
      setLinkUrl('');
    }
  };
  
  const handleImage = (url: string, alt: string = 'Image') => {
    replaceSelection(`![${alt}](${url})`, '');
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-1 bg-muted/40 rounded-md p-1 border-b">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleBold}
          title="Bold"
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleItalic}
          title="Italic"
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleBulletList}
          title="Bullet List"
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleNumberedList}
          title="Numbered List"
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              title="Insert Link"
              className="h-8 w-8 p-0"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Insert Link</h4>
              <div className="space-y-2">
                <Label htmlFor="link-text">Link Text</Label>
                <Input 
                  id="link-text" 
                  value={linkText} 
                  onChange={(e) => setLinkText(e.target.value)} 
                  placeholder="Text to display"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-url">URL</Label>
                <Input 
                  id="link-url" 
                  value={linkUrl} 
                  onChange={(e) => setLinkUrl(e.target.value)} 
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  variant="default" 
                  size="sm" 
                  onClick={handleLink}
                  disabled={!linkUrl}
                >
                  Insert Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="font-mono resize-y"
      />
      
      <div className="text-xs text-muted-foreground">
        <p>Formatting: <strong>**bold**</strong>, <em>*italic*</em>, [link text](url), ![alt text](image-url)</p>
        <p>Lists: Start a line with "- " for bullets or "1. " for numbered lists</p>
      </div>
    </div>
  );
};

export default RichTextEditor;
