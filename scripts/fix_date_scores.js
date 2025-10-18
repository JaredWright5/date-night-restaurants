import fs from 'fs';
import path from 'path';

/**
 * Fix date scores to be more realistic and varied
 * Based on restaurant characteristics like rating, price level, cuisine, etc.
 */

// Read the JSON file
const jsonPath = path.join(process.cwd(), 'la_date_night_restaurants_real.json');
const restaurants = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`📊 Processing ${restaurants.length} restaurants...`);

// Function to calculate realistic date score based on restaurant characteristics
function calculateDateScore(restaurant) {
  let score = 50; // Base score
  
  // Rating factor (0-20 points)
  if (restaurant.rating >= 4.5) score += 20;
  else if (restaurant.rating >= 4.0) score += 15;
  else if (restaurant.rating >= 3.5) score += 10;
  else if (restaurant.rating >= 3.0) score += 5;
  
  // Price level factor (0-15 points) - higher price = more romantic
  if (restaurant.price_level === 4) score += 15; // Very expensive
  else if (restaurant.price_level === 3) score += 12; // Expensive
  else if (restaurant.price_level === 2) score += 8; // Moderate
  else if (restaurant.price_level === 1) score += 4; // Inexpensive
  
  // Cuisine type factor (0-10 points)
  const romanticCuisines = ['italian', 'french', 'japanese', 'mediterranean', 'steakhouse', 'seafood'];
  const cuisineTypes = restaurant.cuisine_types || [];
  const hasRomanticCuisine = cuisineTypes.some(cuisine => 
    romanticCuisines.some(romantic => cuisine.toLowerCase().includes(romantic))
  );
  if (hasRomanticCuisine) score += 10;
  
  // Restaurant name factor (0-5 points) - romantic sounding names
  const romanticKeywords = ['rose', 'love', 'heart', 'romance', 'intimate', 'cozy', 'charming'];
  const nameLower = restaurant.name.toLowerCase();
  const hasRomanticName = romanticKeywords.some(keyword => nameLower.includes(keyword));
  if (hasRomanticName) score += 5;
  
  // Location factor (0-10 points) - certain areas are more romantic
  const romanticAreas = ['beverly hills', 'malibu', 'santa monica', 'venice', 'manhattan beach'];
  const addressLower = restaurant.address.toLowerCase();
  const hasRomanticLocation = romanticAreas.some(area => addressLower.includes(area));
  if (hasRomanticLocation) score += 10;
  
  // Add some randomness to make it more realistic (0-5 points)
  score += Math.floor(Math.random() * 6);
  
  // Ensure score is between 60-95 (realistic range)
  score = Math.max(60, Math.min(95, score));
  
  return score;
}

// Update date scores for all restaurants
let updatedCount = 0;
const updatedRestaurants = restaurants.map(restaurant => {
  const newScore = calculateDateScore(restaurant);
  if (restaurant.date_night_score !== newScore) {
    updatedCount++;
    console.log(`📊 ${restaurant.name}: ${restaurant.date_night_score} → ${newScore}`);
  }
  
  return {
    ...restaurant,
    date_night_score: newScore
  };
});

// Write the updated data back to the JSON file
fs.writeFileSync(jsonPath, JSON.stringify(updatedRestaurants, null, 2));

console.log(`✅ Successfully updated ${updatedCount} restaurants with realistic date scores`);
console.log('🎉 All restaurants now have varied, realistic date scores!');

// Show the new distribution
const scoreDistribution = updatedRestaurants.reduce((acc, restaurant) => {
  const score = restaurant.date_night_score;
  acc[score] = (acc[score] || 0) + 1;
  return acc;
}, {});

console.log('\n📊 New Date Score Distribution:');
Object.entries(scoreDistribution)
  .sort(([a], [b]) => parseInt(a) - parseInt(b))
  .forEach(([score, count]) => {
    console.log(`   Score ${score}: ${count} restaurants`);
  });
