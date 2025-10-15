import type { Cuisine } from '@/types';
import { restaurants } from './restaurants';

export const cuisines: Cuisine[] = [
  {
    id: 'fine-dining',
    name: 'Fine Dining',
    slug: 'fine-dining',
    description: 'Upscale restaurants offering exceptional cuisine, service, and ambiance perfect for special occasions and romantic date nights.',
    icon: '🍽️',
    color: '#d63384',
    restaurantCount: restaurants.filter(r => r.cuisineTypes.includes('fine_dining')).length,
    cities: ['Los Angeles'],
    averageRating: calculateAverageRating('fine_dining'),
    averagePriceLevel: calculateAveragePriceLevel('fine_dining'),
  },
  {
    id: 'italian',
    name: 'Italian',
    slug: 'italian',
    description: 'Authentic Italian cuisine featuring pasta, pizza, and regional specialties in romantic settings.',
    icon: '🍝',
    color: '#6f42c1',
    restaurantCount: restaurants.filter(r => r.cuisineTypes.includes('italian_restaurant')).length,
    cities: ['Los Angeles'],
    averageRating: calculateAverageRating('italian_restaurant'),
    averagePriceLevel: calculateAveragePriceLevel('italian_restaurant'),
  },
  {
    id: 'french',
    name: 'French',
    slug: 'french',
    description: 'Classic French cuisine with elegant presentations and sophisticated flavors perfect for romantic dinners.',
    icon: '🥐',
    color: '#ffc107',
    restaurantCount: restaurants.filter(r => r.cuisineTypes.includes('french_restaurant')).length,
    cities: ['Los Angeles'],
    averageRating: calculateAverageRating('french_restaurant'),
    averagePriceLevel: calculateAveragePriceLevel('french_restaurant'),
  },
  {
    id: 'japanese',
    name: 'Japanese',
    slug: 'japanese',
    description: 'Authentic Japanese cuisine including sushi, sashimi, and traditional dishes in intimate settings.',
    icon: '🍣',
    color: '#dc3545',
    restaurantCount: restaurants.filter(r => r.cuisineTypes.includes('japanese_restaurant')).length,
    cities: ['Los Angeles'],
    averageRating: calculateAverageRating('japanese_restaurant'),
    averagePriceLevel: calculateAveragePriceLevel('japanese_restaurant'),
  },
  {
    id: 'seafood',
    name: 'Seafood',
    slug: 'seafood',
    description: 'Fresh seafood restaurants featuring ocean-to-table dining with stunning views and romantic ambiance.',
    icon: '🐟',
    color: '#17a2b8',
    restaurantCount: restaurants.filter(r => r.cuisineTypes.includes('seafood_restaurant')).length,
    cities: ['Los Angeles'],
    averageRating: calculateAverageRating('seafood_restaurant'),
    averagePriceLevel: calculateAveragePriceLevel('seafood_restaurant'),
  },
  {
    id: 'californian',
    name: 'Californian',
    slug: 'californian',
    description: 'Farm-to-table Californian cuisine featuring fresh, local ingredients and innovative preparations.',
    icon: '🥗',
    color: '#28a745',
    restaurantCount: restaurants.filter(r => r.cuisineTypes.includes('californian')).length,
    cities: ['Los Angeles'],
    averageRating: calculateAverageRating('californian'),
    averagePriceLevel: calculateAveragePriceLevel('californian'),
  },
  {
    id: 'wine-bar',
    name: 'Wine Bar',
    slug: 'wine-bar',
    description: 'Intimate wine bars offering curated selections, small plates, and romantic ambiance.',
    icon: '🍷',
    color: '#6f42c1',
    restaurantCount: restaurants.filter(r => r.cuisineTypes.includes('wine_bar')).length,
    cities: ['Los Angeles'],
    averageRating: calculateAverageRating('wine_bar'),
    averagePriceLevel: calculateAveragePriceLevel('wine_bar'),
  },
];

function calculateAverageRating(cuisineType: string): number {
  const cuisineRestaurants = restaurants.filter(r => r.cuisineTypes.includes(cuisineType));
  if (cuisineRestaurants.length === 0) return 0;
  
  const totalRating = cuisineRestaurants.reduce((sum, restaurant) => sum + restaurant.rating, 0);
  return Math.round((totalRating / cuisineRestaurants.length) * 10) / 10;
}

function calculateAveragePriceLevel(cuisineType: string): number {
  const cuisineRestaurants = restaurants.filter(r => r.cuisineTypes.includes(cuisineType));
  if (cuisineRestaurants.length === 0) return 0;
  
  const totalPriceLevel = cuisineRestaurants.reduce((sum, restaurant) => sum + restaurant.priceLevel, 0);
  return Math.round((totalPriceLevel / cuisineRestaurants.length) * 10) / 10;
}

export function getCuisineBySlug(slug: string): Cuisine | undefined {
  return cuisines.find(cuisine => cuisine.slug === slug);
}

export function getAllCuisines(): Cuisine[] {
  return cuisines;
}

export function getPopularCuisines(limit: number = 5): Cuisine[] {
  return cuisines
    .filter(cuisine => cuisine.restaurantCount > 0)
    .sort((a, b) => b.restaurantCount - a.restaurantCount)
    .slice(0, limit);
}
