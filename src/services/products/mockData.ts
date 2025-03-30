
import { Product } from './types';

export const generateMockProducts = (): Product[] => {
  return [
    {
      id: 1,
      slug: 'theragun-elite',
      name: 'Theragun Elite',
      title: 'Theragun Elite Massage Gun',
      description: 'Premium percussion massage device for deep muscle treatment.',
      shortDescription: 'Professional-grade massage gun with 5 attachments and 5 speeds.',
      price: 399.99,
      originalPrice: 449.99,
      rating: 4.8,
      reviewCount: 1245,
      features: [
        'Quiet Force Technology',
        '120-minute battery life',
        '5 built-in speeds',
        '40 lbs of force',
        'Bluetooth app integration'
      ],
      imageUrl: 'https://ext.same-assets.com/1001010126/massage-gun-category.jpg',
      images: ['https://ext.same-assets.com/1001010126/massage-gun-category.jpg'],
      additionalImages: [
        'https://ext.same-assets.com/30303031/foam-roller-category.jpg',
        'https://ext.same-assets.com/30303032/compression-category.jpg'
      ],
      inStock: true,
      category: 'massage-guns',
      categoryId: 'massage-guns',
      specifications: {
        'Weight': '2.2 lbs',
        'Dimensions': '9.5 x 6.7 x 2.8 inches',
        'Speed Range': '1750-2400 PPM',
        'Battery Life': '120 minutes',
        'Noise Level': '60-65 dB'
      },
      specs: {
        'Weight': '2.2 lbs',
        'Dimensions': '9.5 x 6.7 x 2.8 inches',
        'Speed Range': '1750-2400 PPM',
        'Battery Life': '120 minutes',
        'Noise Level': '60-65 dB'
      },
      bestSeller: true,
      affiliateUrl: 'https://www.amazon.com/Theragun-Elite-Massage-Gun-Professionals/dp/B086Z6YDPL/',
      brand: 'Theragun',
      pros: [
        'Extremely quiet operation',
        'Ergonomic multi-grip design',
        'Smart app integration',
        'Excellent build quality'
      ]
    }
  ];
};
