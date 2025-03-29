import { localStorageKeys } from '@/lib/constants';

export interface CategoryContent {
  id: string;
  categoryId?: number;
  slug: string;
  headline: string;
  introduction: string;
  sections: CategoryContentSection[];
  recommendations: CategoryContentRecommendation[];
  faqs: CategoryContentFAQ[];
  meta: {
    title: string;
    description: string;
    canonical?: string;
  };
  lastUpdated: string;
}

export interface CategoryContentSection {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface CategoryContentRecommendation {
  id: string;
  title: string;
  productId: string | number;
  description: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface CategoryContentFAQ {
  id: string;
  question: string;
  answer: string;
}

// Sample data - in a real app this would come from an API
const sampleCategoryContent: CategoryContent[] = [
  {
    id: '1',
    slug: 'massage-guns',
    headline: 'The Ultimate Guide to Massage Guns',
    introduction: `
      Massage guns have revolutionized how athletes and fitness enthusiasts recover from intense workouts.
      These handheld devices deliver rapid bursts of pressure into muscle tissue, similar to a massage,
      promoting blood flow, reducing inflammation, and easing muscle tension and soreness.
      This guide covers everything you need to know about choosing and using a massage gun for optimal recovery.
    `,
    sections: [
      {
        id: 's1',
        title: 'How Massage Guns Work',
        content: `
          Massage guns use percussive therapy, delivering rapid pulses of pressure deep into muscle tissue.
          This mechanical stimulation increases blood flow to the area, which helps:
          
          • Reduce lactic acid buildup after exercise
          • Decrease muscle recovery time
          • Relieve muscle soreness and stiffness
          • Improve range of motion and flexibility
          • Release tension and stress in muscles
          
          Most massage guns offer variable speeds and interchangeable attachments to target different muscle groups and provide different intensities of treatment.
        `,
        imageUrl: 'https://ext.same-assets.com/30303030/massage-gun-how-works.jpg'
      },
      {
        id: 's2',
        title: 'Key Features to Consider',
        content: `
          When choosing a massage gun, consider these important factors:
          
          • **Amplitude/Stroke Length**: Measured in millimeters, this indicates how deep the massage gun can penetrate into muscle tissue. Recovery-focused athletes often prefer higher amplitude (12-16mm).
          
          • **Stall Force**: The amount of pressure the device can withstand before the motor stalls. Higher stall force (40+ lbs) is better for deep tissue work.
          
          • **Speeds and Power**: Multiple speed settings provide versatility for different body parts and recovery needs.
          
          • **Battery Life**: Look for 2+ hours of battery life for convenience.
          
          • **Noise Level**: Lower decibel ratings (under 65dB) make for a more pleasant experience.
          
          • **Attachments**: Different shaped heads target different muscle groups more effectively.
          
          • **Portability**: Consider size and weight if you plan to travel with your massage gun.
        `,
        imageUrl: 'https://ext.same-assets.com/30303030/massage-gun-features.jpg'
      },
      {
        id: 's3',
        title: 'How to Use a Massage Gun Effectively',
        content: `
          For best results with your massage gun:
          
          1. **Start Gentle**: Begin with the lowest speed setting, especially if you're new to percussion therapy.
          
          2. **Float Don't Press**: Let the massage gun head float over muscles without applying extra pressure.
          
          3. **Target Areas**: Spend 1-2 minutes per muscle group, focusing on areas that feel tight or sore.
          
          4. **Avoid Bones and Joints**: Stay on muscle tissue and avoid direct contact with bones, joints, and injuries.
          
          5. **Pre and Post Workout**: Use before workouts to activate muscles or after to speed recovery.
          
          6. **Stay Hydrated**: Drink plenty of water after using a massage gun to help flush toxins released from muscles.
          
          7. **Consistency**: For chronic muscle issues, regular use (daily or every other day) yields the best results.
        `,
        videoUrl: 'https://www.youtube.com/embed/example_video_id'
      }
    ],
    recommendations: [
      {
        id: 'r1',
        title: 'Best Overall: Theragun Pro',
        productId: '1',
        description: 'Professional-grade percussive therapy with unmatched power and a rotating arm for hard-to-reach areas.',
        imageUrl: 'https://ext.same-assets.com/30303030/massage-gun-theragun.jpg'
      },
      {
        id: 'r2',
        title: 'Best Value: Hypervolt 2',
        productId: '2',
        description: 'Excellent balance of performance and price with Bluetooth connectivity and guided app routines.',
        imageUrl: 'https://ext.same-assets.com/30303030/massage-gun-hypervolt.jpg'
      },
      {
        id: 'r3',
        title: 'Budget Pick: BOB AND BRAD Q2 Mini',
        productId: '3',
        description: 'Compact and affordable with surprising power and versatility for its size and price point.',
        imageUrl: 'https://ext.same-assets.com/30303030/massage-gun-bob-brad.jpg'
      }
    ],
    faqs: [
      {
        id: 'f1',
        question: 'How often should I use a massage gun?',
        answer: 'For general recovery, using a massage gun for 1-2 minutes per muscle group every other day is sufficient. For acute soreness or when training intensely, daily use is beneficial. Listen to your body—if a muscle is extremely sore, gentle daily treatment can help, but avoid overuse which can cause increased soreness.'
      },
      {
        id: 'f2',
        question: 'Are massage guns worth the investment?',
        answer: 'For active individuals, massage guns can be worth the investment by reducing recovery time between workouts, improving mobility, and providing on-demand relief from muscle soreness. They offer convenience compared to regular massage therapy appointments and can be used any time. Higher-end models typically last longer and provide more effective treatment.'
      },
      {
        id: 'f3',
        question: 'Can massage guns help with muscle knots?',
        answer: 'Yes, massage guns are effective for releasing muscle knots or trigger points. The percussive therapy helps break up adhesions in muscle fibers and fascia that form knots. For best results, start at a low speed setting and gradually increase as needed, spending extra time on the knotted area without causing pain.'
      },
      {
        id: 'f4',
        question: 'When should you NOT use a massage gun?',
        answer: 'Avoid using massage guns on injuries (fractures, sprains, strains), inflamed or infected areas, varicose veins, or areas with reduced sensation. People with certain medical conditions like blood clotting disorders, neuropathy, or osteoporosis should consult a healthcare provider before use. Never use directly on bones, joints, nerves, or the spine.'
      }
    ],
    meta: {
      title: 'Massage Guns: The Ultimate Recovery Tool Guide [2023]',
      description: 'Discover the best massage guns for muscle recovery, how they work, key features to look for, and expert tips to maximize your results.',
      canonical: '/categories/massage-guns'
    },
    lastUpdated: '2023-04-15'
  }
];

/**
 * Get all category content
 */
export const getCategoryContent = async (): Promise<CategoryContent[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if we have cached data
      const cachedData = localStorage.getItem(localStorageKeys.CATEGORY_CONTENT);
      if (cachedData) {
        resolve(JSON.parse(cachedData));
      } else {
        // Store the sample data in local storage for future use
        localStorage.setItem(localStorageKeys.CATEGORY_CONTENT, JSON.stringify(sampleCategoryContent));
        resolve(sampleCategoryContent);
      }
    }, 300); // Simulate API delay
  });
};

/**
 * Get category content by slug
 */
export const getCategoryContentBySlug = async (slug: string): Promise<CategoryContent | null> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if we have cached data
      const cachedData = localStorage.getItem(localStorageKeys.CATEGORY_CONTENT);
      if (cachedData) {
        const allContent = JSON.parse(cachedData) as CategoryContent[];
        const content = allContent.find(c => c.slug === slug);
        resolve(content || null);
      } else {
        // Store the sample data in local storage for future use
        localStorage.setItem(localStorageKeys.CATEGORY_CONTENT, JSON.stringify(sampleCategoryContent));
        const content = sampleCategoryContent.find(c => c.slug === slug);
        resolve(content || null);
      }
    }, 300); // Simulate API delay
  });
};

/**
 * Create new category content
 */
export const createCategoryContent = async (content: Partial<CategoryContent>): Promise<CategoryContent> => {
  // Generate a new ID if not provided
  const newContent: CategoryContent = {
    ...content as any,
    id: content.id || Date.now().toString(),
    lastUpdated: new Date().toISOString()
  };
  
  return saveCategoryContent(newContent);
};

/**
 * Update existing category content
 */
export const updateCategoryContent = async (id: string, content: Partial<CategoryContent>): Promise<CategoryContent> => {
  const updatedContent: CategoryContent = {
    ...content as any,
    id,
    lastUpdated: new Date().toISOString()
  };
  
  return saveCategoryContent(updatedContent);
};

/**
 * Add or update category content
 */
export const saveCategoryContent = async (content: CategoryContent): Promise<CategoryContent> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const cachedData = localStorage.getItem(localStorageKeys.CATEGORY_CONTENT);
      const allContent: CategoryContent[] = cachedData ? JSON.parse(cachedData) : [...sampleCategoryContent];
      
      // Find the index of the content if it exists
      const existingIndex = allContent.findIndex(c => c.id === content.id);
      
      // If content with this ID exists, update it, otherwise add it
      if (existingIndex >= 0) {
        allContent[existingIndex] = {
          ...content,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      } else {
        allContent.push({
          ...content,
          id: Date.now().toString(), // Generate a new ID
          lastUpdated: new Date().toISOString().split('T')[0]
        });
      }
      
      // Update storage
      localStorage.setItem(localStorageKeys.CATEGORY_CONTENT, JSON.stringify(allContent));
      
      // Find the updated/added content to return
      const updatedContent = allContent.find(c => c.slug === content.slug);
      
      resolve(updatedContent!);
    }, 500); // Simulate API delay
  });
};

/**
 * Delete category content
 */
export const deleteCategoryContent = async (id: string): Promise<boolean> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const cachedData = localStorage.getItem(localStorageKeys.CATEGORY_CONTENT);
      if (!cachedData) {
        resolve(false);
        return;
      }
      
      const allContent: CategoryContent[] = JSON.parse(cachedData);
      const newContent = allContent.filter(c => c.id !== id);
      
      if (newContent.length === allContent.length) {
        // No content was removed
        resolve(false);
      } else {
        // Update storage with filtered content
        localStorage.setItem(localStorageKeys.CATEGORY_CONTENT, JSON.stringify(newContent));
        resolve(true);
      }
    }, 500); // Simulate API delay
  });
};

/**
 * Generate default content for a new category
 */
export const generateDefaultCategoryContent = (categoryName: string, categorySlug: string): CategoryContent => {
  return {
    id: '', // Will be set by saveCategoryContent
    slug: categorySlug,
    headline: `Your Guide to ${categoryName}`,
    introduction: `Learn everything you need to know about choosing and using ${categoryName.toLowerCase()} for optimal recovery and performance.`,
    sections: [
      {
        id: `s1-${Date.now()}`,
        title: `Benefits of ${categoryName}`,
        content: `Discover the main benefits of using ${categoryName.toLowerCase()} for recovery and performance.`,
        imageUrl: ''
      },
      {
        id: `s2-${Date.now()}`,
        title: 'How to Choose the Right Product',
        content: 'Factors to consider when selecting the perfect product for your needs.',
        imageUrl: ''
      }
    ],
    recommendations: [],
    faqs: [
      {
        id: `f1-${Date.now()}`,
        question: `How often should I use a ${categoryName.toLowerCase()}?`,
        answer: 'This depends on your specific needs and goals. Generally, regular use is recommended for best results.'
      }
    ],
    meta: {
      title: `${categoryName}: Complete Guide and Product Reviews`,
      description: `Everything you need to know about ${categoryName.toLowerCase()}, including benefits, how to choose, and reviews of the top products.`
    },
    lastUpdated: new Date().toISOString().split('T')[0]
  };
};
