import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
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

const generateRedirectPage = (oldSlug, newSlug) => {
  return `---
// Redirect old restaurant URL with number to new clean URL
export function getStaticPaths() {
  return [];
}

return Astro.redirect('/losangeles/${newSlug}/');
---`;
};

async function createAllSlugRedirects() {
  try {
    console.log('Fetching all restaurants...');
    const { data: restaurants, error: fetchError } = await supabase
      .from('restaurants')
      .select('id, name, slug');

    if (fetchError) {
      console.error('Error fetching restaurants:', fetchError);
      return;
    }

    console.log(`Found ${restaurants.length} restaurants to create redirects for`);

    const redirectsDir = join(process.cwd(), 'src', 'pages', 'losangeles');
    mkdirSync(redirectsDir, { recursive: true });

    let createdCount = 0;
    let skippedCount = 0;

    // Create a mapping of old slugs to new slugs
    const oldSlugMappings = [];
    
    for (const restaurant of restaurants) {
      const oldSlug = restaurant.slug;
      const newSlug = cleanSlug(oldSlug);
      
      // Only create redirect if the slug actually changed
      if (newSlug !== oldSlug) {
        oldSlugMappings.push({
          oldSlug,
          newSlug,
          name: restaurant.name
        });
      }
    }

    console.log(`Creating redirects for ${oldSlugMappings.length} restaurants with numbered slugs...`);

    for (const mapping of oldSlugMappings) {
      const filePath = join(redirectsDir, `${mapping.oldSlug}.astro`);
      
      if (!existsSync(filePath)) {
        const pageContent = generateRedirectPage(mapping.oldSlug, mapping.newSlug);
        writeFileSync(filePath, pageContent);
        console.log(`Created redirect: ${mapping.name} (${mapping.oldSlug} -> ${mapping.newSlug})`);
        createdCount++;
      } else {
        console.log(`Redirect page already exists for ${mapping.name}, skipping.`);
        skippedCount++;
      }
    }

    console.log(`\n✅ Created ${createdCount} redirect pages!`);
    console.log(`Skipped: ${skippedCount} restaurants (already exist)`);
    console.log('All old restaurant URLs with numbers will now redirect to clean URLs');

  } catch (error) {
    console.error('Error:', error);
  }
}

createAllSlugRedirects();
