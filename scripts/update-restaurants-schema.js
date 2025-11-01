#!/usr/bin/env node

/**
 * Update Restaurants Schema Script
 * Adds opening_hours and reviews fields to the restaurants table
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🗄️  Updating Restaurants Schema\n');

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

console.log('📋 Database Schema Update Instructions:\n');

console.log('1. Go to your Supabase project dashboard');
console.log('2. Navigate to the SQL Editor');
console.log('3. Run the following SQL commands:\n');

const schemaUpdateSQL = `
-- Add opening_hours column to restaurants table
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS opening_hours JSONB;

-- Add reviews column to restaurants table  
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS reviews JSONB;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_restaurants_opening_hours ON restaurants USING GIN (opening_hours);
CREATE INDEX IF NOT EXISTS idx_restaurants_reviews ON restaurants USING GIN (reviews);

-- Update the table comment
COMMENT ON COLUMN restaurants.opening_hours IS 'Restaurant operating hours by day of week';
COMMENT ON COLUMN restaurants.reviews IS 'Customer reviews with author, text, and rating';
`;

console.log(schemaUpdateSQL);

console.log('\n4. After running the SQL, you can import the updated data using the import script.\n');

console.log('🔧 Next Steps:');
console.log('1. Update your Supabase database with the schema above');
console.log('2. Run the updated import script to populate hours and reviews');
console.log('3. Test the connection and verify data is properly imported');

console.log('\n📚 Documentation:');
console.log('- Supabase JSONB: https://supabase.com/docs/guides/database/json');
console.log('- GIN Indexes: https://www.postgresql.org/docs/current/gin.html');
