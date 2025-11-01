#!/usr/bin/env node

/**
 * Import Restaurants with Hours and Reviews Script
 * Imports restaurant data including opening_hours and reviews from JSON
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('📊 Importing Restaurants with Hours and Reviews\n');

// Check for environment variables
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase environment variables');
  console.log('Please set the following in your .env.local file:');
  console.log('PUBLIC_SUPABASE_URL=your_supabase_url_here');
  console.log('PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Check if JSON data exists
const jsonDataPath = 'public/la_date_night_restaurants_real.json';
if (!fs.existsSync(jsonDataPath)) {
  console.log('❌ Restaurant data file not found:', jsonDataPath);
  process.exit(1);
}

async function importRestaurantsWithHoursAndReviews() {
  try {
    // Read the JSON data
    const jsonData = JSON.parse(fs.readFileSync(jsonDataPath, 'utf8'));
    
    console.log(`📋 Found ${jsonData.length} restaurants to import...`);
    
    // Transform the data to match our schema
    const restaurants = jsonData.map(restaurant => ({
      name: restaurant.name,
      slug: restaurant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      address: restaurant.address,
      neighborhood: restaurant.neighborhood,
      neighborhood_slug: restaurant.neighborhood.toLowerCase().replace(/\s+/g, '-'),
      city: 'Los Angeles',
      city_slug: 'los-angeles',
      cuisine_types: restaurant.cuisine_types || restaurant.cuisineTypes || [],
      price_level: restaurant.price_level || restaurant.priceLevel || 2,
      rating: restaurant.rating || 4.0,
      date_night_score: restaurant.date_night_score || restaurant.dateNightScore || 80,
      photos: restaurant.photos || [],
      description: restaurant.description || '',
      phone: restaurant.phone || '',
      website: restaurant.website || '',
      opening_hours: restaurant.opening_hours || null,
      reviews: restaurant.reviews || [],
      is_active: true
    }));
    
    console.log('🔄 Clearing existing restaurants...');
    
    // Clear existing restaurants
    const { error: deleteError } = await supabase
      .from('restaurants')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (deleteError) {
      console.error('❌ Error clearing existing restaurants:', deleteError);
      throw deleteError;
    }
    
    console.log('✅ Cleared existing restaurants');
    
    // Insert restaurants in batches
    const batchSize = 50;
    let importedCount = 0;
    
    for (let i = 0; i < restaurants.length; i += batchSize) {
      const batch = restaurants.slice(i, i + batchSize);
      const { error } = await supabase
        .from('restaurants')
        .insert(batch);
      
      if (error) {
        console.error('❌ Error inserting batch:', error);
        throw error;
      }
      
      importedCount += batch.length;
      console.log(`✅ Imported batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(restaurants.length / batchSize)} (${importedCount}/${restaurants.length} restaurants)`);
    }
    
    console.log('🎉 Successfully imported all restaurants with hours and reviews!');
    
    // Update neighborhood counts
    await updateNeighborhoodCounts();
    
    // Show some statistics
    await showImportStatistics();
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

async function updateNeighborhoodCounts() {
  try {
    console.log('🔄 Updating neighborhood counts...');
    
    // Get all unique neighborhoods
    const { data: restaurants } = await supabase
      .from('restaurants')
      .select('neighborhood, neighborhood_slug');
    
    const neighborhoods = [...new Set(restaurants.map(r => ({ name: r.neighborhood, slug: r.neighborhood_slug })))];
    
    // Clear existing neighborhoods
    const { error: deleteError } = await supabase
      .from('neighborhoods')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('❌ Error clearing neighborhoods:', deleteError);
      return;
    }
    
    // Insert neighborhoods
    for (const neighborhood of neighborhoods) {
      const restaurantCount = restaurants.filter(r => r.neighborhood === neighborhood.name).length;
      
      const { error } = await supabase
        .from('neighborhoods')
        .insert({
          name: neighborhood.name,
          slug: neighborhood.slug,
          city: 'Los Angeles',
          city_slug: 'los-angeles',
          description: `Romantic dining in ${neighborhood.name}`,
          restaurant_count: restaurantCount,
          is_active: true
        });
      
      if (error) {
        console.error('❌ Error inserting neighborhood:', error);
      }
    }
    
    console.log('✅ Updated neighborhood counts');
    
  } catch (error) {
    console.error('❌ Failed to update neighborhood counts:', error);
  }
}

async function showImportStatistics() {
  try {
    console.log('\n📊 Import Statistics:');
    
    // Count restaurants with hours
    const { data: restaurantsWithHours } = await supabase
      .from('restaurants')
      .select('id')
      .not('opening_hours', 'is', null);
    
    // Count restaurants with reviews
    const { data: restaurantsWithReviews } = await supabase
      .from('restaurants')
      .select('id')
      .not('reviews', 'is', null);
    
    // Count total restaurants
    const { data: totalRestaurants } = await supabase
      .from('restaurants')
      .select('id');
    
    console.log(`📈 Total restaurants: ${totalRestaurants.length}`);
    console.log(`🕒 Restaurants with hours: ${restaurantsWithHours.length}`);
    console.log(`💬 Restaurants with reviews: ${restaurantsWithReviews.length}`);
    
    // Show sample data
    const { data: sampleRestaurant } = await supabase
      .from('restaurants')
      .select('name, opening_hours, reviews')
      .not('opening_hours', 'is', null)
      .not('reviews', 'is', null)
      .limit(1)
      .single();
    
    if (sampleRestaurant) {
      console.log('\n🔍 Sample Data:');
      console.log(`Restaurant: ${sampleRestaurant.name}`);
      console.log(`Hours: ${JSON.stringify(sampleRestaurant.opening_hours, null, 2)}`);
      console.log(`Reviews: ${sampleRestaurant.reviews.length} reviews`);
    }
    
  } catch (error) {
    console.error('❌ Failed to show statistics:', error);
  }
}

// Run the import
importRestaurantsWithHoursAndReviews();
