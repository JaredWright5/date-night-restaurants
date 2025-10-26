#!/usr/bin/env node

/**
 * Check Database Schema Script
 * This script checks the current database schema and shows what needs to be fixed
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

console.log('🔍 Checking Database Schema...\n');

async function checkSchema() {
  try {
    // Check if restaurants table exists and get its structure
    console.log('1. Checking restaurants table structure...');
    
    const { data: restaurants, error: restaurantsError } = await supabase
      .from('restaurants')
      .select('*')
      .limit(1);

    if (restaurantsError) {
      console.log('❌ Restaurants table error:', restaurantsError.message);
      
      if (restaurantsError.message.includes('does not exist')) {
        console.log('\n📋 The restaurants table does not exist. You need to create it first.');
        console.log('Please run the SQL commands I provided earlier to create the tables.');
        return;
      }
    } else {
      console.log('✅ Restaurants table exists');
      if (restaurants && restaurants.length > 0) {
        console.log('   Sample restaurant data structure:');
        console.log('   Columns:', Object.keys(restaurants[0]));
      }
    }

    // Check cities table
    console.log('\n2. Checking cities table...');
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('*')
      .limit(1);

    if (citiesError) {
      console.log('❌ Cities table error:', citiesError.message);
    } else {
      console.log('✅ Cities table exists');
    }

    // Check neighborhoods table
    console.log('\n3. Checking neighborhoods table...');
    const { data: neighborhoods, error: neighborhoodsError } = await supabase
      .from('neighborhoods')
      .select('*')
      .limit(1);

    if (neighborhoodsError) {
      console.log('❌ Neighborhoods table error:', neighborhoodsError.message);
    } else {
      console.log('✅ Neighborhoods table exists');
    }

    console.log('\n📋 Next Steps:');
    console.log('1. If any tables are missing, run the SQL commands to create them');
    console.log('2. If tables exist but have wrong structure, you may need to drop and recreate them');
    console.log('3. Once tables are correct, run the import script');

  } catch (error) {
    console.log('❌ Error checking schema:', error.message);
  }
}

checkSchema();
