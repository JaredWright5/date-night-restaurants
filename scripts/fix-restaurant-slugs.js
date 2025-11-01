import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function cleanSlug(slug) {
  // Remove trailing numbers and hyphens
  return slug.replace(/-\d+$/, '').replace(/-$/, '');
}

async function fixRestaurantSlugs() {
  try {
    console.log('Fetching all restaurants...');
    const { data: restaurants, error: fetchError } = await supabase
      .from('restaurants')
      .select('id, name, slug');

    if (fetchError) {
      console.error('Error fetching restaurants:', fetchError);
      return;
    }

    console.log(`Found ${restaurants.length} restaurants to update`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const restaurant of restaurants) {
      const newSlug = cleanSlug(restaurant.slug);
      
      // Skip if slug doesn't need updating
      if (newSlug === restaurant.slug) {
        skippedCount++;
        continue;
      }

      console.log(`Updating: ${restaurant.name}`);
      console.log(`  Old: ${restaurant.slug}`);
      console.log(`  New: ${newSlug}`);

      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ slug: newSlug })
        .eq('id', restaurant.id);

      if (updateError) {
        console.error(`Error updating ${restaurant.name}:`, updateError);
      } else {
        updatedCount++;
      }
    }

    console.log(`\n✅ Update complete!`);
    console.log(`Updated: ${updatedCount} restaurants`);
    console.log(`Skipped: ${skippedCount} restaurants (no changes needed)`);

  } catch (error) {
    console.error('Error:', error);
  }
}

fixRestaurantSlugs();
