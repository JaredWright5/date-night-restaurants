import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for our data
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  neighborhood: string;
  neighborhood_slug: string;
  city: string;
  city_slug: string;
  cuisine_types: string[];
  price_level: number;
  rating: number;
  date_night_score: number;
  photos: string[];
  description: string;
  phone: string;
  website: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  city: string;
  city_slug: string;
  description: string;
  restaurant_count: number;
  is_active: boolean;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  description: string;
  restaurant_count: number;
  is_active: boolean;
}

// Data fetching functions
export async function getAllRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from('restaurants')
    .select(`
      *,
      neighborhoods!inner(name, slug),
      cities!inner(name, slug)
    `)
    .eq('is_active', true)
    .order('date_night_score', { ascending: false });

  if (error) {
    console.error('Error fetching restaurants:', error);
    throw new Error(`Failed to fetch restaurants: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('No restaurants found in database. Please ensure your Supabase database is properly configured.');
  }

  return data;
}

export async function getRestaurantsByNeighborhood(neighborhoodSlug: string): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from('restaurants')
    .select(`
      *,
      neighborhoods!inner(name, slug),
      cities!inner(name, slug)
    `)
    .eq('is_active', true)
    .eq('neighborhoods.slug', neighborhoodSlug)
    .order('date_night_score', { ascending: false });

  if (error) {
    console.error('Error fetching restaurants by neighborhood:', error);
    throw new Error(`Failed to fetch restaurants for neighborhood ${neighborhoodSlug}: ${error.message}`);
  }

  return data || [];
}

export async function getRestaurantBySlug(neighborhoodSlug: string, restaurantSlug: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .select(`
      *,
      neighborhoods!inner(name, slug),
      cities!inner(name, slug)
    `)
    .eq('is_active', true)
    .eq('neighborhoods.slug', neighborhoodSlug)
    .eq('slug', restaurantSlug)
    .single();

  if (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }

  return data;
}

export async function getAllNeighborhoods(): Promise<Neighborhood[]> {
  const { data, error } = await supabase
    .from('neighborhoods')
    .select(`
      *,
      cities!inner(name, slug)
    `)
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching neighborhoods:', error);
    throw new Error(`Failed to fetch neighborhoods: ${error.message}`);
  }

  return data || [];
}

export async function getNeighborhoodBySlug(slug: string): Promise<Neighborhood | null> {
  const { data, error } = await supabase
    .from('neighborhoods')
    .select(`
      *,
      cities!inner(name, slug)
    `)
    .eq('is_active', true)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching neighborhood:', error);
    return null;
  }

  return data;
}

export async function searchRestaurants(query: string, filters: {
  neighborhood?: string;
  cuisine?: string;
  priceLevel?: number;
  minDateScore?: number;
} = {}): Promise<Restaurant[]> {
  let supabaseQuery = supabase
    .from('restaurants')
    .select(`
      *,
      neighborhoods!inner(name, slug),
      cities!inner(name, slug)
    `)
    .eq('is_active', true);

  // Text search
  if (query) {
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%`);
  }

  // Neighborhood filter
  if (filters.neighborhood) {
    supabaseQuery = supabaseQuery.eq('neighborhoods.slug', filters.neighborhood);
  }

  // Cuisine filter
  if (filters.cuisine) {
    supabaseQuery = supabaseQuery.contains('cuisine_types', [filters.cuisine]);
  }

  // Price level filter
  if (filters.priceLevel) {
    supabaseQuery = supabaseQuery.eq('price_level', filters.priceLevel);
  }

  // Date score filter
  if (filters.minDateScore) {
    supabaseQuery = supabaseQuery.gte('date_night_score', filters.minDateScore);
  }

  const { data, error } = await supabaseQuery.order('date_night_score', { ascending: false });

  if (error) {
    console.error('Error searching restaurants:', error);
    throw new Error(`Failed to search restaurants: ${error.message}`);
  }

  return data || [];
}

// Test connection function
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}