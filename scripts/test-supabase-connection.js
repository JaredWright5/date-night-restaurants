#!/usr/bin/env node

/**
 * Test Supabase Connection
 * This script tests the connection to your Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

console.log('🔗 Testing Supabase Connection...\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase environment variables');
  console.log('Please set the following in your .env.local file:');
  console.log('PUBLIC_SUPABASE_URL=your_supabase_url_here');
  console.log('PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('1. Testing basic connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('restaurants')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Basic connection successful');

    // Test restaurants table
    console.log('\n2. Testing restaurants table...');
    const { data: restaurants, error: restaurantsError } = await supabase
      .from('restaurants')
      .select('id, name, neighborhood')
      .limit(5);

    if (restaurantsError) {
      console.log('❌ Restaurants table error:', restaurantsError.message);
      return false;
    }

    console.log(`✅ Found ${restaurants.length} restaurants`);
    if (restaurants.length > 0) {
      console.log('   Sample restaurants:');
      restaurants.forEach(r => console.log(`   - ${r.name} (${r.neighborhood})`));
    }

    // Test neighborhoods table
    console.log('\n3. Testing neighborhoods table...');
    const { data: neighborhoods, error: neighborhoodsError } = await supabase
      .from('neighborhoods')
      .select('name, slug, restaurant_count')
      .limit(5);

    if (neighborhoodsError) {
      console.log('❌ Neighborhoods table error:', neighborhoodsError.message);
      return false;
    }

    console.log(`✅ Found ${neighborhoods.length} neighborhoods`);
    if (neighborhoods.length > 0) {
      console.log('   Sample neighborhoods:');
      neighborhoods.forEach(n => console.log(`   - ${n.name} (${n.restaurant_count} restaurants)`));
    }

    // Test cities table
    console.log('\n4. Testing cities table...');
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('name, slug, restaurant_count');

    if (citiesError) {
      console.log('❌ Cities table error:', citiesError.message);
      return false;
    }

    console.log(`✅ Found ${cities.length} cities`);
    if (cities.length > 0) {
      console.log('   Cities:');
      cities.forEach(c => console.log(`   - ${c.name} (${c.restaurant_count} restaurants)`));
    }

    // Test specific queries
    console.log('\n5. Testing specific queries...');
    
    // Test neighborhood filtering
    const { data: veniceRestaurants, error: veniceError } = await supabase
      .from('restaurants')
      .select('name, neighborhood')
      .eq('neighborhood', 'Venice')
      .limit(3);

    if (veniceError) {
      console.log('❌ Venice filtering error:', veniceError.message);
    } else {
      console.log(`✅ Venice filtering works: ${veniceRestaurants.length} restaurants found`);
    }

    // Test search functionality
    const { data: searchResults, error: searchError } = await supabase
      .from('restaurants')
      .select('name, neighborhood')
      .ilike('name', '%pizza%')
      .limit(3);

    if (searchError) {
      console.log('❌ Search error:', searchError.message);
    } else {
      console.log(`✅ Search functionality works: ${searchResults.length} results for "pizza"`);
    }

    console.log('\n🎉 All tests passed! Your Supabase database is properly configured.');
    return true;

  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
    return false;
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n✅ Supabase connection is working correctly!');
    console.log('You can now run your application with: npm run dev');
  } else {
    console.log('\n❌ Supabase connection failed.');
    console.log('Please check your database setup and try again.');
    process.exit(1);
  }
});