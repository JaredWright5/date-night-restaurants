/**
 * Fetch photos for restaurants that don't have Google photos yet
 * Uses improved search queries and multiple attempts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
const INPUT_PATH = path.join(__dirname, '../la_date_night_restaurants.json');
const OUTPUT_PATH = path.join(__dirname, '../la_date_night_restaurants.json');
const DELAY = 300;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Search with multiple query variations
async function searchRestaurant(name, address, neighborhood) {
  const queries = [
    `${name} ${address}`,
    `${name} Los Angeles`,
    `${name} ${neighborhood} Los Angeles`,
    `${name} restaurant Los Angeles`
  ];
  
  for (const query of queries) {
    const url = 'https://places.googleapis.com/v1/places:searchText';
    
    const requestBody = {
      textQuery: query,
      maxResultCount: 1
    };
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber,places.regularOpeningHours,places.photos'
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (data.places && data.places.length > 0 && data.places[0].photos) {
        return data.places[0];
      }
      
      await delay(100); // Small delay between query attempts
      
    } catch (error) {
      console.error(`   Error with query "${query}":`, error.message);
    }
  }
  
  return null;
}

function getPhotoUrl(photoName, maxWidth = 800) {
  return `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxWidthPx=${maxWidth}`;
}

async function fetchMissingPhotos() {
  console.log('🔍 Fetching photos for restaurants without Google images...\n');
  
  if (!API_KEY) {
    console.error('❌ GOOGLE_PLACES_API_KEY not set');
    process.exit(1);
  }
  
  const restaurants = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf-8'));
  
  // Find restaurants without Google photos
  const needsPhotos = restaurants.filter(r => 
    !r.photos || 
    !r.photos[0] || 
    !r.photos[0].includes('googleapis.com')
  );
  
  console.log(`📊 Found ${needsPhotos.length} restaurants needing photos\n`);
  console.log(`⏱️  Estimated time: ${Math.ceil(needsPhotos.length * 1.5 / 60)} minutes\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < needsPhotos.length; i++) {
    const restaurant = needsPhotos[i];
    console.log(`[${i + 1}/${needsPhotos.length}] ${restaurant.name}...`);
    
    try {
      const place = await searchRestaurant(
        restaurant.name, 
        restaurant.address || '',
        restaurant.neighborhood || ''
      );
      
      await delay(DELAY);
      
      if (!place || !place.photos || place.photos.length === 0) {
        console.log(`   ⚠️  No photos found`);
        failCount++;
        continue;
      }
      
      // Update with Google photos
      const photoUrls = place.photos
        .slice(0, 5)
        .map(photo => getPhotoUrl(photo.name, 800));
      
      restaurant.photos = photoUrls;
      restaurant.google_place_id = place.id;
      
      // Update other data if available
      if (place.formattedAddress) restaurant.address = place.formattedAddress;
      if (place.nationalPhoneNumber) restaurant.phone = place.nationalPhoneNumber;
      if (place.websiteUri) restaurant.website = place.websiteUri;
      if (place.rating) restaurant.rating = Math.round(place.rating * 10) / 10;
      if (place.location) {
        restaurant.latitude = place.location.latitude;
        restaurant.longitude = place.location.longitude;
      }
      
      // Update opening hours
      if (place.regularOpeningHours && place.regularOpeningHours.weekdayDescriptions) {
        const openingHours = {};
        place.regularOpeningHours.weekdayDescriptions.forEach(desc => {
          const [day, hours] = desc.split(': ');
          openingHours[day] = hours || 'Closed';
        });
        restaurant.opening_hours = openingHours;
      }
      
      successCount++;
      console.log(`   ✅ ${photoUrls.length} photos | ${place.rating || 'N/A'}★`);
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      failCount++;
    }
    
    // Save progress every 10
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(restaurants, null, 2));
      console.log(`\n💾 Progress saved (${i + 1}/${needsPhotos.length})\n`);
    }
  }
  
  // Save final
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(restaurants, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Successfully fetched photos: ${successCount} restaurants`);
  console.log(`❌ Still missing photos: ${failCount} restaurants`);
  console.log(`📸 Total with Google photos: ${restaurants.filter(r => r.photos && r.photos[0] && r.photos[0].includes('googleapis.com')).length}`);
  console.log(`💰 API calls used: ~${successCount * 4} (trying multiple queries)`);
  console.log(`\n📁 Updated: ${OUTPUT_PATH}`);
  console.log(`\n✨ Ready to deploy!\n`);
}

fetchMissingPhotos().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

