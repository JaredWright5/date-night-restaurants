import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Address-based neighborhood detection
function detectNeighborhoodFromAddress(address) {
  const addr = address.toLowerCase();
  
  // More specific patterns first
  if (addr.includes('beverly hills')) return 'Beverly Hills';
  if (addr.includes('west hollywood')) return 'West Hollywood';
  if (addr.includes('santa monica')) return 'Santa Monica';
  if (addr.includes('venice')) return 'Venice';
  if (addr.includes('manhattan beach')) return 'Manhattan Beach';
  if (addr.includes('hermosa beach')) return 'Hermosa Beach';
  if (addr.includes('redondo beach')) return 'Redondo Beach';
  if (addr.includes('pasadena')) return 'Pasadena';
  if (addr.includes('los feliz')) return 'Los Feliz';
  if (addr.includes('silver lake')) return 'Silver Lake';
  if (addr.includes('downtown')) return 'Downtown LA';
  if (addr.includes('arts district')) return 'Arts District';
  if (addr.includes('mid-wilshire')) return 'Mid-Wilshire';
  if (addr.includes('koreatown')) return 'Koreatown';
  if (addr.includes('hollywood')) return 'Hollywood';
  if (addr.includes('west hollywood')) return 'West Hollywood';
  
  // Zip code based detection
  if (addr.includes('90027')) return 'Los Feliz'; // Los Feliz zip
  if (addr.includes('90026')) return 'Silver Lake'; // Silver Lake zip
  if (addr.includes('90028')) return 'Hollywood'; // Hollywood zip
  if (addr.includes('90038')) return 'Hollywood'; // Hollywood zip
  if (addr.includes('90046')) return 'West Hollywood'; // West Hollywood zip
  if (addr.includes('90048')) return 'West Hollywood'; // West Hollywood zip
  if (addr.includes('90069')) return 'West Hollywood'; // West Hollywood zip
  if (addr.includes('90210')) return 'Beverly Hills'; // Beverly Hills zip
  if (addr.includes('90401')) return 'Santa Monica'; // Santa Monica zip
  if (addr.includes('90402')) return 'Santa Monica'; // Santa Monica zip
  if (addr.includes('90403')) return 'Santa Monica'; // Santa Monica zip
  if (addr.includes('90404')) return 'Santa Monica'; // Santa Monica zip
  if (addr.includes('90405')) return 'Santa Monica'; // Santa Monica zip
  if (addr.includes('90291')) return 'Venice'; // Venice zip
  if (addr.includes('90292')) return 'Venice'; // Venice zip
  if (addr.includes('90266')) return 'Manhattan Beach'; // Manhattan Beach zip
  if (addr.includes('90254')) return 'Hermosa Beach'; // Hermosa Beach zip
  if (addr.includes('90277')) return 'Redondo Beach'; // Redondo Beach zip
  if (addr.includes('91101')) return 'Pasadena'; // Pasadena zip
  if (addr.includes('91103')) return 'Pasadena'; // Pasadena zip
  if (addr.includes('91104')) return 'Pasadena'; // Pasadena zip
  if (addr.includes('91105')) return 'Pasadena'; // Pasadena zip
  if (addr.includes('91106')) return 'Pasadena'; // Pasadena zip
  if (addr.includes('91107')) return 'Pasadena'; // Pasadena zip
  
  // Street-based detection
  if (addr.includes('melrose ave') && addr.includes('90038')) return 'Hollywood';
  if (addr.includes('sunset blvd') && addr.includes('90028')) return 'Hollywood';
  if (addr.includes('santa monica blvd') && addr.includes('90048')) return 'West Hollywood';
  if (addr.includes('rodeo drive')) return 'Beverly Hills';
  if (addr.includes('robertson blvd')) return 'West Hollywood';
  if (addr.includes('la cienega blvd')) return 'West Hollywood';
  if (addr.includes('hillhurst ave')) return 'Los Feliz';
  if (addr.includes('sunset junction')) return 'Silver Lake';
  if (addr.includes('abbot kinney')) return 'Venice';
  if (addr.includes('main st') && addr.includes('90401')) return 'Santa Monica';
  if (addr.includes('pacific ave') && addr.includes('90401')) return 'Santa Monica';
  
  return 'Los Angeles'; // Default fallback
}

async function auditAndFixNeighborhoods() {
  console.log('🔍 Auditing neighborhood assignments...\n');
  
  try {
    // First, get all neighborhoods to create a mapping
    const { data: neighborhoods, error: neighborhoodsError } = await supabase
      .from('neighborhoods')
      .select('id, name')
      .order('name');
      
    if (neighborhoodsError) {
      console.error('Error fetching neighborhoods:', neighborhoodsError);
      return;
    }
    
    const neighborhoodMap = {};
    neighborhoods.forEach(n => {
      neighborhoodMap[n.name] = n.id;
    });
    
    console.log('📊 Available neighborhoods:');
    neighborhoods.forEach(n => {
      console.log(`  ${n.name} (ID: ${n.id})`);
    });
    
    // Get all restaurants with their current neighborhood assignments
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select(`
        id, name, address,
        neighborhoods!inner(name)
      `)
      .order('name');
      
    if (error) {
      console.error('Error fetching restaurants:', error);
      return;
    }
    
    console.log(`\n📊 Found ${restaurants.length} restaurants to audit\n`);
    
    // Group by current neighborhood
    const currentNeighborhoods = {};
    restaurants.forEach(restaurant => {
      const neighborhoodName = restaurant.neighborhoods.name;
      if (!currentNeighborhoods[neighborhoodName]) {
        currentNeighborhoods[neighborhoodName] = [];
      }
      currentNeighborhoods[neighborhoodName].push(restaurant);
    });
    
    console.log('📊 Current neighborhood distribution:');
    Object.keys(currentNeighborhoods).sort().forEach(neighborhood => {
      console.log(`  ${neighborhood}: ${currentNeighborhoods[neighborhood].length} restaurants`);
    });
    
    console.log('\n🔍 Analyzing for corrections...\n');
    
    const corrections = [];
    const correctAssignments = [];
    
    restaurants.forEach(restaurant => {
      const detectedNeighborhood = detectNeighborhoodFromAddress(restaurant.address);
      const currentNeighborhood = restaurant.neighborhoods.name;
      
      if (detectedNeighborhood !== currentNeighborhood) {
        corrections.push({
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          current: currentNeighborhood,
          detected: detectedNeighborhood,
          detectedId: neighborhoodMap[detectedNeighborhood]
        });
      } else {
        correctAssignments.push(restaurant);
      }
    });
    
    console.log(`✅ Correctly assigned: ${correctAssignments.length} restaurants`);
    console.log(`⚠️  Need correction: ${corrections.length} restaurants\n`);
    
    if (corrections.length > 0) {
      console.log('🔧 Restaurants that need neighborhood corrections:');
      corrections.forEach((correction, index) => {
        console.log(`${index + 1}. ${correction.name}`);
        console.log(`   Address: ${correction.address}`);
        console.log(`   Current: ${correction.current}`);
        console.log(`   Should be: ${correction.detected}`);
        if (!correction.detectedId) {
          console.log(`   ⚠️  Warning: Neighborhood "${correction.detected}" not found in database!`);
        }
        console.log('');
      });
      
      // Filter out corrections where the detected neighborhood doesn't exist
      const validCorrections = corrections.filter(c => c.detectedId);
      const invalidCorrections = corrections.filter(c => !c.detectedId);
      
      if (invalidCorrections.length > 0) {
        console.log('⚠️  Skipping corrections for neighborhoods that don\'t exist in database:');
        invalidCorrections.forEach(c => {
          console.log(`  - ${c.name}: "${c.detected}" not found`);
        });
        console.log('');
      }
      
      if (validCorrections.length > 0) {
        console.log('🚀 Ready to apply corrections...');
        console.log('This will update the neighborhood_id field for the restaurants listed above.');
        
        // Apply corrections
        let successCount = 0;
        let errorCount = 0;
        
        for (const correction of validCorrections) {
          try {
            const { error: updateError } = await supabase
              .from('restaurants')
              .update({ neighborhood_id: correction.detectedId })
              .eq('id', correction.id);
              
            if (updateError) {
              console.error(`❌ Failed to update ${correction.name}:`, updateError);
              errorCount++;
            } else {
              console.log(`✅ Updated ${correction.name}: ${correction.current} → ${correction.detected}`);
              successCount++;
            }
          } catch (err) {
            console.error(`❌ Error updating ${correction.name}:`, err);
            errorCount++;
          }
        }
        
        console.log(`\n📊 Correction Summary:`);
        console.log(`  ✅ Successfully updated: ${successCount}`);
        console.log(`  ❌ Failed to update: ${errorCount}`);
        
        if (successCount > 0) {
          console.log('\n🎉 Neighborhood corrections applied successfully!');
          console.log('The neighborhood filtering should now work correctly.');
        }
      } else {
        console.log('⚠️  No valid corrections to apply (all detected neighborhoods not found in database)');
      }
    } else {
      console.log('🎉 All neighborhood assignments appear to be correct!');
    }
    
  } catch (error) {
    console.error('❌ Error during audit:', error);
  }
}

// Run the audit and fix
auditAndFixNeighborhoods().catch(console.error);
