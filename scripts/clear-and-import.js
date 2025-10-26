#!/usr/bin/env node

/**
 * Clear and Import Script
 * This script clears existing data and imports fresh restaurant data
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
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

console.log('🗑️  Clearing existing data and importing fresh data...\n');

async function clearAndImport() {
  try {
    // Clear existing data
    console.log('1. Clearing existing restaurants...');
    const { error: deleteError } = await supabase
      .from('restaurants')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (deleteError) {
      console.log('❌ Error clearing restaurants:', deleteError.message);
      return false;
    }
    
    console.log('✅ Cleared existing restaurants');
    
    // Clear neighborhoods
    console.log('2. Clearing existing neighborhoods...');
    const { error: deleteNeighborhoodsError } = await supabase
      .from('neighborhoods')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteNeighborhoodsError) {
      console.log('❌ Error clearing neighborhoods:', deleteNeighborhoodsError.message);
      return false;
    }
    
    console.log('✅ Cleared existing neighborhoods');
    
    // Read the JSON data
    console.log('3. Reading restaurant data...');
    const jsonData = JSON.parse(fs.readFileSync('la_date_night_restaurants_real.json', 'utf8'));
    console.log(`   Found ${jsonData.length} restaurants`);
    
    // Transform the data to match our schema
    console.log('4. Transforming data...');
    const restaurants = jsonData.map((restaurant, index) => {
      // Generate unique slug from name
      const baseSlug = restaurant.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
      
      // Add index to ensure uniqueness
      const slug = `${baseSlug}-${index + 1}`;
      
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
    console.log('5. Importing restaurants...');
    const batchSize = 50;
    for (let i = 0; i < restaurants.length; i += batchSize) {
      const batch = restaurants.slice(i, i + batchSize);
      const { error } = await supabase
        .from('restaurants')
        .insert(batch);
      
      if (error) {
        console.error('❌ Error inserting batch:', error);
        throw error;
      }
      
      console.log(`   ✅ Imported batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(restaurants.length / batchSize)}`);
    }
    
    console.log('✅ Successfully imported all restaurants!');
    
    // Update neighborhood counts
    console.log('6. Updating neighborhood data...');
    await updateNeighborhoodCounts();
    
    console.log('\n🎉 Import completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    return false;
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

// Run the clear and import
clearAndImport().then(success => {
  if (success) {
    console.log('\n✅ Database is now ready with fresh data!');
    console.log('Next step: Test the application');
    console.log('Command: npm run dev');
  } else {
    console.log('\n❌ Import failed. Please check the errors above.');
  }
});
