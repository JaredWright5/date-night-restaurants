#!/usr/bin/env node

/**
 * Script to populate the neighborhoods table with data from restaurants
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🏘️  Populating neighborhoods table...\n');

async function populateNeighborhoods() {
  try {
    // Get all unique neighborhoods from restaurants
    console.log('1. Fetching unique neighborhoods from restaurants...');
    const { data: restaurants, error: restaurantError } = await supabase
      .from('restaurants')
      .select('neighborhood, neighborhood_slug')
      .eq('is_active', true);

    if (restaurantError) {
      console.log('❌ Error fetching restaurants:', restaurantError.message);
      return false;
    }

    // Group by neighborhood
    const neighborhoodMap = new Map();
    restaurants.forEach(restaurant => {
      const key = restaurant.neighborhood_slug;
      if (!neighborhoodMap.has(key)) {
        neighborhoodMap.set(key, {
          name: restaurant.neighborhood,
          slug: restaurant.neighborhood_slug,
          restaurant_count: 0
        });
      }
      neighborhoodMap.get(key).restaurant_count++;
    });

    const neighborhoods = Array.from(neighborhoodMap.values());
    console.log(`   Found ${neighborhoods.length} unique neighborhoods`);

    // Insert neighborhoods
    console.log('2. Inserting neighborhoods into database...');
    const neighborhoodData = neighborhoods.map(neighborhood => ({
      name: neighborhood.name,
      slug: neighborhood.slug
    }));

    const { error: insertError } = await supabase
      .from('neighborhoods')
      .insert(neighborhoodData);

    if (insertError) {
      console.log('❌ Error inserting neighborhoods:', insertError.message);
      return false;
    }

    console.log('✅ Successfully populated neighborhoods table');
    
    // Show summary
    console.log('\n📊 Neighborhood Summary:');
    neighborhoods.forEach(neighborhood => {
      console.log(`   - ${neighborhood.name}: ${neighborhood.restaurant_count} restaurants`);
    });

    return true;

  } catch (error) {
    console.error('❌ Error populating neighborhoods:', error);
    return false;
  }
}

// Run the population
populateNeighborhoods().then(success => {
  if (success) {
    console.log('\n🎉 Neighborhoods table populated successfully!');
    console.log('Next step: Test neighborhood filtering');
  } else {
    console.log('\n❌ Failed to populate neighborhoods table.');
  }
});
