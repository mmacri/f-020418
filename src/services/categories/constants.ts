
import { Category } from './types';

// Define default categories to use when none exist or for fallback
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Massage Guns",
    slug: "massage-guns",
    description: "Percussive therapy devices to relieve muscle tension and improve recovery",
    imageUrl: "https://ext.same-assets.com/1001010126/massage-gun-category.jpg",
    showInNavigation: true,
    navigationOrder: 1,
    subcategories: [
      {
        id: "1-1",
        name: "Professional Grade",
        slug: "professional-grade",
        description: "High-powered massage guns for professional use",
        imageUrl: "https://ext.same-assets.com/30303030/massage-gun-pro.jpg",
        showInNavigation: true
      },
      {
        id: "1-2",
        name: "Portable",
        slug: "portable",
        description: "Compact massage guns for travel and on-the-go recovery",
        imageUrl: "https://ext.same-assets.com/30303030/massage-gun-portable.jpg",
        showInNavigation: true
      }
    ]
  },
  {
    id: "2",
    name: "Foam Rollers",
    slug: "foam-rollers",
    description: "Self-myofascial release tools for recovery and flexibility",
    imageUrl: "https://ext.same-assets.com/30303031/foam-roller-category.jpg",
    showInNavigation: true,
    navigationOrder: 2,
    subcategories: [
      {
        id: "2-1",
        name: "Standard",
        slug: "standard",
        description: "Traditional foam rollers for general use",
        imageUrl: "https://ext.same-assets.com/30303031/foam-roller-standard.jpg",
        showInNavigation: true
      },
      {
        id: "2-2",
        name: "Textured",
        slug: "textured",
        description: "Textured foam rollers for deeper tissue massage",
        imageUrl: "https://ext.same-assets.com/30303031/foam-roller-textured.jpg",
        showInNavigation: true
      }
    ]
  },
  {
    id: "3",
    name: "Compression Devices",
    slug: "compression-devices",
    description: "Pneumatic compression systems for enhanced recovery",
    imageUrl: "https://ext.same-assets.com/30303032/compression-category.jpg",
    showInNavigation: true,
    navigationOrder: 3,
    subcategories: [
      {
        id: "3-1",
        name: "Leg Sleeves",
        slug: "leg-sleeves",
        description: "Compression sleeves for leg recovery",
        imageUrl: "https://ext.same-assets.com/30303032/compression-legs.jpg",
        showInNavigation: true
      },
      {
        id: "3-2",
        name: "Full Body Systems",
        slug: "full-body-systems",
        description: "Comprehensive compression systems for full-body recovery",
        imageUrl: "https://ext.same-assets.com/30303032/compression-full.jpg",
        showInNavigation: true
      }
    ]
  }
];
