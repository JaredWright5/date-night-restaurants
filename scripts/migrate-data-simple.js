#!/usr/bin/env node

/**
 * Simple Data Migration Script
 * This script migrates your existing LA restaurant data to Supabase
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

console.log('🚀 Starting data migration...\n');

async function migrateData() {
  try {
    // 1. Create Los Angeles city
    console.log('🏙️  Creating Los Angeles city...');
    const { data: cityData, error: cityError } = await supabase
      .from('cities')
      .insert({
        name: 'Los Angeles',
        slug: 'los-angeles',
        state: 'California',
        country: 'USA',
        description: 'The entertainment capital of the world, Los Angeles offers an incredible variety of romantic dining experiences from beachside bistros to rooftop fine dining.',
        latitude: 34.0522,
        longitude: -118.2437
      })
      .select()
      .single();

    let city;
    if (cityError) {
      if (cityError.code === '23505') {
        console.log('✅ Los Angeles city already exists');
        // Get existing city
        const { data: existingCity } = await supabase
          .from('cities')
          .select('*')
          .eq('slug', 'los-angeles')
          .single();
        city = existingCity;
      } else {
        throw cityError;
      }
    } else {
      city = cityData;
      console.log(`✅ Created city: ${city.name}`);
    }

    // 2. Load restaurant data
    console.log('📦 Loading restaurant data...');
    const dataFile = path.join(process.cwd(), 'la_date_night_restaurants_real.json');
    if (!fs.existsSync(dataFile)) {
      throw new Error(`Data file not found: ${dataFile}`);
    }
    
    const laRestaurants = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    console.log(`📊 Found ${laRestaurants.length} restaurants to migrate`);

    // 3. Create neighborhoods
    console.log('🏘️  Creating neighborhoods...');
    const neighborhoods = [...new Set(laRestaurants.map(r => r.neighborhood).filter(Boolean))];
    const neighborhoodMap = new Map();
    
    for (const neighborhood of neighborhoods) {
      const { data: existingNeighborhood } = await supabase
        .from('neighborhoods')
        .select('*')
        .eq('name', neighborhood)
        .eq('city_id', city.id)
        .single();
      
      if (existingNeighborhood) {
        neighborhoodMap.set(neighborhood, existingNeighborhood.id);
        console.log(`✅ Neighborhood already exists: ${neighborhood}`);
      } else {
        const { data: newNeighborhood, error: neighborhoodError } = await supabase
          .from('neighborhoods')
          .insert({
            name: neighborhood,
            slug: neighborhood.toLowerCase().replace(/\s+/g, '-'),
            city_id: city.id,
            description: `Discover the best romantic restaurants in ${neighborhood}, Los Angeles.`
          })
          .select()
          .single();
        
        if (neighborhoodError) throw neighborhoodError;
        neighborhoodMap.set(neighborhood, newNeighborhood.id);
        console.log(`✅ Created neighborhood: ${neighborhood}`);
      }
    }

    // 4. Create cuisines
    console.log('🍽️  Creating cuisines...');
    const cuisineTypes = [...new Set(laRestaurants.flatMap(r => r.cuisine_types))];
    const cuisineMap = new Map();
    
    for (const cuisine of cuisineTypes) {
      const { data: existingCuisine } = await supabase
        .from('cuisines')
        .select('*')
        .eq('slug', cuisine)
        .single();
      
      if (existingCuisine) {
        cuisineMap.set(cuisine, existingCuisine.id);
        console.log(`✅ Cuisine already exists: ${cuisine}`);
      } else {
        const { data: newCuisine, error: cuisineError } = await supabase
          .from('cuisines')
          .insert({
            name: cuisine.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            slug: cuisine,
            description: `Discover the best ${cuisine.replace(/_/g, ' ')} restaurants for your date night.`
          })
          .select()
          .single();
        
        if (cuisineError) throw cuisineError;
        cuisineMap.set(cuisine, newCuisine.id);
        console.log(`✅ Created cuisine: ${cuisine}`);
      }
    }

    // 5. Check if restaurants already exist
    const { count: existingRestaurantCount } = await supabase
      .from('restaurants')
      .select('*', { count: 'exact', head: true })
      .eq('city_id', city.id);
    
    if (existingRestaurantCount > 0) {
      console.log(`✅ Found ${existingRestaurantCount} existing restaurants, skipping migration`);
      return;
    }

    // 6. Migrate restaurants
    console.log('🍴 Migrating restaurants...');
    const restaurantInserts = laRestaurants.map(restaurant => ({
      name: restaurant.name,
      slug: restaurant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      city_id: city.id,
      neighborhood_id: neighborhoodMap.get(restaurant.neighborhood),
      address: restaurant.address,
      phone: restaurant.phone,
      website: restaurant.website,
      rating: restaurant.rating,
      price_level: restaurant.price_level,
      cuisine_types: restaurant.cuisine_types,
      opening_hours: restaurant.opening_hours,
      photos: restaurant.photos,
      place_id: restaurant.place_id,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      date_night_score: restaurant.date_night_score,
      is_top_rated: restaurant.isTopRated || false,
      description: generateDescription(restaurant),
      amenities: generateAmenities(restaurant),
      special_features: generateSpecialFeatures(restaurant)
    }));

    // Insert restaurants in batches
    const batchSize = 50;
    for (let i = 0; i < restaurantInserts.length; i += batchSize) {
      const batch = restaurantInserts.slice(i, i + batchSize);
      const { error: restaurantError } = await supabase
        .from('restaurants')
        .insert(batch);
      
      if (restaurantError) throw restaurantError;
      console.log(`✅ Migrated batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(restaurantInserts.length / batchSize)}`);
    }

    // 7. Create restaurant-cuisine relationships
    console.log('🔗 Creating restaurant-cuisine relationships...');
    const { data: allRestaurants, error: restaurantsError } = await supabase
      .from('restaurants')
      .select('id, cuisine_types')
      .eq('city_id', city.id);

    if (restaurantsError) throw restaurantsError;

    const relationships = [];
    allRestaurants.forEach(restaurant => {
      restaurant.cuisine_types.forEach(cuisineType => {
        const cuisineId = cuisineMap.get(cuisineType);
        if (cuisineId) {
          relationships.push({
            restaurant_id: restaurant.id,
            cuisine_id: cuisineId
          });
        }
      });
    });

    // Insert relationships in batches
    for (let i = 0; i < relationships.length; i += batchSize) {
      const batch = relationships.slice(i, i + batchSize);
      const { error: relationshipError } = await supabase
        .from('restaurant_cuisines')
        .insert(batch);
      
      if (relationshipError) throw relationshipError;
    }

    console.log(`✅ Created ${relationships.length} restaurant-cuisine relationships`);

    // 8. Update counts
    console.log('📊 Updating counts...');
    
    // Update city restaurant count
    await supabase
      .from('cities')
      .update({ restaurant_count: laRestaurants.length })
      .eq('id', city.id);

    // Update neighborhood counts
    for (const [neighborhoodName, neighborhoodId] of neighborhoodMap) {
      const count = laRestaurants.filter(r => r.neighborhood === neighborhoodName).length;
      await supabase
        .from('neighborhoods')
        .update({ restaurant_count: count })
        .eq('id', neighborhoodId);
    }

    // Update cuisine counts
    for (const [cuisineSlug, cuisineId] of cuisineMap) {
      const count = laRestaurants.filter(r => r.cuisine_types.includes(cuisineSlug)).length;
      await supabase
        .from('cuisines')
        .update({ restaurant_count: count })
        .eq('id', cuisineId);
    }

    console.log('✅ Updated all counts');
    console.log('🎉 Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run test-supabase');
    console.log('2. Visit /admin to see your admin dashboard');
    console.log('3. Test your existing pages');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Helper functions
function generateDescription(restaurant) {
  const cuisineNames = restaurant.cuisine_types.map(cuisine => 
    cuisine.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  ).join(', ');
  
  return `Experience an unforgettable date night at ${restaurant.name}, featuring ${cuisineNames} cuisine in ${restaurant.neighborhood}. Perfect for romantic evenings with exceptional food and intimate ambiance.`;
}

function generateAmenities(restaurant) {
  const amenities = [];
  
  if (restaurant.price_level >= 3) amenities.push('Fine Dining');
  if (restaurant.rating >= 4.5) amenities.push('Highly Rated');
  if (restaurant.date_night_score >= 90) amenities.push('Perfect for Dates');
  if (restaurant.photos && restaurant.photos.length > 0) amenities.push('Photo-Worthy');
  
  return amenities;
}

function generateSpecialFeatures(restaurant) {
  const features = [];
  
  if (restaurant.isTopRated) features.push('Top Rated');
  if (restaurant.date_night_score >= 95) features.push('Exceptional Date Spot');
  if (restaurant.rating >= 4.7) features.push('Outstanding Reviews');
  
  return features;
}

// Run the migration
migrateData();
