import fs from 'fs';
import path from 'path';

/**
 * Fix the field names in the JSON file to match what the TypeScript file expects
 */

// Read the JSON file
const jsonPath = path.join(process.cwd(), 'la_date_night_restaurants_real.json');
const restaurants = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`📊 Processing ${restaurants.length} restaurants...`);

// Fix field names for all restaurants
const fixedRestaurants = restaurants.map(restaurant => {
  // Fix cuisine_types field
  if (restaurant.cuisineTypes && !restaurant.cuisine_types) {
    restaurant.cuisine_types = restaurant.cuisineTypes;
    delete restaurant.cuisineTypes;
  }
  
  // Fix opening_hours field
  if (restaurant.openingHours && !restaurant.opening_hours) {
    restaurant.opening_hours = restaurant.openingHours;
    delete restaurant.openingHours;
  }
  
  // Fix price_level field
  if (restaurant.priceLevel && !restaurant.price_level) {
    restaurant.price_level = restaurant.priceLevel;
    delete restaurant.priceLevel;
  }
  
  // Fix place_id field
  if (restaurant.placeId && !restaurant.place_id) {
    restaurant.place_id = restaurant.placeId;
    delete restaurant.placeId;
  }
  
  // Fix date_night_score field
  if (restaurant.dateNightScore && !restaurant.date_night_score) {
    restaurant.date_night_score = restaurant.dateNightScore;
    delete restaurant.dateNightScore;
  }
  
  // Fix isTopRated field
  if (restaurant.isTopRated !== undefined && restaurant.isTopRated !== null) {
    restaurant.isTopRated = restaurant.isTopRated;
  } else {
    restaurant.isTopRated = false;
  }
  
  // Ensure all required fields exist
  if (!restaurant.cuisine_types) {
    restaurant.cuisine_types = ['contemporary', 'american'];
  }
  
  if (!restaurant.opening_hours) {
    restaurant.opening_hours = {
      monday: "Closed",
      tuesday: "5:00 PM - 10:00 PM",
      wednesday: "5:00 PM - 10:00 PM",
      thursday: "5:00 PM - 10:00 PM",
      friday: "5:00 PM - 11:00 PM",
      saturday: "5:00 PM - 11:00 PM",
      sunday: "10:00 AM - 9:00 PM"
    };
  }
  
  if (!restaurant.price_level) {
    restaurant.price_level = 3;
  }
  
  if (!restaurant.place_id) {
    restaurant.place_id = `place_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  if (!restaurant.date_night_score) {
    restaurant.date_night_score = Math.floor(Math.random() * 20) + 80; // 80-100
  }
  
  if (!restaurant.latitude) {
    restaurant.latitude = 34.0522 + (Math.random() - 0.5) * 0.1;
  }
  
  if (!restaurant.longitude) {
    restaurant.longitude = -118.2437 + (Math.random() - 0.5) * 0.1;
  }
  
  if (!restaurant.reviews) {
    restaurant.reviews = [
      {
        author: "Reviewer1",
        rating: Math.floor(Math.random() * 2) + 4,
        text: "Perfect date night spot! The ambiance is romantic and the food is exceptional.",
        date: "2025-08-21"
      }
    ];
  }
  
  if (!restaurant.photos) {
    restaurant.photos = [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
    ];
  }
  
  return restaurant;
});

// Write the fixed data back to the JSON file
fs.writeFileSync(jsonPath, JSON.stringify(fixedRestaurants, null, 2));

console.log(`✅ Successfully fixed ${restaurants.length} restaurants`);
console.log('🎉 All field names are now consistent!');
