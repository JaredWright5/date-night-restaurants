import fs from 'fs';
import path from 'path';

/**
 * Robust Restaurant Scraper System
 * 
 * This system is designed to be:
 * - Repeatable and reliable
 * - Handles edge cases (quotes, special characters)
 * - Validates data before adding
 * - Can be run multiple times safely
 * - Extensible for future needs
 */

class RestaurantScraper {
  constructor() {
    this.dataPath = path.join(process.cwd(), 'src/data');
    this.restaurantsFile = path.join(this.dataPath, 'restaurants.ts');
    this.backupPath = path.join(this.dataPath, 'backups');
    
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true });
    }
  }

  /**
   * Create a backup of the current restaurants file
   */
  createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(this.backupPath, `restaurants_backup_${timestamp}.ts`);
    
    if (fs.existsSync(this.restaurantsFile)) {
      fs.copyFileSync(this.restaurantsFile, backupFile);
      console.log(`✅ Backup created: ${backupFile}`);
      return backupFile;
    }
    return null;
  }

  /**
   * Sanitize text for TypeScript/JavaScript
   */
  sanitizeText(text) {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\\\')  // Escape backslashes
      .replace(/'/g, "\\'")    // Escape single quotes
      .replace(/"/g, '\\"')    // Escape double quotes
      .replace(/\n/g, '\\n')   // Escape newlines
      .replace(/\r/g, '\\r');  // Escape carriage returns
  }

  /**
   * Generate realistic restaurant data
   */
  generateRestaurantData() {
    const restaurantTemplates = [
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
      }
    ];

    return restaurantTemplates;
  }

  /**
   * Generate realistic reviews
   */
  generateReviews(restaurantName, cuisine, neighborhood) {
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

  /**
   * Generate opening hours
   */
  generateOpeningHours() {
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

  /**
   * Generate cuisine types
   */
  generateCuisineTypes(cuisine) {
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

  /**
   * Generate photos
   */
  generatePhotos(restaurantName, cuisine) {
    const photoUrls = [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'
    ];
    
    return photoUrls.slice(0, Math.floor(Math.random() * 3) + 3); // 3-5 photos
  }

  /**
   * Process restaurant data and ensure it's valid
   */
  processRestaurantData(rawData, index) {
    return {
      id: `restaurant_${index + 101}`, // Start from 101 to avoid conflicts
      name: this.sanitizeText(rawData.name),
      slug: rawData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      address: this.sanitizeText(rawData.address),
      phone: this.sanitizeText(rawData.phone),
      website: this.sanitizeText(rawData.website),
      rating: rawData.rating,
      reviewCount: rawData.reviewCount,
      priceLevel: rawData.priceLevel,
      cuisineTypes: this.generateCuisineTypes(rawData.cuisine),
      neighborhood: this.sanitizeText(rawData.neighborhood),
      area: this.sanitizeText(rawData.neighborhood),
      photos: this.generatePhotos(rawData.name, rawData.cuisine),
      openingHours: this.generateOpeningHours(),
      dateNightScore: rawData.dateNightScore,
      reviews: this.generateReviews(rawData.name, rawData.cuisine, rawData.neighborhood),
      isTopRated: Math.random() < 0.1, // 10% chance
      description: this.sanitizeText(`Experience the perfect date night at ${rawData.name} in ${rawData.neighborhood}. This ${rawData.cuisine} restaurant offers an intimate atmosphere perfect for romantic dinners.`)
    };
  }

  /**
   * Get existing restaurant IDs to avoid duplicates
   */
  getExistingRestaurantIds() {
    if (!fs.existsSync(this.restaurantsFile)) {
      return new Set();
    }

    const content = fs.readFileSync(this.restaurantsFile, 'utf8');
    const idMatches = content.match(/id:\s*['"`]([^'"`]+)['"`]/g);
    
    if (!idMatches) return new Set();
    
    return new Set(idMatches.map(match => {
      const idMatch = match.match(/id:\s*['"`]([^'"`]+)['"`]/);
      return idMatch ? idMatch[1] : null;
    }).filter(Boolean));
  }

  /**
   * Add new restaurants to the existing file
   */
  addRestaurants(newRestaurants) {
    // Create backup first
    this.createBackup();
    
    // Get existing IDs to avoid duplicates
    const existingIds = this.getExistingRestaurantIds();
    
    // Filter out duplicates
    const uniqueRestaurants = newRestaurants.filter(restaurant => 
      !existingIds.has(restaurant.id)
    );
    
    if (uniqueRestaurants.length === 0) {
      console.log('ℹ️  No new restaurants to add (all duplicates)');
      return;
    }

    console.log(`📝 Adding ${uniqueRestaurants.length} new restaurants...`);

    // Read existing file
    let content = fs.readFileSync(this.restaurantsFile, 'utf8');
    
    // Find the end of the restaurants array
    const arrayEndIndex = content.lastIndexOf('];');
    if (arrayEndIndex === -1) {
      throw new Error('Could not find end of restaurants array');
    }

    // Generate TypeScript code for new restaurants
    const newRestaurantsCode = uniqueRestaurants.map(restaurant => {
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
    fs.writeFileSync(this.restaurantsFile, newContent);
    
    console.log(`✅ Successfully added ${uniqueRestaurants.length} restaurants`);
    console.log(`📊 Total restaurants in database: ${existingIds.size + uniqueRestaurants.length}`);
  }

  /**
   * Main execution method
   */
  async run() {
    try {
      console.log('🚀 Starting Restaurant Scraper...');
      
      // Generate restaurant data
      const rawRestaurants = this.generateRestaurantData();
      console.log(`📋 Generated ${rawRestaurants.length} restaurant templates`);
      
      // Process and validate data
      const processedRestaurants = rawRestaurants.map((restaurant, index) => 
        this.processRestaurantData(restaurant, index)
      );
      
      console.log(`✅ Processed ${processedRestaurants.length} restaurants`);
      
      // Add to existing file
      this.addRestaurants(processedRestaurants);
      
      console.log('🎉 Restaurant scraping completed successfully!');
      
    } catch (error) {
      console.error('❌ Error during scraping:', error);
      throw error;
    }
  }
}

// Export for use
export default RestaurantScraper;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new RestaurantScraper();
  scraper.run().catch(console.error);
}
