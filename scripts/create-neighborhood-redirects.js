#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Read the restaurants data to get all neighborhoods
const restaurantsData = JSON.parse(readFileSync('la_date_night_restaurants_real.json', 'utf8'));

// Get unique neighborhoods
const neighborhoods = [...new Set(restaurantsData.map(r => r.neighborhood))];

// Create redirect pages for each neighborhood
neighborhoods.forEach(neighborhood => {
  const slug = neighborhood.toLowerCase().replace(/\s+/g, '-');
  const redirectContent = `---
// Redirect old ${neighborhood} URL to new structure
export function getStaticPaths() {
  return [];
}

return Astro.redirect('/losangeles/restaurants/neighborhoods/${slug}/');
---`;

  const filePath = join(process.cwd(), 'src', 'pages', 'restaurants', `${slug}.astro`);
  writeFileSync(filePath, redirectContent);
  console.log(`Created redirect: ${neighborhood} -> ${slug}.astro`);
});

console.log(`\n✅ Created ${neighborhoods.length} neighborhood redirect pages!`);
console.log('All old /restaurants/[neighborhood]/ URLs will now redirect to /losangeles/restaurants/neighborhoods/[neighborhood]/');
