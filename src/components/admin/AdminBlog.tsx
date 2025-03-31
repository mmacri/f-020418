
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminBlogPosts from './AdminBlogPosts';
import BlogCategoriesManager from './blog/BlogCategoriesManager';
import BlogCommentsManager from './blog/BlogCommentsManager';
import { Card, CardContent } from '@/components/ui/card';

const AdminBlog = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="space-y-6">
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="posts">Blog Posts</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlog;
