#!/usr/bin/env node

/**
 * Fix Database Schema Script
 * This script adds the missing columns to match our expected schema
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

console.log('🔧 Fixing Database Schema...\n');

const fixSchemaSQL = `
-- Add missing columns to restaurants table
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS neighborhood TEXT,
ADD COLUMN IF NOT EXISTS neighborhood_slug TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS city_slug TEXT;

-- Update existing data to populate the new columns
UPDATE restaurants 
SET 
  neighborhood = (SELECT name FROM neighborhoods WHERE id = restaurants.neighborhood_id),
  neighborhood_slug = (SELECT slug FROM neighborhoods WHERE id = restaurants.neighborhood_id),
  city = (SELECT name FROM cities WHERE id = restaurants.city_id),
  city_slug = (SELECT slug FROM cities WHERE id = restaurants.city_id)
WHERE neighborhood IS NULL OR neighborhood_slug IS NULL OR city IS NULL OR city_slug IS NULL;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_restaurants_neighborhood_slug ON restaurants(neighborhood_slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_city_slug ON restaurants(city_slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_neighborhood ON restaurants(neighborhood);
CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants(city);
`;

async function fixSchema() {
  try {
    console.log('1. Adding missing columns to restaurants table...');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: fixSchemaSQL });
    
    if (error) {
      console.log('❌ Error fixing schema:', error.message);
      console.log('\nPlease run this SQL manually in your Supabase dashboard:');
      console.log(fixSchemaSQL);
      return false;
    }
    
    console.log('✅ Database schema fixed successfully!');
    return true;
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\nPlease run this SQL manually in your Supabase dashboard:');
    console.log(fixSchemaSQL);
    return false;
  }
}

// Run the schema fix
fixSchema().then(success => {
  if (success) {
    console.log('\n🎉 Database schema is now compatible!');
    console.log('Next step: Run the import script to add your restaurant data');
    console.log('Command: node scripts/import-restaurants.js');
  } else {
    console.log('\n⚠️  Please run the SQL commands manually in your Supabase dashboard');
  }
});
