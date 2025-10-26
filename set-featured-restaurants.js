// This script is meant to be run in the browser console to set featured restaurants in localStorage
const defaultFeaturedSlugs = ['cabra-los-angeles', 'otium', 'vibrato-grill-jazz', 'the-raymond-1886'];
localStorage.setItem('featuredRestaurants', JSON.stringify(defaultFeaturedSlugs));
console.log('Default featured restaurants set in localStorage:', defaultFeaturedSlugs);
