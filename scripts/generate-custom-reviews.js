import fs from 'fs';

// Read the restaurant data
const restaurants = JSON.parse(fs.readFileSync('./la_date_night_restaurants.json', 'utf8'));

// Review templates by cuisine type and price level
const reviewTemplates = {
  fine_dining: {
    high: [
      "An absolutely exceptional dining experience. The tasting menu was a journey through incredible flavors, and the wine pairings were perfect. The service was impeccable - attentive without being intrusive. Perfect for celebrating special occasions.",
      "This is what fine dining should be. Every course was beautifully presented and tasted even better. The sommelier's recommendations were spot-on, and the intimate atmosphere made for a truly romantic evening.",
      "Worth every penny. The chef's creativity shines in every dish, and the attention to detail is remarkable. The staff made us feel like VIPs all night. An unforgettable date night experience.",
      "Michelin-level dining in LA. The ingredients are clearly the finest available, and the execution is flawless. The dining room has an elegant, sophisticated vibe that's perfect for important occasions.",
      "A culinary masterpiece. The seasonal menu changes keep things exciting, and the presentation is like edible art. The wine list is extensive and well-curated. Service is white-glove quality.",
      "Outstanding fine dining with innovative cuisine. The chef's tasting menu showcased incredible technique and creativity. The wine service was professional and the atmosphere was perfect for our anniversary.",
      "Exceptional restaurant with world-class cuisine. Every dish was perfectly executed and beautifully presented. The sommelier's wine pairings elevated the entire experience. Truly memorable.",
      "Premium dining experience with flawless execution. The ingredients are top-quality and the chef's techniques are impressive. The service staff is knowledgeable and attentive without being overbearing.",
      "Fine dining at its absolute best. The multi-course tasting menu was a culinary journey, and the wine pairings were expertly chosen. The elegant dining room creates the perfect romantic atmosphere.",
      "Outstanding gastronomic experience. The chef's creativity and skill are evident in every beautifully plated dish. The wine list is extensive and the service is polished and professional."
    ],
    medium: [
      "Elegant atmosphere with outstanding food. The chef clearly knows what they're doing, and the seasonal ingredients shine. Great wine selection and knowledgeable staff.",
      "Sophisticated dining without the stuffiness. The food is beautifully prepared and the service is warm and professional. Perfect for a romantic dinner.",
      "Quality fine dining at a reasonable price point. The menu offers creative takes on classic dishes, and the presentation is always impressive.",
      "Refined restaurant with excellent cuisine and professional service. The seasonal menu keeps things interesting, and the wine list has good variety and quality.",
      "Upscale dining with creative dishes and attentive service. The atmosphere is elegant but not intimidating, making it perfect for special occasions.",
      "High-quality restaurant with sophisticated cuisine and warm hospitality. The chef's specials are always worth trying, and the wine selection complements the food well."
    ]
  },
  italian_restaurant: {
    high: [
      "Authentic Italian cuisine at its finest. The handmade pasta was incredible, and the osso buco was fall-off-the-bone tender. The wine list focuses on Italian varietals and pairs beautifully with the food.",
      "Like dining in a cozy trattoria in Tuscany. The chef clearly has a passion for traditional Italian cooking, and it shows in every dish. The tiramisu was the perfect ending to a wonderful meal.",
      "Fresh, authentic ingredients make all the difference here. The burrata was creamy perfection, and the house-made pasta is some of the best in the city. Romantic candlelit atmosphere.",
      "True Italian hospitality combined with exceptional food. The risotto was perfectly al dente, and the wine selection includes some hard-to-find Italian gems. Perfect for date night.",
      "The wood-fired pizza was incredible with a perfect char and chewy crust. The pasta carbonara was rich and creamy, exactly how it should be. Great wine selection.",
      "Outstanding Italian restaurant with authentic flavors. The osso buco melted off the bone, and the tiramisu was light and perfectly balanced. Service was warm and attentive.",
      "Fantastic Northern Italian cuisine with house-made pastas and fresh ingredients. The wine list features excellent Italian selections, and the atmosphere is intimate and romantic.",
      "Best Italian food we've had in LA. The gnocchi was pillowy soft, and the veal parmesan was perfectly breaded and tender. The staff made us feel like family.",
      "Incredible handmade pasta and authentic Italian flavors. The chef's specials are always creative, and the wine pairings are expertly chosen. Perfect for special occasions."
    ],
    medium: [
      "Solid Italian food in a warm, inviting atmosphere. The pasta is fresh and the sauces are well-balanced. Good wine selection and friendly service.",
      "Classic Italian dishes done right. The pizza has a perfect crispy crust, and the pasta dishes are generous portions with authentic flavors.",
      "Great neighborhood Italian spot with consistent quality. The lasagna is hearty and delicious, and the garlic bread is always fresh and warm.",
      "Reliable Italian restaurant with good portions and fair prices. The chicken parmesan is crispy on the outside and tender inside.",
      "Cozy Italian trattoria with authentic recipes. The spaghetti and meatballs is a classic done well, and the tiramisu is homemade and delicious.",
      "Good Italian food in a casual setting. The margherita pizza has fresh mozzarella and basil, and the pasta dishes are satisfying and flavorful."
    ]
  },
  french_restaurant: {
    high: [
      "A little piece of Paris in LA. The coq au vin was exceptional, and the wine list is heavily French-focused with excellent choices. The atmosphere is elegant and romantic.",
      "French technique meets California ingredients beautifully. The duck confit was perfectly prepared, and the crème brûlée was the ideal finish. Impeccable service throughout.",
      "Sophisticated French dining with a modern twist. The escargot was divine, and the wine pairings enhanced every course. The dining room has an intimate, romantic feel."
    ],
    medium: [
      "Charming French bistro atmosphere with solid classic dishes. The onion soup was rich and satisfying, and the steak frites were perfectly cooked.",
      "Authentic French flavors in a relaxed setting. The menu offers both traditional and contemporary options, all well-executed."
    ]
  },
  japanese_restaurant: {
    high: [
      "An omakase experience like no other. The sushi chef's knife skills are incredible, and the fish is the freshest available. Each piece is a work of art, and the sake pairings are expertly chosen.",
      "Traditional Japanese dining at its finest. The kaiseki menu is a journey through seasonal ingredients and traditional techniques. The sake selection is impressive and the service is gracious.",
      "Exceptional sushi and sashimi with perfect rice and pristine fish. The chef's attention to detail is remarkable, and the intimate setting makes for a special dining experience."
    ],
    medium: [
      "Fresh, quality sushi in a clean, modern setting. The rolls are creative but not overdone, and the sashimi is consistently excellent.",
      "Good Japanese food with both traditional and modern options. The ramen has rich, flavorful broth and the tempura is light and crispy."
    ]
  },
  seafood_restaurant: {
    high: [
      "The freshest seafood in the city. The lobster was perfectly cooked, and the oysters were briny and delicious. The ocean-view setting enhances the entire experience.",
      "Outstanding seafood with creative preparations. The halibut was flaky and moist, and the wine list has excellent white wine selections to complement the fish.",
      "A seafood lover's paradise. The crab cakes were mostly crab with minimal filler, and the cioppino was rich and flavorful. The staff knows their fish and can recommend perfect preparations."
    ],
    medium: [
      "Solid seafood options with good variety. The fish is always fresh and cooked properly, and the atmosphere is casual and comfortable.",
      "Reliable seafood spot with classic preparations. The chowder is rich and hearty, and the fish and chips are crispy and satisfying."
    ]
  },
  rooftop_restaurant: {
    high: [
      "The views are absolutely breathtaking, especially at sunset. The food matches the stunning setting, and the cocktail menu is creative and well-executed. Perfect for a romantic evening.",
      "Dining in the clouds with exceptional cuisine. The skyline views are incredible, and the menu offers sophisticated dishes that complement the elevated atmosphere.",
      "An unforgettable rooftop experience. The city views are spectacular, and the food is surprisingly excellent for a view-focused restaurant. The wine list is well-curated."
    ],
    medium: [
      "Great views and solid food. The rooftop setting makes any meal feel special, and the menu offers crowd-pleasing options with a nice presentation.",
      "Good rooftop dining with decent food and excellent atmosphere. The sunset views are worth the visit alone."
    ]
  },
  wine_bar: {
    high: [
      "An oenophile's dream with an incredible wine selection by the glass. The sommelier's knowledge is impressive, and the small plates are designed to complement the wines perfectly.",
      "Intimate wine bar with exceptional pours and knowledgeable staff. The charcuterie board is artfully arranged, and the wine flights offer great value for exploring different regions.",
      "Sophisticated wine bar with a cozy, romantic atmosphere. The wine list changes regularly, and the staff can recommend perfect pairings for any palate."
    ],
    medium: [
      "Nice wine selection with good small plates. The atmosphere is relaxed and perfect for conversation over a glass of wine.",
      "Comfortable wine bar with decent selection and friendly service. Good place for a casual date night."
    ]
  },
  contemporary: {
    high: [
      "Modern American cuisine with creative presentations and bold flavors. The chef's technique is impressive, and the seasonal menu keeps things interesting. Sophisticated atmosphere perfect for special occasions.",
      "Innovative dishes that push boundaries while maintaining great taste. The plating is artistic, and the wine pairings are thoughtful and well-executed.",
      "Contemporary cuisine at its finest. The menu combines unexpected flavors beautifully, and the service is polished and professional. Great for foodie couples."
    ],
    medium: [
      "Modern takes on classic dishes with good execution. The atmosphere is trendy but not intimidating, and the menu offers something for everyone.",
      "Contemporary American food with solid technique and creative presentations. Good wine selection and knowledgeable staff."
    ]
  }
};

// Fallback templates for other cuisine types
const fallbackTemplates = [
  "Excellent food and great atmosphere for date night. The service was attentive and the wine selection was impressive.",
  "Perfect romantic spot with delicious food and cozy ambiance. The staff was friendly and made our evening special.",
  "Outstanding dining experience with creative menu and excellent service. Great for celebrating special occasions.",
  "Fantastic restaurant with fresh ingredients and beautiful presentation. The intimate setting made for a memorable evening.",
  "Wonderful food and warm hospitality. The chef clearly cares about quality, and it shows in every dish.",
  "Amazing restaurant with incredible flavors and perfect service. The atmosphere was romantic and the food exceeded our expectations.",
  "Great spot for a special dinner. The menu is creative and the execution is flawless. The staff made us feel welcome and valued.",
  "Outstanding cuisine with fresh, seasonal ingredients. The presentation was beautiful and the flavors were perfectly balanced.",
  "Exceptional dining experience with innovative dishes and attentive service. The wine list is well-curated and the atmosphere is intimate.",
  "Fantastic restaurant with excellent food and warm hospitality. The chef's creativity shines in every dish, and the service is professional.",
  "Perfect date night spot with delicious food and romantic ambiance. The staff was knowledgeable and made excellent recommendations.",
  "Outstanding restaurant with creative cuisine and exceptional service. The ingredients are fresh and the presentation is beautiful.",
  "Excellent dining experience with innovative menu and attentive staff. The atmosphere is sophisticated yet comfortable, perfect for special occasions.",
  "Great restaurant with quality ingredients and creative preparations. The service was professional and the wine selection was impressive.",
  "Outstanding food and atmosphere for romantic dining. The chef's technique is impressive and the staff is knowledgeable and friendly."
];

// Generate realistic author names
const firstNames = ['Sarah', 'Michael', 'Jennifer', 'David', 'Lisa', 'Robert', 'Jessica', 'James', 'Amanda', 'Christopher', 'Ashley', 'Daniel', 'Emily', 'Matthew', 'Nicole', 'Andrew', 'Stephanie', 'Joshua', 'Michelle', 'Ryan'];
const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

function getRandomAuthor() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last.charAt(0)}.`;
}

function getRandomTime(daysAgo = 30) {
  const now = Date.now() / 1000;
  const randomDays = Math.floor(Math.random() * daysAgo);
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  return now - (randomDays * 24 * 60 * 60) - (randomHours * 60 * 60) - (randomMinutes * 60);
}

function generateReview(restaurant) {
  const cuisineType = restaurant.cuisine_types[0] || 'contemporary';
  const priceLevel = restaurant.price_level;
  const rating = restaurant.rating;
  
  let templates = [];
  
  // Get templates based on cuisine type
  if (reviewTemplates[cuisineType]) {
    if (priceLevel >= 4) {
      templates = reviewTemplates[cuisineType].high || reviewTemplates[cuisineType].medium || [];
    } else {
      templates = reviewTemplates[cuisineType].medium || reviewTemplates[cuisineType].high || [];
    }
  }
  
  // Fallback to general templates if no specific ones
  if (templates.length === 0) {
    templates = fallbackTemplates;
  }
  
  // Select a random template
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Generate rating based on restaurant rating with some variation
  let reviewRating;
  if (rating >= 4.5) {
    reviewRating = Math.random() > 0.1 ? 5 : 4; // 90% chance of 5 stars
  } else if (rating >= 4.0) {
    reviewRating = Math.random() > 0.3 ? 5 : 4; // 70% chance of 5 stars
  } else if (rating >= 3.5) {
    reviewRating = Math.random() > 0.5 ? 4 : 3; // 50% chance of 4 stars
  } else {
    reviewRating = Math.random() > 0.7 ? 4 : 3; // 30% chance of 4 stars
  }
  
  return {
    author: getRandomAuthor(),
    rating: reviewRating,
    text: template,
    time: getRandomTime()
  };
}

// Update restaurants with custom reviews
const updatedRestaurants = restaurants.map(restaurant => {
  // Generate 3-5 reviews per restaurant
  const reviewCount = Math.floor(Math.random() * 3) + 3; // 3-5 reviews
  const reviews = [];
  const usedTemplates = new Set(); // Track used templates to avoid duplicates
  
  for (let i = 0; i < reviewCount; i++) {
    let review;
    let attempts = 0;
    
    // Try to generate unique reviews (up to 10 attempts)
    do {
      review = generateReview(restaurant);
      attempts++;
    } while (usedTemplates.has(review.text) && attempts < 10);
    
    usedTemplates.add(review.text);
    reviews.push(review);
  }
  
  return {
    ...restaurant,
    reviews: reviews
  };
});

// Write updated data back to file
fs.writeFileSync('./la_date_night_restaurants.json', JSON.stringify(updatedRestaurants, null, 2));

console.log(`Updated ${updatedRestaurants.length} restaurants with custom reviews`);
console.log('Sample reviews generated:');
updatedRestaurants.slice(0, 3).forEach(restaurant => {
  console.log(`\n${restaurant.name}:`);
  restaurant.reviews.forEach(review => {
    console.log(`  ${review.author} (${review.rating}★): "${review.text}"`);
  });
});
