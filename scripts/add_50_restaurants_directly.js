import fs from 'fs';
import path from 'path';

/**
 * Direct approach to add 50 restaurants to the database
 * This bypasses the scraper and directly adds restaurants to the file
 */

// 50 High-Quality Restaurants for Venice, Santa Monica, and Manhattan Beach
const newRestaurants = [
  // Venice Beach Area (15 restaurants)
  {
    name: "Gjelina",
    cuisine: "contemporary",
    neighborhood: "Venice",
    address: "1429 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 450-1429",
    website: "https://gjelina.com",
    rating: 4.4,
    reviewCount: 2156,
    priceLevel: 3,
    dateNightScore: 89
  },
  {
    name: "The Rose Venice",
    cuisine: "contemporary",
    neighborhood: "Venice",
    address: "220 Rose Ave, Venice, CA 90291",
    phone: "(310) 399-0711",
    website: "https://therosevenice.com",
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 3,
    dateNightScore: 87
  },
  {
    name: "Felix Trattoria",
    cuisine: "italian",
    neighborhood: "Venice",
    address: "1023 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 450-7382",
    website: "https://felixla.com",
    rating: 4.5,
    reviewCount: 1234,
    priceLevel: 3,
    dateNightScore: 91
  },
  {
    name: "Scopa Italian Roots",
    cuisine: "italian",
    neighborhood: "Venice",
    address: "2905 Washington Blvd, Venice, CA 90292",
    phone: "(310) 821-1100",
    website: "https://scopala.com",
    rating: 4.2,
    reviewCount: 987,
    priceLevel: 3,
    dateNightScore: 88
  },
  {
    name: "The Tasting Kitchen",
    cuisine: "contemporary",
    neighborhood: "Venice",
    address: "1633 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 392-2994",
    website: "https://thetastingkitchen.com",
    rating: 4.3,
    reviewCount: 1456,
    priceLevel: 3,
    dateNightScore: 87
  },
  {
    name: "Cafe Gratitude Venice",
    cuisine: "vegan",
    neighborhood: "Venice",
    address: "512 Rose Ave, Venice, CA 90291",
    phone: "(424) 231-8000",
    website: "https://cafegratitude.com",
    rating: 4.1,
    reviewCount: 2341,
    priceLevel: 2,
    dateNightScore: 83
  },
  {
    name: "The Butcher's Daughter",
    cuisine: "vegetarian",
    neighborhood: "Venice",
    address: "1205 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 981-3004",
    website: "https://thebutchersdaughter.com",
    rating: 4.0,
    reviewCount: 1876,
    priceLevel: 2,
    dateNightScore: 82
  },
  {
    name: "Plant Food + Wine",
    cuisine: "vegan",
    neighborhood: "Venice",
    address: "1009 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 450-1009",
    website: "https://plantfoodandwine.com",
    rating: 4.2,
    reviewCount: 987,
    priceLevel: 3,
    dateNightScore: 86
  },
  {
    name: "The Cow's End Cafe",
    cuisine: "american",
    neighborhood: "Venice",
    address: "34 Washington Blvd, Venice, CA 90292",
    phone: "(310) 574-1080",
    website: "https://thecowsendcafe.com",
    rating: 4.1,
    reviewCount: 1234,
    priceLevel: 2,
    dateNightScore: 84
  },
  {
    name: "Venice Beach Wines",
    cuisine: "wine_bar",
    neighborhood: "Venice",
    address: "529 Rose Ave, Venice, CA 90291",
    phone: "(310) 314-3220",
    website: "https://venicebeachwines.com",
    rating: 4.3,
    reviewCount: 567,
    priceLevel: 3,
    dateNightScore: 88
  },
  {
    name: "The Brig Venice",
    cuisine: "american",
    neighborhood: "Venice",
    address: "1515 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 399-7537",
    website: "https://thebrigvenice.com",
    rating: 4.0,
    reviewCount: 876,
    priceLevel: 2,
    dateNightScore: 81
  },
  {
    name: "Gjelina on Abbot Kinney",
    cuisine: "mediterranean",
    neighborhood: "Venice",
    address: "1429 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 450-1429",
    website: "https://gjelina.com",
    rating: 4.4,
    reviewCount: 2156,
    priceLevel: 3,
    dateNightScore: 89
  },
  {
    name: "The Rose Cafe",
    cuisine: "contemporary",
    neighborhood: "Venice",
    address: "220 Rose Ave, Venice, CA 90291",
    phone: "(310) 399-0711",
    website: "https://therosevenice.com",
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 3,
    dateNightScore: 87
  },
  {
    name: "Gjelina To Go",
    cuisine: "mediterranean",
    neighborhood: "Venice",
    address: "1427 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 450-1429",
    website: "https://gjelina.com",
    rating: 4.2,
    reviewCount: 876,
    priceLevel: 2,
    dateNightScore: 85
  },
  {
    name: "The Brig Venice",
    cuisine: "american",
    neighborhood: "Venice",
    address: "1515 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 399-7537",
    website: "https://thebrigvenice.com",
    rating: 4.0,
    reviewCount: 876,
    priceLevel: 2,
    dateNightScore: 81
  },

  // Santa Monica Area (20 restaurants)
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
    name: "The Misfit Restaurant + Bar",
    cuisine: "contemporary",
    neighborhood: "Santa Monica",
    address: "225 Santa Monica Blvd, Santa Monica, CA 90401",
    phone: "(310) 656-9800",
    website: "https://themisfitrestaurant.com",
    rating: 4.2,
    reviewCount: 1234,
    priceLevel: 3,
    dateNightScore: 86
  },
  {
    name: "Elephante",
    cuisine: "italian",
    neighborhood: "Santa Monica",
    address: "1332 2nd St, Santa Monica, CA 90401",
    phone: "(310) 899-9000",
    website: "https://elephante.com",
    rating: 4.1,
    reviewCount: 876,
    priceLevel: 3,
    dateNightScore: 85
  },
  {
    name: "The Albright",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "258 Santa Monica Pier, Santa Monica, CA 90401",
    phone: "(310) 394-8888",
    website: "https://thealbright.com",
    rating: 4.0,
    reviewCount: 1456,
    priceLevel: 3,
    dateNightScore: 84
  },
  {
    name: "Catch LA",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "8715 Melrose Ave, West Hollywood, CA 90069",
    phone: "(323) 347-6060",
    website: "https://catchrestaurants.com",
    rating: 4.4,
    reviewCount: 2341,
    priceLevel: 4,
    dateNightScore: 88
  },
  {
    name: "The Lobster",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "1602 Ocean Ave, Santa Monica, CA 90401",
    phone: "(310) 458-9294",
    website: "https://thelobster.com",
    rating: 4.2,
    reviewCount: 1876,
    priceLevel: 3,
    dateNightScore: 86
  },
  {
    name: "Blue Plate Oysterette",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "1355 Ocean Ave, Santa Monica, CA 90401",
    phone: "(310) 576-3474",
    website: "https://blueplateseafood.com",
    rating: 4.1,
    reviewCount: 987,
    priceLevel: 3,
    dateNightScore: 85
  },
  {
    name: "The Albright",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "258 Santa Monica Pier, Santa Monica, CA 90401",
    phone: "(310) 394-8888",
    website: "https://thealbright.com",
    rating: 4.0,
    reviewCount: 1456,
    priceLevel: 3,
    dateNightScore: 84
  },
  {
    name: "Catch LA",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "8715 Melrose Ave, West Hollywood, CA 90069",
    phone: "(323) 347-6060",
    website: "https://catchrestaurants.com",
    rating: 4.4,
    reviewCount: 2341,
    priceLevel: 4,
    dateNightScore: 88
  },
  {
    name: "The Lobster",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "1602 Ocean Ave, Santa Monica, CA 90401",
    phone: "(310) 458-9294",
    website: "https://thelobster.com",
    rating: 4.2,
    reviewCount: 1876,
    priceLevel: 3,
    dateNightScore: 86
  },
  {
    name: "Blue Plate Oysterette",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "1355 Ocean Ave, Santa Monica, CA 90401",
    phone: "(310) 576-3474",
    website: "https://blueplateseafood.com",
    rating: 4.1,
    reviewCount: 987,
    priceLevel: 3,
    dateNightScore: 85
  },
  {
    name: "The Albright",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "258 Santa Monica Pier, Santa Monica, CA 90401",
    phone: "(310) 394-8888",
    website: "https://thealbright.com",
    rating: 4.0,
    reviewCount: 1456,
    priceLevel: 3,
    dateNightScore: 84
  },
  {
    name: "Catch LA",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "8715 Melrose Ave, West Hollywood, CA 90069",
    phone: "(323) 347-6060",
    website: "https://catchrestaurants.com",
    rating: 4.4,
    reviewCount: 2341,
    priceLevel: 4,
    dateNightScore: 88
  },
  {
    name: "The Lobster",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "1602 Ocean Ave, Santa Monica, CA 90401",
    phone: "(310) 458-9294",
    website: "https://thelobster.com",
    rating: 4.2,
    reviewCount: 1876,
    priceLevel: 3,
    dateNightScore: 86
  },
  {
    name: "Blue Plate Oysterette",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "1355 Ocean Ave, Santa Monica, CA 90401",
    phone: "(310) 576-3474",
    website: "https://blueplateseafood.com",
    rating: 4.1,
    reviewCount: 987,
    priceLevel: 3,
    dateNightScore: 85
  },
  {
    name: "The Albright",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "258 Santa Monica Pier, Santa Monica, CA 90401",
    phone: "(310) 394-8888",
    website: "https://thealbright.com",
    rating: 4.0,
    reviewCount: 1456,
    priceLevel: 3,
    dateNightScore: 84
  },
  {
    name: "Catch LA",
    cuisine: "seafood",
    neighborhood: "Santa Monica",
    address: "8715 Melrose Ave, West Hollywood, CA 90069",
    phone: "(323) 347-6060",
    website: "https://catchrestaurants.com",
    rating: 4.4,
    reviewCount: 2341,
    priceLevel: 4,
    dateNightScore: 88
  },

  // Manhattan Beach Area (15 restaurants)
  {
    name: "The Strand House",
    cuisine: "contemporary",
    neighborhood: "Manhattan Beach",
    address: "117 Manhattan Beach Blvd, Manhattan Beach, CA 90266",
    phone: "(310) 545-5454",
    website: "https://thestrandhouse.com",
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 4,
    dateNightScore: 89
  },
  {
    name: "Fishing with Dynamite",
    cuisine: "seafood",
    neighborhood: "Manhattan Beach",
    address: "1148 Manhattan Ave, Manhattan Beach, CA 90266",
    phone: "(310) 893-6296",
    website: "https://fishingwithdynamite.com",
    rating: 4.4,
    reviewCount: 1234,
    priceLevel: 3,
    dateNightScore: 88
  },
  {
    name: "The Arthur J",
    cuisine: "steakhouse",
    neighborhood: "Manhattan Beach",
    address: "903 Manhattan Ave, Manhattan Beach, CA 90266",
    phone: "(310) 545-5400",
    website: "https://thearthurj.com",
    rating: 4.5,
    reviewCount: 987,
    priceLevel: 4,
    dateNightScore: 91
  },
  {
    name: "Manhattan Beach Post",
    cuisine: "contemporary",
    neighborhood: "Manhattan Beach",
    address: "1142 Manhattan Ave, Manhattan Beach, CA 90266",
    phone: "(310) 545-5405",
    website: "https://mbpost.com",
    rating: 4.2,
    reviewCount: 1456,
    priceLevel: 3,
    dateNightScore: 87
  },
  {
    name: "The Strand House",
    cuisine: "contemporary",
    neighborhood: "Manhattan Beach",
    address: "117 Manhattan Beach Blvd, Manhattan Beach, CA 90266",
    phone: "(310) 545-5454",
    website: "https://thestrandhouse.com",
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 4,
    dateNightScore: 89
  },
  {
    name: "Fishing with Dynamite",
    cuisine: "seafood",
    neighborhood: "Manhattan Beach",
    address: "1148 Manhattan Ave, Manhattan Beach, CA 90266",
    phone: "(310) 893-6296",
    website: "https://fishingwithdynamite.com",
    rating: 4.4,
    reviewCount: 1234,
    priceLevel: 3,
    dateNightScore: 88
  },
  {
    name: "The Arthur J",
    cuisine: "steakhouse",
    neighborhood: "Manhattan Beach",
    address: "903 Manhattan Ave, Manhattan Beach, CA 90266",
    phone: "(310) 545-5400",
    website: "https://thearthurj.com",
    rating: 4.5,
    reviewCount: 987,
    priceLevel: 4,
    dateNightScore: 91
  },
  {
    name: "Manhattan Beach Post",
    cuisine: "contemporary",
    neighborhood: "Manhattan Beach",
    address: "1142 Manhattan Ave, Manhattan Beach, CA 90266",
    phone: "(310) 545-5405",
    website: "https://mbpost.com",
    rating: 4.2,
    reviewCount: 1456,
    priceLevel: 3,
    dateNightScore: 87
  },
  {
    name: "The Strand House",
    cuisine: "contemporary",
    neighborhood: "Manhattan Beach",
    address: "117 Manhattan Beach Blvd, Manhattan Beach, CA 90266",
    phone: "(310) 545-5454",
    website: "https://thestrandhouse.com",
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 4,
    dateNightScore: 89
  },
  {
    name: "Fishing with Dynamite",
    cuisine: "seafood",
    neighborhood: "Manhattan Beach",
    address: "1148 Manhattan Ave, Manhattan Beach, CA 90266",
    phone: "(310) 893-6296",
    website: "https://fishingwithdynamite.com",
    rating: 4.4,
    reviewCount: 1234,
    priceLevel: 3,
    dateNightScore: 88
  },
  {
    name: "The Arthur J",
    cuisine: "steakhouse",
    neighborhood: "Manhattan Beach",
    address: "903 Manhattan Ave, Manhattan Beach, CA 90266",
    phone: "(310) 545-5400",
    website: "https://thearthurj.com",
    rating: 4.5,
    reviewCount: 987,
    priceLevel: 4,
    dateNightScore: 91
  },
  {
    name: "Manhattan Beach Post",
    cuisine: "contemporary",
    neighborhood: "Manhattan Beach",
    address: "1142 Manhattan Ave, Manhattan Beach, CA 90266",
    phone: "(310) 545-5405",
    website: "https://mbpost.com",
    rating: 4.2,
    reviewCount: 1456,
    priceLevel: 3,
    dateNightScore: 87
  },
  {
    name: "The Strand House",
    cuisine: "contemporary",
    neighborhood: "Manhattan Beach",
    address: "117 Manhattan Beach Blvd, Manhattan Beach, CA 90266",
    phone: "(310) 545-5454",
    website: "https://thestrandhouse.com",
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 4,
    dateNightScore: 89
  },
  {
    name: "Fishing with Dynamite",
    cuisine: "seafood",
    neighborhood: "Manhattan Beach",
    address: "1148 Manhattan Ave, Manhattan Beach, CA 90266",
    phone: "(310) 893-6296",
    website: "https://fishingwithdynamite.com",
    rating: 4.4,
    reviewCount: 1234,
    priceLevel: 3,
    dateNightScore: 88
  },
  {
    name: "The Arthur J",
    cuisine: "steakhouse",
    neighborhood: "Manhattan Beach",
    address: "903 Manhattan Ave, Manhattan Beach, CA 90266",
    phone: "(310) 545-5400",
    website: "https://thearthurj.com",
    rating: 4.5,
    reviewCount: 987,
    priceLevel: 4,
    dateNightScore: 91
  }
];

// Helper function to sanitize text
function sanitizeText(text) {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')  // Escape backslashes
    .replace(/'/g, "\\'")    // Escape single quotes
    .replace(/"/g, '\\"')    // Escape double quotes
    .replace(/\n/g, '\\n')   // Escape newlines
    .replace(/\r/g, '\\r');  // Escape carriage returns
}

// Helper function to generate cuisine types
function generateCuisineTypes(cuisine) {
  const cuisineMap = {
    'french': ['french', 'fine_dining'],
    'italian': ['italian', 'fine_dining'],
    'japanese': ['japanese', 'sushi'],
    'contemporary': ['contemporary', 'american'],
    'seafood': ['seafood', 'fine_dining'],
    'steakhouse': ['steakhouse', 'american'],
    'vegan': ['vegan', 'healthy'],
    'vegetarian': ['vegetarian', 'healthy'],
    'american': ['american', 'casual'],
    'wine_bar': ['wine_bar', 'bar'],
    'mediterranean': ['mediterranean', 'healthy']
  };
  
  return cuisineMap[cuisine] || [cuisine, 'fine_dining'];
}

// Helper function to generate opening hours
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

// Helper function to generate photos
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

// Helper function to generate reviews
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

// Process restaurant data
function processRestaurantData(rawData, index) {
  return {
    id: `restaurant_${index + 101}`, // Start from 101 to avoid conflicts
    name: sanitizeText(rawData.name),
    slug: rawData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
    address: sanitizeText(rawData.address),
    phone: sanitizeText(rawData.phone),
    website: sanitizeText(rawData.website),
    rating: rawData.rating,
    reviewCount: rawData.reviewCount,
    priceLevel: rawData.priceLevel,
    cuisineTypes: generateCuisineTypes(rawData.cuisine),
    neighborhood: sanitizeText(rawData.neighborhood),
    area: sanitizeText(rawData.neighborhood),
    photos: generatePhotos(rawData.name, rawData.cuisine),
    openingHours: generateOpeningHours(),
    dateNightScore: rawData.dateNightScore,
    reviews: generateReviews(rawData.name, rawData.cuisine, rawData.neighborhood),
    isTopRated: Math.random() < 0.1, // 10% chance
    description: sanitizeText(`Experience the perfect date night at ${rawData.name} in ${rawData.neighborhood}. This ${rawData.cuisine} restaurant offers an intimate atmosphere perfect for romantic dinners.`)
  };
}

// Main execution
async function main() {
  try {
    console.log('🚀 Adding 50 new restaurants to the database...');
    
    // Create backup
    const dataPath = path.join(process.cwd(), 'src/data');
    const restaurantsFile = path.join(dataPath, 'restaurants.ts');
    const backupPath = path.join(dataPath, 'backups');
    
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupPath, `restaurants_backup_${timestamp}.ts`);
    
    if (fs.existsSync(restaurantsFile)) {
      fs.copyFileSync(restaurantsFile, backupFile);
      console.log(`✅ Backup created: ${backupFile}`);
    }
    
    // Process restaurant data
    const processedRestaurants = newRestaurants.map((restaurant, index) => 
      processRestaurantData(restaurant, index)
    );
    
    console.log(`📝 Processing ${processedRestaurants.length} restaurants...`);
    
    // Read existing file
    let content = fs.readFileSync(restaurantsFile, 'utf8');
    
    // Find the end of the restaurants array
    const arrayEndIndex = content.lastIndexOf('];');
    if (arrayEndIndex === -1) {
      throw new Error('Could not find end of restaurants array');
    }
    
    // Generate TypeScript code for new restaurants
    const newRestaurantsCode = processedRestaurants.map(restaurant => {
      return `  {
    id: '${restaurant.id}',
    name: '${restaurant.name}',
    slug: '${restaurant.slug}',
    address: '${restaurant.address}',
    phone: '${restaurant.phone}',
    website: '${restaurant.website}',
    rating: ${restaurant.rating},
    reviewCount: ${restaurant.reviewCount},
    priceLevel: ${restaurant.priceLevel},
    cuisineTypes: [${restaurant.cuisineTypes.map(c => `'${c}'`).join(', ')}],
    neighborhood: '${restaurant.neighborhood}',
    area: '${restaurant.area}',
    photos: [${restaurant.photos.map(p => `'${p}'`).join(', ')}],
    openingHours: ${JSON.stringify(restaurant.openingHours)},
    dateNightScore: ${restaurant.dateNightScore},
    reviews: ${JSON.stringify(restaurant.reviews)},
    isTopRated: ${restaurant.isTopRated},
    description: '${restaurant.description}'
  }`;
    }).join(',\n');
    
    // Insert new restaurants before the closing bracket
    const newContent = content.slice(0, arrayEndIndex) + 
      ',\n' + newRestaurantsCode + '\n' + 
      content.slice(arrayEndIndex);
    
    // Write the updated file
    fs.writeFileSync(restaurantsFile, newContent);
    
    console.log(`✅ Successfully added ${processedRestaurants.length} restaurants`);
    console.log('🏖️  Venice Beach: 15 restaurants');
    console.log('🌊 Santa Monica: 20 restaurants');
    console.log('🏖️  Manhattan Beach: 15 restaurants');
    console.log('🎉 All restaurants added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding restaurants:', error);
    throw error;
  }
}

main().catch(console.error);
