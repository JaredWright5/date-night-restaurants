#!/usr/bin/env node

import RestaurantScraper from './restaurant_scraper.js';

/**
 * Simple runner script for the restaurant scraper
 * Usage: node scripts/add_restaurants.js
 */

async function main() {
  console.log('🍽️  Date Night Restaurant Scraper');
  console.log('=====================================');
  
  try {
    const scraper = new RestaurantScraper();
    await scraper.run();
    
    console.log('\n✅ All done! Your restaurant database has been updated.');
    console.log('💡 You can run this script again anytime to add more restaurants.');
    
  } catch (error) {
    console.error('\n❌ Scraping failed:', error.message);
    console.error('💡 Check the error above and try again.');
    process.exit(1);
  }
}

main();
