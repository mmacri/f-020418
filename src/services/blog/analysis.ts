
import { BlogPost } from "./types";

export const analyzeReadability = (content: string): { score: number; feedback: string[]; readingTime: string } => {
  // Simple implementation for readability analysis
  const words = content.split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).length;
  const avgWordsPerSentence = words / Math.max(sentences, 1);
  const avgSentenceLength = sentences > 0 ? words / sentences : 0;
  
  let score = 100;
  const feedback: string[] = [];
  
  // Deduct points for long sentences
  if (avgWordsPerSentence > 25) {
    score -= 20;
    feedback.push("Try to use shorter sentences for better readability.");
  } else if (avgWordsPerSentence > 15) {
    score -= 10;
    feedback.push("Your sentence length is good, but could be improved.");
  }
  
  // Deduct points for very short content
  if (words < 100) {
    score -= 15;
    feedback.push("Content is too short. Consider adding more information.");
  }
  
  // Calculate reading time
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  const readingTime = `${minutes} min read`;
  
  return {
    score: Math.max(0, Math.min(100, score)),
    feedback,
    readingTime
  };
};

export const generateSeoSuggestions = (post: BlogPost): { title: string; description: string; keywords: string[] } => {
  // Simple implementation for SEO suggestions
  let title = post.title;
  
  // Limit title to 60 chars
  if (title.length > 60) {
    title = title.substring(0, 57) + "...";
  }
  
  // Description uses the excerpt but ensures proper length
  let description = post.excerpt || "";
  if (description.length > 160) {
    description = description.substring(0, 157) + "...";
  } else if (description.length < 50 && post.content) {
    // If excerpt is too short, use beginning of content
    description = post.content.substring(0, 150) + "...";
  }
  
  // Generate keywords from title and content
  const allWords = (post.title + " " + post.excerpt + " " + post.content).toLowerCase();
  const stopWords = ["the", "and", "or", "but", "for", "with", "in", "on", "at", "to", "a", "an", "is", "are", "was", "were"];
  
  // Extract potential keywords
  const words = allWords.split(/\W+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  // Sort by frequency
  const keywords = Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);
  
  return {
    title,
    description,
    keywords
  };
};
