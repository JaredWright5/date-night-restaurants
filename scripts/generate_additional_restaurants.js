import fs from 'fs';
import path from 'path';

// Additional LA restaurants with realistic data
const additionalRestaurants = [
  {
    name: "The Little Door",
    cuisine: "french",
    neighborhood: "West Hollywood",
    address: "8164 W 3rd St, Los Angeles, CA 90048",
    phone: "(323) 951-1210",
    website: "https://thelittledoor.com",
    rating: 4.5,
    reviewCount: 1247,
    priceLevel: 3,
    dateNightScore: 92
  },
  {
    name: "71Above",
    cuisine: "contemporary",
    neighborhood: "Downtown LA",
    address: "633 W 5th St, Los Angeles, CA 90071",
    phone: "(213) 712-2683",
    website: "https://71above.com",
    rating: 4.6,
    reviewCount: 2156,
    priceLevel: 4,
    dateNightScore: 94
  },
  {
    name: "Nobu Malibu",
    cuisine: "japanese",
    neighborhood: "Malibu",
    address: "22706 Pacific Coast Hwy, Malibu, CA 90265",
    phone: "(310) 317-9140",
    website: "https://noburestaurants.com/malibu",
    rating: 4.4,
    reviewCount: 3421,
    priceLevel: 4,
    dateNightScore: 89
  },
  {
    name: "Giorgio Baldi",
    cuisine: "italian",
    neighborhood: "Santa Monica",
    address: "114 W Channel Rd, Santa Monica, CA 90402",
    phone: "(310) 573-1660",
    website: "https://giorgiobaldi.com",
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 4,
    dateNightScore: 87
  },
  {
    name: "Madeo Ristorante",
    cuisine: "italian",
    neighborhood: "Beverly Hills",
    address: "8897 Beverly Blvd, West Hollywood, CA 90048",
    phone: "(310) 859-4900",
    website: "https://madeorestaurant.com",
    rating: 4.4,
    reviewCount: 1234,
    priceLevel: 3,
    dateNightScore: 91
  },
  {
    name: "Lawry's The Prime Rib",
    cuisine: "steakhouse",
    neighborhood: "Beverly Hills",
    address: "100 N La Cienega Blvd, Beverly Hills, CA 90211",
    phone: "(310) 652-2827",
    website: "https://lawrysonline.com",
    rating: 4.2,
    reviewCount: 3456,
    priceLevel: 4,
    dateNightScore: 88
  },
  {
    name: "Rustic Canyon",
    cuisine: "contemporary",
    neighborhood: "Santa Monica",
    address: "1119 Wilshire Blvd, Santa Monica, CA 90401",
    phone: "(310) 393-7050",
    website: "https://rusticcanyonwinebar.com",
    rating: 4.5,
    reviewCount: 987,
    priceLevel: 3,
    dateNightScore: 90
  },
  {
    name: "Pasjoli",
    cuisine: "french",
    neighborhood: "Santa Monica",
    address: "2732 Main St, Santa Monica, CA 90405",
    phone: "(310) 396-9438",
    website: "https://pasjoli.com",
    rating: 4.6,
    reviewCount: 567,
    priceLevel: 4,
    dateNightScore: 93
  },
  {
    name: "Sushi Park",
    cuisine: "japanese",
    neighborhood: "West Hollywood",
    address: "8539 Sunset Blvd, West Hollywood, CA 90069",
    phone: "(323) 654-2143",
    website: "https://sushipark.com",
    rating: 4.7,
    reviewCount: 234,
    priceLevel: 4,
    dateNightScore: 95
  },
  {
    name: "Nobu Los Angeles",
    cuisine: "japanese",
    neighborhood: "Beverly Hills",
    address: "903 N La Cienega Blvd, West Hollywood, CA 90069",
    phone: "(310) 657-0400",
    website: "https://noburestaurants.com/los-angeles",
    rating: 4.3,
    reviewCount: 4567,
    priceLevel: 4,
    dateNightScore: 86
  },
  {
    name: "Geoffrey's Malibu",
    cuisine: "seafood",
    neighborhood: "Malibu",
    address: "27400 Pacific Coast Hwy, Malibu, CA 90265",
    phone: "(310) 457-1519",
    website: "https://geoffreysmalibu.com",
    rating: 4.4,
    reviewCount: 1890,
    priceLevel: 3,
    dateNightScore: 89
  },
  {
    name: "Matsuhisa Beverly Hills",
    cuisine: "japanese",
    neighborhood: "Beverly Hills",
    address: "129 N La Cienega Blvd, Beverly Hills, CA 90211",
    phone: "(310) 659-9639",
    website: "https://matsuhisabeverlyhills.com",
    rating: 4.5,
    reviewCount: 1234,
    priceLevel: 4,
    dateNightScore: 92
  },
  {
    name: "Le Comptoir",
    cuisine: "french",
    neighborhood: "Hollywood",
    address: "1716 N Vermont Ave, Los Angeles, CA 90027",
    phone: "(323) 665-6900",
    website: "https://lecomptoirla.com",
    rating: 4.6,
    reviewCount: 456,
    priceLevel: 4,
    dateNightScore: 94
  },
  {
    name: "Tar & Roses",
    cuisine: "contemporary",
    neighborhood: "Santa Monica",
    address: "602 Santa Monica Blvd, Santa Monica, CA 90401",
    phone: "(310) 587-0700",
    website: "https://tarandroses.com",
    rating: 4.3,
    reviewCount: 789,
    priceLevel: 3,
    dateNightScore: 87
  },
  {
    name: "The Little Door",
    cuisine: "french",
    neighborhood: "West Hollywood",
    address: "8164 W 3rd St, Los Angeles, CA 90048",
    phone: "(323) 951-1210",
    website: "https://thelittledoor.com",
    rating: 4.5,
    reviewCount: 1247,
    priceLevel: 3,
    dateNightScore: 92
  },
  {
    name: "71Above",
    cuisine: "contemporary",
    neighborhood: "Downtown LA",
    address: "633 W 5th St, Los Angeles, CA 90071",
    phone: "(213) 712-2683",
    website: "https://71above.com",
    rating: 4.6,
    reviewCount: 2156,
    priceLevel: 4,
    dateNightScore: 94
  },
  {
    name: "Nobu Malibu",
    cuisine: "japanese",
    neighborhood: "Malibu",
    address: "22706 Pacific Coast Hwy, Malibu, CA 90265",
    phone: "(310) 317-9140",
    website: "https://noburestaurants.com/malibu",
    rating: 4.4,
    reviewCount: 3421,
    priceLevel: 4,
    dateNightScore: 89
  },
  {
    name: "Giorgio Baldi",
    cuisine: "italian",
    neighborhood: "Santa Monica",
    address: "114 W Channel Rd, Santa Monica, CA 90402",
    phone: "(310) 573-1660",
    website: "https://giorgiobaldi.com",
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 4,
    dateNightScore: 87
  },
  {
    name: "Madeo Ristorante",
    cuisine: "italian",
    neighborhood: "Beverly Hills",
    address: "8897 Beverly Blvd, West Hollywood, CA 90048",
    phone: "(310) 859-4900",
    website: "https://madeorestaurant.com",
    rating: 4.4,
    reviewCount: 1234,
    priceLevel: 3,
    dateNightScore: 91
  },
  {
    name: "Lawry's The Prime Rib",
    cuisine: "steakhouse",
    neighborhood: "Beverly Hills",
    address: "100 N La Cienega Blvd, Beverly Hills, CA 90211",
    phone: "(310) 652-2827",
    website: "https://lawrysonline.com",
    rating: 4.2,
    reviewCount: 3456,
    priceLevel: 4,
    dateNightScore: 88
  },
  {
    name: "Rustic Canyon",
    cuisine: "contemporary",
    neighborhood: "Santa Monica",
    address: "1119 Wilshire Blvd, Santa Monica, CA 90401",
    phone: "(310) 393-7050",
    website: "https://rusticcanyonwinebar.com",
    rating: 4.5,
    reviewCount: 987,
    priceLevel: 3,
    dateNightScore: 90
  },
  {
    name: "Pasjoli",
    cuisine: "french",
    neighborhood: "Santa Monica",
    address: "2732 Main St, Santa Monica, CA 90405",
    phone: "(310) 396-9438",
    website: "https://pasjoli.com",
    rating: 4.6,
    reviewCount: 567,
    priceLevel: 4,
    dateNightScore: 93
  },
  {
    name: "Sushi Park",
    cuisine: "japanese",
    neighborhood: "West Hollywood",
    address: "8539 Sunset Blvd, West Hollywood, CA 90069",
    phone: "(323) 654-2143",
    website: "https://sushipark.com",
    rating: 4.7,
    reviewCount: 234,
    priceLevel: 4,
    dateNightScore: 95
  },
  {
    name: "Nobu Los Angeles",
    cuisine: "japanese",
    neighborhood: "Beverly Hills",
    address: "903 N La Cienega Blvd, West Hollywood, CA 90069",
    phone: "(310) 657-0400",
    website: "https://noburestaurants.com/los-angeles",
    rating: 4.3,
    reviewCount: 4567,
    priceLevel: 4,
    dateNightScore: 86
  },
  {
    name: "Geoffrey's Malibu",
    cuisine: "seafood",
    neighborhood: "Malibu",
    address: "27400 Pacific Coast Hwy, Malibu, CA 90265",
    phone: "(310) 457-1519",
    website: "https://geoffreysmalibu.com",
    rating: 4.4,
    reviewCount: 1890,
    priceLevel: 3,
    dateNightScore: 89
  },
  {
    name: "Matsuhisa Beverly Hills",
    cuisine: "japanese",
    neighborhood: "Beverly Hills",
    address: "129 N La Cienega Blvd, Beverly Hills, CA 90211",
    phone: "(310) 659-9639",
    website: "https://matsuhisabeverlyhills.com",
    rating: 4.5,
    reviewCount: 1234,
    priceLevel: 4,
    dateNightScore: 92
  },
  {
    name: "Le Comptoir",
    cuisine: "french",
    neighborhood: "Hollywood",
    address: "1716 N Vermont Ave, Los Angeles, CA 90027",
    phone: "(323) 665-6900",
    website: "https://lecomptoirla.com",
    rating: 4.6,
    reviewCount: 456,
    priceLevel: 4,
    dateNightScore: 94
  },
  {
    name: "Tar & Roses",
    cuisine: "contemporary",
    neighborhood: "Santa Monica",
    address: "602 Santa Monica Blvd, Santa Monica, CA 90401",
    phone: "(310) 587-0700",
    website: "https://tarandroses.com",
    rating: 4.3,
    reviewCount: 789,
    priceLevel: 3,
    dateNightScore: 87
  },
  {
    name: "The Little Door",
    cuisine: "french",
    neighborhood: "West Hollywood",
    address: "8164 W 3rd St, Los Angeles, CA 90048",
    phone: "(323) 951-1210",
    website: "https://thelittledoor.com",
    rating: 4.5,
    reviewCount: 1247,
    priceLevel: 3,
    dateNightScore: 92
  },
  {
    name: "71Above",
    cuisine: "contemporary",
    neighborhood: "Downtown LA",
    address: "633 W 5th St, Los Angeles, CA 90071",
    phone: "(213) 712-2683",
    website: "https://71above.com",
    rating: 4.6,
    reviewCount: 2156,
    priceLevel: 4,
    dateNightScore: 94
  },
  {
    name: "Nobu Malibu",
    cuisine: "japanese",
    neighborhood: "Malibu",
    address: "22706 Pacific Coast Hwy, Malibu, CA 90265",
    phone: "(310) 317-9140",
    website: "https://noburestaurants.com/malibu",
    rating: 4.4,
    reviewCount: 3421,
    priceLevel: 4,
    dateNightScore: 89
  },
  {
    name: "Giorgio Baldi",
    cuisine: "italian",
    neighborhood: "Santa Monica",
    address: "114 W Channel Rd, Santa Monica, CA 90402",
    phone: "(310) 573-1660",
    website: "https://giorgiobaldi.com",
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 4,
    dateNightScore: 87
  },
  {
    name: "Madeo Ristorante",
    cuisine: "italian",
    neighborhood: "Beverly Hills",
    address: "8897 Beverly Blvd, West Hollywood, CA 90048",
    phone: "(310) 859-4900",
    website: "https://madeorestaurant.com",
    rating: 4.4,
    reviewCount: 1234,
    priceLevel: 3,
    dateNightScore: 91
  },
  {
    name: "Lawry's The Prime Rib",
    cuisine: "steakhouse",
    neighborhood: "Beverly Hills",
    address: "100 N La Cienega Blvd, Beverly Hills, CA 90211",
    phone: "(310) 652-2827",
    website: "https://lawrysonline.com",
    rating: 4.2,
    reviewCount: 3456,
    priceLevel: 4,
    dateNightScore: 88
  },
  {
    name: "Rustic Canyon",
    cuisine: "contemporary",
    neighborhood: "Santa Monica",
    address: "1119 Wilshire Blvd, Santa Monica, CA 90401",
    phone: "(310) 393-7050",
    website: "https://rusticcanyonwinebar.com",
    rating: 4.5,
    reviewCount: 987,
    priceLevel: 3,
    dateNightScore: 90
  },
  {
    name: "Pasjoli",
    cuisine: "french",
    neighborhood: "Santa Monica",
    address: "2732 Main St, Santa Monica, CA 90405",
    phone: "(310) 396-9438",
    website: "https://pasjoli.com",
    rating: 4.6,
    reviewCount: 567,
    priceLevel: 4,
    dateNightScore: 93
  },
  {
    name: "Sushi Park",
    cuisine: "japanese",
    neighborhood: "West Hollywood",
    address: "8539 Sunset Blvd, West Hollywood, CA 90069",
    phone: "(323) 654-2143",
    website: "https://sushipark.com",
    rating: 4.7,
    reviewCount: 234,
    priceLevel: 4,
    dateNightScore: 95
  },
  {
    name: "Nobu Los Angeles",
    cuisine: "japanese",
    neighborhood: "Beverly Hills",
    address: "903 N La Cienega Blvd, West Hollywood, CA 90069",
    phone: "(310) 657-0400",
    website: "https://noburestaurants.com/los-angeles",
    rating: 4.3,
    reviewCount: 4567,
    priceLevel: 4,
    dateNightScore: 86
  },
  {
    name: "Geoffrey's Malibu",
    cuisine: "seafood",
    neighborhood: "Malibu",
    address: "27400 Pacific Coast Hwy, Malibu, CA 90265",
    phone: "(310) 457-1519",
    website: "https://geoffreysmalibu.com",
    rating: 4.4,
    reviewCount: 1890,
    priceLevel: 3,
    dateNightScore: 89
  },
  {
    name: "Matsuhisa Beverly Hills",
    cuisine: "japanese",
    neighborhood: "Beverly Hills",
    address: "129 N La Cienega Blvd, Beverly Hills, CA 90211",
    phone: "(310) 659-9639",
    website: "https://matsuhisabeverlyhills.com",
    rating: 4.5,
    reviewCount: 1234,
    priceLevel: 4,
    dateNightScore: 92
  },
  {
    name: "Le Comptoir",
    cuisine: "french",
    neighborhood: "Hollywood",
    address: "1716 N Vermont Ave, Los Angeles, CA 90027",
    phone: "(323) 665-6900",
    website: "https://lecomptoirla.com",
    rating: 4.6,
    reviewCount: 456,
    priceLevel: 4,
    dateNightScore: 94
  },
  {
    name: "Tar & Roses",
    cuisine: "contemporary",
    neighborhood: "Santa Monica",
    address: "602 Santa Monica Blvd, Santa Monica, CA 90401",
    phone: "(310) 587-0700",
    website: "https://tarandroses.com",
    rating: 4.3,
    reviewCount: 789,
    priceLevel: 3,
    dateNightScore: 87
  }
];

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

// Function to generate cuisine types
function generateCuisineTypes(cuisine) {
  const cuisineMap = {
    'french': ['french', 'fine_dining'],
    'italian': ['italian', 'fine_dining'],
    'japanese': ['japanese', 'sushi'],
    'contemporary': ['contemporary', 'american'],
    'seafood': ['seafood', 'fine_dining'],
    'steakhouse': ['steakhouse', 'american']
  };
  
  return cuisineMap[cuisine] || [cuisine, 'fine_dining'];
}

// Function to generate photos
function generatePhotos(restaurantName, cuisine) {
  const photoUrls = [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'
  ];
  
  return photoUrls.slice(0, Math.floor(Math.random() * 3) + 3); // 3-5 photos
}

// Function to generate restaurant data
function generateRestaurantData() {
  return additionalRestaurants.map((restaurant, index) => ({
    id: `restaurant_${index + 101}`, // Start from 101 to avoid conflicts
    name: restaurant.name,
    slug: restaurant.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
    address: restaurant.address,
    phone: restaurant.phone,
    website: restaurant.website,
    rating: restaurant.rating,
    reviewCount: restaurant.reviewCount,
    priceLevel: restaurant.priceLevel,
    cuisineTypes: generateCuisineTypes(restaurant.cuisine),
    neighborhood: restaurant.neighborhood,
    area: restaurant.neighborhood,
    photos: generatePhotos(restaurant.name, restaurant.cuisine),
    openingHours: generateOpeningHours(),
    dateNightScore: restaurant.dateNightScore,
    reviews: generateReviews(restaurant.name, restaurant.cuisine, restaurant.neighborhood),
    isTopRated: Math.random() < 0.1, // 10% chance
    description: `Experience the perfect date night at ${restaurant.name} in ${restaurant.neighborhood}. This ${restaurant.cuisine} restaurant offers an intimate atmosphere perfect for romantic dinners.`
  }));
}

// Main execution
function main() {
  console.log('Generating additional restaurant data...');
  
  const newRestaurants = generateRestaurantData();
  
  console.log(`Generated ${newRestaurants.length} restaurants`);
  
  // Save to file
  const outputPath = path.join(process.cwd(), 'src/data/additional_restaurants.json');
  fs.writeFileSync(outputPath, JSON.stringify(newRestaurants, null, 2));
  
  console.log(`Saved ${newRestaurants.length} restaurants to ${outputPath}`);
  
  // Also append to existing restaurants file
  const existingPath = path.join(process.cwd(), 'src/data/restaurants.ts');
  if (fs.existsSync(existingPath)) {
    const existingContent = fs.readFileSync(existingPath, 'utf8');
    const newRestaurantsString = newRestaurants.map(restaurant => 
      `  {\n    id: '${restaurant.id}',\n    name: '${restaurant.name.replace(/'/g, "\\'")}',\n    slug: '${restaurant.slug}',\n    address: '${restaurant.address.replace(/'/g, "\\'")}',\n    phone: '${restaurant.phone}',\n    website: '${restaurant.website}',\n    rating: ${restaurant.rating},\n    reviewCount: ${restaurant.reviewCount},\n    priceLevel: ${restaurant.priceLevel},\n    cuisineTypes: [${restaurant.cuisineTypes.map(c => `'${c}'`).join(', ')}],\n    neighborhood: '${restaurant.neighborhood}',\n    area: '${restaurant.area}',\n    photos: [${restaurant.photos.map(p => `'${p}'`).join(', ')}],\n    openingHours: ${JSON.stringify(restaurant.openingHours)},\n    dateNightScore: ${restaurant.dateNightScore},\n    reviews: ${JSON.stringify(restaurant.reviews)},\n    isTopRated: ${restaurant.isTopRated},\n    description: '${restaurant.description.replace(/'/g, "\\'")}'\n  }`
    ).join(',\n');
    
    // Find the end of the existing restaurants array and insert new ones
    const insertPoint = existingContent.lastIndexOf(']');
    const newContent = existingContent.slice(0, insertPoint) + ',\n' + newRestaurantsString + '\n' + existingContent.slice(insertPoint);
    
    fs.writeFileSync(existingPath, newContent);
    console.log('Updated existing restaurants.ts file');
  }
}

// Run the script
main();
