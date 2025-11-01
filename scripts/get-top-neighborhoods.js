import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getNeighborhoodStats() {
  try {
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('neighborhood');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    // Count restaurants by neighborhood
    const neighborhoodCounts = {};
    restaurants.forEach(restaurant => {
      const neighborhood = restaurant.neighborhood;
      neighborhoodCounts[neighborhood] = (neighborhoodCounts[neighborhood] || 0) + 1;
    });
    
    // Sort by count and get top 3
    const sortedNeighborhoods = Object.entries(neighborhoodCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    console.log('Top 3 neighborhoods with most restaurants:');
    sortedNeighborhoods.forEach(([neighborhood, count], index) => {
      console.log(`${index + 1}. ${neighborhood}: ${count} restaurants`);
    });
    
    return sortedNeighborhoods;
  } catch (error) {
    console.error('Error:', error);
  }
}

getNeighborhoodStats();
