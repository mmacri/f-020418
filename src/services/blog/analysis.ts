
import { BlogPost } from './types';

/**
 * Generate SEO suggestions for a blog post based on its content
 * @param post The blog post to analyze
 * @returns Object containing SEO suggestions
 */
export const generateSeoSuggestions = (post: BlogPost) => {
  // This is a simple implementation that could be replaced with a more sophisticated algorithm or AI service
  
  // Generate SEO title
  const seoTitle = post.title.length > 60 
    ? `${post.title.substring(0, 57)}...` 
    : post.title;
  
  // Generate SEO description
  const seoDescription = post.excerpt.length > 160 
    ? `${post.excerpt.substring(0, 157)}...` 
    : post.excerpt;
  
  // Extract potential keywords from title and content
  const keywords = extractKeywords(post);
  
  return {
    title: seoTitle,
    description: seoDescription,
    keywords
  };
};

/**
 * Analyze the readability of a blog post
 * @param post The blog post to analyze
 * @returns Object containing readability metrics
 */
export const analyzeReadability = (post: BlogPost) => {
  const text = post.content;
  
  // Word count
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Sentence count (rough approximation)
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  const sentenceCount = sentences.length;
  
  // Average words per sentence
  const avgWordsPerSentence = sentenceCount > 0 
    ? Math.round((wordCount / sentenceCount) * 10) / 10 
    : 0;
  
  // Calculate reading time (assuming average reading speed of 200 words per minute)
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  
  // Readability score (simple implementation of Flesch-Kincaid)
  // This is a very simplified version; a real implementation would be more complex
  const readabilityScore = 100 - (avgWordsPerSentence * 0.39);
  
  // Readability level
  let readabilityLevel;
  if (readabilityScore > 80) {
    readabilityLevel = 'Very Easy';
  } else if (readabilityScore > 70) {
    readabilityLevel = 'Easy';
  } else if (readabilityScore > 60) {
    readabilityLevel = 'Standard';
  } else if (readabilityScore > 50) {
    readabilityLevel = 'Fairly Difficult';
  } else {
    readabilityLevel = 'Difficult';
  }
  
  return {
    wordCount,
    sentenceCount,
    avgWordsPerSentence,
    readingTimeMinutes,
    readabilityScore: Math.round(readabilityScore),
    readabilityLevel,
    readTime: `${readingTimeMinutes} min read`
  };
};

/**
 * Extract potential keywords from a blog post
 * @param post The blog post to analyze
 * @returns Array of potential keywords
 */
const extractKeywords = (post: BlogPost): string[] => {
  // Combine title and excerpt for keyword extraction
  const text = `${post.title} ${post.excerpt}`;
  
  // Remove common words and punctuation
  const commonWords = ['a', 'an', 'the', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'or', 'but', 'is', 'are', 'was', 'were'];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
  
  // Count word frequency
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Sort by frequency and take top 5
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])
    .slice(0, 5);
  
  // Add category as a keyword if it exists
  if (post.category && !sortedWords.includes(post.category.toLowerCase())) {
    sortedWords.unshift(post.category);
  }
  
  return sortedWords;
};
