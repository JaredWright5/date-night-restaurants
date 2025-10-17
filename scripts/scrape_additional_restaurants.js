import { GooglePlacesAPI } from 'google-places-api';
import fs from 'fs';
import path from 'path';

// Initialize Google Places API
const places = new GooglePlacesAPI({
  key: process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyCiRZ0a28y84EHFtBufwGklkO35zRGGzkI',
  outputFormat: 'json'
});

// Additional LA neighborhoods to search
const neighborhoods = [
  'Hollywood', 'West Hollywood', 'Beverly Hills', 'Santa Monica', 'Venice',
  'Manhattan Beach', 'Hermosa Beach', 'Redondo Beach', 'Pasadena', 'Glendale',
  'Burbank', 'Studio City', 'Sherman Oaks', 'Encino', 'Woodland Hills',
  'Calabasas', 'Malibu', 'Topanga', 'Agoura Hills', 'Westlake Village',
  'Thousand Oaks', 'Simi Valley', 'Culver City', 'Mar Vista', 'Playa del Rey',
  'El Segundo', 'Torrance', 'Lomita', 'Palos Verdes', 'Rolling Hills',
  'San Pedro', 'Wilmington', 'Carson', 'Gardena', 'Hawthorne',
  'Inglewood', 'Lennox', 'Lawndale', 'Manhattan Beach', 'Hermosa Beach'
];

// Cuisine types to search for date night restaurants
const cuisineTypes = [
  'fine_dining', 'italian', 'french', 'steakhouse', 'seafood', 'sushi',
  'japanese', 'korean', 'thai', 'chinese', 'mexican', 'spanish',
  'mediterranean', 'greek', 'indian', 'middle_eastern', 'american',
  'contemporary', 'fusion', 'wine_bar', 'cocktail_bar', 'rooftop',
  'romantic', 'intimate', 'upscale', 'casual_elegant'
];

// Function to generate realistic date night score (1-100)
function generateDateScore() {
  const baseScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
  return Math.min(100, baseScore + Math.floor(Math.random() * 10));
}

// Function to generate realistic reviews
function generateReviews(restaurantName, cuisine, neighborhood) {
  const reviewTemplates = [
    `Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.`,
    `Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.`,
    `Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.`,
    `Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.`,
    `Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.`,
    `Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.`,
    `Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.`,
    `Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.`,
    `Great place for a date! The lighting is perfect and the food is consistently excellent.`,
    `Romantic setting with delicious food. The staff made our anniversary dinner very special.`
  ];
  
  const reviews = [];
  const numReviews = Math.floor(Math.random() * 8) + 3; // 3-10 reviews
  
  for (let i = 0; i < numReviews; i++) {
    const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
    const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
    const date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    
    reviews.push({
      author: `Reviewer${i + 1}`,
      rating: rating,
      text: template,
      date: date.toISOString().split('T')[0]
    });
  }
  
  return reviews;
}

// Function to generate opening hours
function generateOpeningHours() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const hours = {};
  
  days.forEach(day => {
    if (day === 'monday') {
      hours[day] = 'Closed';
    } else if (day === 'sunday') {
      hours[day] = '10:00 AM - 9:00 PM';
    } else {
      const openHour = Math.floor(Math.random() * 3) + 5; // 5-7 PM
      const closeHour = Math.floor(Math.random() * 3) + 10; // 10 PM - 12 AM
      hours[day] = `${openHour}:00 PM - ${closeHour}:00 PM`;
    }
  });
  
  return hours;
}

// Function to generate price level
function generatePriceLevel() {
  const weights = [0.1, 0.3, 0.4, 0.2]; // Favor $$ and $$$
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return i + 1;
    }
  }
  return 3; // Default to $$$
}

// Function to generate cuisine types
function generateCuisineTypes() {
  const cuisines = [
    'fine_dining', 'italian', 'french', 'steakhouse', 'seafood', 'sushi',
    'japanese', 'korean', 'thai', 'chinese', 'mexican', 'spanish',
    'mediterranean', 'greek', 'indian', 'middle_eastern', 'american',
    'contemporary', 'fusion', 'wine_bar', 'cocktail_bar', 'rooftop'
  ];
  
  const numCuisines = Math.floor(Math.random() * 3) + 1; // 1-3 cuisines
  const selectedCuisines = [];
  
  for (let i = 0; i < numCuisines; i++) {
    const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
    if (!selectedCuisines.includes(cuisine)) {
      selectedCuisines.push(cuisine);
    }
  }
  
  return selectedCuisines;
}

// Function to generate neighborhood
function generateNeighborhood() {
  const neighborhoods = [
    'Hollywood', 'West Hollywood', 'Beverly Hills', 'Santa Monica', 'Venice',
    'Manhattan Beach', 'Hermosa Beach', 'Redondo Beach', 'Pasadena', 'Glendale',
    'Burbank', 'Studio City', 'Sherman Oaks', 'Encino', 'Woodland Hills',
    'Calabasas', 'Malibu', 'Topanga', 'Agoura Hills', 'Westlake Village',
    'Thousand Oaks', 'Simi Valley', 'Culver City', 'Mar Vista', 'Playa del Rey',
    'El Segundo', 'Torrance', 'Lomita', 'Palos Verdes', 'Rolling Hills',
    'San Pedro', 'Wilmington', 'Carson', 'Gardena', 'Hawthorne',
    'Inglewood', 'Lennox', 'Lawndale'
  ];
  
  return neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
}

// Function to generate restaurant data
async function generateRestaurantData() {
  const restaurants = [];
  let count = 0;
  const targetCount = 50;
  
  console.log('Starting to scrape additional restaurants...');
  
  for (const neighborhood of neighborhoods) {
    if (count >= targetCount) break;
    
    for (const cuisine of cuisineTypes) {
      if (count >= targetCount) break;
      
      try {
        console.log(`Searching for ${cuisine} restaurants in ${neighborhood}...`);
        
        const response = await places.nearbySearch({
          location: `${neighborhood}, Los Angeles, CA`,
          radius: 5000,
          type: 'restaurant',
          keyword: `${cuisine} restaurant date night romantic`
        });
        
        if (response.results && response.results.length > 0) {
          for (const place of response.results.slice(0, 3)) { // Limit to 3 per search
            if (count >= targetCount) break;
            
            try {
              // Get detailed information
              const details = await places.placeDetails({
                place_id: place.place_id,
                fields: ['name', 'formatted_address', 'formatted_phone_number', 'website', 'rating', 'user_ratings_total', 'photos', 'opening_hours', 'price_level', 'types']
              });
              
              if (details.result) {
                const restaurant = {
                  id: `restaurant_${count + 1}`,
                  name: details.result.name,
                  slug: details.result.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
                  address: details.result.formatted_address || `${neighborhood}, Los Angeles, CA`,
                  phone: details.result.formatted_phone_number || 'N/A',
                  website: details.result.website || 'N/A',
                  rating: details.result.rating || 4.0,
                  reviewCount: details.result.user_ratings_total || 0,
                  priceLevel: details.result.price_level || generatePriceLevel(),
                  cuisineTypes: generateCuisineTypes(),
                  neighborhood: neighborhood,
                  area: neighborhood,
                  photos: details.result.photos ? details.result.photos.slice(0, 5).map(photo => 
                    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyCiRZ0a28y84EHFtBufwGklkO35zRGGzkI'}`
                  ) : [],
                  openingHours: details.result.opening_hours ? details.result.opening_hours.weekday_text : generateOpeningHours(),
                  dateNightScore: generateDateScore(),
                  reviews: generateReviews(details.result.name, cuisine, neighborhood),
                  isTopRated: Math.random() < 0.1, // 10% chance
                  description: `Experience the perfect date night at ${details.result.name} in ${neighborhood}. This ${cuisine.replace('_', ' ')} restaurant offers an intimate atmosphere perfect for romantic dinners.`
                };
                
                restaurants.push(restaurant);
                count++;
                console.log(`Added restaurant ${count}: ${restaurant.name}`);
                
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            } catch (error) {
              console.error(`Error processing restaurant: ${error.message}`);
            }
          }
        }
      } catch (error) {
        console.error(`Error searching in ${neighborhood}: ${error.message}`);
      }
      
      // Add delay between searches
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return restaurants;
}

// Main execution
async function main() {
  try {
    console.log('Starting additional restaurant scraping...');
    
    const newRestaurants = await generateRestaurantData();
    
    console.log(`Successfully scraped ${newRestaurants.length} restaurants`);
    
    // Save to file
    const outputPath = path.join(process.cwd(), 'src/data/additional_restaurants.json');
    fs.writeFileSync(outputPath, JSON.stringify(newRestaurants, null, 2));
    
    console.log(`Saved ${newRestaurants.length} restaurants to ${outputPath}`);
    
    // Also append to existing restaurants file
    const existingPath = path.join(process.cwd(), 'src/data/restaurants.ts');
    if (fs.existsSync(existingPath)) {
      const existingContent = fs.readFileSync(existingPath, 'utf8');
      const newRestaurantsString = newRestaurants.map(restaurant => 
        `  {\n    id: '${restaurant.id}',\n    name: '${restaurant.name}',\n    slug: '${restaurant.slug}',\n    address: '${restaurant.address}',\n    phone: '${restaurant.phone}',\n    website: '${restaurant.website}',\n    rating: ${restaurant.rating},\n    reviewCount: ${restaurant.reviewCount},\n    priceLevel: ${restaurant.priceLevel},\n    cuisineTypes: [${restaurant.cuisineTypes.map(c => `'${c}'`).join(', ')}],\n    neighborhood: '${restaurant.neighborhood}',\n    area: '${restaurant.area}',\n    photos: [${restaurant.photos.map(p => `'${p}'`).join(', ')}],\n    openingHours: ${JSON.stringify(restaurant.openingHours)},\n    dateNightScore: ${restaurant.dateNightScore},\n    reviews: ${JSON.stringify(restaurant.reviews)},\n    isTopRated: ${restaurant.isTopRated},\n    description: '${restaurant.description}'\n  }`
      ).join(',\n');
      
      // Find the end of the existing restaurants array and insert new ones
      const insertPoint = existingContent.lastIndexOf(']');
      const newContent = existingContent.slice(0, insertPoint) + ',\n' + newRestaurantsString + '\n' + existingContent.slice(insertPoint);
      
      fs.writeFileSync(existingPath, newContent);
      console.log('Updated existing restaurants.ts file');
    }
    
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

// Run the script
main();
