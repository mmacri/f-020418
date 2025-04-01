
import React from 'react';
import { BlogPost } from '@/services/blog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  Button,
  Card,
  CardContent
} from '@/components/ui';
import { Pencil, Trash2, Loader2, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPostListProps {
  posts: BlogPost[];
  isLoading: boolean;
  searchTerm: string;
  onCreatePost: () => void;
  onEditPost: (post: BlogPost) => void;
  onDeletePost: (post: BlogPost) => void;
}

const BlogPostList: React.FC<BlogPostListProps> = ({
  posts,
  isLoading,
  searchTerm,
  onCreatePost,
  onEditPost,
  onDeletePost
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <Card className="border border-border shadow-sm bg-card">
        <CardContent className="pt-6 text-center py-12">
          <p className="mb-6 text-foreground text-lg">
            {searchTerm ? 'No blog posts match your search.' : 'No blog posts found. Create your first blog post to get started.'}
          </p>
          {!searchTerm && (
            <Button 
              onClick={onCreatePost}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Add Blog Post
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{post.category}</TableCell>
              <TableCell>
                {post.published ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Published
                  </span>
                ) : post.scheduledDate && new Date(post.scheduledDate) > new Date() ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Scheduled
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Draft
                  </span>
                )}
              </TableCell>
              <TableCell>{formatDate(post.date)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditPost(post)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeletePost(post)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogPostList;
