import { createClient } from '@supabase/supabase-js';
import type { Restaurant, City, Neighborhood, Cuisine } from '@/types';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Restaurant Database Operations
 */
export class RestaurantDatabase {
  /**
   * Get all restaurants with optional filters
   */
  static async getRestaurants(filters: {
    city?: string;
    neighborhood?: string;
    cuisine?: string;
    priceLevel?: number;
    minRating?: number;
    minDateScore?: number;
    limit?: number;
    offset?: number;
  } = {}) {
    let query = supabase
      .from('restaurants')
      .select(`
        *,
        cities!inner(name, slug),
        neighborhoods(name, slug),
        restaurant_cuisines(
          cuisines(name, slug)
        )
      `)
      .eq('is_active', true);

    // Apply filters
    if (filters.city) {
      query = query.eq('cities.slug', filters.city);
    }
    
    if (filters.neighborhood) {
      query = query.eq('neighborhoods.slug', filters.neighborhood);
    }
    
    if (filters.cuisine) {
      query = query.contains('cuisine_types', [filters.cuisine]);
    }
    
    if (filters.priceLevel) {
      query = query.eq('price_level', filters.priceLevel);
    }
    
    if (filters.minRating) {
      query = query.gte('rating', filters.minRating);
    }
    
    if (filters.minDateScore) {
      query = query.gte('date_night_score', filters.minDateScore);
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
    }

    // Order by date night score
    query = query.order('date_night_score', { ascending: false });

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  /**
   * Get restaurant by slug
   */
  static async getRestaurantBySlug(slug: string, citySlug?: string) {
    let query = supabase
      .from('restaurants')
      .select(`
        *,
        cities!inner(name, slug),
        neighborhoods(name, slug),
        restaurant_cuisines(
          cuisines(name, slug)
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (citySlug) {
      query = query.eq('cities.slug', citySlug);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  /**
   * Get restaurants by city
   */
  static async getRestaurantsByCity(citySlug: string, limit = 50) {
    return this.getRestaurants({ city: citySlug, limit });
  }

  /**
   * Get restaurants by neighborhood
   */
  static async getRestaurantsByNeighborhood(neighborhoodSlug: string, limit = 50) {
    return this.getRestaurants({ neighborhood: neighborhoodSlug, limit });
  }

  /**
   * Get restaurants by cuisine
   */
  static async getRestaurantsByCuisine(cuisineSlug: string, limit = 50) {
    return this.getRestaurants({ cuisine: cuisineSlug, limit });
  }

  /**
   * Search restaurants
   */
  static async searchRestaurants(searchTerm: string, citySlug?: string) {
    let query = supabase
      .from('restaurants')
      .select(`
        *,
        cities!inner(name, slug),
        neighborhoods(name, slug)
      `)
      .eq('is_active', true)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

    if (citySlug) {
      query = query.eq('cities.slug', citySlug);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
}

/**
 * City Database Operations
 */
export class CityDatabase {
  /**
   * Get all cities
   */
  static async getCities() {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  /**
   * Get city by slug
   */
  static async getCityBySlug(slug: string) {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Neighborhood Database Operations
 */
export class NeighborhoodDatabase {
  /**
   * Get neighborhoods by city
   */
  static async getNeighborhoodsByCity(citySlug: string) {
    const { data, error } = await supabase
      .from('neighborhoods')
      .select(`
        *,
        cities!inner(slug)
      `)
      .eq('cities.slug', citySlug)
      .order('name');

    if (error) throw error;
    return data;
  }

  /**
   * Get neighborhood by slug
   */
  static async getNeighborhoodBySlug(slug: string, citySlug?: string) {
    let query = supabase
      .from('neighborhoods')
      .select(`
        *,
        cities!inner(slug)
      `)
      .eq('slug', slug)
      .single();

    if (citySlug) {
      query = query.eq('cities.slug', citySlug);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
}

/**
 * Cuisine Database Operations
 */
export class CuisineDatabase {
  /**
   * Get all cuisines
   */
  static async getCuisines() {
    const { data, error } = await supabase
      .from('cuisines')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  /**
   * Get cuisine by slug
   */
  static async getCuisineBySlug(slug: string) {
    const { data, error } = await supabase
      .from('cuisines')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Analytics Database Operations
 */
export class AnalyticsDatabase {
  /**
   * Get restaurant statistics
   */
  static async getRestaurantStats(citySlug?: string) {
    let query = supabase
      .from('restaurants')
      .select('rating, price_level, date_night_score, cities!inner(slug)')
      .eq('is_active', true);

    if (citySlug) {
      query = query.eq('cities.slug', citySlug);
    }

    const { data, error } = await query;
    
    if (error) throw error;

    const stats = {
      totalRestaurants: data.length,
      averageRating: data.reduce((sum, r) => sum + r.rating, 0) / data.length,
      averagePriceLevel: data.reduce((sum, r) => sum + r.price_level, 0) / data.length,
      averageDateScore: data.reduce((sum, r) => sum + r.date_night_score, 0) / data.length,
      topRatedCount: data.filter(r => r.rating >= 4.5).length,
      highDateScoreCount: data.filter(r => r.date_night_score >= 90).length
    };

    return stats;
  }

  /**
   * Get popular cuisines
   */
  static async getPopularCuisines(citySlug?: string, limit = 10) {
    let query = supabase
      .from('restaurant_cuisines')
      .select(`
        cuisines!inner(name, slug),
        restaurants!inner(cities!inner(slug))
      `);

    if (citySlug) {
      query = query.eq('restaurants.cities.slug', citySlug);
    }

    const { data, error } = await query;
    
    if (error) throw error;

    // Count cuisine occurrences
    const cuisineCounts = {};
    data.forEach(item => {
      const cuisine = item.cuisines;
      const key = cuisine.slug;
      if (!cuisineCounts[key]) {
        cuisineCounts[key] = { ...cuisine, count: 0 };
      }
      cuisineCounts[key].count++;
    });

    // Sort by count and return top results
    return Object.values(cuisineCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}
