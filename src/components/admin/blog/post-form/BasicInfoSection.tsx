
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { BlogPostInput } from '@/services/blog';
import RichTextEditor from '../RichTextEditor';
import BlogImageUploader from '../BlogImageUploader';

interface BasicInfoSectionProps {
  formData: BlogPostInput;
  onChange: (data: Partial<BlogPostInput>) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ 
  formData, 
  onChange 
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleContentChange = (value: string) => {
    onChange({ content: value });
  };

  const handleImageInsert = (url: string) => {
    const imageMarkdown = `![Image](${url})`;
    const newContent = formData.content + (formData.content.endsWith('\n') ? '' : '\n') + imageMarkdown + '\n';
    onChange({ content: newContent });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center">
        <FileText className="mr-2 h-5 w-5" /> Basic Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Post Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="auto-generated-if-left-empty"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          rows={2}
          placeholder="A brief summary of the post"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <div className="border rounded-md p-2 bg-card">
          <RichTextEditor
            value={formData.content}
            onChange={handleContentChange}
            rows={12}
          />
        </div>
        <div className="flex justify-end mt-2">
          <BlogImageUploader
            onImageChange={() => {}}
            insertIntoEditor={handleImageInsert}
          />
        </div>
      </div>
    </div>
  );
};
