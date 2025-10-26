import type { APIRoute } from 'astro';
import { getRestaurantsByNeighborhood, searchRestaurants, getAllRestaurants } from '@/lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const neighborhood = searchParams.get('neighborhood');
    const search = searchParams.get('search');
    const cuisine = searchParams.get('cuisine');
    const price = searchParams.get('price');
    const dateScore = searchParams.get('dateScore');

    console.log('API Debug - Query params:', { neighborhood, search, cuisine, price, dateScore });

    let restaurants;

    if (neighborhood && neighborhood.trim() !== '') {
      const neighborhoodSlug = neighborhood.toLowerCase().replace(/\s+/g, '-');
      console.log('API Debug - Filtering by neighborhood:', neighborhoodSlug);
      restaurants = await getRestaurantsByNeighborhood(neighborhoodSlug);
      console.log('API Debug - Found restaurants:', restaurants.length);
    } else if (search || cuisine || price || dateScore) {
      const filters = {
        cuisine: cuisine || undefined,
        priceLevel: price ? parseInt(price) : undefined,
        minDateScore: dateScore ? parseInt(dateScore) : undefined,
      };
      restaurants = await searchRestaurants(search, filters);
    } else {
      restaurants = await getAllRestaurants();
    }

    return new Response(JSON.stringify(restaurants), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error filtering restaurants:', error);
    return new Response(JSON.stringify({ error: 'Failed to filter restaurants' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
