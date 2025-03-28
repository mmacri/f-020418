
import { localStorageKeys, DEFAULT_CATEGORIES } from "@/lib/constants";

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
  'foam-rollers': {
    title: "Foam Rollers for Self-Myofascial Release",
    description: "Comprehensive guide to selecting the best foam rollers for recovery, mobility, and myofascial release",
    introduction: "Foam rolling is a self-myofascial release (SMR) technique that can help release muscle tightness, improve mobility, and enhance recovery. Using your body weight on a foam roller, you can apply pressure to specific points on your body to help loosen tight muscles and trigger points. Our guide will help you choose the right foam roller for your recovery routine.",
    benefits: [
      "Reduced Muscle Tension: Breaks up adhesions in muscle tissue and fascia",
      "Increased Blood Flow: Stimulates circulation to promote healing",
      "Enhanced Recovery: Speeds up post-workout recovery by reducing DOMS",
      "Improved Mobility: Increases flexibility and range of motion in joints",
      "Cost-Effective: More affordable than regular massage therapy sessions"
    ],
    videoId: "M9YjKS3Jm5g",
    videoTitle: "Foam Rolling Techniques for Recovery",
    videoDescription: "Learn how to effectively use foam rollers for different muscle groups to maximize recovery and mobility:",
    faqs: [
      {
        question: "How often should I foam roll?",
        answer: "For best results, foam rolling can be done daily for 5-20 minutes, especially before workouts and during recovery days. Consistency is key for seeing improvements in mobility and recovery."
      },
      {
        question: "Should foam rolling hurt?",
        answer: "Foam rolling may cause some discomfort, especially when working on tight areas, but it shouldn't be excessively painful. You should feel a 'good pain' similar to a deep tissue massage. If you experience sharp or intense pain, reduce the pressure or avoid that specific area."
      },
      {
        question: "What's the difference between soft and firm foam rollers?",
        answer: "Soft foam rollers provide gentle pressure and are ideal for beginners or those with sensitive muscles. Firm or high-density foam rollers deliver more intense pressure and are better for experienced users or for targeting deep muscle tissue."
      }
    ],
    buyingGuide: "When choosing a foam roller, consider these factors: density (soft, medium, or firm), which affects the intensity of pressure; texture (smooth or textured), with textured rollers providing deeper muscle penetration; size, with longer rollers offering more stability for beginners; portability if you plan to travel with it; and durability, with EVA and EPP foam typically lasting longer than traditional PE foam."
  },
  'compression-gear': {
    title: "Compression Gear for Enhanced Recovery",
    description: "Guide to the best compression sleeves, garments, and boots for improved circulation and faster recovery",
    introduction: "Compression gear works by applying graduated pressure to specific body parts, enhancing blood flow and reducing swelling. Athletes and fitness enthusiasts use compression wear during and after exercise to speed recovery, reduce muscle soreness, and improve performance. From sleeves and socks to full recovery boots, we'll help you find the right compression solutions for your needs.",
    benefits: [
      "Improved Circulation: Enhances blood flow to muscles for faster recovery",
      "Reduced Swelling: Minimizes fluid buildup in tissues after intense activity",
      "Decreased Muscle Soreness: Limits the onset of delayed muscle soreness (DOMS)",
      "Better Muscle Support: Provides stability and reduces muscle vibration during activity",
      "Enhanced Oxygen Delivery: Improves oxygen flow to working muscles"
    ],
    videoId: "HCn-qZBc9Gw",
    videoTitle: "How Compression Gear Accelerates Recovery",
    videoDescription: "Learn about the science behind compression therapy and see how to properly use different compression products:",
    faqs: [
      {
        question: "When should I wear compression garments?",
        answer: "Compression garments can be worn during exercise to improve performance and reduce fatigue, or after exercise for 1-2 hours (or overnight for some products) to enhance recovery and reduce delayed onset muscle soreness."
      },
      {
        question: "How tight should compression gear be?",
        answer: "Compression gear should feel snug but not restrictive. You should feel pressure but still have full range of motion and not experience any numbness, tingling, or color changes in extremities. Medical-grade compression is measured in mmHg, with recovery products typically ranging from 15-30 mmHg."
      },
      {
        question: "What's the difference between compression sleeves and full garments?",
        answer: "Compression sleeves target specific areas like calves, arms, or knees and are ideal for localized support and recovery. Full garments such as tights, shirts, or socks provide broader coverage and more comprehensive compression benefits across larger muscle groups."
      }
    ],
    buyingGuide: "When selecting compression gear, consider: compression level (measured in mmHg), with higher numbers providing stronger compression; material quality, with moisture-wicking and antimicrobial properties being beneficial; fit, which should be snug without restricting circulation; intended use, whether for during activity or recovery; and special features like graduated compression or targeted support zones."
  },
  'resistance-bands': {
    title: "Resistance Bands for Flexibility & Recovery",
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
    videoDescription: "Watch this video to learn effective resistance band stretches and mobility exercises that can enhance your recovery and improve flexibility:",
    faqs: [
      {
        question: "What types of resistance bands are best for recovery?",
        answer: "For recovery purposes, flat therapy bands (like Therabands) are excellent for gentle stretching and rehabilitation, while loop bands are great for mobility exercises and assisted stretching. Fabric bands offer durability and comfort for recovery movements."
      },
      {
        question: "How do I choose the right resistance level?",
        answer: "For recovery and flexibility work, start with lighter resistance that allows you to perform movements with proper form through a full range of motion. You should feel gentle tension but no pain. Many recovery-focused band sets are color-coded by resistance level, with lighter colors typically indicating lower resistance."
      },
      {
        question: "Can resistance bands help with injury recovery?",
        answer: "Yes, resistance bands are commonly used in physical therapy and rehabilitation because they provide adaptable, low-impact resistance that's gentle on joints. They're particularly effective for rebuilding strength after injuries to shoulders, knees, and ankles, but should be used under professional guidance for serious injuries."
      }
    ],
    buyingGuide: "When purchasing resistance bands for recovery, consider: band type (therapy flat bands, loop bands, or fabric bands); material quality, as latex bands offer more elasticity while fabric bands provide more durability; resistance levels, with most recovery work requiring light to medium resistance; length and width, which affects the exercises you can perform; and whether you need handles or anchors for specific recovery movements."
  },
  'recovery-tech': {
    title: "Recovery Technology & Gadgets",
    description: "Explore cutting-edge recovery technology including massage devices, TENS units, and smart recovery tools",
    introduction: "Recovery technology has evolved dramatically in recent years, bringing professional-grade recovery tools into home settings. From electrical muscle stimulation to infrared therapy and smart recovery devices, these tools can significantly enhance recovery protocols. We've evaluated the latest recovery tech to help you find effective solutions that fit your needs and budget.",
    benefits: [
      "Accelerated Recovery: Advanced technology speeds up the body's natural healing processes",
      "Targeted Treatment: Precision devices allow for focused recovery in specific problem areas",
      "Data-Driven Insights: Smart recovery tools track progress and optimize recovery protocols",
      "Professional-Grade Results: Access to technology previously only available in clinical settings",
      "Customized Protocols: Adjustable settings for personalized recovery experiences"
    ],
    videoId: "jtI1HI0DFHM",
    videoTitle: "Modern Recovery Technology Explained",
    videoDescription: "See how various recovery technologies work and learn which might be right for your specific recovery needs:",
    faqs: [
      {
        question: "Are recovery tech devices worth the investment?",
        answer: "High-quality recovery technology can be a worthwhile investment for serious athletes, individuals recovering from injuries, or those with chronic pain issues. While the upfront cost may be higher than traditional recovery tools, many users find the convenience and effectiveness justify the expense over time."
      },
      {
        question: "What's the difference between TENS and EMS devices?",
        answer: "TENS (Transcutaneous Electrical Nerve Stimulation) devices primarily work for pain management by blocking pain signals, while EMS (Electrical Muscle Stimulation) devices cause muscle contractions that improve strength and recovery. Some recovery devices combine both technologies for comprehensive benefits."
      },
      {
        question: "How often should I use recovery technology devices?",
        answer: "Usage frequency depends on the specific device and your recovery needs. Most massage and compression devices can be used daily for 15-30 minutes, while technology like red light therapy might have specific protocols (3-5 times weekly for 10-20 minutes). Always follow manufacturer guidelines and listen to your body's response."
      }
    ],
    buyingGuide: "When evaluating recovery technology, consider: scientific evidence supporting the technology; battery life for portable devices; ease of use and intuitive controls; durability and warranty coverage; connectivity features if you want data tracking; noise level for home use; and overall value compared to professional treatments over time."
  }
};

// Helper function to ensure all default categories have content
const ensureAllCategoriesHaveDefaultContent = () => {
  // Add basic default content for any missing categories
  DEFAULT_CATEGORIES.forEach(slug => {
    if (!defaultCategoryContent[slug]) {
      defaultCategoryContent[slug] = {
        title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: `Learn about the best ${slug.replace(/-/g, ' ')} for recovery and performance.`,
        introduction: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} are essential tools for optimizing your recovery process.`,
        benefits: [
          "Improved Recovery: Helps muscles recover faster after workouts",
          "Enhanced Performance: Leads to better physical performance over time",
          "Injury Prevention: Reduces the risk of common exercise-related injuries"
        ]
      };
    }
  });
};

// Ensure all categories have default content
ensureAllCategoriesHaveDefaultContent();

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
    } else {
      // Check for any missing categories and add default content
      const existingSlugs = content.map(c => c.slug);
      const missingSlugs = Object.keys(defaultCategoryContent).filter(slug => !existingSlugs.includes(slug));
      
      if (missingSlugs.length > 0) {
        const newContents = missingSlugs.map(slug => {
          const data = defaultCategoryContent[slug];
          return {
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
        });
        
        content = [...content, ...newContents];
        localStorage.setItem(localStorageKeys.CATEGORIES_CONTENT, JSON.stringify(content));
      }
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

// Import content from affiliate site by URL
export const importContentFromUrl = async (
  slug: string,
  url: string
): Promise<CategoryContent | null> => {
  try {
    // In a real app, this would scrape content from the URL
    // For now, we'll simulate a successful import
    const baseContent = await getCategoryContentBySlug(slug);
    
    if (!baseContent) return null;
    
    // Simulate enhanced content
    const enhancedContent: CategoryContent = {
      ...baseContent,
      introduction: `${baseContent.introduction} Additional insights gathered from ${url}.`,
      updatedAt: new Date().toISOString()
    };
    
    // Save the enhanced content
    return updateCategoryContent(slug, enhancedContent);
  } catch (error) {
    console.error(`Error importing content from URL for ${slug}:`, error);
    return null;
  }
};
