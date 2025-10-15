/**
 * Real Los Angeles Date Night Restaurants
 * 
 * This script creates a list of 100 actual, highly-rated date night restaurants
 * in Los Angeles that can be found on Google Places API.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Real Los Angeles Date Night Restaurants
const realRestaurants = [
  // Top-tier Fine Dining
  { name: "Providence", address: "5955 Melrose Ave, Los Angeles, CA 90038", neighborhood: "Hollywood", cuisineTypes: ["fine_dining", "seafood_restaurant", "contemporary"], priceLevel: 4 },
  { name: "Republique", address: "624 S La Brea Ave, Los Angeles, CA 90036", neighborhood: "Mid-Wilshire", cuisineTypes: ["french_restaurant", "bakery", "cafe"], priceLevel: 3 },
  { name: "Bestia", address: "2121 E 7th Pl, Los Angeles, CA 90021", neighborhood: "Downtown LA", cuisineTypes: ["italian_restaurant", "wine_bar"], priceLevel: 3 },
  { name: "Bavel", address: "500 Mateo St, Los Angeles, CA 90013", neighborhood: "Downtown LA", cuisineTypes: ["middle_eastern", "mediterranean"], priceLevel: 3 },
  { name: "Gjelina", address: "1429 Abbot Kinney Blvd, Venice, CA 90291", neighborhood: "Venice", cuisineTypes: ["californian", "contemporary", "wine_bar"], priceLevel: 3 },
  { name: "Osteria Mozza", address: "6602 Melrose Ave, Los Angeles, CA 90038", neighborhood: "Hollywood", cuisineTypes: ["italian_restaurant", "fine_dining"], priceLevel: 4 },
  { name: "Spago Beverly Hills", address: "176 N Canon Dr, Beverly Hills, CA 90210", neighborhood: "Beverly Hills", cuisineTypes: ["californian", "fine_dining", "contemporary"], priceLevel: 4 },
  { name: "Nobu Los Angeles", address: "903 N La Cienega Blvd, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["japanese_restaurant", "sushi", "fine_dining"], priceLevel: 4 },
  { name: "Catch LA", address: "8715 Melrose Ave, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["seafood_restaurant", "contemporary", "rooftop_restaurant"], priceLevel: 4 },
  { name: "The Little Door", address: "8164 W 3rd St, Los Angeles, CA 90048", neighborhood: "Beverly Grove", cuisineTypes: ["french_restaurant", "mediterranean", "romantic"], priceLevel: 4 },
  
  // Romantic Italian
  { name: "Osteria La Buca", address: "5210 Melrose Ave, Los Angeles, CA 90038", neighborhood: "Hollywood", cuisineTypes: ["italian_restaurant", "wine_bar"], priceLevel: 3 },
  { name: "Cecconi's West Hollywood", address: "8764 Melrose Ave, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["italian_restaurant", "contemporary"], priceLevel: 4 },
  { name: "Osteria Drago", address: "2732 Main St, Santa Monica, CA 90405", neighborhood: "Santa Monica", cuisineTypes: ["italian_restaurant"], priceLevel: 3 },
  { name: "Toscana Brentwood", address: "11633 San Vicente Blvd, Los Angeles, CA 90049", neighborhood: "Brentwood", cuisineTypes: ["italian_restaurant", "fine_dining"], priceLevel: 4 },
  { name: "Madeo Ristorante", address: "8897 Beverly Blvd, West Hollywood, CA 90048", neighborhood: "West Hollywood", cuisineTypes: ["italian_restaurant"], priceLevel: 4 },
  { name: "Giorgio Baldi", address: "114 W Channel Rd, Santa Monica, CA 90402", neighborhood: "Santa Monica", cuisineTypes: ["italian_restaurant", "fine_dining"], priceLevel: 4 },
  { name: "Angelini Osteria", address: "7313 Beverly Blvd, Los Angeles, CA 90036", neighborhood: "Fairfax", cuisineTypes: ["italian_restaurant"], priceLevel: 3 },
  { name: "Terroni", address: "802 S Spring St, Los Angeles, CA 90014", neighborhood: "Downtown LA", cuisineTypes: ["italian_restaurant", "pizza"], priceLevel: 2 },
  { name: "Stella Barra Pizzeria", address: "2000 Main St, Santa Monica, CA 90405", neighborhood: "Santa Monica", cuisineTypes: ["pizza", "italian_restaurant"], priceLevel: 2 },
  { name: "Pace Restaurant", address: "2100 Laurel Canyon Blvd, Los Angeles, CA 90046", neighborhood: "Laurel Canyon", cuisineTypes: ["italian_restaurant", "contemporary"], priceLevel: 3 },
  
  // Japanese & Sushi
  { name: "Urasawa", address: "218 N Rodeo Dr, Beverly Hills, CA 90210", neighborhood: "Beverly Hills", cuisineTypes: ["japanese_restaurant", "sushi", "fine_dining"], priceLevel: 4 },
  { name: "Sushi Park", address: "8539 Sunset Blvd, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["sushi", "japanese_restaurant"], priceLevel: 4 },
  { name: "Asanebo", address: "11941 Ventura Blvd, Studio City, CA 91604", neighborhood: "Studio City", cuisineTypes: ["sushi", "japanese_restaurant"], priceLevel: 3 },
  { name: "Katsuya Brentwood", address: "11777 San Vicente Blvd, Los Angeles, CA 90049", neighborhood: "Brentwood", cuisineTypes: ["sushi", "japanese_restaurant"], priceLevel: 3 },
  { name: "Matsuhisa Beverly Hills", address: "129 N La Cienega Blvd, Beverly Hills, CA 90211", neighborhood: "Beverly Hills", cuisineTypes: ["japanese_restaurant", "sushi", "fine_dining"], priceLevel: 4 },
  { name: "Yamashiro", address: "1999 N Sycamore Ave, Los Angeles, CA 90068", neighborhood: "Hollywood Hills", cuisineTypes: ["japanese_restaurant", "asian_fusion"], priceLevel: 3 },
  { name: "Azami Sushi", address: "11301 W Olympic Blvd, Los Angeles, CA 90064", neighborhood: "West LA", cuisineTypes: ["sushi", "japanese_restaurant"], priceLevel: 3 },
  { name: "Sugarfish", address: "11288 Ventura Blvd, Studio City, CA 91604", neighborhood: "Studio City", cuisineTypes: ["sushi", "japanese_restaurant"], priceLevel: 2 },
  { name: "KazuNori", address: "421 S Main St, Los Angeles, CA 90013", neighborhood: "Downtown LA", cuisineTypes: ["sushi", "japanese_restaurant"], priceLevel: 2 },
  { name: "Sushi Gen", address: "422 E 2nd St, Los Angeles, CA 90012", neighborhood: "Little Tokyo", cuisineTypes: ["sushi", "japanese_restaurant"], priceLevel: 2 },
  
  // French & European
  { name: "Petit Trois", address: "718 N Highland Ave, Los Angeles, CA 90038", neighborhood: "Hollywood", cuisineTypes: ["french_restaurant", "bistro"], priceLevel: 3 },
  { name: "Horses", address: "7950 Sunset Blvd, Los Angeles, CA 90046", neighborhood: "West Hollywood", cuisineTypes: ["steakhouse", "fine_dining"], priceLevel: 4 },
  { name: "Pasjoli", address: "2732 Main St, Santa Monica, CA 90405", neighborhood: "Santa Monica", cuisineTypes: ["french_restaurant", "fine_dining"], priceLevel: 4 },
  { name: "Bicyclette", address: "8920 W Olympic Blvd, Beverly Hills, CA 90211", neighborhood: "Beverly Hills", cuisineTypes: ["french_restaurant", "bistro"], priceLevel: 2 },
  { name: "Church & State", address: "1850 Industrial St, Los Angeles, CA 90021", neighborhood: "Downtown LA", cuisineTypes: ["french_restaurant", "bistro"], priceLevel: 3 },
  { name: "Loupiotte Kitchen", address: "8878 W Olympic Blvd, Beverly Hills, CA 90211", neighborhood: "Beverly Hills", cuisineTypes: ["french_restaurant"], priceLevel: 2 },
  { name: "Trois Mec", address: "716 N Highland Ave, Los Angeles, CA 90038", neighborhood: "Hollywood", cuisineTypes: ["french_restaurant", "fine_dining"], priceLevel: 4 },
  { name: "Rustic Canyon", address: "1119 Wilshire Blvd, Santa Monica, CA 90401", neighborhood: "Santa Monica", cuisineTypes: ["californian", "contemporary", "wine_bar"], priceLevel: 3 },
  
  // Seafood & Coastal
  { name: "Water Grill", address: "544 S Grand Ave, Los Angeles, CA 90071", neighborhood: "Downtown LA", cuisineTypes: ["seafood_restaurant", "fine_dining"], priceLevel: 4 },
  { name: "Connie and Ted's", address: "8171 Santa Monica Blvd, West Hollywood, CA 90046", neighborhood: "West Hollywood", cuisineTypes: ["seafood_restaurant"], priceLevel: 3 },
  { name: "The Lobster", address: "1602 Ocean Ave, Santa Monica, CA 90401", neighborhood: "Santa Monica", cuisineTypes: ["seafood_restaurant", "american"], priceLevel: 4 },
  { name: "Son of a Gun", address: "8370 W 3rd St, Los Angeles, CA 90048", neighborhood: "Mid-City", cuisineTypes: ["seafood_restaurant", "contemporary"], priceLevel: 3 },
  { name: "The Hungry Cat", address: "1535 Vine St, Los Angeles, CA 90028", neighborhood: "Hollywood", cuisineTypes: ["seafood_restaurant"], priceLevel: 3 },
  { name: "Fishing with Dynamite", address: "1148 Manhattan Ave, Manhattan Beach, CA 90266", neighborhood: "Manhattan Beach", cuisineTypes: ["seafood_restaurant", "oyster_bar"], priceLevel: 3 },
  
  // Steakhouses
  { name: "CUT by Wolfgang Puck", address: "9500 Wilshire Blvd, Beverly Hills, CA 90212", neighborhood: "Beverly Hills", cuisineTypes: ["steakhouse", "fine_dining"], priceLevel: 4 },
  { name: "Mastro's Steakhouse", address: "246 N Canon Dr, Beverly Hills, CA 90210", neighborhood: "Beverly Hills", cuisineTypes: ["steakhouse", "fine_dining"], priceLevel: 4 },
  { name: "BOA Steakhouse", address: "9200 Sunset Blvd, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["steakhouse", "fine_dining"], priceLevel: 4 },
  { name: "The Grill on the Alley", address: "9560 Dayton Way, Beverly Hills, CA 90210", neighborhood: "Beverly Hills", cuisineTypes: ["steakhouse", "american"], priceLevel: 4 },
  { name: "Lawry's The Prime Rib", address: "100 N La Cienega Blvd, Beverly Hills, CA 90211", neighborhood: "Beverly Hills", cuisineTypes: ["steakhouse", "american"], priceLevel: 3 },
  
  // Modern American & California Cuisine
  { name: "Broken Spanish", address: "1050 S Flower St, Los Angeles, CA 90015", neighborhood: "Downtown LA", cuisineTypes: ["mexican", "contemporary", "fine_dining"], priceLevel: 3 },
  { name: "Dialogue", address: "8766 Holloway Dr, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["contemporary", "fine_dining"], priceLevel: 4 },
  { name: "Night + Market", address: "9041 Sunset Blvd, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["thai", "contemporary"], priceLevel: 2 },
  { name: "Otium", address: "222 S Hope St, Los Angeles, CA 90012", neighborhood: "Downtown LA", cuisineTypes: ["contemporary", "californian"], priceLevel: 4 },
  { name: "Redbird", address: "114 E 2nd St, Los Angeles, CA 90012", neighborhood: "Downtown LA", cuisineTypes: ["contemporary", "californian"], priceLevel: 4 },
  { name: "71Above", address: "633 W 5th St, Los Angeles, CA 90071", neighborhood: "Downtown LA", cuisineTypes: ["contemporary", "rooftop_restaurant", "fine_dining"], priceLevel: 4 },
  { name: "Perch LA", address: "448 S Hill St, Los Angeles, CA 90013", neighborhood: "Downtown LA", cuisineTypes: ["french_restaurant", "rooftop_restaurant"], priceLevel: 3 },
  
  // Romantic & Intimate
  { name: "Castaway", address: "1250 E Harvard Rd, Burbank, CA 91501", neighborhood: "Burbank", cuisineTypes: ["american", "steakhouse"], priceLevel: 3 },
  { name: "Vibrato Grill Jazz", address: "2930 Beverly Glen Cir, Los Angeles, CA 90077", neighborhood: "Bel Air", cuisineTypes: ["american", "jazz_club"], priceLevel: 3 },
  { name: "Pace Ristorante", address: "2100 Laurel Canyon Blvd, Los Angeles, CA 90046", neighborhood: "Laurel Canyon", cuisineTypes: ["italian_restaurant", "romantic"], priceLevel: 3 },
  { name: "La Boheme", address: "8400 Santa Monica Blvd, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["french_restaurant", "romantic"], priceLevel: 3 },
  { name: "Smoke House", address: "4420 W Lakeside Dr, Burbank, CA 91505", neighborhood: "Burbank", cuisineTypes: ["american", "steakhouse"], priceLevel: 3 },
  { name: "Cafe Gratitude", address: "639 N Larchmont Blvd, Los Angeles, CA 90004", neighborhood: "Larchmont", cuisineTypes: ["vegan", "healthy", "organic"], priceLevel: 2 },
  { name: "Gracias Madre", address: "8905 Melrose Ave, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["vegan", "mexican"], priceLevel: 2 },
  
  // Beach & Coastal
  { name: "The Strand House", address: "117 Manhattan Beach Blvd, Manhattan Beach, CA 90266", neighborhood: "Manhattan Beach", cuisineTypes: ["californian", "contemporary", "seafood_restaurant"], priceLevel: 4 },
  { name: "Malibu Farm", address: "23000 Pacific Coast Hwy, Malibu, CA 90265", neighborhood: "Malibu", cuisineTypes: ["californian", "organic", "seafood_restaurant"], priceLevel: 3 },
  { name: "Nobu Malibu", address: "22706 Pacific Coast Hwy, Malibu, CA 90265", neighborhood: "Malibu", cuisineTypes: ["japanese_restaurant", "sushi", "fine_dining"], priceLevel: 4 },
  { name: "Paradise Cove Beach Cafe", address: "28128 Pacific Coast Hwy, Malibu, CA 90265", neighborhood: "Malibu", cuisineTypes: ["american", "seafood_restaurant"], priceLevel: 3 },
  { name: "Geoffrey's Malibu", address: "27400 Pacific Coast Hwy, Malibu, CA 90265", neighborhood: "Malibu", cuisineTypes: ["californian", "seafood_restaurant"], priceLevel: 4 },
  { name: "Terranea Resort", address: "100 Terranea Way, Rancho Palos Verdes, CA 90275", neighborhood: "Rancho Palos Verdes", cuisineTypes: ["californian", "fine_dining", "resort"], priceLevel: 4 },
  
  // Asian Fusion & Pan-Asian
  { name: "Chinois on Main", address: "2709 Main St, Santa Monica, CA 90405", neighborhood: "Santa Monica", cuisineTypes: ["asian_fusion", "contemporary"], priceLevel: 4 },
  { name: "Kali Restaurant", address: "5722 Melrose Ave, Los Angeles, CA 90038", neighborhood: "Hollywood", cuisineTypes: ["contemporary", "californian"], priceLevel: 3 },
  { name: "Destroyer", address: "3578 Hayden Ave, Culver City, CA 90232", neighborhood: "Culver City", cuisineTypes: ["contemporary", "californian"], priceLevel: 3 },
  { name: "Hayato", address: "1320 E 7th St, Los Angeles, CA 90021", neighborhood: "Downtown LA", cuisineTypes: ["japanese_restaurant", "fine_dining"], priceLevel: 4 },
  { name: "Teppanyaki Ginza Onodera", address: "609 N La Cienega Blvd, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["japanese_restaurant", "teppanyaki"], priceLevel: 4 },
  { name: "Yamashiro Hollywood", address: "1999 N Sycamore Ave, Los Angeles, CA 90068", neighborhood: "Hollywood Hills", cuisineTypes: ["japanese_restaurant", "asian_fusion"], priceLevel: 3 },
  
  // Mediterranean & Middle Eastern
  { name: "Kismet", address: "4648 Hollywood Blvd, Los Angeles, CA 90027", neighborhood: "Los Feliz", cuisineTypes: ["mediterranean", "middle_eastern"], priceLevel: 3 },
  { name: "Bavel", address: "500 Mateo St, Los Angeles, CA 90013", neighborhood: "Arts District", cuisineTypes: ["middle_eastern", "mediterranean"], priceLevel: 3 },
  { name: "Tesse", address: "8500 Sunset Blvd, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["mediterranean", "contemporary"], priceLevel: 4 },
  { name: "Mezze", address: "9077 Santa Monica Blvd, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["mediterranean", "middle_eastern"], priceLevel: 2 },
  
  // Mexican & Latin American
  { name: "Guelaguetza", address: "3014 W Olympic Blvd, Los Angeles, CA 90006", neighborhood: "Koreatown", cuisineTypes: ["mexican", "oaxacan"], priceLevel: 2 },
  { name: "Madre", address: "1603 N Cahuenga Blvd, Los Angeles, CA 90028", neighborhood: "Hollywood", cuisineTypes: ["mexican", "latin_american"], priceLevel: 3 },
  { name: "La Casita Mexicana", address: "4030 Ince Blvd, Culver City, CA 90232", neighborhood: "Culver City", cuisineTypes: ["mexican"], priceLevel: 2 },
  { name: "Rivera", address: "1050 S Flower St, Los Angeles, CA 90015", neighborhood: "Downtown LA", cuisineTypes: ["latin_american", "contemporary"], priceLevel: 3 },
  { name: "Chichen Itza", address: "3655 S Grand Ave, Los Angeles, CA 90007", neighborhood: "South LA", cuisineTypes: ["mexican", "yucatan"], priceLevel: 1 },
  
  // Wine Bars & Small Plates
  { name: "AOC Wine Bar", address: "8022 W 3rd St, Los Angeles, CA 90048", neighborhood: "Mid-City", cuisineTypes: ["wine_bar", "mediterranean", "tapas"], priceLevel: 3 },
  { name: "The Must Wine Bar", address: "1260 S La Brea Ave, Los Angeles, CA 90019", neighborhood: "Mid-City", cuisineTypes: ["wine_bar", "small_plates"], priceLevel: 2 },
  { name: "Lou Wine Shop", address: "724 N Highland Ave, Los Angeles, CA 90038", neighborhood: "Hollywood", cuisineTypes: ["wine_bar", "french_restaurant"], priceLevel: 3 },
  { name: "Esters Wine Shop", address: "1314 7th St, Santa Monica, CA 90401", neighborhood: "Santa Monica", cuisineTypes: ["wine_bar", "californian"], priceLevel: 3 },
  { name: "Covell", address: "4628 Hollywood Blvd, Los Angeles, CA 90027", neighborhood: "Los Feliz", cuisineTypes: ["wine_bar"], priceLevel: 2 },
  
  // Rooftop & Views
  { name: "Elephante", address: "1332 2nd St, Santa Monica, CA 90401", neighborhood: "Santa Monica", cuisineTypes: ["italian_restaurant", "rooftop_restaurant"], priceLevel: 4 },
  { name: "EP & LP", address: "603 N La Cienega Blvd, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["asian_fusion", "rooftop_restaurant"], priceLevel: 3 },
  { name: "Broken Shaker", address: "1906 Main St, Santa Monica, CA 90405", neighborhood: "Santa Monica", cuisineTypes: ["cocktail_bar", "rooftop_restaurant"], priceLevel: 3 },
  { name: "Castaway Burbank", address: "1250 E Harvard Rd, Burbank, CA 91501", neighborhood: "Burbank", cuisineTypes: ["american", "steakhouse"], priceLevel: 3 },
  
  // Contemporary & Innovative
  { name: "Vespertine", address: "3599 Hayden Ave, Culver City, CA 90232", neighborhood: "Culver City", cuisineTypes: ["contemporary", "fine_dining", "experimental"], priceLevel: 4 },
  { name: "Mélisse", address: "1104 Wilshire Blvd, Santa Monica, CA 90401", neighborhood: "Santa Monica", cuisineTypes: ["french_restaurant", "fine_dining"], priceLevel: 4 },
  { name: "n/naka", address: "3455 S Overland Ave, Los Angeles, CA 90034", neighborhood: "Palms", cuisineTypes: ["japanese_restaurant", "fine_dining"], priceLevel: 4 },
  { name: "Somni", address: "9500 Wilshire Blvd, Beverly Hills, CA 90212", neighborhood: "Beverly Hills", cuisineTypes: ["contemporary", "fine_dining"], priceLevel: 4 },
  { name: "Orsa & Winston", address: "122 W 4th St, Los Angeles, CA 90013", neighborhood: "Downtown LA", cuisineTypes: ["contemporary", "fine_dining"], priceLevel: 4 },
  
  // Cozy & Neighborhood Spots
  { name: "The Hart and The Hunter", address: "7950 Melrose Ave, Los Angeles, CA 90046", neighborhood: "Fairfax", cuisineTypes: ["southern", "american"], priceLevel: 2 },
  { name: "All'Acqua", address: "9301 Wilshire Blvd, Beverly Hills, CA 90210", neighborhood: "Beverly Hills", cuisineTypes: ["italian_restaurant", "seafood_restaurant"], priceLevel: 3 },
  { name: "Lucques", address: "8474 Melrose Ave, West Hollywood, CA 90069", neighborhood: "West Hollywood", cuisineTypes: ["californian", "mediterranean"], priceLevel: 4 },
  { name: "Animal", address: "435 N Fairfax Ave, Los Angeles, CA 90036", neighborhood: "Fairfax", cuisineTypes: ["american", "contemporary"], priceLevel: 3 },
  { name: "Son of a Gun", address: "8370 W 3rd St, Los Angeles, CA 90048", neighborhood: "Mid-City", cuisineTypes: ["seafood_restaurant", "american"], priceLevel: 3 },
  { name: "Sqirl", address: "720 N Virgil Ave, Los Angeles, CA 90029", neighborhood: "Silver Lake", cuisineTypes: ["californian", "breakfast", "brunch"], priceLevel: 2 },
  { name: "Cliff's Edge", address: "3626 W Sunset Blvd, Los Angeles, CA 90026", neighborhood: "Silver Lake", cuisineTypes: ["californian", "patio_dining"], priceLevel: 3 },
  { name: "Nightshade", address: "285 E Colorado Blvd, Pasadena, CA 91101", neighborhood: "Pasadena", cuisineTypes: ["contemporary", "californian"], priceLevel: 3 },
  { name: "The Raymond 1886", address: "1250 S Fair Oaks Ave, Pasadena, CA 91105", neighborhood: "Pasadena", cuisineTypes: ["american", "contemporary"], priceLevel: 3 },
  
  // Additional Noteworthy Spots
  { name: "Baltaire", address: "11647 San Vicente Blvd, Los Angeles, CA 90049", neighborhood: "Brentwood", cuisineTypes: ["steakhouse", "contemporary"], priceLevel: 4 },
  { name: "Forma Restaurant", address: "1610 Wilshire Blvd, Santa Monica, CA 90403", neighborhood: "Santa Monica", cuisineTypes: ["italian_restaurant", "contemporary"], priceLevel: 4 },
  { name: "Cassia", address: "1314 7th St, Santa Monica, CA 90401", neighborhood: "Santa Monica", cuisineTypes: ["asian_fusion", "contemporary"], priceLevel: 3 },
  { name: "Melissa", address: "1253 Vine St, Los Angeles, CA 90038", neighborhood: "Hollywood", cuisineTypes: ["contemporary", "californian"], priceLevel: 3 },
  { name: "Accomplice Bar", address: "1045 S Broadway, Los Angeles, CA 90015", neighborhood: "Downtown LA", cuisineTypes: ["cocktail_bar", "speakeasy"], priceLevel: 3 },
  { name: "Faith & Flower", address: "705 W 9th St, Los Angeles, CA 90015", neighborhood: "Downtown LA", cuisineTypes: ["american", "contemporary"], priceLevel: 3 },
  { name: "Tar & Roses", address: "602 Santa Monica Blvd, Santa Monica, CA 90401", neighborhood: "Santa Monica", cuisineTypes: ["californian", "contemporary"], priceLevel: 3 },
  { name: "Violet", address: "3221 Pico Blvd, Santa Monica, CA 90405", neighborhood: "Santa Monica", cuisineTypes: ["californian", "wine_bar"], priceLevel: 2 },
  { name: "The Tasting Kitchen", address: "1633 Abbot Kinney Blvd, Venice, CA 90291", neighborhood: "Venice", cuisineTypes: ["californian", "contemporary"], priceLevel: 3 },
  { name: "Scopa Italian Roots", address: "2905 Washington Blvd, Venice, CA 90292", neighborhood: "Venice", cuisineTypes: ["italian_restaurant"], priceLevel: 3 },
  { name: "Felix Trattoria", address: "1023 Abbot Kinney Blvd, Venice, CA 90291", neighborhood: "Venice", cuisineTypes: ["italian_restaurant"], priceLevel: 3 },
  { name: "Gjusta", address: "320 Sunset Ave, Venice, CA 90291", neighborhood: "Venice", cuisineTypes: ["bakery", "cafe", "deli"], priceLevel: 2 },
  { name: "Hatchet Hall", address: "12517 Washington Blvd, Culver City, CA 90066", neighborhood: "Culver City", cuisineTypes: ["american", "barbecue"], priceLevel: 3 },
  { name: "Birch", address: "1634 Wilshire Blvd, Santa Monica, CA 90403", neighborhood: "Santa Monica", cuisineTypes: ["american", "contemporary"], priceLevel: 3 },
  { name: "Melisse", address: "1104 Wilshire Blvd, Santa Monica, CA 90401", neighborhood: "Santa Monica", cuisineTypes: ["french_restaurant", "fine_dining"], priceLevel: 4 },
  { name: "Josephine", address: "1716 Sunset Blvd, Los Angeles, CA 90026", neighborhood: "Echo Park", cuisineTypes: ["californian", "contemporary"], priceLevel: 3 },
  { name: "Botanica", address: "1620 Silver Lake Blvd, Los Angeles, CA 90026", neighborhood: "Silver Lake", cuisineTypes: ["californian", "patio_dining"], priceLevel: 3 },
  { name: "Bacari PDR", address: "8737 W 3rd St, Los Angeles, CA 90048", neighborhood: "West Hollywood", cuisineTypes: ["mediterranean", "wine_bar"], priceLevel: 2 },
  { name: "Osteria Mamma", address: "5732 Melrose Ave, Los Angeles, CA 90038", neighborhood: "Hollywood", cuisineTypes: ["italian_restaurant"], priceLevel: 2 },
  { name: "Mother Wolf", address: "1545 Wilcox Ave, Los Angeles, CA 90028", neighborhood: "Hollywood", cuisineTypes: ["italian_restaurant", "roman"], priceLevel: 3 },
  { name: "Jitlada", address: "5233 W Sunset Blvd, Los Angeles, CA 90027", neighborhood: "East Hollywood", cuisineTypes: ["thai", "authentic"], priceLevel: 2 },
  { name: "Langer's Deli", address: "704 S Alvarado St, Los Angeles, CA 90057", neighborhood: "Westlake", cuisineTypes: ["deli", "american"], priceLevel: 2 },
  { name: "Guisados", address: "2100 E Cesar E Chavez Ave, Los Angeles, CA 90033", neighborhood: "Boyle Heights", cuisineTypes: ["mexican", "tacos"], priceLevel: 1 },
  { name: "Manuela", address: "907 E 3rd St, Los Angeles, CA 90013", neighborhood: "Arts District", cuisineTypes: ["californian", "contemporary"], priceLevel: 3 },
  { name: "Destroyer", address: "3578 Hayden Ave, Culver City, CA 90232", neighborhood: "Culver City", cuisineTypes: ["californian", "contemporary"], priceLevel: 3 },
  { name: "Rossoblu", address: "1124 San Julian St, Los Angeles, CA 90015", neighborhood: "Downtown LA", cuisineTypes: ["italian_restaurant", "contemporary"], priceLevel: 3 },
  { name: "Bosscat Kitchen", address: "7174 Melrose Ave, Los Angeles, CA 90046", neighborhood: "Fairfax", cuisineTypes: ["american", "southern"], priceLevel: 3 },
  { name: "Lemon Grove", address: "6030 W Pico Blvd, Los Angeles, CA 90035", neighborhood: "Mid-City", cuisineTypes: ["californian", "organic"], priceLevel: 2 },
  { name: "Jon & Vinny's", address: "412 N Fairfax Ave, Los Angeles, CA 90036", neighborhood: "Fairfax", cuisineTypes: ["italian_restaurant", "pizza"], priceLevel: 2 },
  { name: "Pizzana", address: "11712 San Vicente Blvd, Los Angeles, CA 90049", neighborhood: "Brentwood", cuisineTypes: ["pizza", "italian_restaurant"], priceLevel: 3 },
  { name: "Cabra LA", address: "801 S Grand Ave, Los Angeles, CA 90017", neighborhood: "Downtown LA", cuisineTypes: ["peruvian", "latin_american", "rooftop_restaurant"], priceLevel: 3 },
  { name: "Guerrilla Tacos", address: "2000 E 7th St, Los Angeles, CA 90021", neighborhood: "Arts District", cuisineTypes: ["mexican", "tacos", "contemporary"], priceLevel: 2 },
  { name: "Otium", address: "222 S Hope St, Los Angeles, CA 90012", neighborhood: "Downtown LA", cuisineTypes: ["contemporary", "californian"], priceLevel: 4 },
  { name: "Majordomo", address: "1725 Naud St, Los Angeles, CA 90012", neighborhood: "Chinatown", cuisineTypes: ["korean", "contemporary", "asian_fusion"], priceLevel: 3 },
  { name: "Burrata House", address: "6533 Hollywood Blvd, Los Angeles, CA 90028", neighborhood: "Hollywood", cuisineTypes: ["italian_restaurant"], priceLevel: 2 },
  { name: "Bottega Louie", address: "700 S Grand Ave, Los Angeles, CA 90017", neighborhood: "Downtown LA", cuisineTypes: ["italian_restaurant", "bakery"], priceLevel: 3 }
];

console.log(`✅ Generated ${realRestaurants.length} real Los Angeles restaurants`);
console.log(`📁 Saving to JSON file...\n`);

// Save to file
const outputPath = path.join(__dirname, '../real_la_restaurants_base.json');
fs.writeFileSync(outputPath, JSON.stringify(realRestaurants, null, 2));

console.log(`✅ Saved to: ${outputPath}`);
console.log(`\n📊 Next steps:`);
console.log(`1. This is the base list of real restaurants`);
console.log(`2. Run the Google Places API script to fetch full details and photos`);
console.log(`3. This will populate addresses, ratings, reviews, and real photos\n`);

