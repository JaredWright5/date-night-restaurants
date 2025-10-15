import type { Area } from '@/types';
import { getRestaurantsByArea } from './restaurants';

export const neighborhoods: Area[] = [
  {
    id: 'beverly-hills',
    name: 'Beverly Hills',
    slug: 'beverly-hills',
    city: 'Los Angeles',
    description: 'Luxury dining in the heart of Beverly Hills. Home to some of LA\'s most prestigious and romantic restaurants.',
    coordinates: {
      latitude: 34.0736,
      longitude: -118.4004,
    },
    restaurantCount: getRestaurantsByArea('Beverly Hills').length,
    topRestaurants: getRestaurantsByArea('Beverly Hills')
      .sort((a, b) => b.dateNightScore - a.dateNightScore)
      .slice(0, 3)
      .map(r => r.id),
    averageRating: calculateAverageRating('Beverly Hills'),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'west-hollywood',
    name: 'West Hollywood',
    slug: 'west-hollywood',
    city: 'Los Angeles',
    description: 'Trendy and vibrant dining scene in West Hollywood. Perfect for couples who love contemporary cuisine and nightlife.',
    coordinates: {
      latitude: 34.0900,
      longitude: -118.4000,
    },
    restaurantCount: getRestaurantsByArea('West Hollywood').length,
    topRestaurants: getRestaurantsByArea('West Hollywood')
      .sort((a, b) => b.dateNightScore - a.dateNightScore)
      .slice(0, 3)
      .map(r => r.id),
    averageRating: calculateAverageRating('West Hollywood'),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'santa-monica',
    name: 'Santa Monica',
    slug: 'santa-monica',
    city: 'Los Angeles',
    description: 'Oceanfront dining with stunning sunset views. Santa Monica offers romantic beachside restaurants and trendy eateries.',
    coordinates: {
      latitude: 34.0195,
      longitude: -118.4912,
    },
    restaurantCount: getRestaurantsByArea('Santa Monica').length,
    topRestaurants: getRestaurantsByArea('Santa Monica')
      .sort((a, b) => b.dateNightScore - a.dateNightScore)
      .slice(0, 3)
      .map(r => r.id),
    averageRating: calculateAverageRating('Santa Monica'),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'venice',
    name: 'Venice',
    slug: 'venice',
    city: 'Los Angeles',
    description: 'Bohemian charm meets culinary excellence. Venice offers unique dining experiences with a laid-back, artistic vibe.',
    coordinates: {
      latitude: 33.9850,
      longitude: -118.4695,
    },
    restaurantCount: getRestaurantsByArea('Venice').length,
    topRestaurants: getRestaurantsByArea('Venice')
      .sort((a, b) => b.dateNightScore - a.dateNightScore)
      .slice(0, 3)
      .map(r => r.id),
    averageRating: calculateAverageRating('Venice'),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'downtown-la',
    name: 'Downtown LA',
    slug: 'downtown-la',
    city: 'Los Angeles',
    description: 'Urban sophistication in the heart of LA. Downtown offers rooftop dining, modern cuisine, and vibrant nightlife.',
    coordinates: {
      latitude: 34.0522,
      longitude: -118.2437,
    },
    restaurantCount: getRestaurantsByArea('Los Angeles').length,
    topRestaurants: getRestaurantsByArea('Los Angeles')
      .sort((a, b) => b.dateNightScore - a.dateNightScore)
      .slice(0, 3)
      .map(r => r.id),
    averageRating: calculateAverageRating('Los Angeles'),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'hollywood',
    name: 'Hollywood',
    slug: 'hollywood',
    city: 'Los Angeles',
    description: 'Glitz and glamour meet fine dining. Hollywood offers celebrity-favorite restaurants and iconic dining experiences.',
    coordinates: {
      latitude: 34.0928,
      longitude: -118.3287,
    },
    restaurantCount: getRestaurantsByArea('Hollywood').length,
    topRestaurants: getRestaurantsByArea('Hollywood')
      .sort((a, b) => b.dateNightScore - a.dateNightScore)
      .slice(0, 3)
      .map(r => r.id),
    averageRating: calculateAverageRating('Hollywood'),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'silver-lake',
    name: 'Silver Lake',
    slug: 'silver-lake',
    city: 'Los Angeles',
    description: 'Hip and trendy dining scene. Silver Lake offers innovative cuisine, craft cocktails, and intimate date night spots.',
    coordinates: {
      latitude: 34.0867,
      longitude: -118.2708,
    },
    restaurantCount: getRestaurantsByArea('Silver Lake').length,
    topRestaurants: getRestaurantsByArea('Silver Lake')
      .sort((a, b) => b.dateNightScore - a.dateNightScore)
      .slice(0, 3)
      .map(r => r.id),
    averageRating: calculateAverageRating('Silver Lake'),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'los-feliz',
    name: 'Los Feliz',
    slug: 'los-feliz',
    city: 'Los Angeles',
    description: 'Charming neighborhood with eclectic dining. Los Feliz offers cozy restaurants, wine bars, and romantic hideaways.',
    coordinates: {
      latitude: 34.1083,
      longitude: -118.2936,
    },
    restaurantCount: getRestaurantsByArea('Los Feliz').length,
    topRestaurants: getRestaurantsByArea('Los Feliz')
      .sort((a, b) => b.dateNightScore - a.dateNightScore)
      .slice(0, 3)
      .map(r => r.id),
    averageRating: calculateAverageRating('Los Feliz'),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'manhattan-beach',
    name: 'Manhattan Beach',
    slug: 'manhattan-beach',
    city: 'Los Angeles',
    description: 'Beachside elegance and fresh seafood. Manhattan Beach offers oceanfront dining with stunning sunset views.',
    coordinates: {
      latitude: 33.8847,
      longitude: -118.4109,
    },
    restaurantCount: getRestaurantsByArea('Manhattan Beach').length,
    topRestaurants: getRestaurantsByArea('Manhattan Beach')
      .sort((a, b) => b.dateNightScore - a.dateNightScore)
      .slice(0, 3)
      .map(r => r.id),
    averageRating: calculateAverageRating('Manhattan Beach'),
    lastUpdated: new Date().toISOString(),
  }
];

function calculateAverageRating(area: string): number {
  const areaRestaurants = getRestaurantsByArea(area);
  if (areaRestaurants.length === 0) return 0;
  
  const totalRating = areaRestaurants.reduce((sum, restaurant) => sum + restaurant.rating, 0);
  return Math.round((totalRating / areaRestaurants.length) * 10) / 10;
}

export function getNeighborhoodBySlug(slug: string): Area | undefined {
  return neighborhoods.find(neighborhood => neighborhood.slug === slug);
}

export function getAllNeighborhoods(): Area[] {
  return neighborhoods;
}

export function getNeighborhoodsByCity(city: string): Area[] {
  return neighborhoods.filter(neighborhood => neighborhood.city === city);
}
