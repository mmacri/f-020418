
import React from 'react';
import { Input, Button } from '@/components/ui';
import { PlusCircle, Search } from 'lucide-react';

interface BlogPostHeaderProps {
  title: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreatePost: () => void;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({
  title,
  searchTerm,
  onSearchChange,
  onCreatePost
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <h2 className="text-3xl font-bold text-foreground">{title}</h2>
      <div className="flex w-full sm:w-auto space-x-2">
        <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search blog posts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button 
          onClick={onCreatePost}
          size="default"
          className="whitespace-nowrap"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Post
        </Button>
      </div>
    </div>
  );
};

export default BlogPostHeader;
