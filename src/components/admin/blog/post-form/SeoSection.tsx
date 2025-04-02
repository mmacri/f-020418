
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BlogPostInput, generateSeoSuggestions } from '@/services/blog';
import { useToast } from '@/hooks/use-toast';

interface SeoSectionProps {
  formData: BlogPostInput;
  onChange: (data: Partial<BlogPostInput>) => void;
}

export const SeoSection: React.FC<SeoSectionProps> = ({ 
  formData, 
  onChange 
}) => {
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleGenerateSeoSuggestions = () => {
    if (!formData.title || !formData.excerpt) {
      toast({
        title: 'Missing Info',
        description: 'Please add a title and excerpt before generating SEO suggestions.',
      });
      return;
    }

    const tempPost = {
      ...formData,
      id: 0,
      createdAt: '',
      updatedAt: '',
      published: true,
      date: new Date().toLocaleDateString()
    };

    const seoSuggestions = generateSeoSuggestions(tempPost);
    
    onChange({
      seoTitle: seoSuggestions.title,
      seoDescription: seoSuggestions.description,
      seoKeywords: seoSuggestions.keywords
    });

    toast({
      title: 'SEO Suggestions Generated',
      description: 'SEO title, description, and keywords have been updated.'
    });
  };

  const handleSeoKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
    onChange({ seoKeywords: keywords });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">SEO Details</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={handleGenerateSeoSuggestions}
        >
          Generate SEO Suggestions
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="seoTitle">SEO Title</Label>
        <Input
          id="seoTitle"
          name="seoTitle"
          value={formData.seoTitle || ''}
          onChange={handleInputChange}
          placeholder="SEO optimized title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="seoDescription">SEO Description</Label>
        <Textarea
          id="seoDescription"
          name="seoDescription"
          value={formData.seoDescription || ''}
          onChange={handleInputChange}
          rows={2}
          placeholder="SEO optimized description"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="seoKeywords">SEO Keywords (comma separated)</Label>
        <Input
          id="seoKeywords"
          name="seoKeywords"
          value={formData.seoKeywords?.join(', ') || ''}
          onChange={handleSeoKeywordsChange}
          placeholder="keyword1, keyword2, keyword3"
        />
      </div>
    </div>
  );
};
