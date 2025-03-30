
import { Product } from './types';

export const generateMockProducts = (): Product[] => {
  return [
    {
      id: "1",
      name: "TheraGun Pro",
      slug: "theragun-pro",
      description: "Professional-grade deep tissue massage gun",
      shortDescription: "Professional massage therapy at home",
      price: 599,
      originalPrice: 699,
      rating: 4.8,
      reviewCount: 456,
      imageUrl: "https://example.com/theragun.jpg",
      images: ["https://example.com/theragun.jpg"],
      inStock: true,
      categoryId: "massage-guns",
      category: "Massage Guns",
      subcategory: "Professional",
      specifications: {
        "Motor": "Professional-Grade QX150",
        "Battery Life": "150 minutes",
        "Noise Level": "Quiet (60-70 db)",
        "Speeds": "5 built-in speeds"
      },
      features: [
        "5 attachments for targeted relief",
        "Smart app integration",
        "Ergonomic multi-grip"
      ],
      bestSeller: true,
      affiliateUrl: "https://www.amazon.com/dp/B086Z6PJXQ?tag=example-20",
      asin: "B086Z6PJXQ",
      brand: "Therabody"
    },
    {
      id: "2",
      name: "Hypervolt GO",
      slug: "hypervolt-go",
      description: "Portable massage device for on-the-go recovery",
      shortDescription: "Compact recovery solution",
      price: 199,
      originalPrice: 249,
      rating: 4.6,
      reviewCount: 302,
      imageUrl: "https://example.com/hypervolt.jpg",
      images: ["https://example.com/hypervolt.jpg"],
      inStock: true,
      categoryId: "massage-guns",
      category: "Massage Guns",
      subcategory: "Portable",
      specifications: {
        "Motor": "Standard QX45",
        "Battery Life": "2.5 hours",
        "Noise Level": "Quiet (55-65 db)",
        "Speeds": "3 speed settings"
      },
      features: [
        "Lightweight design (1.5 lbs)",
        "TSA-approved for carry-on",
        "2 head attachments included"
      ],
      bestSeller: false,
      affiliateUrl: "https://www.amazon.com/dp/B089YSGWWN?tag=example-20",
      asin: "B089YSGWWN",
      brand: "Hyperice"
    },
    {
      id: "3", 
      name: "Renpho R3 Mini Massage Gun",
      slug: "renpho-r3-mini-massage-gun",
      description: "Budget-friendly portable massage gun with 5 attachments",
      shortDescription: "Affordable recovery solution",
      price: 69.99,
      originalPrice: 99.99,
      rating: 4.4,
      reviewCount: 1250,
      imageUrl: "https://example.com/renpho.jpg",
      images: ["https://example.com/renpho.jpg"],
      inStock: true,
      categoryId: "massage-guns",
      category: "Massage Guns",
      subcategory: "Budget",
      specifications: {
        "Motor": "Standard",
        "Battery Life": "Up to 6 hours",
        "Noise Level": "Under 45dB",
        "Speeds": "5 speed settings"
      },
      features: [
        "5 head attachments",
        "Super lightweight (1.5 lbs)",
        "USB-C charging"
      ],
      bestSeller: true,
      affiliateUrl: "https://www.amazon.com/dp/B085TN2D6B?tag=example-20",
      asin: "B085TN2D6B",
      brand: "RENPHO"
    }
  ];
};
