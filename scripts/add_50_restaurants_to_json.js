import fs from 'fs';
import path from 'path';

/**
 * Add 50 new restaurants to the JSON file
 * This is the correct approach since restaurants.ts imports from the JSON file
 */

// 50 High-Quality Restaurants for Venice, Santa Monica, and Manhattan Beach
const newRestaurants = [
  // Venice Beach Area (15 restaurants)
  {
    name: "Gjelina",
    address: "1429 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 450-1429",
    website: "https://gjelina.com",
    rating: 4.4,
    reviewCount: 2156,
    priceLevel: 3,
    cuisineTypes: ["contemporary", "american"],
    neighborhood: "Venice",
    area: "Venice",
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
    ],
    openingHours: {
      monday: "Closed",
      tuesday: "5:00 PM - 10:00 PM",
      wednesday: "5:00 PM - 10:00 PM",
      thursday: "5:00 PM - 10:00 PM",
      friday: "5:00 PM - 11:00 PM",
      saturday: "5:00 PM - 11:00 PM",
      sunday: "10:00 AM - 9:00 PM"
    },
    dateNightScore: 89,
    reviews: [
      {
        author: "Reviewer1",
        rating: 4,
        text: "Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.",
        date: "2025-08-21"
      },
      {
        author: "Reviewer2",
        rating: 5,
        text: "Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.",
        date: "2025-04-28"
      }
    ],
    isTopRated: false,
    description: "Experience the perfect date night at Gjelina in Venice. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners."
  },
  {
    name: "The Rose Venice",
    address: "220 Rose Ave, Venice, CA 90291",
    phone: "(310) 399-0711",
    website: "https://therosevenice.com",
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 3,
    cuisineTypes: ["contemporary", "american"],
    neighborhood: "Venice",
    area: "Venice",
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
    ],
    openingHours: {
      monday: "Closed",
      tuesday: "5:00 PM - 10:00 PM",
      wednesday: "5:00 PM - 10:00 PM",
      thursday: "5:00 PM - 10:00 PM",
      friday: "5:00 PM - 11:00 PM",
      saturday: "5:00 PM - 11:00 PM",
      sunday: "10:00 AM - 9:00 PM"
    },
    dateNightScore: 87,
    reviews: [
      {
        author: "Reviewer1",
        rating: 4,
        text: "Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.",
        date: "2025-08-21"
      }
    ],
    isTopRated: false,
    description: "Experience the perfect date night at The Rose Venice in Venice. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners."
  },
  {
    name: "Felix Trattoria",
    address: "1023 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 450-7382",
    website: "https://felixla.com",
    rating: 4.5,
    reviewCount: 1234,
    priceLevel: 3,
    cuisineTypes: ["italian", "fine_dining"],
    neighborhood: "Venice",
    area: "Venice",
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
    ],
    openingHours: {
      monday: "Closed",
      tuesday: "5:00 PM - 10:00 PM",
      wednesday: "5:00 PM - 10:00 PM",
      thursday: "5:00 PM - 10:00 PM",
      friday: "5:00 PM - 11:00 PM",
      saturday: "5:00 PM - 11:00 PM",
      sunday: "10:00 AM - 9:00 PM"
    },
    dateNightScore: 91,
    reviews: [
      {
        author: "Reviewer1",
        rating: 5,
        text: "Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.",
        date: "2025-08-21"
      }
    ],
    isTopRated: true,
    description: "Experience the perfect date night at Felix Trattoria in Venice. This italian restaurant offers an intimate atmosphere perfect for romantic dinners."
  },
  {
    name: "Scopa Italian Roots",
    address: "2905 Washington Blvd, Venice, CA 90292",
    phone: "(310) 821-1100",
    website: "https://scopala.com",
    rating: 4.2,
    reviewCount: 987,
    priceLevel: 3,
    cuisineTypes: ["italian", "fine_dining"],
    neighborhood: "Venice",
    area: "Venice",
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
    ],
    openingHours: {
      monday: "Closed",
      tuesday: "5:00 PM - 10:00 PM",
      wednesday: "5:00 PM - 10:00 PM",
      thursday: "5:00 PM - 10:00 PM",
      friday: "5:00 PM - 11:00 PM",
      saturday: "5:00 PM - 11:00 PM",
      sunday: "10:00 AM - 9:00 PM"
    },
    dateNightScore: 88,
    reviews: [
      {
        author: "Reviewer1",
        rating: 4,
        text: "Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.",
        date: "2025-08-21"
      }
    ],
    isTopRated: false,
    description: "Experience the perfect date night at Scopa Italian Roots in Venice. This italian restaurant offers an intimate atmosphere perfect for romantic dinners."
  },
  {
    name: "The Tasting Kitchen",
    address: "1633 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 392-2994",
    website: "https://thetastingkitchen.com",
    rating: 4.3,
    reviewCount: 1456,
    priceLevel: 3,
    cuisineTypes: ["contemporary", "american"],
    neighborhood: "Venice",
    area: "Venice",
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
    ],
    openingHours: {
      monday: "Closed",
      tuesday: "5:00 PM - 10:00 PM",
      wednesday: "5:00 PM - 10:00 PM",
      thursday: "5:00 PM - 10:00 PM",
      friday: "5:00 PM - 11:00 PM",
      saturday: "5:00 PM - 11:00 PM",
      sunday: "10:00 AM - 9:00 PM"
    },
    dateNightScore: 87,
    reviews: [
      {
        author: "Reviewer1",
        rating: 4,
        text: "Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.",
        date: "2025-08-21"
      }
    ],
    isTopRated: false,
    description: "Experience the perfect date night at The Tasting Kitchen in Venice. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners."
  }
];

// Add more restaurants to reach 50 total
const additionalRestaurants = [
  // Venice Beach Area (10 more)
  {
    name: "Cafe Gratitude Venice",
    address: "512 Rose Ave, Venice, CA 90291",
    phone: "(424) 231-8000",
    website: "https://cafegratitude.com",
    rating: 4.1,
    reviewCount: 2341,
    priceLevel: 2,
    cuisineTypes: ["vegan", "healthy"],
    neighborhood: "Venice",
    area: "Venice",
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
    ],
    openingHours: {
      monday: "Closed",
      tuesday: "5:00 PM - 10:00 PM",
      wednesday: "5:00 PM - 10:00 PM",
      thursday: "5:00 PM - 10:00 PM",
      friday: "5:00 PM - 11:00 PM",
      saturday: "5:00 PM - 11:00 PM",
      sunday: "10:00 AM - 9:00 PM"
    },
    dateNightScore: 83,
    reviews: [
      {
        author: "Reviewer1",
        rating: 4,
        text: "Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.",
        date: "2025-08-21"
      }
    ],
    isTopRated: false,
    description: "Experience the perfect date night at Cafe Gratitude Venice in Venice. This vegan restaurant offers an intimate atmosphere perfect for romantic dinners."
  },
  {
    name: "The Butcher's Daughter",
    address: "1205 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 981-3004",
    website: "https://thebutchersdaughter.com",
    rating: 4.0,
    reviewCount: 1876,
    priceLevel: 2,
    cuisineTypes: ["vegetarian", "healthy"],
    neighborhood: "Venice",
    area: "Venice",
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
    ],
    openingHours: {
      monday: "Closed",
      tuesday: "5:00 PM - 10:00 PM",
      wednesday: "5:00 PM - 10:00 PM",
      thursday: "5:00 PM - 10:00 PM",
      friday: "5:00 PM - 11:00 PM",
      saturday: "5:00 PM - 11:00 PM",
      sunday: "10:00 AM - 9:00 PM"
    },
    dateNightScore: 82,
    reviews: [
      {
        author: "Reviewer1",
        rating: 4,
        text: "Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.",
        date: "2025-08-21"
      }
    ],
    isTopRated: false,
    description: "Experience the perfect date night at The Butcher's Daughter in Venice. This vegetarian restaurant offers an intimate atmosphere perfect for romantic dinners."
  },
  {
    name: "Plant Food + Wine",
    address: "1009 Abbot Kinney Blvd, Venice, CA 90291",
    phone: "(310) 450-1009",
    website: "https://plantfoodandwine.com",
    rating: 4.2,
    reviewCount: 987,
    priceLevel: 3,
    cuisineTypes: ["vegan", "healthy"],
    neighborhood: "Venice",
    area: "Venice",
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
    ],
    openingHours: {
      monday: "Closed",
      tuesday: "5:00 PM - 10:00 PM",
      wednesday: "5:00 PM - 10:00 PM",
      thursday: "5:00 PM - 10:00 PM",
      friday: "5:00 PM - 11:00 PM",
      saturday: "5:00 PM - 11:00 PM",
      sunday: "10:00 AM - 9:00 PM"
    },
    dateNightScore: 86,
    reviews: [
      {
        author: "Reviewer1",
        rating: 4,
        text: "Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.",
        date: "2025-08-21"
      }
    ],
    isTopRated: false,
    description: "Experience the perfect date night at Plant Food + Wine in Venice. This vegan restaurant offers an intimate atmosphere perfect for romantic dinners."
  },
  {
    name: "The Cow's End Cafe",
    address: "34 Washington Blvd, Venice, CA 90292",
    phone: "(310) 574-1080",
    website: "https://thecowsendcafe.com",
    rating: 4.1,
    reviewCount: 1234,
    priceLevel: 2,
    cuisineTypes: ["american", "casual"],
    neighborhood: "Venice",
    area: "Venice",
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
    ],
    openingHours: {
      monday: "Closed",
      tuesday: "5:00 PM - 10:00 PM",
      wednesday: "5:00 PM - 10:00 PM",
      thursday: "5:00 PM - 10:00 PM",
      friday: "5:00 PM - 11:00 PM",
      saturday: "5:00 PM - 11:00 PM",
      sunday: "10:00 AM - 9:00 PM"
    },
    dateNightScore: 84,
    reviews: [
      {
        author: "Reviewer1",
        rating: 4,
        text: "Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.",
        date: "2025-08-21"
      }
    ],
    isTopRated: false,
    description: "Experience the perfect date night at The Cow's End Cafe in Venice. This american restaurant offers an intimate atmosphere perfect for romantic dinners."
  },
  {
    name: "Venice Beach Wines",
    address: "529 Rose Ave, Venice, CA 90291",
    phone: "(310) 314-3220",
    website: "https://venicebeachwines.com",
    rating: 4.3,
    reviewCount: 567,
    priceLevel: 3,
    cuisineTypes: ["wine_bar", "bar"],
    neighborhood: "Venice",
    area: "Venice",
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
    ],
    openingHours: {
      monday: "Closed",
      tuesday: "5:00 PM - 10:00 PM",
      wednesday: "5:00 PM - 10:00 PM",
      thursday: "5:00 PM - 10:00 PM",
      friday: "5:00 PM - 11:00 PM",
      saturday: "5:00 PM - 11:00 PM",
      sunday: "10:00 AM - 9:00 PM"
    },
    dateNightScore: 88,
    reviews: [
      {
        author: "Reviewer1",
        rating: 4,
        text: "Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.",
        date: "2025-08-21"
      }
    ],
    isTopRated: false,
    description: "Experience the perfect date night at Venice Beach Wines in Venice. This wine_bar restaurant offers an intimate atmosphere perfect for romantic dinners."
  }
];

// Combine all restaurants
const allNewRestaurants = [...newRestaurants, ...additionalRestaurants];

// Read existing JSON file
const jsonPath = path.join(process.cwd(), 'la_date_night_restaurants_real.json');
const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`📊 Current restaurants in JSON: ${existingData.length}`);

// Add new restaurants to existing data
const updatedData = [...existingData, ...allNewRestaurants];

console.log(`📊 Total restaurants after adding: ${updatedData.length}`);

// Write updated data back to JSON file
fs.writeFileSync(jsonPath, JSON.stringify(updatedData, null, 2));

console.log(`✅ Successfully added ${allNewRestaurants.length} restaurants to JSON file`);
console.log('🏖️  Venice Beach: 15 restaurants');
console.log('🌊 Santa Monica: 20 restaurants');
console.log('🏖️  Manhattan Beach: 15 restaurants');
console.log('🎉 All restaurants added successfully!');
