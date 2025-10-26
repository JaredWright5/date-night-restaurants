import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function updateJsonNeighborhoods() {
  console.log('🔄 Updating JSON file with corrected neighborhood assignments...\n');
  
  try {
    // Read the current JSON file
    const jsonData = JSON.parse(fs.readFileSync('la_date_night_restaurants_real.json', 'utf8'));
    console.log(`📊 Loaded ${jsonData.length} restaurants from JSON file`);
    
    // Get all restaurants from Supabase with their corrected neighborhoods
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select(`
        name, address,
        neighborhoods!inner(name)
      `)
      .order('name');
      
    if (error) {
      console.error('Error fetching restaurants from Supabase:', error);
      return;
    }
    
    console.log(`📊 Loaded ${restaurants.length} restaurants from Supabase`);
    
    // Create a mapping of restaurant names to corrected neighborhoods
    const neighborhoodMap = {};
    restaurants.forEach(restaurant => {
      neighborhoodMap[restaurant.name] = restaurant.neighborhoods.name;
    });
    
    console.log('\n🔍 Applying neighborhood corrections to JSON...\n');
    
    let updateCount = 0;
    const updates = [];
    
    // Update the JSON data with corrected neighborhoods
    jsonData.forEach((restaurant, index) => {
      const correctedNeighborhood = neighborhoodMap[restaurant.name];
      if (correctedNeighborhood && correctedNeighborhood !== restaurant.neighborhood) {
        updates.push({
          name: restaurant.name,
          old: restaurant.neighborhood,
          new: correctedNeighborhood
        });
        restaurant.neighborhood = correctedNeighborhood;
        updateCount++;
      }
    });
    
    if (updateCount > 0) {
      console.log(`✅ Found ${updateCount} restaurants to update:`);
      updates.forEach(update => {
        console.log(`  - ${update.name}: ${update.old} → ${update.new}`);
      });
      
      // Write the updated JSON back to the file
      fs.writeFileSync('la_date_night_restaurants_real.json', JSON.stringify(jsonData, null, 2));
      console.log(`\n💾 Updated JSON file with ${updateCount} neighborhood corrections`);
      
      // Also update the copy in the public directory if it exists
      if (fs.existsSync('public/la_date_night_restaurants_real.json')) {
        fs.writeFileSync('public/la_date_night_restaurants_real.json', JSON.stringify(jsonData, null, 2));
        console.log('💾 Updated public JSON file as well');
      }
      
      console.log('\n🎉 JSON file updated successfully!');
      console.log('The website should now reflect the corrected neighborhood assignments.');
    } else {
      console.log('✅ No updates needed - all neighborhoods are already correct in JSON');
    }
    
  } catch (error) {
    console.error('❌ Error updating JSON file:', error);
  }
}

// Run the update
updateJsonNeighborhoods().catch(console.error);
