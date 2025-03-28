
import React from 'react';
import { Link } from 'react-router-dom';

interface BlogPostCardProps {
  post: {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    date: string;
    readTime: string;
    author?: string;
  };
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md transition transform hover:shadow-xl">
      <div className="h-48 bg-gray-200 relative">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs py-1 px-2 rounded-md">
          {post.category}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2">
          <Link to={`/blog/${post.slug}`} className="text-gray-900 hover:text-indigo-600">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4">
          {post.excerpt}
        </p>
        <div className="flex justify-between text-gray-500 text-sm">
          {post.author && <span>{post.author}</span>}
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  );
};

export default BlogPostCard;
