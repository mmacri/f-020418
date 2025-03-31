
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Search, 
  Check, 
  X, 
  MessageSquare, 
  User, 
  Pencil, 
  Trash2,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Define types for blog comments
interface BlogComment {
  id: number | string;
  content: string;
  author: string;
  email: string;
  postId: number | string;
  postTitle: string;
  status: 'approved' | 'pending' | 'spam' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

const BlogCommentsManager = () => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewCommentDialogOpen, setViewCommentDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingComment, setEditingComment] = useState<BlogComment | null>(null);
  const [viewingComment, setViewingComment] = useState<BlogComment | null>(null);
  const [formData, setFormData] = useState({
    content: '',
    author: '',
    email: '',
    status: 'pending' as 'approved' | 'pending' | 'spam' | 'rejected'
  });
  const { toast } = useToast();

  // Fetch comments on component mount
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      // Mock data for demo - in a real app, this would come from an API
      const mockComments: BlogComment[] = [
        {
          id: 1,
          content: "This is such a helpful article! I've been looking for this information for a long time.",
          author: "Jane Smith",
          email: "jane.smith@example.com",
          postId: 101,
          postTitle: "10 Best Recovery Techniques After Workouts",
          status: "approved",
          createdAt: "2023-11-15T10:30:00Z"
        },
        {
          id: 2,
          content: "I disagree with point #3. In my experience, that approach doesn't work well for everyone.",
          author: "Michael Johnson",
          email: "michael.j@example.com",
          postId: 101,
          postTitle: "10 Best Recovery Techniques After Workouts",
          status: "approved",
          createdAt: "2023-11-16T08:45:00Z"
        },
        {
          id: 3,
          content: "Check out my website for more tips at spamsite.com!",
          author: "Spam Bot",
          email: "spam@example.com",
          postId: 102,
          postTitle: "Product Review: Ultimate Recovery Foam Roller",
          status: "spam",
          createdAt: "2023-11-17T14:20:00Z"
        },
        {
          id: 4,
          content: "Would this technique work for beginners too, or is it more for advanced athletes?",
          author: "Sarah Williams",
          email: "sarah.w@example.com",
          postId: 103,
          postTitle: "Advanced Recovery Strategies",
          status: "pending",
          createdAt: "2023-11-18T16:10:00Z"
        },
        {
          id: 5,
          content: "This content is inappropriate and contains offensive language.",
          author: "Anonymous User",
          email: "anon123@example.com",
          postId: 104,
          postTitle: "Nutrition for Recovery",
          status: "rejected",
          createdAt: "2023-11-19T09:05:00Z"
        }
      ];
      
      setComments(mockComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog comments. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditComment = (comment: BlogComment) => {
    setEditingComment(comment);
    setFormData({
      content: comment.content,
      author: comment.author,
      email: comment.email,
      status: comment.status
    });
    setIsDialogOpen(true);
  };

  const handleViewComment = (comment: BlogComment) => {
    setViewingComment(comment);
    setViewCommentDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingComment) {
        // Update existing comment - in a real app, this would be an API call
        const updatedComments = comments.map(comment => 
          comment.id === editingComment.id 
            ? { 
                ...comment, 
                content: formData.content, 
                author: formData.author, 
                email: formData.email,
                status: formData.status,
                updatedAt: new Date().toISOString() 
              } 
            : comment
        );
        
        setComments(updatedComments);
        
        toast({
          title: 'Success',
          description: `Comment has been updated.`,
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to save comment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (commentId: string | number, newStatus: 'approved' | 'pending' | 'spam' | 'rejected') => {
    try {
      // Update status - in a real app, this would be an API call
      const updatedComments = comments.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              status: newStatus,
              updatedAt: new Date().toISOString() 
            } 
          : comment
      );
      
      setComments(updatedComments);
      
      const statusMessage = {
        approved: 'approved',
        pending: 'marked as pending',
        spam: 'marked as spam',
        rejected: 'rejected'
      };
      
      toast({
        title: 'Success',
        description: `Comment has been ${statusMessage[newStatus]}.`,
      });
    } catch (error) {
      console.error('Error updating comment status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update comment status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteComment = async (comment: BlogComment) => {
    if (window.confirm(`Are you sure you want to delete this comment? This action cannot be undone.`)) {
      try {
        // In a real app, this would be an API call
        const filteredComments = comments.filter(c => c.id !== comment.id);
        setComments(filteredComments);
        
        toast({
          title: 'Success',
          description: `Comment has been deleted.`,
        });
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete comment. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  // Apply filters
  const filteredComments = comments.filter(comment => {
    const matchesSearch = 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'spam':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Spam</Badge>;
      case 'rejected':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-foreground">Blog Comments</h2>
        <div className="flex w-full sm:w-auto space-x-2">
          <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search comments..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Comments</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredComments.length === 0 ? (
        <Card className="border border-border shadow-sm bg-card">
          <CardContent className="pt-6 text-center py-12">
            <p className="mb-6 text-foreground text-lg">
              {searchTerm || statusFilter !== 'all' 
                ? 'No comments match your search or filter.' 
                : 'No comments found yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comment</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="max-w-[200px] truncate">
                    {comment.content}
                  </TableCell>
                  <TableCell>{comment.author}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{comment.postTitle}</TableCell>
                  <TableCell>{getStatusBadge(comment.status)}</TableCell>
                  <TableCell>{formatDate(comment.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {comment.status !== 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(comment.id, 'approved')}
                          title="Approve"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      
                      {comment.status !== 'rejected' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(comment.id, 'rejected')}
                          title="Reject"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                      
                      {comment.status !== 'spam' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(comment.id, 'spam')}
                          title="Mark as spam"
                        >
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewComment(comment)}
                        title="View full comment"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditComment(comment)}
                        title="Edit comment"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteComment(comment)}
                        title="Delete comment"
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
      )}

      {/* Edit Comment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogDescription>
              Update the comment details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">Comment Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author Name</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Comment Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'approved' | 'pending' | 'spam' | 'rejected') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Comment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Comment Dialog */}
      <Dialog open={viewCommentDialogOpen} onOpenChange={setViewCommentDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Comment Details</DialogTitle>
          </DialogHeader>

          {viewingComment && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Content
                </h4>
                <p className="text-sm border rounded-md p-3 bg-muted/30">{viewingComment.content}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Author
                  </h4>
                  <p className="text-sm">{viewingComment.author}</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Email</h4>
                  <p className="text-sm">{viewingComment.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Post</h4>
                  <p className="text-sm">{viewingComment.postTitle}</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Status</h4>
                  <div>{getStatusBadge(viewingComment.status)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Created</h4>
                  <p className="text-sm">{formatDate(viewingComment.createdAt)}</p>
                </div>
                
                {viewingComment.updatedAt && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Last Updated</h4>
                    <p className="text-sm">{formatDate(viewingComment.updatedAt)}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setViewCommentDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogCommentsManager;
