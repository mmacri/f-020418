
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { BlogPostInput, BlogCategory } from '@/services/blog';

interface PublicationSectionProps {
  formData: BlogPostInput;
  onChange: (data: Partial<BlogPostInput>) => void;
  categories: BlogCategory[];
}

export const PublicationSection: React.FC<PublicationSectionProps> = ({ 
  formData, 
  onChange,
  categories 
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    onChange({ [name]: checked });
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find(cat => cat.id === value);
    
    onChange({
      category_id: value,
      category: selectedCategory ? selectedCategory.name : 'General'
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center">
        <Calendar className="mr-2 h-5 w-5" /> Publication Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Publication Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category_id}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="scheduledDate">Schedule Post (Optional)</Label>
          <Input
            id="scheduledDate"
            name="scheduledDate"
            type="datetime-local"
            value={formData.scheduledDate}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => handleSwitchChange('published', checked)}
        />
        <Label htmlFor="published">Publish immediately</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={!!formData.featured}
          onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
        />
        <Label htmlFor="featured">Featured post (shows at the top of the blog page)</Label>
      </div>
    </div>
  );
};
