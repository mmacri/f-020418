
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminBlogPosts from './AdminBlogPosts';
import BlogCategoriesManager from './blog/BlogCategoriesManager';
import BlogCommentsManager from './blog/BlogCommentsManager';
import BlogPostScheduler from './blog/BlogPostScheduler';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, FileText, MessageSquare, Tag } from 'lucide-react';

const AdminBlog = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="space-y-6">
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 grid grid-cols-4 sm:w-auto">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Blog Posts</span>
                <span className="sm:hidden">Posts</span>
              </TabsTrigger>
              
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
                <span className="sm:hidden">Cats</span>
              </TabsTrigger>
              
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Comments</span>
                <span className="sm:hidden">Comms</span>
              </TabsTrigger>

              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">Schedule</span>
                <span className="sm:hidden">Sched</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <AdminBlogPosts />
            </TabsContent>
            
            <TabsContent value="categories">
              <BlogCategoriesManager />
            </TabsContent>
            
            <TabsContent value="comments">
              <BlogCommentsManager />
            </TabsContent>

            <TabsContent value="schedule">
              <BlogPostScheduler />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlog;
