
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
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition transform hover:shadow-xl h-full flex flex-col">
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
        />
        <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs py-1 px-2 rounded-md">
          {post.category}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl mb-2">
          <Link to={`/blog/${post.slug}`} className="text-gray-900 hover:text-indigo-600 transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4 flex-grow">
          {post.excerpt}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <div className="text-sm">
            {post.author && <p className="text-gray-900 font-medium">{post.author}</p>}
          </div>
          <div className="flex text-gray-500 text-sm justify-between w-full">
            {post.author && <span></span>}
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
