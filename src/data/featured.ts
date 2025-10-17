import type { Restaurant } from '@/types';

export interface FeaturedRestaurant extends Restaurant {
  featuredTier: 'premium' | 'gold' | 'platinum';
  featuredUntil: string;
  featuredSince: string;
  ctaText: string;
  ctaUrl: string;
  specialOffer?: string;
  badge?: string;
  priority: number; // Higher number = higher priority
}

export const featuredRestaurants: FeaturedRestaurant[] = [
  {
    id: 'featured-1',
    name: 'Providence',
    slug: 'providence',
    address: '5955 Melrose Ave, Los Angeles, CA 90038, USA',
    phone: '(323) 460-4170',
    website: 'https://www.providencela.com',
    rating: 4.7,
    priceLevel: 4,
    cuisineTypes: ['fine_dining', 'seafood_restaurant', 'contemporary'],
    openingHours: {
      'Tuesday': '6:00 PM – 10:00 PM',
      'Wednesday': '6:00 PM – 10:00 PM',
      'Thursday': '6:00 PM – 10:00 PM',
      'Friday': '6:00 PM – 10:00 PM',
      'Saturday': '6:00 PM – 10:00 PM',
      'Sunday': 'Closed',
      'Monday': 'Closed'
    },
    reviews: [
      {
        author: 'Michael R.',
        rating: 5,
        text: 'An absolutely magical dining experience. The tasting menu was perfection, and the intimate setting made our anniversary unforgettable.',
        time: 1640995200
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'
    ],
    placeId: 'ChIJd8BlQ2BZwokRAFQEcDlJRAI',
    latitude: 34.0836,
    longitude: -118.3236,
    dateNightScore: 99.0,
    city: 'Los Angeles',
    area: 'Los Angeles',
    zipCode: '90038',
    description: 'A culinary masterpiece offering an intimate fine dining experience with exceptional seafood and innovative presentations. The elegant dining room and impeccable service make it perfect for celebrating major milestones.',
    amenities: ['WiFi', 'Valet Parking', 'Reservations Required', 'Wine Bar', 'Private Dining'],
    specialFeatures: ['Highly Romantic', 'Perfect for Anniversaries', 'Chef\'s Tasting Menu', 'Wine Pairing'],
    lastUpdated: new Date().toISOString(),
    featuredTier: 'platinum',
    featuredUntil: '2025-12-31T23:59:59Z',
    featuredSince: '2024-01-01T00:00:00Z',
    ctaText: 'View Details',
    ctaUrl: '/losangeles/providence/',
    specialOffer: 'Complimentary champagne for anniversary celebrations',
    badge: 'Top Rated',
    priority: 100
  },
  {
    id: 'featured-2',
    name: 'République Café Bakery & République Restaurant',
    slug: 'republique-cafe-bakery-republique-restaurant',
    address: '624 S La Brea Ave, Los Angeles, CA 90036, USA',
    phone: '(310) 362-6115',
    website: 'https://www.republiquela.com',
    rating: 4.5,
    priceLevel: 3,
    cuisineTypes: ['french_restaurant', 'bakery', 'cafe'],
    openingHours: {
      'Monday': '8:00 AM – 3:00 PM',
      'Tuesday': '8:00 AM – 3:00 PM',
      'Wednesday': '8:00 AM – 3:00 PM',
      'Thursday': '8:00 AM – 3:00 PM',
      'Friday': '8:00 AM – 3:00 PM',
      'Saturday': '8:00 AM – 3:00 PM',
      'Sunday': '8:00 AM – 3:00 PM'
    },
    reviews: [
      {
        author: 'Sarah M.',
        rating: 5,
        text: 'The perfect blend of French elegance and California charm. The pastries are divine and the atmosphere is incredibly romantic.',
        time: 1640736000
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop'
    ],
    placeId: 'ChIJd8BlQ2BZwokRAFQEcDlJRAI',
    latitude: 34.0736,
    longitude: -118.3400,
    dateNightScore: 99.0,
    city: 'Los Angeles',
    area: 'Los Angeles',
    zipCode: '90036',
    description: 'A charming French café and bakery that perfectly captures the essence of Parisian romance in the heart of Los Angeles. Perfect for intimate brunch dates and romantic afternoon teas.',
    amenities: ['WiFi', 'Street Parking', 'Outdoor Seating', 'Bakery', 'Coffee Bar'],
    specialFeatures: ['French Pastries', 'Romantic Brunch', 'Outdoor Seating', 'Artisan Breads'],
    lastUpdated: new Date().toISOString(),
    featuredTier: 'gold',
    featuredUntil: '2025-11-30T23:59:59Z',
    featuredSince: '2024-01-15T00:00:00Z',
    ctaText: 'View Details',
    ctaUrl: '/losangeles/r-publique-caf-bakery-r-publique-restaurant/',
    specialOffer: 'Free pastry with brunch orders',
    badge: 'Editor\'s Choice',
    priority: 95
  },
  {
    id: 'featured-3',
    name: 'Bestia',
    slug: 'bestia',
    address: '2121 E 7th Pl, Los Angeles, CA 90021, USA',
    phone: '(213) 514-5724',
    website: 'https://www.bestiala.com',
    rating: 4.6,
    priceLevel: 3,
    cuisineTypes: ['italian_restaurant', 'wine_bar'],
    openingHours: {
      'Monday': 'Closed',
      'Tuesday': '5:30 PM – 10:00 PM',
      'Wednesday': '5:30 PM – 10:00 PM',
      'Thursday': '5:30 PM – 10:00 PM',
      'Friday': '5:30 PM – 11:00 PM',
      'Saturday': '5:30 PM – 11:00 PM',
      'Sunday': '5:30 PM – 10:00 PM'
    },
    reviews: [
      {
        author: 'David K.',
        rating: 5,
        text: 'This industrial-chic Italian restaurant offers handmade pasta and an impressive wine selection. The open kitchen adds excitement while maintaining an intimate, romantic vibe perfect for celebrations.',
        time: 1640390400
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'
    ],
    placeId: 'ChIJd8BlQ2BZwokRAFQEcDlJRAI',
    latitude: 34.0400,
    longitude: -118.2300,
    dateNightScore: 99.0,
    city: 'Los Angeles',
    area: 'Los Angeles',
    zipCode: '90021',
    description: 'This industrial-chic Italian restaurant offers handmade pasta and an impressive wine selection. The open kitchen adds excitement while maintaining an intimate, romantic vibe perfect for celebrations.',
    amenities: ['WiFi', 'Street Parking', 'Wine Bar', 'Open Kitchen', 'Reservations Recommended'],
    specialFeatures: ['Handmade Pasta', 'Wine Selection', 'Open Kitchen', 'Industrial Chic'],
    lastUpdated: new Date().toISOString(),
    featuredTier: 'premium',
    featuredUntil: '2025-10-31T23:59:59Z',
    featuredSince: '2024-02-01T00:00:00Z',
    ctaText: 'View Details',
    ctaUrl: '/losangeles/bestia/',
    specialOffer: 'Complimentary wine tasting with dinner',
    badge: 'Trending',
    priority: 90
  }
];

export function getFeaturedRestaurants(limit: number = 3): FeaturedRestaurant[] {
  const now = new Date();
  return featuredRestaurants
    .filter(restaurant => new Date(restaurant.featuredUntil) > now)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}

export function getFeaturedByTier(tier: 'premium' | 'gold' | 'platinum'): FeaturedRestaurant[] {
  const now = new Date();
  return featuredRestaurants
    .filter(restaurant => 
      restaurant.featuredTier === tier && 
      new Date(restaurant.featuredUntil) > now
    )
    .sort((a, b) => b.priority - a.priority);
}

export function addFeaturedRestaurant(restaurant: FeaturedRestaurant): void {
  featuredRestaurants.push(restaurant);
  featuredRestaurants.sort((a, b) => b.priority - a.priority);
}

export function removeFeaturedRestaurant(restaurantId: string): void {
  const index = featuredRestaurants.findIndex(r => r.id === restaurantId);
  if (index > -1) {
    featuredRestaurants.splice(index, 1);
  }
}

export function updateFeaturedRestaurant(restaurantId: string, updates: Partial<FeaturedRestaurant>): void {
  const index = featuredRestaurants.findIndex(r => r.id === restaurantId);
  if (index > -1) {
    featuredRestaurants[index] = { ...featuredRestaurants[index], ...updates };
    featuredRestaurants.sort((a, b) => b.priority - a.priority);
  }
}
