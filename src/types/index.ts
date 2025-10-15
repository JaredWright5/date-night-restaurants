export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  priceLevel: number;
  cuisineTypes: string[];
  openingHours: Record<string, string>;
  reviews: Review[];
  photos: string[];
  placeId: string;
  latitude: number;
  longitude: number;
  dateNightScore: number;
  city: string;
  area: string;
  neighborhood: string;
  zipCode: string;
  description?: string;
  amenities?: string[];
  specialFeatures?: string[];
  lastUpdated: string;
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  time: number;
  helpful?: number;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  restaurantCount: number;
  topRestaurants: string[];
  popularCuisines: string[];
  averageRating: number;
  averagePriceLevel: number;
  lastUpdated: string;
}

export interface Cuisine {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  restaurantCount: number;
  cities: string[];
  averageRating: number;
  averagePriceLevel: number;
}

export interface Area {
  id: string;
  name: string;
  slug: string;
  city: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  restaurantCount: number;
  topRestaurants: string[];
  averageRating: number;
  lastUpdated: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage: string;
  structuredData: any;
}

export interface FilterOptions {
  cuisine?: string;
  priceLevel?: number;
  rating?: number;
  area?: string;
  amenities?: string[];
  specialFeatures?: string[];
}

export interface SearchResult {
  restaurants: Restaurant[];
  total: number;
  page: number;
  limit: number;
  filters: FilterOptions;
}
