
import { localStorageKeys } from "@/lib/constants";

export interface CategoryContent {
  id: string;
  slug: string;
  title: string;
  description: string;
  introduction: string;
  benefits: string[];
  features?: string[];
  videoId?: string;
  videoTitle?: string;
  videoDescription?: string;
  faqs?: CategoryFAQ[];
  buyingGuide?: string;
  updatedAt: string;
}

export interface CategoryFAQ {
  question: string;
  answer: string;
}

// Default content for categories
const defaultCategoryContent: Record<string, Partial<CategoryContent>> = {
  'massage-guns': {
    title: "Massage Guns for Recovery",
    description: "Expert reviews and comparisons of the best percussion massage guns for faster recovery and pain relief",
    introduction: "Percussion massage guns have revolutionized muscle recovery with their ability to deliver powerful, targeted deep tissue massage. These handheld devices use rapid pulses to penetrate muscle tissue, increase blood flow, and release tension. Our experts have thoroughly tested the top massage guns to help you find the perfect option for your recovery needs.",
    benefits: [
      "Accelerated Recovery: Reduces post-workout soreness and recovery time",
      "Improved Blood Flow: Enhances circulation to damaged tissues",
      "Decreased Pain: Helps alleviate muscle pain and stiffness",
      "Increased Range of Motion: Reduces muscle tension that limits movement",
      "Stress Reduction: Promotes relaxation and reduces cortisol levels"
    ],
    videoId: "hKYEn-6Dt_M",
    videoTitle: "How to Use a Massage Gun Effectively",
    videoDescription: "Learn the proper techniques for using a percussion massage gun to maximize recovery benefits while avoiding common mistakes:",
    faqs: [
      {
        question: "How often should I use a massage gun?",
        answer: "For general recovery, using a massage gun for 1-2 minutes per muscle group is recommended, up to 2-3 times per day. If targeting a specific injury, consult with a physical therapist for personalized recommendations."
      },
      {
        question: "Are massage guns good for everyone?",
        answer: "While massage guns are beneficial for most people, they should be avoided by individuals with certain conditions including deep vein thrombosis, severe inflammation, bleeding disorders, or directly over recent injuries, fractures or sprains. Always consult your healthcare provider if you have medical concerns."
      },
      {
        question: "What's the difference between expensive and budget massage guns?",
        answer: "Higher-priced massage guns typically offer quieter operation, longer battery life, more speed and intensity settings, better build quality, and additional attachments. Budget options may still be effective for basic needs but might be louder and have fewer features."
      }
    ],
    buyingGuide: "When shopping for a massage gun, consider these key factors: stroke depth (amplitude), which determines how deeply the device can work; stall force, the amount of pressure the device can handle before stopping; battery life for longer sessions; noise level for comfortable use; weight and ergonomics for ease of handling; and included attachments for targeting different muscle groups."
  },
  'fitness-bands': {
    title: "Fitness & Resistance Bands",
    description: "Comprehensive guide to the top resistance and fitness bands for improving flexibility, mobility, and aiding recovery",
    introduction: "Resistance bands are one of the most versatile recovery tools available, providing gentle resistance for stretching, rehabilitation, and mobility work. They're portable, affordable, and suitable for users of all fitness levels. Our team has tested dozens of bands to find the best options for recovery, mobility, and injury prevention.",
    benefits: [
      "Enhanced Flexibility: Provides gentle assistance for deeper, more effective stretches",
      "Improved Circulation: Promotes blood flow to muscles for faster recovery",
      "Joint Mobility: Helps restore range of motion after workouts or injury",
      "Muscle Activation: Engages stabilizer muscles that are often overlooked",
      "Progressive Resistance: Allows for gradual increase in intensity as recovery progresses"
    ],
    videoId: "PjZ9w2cQP-Q",
    videoTitle: "Resistance Band Recovery Techniques",
    videoDescription: "Watch this video to learn effective resistance band stretches and mobility exercises that can enhance your recovery and improve flexibility:"
  }
};

// Get all category content
export const getAllCategoryContent = async (): Promise<CategoryContent[]> => {
  try {
    const contentData = localStorage.getItem(localStorageKeys.CATEGORIES_CONTENT);
    let content: CategoryContent[] = contentData ? JSON.parse(contentData) : [];
    
    // If no content exists yet, initialize with default content
    if (content.length === 0) {
      content = Object.entries(defaultCategoryContent).map(([slug, data]) => ({
        id: slug,
        slug,
        title: data.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: data.description || '',
        introduction: data.introduction || '',
        benefits: data.benefits || [],
        videoId: data.videoId || '',
        videoTitle: data.videoTitle || '',
        videoDescription: data.videoDescription || '',
        faqs: data.faqs || [],
        buyingGuide: data.buyingGuide || '',
        features: data.features || [],
        updatedAt: new Date().toISOString()
      }));
      
      localStorage.setItem(localStorageKeys.CATEGORIES_CONTENT, JSON.stringify(content));
    }
    
    return content;
  } catch (error) {
    console.error("Error retrieving category content:", error);
    return [];
  }
};

// Get category content by slug
export const getCategoryContentBySlug = async (slug: string): Promise<CategoryContent | null> => {
  try {
    const allContent = await getAllCategoryContent();
    let content = allContent.find(c => c.slug === slug);
    
    // If content doesn't exist yet for this slug but we have a default, create it
    if (!content && defaultCategoryContent[slug]) {
      const newContent: CategoryContent = {
        id: slug,
        slug,
        title: defaultCategoryContent[slug].title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: defaultCategoryContent[slug].description || '',
        introduction: defaultCategoryContent[slug].introduction || '',
        benefits: defaultCategoryContent[slug].benefits || [],
        videoId: defaultCategoryContent[slug].videoId || '',
        videoTitle: defaultCategoryContent[slug].videoTitle || '',
        videoDescription: defaultCategoryContent[slug].videoDescription || '',
        faqs: defaultCategoryContent[slug].faqs || [],
        buyingGuide: defaultCategoryContent[slug].buyingGuide || '',
        features: defaultCategoryContent[slug].features || [],
        updatedAt: new Date().toISOString()
      };
      
      const updatedContent = [...allContent, newContent];
      localStorage.setItem(localStorageKeys.CATEGORIES_CONTENT, JSON.stringify(updatedContent));
      
      return newContent;
    }
    
    return content || null;
  } catch (error) {
    console.error(`Error retrieving category content for ${slug}:`, error);
    return null;
  }
};

// Update category content
export const updateCategoryContent = async (slug: string, data: Partial<CategoryContent>): Promise<CategoryContent | null> => {
  try {
    const allContent = await getAllCategoryContent();
    const contentIndex = allContent.findIndex(c => c.slug === slug);
    
    if (contentIndex === -1) {
      // If not found, create new content
      const newContent: CategoryContent = {
        id: slug,
        slug,
        title: data.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: data.description || '',
        introduction: data.introduction || '',
        benefits: data.benefits || [],
        videoId: data.videoId || '',
        videoTitle: data.videoTitle || '',
        videoDescription: data.videoDescription || '',
        faqs: data.faqs || [],
        buyingGuide: data.buyingGuide || '',
        features: data.features || [],
        updatedAt: new Date().toISOString()
      };
      
      const updatedContent = [...allContent, newContent];
      localStorage.setItem(localStorageKeys.CATEGORIES_CONTENT, JSON.stringify(updatedContent));
      
      return newContent;
    } else {
      // Update existing content
      const updatedContent = {
        ...allContent[contentIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      allContent[contentIndex] = updatedContent;
      localStorage.setItem(localStorageKeys.CATEGORIES_CONTENT, JSON.stringify(allContent));
      
      return updatedContent;
    }
  } catch (error) {
    console.error(`Error updating category content for ${slug}:`, error);
    return null;
  }
};

// Delete category content
export const deleteCategoryContent = async (slug: string): Promise<boolean> => {
  try {
    const allContent = await getAllCategoryContent();
    const filteredContent = allContent.filter(c => c.slug !== slug);
    
    if (filteredContent.length === allContent.length) {
      return false; // Nothing was deleted
    }
    
    localStorage.setItem(localStorageKeys.CATEGORIES_CONTENT, JSON.stringify(filteredContent));
    return true;
  } catch (error) {
    console.error(`Error deleting category content for ${slug}:`, error);
    return false;
  }
};
