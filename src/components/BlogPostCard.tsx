
import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition transform hover:shadow-xl h-full flex flex-col">
      <div className={`${isMobile ? 'h-36' : 'h-48'} bg-gray-200 relative overflow-hidden`}>
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
        />
        <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs py-1 px-2 rounded-md">
          {post.category}
        </span>
      </div>
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-lg md:text-xl mb-2">
          <Link to={`/blog/${post.slug}`} className="text-gray-900 hover:text-indigo-600 transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4 flex-grow text-sm md:text-base">
          {isMobile ? post.excerpt.substring(0, 100) + (post.excerpt.length > 100 ? '...' : '') : post.excerpt}
        </p>
        <div className="flex justify-between items-center mt-auto text-xs md:text-sm">
          <div>
            {post.author && <p className="text-gray-900 font-medium">{post.author}</p>}
          </div>
          <div className="flex text-gray-500 justify-between w-full">
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
