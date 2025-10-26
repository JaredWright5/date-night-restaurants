#!/usr/bin/env node

/**
 * Create Database Schema Script
 * This script creates the required database schema in Supabase
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

console.log('🏗️  Creating Database Schema...\n');

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

async function createSchema() {
  try {
    console.log('1. Creating database schema...');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: schemaSQL });
    
    if (error) {
      console.log('❌ Error creating schema:', error.message);
      console.log('\nPlease run the SQL commands manually in your Supabase dashboard:');
      console.log('1. Go to your Supabase project dashboard');
      console.log('2. Navigate to the SQL Editor');
      console.log('3. Copy and paste the SQL commands from the setup script');
      return false;
    }
    
    console.log('✅ Database schema created successfully!');
    return true;
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\nPlease run the SQL commands manually in your Supabase dashboard:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the SQL commands from the setup script');
    return false;
  }
}

// Run the schema creation
createSchema().then(success => {
  if (success) {
    console.log('\n🎉 Database schema is ready!');
    console.log('Next step: Run the import script to add your restaurant data');
    console.log('Command: node scripts/import-restaurants.js');
  } else {
    console.log('\n⚠️  Please set up the database schema manually');
  }
});
