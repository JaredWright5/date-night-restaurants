#!/usr/bin/env node

/**
 * Test Supabase Connection Script
 * This script tests your Supabase connection and environment setup
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');

// Check environment variables
if (!supabaseUrl || supabaseUrl === 'your-project-url-here') {
  console.error('❌ SUPABASE_URL not set or still using placeholder');
  console.error('   Please set SUPABASE_URL in your .env.local file');
  process.exit(1);
}

if (!supabaseKey || supabaseKey === 'your-anon-key-here') {
  console.error('❌ SUPABASE_ANON_KEY not set or still using placeholder');
  console.error('   Please set SUPABASE_ANON_KEY in your .env.local file');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);

// Test connection
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔗 Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('cities')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:');
      console.error(`   ${error.message}`);
      
      if (error.message.includes('relation "cities" does not exist')) {
        console.log('\n💡 The database tables haven\'t been created yet.');
        console.log('   Run: npm run setup-database');
        return;
      }
      
      if (error.message.includes('Invalid API key')) {
        console.log('\n💡 Check your SUPABASE_ANON_KEY in .env.local');
        return;
      }
      
      if (error.message.includes('Invalid URL')) {
        console.log('\n💡 Check your SUPABASE_URL in .env.local');
        return;
      }
      
      return;
    }
    
    console.log('✅ Database connection successful!');
    
    // Test if tables exist
    console.log('\n📊 Checking database tables...');
    
    const tables = ['cities', 'neighborhoods', 'restaurants', 'cuisines'];
    const tableStatus = {};
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        tableStatus[table] = error ? '❌ Missing' : '✅ Exists';
      } catch (err) {
        tableStatus[table] = '❌ Error';
      }
    }
    
    console.log('\n📋 Table Status:');
    Object.entries(tableStatus).forEach(([table, status]) => {
      console.log(`   ${table}: ${status}`);
    });
    
    const missingTables = Object.entries(tableStatus)
      .filter(([_, status]) => status.includes('❌'))
      .map(([table, _]) => table);
    
    if (missingTables.length > 0) {
      console.log('\n💡 Some tables are missing. Run: npm run setup-database');
    } else {
      console.log('\n🎉 All tables exist! Your database is ready.');
      
      // Test data count
      console.log('\n📊 Checking data...');
      
      try {
        const { count: cityCount } = await supabase
          .from('cities')
          .select('*', { count: 'exact', head: true });
        
        const { count: restaurantCount } = await supabase
          .from('restaurants')
          .select('*', { count: 'exact', head: true });
        
        console.log(`   Cities: ${cityCount || 0}`);
        console.log(`   Restaurants: ${restaurantCount || 0}`);
        
        if (restaurantCount === 0) {
          console.log('\n💡 No restaurants found. Run: npm run setup-database');
        } else {
          console.log('\n🎉 Database is fully set up and ready to use!');
          console.log('\n📋 Next steps:');
          console.log('1. Visit /admin to see your admin dashboard');
          console.log('2. Test your existing pages to make sure they work');
          console.log('3. Start planning your next city expansion!');
        }
      } catch (err) {
        console.log('   Could not check data counts');
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the test
testConnection();
