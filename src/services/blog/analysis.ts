
import { BlogPost } from "./types";

// Generate SEO suggestions for a blog post
export const generateSeoSuggestions = (post: BlogPost): { title: string; description: string; keywords: string[] } => {
  const title = post.title;
  const content = post.content || '';
  const excerpt = post.excerpt || '';
  
  // Extract potential keywords from content
  const words = content.toLowerCase().split(/\s+/);
  const wordCounts: { [key: string]: number } = {};
  
  words.forEach(word => {
    // Filter out common words and short words
    if (word.length > 3 && !commonWords.includes(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  
  // Sort words by frequency
  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
  
  // Create SEO title
  let seoTitle = title;
  if (seoTitle.length < 50 && post.category) {
    seoTitle = `${seoTitle} | ${post.category} Guide`;
  }
  
  // Create SEO description
  let seoDescription = excerpt;
  if (seoDescription.length > 160) {
    seoDescription = seoDescription.substring(0, 157) + '...';
  }
  
  return {
    title: seoTitle,
    description: seoDescription,
    keywords: sortedWords
  };
};

// Analyze readability of a blog post
export const analyzeReadability = (content: string): { score: number; feedback: string[] } => {
  const words = content.split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).length;
  const paragraphs = content.split(/\n\s*\n/).length;
  
  const wordsPerSentence = words / Math.max(1, sentences);
  const sentencesPerParagraph = sentences / Math.max(1, paragraphs);
  
  const feedback: string[] = [];
  let score = 70; // Base score
  
  // Word count analysis
  if (words < 300) {
    feedback.push('Content is too short. Consider adding more information to improve depth.');
    score -= 15;
  } else if (words > 2000) {
    feedback.push('Content is quite long. Consider breaking into multiple posts or adding subheadings for clarity.');
    score -= 5;
  }
  
  // Sentence length analysis
  if (wordsPerSentence > 25) {
    feedback.push('Average sentence length is high. Consider shortening sentences for better readability.');
    score -= 10;
  } else if (wordsPerSentence < 10) {
    feedback.push('Sentences are short. Consider varying sentence length for better flow.');
    score -= 5;
  }
  
  // Paragraph analysis
  if (sentencesPerParagraph > 7) {
    feedback.push('Paragraphs are long. Consider breaking into smaller paragraphs for easier reading.');
    score -= 10;
  }
  
  // Cap score between 0-100
  score = Math.max(0, Math.min(100, score));
  
  if (feedback.length === 0) {
    feedback.push('Great job! Your content appears to be well-structured and readable.');
  }
  
  return {
    score,
    feedback
  };
};

// Common English words to filter out when generating keywords
const commonWords = [
  'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
  'his', 'from', 'they', 'say', 'she', 'will', 'one', 'all', 'would', 'there',
  'their', 'what', 'out', 'about', 'who', 'get', 'which', 'when', 'make',
  'can', 'like', 'time', 'just', 'him', 'know', 'take', 'people', 'into',
  'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
  'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well',
  'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day',
  'most', 'article', 'post', 'here', 'are', 'been', 'was', 'has', 'had',
  'should', 'would', 'could', 'may', 'might', 'must', 'shall'
];
