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
    id: 'restaurant-1',
    name: 'The Bazaar by José Andrés',
    slug: 'the-bazaar-by-jose-andres',
    address: '465 S La Cienega Blvd, Los Angeles, CA 90048',
    phone: '(310) 246-5555',
    website: 'https://www.thebazaar.com',
    rating: 4.5,
    priceLevel: 4,
    cuisineTypes: ['fine_dining', 'spanish_restaurant', 'tapas'],
    openingHours: {
      'Monday': '5:30 PM – 10:00 PM',
      'Tuesday': '5:30 PM – 10:00 PM',
      'Wednesday': '5:30 PM – 10:00 PM',
      'Thursday': '5:30 PM – 10:00 PM',
      'Friday': '5:30 PM – 11:00 PM',
      'Saturday': '5:30 PM – 11:00 PM',
      'Sunday': '5:30 PM – 10:00 PM'
    },
    reviews: [
      {
        author: 'Sarah M.',
        rating: 5,
        text: 'Perfect for a romantic dinner! The ambiance was incredible and the food was outstanding.',
        time: 1640995200
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'
    ],
    placeId: 'ChIJd8BlQ2BZwokRAFQEcDlJRAI',
    latitude: 34.0736,
    longitude: -118.4004,
    dateNightScore: 95.0,
    city: 'Los Angeles',
    area: 'Beverly Hills',
    zipCode: '90048',
    description: 'Experience the magic of José Andrés at The Bazaar, where Spanish tapas meet innovative cuisine in an intimate Beverly Hills setting.',
    amenities: ['WiFi', 'Valet Parking', 'Reservations Required', 'Wine Bar', 'Private Dining'],
    specialFeatures: ['Highly Romantic', 'Perfect for Anniversaries', 'Chef\'s Tasting Menu', 'Wine Pairing'],
    lastUpdated: new Date().toISOString(),
    featuredTier: 'platinum',
    featuredUntil: '2024-12-31T23:59:59Z',
    featuredSince: '2024-01-01T00:00:00Z',
    ctaText: 'Reserve Your Table',
    ctaUrl: 'https://www.thebazaar.com/reservations',
    specialOffer: 'Free dessert for date night reservations',
    badge: 'Editor\'s Choice',
    priority: 100
  },
  {
    id: 'restaurant-2',
    name: 'Nobu Los Angeles',
    slug: 'nobu-los-angeles',
    address: '903 N La Cienega Blvd, West Hollywood, CA 90069',
    phone: '(310) 657-0400',
    website: 'https://www.noburestaurants.com',
    rating: 4.4,
    priceLevel: 4,
    cuisineTypes: ['japanese_restaurant', 'sushi', 'fine_dining'],
    openingHours: {
      'Monday': '6:00 PM – 10:00 PM',
      'Tuesday': '6:00 PM – 10:00 PM',
      'Wednesday': '6:00 PM – 10:00 PM',
      'Thursday': '6:00 PM – 10:00 PM',
      'Friday': '6:00 PM – 11:00 PM',
      'Saturday': '6:00 PM – 11:00 PM',
      'Sunday': '6:00 PM – 10:00 PM'
    },
    reviews: [
      {
        author: 'David K.',
        rating: 4,
        text: 'Beautiful restaurant with amazing views. Perfect for special occasions.',
        time: 1640736000
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop'
    ],
    placeId: 'ChIJd8BlQ2BZwokRAFQEcDlJRAI',
    latitude: 34.0900,
    longitude: -118.4000,
    dateNightScore: 92.0,
    city: 'Los Angeles',
    area: 'West Hollywood',
    zipCode: '90069',
    description: 'World-renowned Japanese cuisine in an elegant West Hollywood setting, perfect for intimate date nights.',
    amenities: ['WiFi', 'Valet Parking', 'Reservations Required', 'Sake Bar', 'Private Dining'],
    specialFeatures: ['Critically Acclaimed', 'Award Winning', 'Sake Pairing', 'Omakase Menu'],
    lastUpdated: new Date().toISOString(),
    featuredTier: 'gold',
    featuredUntil: '2024-11-30T23:59:59Z',
    featuredSince: '2024-01-15T00:00:00Z',
    ctaText: 'Book Now',
    ctaUrl: 'https://www.noburestaurants.com/reservations',
    specialOffer: 'Complimentary sake tasting',
    badge: 'Featured',
    priority: 90
  },
  {
    id: 'restaurant-3',
    name: 'Catch LA',
    slug: 'catch-la',
    address: '8715 Melrose Ave, West Hollywood, CA 90069',
    phone: '(323) 347-6060',
    website: 'https://www.catchrestaurants.com',
    rating: 4.2,
    priceLevel: 4,
    cuisineTypes: ['seafood_restaurant', 'contemporary', 'rooftop_restaurant'],
    openingHours: {
      'Monday': '5:00 PM – 11:00 PM',
      'Tuesday': '5:00 PM – 11:00 PM',
      'Wednesday': '5:00 PM – 11:00 PM',
      'Thursday': '5:00 PM – 11:00 PM',
      'Friday': '5:00 PM – 12:00 AM',
      'Saturday': '5:00 PM – 12:00 AM',
      'Sunday': '5:00 PM – 11:00 PM'
    },
    reviews: [
      {
        author: 'James P.',
        rating: 4,
        text: 'Intimate and romantic setting. The chef\'s tasting menu was exceptional.',
        time: 1640390400
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'
    ],
    placeId: 'ChIJd8BlQ2BZwokRAFQEcDlJRAI',
    latitude: 34.0836,
    longitude: -118.3736,
    dateNightScore: 88.0,
    city: 'Los Angeles',
    area: 'West Hollywood',
    zipCode: '90069',
    description: 'Stunning rooftop views and incredible seafood in the heart of West Hollywood.',
    amenities: ['WiFi', 'Valet Parking', 'Rooftop Views', 'Outdoor Seating', 'Reservations Required'],
    specialFeatures: ['City Views', 'Sunset Dining', 'Rooftop Views', 'Fresh Seafood'],
    lastUpdated: new Date().toISOString(),
    featuredTier: 'premium',
    featuredUntil: '2024-10-31T23:59:59Z',
    featuredSince: '2024-02-01T00:00:00Z',
    ctaText: 'Reserve Table',
    ctaUrl: 'https://www.catchrestaurants.com/reservations',
    specialOffer: 'Sunset dining package available',
    badge: 'Trending',
    priority: 80
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
