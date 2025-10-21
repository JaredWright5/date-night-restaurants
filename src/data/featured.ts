import type { Restaurant } from '@/types';
import { restaurants } from './restaurants';

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

// Function to get featured restaurants from localStorage or fallback to default
export function getFeaturedRestaurants(limit: number = 4): FeaturedRestaurant[] {
  // This will be handled by client-side JavaScript
  // For now, return the default featured restaurants
  return getDefaultFeaturedRestaurants(limit);
}

// Default featured restaurants (fallback)
function getDefaultFeaturedRestaurants(limit: number): FeaturedRestaurant[] {
  return featuredRestaurants.slice(0, limit);
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
      'https://places.googleapis.com/v1/places/ChIJaUBtetO-woARqyrV4ASPECg/photos/AciIO2euek7N00qVvj3sovGkROPx-XilR9AiuJYxiAb2xMZXBrMoa3xx7za6VpvcmXKKP17p37sBPN3sz-5h_yWH0POsLaPiTgvO9E_OOHiR9UbIWOgqxkhe8uHsesbB9pXvafQtoPK6HBqY9UhbmftB24zO58QW80oNVRaj2_4nLBRxf61X-azEPakRtWDDLJ1cgp5eUicNSWZ3k8bmuMmlswre5GEzeweXD4JGC_60brbncPdLxwH38oqe4Vc_HY53Oa2-QbXojbUm0zAfx4dnK3qokO6o6fN65L9kXV_etMEHMg/media?key=AIzaSyCiRZ0a28y84EHFtBufwGklkO35zRGGzkI&maxWidthPx=800',
      'https://places.googleapis.com/v1/places/ChIJaUBtetO-woARqyrV4ASPECg/photos/AciIO2eG8OyenYKBkkrHZ9aSEv2Lep3S9OiBtDeHG2tclOX_Jj7unaGJ_wOxdmpPMXhfLaZEcCrE3OLRsdUyoY92WtZPY5VV2iG1dvkFd3XM4hdiAfZ1UOvUxkLyJoPV4SGaECYHcljah3eDDxshq--tOVLxu9wqwD_Hpqv8ZnAfrO7hZVb3karMJE5yhk1MVWdppN8wo1gIMt-7JG5Q7x35J3hMV8Rc3MlkTVmKGEs0ltXbCs1deE7j5Ku_-JDUvN4Fe5t83a5UyWieQzx3CrIHCo-QJIRFsT5gmLuYMfeubp8VAg/media?key=AIzaSyCiRZ0a28y84EHFtBufwGklkO35zRGGzkI&maxWidthPx=800'
    ],
    placeId: 'ChIJd8BlQ2BZwokRAFQEcDlJRAI',
    latitude: 34.0836,
    longitude: -118.3236,
    dateNightScore: 85,
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
    specialOffer: '',
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
      'https://places.googleapis.com/v1/places/ChIJqaA5zt-4woARHGIEp3XlsZo/photos/AciIO2esk-PqTKcj9AXhZxpm7hJ3NH1RyCnX7xY_7JbDRl59GPrl2-xSJN9jBK5PrMNiCRSH7F-xUWqPtycjnPfeaHIZlmCztUn7fl-lkLA7CFtu0GDrONRSl6_N8_2Ga4zFfrH0Ca50hHCVs4AOMz3uxCNHfpAOxHalIRzyaHIhBlX6MiUeP3VKMaP8CPibVPr0IPTaj-IQNYovXRpTY0RzuIGdfOrUf5kKz6FKjmNeXmO4RujLfbR7j6saBKAEX4SWMm86DBlQh8ufcSurVSGj-HNGXW8htVxWKw5_-huiTEKtUw/media?key=AIzaSyCiRZ0a28y84EHFtBufwGklkO35zRGGzkI&maxWidthPx=800',
      'https://places.googleapis.com/v1/places/ChIJqaA5zt-4woARHGIEp3XlsZo/photos/AciIO2dvF_aqXOWbV8pY4IHUiDuROm7Us7sJEce2okuWvkDM7m8BA8LoPNVUMRRF0jXmcjIQltoeIpBw2PO9G4UD17OOCfUflBMVuVLS21ufNKDWgZswpyRy5ld4RQhoz6Z_FRCIiPyA4z5Mgu-HtMfjz9fLGhjy42XM7L5WqOVxIoFAvomqFiFJhXikVyjvQeaMf6IPuaBp6Z4m08M0C_QcrN7oYANlSBVyBMBEEqz4SVLuneG-VVqsUsf1A_xPVXHNb2xaS_y0jCppcGhMIdhpIPpcI3N89QjL6-SMSkutFNBLxA/media?key=AIzaSyCiRZ0a28y84EHFtBufwGklkO35zRGGzkI&maxWidthPx=800'
    ],
    placeId: 'ChIJd8BlQ2BZwokRAFQEcDlJRAI',
    latitude: 34.0736,
    longitude: -118.3400,
    dateNightScore: 84,
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
    specialOffer: '',
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
      'https://places.googleapis.com/v1/places/ChIJSRvZ1yHGwoARcLrfvc-APl4/photos/AciIO2dB0_cnF19c5nrNmOw1KCBF3CuqsV90tj8P98PVsW-3b8P6HuGXqNMO4WsEpae1W1v7e-eYGs2hNoTDLDFFbwTU0loOKiW4rTu0Gek3Q5OxLXMkckJoyMmGZ7G6iwj-OtIESqgo9RzVz9LAp2KaMvf9Cz_vL-c7xXlKfgf2aQCflhmvf3ahI1rqy5y-WfQuIz_eXy0QrfpW8Cclwx7jPlz6h7X-1LEPlZQGRqTiHuTTfMv9fFBBq9_29YAxP0o1sJgiY_O9_pgoVwazcef2mMOZn45I7KI7m7XHKWctjzD-JQ/media?key=AIzaSyCiRZ0a28y84EHFtBufwGklkO35zRGGzkI&maxWidthPx=800',
      'https://places.googleapis.com/v1/places/ChIJSRvZ1yHGwoARcLrfvc-APl4/photos/AciIO2dj49uI3kQcAMrJFBh5ozqU0ajsa0JbRpme9quYO5NZBfCAebKR1J1Pot2Fwu-3OP7zVoDL3qcsiIT-f8_-LmerzT8N_-_ShaxXjiLaJQV4thNQtP2yixqknsRdRsMIzfG9HZJkarLk59FzG110BQNx924dd4P9f2tjHS4l6VgnOAYtarJjdmMp5xRSwRF3NhBdShKUOdYu6hJCiz6CYGz6SRnDM0cpHT2PhwQpLuQymlje6R9-8HEiWMkbtU9Wk7WpPrCvEHNz6moICaypgMAkwYLJ6aedcJcbjbjnbnMqKA/media?key=AIzaSyCiRZ0a28y84EHFtBufwGklkO35zRGGzkI&maxWidthPx=800'
    ],
    placeId: 'ChIJd8BlQ2BZwokRAFQEcDlJRAI',
    latitude: 34.0400,
    longitude: -118.2300,
    dateNightScore: 81,
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
    specialOffer: '',
    badge: 'Trending',
    priority: 90
  },
  {
    id: 'featured-4',
    name: 'Osteria Mozza',
    slug: 'osteria-mozza',
    address: '6602 Melrose Ave, Los Angeles, CA 90038, USA',
    phone: '(323) 297-0100',
    website: 'https://www.osteriamozza.com',
    rating: 4.4,
    priceLevel: 4,
    cuisineTypes: ['italian_restaurant', 'fine_dining'],
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
        author: 'Maria L.',
        rating: 5,
        text: 'This intimate Italian restaurant specializes in handmade pasta and traditional Northern Italian cuisine. The cozy atmosphere and candlelit tables create a romantic setting for celebrations.',
        time: 1640390400
      }
    ],
    photos: [
      'https://places.googleapis.com/v1/places/ChIJBacpEtO4woAR8TxewBOIolo/photos/AciIO2d6FyYyS2MQd5PEJolPxd0ThKOwdZlfRff7htb6BoXnLiKZck6iJpgFjSFxyBq4dL70lD8YrUZvpnI9cj73sql5yzihY5jRseJQdlbLOdYoea52lmknu1sIarHrJOJRYF6vK5brgEV9-wHPf47wRQfHE-zwC4uVIkQO6UmdDKPzZHzATgO1LjgMB6_kiySttO7BCth4yT7UQmNAb_bJbYKxbYEOD-nuYyFZDbhWv3qLdWNuvWIqxi-SU45spMartshcaUSZb1tUjL9rrIubcG0A9G_8YcNgcV5Aw-g2e1PQ-w/media?key=AIzaSyCiRZ0a28y84EHFtBufwGklkO35zRGGzkI&maxWidthPx=800',
      'https://places.googleapis.com/v1/places/ChIJBacpEtO4woAR8TxewBOIolo/photos/AciIO2c51hqJt67ezyN4FJmIaqiRa3a1gV9YGTG3BKnORBfiP6yoNrFWH-nkecVu8YFhOjjgvxSrJWY1Kbba9Pju4TJkIKP5kRHadAGx0euS5DgEjA6Gwmd6us5NgwGF2sZ_LBA3sBd-pI7jEWVFtOFhhfQBIz5PPDnv1EFWILeod72yodrOw2wEtrd_vEx690_E5Qz5D7I9v3RwW9XkOL_x4yFGrdrsPyPazfBrOjLsjMq8pfn7LELrc7CT_j3XFCHz5OnrMu72TuC9Ngg45HNL62gJKNDl_zGIsvvEahhBDnR8OA/media?key=AIzaSyCiRZ0a28y84EHFtBufwGklkO35zRGGzkI&maxWidthPx=800'
    ],
    placeId: 'ChIJd8BlQ2BZwokRAFQEcDlJRAI',
    latitude: 34.0836,
    longitude: -118.3236,
    dateNightScore: 86,
    city: 'Los Angeles',
    area: 'Los Angeles',
    zipCode: '90038',
    description: 'This intimate Italian restaurant specializes in handmade pasta and traditional Northern Italian cuisine. The cozy atmosphere and candlelit tables create a romantic setting for celebrations.',
    amenities: ['WiFi', 'Valet Parking', 'Reservations Required', 'Wine Bar', 'Private Dining'],
    specialFeatures: ['Handmade Pasta', 'Traditional Italian', 'Intimate Setting', 'Wine Selection'],
    lastUpdated: new Date().toISOString(),
    featuredTier: 'premium',
    featuredUntil: '2025-12-31T23:59:59Z',
    featuredSince: '2024-03-01T00:00:00Z',
    ctaText: 'View Details',
    ctaUrl: '/losangeles/osteria-mozza/',
    specialOffer: '',
    badge: 'Featured',
    priority: 85
  }
];

// This function is now handled by the client-side JavaScript
// export function getFeaturedRestaurants(limit: number = 3): FeaturedRestaurant[] {
//   const now = new Date();
//   return featuredRestaurants
//     .filter(restaurant => new Date(restaurant.featuredUntil) > now)
//     .sort((a, b) => b.priority - a.priority)
//     .slice(0, limit);
// }

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
