
import React, { useState, useEffect } from 'react';
import { 
  getScheduledBlogPosts, 
  publishScheduledPosts, 
  updateBlogPost, 
  BlogPost
} from '@/services/blog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { CalendarCheck, CalendarX, Clock, RefreshCcw } from 'lucide-react';

const BlogPostScheduler = () => {
  const [scheduledPosts, setScheduledPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    setIsLoading(true);
    try {
      const posts = await getScheduledBlogPosts();
      setScheduledPosts(posts);
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
      toast({
        title: "Error",
        description: "Failed to load scheduled posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishNow = async (post: BlogPost) => {
    try {
      // Convert the ID to string to ensure type safety
      const postId = String(post.id);
      await updateBlogPost(postId, { 
        published: true,
        scheduledDate: null,
        date: new Date().toISOString().split('T')[0]
      });
      toast({
        title: "Success",
        description: `Post "${post.title}" has been published.`,
      });
      fetchScheduledPosts();
    } catch (error) {
      console.error("Error publishing post:", error);
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelSchedule = async (post: BlogPost) => {
    try {
      // Convert the ID to string to ensure type safety
      const postId = String(post.id);
      await updateBlogPost(postId, { scheduledDate: null });
      toast({
        title: "Success",
        description: `Schedule for post "${post.title}" has been cancelled.`,
      });
      fetchScheduledPosts();
    } catch (error) {
      console.error("Error cancelling schedule:", error);
      toast({
        title: "Error",
        description: "Failed to cancel schedule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReschedule = async () => {
    try {
      const publishedCount = await publishScheduledPosts();
      if (publishedCount > 0) {
        toast({
          title: "Success",
          description: `${publishedCount} scheduled posts have been published.`,
        });
      } else {
        toast({
          title: "Info",
          description: "No posts were due for publishing.",
        });
      }
      fetchScheduledPosts();
    } catch (error) {
      console.error("Error rescheduling posts:", error);
      toast({
        title: "Error",
        description: "Failed to reschedule posts. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Scheduled Blog Posts</h2>
          <Button variant="outline" size="sm" onClick={handleReschedule}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reschedule All
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Clock className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading scheduled posts...</span>
          </div>
        ) : scheduledPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500">No blog posts are currently scheduled.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    {post.scheduledDate && format(new Date(post.scheduledDate), 'MMM d, yyyy h:mm aa')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePublishNow(post)}
                      >
                        <CalendarCheck className="h-4 w-4 mr-2" />
                        Publish Now
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelSchedule(post)}
                      >
                        <CalendarX className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogPostScheduler;
