import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;

export const GET: APIRoute = async ({ request }) => {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ 
        error: 'Supabase not configured',
        restaurants: []
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch restaurants with their related data
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        cities!inner(name, slug),
        neighborhoods(name, slug),
        restaurant_cuisines(
          cuisines(name, slug)
        )
      `)
      .eq('is_active', true)
      .order('date_night_score', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch restaurants',
        restaurants: []
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Transform the data to match the expected format
    const transformedRestaurants = restaurants?.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      address: restaurant.address,
      phone: restaurant.phone,
      website: restaurant.website,
      rating: restaurant.rating,
      priceLevel: restaurant.price_level,
      cuisineTypes: restaurant.restaurant_cuisines?.map((rc: any) => rc.cuisines.name) || [],
      openingHours: restaurant.opening_hours,
      reviews: restaurant.reviews || [],
      photos: restaurant.photos || [],
      placeId: restaurant.place_id,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      dateNightScore: restaurant.date_night_score,
      city: restaurant.cities?.name || 'Los Angeles',
      neighborhood: restaurant.neighborhoods?.name || restaurant.neighborhood,
      isTopRated: restaurant.is_top_rated || false,
      amenities: restaurant.amenities || [],
      description: restaurant.description || '',
      lastUpdated: restaurant.updated_at
    })) || [];

    return new Response(JSON.stringify({ 
      restaurants: transformedRestaurants 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      restaurants: []
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
