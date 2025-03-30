
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminBlogPosts from './AdminBlogPosts';
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
              <div className="py-10 text-center text-muted-foreground">
                <p>Blog categories management coming soon.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="comments">
              <div className="py-10 text-center text-muted-foreground">
                <p>Blog comments management coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlog;
