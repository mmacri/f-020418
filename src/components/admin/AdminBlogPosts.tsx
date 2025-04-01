
import React from 'react';
import BlogPostHeader from './blog/BlogPostHeader';
import BlogPostList from './blog/BlogPostList';
import BlogPostForm from './blog/BlogPostForm';
import { useBlogPosts } from './blog/useBlogPosts';

const AdminBlogPosts = () => {
  const {
    posts,
    categories,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    searchTerm,
    setSearchTerm,
    editingPost,
    handleCreatePost,
    handleEditPost,
    handleDeletePost,
    handleSubmit
  } = useBlogPosts();

  return (
    <div className="space-y-6">
      <BlogPostHeader 
        title="Blog Posts"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreatePost={handleCreatePost}
      />

      <BlogPostList 
        posts={posts}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onCreatePost={handleCreatePost}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
      />

      <BlogPostForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        editingPost={editingPost}
        onSubmit={handleSubmit}
        categories={categories}
      />
    </div>
  );
};

export default AdminBlogPosts;
