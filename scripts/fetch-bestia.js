/**
 * Fetch Bestia restaurant photos specifically
 */

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

async function searchBestia() {
  // Try multiple search variations for Bestia
  const queries = [
    "Bestia 2121 E 7th Pl Los Angeles",
    "Bestia restaurant downtown Los Angeles",
    "Bestia Italian restaurant LA",
    "Bestia Arts District Los Angeles"
  ];
  
  for (const query of queries) {
    console.log(`🔍 Trying: "${query}"`);
    
    const url = 'https://places.googleapis.com/v1/places:searchText';
    
    const requestBody = {
      textQuery: query,
      maxResultCount: 3
    };
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.photos'
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (data.places && data.places.length > 0) {
        console.log(`\n✅ Found ${data.places.length} results:\n`);
        
        data.places.forEach((place, i) => {
          console.log(`${i + 1}. ${place.displayName?.text || 'Unknown'}`);
          console.log(`   Address: ${place.formattedAddress || 'N/A'}`);
          console.log(`   Rating: ${place.rating || 'N/A'}★`);
          console.log(`   Photos: ${place.photos?.length || 0}`);
          console.log(`   Place ID: ${place.id}`);
          
          if (place.photos && place.photos.length > 0) {
            console.log(`\n   Photo URLs:`);
            place.photos.slice(0, 5).forEach((photo, j) => {
              const photoUrl = `https://places.googleapis.com/v1/${photo.name}/media?key=${API_KEY}&maxWidthPx=800`;
              console.log(`   ${j + 1}. ${photoUrl}`);
            });
          }
          console.log('');
        });
        
        return data.places[0];
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`   Error: ${error.message}`);
    }
  }
  
  console.log('❌ Bestia not found with any query variation\n');
  return null;
}

searchBestia();

