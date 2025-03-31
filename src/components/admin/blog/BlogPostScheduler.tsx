
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Mock type for scheduled posts
interface ScheduledPost {
  id: string;
  title: string;
  scheduledDate: Date;
  status: 'scheduled';
}

const BlogPostScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [postsByDate, setPostsByDate] = useState<Record<string, ScheduledPost[]>>({});

  // Load scheduled posts (mock data for demonstration)
  useEffect(() => {
    // In a real application, you would fetch this from an API
    const mockPosts: ScheduledPost[] = [
      {
        id: '1',
        title: '10 Best Recovery Tips',
        scheduledDate: new Date(new Date().setDate(new Date().getDate() + 2)),
        status: 'scheduled',
      },
      {
        id: '2',
        title: 'Recovery Guide for Beginners',
        scheduledDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        status: 'scheduled',
      },
      {
        id: '3',
        title: 'Product Review: Recovery Tools',
        scheduledDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        status: 'scheduled',
      },
    ];
    
    setScheduledPosts(mockPosts);
    
    // Group posts by date for the calendar view
    const grouped = mockPosts.reduce((acc, post) => {
      const dateKey = format(post.scheduledDate, 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(post);
      return acc;
    }, {} as Record<string, ScheduledPost[]>);
    
    setPostsByDate(grouped);
  }, []);

  // Get posts for the selected date
  const getPostsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return postsByDate[dateKey] || [];
  };

  // Render the calendar with post indicators
  const renderCalendarWithPosts = () => {
    return (
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
        modifiers={{
          booked: (date) => {
            const dateKey = format(date, 'yyyy-MM-dd');
            return !!postsByDate[dateKey];
          },
        }}
        modifiersClassNames={{
          booked: "bg-primary/20 font-bold text-primary",
        }}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Schedule</CardTitle>
        <CardDescription>
          View and manage your scheduled blog posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {renderCalendarWithPosts()}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="w-4 h-4 rounded-sm bg-primary/20 mr-2"></div>
                <span>Posts scheduled</span>
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Today
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    initialFocus
                    selected={new Date()}
                    onSelect={setSelectedDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {selectedDate 
                  ? format(selectedDate, 'MMMM d, yyyy') 
                  : "Select a date"}
              </h3>
              <Button size="sm" className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>New Post</span>
              </Button>
            </div>
            
            <Separator />
            
            <div>
              {selectedDate && getPostsForSelectedDate().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No posts scheduled for this date.</p>
                  <Button variant="outline" className="mt-4" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" /> 
                    Schedule a post
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {getPostsForSelectedDate().map((post) => (
                    <div 
                      key={post.id} 
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/10 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium">{post.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{format(post.scheduledDate, 'h:mm a')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Scheduled</Badge>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostScheduler;
