#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    console.log('🔍 Checking neighborhoods table schema...');
    
    // Try to get one record to see the structure
    const { data, error } = await supabase
      .from('neighborhoods')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error:', error.message);
      console.log('   This might mean the table is empty or has schema issues');
    } else if (data && data.length > 0) {
      console.log('✅ Neighborhoods table columns:', Object.keys(data[0]));
    } else {
      console.log('⚠️  No data in neighborhoods table');
    }
    
    // Try a simple insert to see what columns are expected
    console.log('\n🧪 Testing insert with minimal data...');
    const { error: insertError } = await supabase
      .from('neighborhoods')
      .insert({
        name: 'Test Neighborhood',
        slug: 'test-neighborhood'
      });
    
    if (insertError) {
      console.log('❌ Insert error:', insertError.message);
    } else {
      console.log('✅ Basic insert works');
      // Clean up test data
      await supabase.from('neighborhoods').delete().eq('slug', 'test-neighborhood');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSchema();
