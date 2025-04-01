
/**
 * Analyze readability of text content
 */
export const analyzeReadability = (text: string) => {
  // Simple implementation of Flesch-Kincaid readability
  
  // Remove HTML tags if any
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  // Count sentences
  const sentences = cleanText
    .split(/[.!?]+/)
    .filter(sentence => sentence.trim().length > 0);
  const sentenceCount = sentences.length;
  
  // Count words
  const words = cleanText
    .split(/\s+/)
    .filter(word => word.trim().length > 0);
  const wordCount = words.length;
  
  // Count syllables (simple approximation)
  const syllableCount = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);
  
  // Calculate Flesch-Kincaid grade level
  const readingEase = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
  
  // Determine reading level
  let readingLevel = 'Advanced';
  if (readingEase > 90) readingLevel = 'Very Easy';
  else if (readingEase > 80) readingLevel = 'Easy';
  else if (readingEase > 70) readingLevel = 'Fairly Easy';
  else if (readingEase > 60) readingLevel = 'Standard';
  else if (readingEase > 50) readingLevel = 'Fairly Difficult';
  else if (readingEase > 30) readingLevel = 'Difficult';
  
  // Statistics
  return {
    wordCount,
    sentenceCount,
    readingEase: Math.max(0, Math.min(100, Math.round(readingEase))),
    readingLevel,
    estimatedReadTime: Math.max(1, Math.ceil(wordCount / 200)) // Average reading speed of 200 words per minute
  };
};

// Helper function to count syllables in a word
function countSyllables(word: string): number {
  word = word.toLowerCase();
  
  // Remove non-alphabetic characters
  word = word.replace(/[^a-z]/g, '');
  
  if (word.length <= 3) return 1;
  
  // Count vowel groups
  const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
  let count = 0;
  let prevIsVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !prevIsVowel) {
      count++;
    }
    prevIsVowel = isVowel;
  }
  
  // Adjust for common patterns
  if (word.endsWith('e')) count--;
  if (word.endsWith('le') && word.length > 2 && !vowels.includes(word[word.length - 3])) count++;
  if (word.endsWith('es') || word.endsWith('ed')) count--;
  
  // Ensure at least one syllable
  return Math.max(1, count);
}
