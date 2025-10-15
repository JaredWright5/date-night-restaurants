/**
 * Test Single Restaurant API Call
 * Debug script to see exact API response
 */

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

async function testSearch() {
  console.log('🧪 Testing Google Places API with Providence Restaurant\n');
  
  const url = 'https://places.googleapis.com/v1/places:searchText';
  
  const requestBody = {
    textQuery: "Providence Restaurant Los Angeles",
    maxResultCount: 1
  };
  
  console.log('📤 Request URL:', url);
  console.log('📤 Request Body:', JSON.stringify(requestBody, null, 2));
  console.log('🔑 API Key:', API_KEY.substring(0, 10) + '...\n');
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber,places.regularOpeningHours,places.photos'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('📥 Response Status:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('\n📥 Response Data:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.places && data.places.length > 0) {
      console.log('\n✅ SUCCESS! Found restaurant data');
      console.log('Photos available:', data.places[0].photos?.length || 0);
    } else {
      console.log('\n⚠️  No results found');
      if (data.error) {
        console.log('Error:', data.error);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Fetch error:', error.message);
  }
}

testSearch();

