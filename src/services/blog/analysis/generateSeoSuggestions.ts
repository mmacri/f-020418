
import { BlogPost } from "../types";

/**
 * Generate SEO suggestions for a blog post
 */
export const generateSeoSuggestions = (post: BlogPost) => {
  // Generate SEO title suggestion
  const title = post.title.length > 60
    ? post.title.substring(0, 57) + '...'
    : post.title;
  
  // Generate SEO description suggestion
  const description = post.excerpt.length > 160
    ? post.excerpt.substring(0, 157) + '...'
    : post.excerpt;
  
  // Generate keyword suggestions
  const contentWords = (post.title + ' ' + post.excerpt + ' ' + post.content)
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !['this', 'that', 'with', 'from', 'have', 'more', 'your', 'they', 'what', 'when', 'will', 'about'].includes(word));
  
  // Count word frequency
  const wordCounts: Record<string, number> = {};
  contentWords.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  // Get top keywords
  const keywords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
  
  // Add the category as a keyword if it exists
  if (post.category && !keywords.includes(post.category.toLowerCase())) {
    keywords.push(post.category.toLowerCase());
  }
  
  return {
    title,
    description,
    keywords
  };
};
