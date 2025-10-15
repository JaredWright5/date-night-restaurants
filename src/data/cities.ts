import type { City } from '@/types';
import { restaurants, getRestaurantsByCity } from './restaurants';

export const cities: City[] = [
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    slug: 'los-angeles',
    state: 'California',
    country: 'United States',
    description: 'Discover the most romantic date night restaurants across Los Angeles. From Beverly Hills fine dining to Venice Beach casual spots, LA offers incredible romantic dining experiences in every neighborhood.',
    coordinates: {
      latitude: 34.0522,
      longitude: -118.2437,
    },
    restaurantCount: restaurants.length,
    topRestaurants: restaurants
      .sort((a, b) => b.dateNightScore - a.dateNightScore)
      .slice(0, 5)
      .map(r => r.id),
    popularCuisines: getPopularCuisines('Los Angeles'),
    averageRating: calculateAverageRating('Los Angeles'),
    averagePriceLevel: calculateAveragePriceLevel('Los Angeles'),
    lastUpdated: new Date().toISOString(),
  },
  // Future cities can be added here
  {
    id: 'san-francisco',
    name: 'San Francisco',
    slug: 'san-francisco',
    state: 'California',
    country: 'United States',
    description: 'Coming soon: Romantic date night restaurants in San Francisco. From Michelin-starred dining to intimate neighborhood spots.',
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    restaurantCount: 0,
    topRestaurants: [],
    popularCuisines: [],
    averageRating: 0,
    averagePriceLevel: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'new-york',
    name: 'New York',
    slug: 'new-york',
    state: 'New York',
    country: 'United States',
    description: 'Coming soon: The best date night restaurants in New York City. From Manhattan fine dining to Brooklyn hotspots.',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
    restaurantCount: 0,
    topRestaurants: [],
    popularCuisines: [],
    averageRating: 0,
    averagePriceLevel: 0,
    lastUpdated: new Date().toISOString(),
  },
];

function getPopularCuisines(city: string): string[] {
  const cityRestaurants = getRestaurantsByCity(city);
  const cuisineCount: Record<string, number> = {};
  
  cityRestaurants.forEach(restaurant => {
    restaurant.cuisineTypes.forEach(cuisine => {
      cuisineCount[cuisine] = (cuisineCount[cuisine] || 0) + 1;
    });
  });
  
  return Object.entries(cuisineCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([cuisine]) => cuisine);
}

function calculateAverageRating(city: string): number {
  const cityRestaurants = getRestaurantsByCity(city);
  if (cityRestaurants.length === 0) return 0;
  
  const totalRating = cityRestaurants.reduce((sum, restaurant) => sum + restaurant.rating, 0);
  return Math.round((totalRating / cityRestaurants.length) * 10) / 10;
}

function calculateAveragePriceLevel(city: string): number {
  const cityRestaurants = getRestaurantsByCity(city);
  if (cityRestaurants.length === 0) return 0;
  
  const totalPriceLevel = cityRestaurants.reduce((sum, restaurant) => sum + restaurant.priceLevel, 0);
  return Math.round((totalPriceLevel / cityRestaurants.length) * 10) / 10;
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find(city => city.slug === slug);
}

export function getAllCities(): City[] {
  return cities;
}

export function getActiveCities(): City[] {
  return cities.filter(city => city.restaurantCount > 0);
}
