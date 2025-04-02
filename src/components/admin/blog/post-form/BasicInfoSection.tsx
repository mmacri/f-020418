
import React from 'react';
import { FileText } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { BlogPostFormValues } from './schema';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage 
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '../RichTextEditor';
import BlogImageUploader from '../BlogImageUploader';

export const BasicInfoSection: React.FC = () => {
  const { control, setValue, watch } = useFormContext<BlogPostFormValues>();
  const content = watch('content');

  const handleContentChange = (value: string) => {
    setValue('content', value, { 
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handleImageInsert = (url: string) => {
    const imageMarkdown = `![Image](${url})`;
    const newContent = content + (content.endsWith('\n') ? '' : '\n') + imageMarkdown + '\n';
    setValue('content', newContent, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center">
        <FileText className="mr-2 h-5 w-5" /> Basic Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="auto-generated-if-left-empty"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="excerpt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Excerpt</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                rows={2}
                placeholder="A brief summary of the post"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <div className="border rounded-md p-2 bg-card">
                <RichTextEditor
                  value={field.value}
                  onChange={handleContentChange}
                  rows={12}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex justify-end mt-2">
        <BlogImageUploader
          onImageChange={() => {}}
          insertIntoEditor={handleImageInsert}
        />
      </div>
    </div>
  );
};
