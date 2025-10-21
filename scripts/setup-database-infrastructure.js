#!/usr/bin/env node

/**
 * Database Infrastructure Setup Script
 * This script helps set up the new database infrastructure for Date Night Restaurants
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Configuration
const CONFIG = {
  supabaseUrl: process.env.SUPABASE_URL || 'your-supabase-url',
  supabaseKey: process.env.SUPABASE_ANON_KEY || 'your-supabase-key',
  dataFile: path.join(process.cwd(), 'la_date_night_restaurants_real.json')
};

// Initialize Supabase client
const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

/**
 * Database Schema Creation
 */
const createDatabaseSchema = async () => {
  console.log('🏗️  Creating database schema...');
  
  const schema = `
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Cities table
    CREATE TABLE IF NOT EXISTS cities (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      state VARCHAR(50),
      country VARCHAR(50) DEFAULT 'USA',
      description TEXT,
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      restaurant_count INTEGER DEFAULT 0,
      average_rating DECIMAL(3, 2),
      average_price_level DECIMAL(3, 2),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Neighborhoods table
    CREATE TABLE IF NOT EXISTS neighborhoods (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL,
      city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
      description TEXT,
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      restaurant_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Cuisines table
    CREATE TABLE IF NOT EXISTS cuisines (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      icon VARCHAR(50),
      color VARCHAR(7),
      restaurant_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Restaurants table
    CREATE TABLE IF NOT EXISTS restaurants (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(200) NOT NULL,
      slug VARCHAR(200) UNIQUE NOT NULL,
      city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
      neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE SET NULL,
      address TEXT NOT NULL,
      phone VARCHAR(20),
      website VARCHAR(500),
      rating DECIMAL(3, 2),
      price_level INTEGER CHECK (price_level BETWEEN 1 AND 4),
      cuisine_types TEXT[],
      opening_hours JSONB,
      photos TEXT[],
      place_id VARCHAR(200),
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      date_night_score INTEGER CHECK (date_night_score BETWEEN 1 AND 100),
      is_top_rated BOOLEAN DEFAULT FALSE,
      description TEXT,
      amenities TEXT[],
      special_features TEXT[],
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Reviews table
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
      author VARCHAR(100) NOT NULL,
      rating INTEGER CHECK (rating BETWEEN 1 AND 5),
      text TEXT,
      helpful_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Restaurant-Cuisine junction table
    CREATE TABLE IF NOT EXISTS restaurant_cuisines (
      restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
      cuisine_id UUID REFERENCES cuisines(id) ON DELETE CASCADE,
      PRIMARY KEY (restaurant_id, cuisine_id)
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_restaurants_city_id ON restaurants(city_id);
    CREATE INDEX IF NOT EXISTS idx_restaurants_neighborhood_id ON restaurants(neighborhood_id);
    CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating);
    CREATE INDEX IF NOT EXISTS idx_restaurants_price_level ON restaurants(price_level);
    CREATE INDEX IF NOT EXISTS idx_restaurants_date_night_score ON restaurants(date_night_score);
    CREATE INDEX IF NOT EXISTS idx_restaurants_is_active ON restaurants(is_active);
    CREATE INDEX IF NOT EXISTS idx_reviews_restaurant_id ON reviews(restaurant_id);
    CREATE INDEX IF NOT EXISTS idx_neighborhoods_city_id ON neighborhoods(city_id);

    -- Create updated_at trigger function
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Create triggers for updated_at
    CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON cities
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    CREATE TRIGGER update_neighborhoods_updated_at BEFORE UPDATE ON neighborhoods
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: schema });
    if (error) throw error;
    console.log('✅ Database schema created successfully');
  } catch (error) {
    console.error('❌ Error creating schema:', error.message);
    throw error;
  }
};

/**
 * Load and migrate existing data
 */
const migrateExistingData = async () => {
  console.log('📦 Loading existing restaurant data...');
  
  if (!fs.existsSync(CONFIG.dataFile)) {
    throw new Error(`Data file not found: ${CONFIG.dataFile}`);
  }
  
  const laRestaurants = JSON.parse(fs.readFileSync(CONFIG.dataFile, 'utf8'));
  console.log(`📊 Found ${laRestaurants.length} restaurants to migrate`);

  // 1. Create Los Angeles city
  console.log('🏙️  Creating Los Angeles city record...');
  const { data: city, error: cityError } = await supabase
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

  if (cityError) throw cityError;
  console.log(`✅ Created city: ${city.name}`);

  // 2. Create neighborhoods
  console.log('🏘️  Creating neighborhoods...');
  const neighborhoods = [...new Set(laRestaurants.map(r => r.neighborhood).filter(Boolean))];
  const neighborhoodInserts = neighborhoods.map(neighborhood => ({
    name: neighborhood,
    slug: neighborhood.toLowerCase().replace(/\s+/g, '-'),
    city_id: city.id,
    description: `Discover the best romantic restaurants in ${neighborhood}, Los Angeles.`
  }));

  const { data: createdNeighborhoods, error: neighborhoodError } = await supabase
    .from('neighborhoods')
    .insert(neighborhoodInserts)
    .select();

  if (neighborhoodError) throw neighborhoodError;
  console.log(`✅ Created ${createdNeighborhoods.length} neighborhoods`);

  // Create neighborhood lookup map
  const neighborhoodMap = new Map();
  createdNeighborhoods.forEach(n => {
    neighborhoodMap.set(n.name, n.id);
  });

  // 3. Create cuisines
  console.log('🍽️  Creating cuisines...');
  const cuisineTypes = [...new Set(laRestaurants.flatMap(r => r.cuisine_types))];
  const cuisineInserts = cuisineTypes.map(cuisine => ({
    name: cuisine.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    slug: cuisine,
    description: `Discover the best ${cuisine.replace(/_/g, ' ')} restaurants for your date night.`
  }));

  const { data: createdCuisines, error: cuisineError } = await supabase
    .from('cuisines')
    .insert(cuisineInserts)
    .select();

  if (cuisineError) throw cuisineError;
  console.log(`✅ Created ${createdCuisines.length} cuisines`);

  // Create cuisine lookup map
  const cuisineMap = new Map();
  createdCuisines.forEach(c => {
    cuisineMap.set(c.slug, c.id);
  });

  // 4. Migrate restaurants
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

  // 5. Create restaurant-cuisine relationships
  console.log('🔗 Creating restaurant-cuisine relationships...');
  const { data: allRestaurants, error: restaurantsError } = await supabase
    .from('restaurants')
    .select('id, cuisine_types');

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

  // 6. Update counts
  console.log('📊 Updating counts...');
  
  // Update city restaurant count
  await supabase
    .from('cities')
    .update({ restaurant_count: laRestaurants.length })
    .eq('id', city.id);

  // Update neighborhood counts
  for (const neighborhood of createdNeighborhoods) {
    const count = laRestaurants.filter(r => r.neighborhood === neighborhood.name).length;
    await supabase
      .from('neighborhoods')
      .update({ restaurant_count: count })
      .eq('id', neighborhood.id);
  }

  // Update cuisine counts
  for (const cuisine of createdCuisines) {
    const count = laRestaurants.filter(r => r.cuisine_types.includes(cuisine.slug)).length;
    await supabase
      .from('cuisines')
      .update({ restaurant_count: count })
      .eq('id', cuisine.id);
  }

  console.log('✅ Updated all counts');
  console.log('🎉 Migration completed successfully!');
};

/**
 * Helper functions (copied from existing code)
 */
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

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting database infrastructure setup...');
    
    // Check if Supabase is configured
    if (CONFIG.supabaseUrl === 'your-supabase-url') {
      console.error('❌ Please configure Supabase environment variables:');
      console.error('   SUPABASE_URL=your-supabase-url');
      console.error('   SUPABASE_ANON_KEY=your-supabase-key');
      process.exit(1);
    }

    await createDatabaseSchema();
    await migrateExistingData();
    
    console.log('🎉 Database infrastructure setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up environment variables in your .env file');
    console.log('2. Create API endpoints for data access');
    console.log('3. Update Astro site to use database instead of JSON');
    console.log('4. Build admin dashboard for content management');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createDatabaseSchema, migrateExistingData };
