import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the calculateDateScore function (we'll need to adapt this for Node.js)
function calculateDateScore(restaurant) {
  const {
    name,
    cuisine_types,
    price_level,
    rating,
    reviews,
    photos,
    area,
    neighborhood,
    website,
    opening_hours
  } = restaurant;

  let score = 0;

  // 30%: Ambiance & Vibe Signals
  const ambianceScore = calculateAmbianceScore(restaurant);
  score += ambianceScore * 0.30;

  // 20%: Social Buzz & Sentiment (placeholder - will be updated with real data)
  const socialScore = calculateSocialScore(restaurant);
  score += socialScore * 0.20;

  // 15%: Occasion Fit
  const occasionScore = calculateOccasionScore(restaurant);
  score += occasionScore * 0.15;

  // 15%: Quality and Popularity (Google/Yelp rating)
  const qualityScore = calculateQualityScore(restaurant);
  score += qualityScore * 0.15;

  // 10%: Freshness & Momentum
  const freshnessScore = calculateFreshnessScore(restaurant);
  score += freshnessScore * 0.10;

  // 10%: Practical Date Night Factors
  const practicalScore = calculatePracticalScore(restaurant);
  score += practicalScore * 0.10;

  return Math.round(score);
}

// Helper functions for each scoring component
function calculateAmbianceScore(restaurant) {
  let score = 50; // Base score
  
  // Cuisine type ambiance factors
  const romanticCuisines = ['italian', 'french', 'japanese', 'mediterranean'];
  const cuisineScore = restaurant.cuisine_types.some(cuisine => 
    romanticCuisines.includes(cuisine.toLowerCase())
  ) ? 20 : 10;
  score += cuisineScore;

  // Price level ambiance (higher price = more romantic setting)
  score += restaurant.price_level * 5;

  // Neighborhood ambiance
  const romanticNeighborhoods = ['Beverly Hills', 'West Hollywood', 'Malibu', 'Santa Monica'];
  if (romanticNeighborhoods.includes(restaurant.neighborhood)) {
    score += 15;
  }

  // Area ambiance
  if (restaurant.area === 'Beverly Hills' || restaurant.area === 'West Hollywood') {
    score += 10;
  }

  return Math.min(score, 100);
}

function calculateSocialScore(restaurant) {
  // Placeholder - will be updated with real social media data
  // For now, use rating as proxy for social buzz
  return Math.min(restaurant.rating * 20, 100);
}

function calculateOccasionScore(restaurant) {
  let score = 50; // Base score
  
  // Higher price restaurants are more likely to be used for special occasions
  score += restaurant.price_level * 10;
  
  // Fine dining cuisines are more occasion-appropriate
  const specialOccasionCuisines = ['french', 'italian', 'japanese', 'steakhouse'];
  if (restaurant.cuisine_types.some(cuisine => 
    specialOccasionCuisines.includes(cuisine.toLowerCase())
  )) {
    score += 20;
  }

  // Upscale neighborhoods
  if (['Beverly Hills', 'West Hollywood', 'Malibu'].includes(restaurant.neighborhood)) {
    score += 15;
  }

  return Math.min(score, 100);
}

function calculateQualityScore(restaurant) {
  // Based on Google rating and review volume
  const ratingScore = restaurant.rating * 20;
  const reviewVolumeScore = Math.min(restaurant.reviews.length * 2, 20);
  
  return Math.min(ratingScore + reviewVolumeScore, 100);
}

function calculateFreshnessScore(restaurant) {
  // Placeholder - will be updated with real data about recent mentions
  // For now, use a combination of rating and price level as proxy
  return Math.min((restaurant.rating * 15) + (restaurant.price_level * 5), 100);
}

function calculatePracticalScore(restaurant) {
  let score = 50; // Base score
  
  // Price appropriateness for date night (not too cheap, not too expensive)
  if (restaurant.price_level >= 2 && restaurant.price_level <= 4) {
    score += 20;
  } else if (restaurant.price_level === 1) {
    score += 10; // Budget-friendly but still date-worthy
  } else if (restaurant.price_level === 5) {
    score += 15; // Very expensive but special occasion worthy
  }

  // Location accessibility (good neighborhoods)
  const accessibleNeighborhoods = ['Beverly Hills', 'West Hollywood', 'Santa Monica', 'Downtown LA'];
  if (accessibleNeighborhoods.includes(restaurant.neighborhood)) {
    score += 15;
  }

  // Hours availability (restaurants open for dinner)
  if (restaurant.opening_hours && Object.keys(restaurant.opening_hours).length > 0) {
    score += 10;
  }

  // Website presence indicates professionalism
  if (restaurant.website) {
    score += 5;
  }

  return Math.min(score, 100);
}

// Read the restaurant data
const restaurantDataPath = path.join(__dirname, '..', 'la_date_night_restaurants_real.json');
const restaurantData = JSON.parse(fs.readFileSync(restaurantDataPath, 'utf8'));

console.log(`Updating Date Scores for ${restaurantData.length} restaurants...`);

// Calculate new Date Scores
let updatedCount = 0;
const scores = [];

restaurantData.forEach((restaurant, index) => {
  const newDateScore = calculateDateScore(restaurant);
  restaurant.dateNightScore = newDateScore;
  scores.push(newDateScore);
  updatedCount++;
  
  if (index % 10 === 0) {
    console.log(`Processed ${index + 1}/${restaurantData.length} restaurants...`);
  }
});

// Calculate statistics
const sortedScores = scores.sort((a, b) => b - a);
const top10Percent = Math.ceil(restaurantData.length * 0.1);
const top10PercentThreshold = sortedScores[top10Percent - 1];

console.log(`\nDate Score Statistics:`);
console.log(`Average Score: ${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}`);
console.log(`Highest Score: ${Math.max(...scores)}`);
console.log(`Lowest Score: ${Math.min(...scores)}`);
console.log(`Top 10% Threshold: ${top10PercentThreshold}`);

// Add top 10% badge to qualifying restaurants
let badgeCount = 0;
restaurantData.forEach(restaurant => {
  if (restaurant.dateNightScore >= top10PercentThreshold) {
    restaurant.isTopRated = true;
    badgeCount++;
  } else {
    restaurant.isTopRated = false;
  }
});

console.log(`Added "Top Rated" badge to ${badgeCount} restaurants`);

// Write updated data back to file
fs.writeFileSync(restaurantDataPath, JSON.stringify(restaurantData, null, 2));

console.log(`\n✅ Successfully updated Date Scores for ${updatedCount} restaurants!`);
console.log(`📊 Top 10% threshold: ${top10PercentThreshold} Date Score`);
console.log(`🏆 ${badgeCount} restaurants earned the "Top Rated" badge`);
