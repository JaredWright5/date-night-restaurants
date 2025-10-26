#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * This script helps you set up the required database schema and import data
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🗄️  Supabase Database Setup\n');

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

console.log('📋 Database Schema Setup Instructions:\n');

console.log('1. Go to your Supabase project dashboard');
console.log('2. Navigate to the SQL Editor');
console.log('3. Run the following SQL commands:\n');

const schemaSQL = `
-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  restaurant_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  description TEXT,
  restaurant_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  neighborhood_slug TEXT NOT NULL,
  city TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  cuisine_types TEXT[] NOT NULL DEFAULT '{}',
  price_level INTEGER NOT NULL CHECK (price_level >= 1 AND price_level <= 4),
  rating DECIMAL(3,2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  date_night_score INTEGER NOT NULL CHECK (date_night_score >= 0 AND date_night_score <= 100),
  photos TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  phone TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_restaurants_neighborhood_slug ON restaurants(neighborhood_slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_city_slug ON restaurants(city_slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_is_active ON restaurants(is_active);
CREATE INDEX IF NOT EXISTS idx_restaurants_date_night_score ON restaurants(date_night_score DESC);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_slug ON neighborhoods(slug);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_city_slug ON neighborhoods(city_slug);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to neighborhoods" ON neighborhoods FOR SELECT USING (true);
CREATE POLICY "Allow public read access to restaurants" ON restaurants FOR SELECT USING (true);

-- Insert default city (Los Angeles)
INSERT INTO cities (name, slug, description, restaurant_count) 
VALUES ('Los Angeles', 'los-angeles', 'The City of Angels', 0)
ON CONFLICT (slug) DO NOTHING;
`;

console.log(schemaSQL);

console.log('\n4. After running the SQL, you can import your restaurant data using the import script.\n');

// Check if JSON data exists
const jsonDataPath = 'la_date_night_restaurants_real.json';
if (fs.existsSync(jsonDataPath)) {
  console.log('📊 Found restaurant data file. Creating import script...\n');
  
  const importScript = `
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient('${supabaseUrl}', '${supabaseKey}');

async function importRestaurants() {
  try {
    // Read the JSON data
    const jsonData = JSON.parse(fs.readFileSync('${jsonDataPath}', 'utf8'));
    
    console.log(\`Importing \${jsonData.length} restaurants...\`);
    
    // Transform the data to match our schema
    const restaurants = jsonData.map(restaurant => ({
      name: restaurant.name,
      slug: restaurant.slug,
      address: restaurant.address,
      neighborhood: restaurant.neighborhood,
      neighborhood_slug: restaurant.neighborhood.toLowerCase().replace(/\\s+/g, '-'),
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
    }));
    
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
      
      console.log(\`Imported batch \${Math.floor(i / batchSize) + 1} of \${Math.ceil(restaurants.length / batchSize)}\`);
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
          description: \`Romantic dining in \${neighborhood.name}\`,
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
`;

  fs.writeFileSync('scripts/import-restaurants.js', importScript);
  console.log('✅ Created import script: scripts/import-restaurants.js');
  console.log('\nTo import your data, run:');
  console.log('node scripts/import-restaurants.js\n');
} else {
  console.log('⚠️  No restaurant data file found. Please ensure la_date_night_restaurants_real.json exists.\n');
}

console.log('🔧 Next Steps:');
console.log('1. Set up your Supabase database with the schema above');
console.log('2. Import your restaurant data using the import script');
console.log('3. Test the connection with: node scripts/test-supabase-connection.js');
console.log('4. Deploy your application');

console.log('\n📚 Documentation:');
console.log('- Supabase Setup: https://supabase.com/docs/guides/getting-started');
console.log('- Database Schema: See NEW_ARCHITECTURE.md');
console.log('- Environment Variables: Add to .env.local file');
