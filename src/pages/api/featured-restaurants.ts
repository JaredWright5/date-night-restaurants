import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Get featured restaurants from localStorage (this would be from a database in production)
    const featuredRestaurants = ['providence', 'r-publique-caf-bakery-r-publique-restaurant', 'spago-beverly-hills', 'the-little-door'];
    
    return new Response(JSON.stringify(featuredRestaurants), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch featured restaurants' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { featuredRestaurants } = body;
    
    // In a real application, you would save this to a database
    // For now, we'll just return success
    console.log('Updated featured restaurants:', featuredRestaurants);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update featured restaurants' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
