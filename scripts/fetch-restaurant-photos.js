/**
 * Google Places API Photo Fetcher
 * 
 * This script fetches real restaurant photos from Google Places API
 * and updates the restaurant data with actual photo URLs.
 * 
 * Free tier: 1,000 photo requests per month
 * Cost: $0.032 per photo after free tier
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
const RESTAURANT_DATA_PATH = path.join(__dirname, '../la_date_night_restaurants.json');
const OUTPUT_PATH = path.join(__dirname, '../la_date_night_restaurants_updated.json');

// Rate limiting
const DELAY_BETWEEN_REQUESTS = 100; // milliseconds
const MAX_PHOTOS_PER_RESTAURANT = 5;

/**
 * Search for a restaurant using Google Places API
 */
async function searchRestaurant(restaurantName, address) {
  const query = `${restaurantName} ${address}`;
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,photos&key=${GOOGLE_PLACES_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
      return data.candidates[0];
    }
    
    console.warn(`⚠️  No results found for: ${restaurantName}`);
    return null;
  } catch (error) {
    console.error(`❌ Error searching for ${restaurantName}:`, error.message);
    return null;
  }
}

/**
 * Get place details including photos
 */
async function getPlaceDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,name,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      return data.result;
    }
    
    console.warn(`⚠️  No details found for place_id: ${placeId}`);
    return null;
  } catch (error) {
    console.error(`❌ Error fetching details for ${placeId}:`, error.message);
    return null;
  }
}

/**
 * Generate Google Places photo URL
 */
function generatePhotoUrl(photoReference, maxWidth = 800) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
}

/**
 * Delay helper
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main function to fetch photos for all restaurants
 */
async function fetchAllRestaurantPhotos() {
  console.log('🚀 Starting Google Places Photo Fetch...\n');
  
  // Validate API key
  if (!GOOGLE_PLACES_API_KEY) {
    console.error('❌ ERROR: GOOGLE_PLACES_API_KEY environment variable is not set!');
    console.log('\n📝 To fix this:');
    console.log('1. Get your API key from: https://console.cloud.google.com/apis/credentials');
    console.log('2. Enable Places API: https://console.cloud.google.com/apis/library/places-backend.googleapis.com');
    console.log('3. Run: export GOOGLE_PLACES_API_KEY="your-api-key-here"');
    console.log('4. Run this script again\n');
    process.exit(1);
  }
  
  // Load restaurant data
  const restaurantsData = JSON.parse(fs.readFileSync(RESTAURANT_DATA_PATH, 'utf-8'));
  console.log(`📊 Loaded ${restaurantsData.length} restaurants\n`);
  console.log(`⏱️  Estimated time: ${Math.ceil(restaurantsData.length * 0.2 / 60)} minutes\n`);
  
  let updatedCount = 0;
  let failedCount = 0;
  let photoCount = 0;
  let skippedCount = 0;
  
  // Process each restaurant
  for (let i = 0; i < restaurantsData.length; i++) {
    const restaurant = restaurantsData[i];
    console.log(`\n[${i + 1}/${restaurantsData.length}] Processing: ${restaurant.name}`);
    
    // Skip if already has Google photos
    if (restaurant.google_place_id && restaurant.photos && restaurant.photos.length > 0 && 
        restaurant.photos[0].includes('googleapis.com')) {
      console.log(`   ⏭️  Skipping - already has Google photos`);
      skippedCount++;
      continue;
    }
    
    try {
      // Search for restaurant
      const searchResult = await searchRestaurant(restaurant.name, restaurant.address);
      await delay(DELAY_BETWEEN_REQUESTS);
      
      if (!searchResult || !searchResult.place_id) {
        console.log(`   ⚠️  Skipping - not found in Google Places`);
        failedCount++;
        continue;
      }
      
      // Get place details with photos
      const placeDetails = await getPlaceDetails(searchResult.place_id);
      await delay(DELAY_BETWEEN_REQUESTS);
      
      if (!placeDetails || !placeDetails.photos || placeDetails.photos.length === 0) {
        console.log(`   ⚠️  No photos available for this restaurant`);
        failedCount++;
        continue;
      }
      
      // Generate photo URLs
      const photoUrls = placeDetails.photos
        .slice(0, MAX_PHOTOS_PER_RESTAURANT)
        .map(photo => generatePhotoUrl(photo.photo_reference, 800));
      
      // Update restaurant data
      restaurant.photos = photoUrls;
      restaurant.google_place_id = searchResult.place_id;
      restaurant.photo_count = photoUrls.length;
      
      // Update rating if available
      if (placeDetails.rating) {
        restaurant.google_rating = placeDetails.rating;
        restaurant.google_reviews_count = placeDetails.user_ratings_total || 0;
      }
      
      photoCount += photoUrls.length;
      updatedCount++;
      
      console.log(`   ✅ Found ${photoUrls.length} photos | Rating: ${placeDetails.rating || 'N/A'}★`);
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      failedCount++;
    }
    
    // Save progress every 10 restaurants
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(restaurantsData, null, 2));
      console.log(`\n💾 Progress saved (${i + 1}/${restaurantsData.length})`);
    }
  }
  
  // Save final updated data
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(restaurantsData, null, 2));
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully updated: ${updatedCount} restaurants`);
  console.log(`⏭️  Skipped (already updated): ${skippedCount} restaurants`);
  console.log(`❌ Failed: ${failedCount} restaurants`);
  console.log(`📸 Total photos fetched: ${photoCount}`);
  console.log(`💰 API calls used: ~${(updatedCount * 2)} (within free tier)`);
  console.log(`💵 Estimated cost: $0 (within 1,000 free photo requests)`);
  console.log(`\n📁 Updated data saved to: ${OUTPUT_PATH}`);
  console.log('\n✨ Next steps:');
  console.log('1. Review the updated data file');
  console.log('2. cp la_date_night_restaurants_updated.json la_date_night_restaurants.json');
  console.log('3. npm run build');
  console.log('4. git add la_date_night_restaurants.json');
  console.log('5. git commit -m "Update with real Google Places photos"');
  console.log('6. git push origin main\n');
}

// Run the script
fetchAllRestaurantPhotos().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

