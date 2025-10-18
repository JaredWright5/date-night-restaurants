import fs from 'fs';
import path from 'path';

/**
 * Remove duplicate Rose restaurant entries
 */

// Read the JSON file
const jsonPath = path.join(process.cwd(), 'la_date_night_restaurants_real.json');
const restaurants = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`📊 Processing ${restaurants.length} restaurants...`);

// Find and remove the duplicate Rose restaurant
const filteredRestaurants = [];
const seenAddresses = new Set();

for (const restaurant of restaurants) {
  // Check if this is a Rose restaurant at 220 Rose Ave
  if (restaurant.address.includes('220 Rose Ave')) {
    if (seenAddresses.has(restaurant.address)) {
      console.log(`🔄 Removing duplicate Rose restaurant: ${restaurant.name}`);
      continue; // Skip this duplicate
    } else {
      seenAddresses.add(restaurant.address);
      console.log(`✅ Keeping Rose restaurant: ${restaurant.name}`);
    }
  }
  
  filteredRestaurants.push(restaurant);
}

console.log(`📊 Removed ${restaurants.length - filteredRestaurants.length} duplicate Rose restaurant`);
console.log(`📊 Now have ${filteredRestaurants.length} unique restaurants`);

// Write the updated data back to the JSON file
fs.writeFileSync(jsonPath, JSON.stringify(filteredRestaurants, null, 2));

console.log('✅ Successfully removed duplicate Rose restaurant!');
console.log('🎉 All restaurants now have unique entries!');
