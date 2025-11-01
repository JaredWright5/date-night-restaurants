import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const generateRedirectPage = (oldSlug, newSlug) => {
  return `---
// Redirect old restaurant URL with number to new clean URL
export function getStaticPaths() {
  return [];
}

return Astro.redirect('/losangeles/${newSlug}/');
---`;
};

// List of all restaurant mappings from old numbered slugs to new clean slugs
const restaurantMappings = [
  { name: 'Providence', oldSlug: 'providence-1', newSlug: 'providence' },
  { name: 'République Café Bakery & République Restaurant', oldSlug: 'rpublique-caf-bakery-rpublique-restaurant-2', newSlug: 'rpublique-caf-bakery-rpublique-restaurant' },
  { name: 'Bestia', oldSlug: 'bestia-3', newSlug: 'bestia' },
  { name: 'Bavel', oldSlug: 'bavel-4', newSlug: 'bavel' },
  { name: 'Gjelina', oldSlug: 'gjelina-5', newSlug: 'gjelina' },
  { name: 'Osteria Mozza', oldSlug: 'osteria-mozza-6', newSlug: 'osteria-mozza' },
  { name: 'Spago Beverly Hills', oldSlug: 'spago-beverly-hills-7', newSlug: 'spago-beverly-hills' },
  { name: 'Nobu Los Angeles', oldSlug: 'nobu-los-angeles-8', newSlug: 'nobu-los-angeles' },
  { name: 'Catch LA', oldSlug: 'catch-la-9', newSlug: 'catch-la' },
  { name: 'The Little Door', oldSlug: 'the-little-door-10', newSlug: 'the-little-door' },
  { name: 'A.O.C.', oldSlug: 'aoc-11', newSlug: 'aoc' },
  { name: 'Perch LA', oldSlug: 'perch-la-12', newSlug: 'perch-la' },
  { name: '71Above', oldSlug: '71above-13', newSlug: '71above' },
  { name: 'The Strand House', oldSlug: 'the-strand-house-14', newSlug: 'the-strand-house' },
  { name: 'Nobu Malibu', oldSlug: 'nobu-malibu-15', newSlug: 'nobu-malibu' },
  { name: 'Malibu Farm Restaurant at the Pier', oldSlug: 'malibu-farm-restaurant-at-the-pier-16', newSlug: 'malibu-farm-restaurant-at-the-pier' },
  { name: 'Geoffrey\'s Malibu', oldSlug: 'geoffreys-malibu-17', newSlug: 'geoffreys-malibu' },
  { name: 'Yamashiro Hollywood', oldSlug: 'yamashiro-hollywood-18', newSlug: 'yamashiro-hollywood' },
  { name: 'Castaway Burbank', oldSlug: 'castaway-burbank-19', newSlug: 'castaway-burbank' },
  { name: 'CUT by Wolfgang Puck', oldSlug: 'cut-by-wolfgang-puck-20', newSlug: 'cut-by-wolfgang-puck' },
  { name: 'Mastro\'s Steakhouse Beverly Hills', oldSlug: 'mastros-steakhouse-beverly-hills-21', newSlug: 'mastros-steakhouse-beverly-hills' },
  { name: 'Lawry\'s The Prime Rib', oldSlug: 'lawrys-the-prime-rib-22', newSlug: 'lawrys-the-prime-rib' },
  { name: 'Water Grill', oldSlug: 'water-grill-23', newSlug: 'water-grill' },
  { name: 'BOA Steakhouse', oldSlug: 'boa-steakhouse-24', newSlug: 'boa-steakhouse' },
  { name: 'Rustic Canyon', oldSlug: 'rustic-canyon-25', newSlug: 'rustic-canyon' },
  { name: 'Mélisse Restaurant', oldSlug: 'mlisse-restaurant-26', newSlug: 'mlisse-restaurant' },
  { name: 'Vespertine', oldSlug: 'vespertine-27', newSlug: 'vespertine' },
  { name: 'n/naka', oldSlug: 'nnaka-28', newSlug: 'nnaka' },
  { name: 'Hayato', oldSlug: 'hayato-29', newSlug: 'hayato' },
  { name: 'Orsa & Winston', oldSlug: 'orsa-winston-30', newSlug: 'orsa-winston' },
  { name: 'Lucques', oldSlug: 'lucques-31', newSlug: 'lucques' },
  { name: 'Animal Restaurant', oldSlug: 'animal-restaurant-32', newSlug: 'animal-restaurant' },
  { name: 'Son of a Gun', oldSlug: 'son-of-a-gun-33', newSlug: 'son-of-a-gun' },
  { name: 'Connie and Ted\'s', oldSlug: 'connie-and-teds-34', newSlug: 'connie-and-teds' },
  { name: 'Pasjoli', oldSlug: 'pasjoli-35', newSlug: 'pasjoli' },
  { name: 'Otium', oldSlug: 'otium-36', newSlug: 'otium' },
  { name: 'Redbird', oldSlug: 'redbird-37', newSlug: 'redbird' },
  { name: 'Broken Spanish', oldSlug: 'broken-spanish-38', newSlug: 'broken-spanish' },
  { name: 'Tesse Restaurant', oldSlug: 'tesse-restaurant-39', newSlug: 'tesse-restaurant' },
  { name: 'Petit Trois', oldSlug: 'petit-trois-40', newSlug: 'petit-trois' },
  { name: 'Trois Mec', oldSlug: 'trois-mec-41', newSlug: 'trois-mec' },
  { name: 'Matsuhisa Beverly Hills', oldSlug: 'matsuhisa-beverly-hills-42', newSlug: 'matsuhisa-beverly-hills' },
  { name: 'Sushi Park', oldSlug: 'sushi-park-43', newSlug: 'sushi-park' },
  { name: 'Asanebo', oldSlug: 'asanebo-44', newSlug: 'asanebo' },
  { name: 'Urasawa', oldSlug: 'urasawa-45', newSlug: 'urasawa' },
  { name: 'Katsuya Brentwood', oldSlug: 'katsuya-brentwood-46', newSlug: 'katsuya-brentwood' },
  { name: 'Élephante', oldSlug: 'lephante-47', newSlug: 'lephante' },
  { name: 'EP & LP Rooftop', oldSlug: 'ep-lp-rooftop-48', newSlug: 'ep-lp-rooftop' },
  { name: 'Cassia', oldSlug: 'cassia-49', newSlug: 'cassia' },
  { name: 'Forma Restaurant & Cheese Bar', oldSlug: 'forma-restaurant-cheese-bar-50', newSlug: 'forma-restaurant-cheese-bar' },
  { name: 'Felix Trattoria', oldSlug: 'felix-trattoria-51', newSlug: 'felix-trattoria' },
  { name: 'Scopa Italian Roots', oldSlug: 'scopa-italian-roots-52', newSlug: 'scopa-italian-roots' },
  { name: 'The Tasting Kitchen', oldSlug: 'the-tasting-kitchen-53', newSlug: 'the-tasting-kitchen' },
  { name: 'Tar & Roses', oldSlug: 'tar-roses-54', newSlug: 'tar-roses' },
  { name: 'Birch', oldSlug: 'birch-55', newSlug: 'birch' },
  { name: 'Hatchet Hall', oldSlug: 'hatchet-hall-56', newSlug: 'hatchet-hall' },
  { name: 'Destroyer', oldSlug: 'destroyer-57', newSlug: 'destroyer' },
  { name: 'Manuela', oldSlug: 'manuela-58', newSlug: 'manuela' },
  { name: 'Rossoblu DTLA', oldSlug: 'rossoblu-dtla-59', newSlug: 'rossoblu-dtla' },
  { name: 'Majordomo', oldSlug: 'majordomo-60', newSlug: 'majordomo' },
  { name: 'Guerrilla Tacos', oldSlug: 'guerrilla-tacos-61', newSlug: 'guerrilla-tacos' },
  { name: 'Cabra Los Angeles', oldSlug: 'cabra-los-angeles-62', newSlug: 'cabra-los-angeles' },
  { name: 'Faith & Flower', oldSlug: 'faith-flower-63', newSlug: 'faith-flower' },
  { name: 'Baltaire Restaurant', oldSlug: 'baltaire-restaurant-64', newSlug: 'baltaire-restaurant' },
  { name: 'The Grill on the Alley', oldSlug: 'the-grill-on-the-alley-65', newSlug: 'the-grill-on-the-alley' },
  { name: 'Toscana Brentwood', oldSlug: 'toscana-brentwood-66', newSlug: 'toscana-brentwood' },
  { name: 'Giorgio Baldi', oldSlug: 'giorgio-baldi-67', newSlug: 'giorgio-baldi' },
  { name: 'Madeo Ristorante', oldSlug: 'madeo-ristorante-68', newSlug: 'madeo-ristorante' },
  { name: 'Angelini Osteria', oldSlug: 'angelini-osteria-69', newSlug: 'angelini-osteria' },
  { name: 'Osteria La Buca', oldSlug: 'osteria-la-buca-70', newSlug: 'osteria-la-buca' },
  { name: 'Cecconi\'s West Hollywood', oldSlug: 'cecconis-west-hollywood-71', newSlug: 'cecconis-west-hollywood' },
  { name: 'Mother Wolf', oldSlug: 'mother-wolf-72', newSlug: 'mother-wolf' },
  { name: 'Osteria Mamma', oldSlug: 'osteria-mamma-73', newSlug: 'osteria-mamma' },
  { name: 'Jon & Vinny\'s Fairfax', oldSlug: 'jon-vinnys-fairfax-74', newSlug: 'jon-vinnys-fairfax' },
  { name: 'Pizzana', oldSlug: 'pizzana-75', newSlug: 'pizzana' },
  { name: 'Chinois on Main', oldSlug: 'chinois-on-main-76', newSlug: 'chinois-on-main' },
  { name: 'Kali Steak', oldSlug: 'kali-steak-77', newSlug: 'kali-steak' },
  { name: 'Kismet', oldSlug: 'kismet-78', newSlug: 'kismet' },
  { name: 'Gracias Madre', oldSlug: 'gracias-madre-79', newSlug: 'gracias-madre' },
  { name: 'Crossroads Kitchen', oldSlug: 'crossroads-kitchen-80', newSlug: 'crossroads-kitchen' },
  { name: 'Night + Market Weho', oldSlug: 'night-market-weho-81', newSlug: 'night-market-weho' },
  { name: 'Jitlada Thai', oldSlug: 'jitlada-thai-82', newSlug: 'jitlada-thai' },
  { name: 'Guelaguetza Restaurant', oldSlug: 'guelaguetza-restaurant-83', newSlug: 'guelaguetza-restaurant' },
  { name: 'Madre! Oaxacan Restaurant and Mezcaleria', oldSlug: 'madre-oaxacan-restaurant-and-mezcaleria-84', newSlug: 'madre-oaxacan-restaurant-and-mezcaleria' },
  { name: 'La Casita Mexicana', oldSlug: 'la-casita-mexicana-85', newSlug: 'la-casita-mexicana' },
  { name: 'Burrata House', oldSlug: 'burrata-house-86', newSlug: 'burrata-house' },
  { name: 'Bottega Louie', oldSlug: 'bottega-louie-87', newSlug: 'bottega-louie' },
  { name: 'Church & State', oldSlug: 'church-state-88', newSlug: 'church-state' },
  { name: 'Lou Wine Shop', oldSlug: 'lou-wine-shop-89', newSlug: 'lou-wine-shop' },
  { name: 'Esters Wine Shop & Oyster Bar', oldSlug: 'esters-wine-shop-oyster-bar-90', newSlug: 'esters-wine-shop-oyster-bar' },
  { name: 'Covell Wine Bar', oldSlug: 'covell-wine-bar-91', newSlug: 'covell-wine-bar' },
  { name: 'The Must Wine Bar', oldSlug: 'the-must-wine-bar-92', newSlug: 'the-must-wine-bar' },
  { name: 'Cliff\'s Edge Silver Lake', oldSlug: 'cliffs-edge-silver-lake-93', newSlug: 'cliffs-edge-silver-lake' },
  { name: 'Botanica Restaurant and Market', oldSlug: 'botanica-restaurant-and-market-94', newSlug: 'botanica-restaurant-and-market' },
  { name: 'Josephine Eatery', oldSlug: 'josephine-eatery-95', newSlug: 'josephine-eatery' },
  { name: 'Sqirl', oldSlug: 'sqirl-96', newSlug: 'sqirl' },
  { name: 'Nightshade Pasadena', oldSlug: 'nightshade-pasadena-97', newSlug: 'nightshade-pasadena' },
  { name: 'The Raymond 1886', oldSlug: 'the-raymond-1886-98', newSlug: 'the-raymond-1886' },
  { name: 'Vibrato Grill Jazz', oldSlug: 'vibrato-grill-jazz-99', newSlug: 'vibrato-grill-jazz' },
  { name: 'Smoke House Restaurant', oldSlug: 'smoke-house-restaurant-100', newSlug: 'smoke-house-restaurant' },
  { name: 'The Rose Venice', oldSlug: 'the-rose-venice-101', newSlug: 'the-rose-venice' },
  { name: 'Cafe Gratitude Venice', oldSlug: 'cafe-gratitude-venice-102', newSlug: 'cafe-gratitude-venice' },
  { name: 'The Butcher\'s Daughter', oldSlug: 'the-butchers-daughter-103', newSlug: 'the-butchers-daughter' },
  { name: 'Plant Food + Wine', oldSlug: 'plant-food-wine-104', newSlug: 'plant-food-wine' },
  { name: 'The Cow\'s End Cafe', oldSlug: 'the-cows-end-cafe-105', newSlug: 'the-cows-end-cafe' },
  { name: 'Venice Beach Wines', oldSlug: 'venice-beach-wines-106', newSlug: 'venice-beach-wines' },
  { name: 'The Brig Venice', oldSlug: 'the-brig-venice-107', newSlug: 'the-brig-venice' },
  { name: 'Gjelina on Abbot Kinney', oldSlug: 'gjelina-on-abbot-kinney-108', newSlug: 'gjelina-on-abbot-kinney' },
  { name: 'Gjelina To Go', oldSlug: 'gjelina-to-go-109', newSlug: 'gjelina-to-go' },
  { name: 'The Misfit Restaurant + Bar', oldSlug: 'the-misfit-restaurant-bar-110', newSlug: 'the-misfit-restaurant-bar' },
  { name: 'Elephante', oldSlug: 'elephante-111', newSlug: 'elephante' },
  { name: 'The Albright', oldSlug: 'the-albright-112', newSlug: 'the-albright' },
  { name: 'The Lobster', oldSlug: 'the-lobster-113', newSlug: 'the-lobster' },
  { name: 'Blue Plate Oysterette', oldSlug: 'blue-plate-oysterette-114', newSlug: 'blue-plate-oysterette' },
  { name: 'Fishing with Dynamite', oldSlug: 'fishing-with-dynamite-115', newSlug: 'fishing-with-dynamite' },
  { name: 'The Arthur J', oldSlug: 'the-arthur-j-116', newSlug: 'the-arthur-j' },
  { name: 'Manhattan Beach Post', oldSlug: 'manhattan-beach-post-117', newSlug: 'manhattan-beach-post' }
];

function createAllRedirects() {
  const redirectsDir = join(process.cwd(), 'src', 'pages', 'losangeles');
  mkdirSync(redirectsDir, { recursive: true });

  let createdCount = 0;
  let skippedCount = 0;

  console.log(`Creating redirects for ${restaurantMappings.length} restaurants...`);

  for (const mapping of restaurantMappings) {
    const filePath = join(redirectsDir, `${mapping.oldSlug}.astro`);
    
    if (!existsSync(filePath)) {
      const pageContent = generateRedirectPage(mapping.oldSlug, mapping.newSlug);
      writeFileSync(filePath, pageContent);
      console.log(`Created redirect: ${mapping.name} (${mapping.oldSlug} -> ${mapping.newSlug})`);
      createdCount++;
    } else {
      console.log(`Redirect page already exists for ${mapping.name}, skipping.`);
      skippedCount++;
    }
  }

  console.log(`\n✅ Created ${createdCount} redirect pages!`);
  console.log(`Skipped: ${skippedCount} restaurants (already exist)`);
  console.log('All old restaurant URLs with numbers will now redirect to clean URLs');
}

createAllRedirects();
