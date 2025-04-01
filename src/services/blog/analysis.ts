
import { BlogPost } from './types';

interface ReadabilityAnalysis {
  wordCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  readingTimeMinutes: number;
  readabilityScore: number;
  readabilityLevel: string;
  readTime: string;
  score?: number;
  feedback?: string[];
  readingTime?: string;
}

interface SeoSuggestion {
  title: string;
  description: string;
  keywords: string[];
}

export const generateSeoSuggestions = (post: BlogPost): SeoSuggestion => {
  // Extract keywords from content
  const words = post.content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  // Count word frequency
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Sort by frequency
  const sortedWords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
  
  // Generate SEO title
  const seoTitle = post.title.length > 60 
    ? post.title.substring(0, 57) + '...' 
    : post.title;
  
  // Generate SEO description
  const seoDescription = post.excerpt.length > 160 
    ? post.excerpt.substring(0, 157) + '...' 
    : post.excerpt;
  
  // Add category to keywords if available
  if (post.category && !sortedWords.includes(post.category.toLowerCase())) {
    sortedWords.unshift(post.category.toLowerCase());
    if (sortedWords.length > 5) sortedWords.pop();
  }
  
  return {
    title: seoTitle,
    description: seoDescription,
    keywords: sortedWords
  };
};

export const analyzeReadability = (content: string): ReadabilityAnalysis => {
  // Count words
  const words = content.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Count sentences
  const sentences = content
    .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
    .split("|")
    .filter(sentence => sentence.trim().length > 0);
  const sentenceCount = sentences.length || 1;
  
  // Calculate average words per sentence
  const avgWordsPerSentence = wordCount / sentenceCount;
  
  // Calculate reading time (200 words per minute)
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  
  // Calculate readability score (simplified Flesch-Kincaid)
  const readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (wordCount / sentenceCount));
  
  // Determine readability level
  let readabilityLevel = '';
  if (readabilityScore >= 90) readabilityLevel = 'Very Easy';
  else if (readabilityScore >= 80) readabilityLevel = 'Easy';
  else if (readabilityScore >= 70) readabilityLevel = 'Fairly Easy';
  else if (readabilityScore >= 60) readabilityLevel = 'Standard';
  else if (readabilityScore >= 50) readabilityLevel = 'Fairly Difficult';
  else if (readabilityScore >= 30) readabilityLevel = 'Difficult';
  else readabilityLevel = 'Very Difficult';
  
  // Generate feedback
  const feedback = [];
  
  if (avgWordsPerSentence > 20) {
    feedback.push('Consider using shorter sentences to improve readability.');
  }
  
  if (wordCount < 300) {
    feedback.push('Content is quite short. Consider adding more information for better SEO.');
  }
  
  if (readabilityScore < 60) {
    feedback.push('Text might be difficult to read. Try simplifying your language.');
  }
  
  // Format reading time
  const readTime = `${readingTimeMinutes} min read`;
  
  return {
    wordCount,
    sentenceCount,
    avgWordsPerSentence,
    readingTimeMinutes,
    readabilityScore,
    readabilityLevel,
    readTime,
    score: readabilityScore,
    feedback,
    readingTime: readTime
  };
};
