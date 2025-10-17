import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the restaurant data
const restaurantDataPath = path.join(__dirname, '..', 'la_date_night_restaurants_real.json');
const restaurantData = JSON.parse(fs.readFileSync(restaurantDataPath, 'utf8'));

// Read the featured data
const featuredDataPath = path.join(__dirname, '..', 'src/data/featured.ts');
let featuredContent = fs.readFileSync(featuredDataPath, 'utf8');

// Featured restaurant names to match
const featuredNames = [
  'Providence',
  'République Café Bakery & République Restaurant', 
  'Bestia',
  'Osteria Mozza'
];

console.log('Updating featured restaurants with correct Date Scores...');

// Find each featured restaurant in the main data and get their scores
featuredNames.forEach(name => {
  const restaurant = restaurantData.find(r => r.name === name);
  if (restaurant) {
    console.log(`${name}: Date Score ${restaurant.dateNightScore}, Top Rated: ${restaurant.isTopRated}`);
    
    // Update the featured.ts file
    const scoreRegex = new RegExp(`(dateNightScore: )\\d+(\\.\\d+)?(,?\\s*// ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
    featuredContent = featuredContent.replace(scoreRegex, `$1${restaurant.dateNightScore}$2$3`);
    
    // Update isTopRated if it exists
    const topRatedRegex = new RegExp(`(isTopRated: )\\w+(,?\\s*// ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
    if (topRatedRegex.test(featuredContent)) {
      featuredContent = featuredContent.replace(topRatedRegex, `$1${restaurant.isTopRated}$2$3`);
    }
  } else {
    console.log(`Restaurant not found: ${name}`);
  }
});

// Write updated featured data
fs.writeFileSync(featuredDataPath, featuredContent);

console.log('✅ Featured restaurants updated with correct Date Scores!');
