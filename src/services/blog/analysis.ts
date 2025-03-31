
import { BlogPost } from "./types";

// Generate SEO suggestions for a blog post
export const generateSeoSuggestions = (post: BlogPost): { title: string, description: string, keywords: string[] } => {
  // In a real app, this might call an AI service or use more complex logic
  // For now, we'll implement a simple version
  
  const keywords = [
    ...new Set([
      ...post.tags || [],
      ...post.category.split(/\s+/),
      ...post.title.split(/\s+/).filter(word => word.length > 4)
    ])
  ].slice(0, 10);
  
  return {
    title: post.title.length > 60 ? post.title.substring(0, 57) + '...' : post.title,
    description: post.excerpt.length > 160 ? post.excerpt.substring(0, 157) + '...' : post.excerpt,
    keywords
  };
};

// Analyze content readability (simple implementation)
export const analyzeReadability = (content: string): { score: number, readingTime: string, suggestions: string[] } => {
  const words = content.split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).length;
  const avgWordsPerSentence = words / (sentences || 1);
  
  const readingTimeMinutes = Math.ceil(words / 200); // Assuming 200 words per minute
  
  const suggestions: string[] = [];
  
  if (avgWordsPerSentence > 25) {
    suggestions.push("Consider using shorter sentences for better readability");
  }
  
  if (words < 300) {
    suggestions.push("Consider adding more content for better SEO");
  }
  
  // Simple readability score (0-100)
  const score = Math.min(100, Math.max(0, 100 - (avgWordsPerSentence - 15) * 2));
  
  return {
    score,
    readingTime: readingTimeMinutes === 1 ? "1 minute" : `${readingTimeMinutes} minutes`,
    suggestions
  };
};
