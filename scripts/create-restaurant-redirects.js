import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL, process.env.PUBLIC_SUPABASE_ANON_KEY);

// Create the restaurants directory structure
const restaurantsDir = join(__dirname, '..', 'src', 'pages', 'restaurants');

const generateRedirectPage = (restaurant) => {
  return `---
// Redirect old ${restaurant.name} URL to new structure
export function getStaticPaths() {
  return [];
}

return Astro.redirect('/losangeles/${restaurant.slug}/');
---`;
};

async function createRestaurantRedirects() {
  try {
    console.log('Fetching restaurants from Supabase...');
    
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('name, slug, neighborhood_slug')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching restaurants:', error);
      return;
    }

    console.log(`Found ${restaurants.length} restaurants to create redirects for`);

    for (const restaurant of restaurants) {
      // Create neighborhood directory if it doesn't exist
      const neighborhoodDir = join(restaurantsDir, restaurant.neighborhood_slug);
      if (!existsSync(neighborhoodDir)) {
        mkdirSync(neighborhoodDir, { recursive: true });
      }

      const filePath = join(neighborhoodDir, `${restaurant.slug}.astro`);
      
      // Only create if it doesn't exist to avoid overwriting
      if (!existsSync(filePath)) {
        const pageContent = generateRedirectPage(restaurant);
        writeFileSync(filePath, pageContent);
        console.log(`Created redirect: ${restaurant.name} -> ${restaurant.neighborhood_slug}/${restaurant.slug}.astro`);
      } else {
        console.log(`Redirect page already exists for ${restaurant.name}, skipping.`);
      }
    }

    console.log(`\n✅ Created redirect pages for ${restaurants.length} restaurants!`);
    console.log('All old /restaurants/[neighborhood]/[restaurant]/ URLs will now redirect to /losangeles/[restaurant]/');
  } catch (error) {
    console.error('Error creating restaurant redirects:', error);
  }
}

createRestaurantRedirects();
