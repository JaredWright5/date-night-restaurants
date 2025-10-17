import type { Restaurant } from '@/types';

// Import restaurant data from JSON
import laRestaurants from '../../la_date_night_restaurants.json';

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
  dateNightScore: restaurant.date_night_score,
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
  const dateNightPhrase = dateNightPhrases[Math.floor(Math.random() * dateNightPhrases.length)];
  
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
