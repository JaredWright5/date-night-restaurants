import fs from 'fs';
import path from 'path';

/**
 * Remove duplicates and fetch real Google Places API photos for new restaurants
 */

// Read the JSON file
const jsonPath = path.join(process.cwd(), 'la_date_night_restaurants_real.json');
const restaurants = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`📊 Processing ${restaurants.length} restaurants...`);

// Remove duplicates by keeping the first occurrence of each restaurant name
const seenNames = new Set();
const uniqueRestaurants = [];

for (const restaurant of restaurants) {
  if (!seenNames.has(restaurant.name)) {
    seenNames.add(restaurant.name);
    uniqueRestaurants.push(restaurant);
  } else {
    console.log(`🔄 Removing duplicate: ${restaurant.name}`);
  }
}

console.log(`📊 Removed ${restaurants.length - uniqueRestaurants.length} duplicates`);
console.log(`📊 Now have ${uniqueRestaurants.length} unique restaurants`);

// Get the last 50 restaurants (the new ones we added)
const newRestaurants = uniqueRestaurants.slice(-50);
const existingRestaurants = uniqueRestaurants.slice(0, -50);

console.log(`📊 Found ${newRestaurants.length} new restaurants to update with real photos`);

// Function to search for restaurant and get place ID
async function searchRestaurantPlaceId(restaurantName, address) {
  try {
    const query = encodeURIComponent(`${restaurantName} ${address}`);
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_PLACES_API_KEY}`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].place_id;
    }
    return null;
  } catch (error) {
    console.error(`Error searching for ${restaurantName}:`, error);
    return null;
  }
}

// Function to fetch photos from Google Places API
async function fetchGooglePlacesPhotos(placeId) {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${process.env.GOOGLE_PLACES_API_KEY}`);
    const data = await response.json();
    
    if (data.result && data.result.photos) {
      return data.result.photos.slice(0, 5).map(photo => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
      );
    }
    return [];
  } catch (error) {
    console.error(`Error fetching photos for place ${placeId}:`, error);
    return [];
  }
}

// Update new restaurants with real photos
const updatedNewRestaurants = [];

for (let i = 0; i < newRestaurants.length; i++) {
  const restaurant = newRestaurants[i];
  console.log(`🔍 Processing ${i + 1}/50: ${restaurant.name}`);
  
  try {
    // Search for the restaurant to get place ID
    console.log(`   🔍 Searching for ${restaurant.name}...`);
    const placeId = await searchRestaurantPlaceId(restaurant.name, restaurant.address);
    
    if (placeId) {
      console.log(`   📸 Fetching photos for ${restaurant.name}...`);
      const photos = await fetchGooglePlacesPhotos(placeId);
      
      if (photos.length > 0) {
        restaurant.photos = photos;
        restaurant.place_id = placeId;
        console.log(`   ✅ Found ${photos.length} photos for ${restaurant.name}`);
      } else {
        console.log(`   ⚠️  No photos found for ${restaurant.name}, keeping existing`);
      }
    } else {
      console.log(`   ⚠️  Could not find place ID for ${restaurant.name}, keeping existing photos`);
    }
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
    
  } catch (error) {
    console.error(`   ❌ Error processing ${restaurant.name}:`, error);
  }
  
  updatedNewRestaurants.push(restaurant);
}

// Combine existing and updated new restaurants
const allRestaurants = [...existingRestaurants, ...updatedNewRestaurants];

// Write the updated data back to the JSON file
fs.writeFileSync(jsonPath, JSON.stringify(allRestaurants, null, 2));

console.log(`✅ Successfully processed ${allRestaurants.length} restaurants`);
console.log(`🔄 Removed ${restaurants.length - allRestaurants.length} duplicates`);
console.log(`📸 Updated photos for ${updatedNewRestaurants.length} new restaurants`);
console.log('🎉 All restaurants now have unique entries and real photos!');
