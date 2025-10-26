import { readFileSync } from 'fs';
const laRestaurants = JSON.parse(readFileSync('./la_date_night_restaurants_real.json', 'utf-8'));

console.log('Total restaurants in JSON:', laRestaurants.length);

const veniceInJSON = laRestaurants.filter(r => r.neighborhood === 'Venice');
console.log('Venice restaurants in JSON:', veniceInJSON.length);

// Simulate the processing
const processed = laRestaurants.map((restaurant, index) => ({
  id: `restaurant-${index + 1}`,
  name: restaurant.name,
  neighborhood: restaurant.neighborhood || 'fallback',
}));

const veniceProcessed = processed.filter(r => r.neighborhood === 'Venice');
console.log('Venice restaurants after processing:', veniceProcessed.length);

if (veniceProcessed.length > 0) {
  console.log('First Venice restaurant:', veniceProcessed[0].name);
} else {
  console.log('No Venice restaurants found after processing!');
  console.log('Checking first few restaurants:');
  processed.slice(0, 5).forEach(r => {
    console.log(`  - ${r.name}: ${r.neighborhood}`);
  });
}

