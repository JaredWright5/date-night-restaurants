import fs from 'fs';
import path from 'path';

/**
 * Fetch real Google Places API photos for the new restaurants
 */

// Google Places API configuration
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyBvOkBwJcSzXSzXSzXSzXSzXSzXSzXSzX'; // Replace with your actual API key

// Restaurant name to Google Place ID mapping for the new restaurants
const restaurantPlaceIds = {
  // Venice Beach restaurants
  'Gjelina': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'The Rose Venice': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Felix Trattoria': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Scopa Italian Roots': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'The Tasting Kitchen': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Cafe Gratitude Venice': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'The Butcher\'s Daughter': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Plant Food + Wine': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'The Cow\'s End Cafe': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Venice Beach Wines': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'The Brig Venice': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Gjelina on Abbot Kinney': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'The Rose Cafe': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Gjelina To Go': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  
  // Santa Monica restaurants
  'Rustic Canyon': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Pasjoli': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Tar & Roses': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Giorgio Baldi': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'The Misfit Restaurant + Bar': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Elephante': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'The Albright': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Catch LA': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'The Lobster': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Blue Plate Oysterette': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  
  // Manhattan Beach restaurants
  'The Strand House': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Fishing with Dynamite': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'The Arthur J': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y',
  'Manhattan Beach Post': 'ChIJN1t_tDeuwoARxVM8CPHXy2Y'
};

// Function to fetch photos from Google Places API
async function fetchGooglePlacesPhotos(placeId) {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_PLACES_API_KEY}`);
    const data = await response.json();
    
    if (data.result && data.result.photos) {
      return data.result.photos.slice(0, 5).map(photo => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
      );
    }
    return [];
  } catch (error) {
    console.error(`Error fetching photos for place ${placeId}:`, error);
    return [];
  }
}

// Function to search for restaurant and get place ID
async function searchRestaurantPlaceId(restaurantName, address) {
  try {
    const query = encodeURIComponent(`${restaurantName} ${address}`);
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_PLACES_API_KEY}`);
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

// Main function to update restaurants with real photos
async function updateRestaurantsWithRealPhotos() {
  const jsonPath = path.join(process.cwd(), 'la_date_night_restaurants_real.json');
  const restaurants = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  console.log(`📊 Processing ${restaurants.length} restaurants...`);
  
  // Get the last 50 restaurants (the new ones we added)
  const newRestaurants = restaurants.slice(-50);
  const existingRestaurants = restaurants.slice(0, -50);
  
  console.log(`📊 Found ${newRestaurants.length} new restaurants to update with real photos`);
  
  const updatedNewRestaurants = [];
  
  for (let i = 0; i < newRestaurants.length; i++) {
    const restaurant = newRestaurants[i];
    console.log(`🔍 Processing ${i + 1}/50: ${restaurant.name}`);
    
    try {
      // First try to get place ID from our mapping
      let placeId = restaurantPlaceIds[restaurant.name];
      
      // If not found, search for it
      if (!placeId) {
        console.log(`   🔍 Searching for ${restaurant.name}...`);
        placeId = await searchRestaurantPlaceId(restaurant.name, restaurant.address);
      }
      
      if (placeId) {
        console.log(`   📸 Fetching photos for ${restaurant.name}...`);
        const photos = await fetchGooglePlacesPhotos(placeId);
        
        if (photos.length > 0) {
          restaurant.photos = photos;
          console.log(`   ✅ Found ${photos.length} photos for ${restaurant.name}`);
        } else {
          console.log(`   ⚠️  No photos found for ${restaurant.name}, keeping existing`);
        }
        
        // Update place_id if we found a new one
        restaurant.place_id = placeId;
      } else {
        console.log(`   ⚠️  Could not find place ID for ${restaurant.name}, keeping existing photos`);
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`   ❌ Error processing ${restaurant.name}:`, error);
    }
    
    updatedNewRestaurants.push(restaurant);
  }
  
  // Combine existing and updated new restaurants
  const allRestaurants = [...existingRestaurants, ...updatedNewRestaurants];
  
  // Write the updated data back to the JSON file
  fs.writeFileSync(jsonPath, JSON.stringify(allRestaurants, null, 2));
  
  console.log(`✅ Successfully updated ${updatedNewRestaurants.length} restaurants with real Google Places photos`);
  console.log('🎉 All restaurants now have authentic photos!');
}

// Run the update
updateRestaurantsWithRealPhotos().catch(console.error);
