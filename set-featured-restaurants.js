// Set featured restaurants in localStorage
const featuredSlugs = [
  'felix-trattoria',
  'gjelina-on-abbot-kinney', 
  'fishing-with-dynamite',
  'bavel'
];

localStorage.setItem('featuredRestaurants', JSON.stringify(featuredSlugs));
console.log('Featured restaurants set:', featuredSlugs);
