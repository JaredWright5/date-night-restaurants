import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for admin operations only
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Admin Database Operations
 * These are only used in admin pages, not during build
 */
export class AdminDatabase {
  /**
   * Get all restaurants for admin dashboard
   */
  static async getRestaurants(limit = 50, offset = 0) {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        cities!inner(name, slug),
        neighborhoods(name, slug)
      `)
      .eq('is_active', true)
      .order('date_night_score', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Get restaurant by ID
   */
  static async getRestaurantById(id: string) {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        cities!inner(name, slug),
        neighborhoods(name, slug)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Get cities
   */
  static async getCities() {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Get neighborhoods by city
   */
  static async getNeighborhoodsByCity(citySlug: string) {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('neighborhoods')
      .select(`
        *,
        cities!inner(slug)
      `)
      .eq('cities.slug', citySlug)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Get cuisines
   */
  static async getCuisines() {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('cuisines')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Get restaurant statistics
   */
  static async getRestaurantStats(citySlug?: string) {
    if (!supabase) return {
      totalRestaurants: 0,
      averageRating: 0,
      averagePriceLevel: 0,
      averageDateScore: 0,
      topRatedCount: 0,
      highDateScoreCount: 0
    };
    
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
    if (!supabase) return [];
    
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
