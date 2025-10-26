
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient('https://yynyijnufunjufezpxvt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bnlpam51ZnVuanVmZXpweHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODc0MzcsImV4cCI6MjA3NjU2MzQzN30.m0uGWu3OoePPExFvX8HIsqm16r45j5Tkq-m69HCYd0c');

async function importRestaurants() {
  try {
    // Read the JSON data
    const jsonData = JSON.parse(fs.readFileSync('la_date_night_restaurants_real.json', 'utf8'));
    
    console.log(`Importing ${jsonData.length} restaurants...`);
    
    // Transform the data to match our schema
    const restaurants = jsonData.map(restaurant => {
      // Generate slug from name if not provided
      const slug = restaurant.slug || restaurant.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
      
      return {
        name: restaurant.name,
        slug: slug,
        address: restaurant.address,
        neighborhood: restaurant.neighborhood,
        neighborhood_slug: restaurant.neighborhood.toLowerCase().replace(/\s+/g, '-'),
        city: 'Los Angeles',
        city_slug: 'los-angeles',
        cuisine_types: restaurant.cuisineTypes || restaurant.cuisine_types || [],
        price_level: restaurant.priceLevel || restaurant.price_level || 2,
        rating: restaurant.rating || 4.0,
        date_night_score: restaurant.dateNightScore || restaurant.date_night_score || 80,
        photos: restaurant.photos || [],
        description: restaurant.description || '',
        phone: restaurant.phone || '',
        website: restaurant.website || '',
        is_active: true
      };
    });
    
    // Insert restaurants in batches
    const batchSize = 50;
    for (let i = 0; i < restaurants.length; i += batchSize) {
      const batch = restaurants.slice(i, i + batchSize);
      const { error } = await supabase
        .from('restaurants')
        .insert(batch);
      
      if (error) {
        console.error('Error inserting batch:', error);
        throw error;
      }
      
      console.log(`Imported batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(restaurants.length / batchSize)}`);
    }
    
    console.log('✅ Successfully imported all restaurants!');
    
    // Update neighborhood counts
    await updateNeighborhoodCounts();
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

async function updateNeighborhoodCounts() {
  try {
    // Get all unique neighborhoods
    const { data: restaurants } = await supabase
      .from('restaurants')
      .select('neighborhood, neighborhood_slug');
    
    const neighborhoods = [...new Set(restaurants.map(r => ({ name: r.neighborhood, slug: r.neighborhood_slug })))];
    
    // Insert neighborhoods
    for (const neighborhood of neighborhoods) {
      const { error } = await supabase
        .from('neighborhoods')
        .upsert({
          name: neighborhood.name,
          slug: neighborhood.slug,
          city: 'Los Angeles',
          city_slug: 'los-angeles',
          description: `Romantic dining in ${neighborhood.name}`,
          restaurant_count: restaurants.filter(r => r.neighborhood === neighborhood.name).length,
          is_active: true
        });
      
      if (error) {
        console.error('Error inserting neighborhood:', error);
      }
    }
    
    console.log('✅ Updated neighborhood counts');
    
  } catch (error) {
    console.error('❌ Failed to update neighborhood counts:', error);
  }
}

importRestaurants();
