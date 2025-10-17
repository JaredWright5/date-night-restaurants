import type { Restaurant } from '@/types';

// Import restaurant data from JSON
import laRestaurants from '../../la_date_night_restaurants_real.json';

export const restaurants: Restaurant[] = laRestaurants.map((restaurant, index) => ({
  id: `restaurant-${index + 1}`,
  name: restaurant.name,
  slug: restaurant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  address: restaurant.address,
  phone: restaurant.phone,
  website: restaurant.website,
  rating: restaurant.rating,
  priceLevel: restaurant.price_level,
  cuisineTypes: restaurant.cuisine_types,
  openingHours: restaurant.opening_hours,
  reviews: restaurant.reviews,
  photos: restaurant.photos,
  placeId: restaurant.place_id,
  latitude: restaurant.latitude,
  longitude: restaurant.longitude,
  dateNightScore: restaurant.dateNightScore,
  isTopRated: restaurant.isTopRated,
  city: 'Los Angeles',
  area: extractAreaFromAddress(restaurant.address),
  neighborhood: extractAreaFromAddress(restaurant.address),
  zipCode: extractZipCode(restaurant.address),
  description: generateDescription(restaurant),
  amenities: generateAmenities(restaurant),
  specialFeatures: generateSpecialFeatures(restaurant),
  lastUpdated: new Date().toISOString(),
}));

function extractAreaFromAddress(address: string): string {
  const areas = [
    'Beverly Hills', 'West Hollywood', 'Santa Monica', 'Venice',
    'Los Angeles', 'Hollywood', 'Silver Lake', 'Los Feliz',
    'Pasadena', 'Manhattan Beach', 'Hermosa Beach', 'Redondo Beach'
  ];
  
  for (const area of areas) {
    if (address.includes(area)) {
      return area;
    }
  }
  return 'Los Angeles';
}

function extractZipCode(address: string): string {
  const zipMatch = address.match(/CA (\d{5})/);
  return zipMatch ? zipMatch[1] : '90210';
}

function generateDescription(restaurant: any): string {
  const cuisine = restaurant.cuisine_types.join(', ');
  const area = extractAreaFromAddress(restaurant.address);
  return `${restaurant.name} in ${area} offers ${cuisine} cuisine perfect for romantic date nights. Rated ${restaurant.rating}/5 stars with ${'$'.repeat(restaurant.price_level)} pricing.`;
}

function generateAmenities(restaurant: any): string[] {
  const amenities = ['WiFi', 'Parking', 'Reservations Required'];
  
  if (restaurant.cuisine_types.includes('wine_bar')) {
    amenities.push('Wine Bar', 'Cocktails');
  }
  
  if (restaurant.cuisine_types.includes('rooftop_restaurant')) {
    amenities.push('Rooftop Views', 'Outdoor Seating');
  }
  
  if (restaurant.price_level >= 3) {
    amenities.push('Fine Dining', 'Valet Parking');
  }
  
  return amenities;
}

function generateSpecialFeatures(restaurant: any): string[] {
  const features = [];
  
  if (restaurant.date_night_score >= 90) {
    features.push('Highly Romantic', 'Perfect for Anniversaries');
  }
  
  if (restaurant.cuisine_types.includes('fine_dining')) {
    features.push('Chef\'s Tasting Menu', 'Wine Pairing');
  }
  
  if (restaurant.cuisine_types.includes('rooftop_restaurant')) {
    features.push('City Views', 'Sunset Dining');
  }
  
  if (restaurant.rating >= 4.5) {
    features.push('Critically Acclaimed', 'Award Winning');
  }
  
  return features;
}

// Helper functions for data access
export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return restaurants.find(restaurant => restaurant.slug === slug);
}

export function getRestaurantsByCity(city: string): Restaurant[] {
  return restaurants.filter(restaurant => restaurant.city === city);
}

export function getRestaurantsByArea(area: string): Restaurant[] {
  return restaurants.filter(restaurant => restaurant.area === area);
}

export function getRestaurantsByNeighborhood(neighborhood: string): Restaurant[] {
  return restaurants.filter(restaurant => restaurant.neighborhood === neighborhood);
}

export function getRestaurantsByCuisine(cuisine: string): Restaurant[] {
  return restaurants.filter(restaurant => 
    restaurant.cuisineTypes.includes(cuisine)
  );
}

export function getTopRestaurants(limit: number = 10): Restaurant[] {
  return restaurants
    .sort((a, b) => b.dateNightScore - a.dateNightScore)
    .slice(0, limit);
}

export function getRandomRestaurants(limit: number = 6, excludeFeatured: boolean = true): Restaurant[] {
  let availableRestaurants = restaurants;
  
  if (excludeFeatured) {
    // Exclude featured restaurants
    const featuredNames = [
      'Providence',
      'République Café Bakery & République Restaurant', 
      'Bestia',
      'Osteria Mozza'
    ];
    availableRestaurants = restaurants.filter(restaurant => 
      !featuredNames.includes(restaurant.name)
    );
  }
  
  // Shuffle the array and take the first 'limit' items
  const shuffled = [...availableRestaurants].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

export function searchRestaurants(query: string, filters: any = {}): Restaurant[] {
  let results = restaurants;
  
  // Text search
  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.address.toLowerCase().includes(searchTerm) ||
      restaurant.cuisineTypes.some(cuisine => 
        cuisine.toLowerCase().includes(searchTerm)
      ) ||
      restaurant.description?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply filters
  if (filters.cuisine) {
    results = results.filter(restaurant => 
      restaurant.cuisineTypes.includes(filters.cuisine)
    );
  }
  
  if (filters.priceLevel) {
    results = results.filter(restaurant => 
      restaurant.priceLevel === filters.priceLevel
    );
  }
  
  if (filters.rating) {
    results = results.filter(restaurant => 
      restaurant.rating >= filters.rating
    );
  }
  
  if (filters.dateScore) {
    results = results.filter(restaurant => 
      restaurant.dateNightScore >= parseInt(filters.dateScore)
    );
  }
  
  if (filters.area) {
    results = results.filter(restaurant => 
      restaurant.area === filters.area
    );
  }
  
  if (filters.neighborhood) {
    results = results.filter(restaurant => 
      restaurant.neighborhood === filters.neighborhood
    );
  }
  
  return results.sort((a, b) => b.dateNightScore - a.dateNightScore);
}

// Calculate Date Score based on weighted factors
export function calculateDateScore(restaurant: Restaurant): number {
  const {
    name,
    cuisineTypes,
    priceLevel,
    rating,
    reviews,
    photos,
    area,
    neighborhood,
    website,
    openingHours
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
function calculateAmbianceScore(restaurant: Restaurant): number {
  let score = 50; // Base score
  
  // Cuisine type ambiance factors
  const romanticCuisines = ['italian', 'french', 'japanese', 'mediterranean'];
  const cuisineScore = restaurant.cuisineTypes.some(cuisine => 
    romanticCuisines.includes(cuisine.toLowerCase())
  ) ? 20 : 10;
  score += cuisineScore;

  // Price level ambiance (higher price = more romantic setting)
  score += restaurant.priceLevel * 5;

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

function calculateSocialScore(restaurant: Restaurant): number {
  // Placeholder - will be updated with real social media data
  // For now, use rating as proxy for social buzz
  return Math.min(restaurant.rating * 20, 100);
}

function calculateOccasionScore(restaurant: Restaurant): number {
  let score = 50; // Base score
  
  // Higher price restaurants are more likely to be used for special occasions
  score += restaurant.priceLevel * 10;
  
  // Fine dining cuisines are more occasion-appropriate
  const specialOccasionCuisines = ['french', 'italian', 'japanese', 'steakhouse'];
  if (restaurant.cuisineTypes.some(cuisine => 
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

function calculateQualityScore(restaurant: Restaurant): number {
  // Based on Google rating and review volume
  const ratingScore = restaurant.rating * 20;
  const reviewVolumeScore = Math.min(restaurant.reviews.length * 2, 20);
  
  return Math.min(ratingScore + reviewVolumeScore, 100);
}

function calculateFreshnessScore(restaurant: Restaurant): number {
  // Placeholder - will be updated with real data about recent mentions
  // For now, use a combination of rating and price level as proxy
  return Math.min((restaurant.rating * 15) + (restaurant.priceLevel * 5), 100);
}

function calculatePracticalScore(restaurant: Restaurant): number {
  let score = 50; // Base score
  
  // Price appropriateness for date night (not too cheap, not too expensive)
  if (restaurant.priceLevel >= 2 && restaurant.priceLevel <= 4) {
    score += 20;
  } else if (restaurant.priceLevel === 1) {
    score += 10; // Budget-friendly but still date-worthy
  } else if (restaurant.priceLevel === 5) {
    score += 15; // Very expensive but special occasion worthy
  }

  // Location accessibility (good neighborhoods)
  const accessibleNeighborhoods = ['Beverly Hills', 'West Hollywood', 'Santa Monica', 'Downtown LA'];
  if (accessibleNeighborhoods.includes(restaurant.neighborhood)) {
    score += 15;
  }

  // Hours availability (restaurants open for dinner)
  if (restaurant.openingHours && restaurant.openingHours.length > 0) {
    score += 10;
  }

  // Website presence indicates professionalism
  if (restaurant.website) {
    score += 5;
  }

  return Math.min(score, 100);
}

// Generate customized date night descriptions
export function generateDateNightDescription(restaurant: Restaurant): string {
  const { name, cuisineTypes, area, priceLevel, rating, dateNightScore } = restaurant;
  
  // Base description templates based on cuisine and price level
  const cuisineDescriptions = {
    'fine_dining': 'elegant fine dining experience',
    'italian_restaurant': 'authentic Italian romance',
    'french_restaurant': 'sophisticated French cuisine',
    'japanese_restaurant': 'intimate Japanese dining',
    'seafood_restaurant': 'fresh seafood romance',
    'contemporary': 'modern culinary artistry',
    'wine_bar': 'intimate wine bar atmosphere',
    'rooftop_restaurant': 'breathtaking rooftop views',
    'steakhouse': 'premium steakhouse experience',
    'mexican_restaurant': 'vibrant Mexican flavors',
    'thai_restaurant': 'exotic Thai romance'
  };
  
  const priceDescriptions = {
    1: 'cozy and affordable',
    2: 'casual yet romantic',
    3: 'upscale and intimate',
    4: 'luxurious and exclusive'
  };
  
  const areaDescriptions = {
    'Beverly Hills': 'the glamorous heart of Beverly Hills',
    'West Hollywood': 'trendy West Hollywood',
    'Santa Monica': 'charming Santa Monica',
    'Venice': 'bohemian Venice',
    'Downtown LA': 'vibrant Downtown LA',
    'Hollywood': 'glamorous Hollywood',
    'Silver Lake': 'hip Silver Lake',
    'Los Feliz': 'charming Los Feliz',
    'Manhattan Beach': 'coastal Manhattan Beach',
    'Pasadena': 'historic Pasadena'
  };
  
  // Get primary cuisine and description
  const primaryCuisine = cuisineTypes[0] || 'contemporary';
  const cuisineDesc = cuisineDescriptions[primaryCuisine] || 'exceptional dining';
  const priceDesc = priceDescriptions[priceLevel] || 'intimate';
  const areaDesc = areaDescriptions[area] || area;
  
  // Generate romantic atmosphere descriptions
  const atmosphereDescriptions = [
    'soft candlelight and intimate seating',
    'warm ambiance perfect for conversation',
    'romantic lighting and elegant decor',
    'cozy atmosphere ideal for couples',
    'sophisticated setting with romantic vibes',
    'intimate dining space with romantic charm'
  ];
  
  // Generate date night specific phrases
  const dateNightPhrases = [
    'perfect for a romantic dinner',
    'ideal for celebrating special moments',
    'wonderful for intimate conversations',
    'excellent for anniversary dinners',
    'great for impressing your date',
    'perfect for a memorable evening'
  ];
  
  // Select random elements
  const atmosphere = atmosphereDescriptions[Math.floor(Math.random() * atmosphereDescriptions.length)];
  const dateNightPhrase = dateNightPhrases[Math.floor(Math.random() * dateNightPhrases.length),
  {
    id: 'restaurant_101',
    name: 'The Little Door',
    slug: 'the-little-door',
    address: '8164 W 3rd St, Los Angeles, CA 90048',
    phone: '(323) 951-1210',
    website: 'https://thelittledoor.com',
    rating: 4.5,
    reviewCount: 1247,
    priceLevel: 3,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'West Hollywood',
    area: 'West Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 11:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"7:00 PM - 12:00 PM","friday":"5:00 PM - 11:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 92,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-09-18"},{"author":"Reviewer2","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-05-11"},{"author":"Reviewer3","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-03-09"},{"author":"Reviewer4","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-09-14"},{"author":"Reviewer5","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-09-08"}],
    isTopRated: false,
    description: 'Experience the perfect date night at The Little Door in West Hollywood. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_102',
    name: '71Above',
    slug: '71above',
    address: '633 W 5th St, Los Angeles, CA 90071',
    phone: '(213) 712-2683',
    website: 'https://71above.com',
    rating: 4.6,
    reviewCount: 2156,
    priceLevel: 4,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Downtown LA',
    area: 'Downtown LA',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 10:00 PM","wednesday":"5:00 PM - 11:00 PM","thursday":"7:00 PM - 12:00 PM","friday":"6:00 PM - 11:00 PM","saturday":"7:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 94,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-04-25"},{"author":"Reviewer2","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-09-05"},{"author":"Reviewer3","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-02-11"}],
    isTopRated: false,
    description: 'Experience the perfect date night at 71Above in Downtown LA. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_103',
    name: 'Nobu Malibu',
    slug: 'nobu-malibu',
    address: '22706 Pacific Coast Hwy, Malibu, CA 90265',
    phone: '(310) 317-9140',
    website: 'https://noburestaurants.com/malibu',
    rating: 4.4,
    reviewCount: 3421,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Malibu',
    area: 'Malibu',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 10:00 PM","wednesday":"7:00 PM - 10:00 PM","thursday":"7:00 PM - 11:00 PM","friday":"6:00 PM - 11:00 PM","saturday":"7:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 89,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-04-20"},{"author":"Reviewer2","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-09-08"},{"author":"Reviewer3","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-09-10"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Nobu Malibu in Malibu. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_104',
    name: 'Giorgio Baldi',
    slug: 'giorgio-baldi',
    address: '114 W Channel Rd, Santa Monica, CA 90402',
    phone: '(310) 573-1660',
    website: 'https://giorgiobaldi.com',
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 4,
    cuisineTypes: ['italian', 'fine_dining'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 11:00 PM","wednesday":"7:00 PM - 12:00 PM","thursday":"5:00 PM - 12:00 PM","friday":"7:00 PM - 12:00 PM","saturday":"7:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 87,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-05-25"},{"author":"Reviewer2","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-12-02"},{"author":"Reviewer3","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-10-28"},{"author":"Reviewer4","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-12-21"},{"author":"Reviewer5","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-01-06"},{"author":"Reviewer6","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2024-10-24"},{"author":"Reviewer7","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-04-07"},{"author":"Reviewer8","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-06-15"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Giorgio Baldi in Santa Monica. This italian restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_105',
    name: 'Madeo Ristorante',
    slug: 'madeo-ristorante',
    address: '8897 Beverly Blvd, West Hollywood, CA 90048',
    phone: '(310) 859-4900',
    website: 'https://madeorestaurant.com',
    rating: 4.4,
    reviewCount: 1234,
    priceLevel: 3,
    cuisineTypes: ['italian', 'fine_dining'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 10:00 PM","wednesday":"5:00 PM - 10:00 PM","thursday":"6:00 PM - 10:00 PM","friday":"5:00 PM - 11:00 PM","saturday":"6:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 91,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-08-16"},{"author":"Reviewer2","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-03-02"},{"author":"Reviewer3","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-06-30"},{"author":"Reviewer4","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-07-23"},{"author":"Reviewer5","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-07-18"},{"author":"Reviewer6","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-08-01"},{"author":"Reviewer7","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-08-01"},{"author":"Reviewer8","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-06-13"},{"author":"Reviewer9","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-01-24"},{"author":"Reviewer10","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-04-22"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Madeo Ristorante in Beverly Hills. This italian restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_106',
    name: 'Lawry's The Prime Rib',
    slug: 'lawrys-the-prime-rib',
    address: '100 N La Cienega Blvd, Beverly Hills, CA 90211',
    phone: '(310) 652-2827',
    website: 'https://lawrysonline.com',
    rating: 4.2,
    reviewCount: 3456,
    priceLevel: 4,
    cuisineTypes: ['steakhouse', 'american'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 10:00 PM","wednesday":"5:00 PM - 10:00 PM","thursday":"6:00 PM - 11:00 PM","friday":"6:00 PM - 11:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 88,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-08-21"},{"author":"Reviewer2","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-04-28"},{"author":"Reviewer3","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-08-29"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Lawry's The Prime Rib in Beverly Hills. This steakhouse restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_107',
    name: 'Rustic Canyon',
    slug: 'rustic-canyon',
    address: '1119 Wilshire Blvd, Santa Monica, CA 90401',
    phone: '(310) 393-7050',
    website: 'https://rusticcanyonwinebar.com',
    rating: 4.5,
    reviewCount: 987,
    priceLevel: 3,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 11:00 PM","wednesday":"7:00 PM - 11:00 PM","thursday":"5:00 PM - 12:00 PM","friday":"6:00 PM - 12:00 PM","saturday":"7:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 90,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-07-06"},{"author":"Reviewer2","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-04-03"},{"author":"Reviewer3","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-06-23"},{"author":"Reviewer4","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-05-17"},{"author":"Reviewer5","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-03-23"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Rustic Canyon in Santa Monica. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_108',
    name: 'Pasjoli',
    slug: 'pasjoli',
    address: '2732 Main St, Santa Monica, CA 90405',
    phone: '(310) 396-9438',
    website: 'https://pasjoli.com',
    rating: 4.6,
    reviewCount: 567,
    priceLevel: 4,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 12:00 PM","wednesday":"5:00 PM - 10:00 PM","thursday":"7:00 PM - 11:00 PM","friday":"5:00 PM - 10:00 PM","saturday":"7:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 93,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-07-04"},{"author":"Reviewer2","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-03-20"},{"author":"Reviewer3","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-04-07"},{"author":"Reviewer4","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-09-19"},{"author":"Reviewer5","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-09-20"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Pasjoli in Santa Monica. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_109',
    name: 'Sushi Park',
    slug: 'sushi-park',
    address: '8539 Sunset Blvd, West Hollywood, CA 90069',
    phone: '(323) 654-2143',
    website: 'https://sushipark.com',
    rating: 4.7,
    reviewCount: 234,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'West Hollywood',
    area: 'West Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 12:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"6:00 PM - 11:00 PM","friday":"7:00 PM - 10:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 95,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2024-10-30"},{"author":"Reviewer2","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-12-30"},{"author":"Reviewer3","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-09-14"},{"author":"Reviewer4","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2024-12-01"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Sushi Park in West Hollywood. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_110',
    name: 'Nobu Los Angeles',
    slug: 'nobu-los-angeles',
    address: '903 N La Cienega Blvd, West Hollywood, CA 90069',
    phone: '(310) 657-0400',
    website: 'https://noburestaurants.com/los-angeles',
    rating: 4.3,
    reviewCount: 4567,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 11:00 PM","wednesday":"5:00 PM - 12:00 PM","thursday":"6:00 PM - 12:00 PM","friday":"5:00 PM - 10:00 PM","saturday":"7:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 86,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-06-09"},{"author":"Reviewer2","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-01-25"},{"author":"Reviewer3","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-08-02"},{"author":"Reviewer4","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-07-15"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Nobu Los Angeles in Beverly Hills. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_111',
    name: 'Geoffrey's Malibu',
    slug: 'geoffreys-malibu',
    address: '27400 Pacific Coast Hwy, Malibu, CA 90265',
    phone: '(310) 457-1519',
    website: 'https://geoffreysmalibu.com',
    rating: 4.4,
    reviewCount: 1890,
    priceLevel: 3,
    cuisineTypes: ['seafood', 'fine_dining'],
    neighborhood: 'Malibu',
    area: 'Malibu',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 12:00 PM","wednesday":"7:00 PM - 12:00 PM","thursday":"7:00 PM - 12:00 PM","friday":"7:00 PM - 10:00 PM","saturday":"5:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 89,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-08-20"},{"author":"Reviewer2","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-08-24"},{"author":"Reviewer3","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-04-16"},{"author":"Reviewer4","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-01-25"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Geoffrey's Malibu in Malibu. This seafood restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_112',
    name: 'Matsuhisa Beverly Hills',
    slug: 'matsuhisa-beverly-hills',
    address: '129 N La Cienega Blvd, Beverly Hills, CA 90211',
    phone: '(310) 659-9639',
    website: 'https://matsuhisabeverlyhills.com',
    rating: 4.5,
    reviewCount: 1234,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 10:00 PM","wednesday":"6:00 PM - 10:00 PM","thursday":"6:00 PM - 12:00 PM","friday":"5:00 PM - 10:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 92,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2024-11-30"},{"author":"Reviewer2","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-01-05"},{"author":"Reviewer3","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-04-09"},{"author":"Reviewer4","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-03-23"},{"author":"Reviewer5","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-06-06"},{"author":"Reviewer6","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-02-08"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Matsuhisa Beverly Hills in Beverly Hills. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_113',
    name: 'Le Comptoir',
    slug: 'le-comptoir',
    address: '1716 N Vermont Ave, Los Angeles, CA 90027',
    phone: '(323) 665-6900',
    website: 'https://lecomptoirla.com',
    rating: 4.6,
    reviewCount: 456,
    priceLevel: 4,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'Hollywood',
    area: 'Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 10:00 PM","wednesday":"5:00 PM - 11:00 PM","thursday":"7:00 PM - 11:00 PM","friday":"6:00 PM - 12:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 94,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2024-12-28"},{"author":"Reviewer2","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-04-13"},{"author":"Reviewer3","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2024-12-18"},{"author":"Reviewer4","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-05-22"},{"author":"Reviewer5","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-03-29"},{"author":"Reviewer6","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-08-19"},{"author":"Reviewer7","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-06-10"},{"author":"Reviewer8","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-07-14"},{"author":"Reviewer9","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-07-28"}],
    isTopRated: true,
    description: 'Experience the perfect date night at Le Comptoir in Hollywood. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_114',
    name: 'Tar & Roses',
    slug: 'tar-roses',
    address: '602 Santa Monica Blvd, Santa Monica, CA 90401',
    phone: '(310) 587-0700',
    website: 'https://tarandroses.com',
    rating: 4.3,
    reviewCount: 789,
    priceLevel: 3,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 12:00 PM","wednesday":"5:00 PM - 11:00 PM","thursday":"6:00 PM - 11:00 PM","friday":"5:00 PM - 12:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 87,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-03-15"},{"author":"Reviewer2","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2024-11-23"},{"author":"Reviewer3","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-04-25"},{"author":"Reviewer4","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-07-06"}],
    isTopRated: true,
    description: 'Experience the perfect date night at Tar & Roses in Santa Monica. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_115',
    name: 'The Little Door',
    slug: 'the-little-door',
    address: '8164 W 3rd St, Los Angeles, CA 90048',
    phone: '(323) 951-1210',
    website: 'https://thelittledoor.com',
    rating: 4.5,
    reviewCount: 1247,
    priceLevel: 3,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'West Hollywood',
    area: 'West Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 10:00 PM","wednesday":"7:00 PM - 11:00 PM","thursday":"7:00 PM - 12:00 PM","friday":"7:00 PM - 12:00 PM","saturday":"5:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 92,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-09-01"},{"author":"Reviewer2","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-10-08"},{"author":"Reviewer3","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-03-07"},{"author":"Reviewer4","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-10-03"}],
    isTopRated: false,
    description: 'Experience the perfect date night at The Little Door in West Hollywood. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_116',
    name: '71Above',
    slug: '71above',
    address: '633 W 5th St, Los Angeles, CA 90071',
    phone: '(213) 712-2683',
    website: 'https://71above.com',
    rating: 4.6,
    reviewCount: 2156,
    priceLevel: 4,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Downtown LA',
    area: 'Downtown LA',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 11:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"7:00 PM - 10:00 PM","friday":"6:00 PM - 11:00 PM","saturday":"5:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 94,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2024-12-10"},{"author":"Reviewer2","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-02-21"},{"author":"Reviewer3","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-08-24"},{"author":"Reviewer4","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-03-13"},{"author":"Reviewer5","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-11-10"},{"author":"Reviewer6","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2024-11-26"},{"author":"Reviewer7","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-05-29"},{"author":"Reviewer8","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-06-17"}],
    isTopRated: false,
    description: 'Experience the perfect date night at 71Above in Downtown LA. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_117',
    name: 'Nobu Malibu',
    slug: 'nobu-malibu',
    address: '22706 Pacific Coast Hwy, Malibu, CA 90265',
    phone: '(310) 317-9140',
    website: 'https://noburestaurants.com/malibu',
    rating: 4.4,
    reviewCount: 3421,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Malibu',
    area: 'Malibu',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 11:00 PM","wednesday":"7:00 PM - 12:00 PM","thursday":"7:00 PM - 11:00 PM","friday":"5:00 PM - 11:00 PM","saturday":"7:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 89,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-04-26"},{"author":"Reviewer2","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-02-19"},{"author":"Reviewer3","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-08-16"},{"author":"Reviewer4","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-06-26"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Nobu Malibu in Malibu. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_118',
    name: 'Giorgio Baldi',
    slug: 'giorgio-baldi',
    address: '114 W Channel Rd, Santa Monica, CA 90402',
    phone: '(310) 573-1660',
    website: 'https://giorgiobaldi.com',
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 4,
    cuisineTypes: ['italian', 'fine_dining'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 11:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"7:00 PM - 12:00 PM","friday":"7:00 PM - 11:00 PM","saturday":"7:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 87,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2024-12-24"},{"author":"Reviewer2","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-06-15"},{"author":"Reviewer3","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-10-31"},{"author":"Reviewer4","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-12-21"},{"author":"Reviewer5","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-02-15"},{"author":"Reviewer6","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-03-25"},{"author":"Reviewer7","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-07-11"},{"author":"Reviewer8","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-06-29"},{"author":"Reviewer9","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2024-11-03"},{"author":"Reviewer10","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-10-10"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Giorgio Baldi in Santa Monica. This italian restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_119',
    name: 'Madeo Ristorante',
    slug: 'madeo-ristorante',
    address: '8897 Beverly Blvd, West Hollywood, CA 90048',
    phone: '(310) 859-4900',
    website: 'https://madeorestaurant.com',
    rating: 4.4,
    reviewCount: 1234,
    priceLevel: 3,
    cuisineTypes: ['italian', 'fine_dining'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 10:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"5:00 PM - 12:00 PM","friday":"7:00 PM - 11:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 91,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-06-08"},{"author":"Reviewer2","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-04-24"},{"author":"Reviewer3","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-02-08"},{"author":"Reviewer4","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-10-30"},{"author":"Reviewer5","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-09-08"},{"author":"Reviewer6","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-01-21"},{"author":"Reviewer7","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-01-19"},{"author":"Reviewer8","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-03-05"},{"author":"Reviewer9","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-02-05"}],
    isTopRated: true,
    description: 'Experience the perfect date night at Madeo Ristorante in Beverly Hills. This italian restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_120',
    name: 'Lawry's The Prime Rib',
    slug: 'lawrys-the-prime-rib',
    address: '100 N La Cienega Blvd, Beverly Hills, CA 90211',
    phone: '(310) 652-2827',
    website: 'https://lawrysonline.com',
    rating: 4.2,
    reviewCount: 3456,
    priceLevel: 4,
    cuisineTypes: ['steakhouse', 'american'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 12:00 PM","wednesday":"6:00 PM - 11:00 PM","thursday":"6:00 PM - 10:00 PM","friday":"6:00 PM - 11:00 PM","saturday":"7:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 88,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2024-12-27"},{"author":"Reviewer2","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-03-22"},{"author":"Reviewer3","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-06-12"},{"author":"Reviewer4","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-08-13"},{"author":"Reviewer5","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-07-19"},{"author":"Reviewer6","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-09-27"},{"author":"Reviewer7","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-02-11"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Lawry's The Prime Rib in Beverly Hills. This steakhouse restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_121',
    name: 'Rustic Canyon',
    slug: 'rustic-canyon',
    address: '1119 Wilshire Blvd, Santa Monica, CA 90401',
    phone: '(310) 393-7050',
    website: 'https://rusticcanyonwinebar.com',
    rating: 4.5,
    reviewCount: 987,
    priceLevel: 3,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 11:00 PM","wednesday":"6:00 PM - 11:00 PM","thursday":"7:00 PM - 12:00 PM","friday":"6:00 PM - 12:00 PM","saturday":"5:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 90,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2024-12-25"},{"author":"Reviewer2","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-01-17"},{"author":"Reviewer3","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-05-28"},{"author":"Reviewer4","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-05-01"},{"author":"Reviewer5","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-02-24"},{"author":"Reviewer6","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-07-31"},{"author":"Reviewer7","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-05-03"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Rustic Canyon in Santa Monica. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_122',
    name: 'Pasjoli',
    slug: 'pasjoli',
    address: '2732 Main St, Santa Monica, CA 90405',
    phone: '(310) 396-9438',
    website: 'https://pasjoli.com',
    rating: 4.6,
    reviewCount: 567,
    priceLevel: 4,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 10:00 PM","wednesday":"7:00 PM - 12:00 PM","thursday":"7:00 PM - 12:00 PM","friday":"7:00 PM - 11:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 93,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-09-12"},{"author":"Reviewer2","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-02-26"},{"author":"Reviewer3","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-09-11"},{"author":"Reviewer4","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-04-08"},{"author":"Reviewer5","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-12-17"},{"author":"Reviewer6","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-10-22"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Pasjoli in Santa Monica. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_123',
    name: 'Sushi Park',
    slug: 'sushi-park',
    address: '8539 Sunset Blvd, West Hollywood, CA 90069',
    phone: '(323) 654-2143',
    website: 'https://sushipark.com',
    rating: 4.7,
    reviewCount: 234,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'West Hollywood',
    area: 'West Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 11:00 PM","wednesday":"5:00 PM - 12:00 PM","thursday":"5:00 PM - 11:00 PM","friday":"5:00 PM - 12:00 PM","saturday":"5:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 95,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2024-12-08"},{"author":"Reviewer2","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-04-04"},{"author":"Reviewer3","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2024-12-09"},{"author":"Reviewer4","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-06-11"},{"author":"Reviewer5","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-12-11"},{"author":"Reviewer6","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-09-14"},{"author":"Reviewer7","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-03-19"},{"author":"Reviewer8","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-07-11"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Sushi Park in West Hollywood. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_124',
    name: 'Nobu Los Angeles',
    slug: 'nobu-los-angeles',
    address: '903 N La Cienega Blvd, West Hollywood, CA 90069',
    phone: '(310) 657-0400',
    website: 'https://noburestaurants.com/los-angeles',
    rating: 4.3,
    reviewCount: 4567,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 10:00 PM","wednesday":"7:00 PM - 10:00 PM","thursday":"5:00 PM - 12:00 PM","friday":"5:00 PM - 10:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 86,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-08-13"},{"author":"Reviewer2","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-09-07"},{"author":"Reviewer3","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-02-11"},{"author":"Reviewer4","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-07-21"},{"author":"Reviewer5","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-01-19"},{"author":"Reviewer6","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2024-12-12"},{"author":"Reviewer7","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2024-11-13"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Nobu Los Angeles in Beverly Hills. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_125',
    name: 'Geoffrey's Malibu',
    slug: 'geoffreys-malibu',
    address: '27400 Pacific Coast Hwy, Malibu, CA 90265',
    phone: '(310) 457-1519',
    website: 'https://geoffreysmalibu.com',
    rating: 4.4,
    reviewCount: 1890,
    priceLevel: 3,
    cuisineTypes: ['seafood', 'fine_dining'],
    neighborhood: 'Malibu',
    area: 'Malibu',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 10:00 PM","wednesday":"7:00 PM - 11:00 PM","thursday":"5:00 PM - 10:00 PM","friday":"5:00 PM - 11:00 PM","saturday":"7:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 89,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-02-16"},{"author":"Reviewer2","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-10-07"},{"author":"Reviewer3","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-05-06"},{"author":"Reviewer4","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-08-08"},{"author":"Reviewer5","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-03-03"},{"author":"Reviewer6","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-03-11"},{"author":"Reviewer7","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-11-15"}],
    isTopRated: true,
    description: 'Experience the perfect date night at Geoffrey's Malibu in Malibu. This seafood restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_126',
    name: 'Matsuhisa Beverly Hills',
    slug: 'matsuhisa-beverly-hills',
    address: '129 N La Cienega Blvd, Beverly Hills, CA 90211',
    phone: '(310) 659-9639',
    website: 'https://matsuhisabeverlyhills.com',
    rating: 4.5,
    reviewCount: 1234,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 12:00 PM","wednesday":"6:00 PM - 10:00 PM","thursday":"5:00 PM - 10:00 PM","friday":"7:00 PM - 11:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 92,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-01-11"},{"author":"Reviewer2","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2024-12-25"},{"author":"Reviewer3","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-03-05"},{"author":"Reviewer4","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2024-11-28"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Matsuhisa Beverly Hills in Beverly Hills. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_127',
    name: 'Le Comptoir',
    slug: 'le-comptoir',
    address: '1716 N Vermont Ave, Los Angeles, CA 90027',
    phone: '(323) 665-6900',
    website: 'https://lecomptoirla.com',
    rating: 4.6,
    reviewCount: 456,
    priceLevel: 4,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'Hollywood',
    area: 'Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 12:00 PM","wednesday":"7:00 PM - 10:00 PM","thursday":"5:00 PM - 11:00 PM","friday":"6:00 PM - 12:00 PM","saturday":"5:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 94,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-02-18"},{"author":"Reviewer2","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-01-08"},{"author":"Reviewer3","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-01-01"},{"author":"Reviewer4","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-07-04"},{"author":"Reviewer5","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-08-10"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Le Comptoir in Hollywood. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_128',
    name: 'Tar & Roses',
    slug: 'tar-roses',
    address: '602 Santa Monica Blvd, Santa Monica, CA 90401',
    phone: '(310) 587-0700',
    website: 'https://tarandroses.com',
    rating: 4.3,
    reviewCount: 789,
    priceLevel: 3,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 11:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"6:00 PM - 11:00 PM","friday":"6:00 PM - 10:00 PM","saturday":"5:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 87,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2024-11-26"},{"author":"Reviewer2","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-09-05"},{"author":"Reviewer3","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-03-09"},{"author":"Reviewer4","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-02-04"},{"author":"Reviewer5","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-02-02"},{"author":"Reviewer6","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-11-08"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Tar & Roses in Santa Monica. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_129',
    name: 'The Little Door',
    slug: 'the-little-door',
    address: '8164 W 3rd St, Los Angeles, CA 90048',
    phone: '(323) 951-1210',
    website: 'https://thelittledoor.com',
    rating: 4.5,
    reviewCount: 1247,
    priceLevel: 3,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'West Hollywood',
    area: 'West Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 12:00 PM","wednesday":"6:00 PM - 11:00 PM","thursday":"5:00 PM - 11:00 PM","friday":"6:00 PM - 11:00 PM","saturday":"5:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 92,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2024-12-23"},{"author":"Reviewer2","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2024-11-22"},{"author":"Reviewer3","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-09-10"},{"author":"Reviewer4","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-09-24"},{"author":"Reviewer5","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-12-10"},{"author":"Reviewer6","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-05-04"}],
    isTopRated: false,
    description: 'Experience the perfect date night at The Little Door in West Hollywood. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_130',
    name: '71Above',
    slug: '71above',
    address: '633 W 5th St, Los Angeles, CA 90071',
    phone: '(213) 712-2683',
    website: 'https://71above.com',
    rating: 4.6,
    reviewCount: 2156,
    priceLevel: 4,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Downtown LA',
    area: 'Downtown LA',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 11:00 PM","wednesday":"7:00 PM - 10:00 PM","thursday":"7:00 PM - 11:00 PM","friday":"6:00 PM - 12:00 PM","saturday":"7:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 94,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-01-24"},{"author":"Reviewer2","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-01-19"},{"author":"Reviewer3","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-04-19"},{"author":"Reviewer4","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-04-02"},{"author":"Reviewer5","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-11-05"},{"author":"Reviewer6","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-12-05"},{"author":"Reviewer7","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-09-12"},{"author":"Reviewer8","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-04-12"},{"author":"Reviewer9","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2024-12-28"},{"author":"Reviewer10","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-04-26"}],
    isTopRated: false,
    description: 'Experience the perfect date night at 71Above in Downtown LA. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_131',
    name: 'Nobu Malibu',
    slug: 'nobu-malibu',
    address: '22706 Pacific Coast Hwy, Malibu, CA 90265',
    phone: '(310) 317-9140',
    website: 'https://noburestaurants.com/malibu',
    rating: 4.4,
    reviewCount: 3421,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Malibu',
    area: 'Malibu',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 10:00 PM","wednesday":"6:00 PM - 10:00 PM","thursday":"7:00 PM - 10:00 PM","friday":"6:00 PM - 12:00 PM","saturday":"7:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 89,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-08-27"},{"author":"Reviewer2","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-02-11"},{"author":"Reviewer3","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-01-19"},{"author":"Reviewer4","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-08-19"},{"author":"Reviewer5","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-04-19"},{"author":"Reviewer6","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-10-08"},{"author":"Reviewer7","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-02-16"},{"author":"Reviewer8","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-02-04"},{"author":"Reviewer9","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-02-24"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Nobu Malibu in Malibu. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_132',
    name: 'Giorgio Baldi',
    slug: 'giorgio-baldi',
    address: '114 W Channel Rd, Santa Monica, CA 90402',
    phone: '(310) 573-1660',
    website: 'https://giorgiobaldi.com',
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 4,
    cuisineTypes: ['italian', 'fine_dining'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 11:00 PM","wednesday":"7:00 PM - 10:00 PM","thursday":"6:00 PM - 12:00 PM","friday":"7:00 PM - 10:00 PM","saturday":"5:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 87,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-11-16"},{"author":"Reviewer2","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-01-15"},{"author":"Reviewer3","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-01-05"},{"author":"Reviewer4","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-11-29"},{"author":"Reviewer5","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-10-18"},{"author":"Reviewer6","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-05-12"},{"author":"Reviewer7","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-08-17"},{"author":"Reviewer8","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-10-08"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Giorgio Baldi in Santa Monica. This italian restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_133',
    name: 'Madeo Ristorante',
    slug: 'madeo-ristorante',
    address: '8897 Beverly Blvd, West Hollywood, CA 90048',
    phone: '(310) 859-4900',
    website: 'https://madeorestaurant.com',
    rating: 4.4,
    reviewCount: 1234,
    priceLevel: 3,
    cuisineTypes: ['italian', 'fine_dining'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 11:00 PM","wednesday":"7:00 PM - 12:00 PM","thursday":"5:00 PM - 11:00 PM","friday":"5:00 PM - 10:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 91,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2024-12-22"},{"author":"Reviewer2","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-09-25"},{"author":"Reviewer3","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-01-18"},{"author":"Reviewer4","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-04-27"},{"author":"Reviewer5","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-03-16"},{"author":"Reviewer6","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-12-28"},{"author":"Reviewer7","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-10-18"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Madeo Ristorante in Beverly Hills. This italian restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_134',
    name: 'Lawry's The Prime Rib',
    slug: 'lawrys-the-prime-rib',
    address: '100 N La Cienega Blvd, Beverly Hills, CA 90211',
    phone: '(310) 652-2827',
    website: 'https://lawrysonline.com',
    rating: 4.2,
    reviewCount: 3456,
    priceLevel: 4,
    cuisineTypes: ['steakhouse', 'american'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 12:00 PM","wednesday":"7:00 PM - 12:00 PM","thursday":"5:00 PM - 11:00 PM","friday":"7:00 PM - 10:00 PM","saturday":"6:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 88,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-07-16"},{"author":"Reviewer2","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-04-25"},{"author":"Reviewer3","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-08-12"},{"author":"Reviewer4","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-06-28"},{"author":"Reviewer5","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-01-06"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Lawry's The Prime Rib in Beverly Hills. This steakhouse restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_135',
    name: 'Rustic Canyon',
    slug: 'rustic-canyon',
    address: '1119 Wilshire Blvd, Santa Monica, CA 90401',
    phone: '(310) 393-7050',
    website: 'https://rusticcanyonwinebar.com',
    rating: 4.5,
    reviewCount: 987,
    priceLevel: 3,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 10:00 PM","wednesday":"7:00 PM - 11:00 PM","thursday":"6:00 PM - 12:00 PM","friday":"7:00 PM - 10:00 PM","saturday":"7:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 90,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-07-20"},{"author":"Reviewer2","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-04-23"},{"author":"Reviewer3","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-06-12"},{"author":"Reviewer4","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-10-17"},{"author":"Reviewer5","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-04-28"},{"author":"Reviewer6","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-07-13"},{"author":"Reviewer7","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-10-08"},{"author":"Reviewer8","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-07-24"},{"author":"Reviewer9","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2024-11-14"},{"author":"Reviewer10","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-01-14"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Rustic Canyon in Santa Monica. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_136',
    name: 'Pasjoli',
    slug: 'pasjoli',
    address: '2732 Main St, Santa Monica, CA 90405',
    phone: '(310) 396-9438',
    website: 'https://pasjoli.com',
    rating: 4.6,
    reviewCount: 567,
    priceLevel: 4,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 10:00 PM","wednesday":"7:00 PM - 10:00 PM","thursday":"5:00 PM - 10:00 PM","friday":"7:00 PM - 11:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 93,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-08-04"},{"author":"Reviewer2","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-09-02"},{"author":"Reviewer3","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-12-10"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Pasjoli in Santa Monica. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_137',
    name: 'Sushi Park',
    slug: 'sushi-park',
    address: '8539 Sunset Blvd, West Hollywood, CA 90069',
    phone: '(323) 654-2143',
    website: 'https://sushipark.com',
    rating: 4.7,
    reviewCount: 234,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'West Hollywood',
    area: 'West Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 10:00 PM","wednesday":"7:00 PM - 11:00 PM","thursday":"7:00 PM - 11:00 PM","friday":"5:00 PM - 10:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 95,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-04-15"},{"author":"Reviewer2","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-05-20"},{"author":"Reviewer3","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-01-09"},{"author":"Reviewer4","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-03-05"},{"author":"Reviewer5","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-10-13"},{"author":"Reviewer6","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-09-11"},{"author":"Reviewer7","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-01-11"},{"author":"Reviewer8","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-02-01"},{"author":"Reviewer9","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-08-19"},{"author":"Reviewer10","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-05-05"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Sushi Park in West Hollywood. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_138',
    name: 'Nobu Los Angeles',
    slug: 'nobu-los-angeles',
    address: '903 N La Cienega Blvd, West Hollywood, CA 90069',
    phone: '(310) 657-0400',
    website: 'https://noburestaurants.com/los-angeles',
    rating: 4.3,
    reviewCount: 4567,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 11:00 PM","wednesday":"5:00 PM - 12:00 PM","thursday":"5:00 PM - 11:00 PM","friday":"5:00 PM - 12:00 PM","saturday":"5:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 86,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-10-12"},{"author":"Reviewer2","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-06-07"},{"author":"Reviewer3","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-01-19"},{"author":"Reviewer4","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-03-19"},{"author":"Reviewer5","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-11-16"},{"author":"Reviewer6","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2024-11-04"},{"author":"Reviewer7","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-05-30"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Nobu Los Angeles in Beverly Hills. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_139',
    name: 'Geoffrey's Malibu',
    slug: 'geoffreys-malibu',
    address: '27400 Pacific Coast Hwy, Malibu, CA 90265',
    phone: '(310) 457-1519',
    website: 'https://geoffreysmalibu.com',
    rating: 4.4,
    reviewCount: 1890,
    priceLevel: 3,
    cuisineTypes: ['seafood', 'fine_dining'],
    neighborhood: 'Malibu',
    area: 'Malibu',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 11:00 PM","wednesday":"5:00 PM - 11:00 PM","thursday":"5:00 PM - 11:00 PM","friday":"6:00 PM - 10:00 PM","saturday":"7:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 89,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-09-12"},{"author":"Reviewer2","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-03-24"},{"author":"Reviewer3","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2024-11-22"},{"author":"Reviewer4","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-06-11"},{"author":"Reviewer5","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-06-21"},{"author":"Reviewer6","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-09-07"},{"author":"Reviewer7","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-04-01"},{"author":"Reviewer8","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-10-04"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Geoffrey's Malibu in Malibu. This seafood restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_140',
    name: 'Matsuhisa Beverly Hills',
    slug: 'matsuhisa-beverly-hills',
    address: '129 N La Cienega Blvd, Beverly Hills, CA 90211',
    phone: '(310) 659-9639',
    website: 'https://matsuhisabeverlyhills.com',
    rating: 4.5,
    reviewCount: 1234,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 10:00 PM","wednesday":"7:00 PM - 11:00 PM","thursday":"7:00 PM - 11:00 PM","friday":"7:00 PM - 11:00 PM","saturday":"6:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 92,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-08-17"},{"author":"Reviewer2","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-09-02"},{"author":"Reviewer3","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-08-25"},{"author":"Reviewer4","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-07-05"},{"author":"Reviewer5","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-12-15"},{"author":"Reviewer6","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2024-12-22"},{"author":"Reviewer7","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-11-08"},{"author":"Reviewer8","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-07-27"},{"author":"Reviewer9","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-03-29"},{"author":"Reviewer10","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-02-17"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Matsuhisa Beverly Hills in Beverly Hills. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_141',
    name: 'Le Comptoir',
    slug: 'le-comptoir',
    address: '1716 N Vermont Ave, Los Angeles, CA 90027',
    phone: '(323) 665-6900',
    website: 'https://lecomptoirla.com',
    rating: 4.6,
    reviewCount: 456,
    priceLevel: 4,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'Hollywood',
    area: 'Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 10:00 PM","wednesday":"7:00 PM - 12:00 PM","thursday":"7:00 PM - 10:00 PM","friday":"5:00 PM - 11:00 PM","saturday":"6:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 94,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-09-30"},{"author":"Reviewer2","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-08-05"},{"author":"Reviewer3","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-07-14"},{"author":"Reviewer4","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-12-14"},{"author":"Reviewer5","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-09-13"},{"author":"Reviewer6","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-05-17"},{"author":"Reviewer7","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-07-31"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Le Comptoir in Hollywood. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_142',
    name: 'Tar & Roses',
    slug: 'tar-roses',
    address: '602 Santa Monica Blvd, Santa Monica, CA 90401',
    phone: '(310) 587-0700',
    website: 'https://tarandroses.com',
    rating: 4.3,
    reviewCount: 789,
    priceLevel: 3,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 11:00 PM","wednesday":"5:00 PM - 12:00 PM","thursday":"6:00 PM - 10:00 PM","friday":"7:00 PM - 11:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 87,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-02-19"},{"author":"Reviewer2","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-08-05"},{"author":"Reviewer3","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-09-06"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Tar & Roses in Santa Monica. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  }
,
  {
    id: 'restaurant_101',
    name: 'The Little Door',
    slug: 'the-little-door',
    address: '8164 W 3rd St, Los Angeles, CA 90048',
    phone: '(323) 951-1210',
    website: 'https://thelittledoor.com',
    rating: 4.5,
    reviewCount: 1247,
    priceLevel: 3,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'West Hollywood',
    area: 'West Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 11:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"7:00 PM - 12:00 PM","friday":"6:00 PM - 11:00 PM","saturday":"5:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 92,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-02-08"},{"author":"Reviewer2","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-03-13"},{"author":"Reviewer3","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2024-11-10"},{"author":"Reviewer4","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2024-11-20"},{"author":"Reviewer5","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-04-17"},{"author":"Reviewer6","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-08-14"},{"author":"Reviewer7","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2024-12-18"}],
    isTopRated: false,
    description: 'Experience the perfect date night at The Little Door in West Hollywood. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_102',
    name: '71Above',
    slug: '71above',
    address: '633 W 5th St, Los Angeles, CA 90071',
    phone: '(213) 712-2683',
    website: 'https://71above.com',
    rating: 4.6,
    reviewCount: 2156,
    priceLevel: 4,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Downtown LA',
    area: 'Downtown LA',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 12:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"5:00 PM - 12:00 PM","friday":"7:00 PM - 10:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 94,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-03-31"},{"author":"Reviewer2","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-08-21"},{"author":"Reviewer3","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-07-11"},{"author":"Reviewer4","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-08-13"}],
    isTopRated: false,
    description: 'Experience the perfect date night at 71Above in Downtown LA. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_103',
    name: 'Nobu Malibu',
    slug: 'nobu-malibu',
    address: '22706 Pacific Coast Hwy, Malibu, CA 90265',
    phone: '(310) 317-9140',
    website: 'https://noburestaurants.com/malibu',
    rating: 4.4,
    reviewCount: 3421,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Malibu',
    area: 'Malibu',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 11:00 PM","wednesday":"7:00 PM - 11:00 PM","thursday":"7:00 PM - 10:00 PM","friday":"6:00 PM - 10:00 PM","saturday":"7:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 89,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-09-02"},{"author":"Reviewer2","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-03-03"},{"author":"Reviewer3","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-03-12"},{"author":"Reviewer4","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-02-28"},{"author":"Reviewer5","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-03-04"},{"author":"Reviewer6","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-06-29"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Nobu Malibu in Malibu. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_104',
    name: 'Giorgio Baldi',
    slug: 'giorgio-baldi',
    address: '114 W Channel Rd, Santa Monica, CA 90402',
    phone: '(310) 573-1660',
    website: 'https://giorgiobaldi.com',
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 4,
    cuisineTypes: ['italian', 'fine_dining'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 12:00 PM","wednesday":"7:00 PM - 10:00 PM","thursday":"5:00 PM - 10:00 PM","friday":"5:00 PM - 11:00 PM","saturday":"7:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 87,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2024-12-16"},{"author":"Reviewer2","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-06-18"},{"author":"Reviewer3","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-12-21"},{"author":"Reviewer4","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-07-09"},{"author":"Reviewer5","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-09-29"},{"author":"Reviewer6","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-10-19"},{"author":"Reviewer7","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-09-13"},{"author":"Reviewer8","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-04-06"},{"author":"Reviewer9","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-04-30"},{"author":"Reviewer10","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2024-12-29"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Giorgio Baldi in Santa Monica. This italian restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_105',
    name: 'Madeo Ristorante',
    slug: 'madeo-ristorante',
    address: '8897 Beverly Blvd, West Hollywood, CA 90048',
    phone: '(310) 859-4900',
    website: 'https://madeorestaurant.com',
    rating: 4.4,
    reviewCount: 1234,
    priceLevel: 3,
    cuisineTypes: ['italian', 'fine_dining'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 11:00 PM","wednesday":"6:00 PM - 11:00 PM","thursday":"7:00 PM - 10:00 PM","friday":"6:00 PM - 10:00 PM","saturday":"7:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 91,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-04-09"},{"author":"Reviewer2","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-07-17"},{"author":"Reviewer3","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-02-05"},{"author":"Reviewer4","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-10-04"},{"author":"Reviewer5","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-07-22"},{"author":"Reviewer6","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-10-07"},{"author":"Reviewer7","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-01-01"},{"author":"Reviewer8","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-03-29"},{"author":"Reviewer9","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-08-01"},{"author":"Reviewer10","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-08-12"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Madeo Ristorante in Beverly Hills. This italian restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_106',
    name: 'Lawry\'s The Prime Rib',
    slug: 'lawrys-the-prime-rib',
    address: '100 N La Cienega Blvd, Beverly Hills, CA 90211',
    phone: '(310) 652-2827',
    website: 'https://lawrysonline.com',
    rating: 4.2,
    reviewCount: 3456,
    priceLevel: 4,
    cuisineTypes: ['steakhouse', 'american'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 12:00 PM","wednesday":"7:00 PM - 11:00 PM","thursday":"6:00 PM - 12:00 PM","friday":"7:00 PM - 11:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 88,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-09-11"},{"author":"Reviewer2","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-03-02"},{"author":"Reviewer3","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2024-10-20"},{"author":"Reviewer4","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-01-13"},{"author":"Reviewer5","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-10-10"},{"author":"Reviewer6","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-08-21"},{"author":"Reviewer7","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-02-14"},{"author":"Reviewer8","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-06-08"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Lawry\'s The Prime Rib in Beverly Hills. This steakhouse restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_107',
    name: 'Rustic Canyon',
    slug: 'rustic-canyon',
    address: '1119 Wilshire Blvd, Santa Monica, CA 90401',
    phone: '(310) 393-7050',
    website: 'https://rusticcanyonwinebar.com',
    rating: 4.5,
    reviewCount: 987,
    priceLevel: 3,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 10:00 PM","wednesday":"7:00 PM - 12:00 PM","thursday":"5:00 PM - 10:00 PM","friday":"5:00 PM - 11:00 PM","saturday":"7:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 90,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2024-12-09"},{"author":"Reviewer2","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-08-03"},{"author":"Reviewer3","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-06-15"},{"author":"Reviewer4","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-08-26"},{"author":"Reviewer5","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-07-26"},{"author":"Reviewer6","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-07-31"},{"author":"Reviewer7","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-04-14"},{"author":"Reviewer8","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-03-18"},{"author":"Reviewer9","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2024-12-02"},{"author":"Reviewer10","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2024-10-29"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Rustic Canyon in Santa Monica. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_108',
    name: 'Pasjoli',
    slug: 'pasjoli',
    address: '2732 Main St, Santa Monica, CA 90405',
    phone: '(310) 396-9438',
    website: 'https://pasjoli.com',
    rating: 4.6,
    reviewCount: 567,
    priceLevel: 4,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 12:00 PM","wednesday":"6:00 PM - 11:00 PM","thursday":"5:00 PM - 11:00 PM","friday":"5:00 PM - 12:00 PM","saturday":"5:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 93,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-04-18"},{"author":"Reviewer2","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-06-25"},{"author":"Reviewer3","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2024-11-14"}],
    isTopRated: true,
    description: 'Experience the perfect date night at Pasjoli in Santa Monica. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_109',
    name: 'Sushi Park',
    slug: 'sushi-park',
    address: '8539 Sunset Blvd, West Hollywood, CA 90069',
    phone: '(323) 654-2143',
    website: 'https://sushipark.com',
    rating: 4.7,
    reviewCount: 234,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'West Hollywood',
    area: 'West Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 12:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"7:00 PM - 10:00 PM","friday":"5:00 PM - 12:00 PM","saturday":"6:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 95,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-03-03"},{"author":"Reviewer2","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2024-12-14"},{"author":"Reviewer3","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-05-23"},{"author":"Reviewer4","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-08-02"},{"author":"Reviewer5","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-10-30"},{"author":"Reviewer6","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-09-09"},{"author":"Reviewer7","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-09-13"},{"author":"Reviewer8","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-05-04"},{"author":"Reviewer9","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-05-25"},{"author":"Reviewer10","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-10-29"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Sushi Park in West Hollywood. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_110',
    name: 'Nobu Los Angeles',
    slug: 'nobu-los-angeles',
    address: '903 N La Cienega Blvd, West Hollywood, CA 90069',
    phone: '(310) 657-0400',
    website: 'https://noburestaurants.com/los-angeles',
    rating: 4.3,
    reviewCount: 4567,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 11:00 PM","wednesday":"5:00 PM - 12:00 PM","thursday":"5:00 PM - 11:00 PM","friday":"6:00 PM - 10:00 PM","saturday":"7:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 86,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-03-07"},{"author":"Reviewer2","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-08-03"},{"author":"Reviewer3","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-03-05"},{"author":"Reviewer4","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2024-11-30"},{"author":"Reviewer5","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-08-16"},{"author":"Reviewer6","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-06-12"},{"author":"Reviewer7","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-04-27"},{"author":"Reviewer8","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-07-22"},{"author":"Reviewer9","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-09-02"},{"author":"Reviewer10","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-02-23"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Nobu Los Angeles in Beverly Hills. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_111',
    name: 'Geoffrey\'s Malibu',
    slug: 'geoffreys-malibu',
    address: '27400 Pacific Coast Hwy, Malibu, CA 90265',
    phone: '(310) 457-1519',
    website: 'https://geoffreysmalibu.com',
    rating: 4.4,
    reviewCount: 1890,
    priceLevel: 3,
    cuisineTypes: ['seafood', 'fine_dining'],
    neighborhood: 'Malibu',
    area: 'Malibu',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 10:00 PM","wednesday":"6:00 PM - 11:00 PM","thursday":"6:00 PM - 10:00 PM","friday":"6:00 PM - 10:00 PM","saturday":"5:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 89,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2024-12-20"},{"author":"Reviewer2","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-08-28"},{"author":"Reviewer3","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2024-10-25"},{"author":"Reviewer4","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-07-09"},{"author":"Reviewer5","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-06-20"},{"author":"Reviewer6","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-01-14"},{"author":"Reviewer7","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-08-01"},{"author":"Reviewer8","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-02-08"},{"author":"Reviewer9","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-03-15"},{"author":"Reviewer10","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-05-13"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Geoffrey\'s Malibu in Malibu. This seafood restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_112',
    name: 'Matsuhisa Beverly Hills',
    slug: 'matsuhisa-beverly-hills',
    address: '129 N La Cienega Blvd, Beverly Hills, CA 90211',
    phone: '(310) 659-9639',
    website: 'https://matsuhisabeverlyhills.com',
    rating: 4.5,
    reviewCount: 1234,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 10:00 PM","wednesday":"7:00 PM - 12:00 PM","thursday":"7:00 PM - 12:00 PM","friday":"5:00 PM - 10:00 PM","saturday":"5:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 92,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-04-22"},{"author":"Reviewer2","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-02-01"},{"author":"Reviewer3","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-10-15"},{"author":"Reviewer4","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-10-31"},{"author":"Reviewer5","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2024-11-14"},{"author":"Reviewer6","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-08-12"},{"author":"Reviewer7","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-09-07"},{"author":"Reviewer8","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-03-06"},{"author":"Reviewer9","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-02-26"},{"author":"Reviewer10","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-07-23"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Matsuhisa Beverly Hills in Beverly Hills. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_113',
    name: 'Le Comptoir',
    slug: 'le-comptoir',
    address: '1716 N Vermont Ave, Los Angeles, CA 90027',
    phone: '(323) 665-6900',
    website: 'https://lecomptoirla.com',
    rating: 4.6,
    reviewCount: 456,
    priceLevel: 4,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'Hollywood',
    area: 'Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 12:00 PM","wednesday":"6:00 PM - 10:00 PM","thursday":"5:00 PM - 10:00 PM","friday":"5:00 PM - 12:00 PM","saturday":"7:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 94,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-06-29"},{"author":"Reviewer2","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-06-09"},{"author":"Reviewer3","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2024-11-01"},{"author":"Reviewer4","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-08-11"},{"author":"Reviewer5","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2024-11-18"},{"author":"Reviewer6","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-07-21"},{"author":"Reviewer7","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2024-10-31"},{"author":"Reviewer8","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-04-15"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Le Comptoir in Hollywood. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_114',
    name: 'Tar & Roses',
    slug: 'tar-roses',
    address: '602 Santa Monica Blvd, Santa Monica, CA 90401',
    phone: '(310) 587-0700',
    website: 'https://tarandroses.com',
    rating: 4.3,
    reviewCount: 789,
    priceLevel: 3,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 11:00 PM","wednesday":"5:00 PM - 12:00 PM","thursday":"7:00 PM - 10:00 PM","friday":"5:00 PM - 10:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 87,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2024-11-23"},{"author":"Reviewer2","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-01-07"},{"author":"Reviewer3","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-08-11"},{"author":"Reviewer4","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-04-04"},{"author":"Reviewer5","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2024-12-20"},{"author":"Reviewer6","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2024-12-10"},{"author":"Reviewer7","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-10-11"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Tar & Roses in Santa Monica. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_115',
    name: 'The Little Door',
    slug: 'the-little-door',
    address: '8164 W 3rd St, Los Angeles, CA 90048',
    phone: '(323) 951-1210',
    website: 'https://thelittledoor.com',
    rating: 4.5,
    reviewCount: 1247,
    priceLevel: 3,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'West Hollywood',
    area: 'West Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 10:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"7:00 PM - 10:00 PM","friday":"6:00 PM - 12:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 92,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-05-20"},{"author":"Reviewer2","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-12-13"},{"author":"Reviewer3","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-06-19"},{"author":"Reviewer4","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-03-03"},{"author":"Reviewer5","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-05-11"},{"author":"Reviewer6","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-08-16"},{"author":"Reviewer7","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-01-11"},{"author":"Reviewer8","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-03-07"}],
    isTopRated: false,
    description: 'Experience the perfect date night at The Little Door in West Hollywood. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_116',
    name: '71Above',
    slug: '71above',
    address: '633 W 5th St, Los Angeles, CA 90071',
    phone: '(213) 712-2683',
    website: 'https://71above.com',
    rating: 4.6,
    reviewCount: 2156,
    priceLevel: 4,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Downtown LA',
    area: 'Downtown LA',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 10:00 PM","wednesday":"7:00 PM - 12:00 PM","thursday":"7:00 PM - 10:00 PM","friday":"7:00 PM - 12:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 94,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-01-20"},{"author":"Reviewer2","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-03-08"},{"author":"Reviewer3","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2024-12-25"},{"author":"Reviewer4","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-07-28"},{"author":"Reviewer5","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-02-27"}],
    isTopRated: false,
    description: 'Experience the perfect date night at 71Above in Downtown LA. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_117',
    name: 'Nobu Malibu',
    slug: 'nobu-malibu',
    address: '22706 Pacific Coast Hwy, Malibu, CA 90265',
    phone: '(310) 317-9140',
    website: 'https://noburestaurants.com/malibu',
    rating: 4.4,
    reviewCount: 3421,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Malibu',
    area: 'Malibu',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 12:00 PM","wednesday":"7:00 PM - 10:00 PM","thursday":"5:00 PM - 12:00 PM","friday":"5:00 PM - 12:00 PM","saturday":"5:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 89,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-12-17"},{"author":"Reviewer2","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2024-12-01"},{"author":"Reviewer3","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-06-05"},{"author":"Reviewer4","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2024-11-09"},{"author":"Reviewer5","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-09-16"},{"author":"Reviewer6","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-11-27"},{"author":"Reviewer7","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-06-06"},{"author":"Reviewer8","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-03-09"},{"author":"Reviewer9","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-04-21"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Nobu Malibu in Malibu. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_118',
    name: 'Giorgio Baldi',
    slug: 'giorgio-baldi',
    address: '114 W Channel Rd, Santa Monica, CA 90402',
    phone: '(310) 573-1660',
    website: 'https://giorgiobaldi.com',
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 4,
    cuisineTypes: ['italian', 'fine_dining'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 10:00 PM","wednesday":"5:00 PM - 11:00 PM","thursday":"7:00 PM - 11:00 PM","friday":"5:00 PM - 12:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 87,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-05-25"},{"author":"Reviewer2","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-04-29"},{"author":"Reviewer3","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-08-26"},{"author":"Reviewer4","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-09-03"},{"author":"Reviewer5","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-10-09"},{"author":"Reviewer6","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-10-01"},{"author":"Reviewer7","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2024-11-12"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Giorgio Baldi in Santa Monica. This italian restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_119',
    name: 'Madeo Ristorante',
    slug: 'madeo-ristorante',
    address: '8897 Beverly Blvd, West Hollywood, CA 90048',
    phone: '(310) 859-4900',
    website: 'https://madeorestaurant.com',
    rating: 4.4,
    reviewCount: 1234,
    priceLevel: 3,
    cuisineTypes: ['italian', 'fine_dining'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 10:00 PM","wednesday":"6:00 PM - 10:00 PM","thursday":"5:00 PM - 12:00 PM","friday":"5:00 PM - 12:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 91,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-03-31"},{"author":"Reviewer2","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-04-24"},{"author":"Reviewer3","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-02-25"},{"author":"Reviewer4","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-03-01"},{"author":"Reviewer5","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2024-11-25"},{"author":"Reviewer6","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-08-24"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Madeo Ristorante in Beverly Hills. This italian restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_120',
    name: 'Lawry\'s The Prime Rib',
    slug: 'lawrys-the-prime-rib',
    address: '100 N La Cienega Blvd, Beverly Hills, CA 90211',
    phone: '(310) 652-2827',
    website: 'https://lawrysonline.com',
    rating: 4.2,
    reviewCount: 3456,
    priceLevel: 4,
    cuisineTypes: ['steakhouse', 'american'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 12:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"7:00 PM - 12:00 PM","friday":"6:00 PM - 12:00 PM","saturday":"6:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 88,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-03-23"},{"author":"Reviewer2","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-10-09"},{"author":"Reviewer3","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-07-13"},{"author":"Reviewer4","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-11-10"},{"author":"Reviewer5","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2024-12-31"},{"author":"Reviewer6","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-05-19"},{"author":"Reviewer7","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-08-26"},{"author":"Reviewer8","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-07-09"},{"author":"Reviewer9","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-05-26"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Lawry\'s The Prime Rib in Beverly Hills. This steakhouse restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_121',
    name: 'Rustic Canyon',
    slug: 'rustic-canyon',
    address: '1119 Wilshire Blvd, Santa Monica, CA 90401',
    phone: '(310) 393-7050',
    website: 'https://rusticcanyonwinebar.com',
    rating: 4.5,
    reviewCount: 987,
    priceLevel: 3,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 12:00 PM","wednesday":"5:00 PM - 11:00 PM","thursday":"6:00 PM - 11:00 PM","friday":"7:00 PM - 12:00 PM","saturday":"5:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 90,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-05-29"},{"author":"Reviewer2","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-08-01"},{"author":"Reviewer3","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2024-11-22"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Rustic Canyon in Santa Monica. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_122',
    name: 'Pasjoli',
    slug: 'pasjoli',
    address: '2732 Main St, Santa Monica, CA 90405',
    phone: '(310) 396-9438',
    website: 'https://pasjoli.com',
    rating: 4.6,
    reviewCount: 567,
    priceLevel: 4,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 12:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"6:00 PM - 12:00 PM","friday":"7:00 PM - 12:00 PM","saturday":"6:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 93,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-02-20"},{"author":"Reviewer2","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-01-16"},{"author":"Reviewer3","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-05-30"},{"author":"Reviewer4","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2024-12-01"},{"author":"Reviewer5","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-09-17"},{"author":"Reviewer6","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-04-12"},{"author":"Reviewer7","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-06-05"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Pasjoli in Santa Monica. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_123',
    name: 'Sushi Park',
    slug: 'sushi-park',
    address: '8539 Sunset Blvd, West Hollywood, CA 90069',
    phone: '(323) 654-2143',
    website: 'https://sushipark.com',
    rating: 4.7,
    reviewCount: 234,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'West Hollywood',
    area: 'West Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 10:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"7:00 PM - 10:00 PM","friday":"5:00 PM - 12:00 PM","saturday":"5:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 95,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-07-11"},{"author":"Reviewer2","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2024-10-30"},{"author":"Reviewer3","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-01-19"},{"author":"Reviewer4","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-11-02"},{"author":"Reviewer5","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-01-31"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Sushi Park in West Hollywood. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_124',
    name: 'Nobu Los Angeles',
    slug: 'nobu-los-angeles',
    address: '903 N La Cienega Blvd, West Hollywood, CA 90069',
    phone: '(310) 657-0400',
    website: 'https://noburestaurants.com/los-angeles',
    rating: 4.3,
    reviewCount: 4567,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 12:00 PM","wednesday":"5:00 PM - 10:00 PM","thursday":"7:00 PM - 10:00 PM","friday":"6:00 PM - 10:00 PM","saturday":"7:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 86,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-02-07"},{"author":"Reviewer2","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-05-20"},{"author":"Reviewer3","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-05-24"},{"author":"Reviewer4","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-03-20"}],
    isTopRated: true,
    description: 'Experience the perfect date night at Nobu Los Angeles in Beverly Hills. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_125',
    name: 'Geoffrey\'s Malibu',
    slug: 'geoffreys-malibu',
    address: '27400 Pacific Coast Hwy, Malibu, CA 90265',
    phone: '(310) 457-1519',
    website: 'https://geoffreysmalibu.com',
    rating: 4.4,
    reviewCount: 1890,
    priceLevel: 3,
    cuisineTypes: ['seafood', 'fine_dining'],
    neighborhood: 'Malibu',
    area: 'Malibu',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 11:00 PM","wednesday":"6:00 PM - 10:00 PM","thursday":"6:00 PM - 11:00 PM","friday":"7:00 PM - 12:00 PM","saturday":"7:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 89,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2024-12-29"},{"author":"Reviewer2","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-01-13"},{"author":"Reviewer3","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-02-11"},{"author":"Reviewer4","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-02-20"},{"author":"Reviewer5","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-02-16"},{"author":"Reviewer6","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-09-24"},{"author":"Reviewer7","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-12-25"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Geoffrey\'s Malibu in Malibu. This seafood restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_126',
    name: 'Matsuhisa Beverly Hills',
    slug: 'matsuhisa-beverly-hills',
    address: '129 N La Cienega Blvd, Beverly Hills, CA 90211',
    phone: '(310) 659-9639',
    website: 'https://matsuhisabeverlyhills.com',
    rating: 4.5,
    reviewCount: 1234,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 12:00 PM","wednesday":"6:00 PM - 10:00 PM","thursday":"5:00 PM - 12:00 PM","friday":"5:00 PM - 10:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 92,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-08-12"},{"author":"Reviewer2","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-07-15"},{"author":"Reviewer3","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-05-16"},{"author":"Reviewer4","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-08-24"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Matsuhisa Beverly Hills in Beverly Hills. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_127',
    name: 'Le Comptoir',
    slug: 'le-comptoir',
    address: '1716 N Vermont Ave, Los Angeles, CA 90027',
    phone: '(323) 665-6900',
    website: 'https://lecomptoirla.com',
    rating: 4.6,
    reviewCount: 456,
    priceLevel: 4,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'Hollywood',
    area: 'Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 12:00 PM","wednesday":"6:00 PM - 11:00 PM","thursday":"7:00 PM - 11:00 PM","friday":"7:00 PM - 11:00 PM","saturday":"6:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 94,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-05-25"},{"author":"Reviewer2","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2025-02-18"},{"author":"Reviewer3","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-08-25"},{"author":"Reviewer4","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-02-27"},{"author":"Reviewer5","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-08-05"},{"author":"Reviewer6","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-07-27"},{"author":"Reviewer7","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-10-16"}],
    isTopRated: true,
    description: 'Experience the perfect date night at Le Comptoir in Hollywood. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_128',
    name: 'Tar & Roses',
    slug: 'tar-roses',
    address: '602 Santa Monica Blvd, Santa Monica, CA 90401',
    phone: '(310) 587-0700',
    website: 'https://tarandroses.com',
    rating: 4.3,
    reviewCount: 789,
    priceLevel: 3,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 12:00 PM","wednesday":"6:00 PM - 11:00 PM","thursday":"6:00 PM - 11:00 PM","friday":"6:00 PM - 12:00 PM","saturday":"5:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 87,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-06-08"},{"author":"Reviewer2","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-12-04"},{"author":"Reviewer3","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2024-11-30"},{"author":"Reviewer4","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-10-03"},{"author":"Reviewer5","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-01-20"},{"author":"Reviewer6","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-06-30"},{"author":"Reviewer7","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2024-12-14"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Tar & Roses in Santa Monica. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_129',
    name: 'The Little Door',
    slug: 'the-little-door',
    address: '8164 W 3rd St, Los Angeles, CA 90048',
    phone: '(323) 951-1210',
    website: 'https://thelittledoor.com',
    rating: 4.5,
    reviewCount: 1247,
    priceLevel: 3,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'West Hollywood',
    area: 'West Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 12:00 PM","wednesday":"5:00 PM - 10:00 PM","thursday":"6:00 PM - 10:00 PM","friday":"5:00 PM - 12:00 PM","saturday":"5:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 92,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-07-23"},{"author":"Reviewer2","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-09-18"},{"author":"Reviewer3","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-05-12"},{"author":"Reviewer4","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-06-13"}],
    isTopRated: false,
    description: 'Experience the perfect date night at The Little Door in West Hollywood. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_130',
    name: '71Above',
    slug: '71above',
    address: '633 W 5th St, Los Angeles, CA 90071',
    phone: '(213) 712-2683',
    website: 'https://71above.com',
    rating: 4.6,
    reviewCount: 2156,
    priceLevel: 4,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Downtown LA',
    area: 'Downtown LA',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 10:00 PM","wednesday":"5:00 PM - 11:00 PM","thursday":"5:00 PM - 11:00 PM","friday":"5:00 PM - 11:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 94,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-11-18"},{"author":"Reviewer2","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-04-17"},{"author":"Reviewer3","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-11-15"},{"author":"Reviewer4","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-01-30"},{"author":"Reviewer5","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-06-04"},{"author":"Reviewer6","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-11-08"},{"author":"Reviewer7","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-10-07"},{"author":"Reviewer8","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-05-09"}],
    isTopRated: false,
    description: 'Experience the perfect date night at 71Above in Downtown LA. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_131',
    name: 'Nobu Malibu',
    slug: 'nobu-malibu',
    address: '22706 Pacific Coast Hwy, Malibu, CA 90265',
    phone: '(310) 317-9140',
    website: 'https://noburestaurants.com/malibu',
    rating: 4.4,
    reviewCount: 3421,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Malibu',
    area: 'Malibu',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 10:00 PM","wednesday":"5:00 PM - 10:00 PM","thursday":"6:00 PM - 10:00 PM","friday":"7:00 PM - 10:00 PM","saturday":"7:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 89,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-03-01"},{"author":"Reviewer2","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-07-13"},{"author":"Reviewer3","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-02-09"},{"author":"Reviewer4","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-10-11"},{"author":"Reviewer5","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-01-17"},{"author":"Reviewer6","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-04-03"},{"author":"Reviewer7","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-08-28"},{"author":"Reviewer8","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2024-12-30"},{"author":"Reviewer9","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-04-20"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Nobu Malibu in Malibu. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_132',
    name: 'Giorgio Baldi',
    slug: 'giorgio-baldi',
    address: '114 W Channel Rd, Santa Monica, CA 90402',
    phone: '(310) 573-1660',
    website: 'https://giorgiobaldi.com',
    rating: 4.3,
    reviewCount: 1876,
    priceLevel: 4,
    cuisineTypes: ['italian', 'fine_dining'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 12:00 PM","wednesday":"5:00 PM - 11:00 PM","thursday":"6:00 PM - 11:00 PM","friday":"7:00 PM - 11:00 PM","saturday":"7:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 87,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-07-20"},{"author":"Reviewer2","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-05-09"},{"author":"Reviewer3","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-06-02"},{"author":"Reviewer4","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-10-11"},{"author":"Reviewer5","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-06-17"},{"author":"Reviewer6","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-08-18"},{"author":"Reviewer7","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-07-31"},{"author":"Reviewer8","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-02-28"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Giorgio Baldi in Santa Monica. This italian restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_133',
    name: 'Madeo Ristorante',
    slug: 'madeo-ristorante',
    address: '8897 Beverly Blvd, West Hollywood, CA 90048',
    phone: '(310) 859-4900',
    website: 'https://madeorestaurant.com',
    rating: 4.4,
    reviewCount: 1234,
    priceLevel: 3,
    cuisineTypes: ['italian', 'fine_dining'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"7:00 PM - 12:00 PM","wednesday":"6:00 PM - 10:00 PM","thursday":"7:00 PM - 12:00 PM","friday":"7:00 PM - 11:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 91,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-02-06"},{"author":"Reviewer2","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-02-18"},{"author":"Reviewer3","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-02-25"},{"author":"Reviewer4","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-10-30"},{"author":"Reviewer5","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-06-03"},{"author":"Reviewer6","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-11-02"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Madeo Ristorante in Beverly Hills. This italian restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_134',
    name: 'Lawry\'s The Prime Rib',
    slug: 'lawrys-the-prime-rib',
    address: '100 N La Cienega Blvd, Beverly Hills, CA 90211',
    phone: '(310) 652-2827',
    website: 'https://lawrysonline.com',
    rating: 4.2,
    reviewCount: 3456,
    priceLevel: 4,
    cuisineTypes: ['steakhouse', 'american'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 10:00 PM","wednesday":"7:00 PM - 12:00 PM","thursday":"5:00 PM - 10:00 PM","friday":"6:00 PM - 11:00 PM","saturday":"5:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 88,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-03-20"},{"author":"Reviewer2","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-02-24"},{"author":"Reviewer3","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-10-02"},{"author":"Reviewer4","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-05-09"},{"author":"Reviewer5","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2024-11-06"},{"author":"Reviewer6","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-04-05"},{"author":"Reviewer7","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-06-29"},{"author":"Reviewer8","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-03-27"},{"author":"Reviewer9","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-03-15"},{"author":"Reviewer10","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-01-27"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Lawry\'s The Prime Rib in Beverly Hills. This steakhouse restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_135',
    name: 'Rustic Canyon',
    slug: 'rustic-canyon',
    address: '1119 Wilshire Blvd, Santa Monica, CA 90401',
    phone: '(310) 393-7050',
    website: 'https://rusticcanyonwinebar.com',
    rating: 4.5,
    reviewCount: 987,
    priceLevel: 3,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 11:00 PM","wednesday":"6:00 PM - 11:00 PM","thursday":"5:00 PM - 12:00 PM","friday":"5:00 PM - 10:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 90,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-01-28"},{"author":"Reviewer2","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-12-08"},{"author":"Reviewer3","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2024-11-25"},{"author":"Reviewer4","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-01-25"},{"author":"Reviewer5","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-11-14"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Rustic Canyon in Santa Monica. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_136',
    name: 'Pasjoli',
    slug: 'pasjoli',
    address: '2732 Main St, Santa Monica, CA 90405',
    phone: '(310) 396-9438',
    website: 'https://pasjoli.com',
    rating: 4.6,
    reviewCount: 567,
    priceLevel: 4,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 12:00 PM","wednesday":"6:00 PM - 10:00 PM","thursday":"6:00 PM - 11:00 PM","friday":"6:00 PM - 11:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 93,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-12-14"},{"author":"Reviewer2","rating":5,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2025-01-25"},{"author":"Reviewer3","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2024-12-09"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Pasjoli in Santa Monica. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_137',
    name: 'Sushi Park',
    slug: 'sushi-park',
    address: '8539 Sunset Blvd, West Hollywood, CA 90069',
    phone: '(323) 654-2143',
    website: 'https://sushipark.com',
    rating: 4.7,
    reviewCount: 234,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'West Hollywood',
    area: 'West Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 11:00 PM","wednesday":"5:00 PM - 11:00 PM","thursday":"5:00 PM - 10:00 PM","friday":"6:00 PM - 10:00 PM","saturday":"7:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 95,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-09-07"},{"author":"Reviewer2","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-10-31"},{"author":"Reviewer3","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2024-11-28"},{"author":"Reviewer4","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-07-05"},{"author":"Reviewer5","rating":5,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-12-15"},{"author":"Reviewer6","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2025-02-03"},{"author":"Reviewer7","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2024-12-31"},{"author":"Reviewer8","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-02-12"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Sushi Park in West Hollywood. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_138',
    name: 'Nobu Los Angeles',
    slug: 'nobu-los-angeles',
    address: '903 N La Cienega Blvd, West Hollywood, CA 90069',
    phone: '(310) 657-0400',
    website: 'https://noburestaurants.com/los-angeles',
    rating: 4.3,
    reviewCount: 4567,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 10:00 PM","wednesday":"5:00 PM - 11:00 PM","thursday":"7:00 PM - 12:00 PM","friday":"5:00 PM - 10:00 PM","saturday":"5:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 86,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2024-12-16"},{"author":"Reviewer2","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-06-28"},{"author":"Reviewer3","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-07-10"},{"author":"Reviewer4","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-01-12"},{"author":"Reviewer5","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-10-01"},{"author":"Reviewer6","rating":5,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2024-11-26"}],
    isTopRated: true,
    description: 'Experience the perfect date night at Nobu Los Angeles in Beverly Hills. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_139',
    name: 'Geoffrey\'s Malibu',
    slug: 'geoffreys-malibu',
    address: '27400 Pacific Coast Hwy, Malibu, CA 90265',
    phone: '(310) 457-1519',
    website: 'https://geoffreysmalibu.com',
    rating: 4.4,
    reviewCount: 1890,
    priceLevel: 3,
    cuisineTypes: ['seafood', 'fine_dining'],
    neighborhood: 'Malibu',
    area: 'Malibu',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 11:00 PM","wednesday":"5:00 PM - 12:00 PM","thursday":"6:00 PM - 10:00 PM","friday":"7:00 PM - 12:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 89,
    reviews: [{"author":"Reviewer1","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2024-10-26"},{"author":"Reviewer2","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-08-23"},{"author":"Reviewer3","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-05-20"},{"author":"Reviewer4","rating":5,"text":"Amazing experience! The staff was attentive and the ambiance was perfect for a romantic dinner.","date":"2024-12-31"},{"author":"Reviewer5","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-05-15"},{"author":"Reviewer6","rating":4,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2024-12-29"},{"author":"Reviewer7","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-04-10"},{"author":"Reviewer8","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-03-22"},{"author":"Reviewer9","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-09-19"}],
    isTopRated: true,
    description: 'Experience the perfect date night at Geoffrey\'s Malibu in Malibu. This seafood restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_140',
    name: 'Matsuhisa Beverly Hills',
    slug: 'matsuhisa-beverly-hills',
    address: '129 N La Cienega Blvd, Beverly Hills, CA 90211',
    phone: '(310) 659-9639',
    website: 'https://matsuhisabeverlyhills.com',
    rating: 4.5,
    reviewCount: 1234,
    priceLevel: 4,
    cuisineTypes: ['japanese', 'sushi'],
    neighborhood: 'Beverly Hills',
    area: 'Beverly Hills',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 12:00 PM","wednesday":"7:00 PM - 11:00 PM","thursday":"6:00 PM - 10:00 PM","friday":"6:00 PM - 10:00 PM","saturday":"6:00 PM - 11:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 92,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-02-08"},{"author":"Reviewer2","rating":5,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2025-08-12"},{"author":"Reviewer3","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-01-22"},{"author":"Reviewer4","rating":5,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-04-05"},{"author":"Reviewer5","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-05-01"},{"author":"Reviewer6","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2024-10-28"},{"author":"Reviewer7","rating":4,"text":"Beautiful setting with great food. The wine pairing was spot on. Perfect for a special date night.","date":"2025-06-13"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Matsuhisa Beverly Hills in Beverly Hills. This japanese restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_141',
    name: 'Le Comptoir',
    slug: 'le-comptoir',
    address: '1716 N Vermont Ave, Los Angeles, CA 90027',
    phone: '(323) 665-6900',
    website: 'https://lecomptoirla.com',
    rating: 4.6,
    reviewCount: 456,
    priceLevel: 4,
    cuisineTypes: ['french', 'fine_dining'],
    neighborhood: 'Hollywood',
    area: 'Hollywood',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"5:00 PM - 10:00 PM","wednesday":"6:00 PM - 10:00 PM","thursday":"6:00 PM - 10:00 PM","friday":"6:00 PM - 12:00 PM","saturday":"6:00 PM - 12:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 94,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-02-14"},{"author":"Reviewer2","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-10-05"},{"author":"Reviewer3","rating":4,"text":"Intimate and romantic atmosphere. The food quality is outstanding and the service is top-notch.","date":"2024-12-01"},{"author":"Reviewer4","rating":4,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-07-27"},{"author":"Reviewer5","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-09-30"},{"author":"Reviewer6","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-01-08"},{"author":"Reviewer7","rating":4,"text":"Loved the rooftop views and the cocktails were fantastic. Great atmosphere for a date night. Will definitely be back.","date":"2024-11-06"},{"author":"Reviewer8","rating":5,"text":"Perfect date night spot! The ambiance is romantic and the food is exceptional. My partner and I had an amazing time here.","date":"2025-03-03"},{"author":"Reviewer9","rating":4,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2024-12-23"},{"author":"Reviewer10","rating":4,"text":"Great place for a date! The lighting is perfect and the food is consistently excellent.","date":"2024-11-17"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Le Comptoir in Hollywood. This french restaurant offers an intimate atmosphere perfect for romantic dinners.'
  },
  {
    id: 'restaurant_142',
    name: 'Tar & Roses',
    slug: 'tar-roses',
    address: '602 Santa Monica Blvd, Santa Monica, CA 90401',
    phone: '(310) 587-0700',
    website: 'https://tarandroses.com',
    rating: 4.3,
    reviewCount: 789,
    priceLevel: 3,
    cuisineTypes: ['contemporary', 'american'],
    neighborhood: 'Santa Monica',
    area: 'Santa Monica',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'],
    openingHours: {"monday":"Closed","tuesday":"6:00 PM - 12:00 PM","wednesday":"6:00 PM - 12:00 PM","thursday":"5:00 PM - 11:00 PM","friday":"7:00 PM - 10:00 PM","saturday":"6:00 PM - 10:00 PM","sunday":"10:00 AM - 9:00 PM"},
    dateNightScore: 87,
    reviews: [{"author":"Reviewer1","rating":4,"text":"Romantic setting with delicious food. The staff made our anniversary dinner very special.","date":"2025-04-17"},{"author":"Reviewer2","rating":5,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-06-18"},{"author":"Reviewer3","rating":5,"text":"Great for special occasions. The service was impeccable and the wine selection is outstanding. Highly recommend for couples.","date":"2025-03-13"},{"author":"Reviewer4","rating":5,"text":"Excellent service and the food was delicious. The restaurant has a very romantic vibe, perfect for couples.","date":"2025-05-09"},{"author":"Reviewer5","rating":4,"text":"Beautiful restaurant with intimate lighting. The chef's tasting menu was incredible. Perfect for anniversaries or romantic dinners.","date":"2025-06-06"}],
    isTopRated: false,
    description: 'Experience the perfect date night at Tar & Roses in Santa Monica. This contemporary restaurant offers an intimate atmosphere perfect for romantic dinners.'
  }
];
  
  // Generate the description
  let description = `${name} offers a ${cuisineDesc} in ${areaDesc}. `;
  description += `This ${priceDesc} restaurant features ${atmosphere}, `;
  description += `making it ${dateNightPhrase}. `;
  
  // Add cuisine-specific details
  if (cuisineTypes.includes('fine_dining')) {
    description += `With impeccable service and an extensive wine list, ${name} creates the perfect backdrop for an unforgettable date night. `;
  } else if (cuisineTypes.includes('italian_restaurant')) {
    description += `The authentic Italian flavors and warm hospitality make this spot ideal for sharing pasta and creating lasting memories. `;
  } else if (cuisineTypes.includes('french_restaurant')) {
    description += `The sophisticated French cuisine and elegant presentation provide an intimate setting for romantic conversations. `;
  } else if (cuisineTypes.includes('japanese_restaurant')) {
    description += `The artful presentation and fresh ingredients create a unique and memorable dining experience perfect for special occasions. `;
  } else if (cuisineTypes.includes('rooftop_restaurant')) {
    description += `The stunning city views and elevated atmosphere make this the perfect spot for a romantic sunset dinner. `;
  } else if (cuisineTypes.includes('wine_bar')) {
    description += `The extensive wine selection and intimate setting make this ideal for wine lovers seeking a romantic evening. `;
  } else {
    description += `The carefully crafted menu and attention to detail ensure a memorable dining experience for couples. `;
  }
  
  // Add rating and date night score context
  if (rating >= 4.5) {
    description += `With a ${rating}-star rating and exceptional date night score of ${dateNightScore}, `;
  } else if (rating >= 4.0) {
    description += `Boasting a solid ${rating}-star rating and strong date night appeal, `;
  } else {
    description += `With a ${rating}-star rating and good date night potential, `;
  }
  
  description += `${name} consistently delivers the romantic atmosphere and quality cuisine that makes for perfect date nights.`;
  
  return description;
}
