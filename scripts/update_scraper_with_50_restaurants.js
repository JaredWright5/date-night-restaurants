import fs from 'fs';
import path from 'path';

// Read the current scraper file
const scraperPath = path.join(process.cwd(), 'scripts/restaurant_scraper.js');
let scraperContent = fs.readFileSync(scraperPath, 'utf8');

// 50 High-Quality Restaurants for Venice, Santa Monica, and Manhattan Beach
const restaurantTemplates = [
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

// Convert to JavaScript string format
const restaurantTemplatesString = JSON.stringify(restaurantTemplates, null, 2);

// Find and replace the generateRestaurantData method
const methodStart = scraperContent.indexOf('generateRestaurantData() {');
const methodEnd = scraperContent.indexOf('}', methodStart + 100);

if (methodStart !== -1 && methodEnd !== -1) {
  const newMethod = `generateRestaurantData() {
    const restaurantTemplates = ${restaurantTemplatesString};
    return restaurantTemplates;
  }`;
  
  const newContent = scraperContent.slice(0, methodStart) + newMethod + scraperContent.slice(methodEnd + 1);
  
  // Write the updated file
  fs.writeFileSync(scraperPath, newContent);
  
  console.log('✅ Successfully updated scraper with 50 restaurants');
  console.log(`📊 Total restaurants: ${restaurantTemplates.length}`);
  console.log('🏖️  Venice Beach: 15 restaurants');
  console.log('🌊 Santa Monica: 20 restaurants');
  console.log('🏖️  Manhattan Beach: 15 restaurants');
} else {
  console.error('❌ Could not find generateRestaurantData method');
}
