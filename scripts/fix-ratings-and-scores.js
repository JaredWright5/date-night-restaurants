/**
 * Fix Ratings and Date Scores
 * - Round ratings to 1 decimal place
 * - Vary date_night_score (85-99 range based on rating)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_PATH = path.join(__dirname, '../la_date_night_restaurants.json');
const OUTPUT_PATH = path.join(__dirname, '../la_date_night_restaurants.json');

console.log('🔧 Fixing ratings and date night scores...\n');

// Load data
const restaurants = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf-8'));

// Fix each restaurant
restaurants.forEach((restaurant, index) => {
  // Round rating to 1 decimal place
  restaurant.rating = Math.round(restaurant.rating * 10) / 10;
  
  // Calculate date_night_score based on rating and other factors
  // Base score from rating (4.0 = 80, 5.0 = 100)
  let baseScore = Math.round((restaurant.rating - 3.0) * 20 + 60);
  
  // Add bonus for price level (higher price often means more romantic ambiance)
  const priceBonus = restaurant.price_level * 2;
  
  // Add bonus for certain cuisine types
  const romanticCuisines = ['fine_dining', 'french_restaurant', 'italian_restaurant', 'rooftop_restaurant'];
  const cuisineBonus = restaurant.cuisine_types.some(c => romanticCuisines.includes(c)) ? 5 : 0;
  
  // Calculate final score (85-99 range)
  let dateScore = baseScore + priceBonus + cuisineBonus;
  dateScore = Math.max(85, Math.min(99, dateScore)); // Clamp between 85-99
  
  restaurant.date_night_score = dateScore;
  
  console.log(`[${index + 1}] ${restaurant.name}: ${restaurant.rating}★ | Date Score: ${dateScore}`);
});

// Save updated data
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(restaurants, null, 2));

console.log(`\n✅ Fixed ${restaurants.length} restaurants`);
console.log(`📁 Saved to: ${OUTPUT_PATH}\n`);

