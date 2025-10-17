import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read both data files
const originalDataPath = path.join(__dirname, '..', 'la_date_night_restaurants.json');
const realDataPath = path.join(__dirname, '..', 'la_date_night_restaurants_real.json');

const originalData = JSON.parse(fs.readFileSync(originalDataPath, 'utf8'));
const realData = JSON.parse(fs.readFileSync(realDataPath, 'utf8'));

console.log('Merging Google Places photos with updated Date Scores...');

// Create a map of restaurants by name for quick lookup
const originalMap = new Map();
originalData.forEach(restaurant => {
  originalMap.set(restaurant.name, restaurant);
});

let photosUpdated = 0;
let scoresUpdated = 0;

// Update the real data with photos from original data
realData.forEach((restaurant, index) => {
  const originalRestaurant = originalMap.get(restaurant.name);
  
  if (originalRestaurant && originalRestaurant.photos) {
    // Check if the original has Google Places photos
    const hasGooglePhotos = originalRestaurant.photos.some(photo => 
      photo.includes('places.googleapis.com')
    );
    
    if (hasGooglePhotos) {
      restaurant.photos = originalRestaurant.photos;
      photosUpdated++;
    }
  }
  
  if ((index + 1) % 20 === 0) {
    console.log(`Processed ${index + 1}/100 restaurants...`);
  }
});

// Write the updated data back to the real data file
fs.writeFileSync(realDataPath, JSON.stringify(realData, null, 2), 'utf8');

console.log(`✅ Successfully merged data!`);
console.log(`📸 Updated photos for ${photosUpdated} restaurants with Google Places photos`);
console.log(`🎯 All restaurants retain their calculated Date Scores`);
