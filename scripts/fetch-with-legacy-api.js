/**
 * Fetch restaurant data using Legacy Places API
 * This should work with your current API key setup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
const DELAY = 200;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Real LA restaurants with exact addresses
const restaurants = [
  { name: "Providence", address: "5955 Melrose Ave, Los Angeles, CA 90038" },
  { name: "Republique", address: "624 S La Brea Ave, Los Angeles, CA 90036" },
  { name: "Bestia", address: "2121 E 7th Pl, Los Angeles, CA 90021" },
  { name: "Bavel", address: "500 Mateo St, Los Angeles, CA 90013" },
  { name: "Gjelina", address: "1429 Abbot Kinney Blvd, Venice, CA 90291" },
  { name: "Osteria Mozza", address: "6602 Melrose Ave, Los Angeles, CA 90038" },
  { name: "Spago", address: "176 N Canon Dr, Beverly Hills, CA 90210" },
  { name: "Nobu Los Angeles", address: "903 N La Cienega Blvd, West Hollywood, CA 90069" },
  { name: "Catch LA", address: "8715 Melrose Ave, West Hollywood, CA 90069" },
  { name: "The Little Door", address: "8164 W 3rd St, Los Angeles, CA 90048" }
];

// Find place using legacy API
async function findPlace(query) {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
      return data.candidates[0];
    }
    
    console.log(`   Status: ${data.status}`);
    if (data.error_message) {
      console.log(`   Error: ${data.error_message}`);
    }
    
    return null;
  } catch (error) {
    console.error(`   Fetch error: ${error.message}`);
    return null;
  }
}

// Get place details
async function getPlaceDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,photos,geometry&key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      return data.result;
    }
    
    return null;
  } catch (error) {
    console.error(`   Details error: ${error.message}`);
    return null;
  }
}

// Get photo URL
function getPhotoUrl(photoReference, maxWidth = 800) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${API_KEY}`;
}

async function testFetch() {
  console.log('🧪 Testing Legacy Places API\n');
  
  if (!API_KEY) {
    console.error('❌ API_KEY not set');
    process.exit(1);
  }
  
  for (let i = 0; i < Math.min(restaurants.length, 5); i++) {
    const restaurant = restaurants[i];
    console.log(`[${i + 1}] Testing: ${restaurant.name}`);
    
    const place = await findPlace(`${restaurant.name} ${restaurant.address}`);
    await delay(DELAY);
    
    if (!place) {
      console.log(`   ❌ Not found\n`);
      continue;
    }
    
    console.log(`   ✅ Found: ${place.name}`);
    console.log(`   Place ID: ${place.place_id}`);
    
    const details = await getPlaceDetails(place.place_id);
    await delay(DELAY);
    
    if (details) {
      console.log(`   Rating: ${details.rating}★`);
      console.log(`   Photos: ${details.photos?.length || 0}`);
      console.log(`   Phone: ${details.formatted_phone_number || 'N/A'}`);
      console.log(`   Website: ${details.website || 'N/A'}\n`);
    }
  }
}

testFetch();

