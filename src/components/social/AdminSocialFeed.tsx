
import React, { useState } from 'react';
import { useAdminSocialFeed } from '@/hooks/social/useAdminSocialFeed';
import { PostCard } from './PostCard';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Shield, Eye, RefreshCw, AlertCircle, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { ReactionType } from '@/types/social';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const AdminSocialFeed: React.FC = () => {
  const { posts, isLoading, error, refreshPosts, deletePost } = useAdminSocialFeed();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const handleDelete = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      await deletePost(postId);
    }
  };

  const handleViewPost = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  // Dummy handlers for PostCard component
  const dummyAddComment = async () => null;
  const dummyAddReaction = async (type: ReactionType) => null;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-3">Loading social feed...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button variant="outline" size="sm" onClick={refreshPosts} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader className="bg-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Social Feed Moderation</CardTitle>
                <CardDescription>
                  View and manage all posts across the platform
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refreshPosts}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {posts.length === 0 ? (
            <div className="text-center p-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground">
                There are no posts in the system yet.
              </p>
            </div>
          ) : (
            <Tabs defaultValue="table" onValueChange={(value) => setViewMode(value as 'table' | 'cards')}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                  <TabsTrigger value="cards">Card View</TabsTrigger>
                </TabsList>
                <div className="text-sm text-muted-foreground">
                  {posts.length} posts total
                </div>
              </div>
              
              <TabsContent value="table" className="mt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Post Content</TableHead>
                        <TableHead>Posted On</TableHead>
                        <TableHead>Interactions</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <React.Fragment key={post.id}>
                          <TableRow className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {post.user?.avatar_url ? (
                                  <img 
                                    src={post.user.avatar_url} 
                                    alt={post.user.display_name}
                                    className="h-6 w-6 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                                    {post.user?.display_name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <span>{post.user?.display_name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-md truncate">
                                {post.content}
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(post.created_at), 'MMM d, yyyy h:mm a')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-4">
                                <span title="Comments">
                                  <MessageSquare className="h-4 w-4 inline mr-1 text-muted-foreground" />
                                  {post.comments?.length || 0}
                                </span>
                                <span title="Reactions">
                                  {post.reaction_counts && Object.entries(post.reaction_counts)
                                    .filter(([_, count]) => count > 0)
                                    .map(([type, count]) => (
                                      <span key={type} className="mr-2 text-xs">
                                        {type}: {count}
                                      </span>
                                    ))}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewPost(post.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDelete(post.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedPost === post.id && (
                            <TableRow>
                              <TableCell colSpan={5} className="p-0">
                                <div className="p-4 bg-muted/30">
                                  <PostCard
                                    post={post}
                                    isOwner={true}
                                    onAddComment={dummyAddComment}
                                    onAddReaction={dummyAddReaction}
                                    onDeletePost={() => handleDelete(post.id)}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="cards" className="mt-4">
                <div className="grid gap-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isOwner={true}
                      onAddComment={dummyAddComment}
                      onAddReaction={dummyAddReaction}
                      onDeletePost={() => handleDelete(post.id)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
