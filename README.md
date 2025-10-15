# LA Date Night Restaurants - Astro SEO Directory

A programmatic SEO directory for date night restaurants built with Astro, designed to scale across multiple cities.

## 🚀 Features

- **Programmatic SEO**: Dynamic page generation for restaurants, cities, and cuisines
- **Scalable Architecture**: Easy to add new cities and restaurants
- **Advanced SEO**: Structured data, meta tags, sitemaps, and optimized content
- **Modern UI**: Responsive design with Tailwind CSS
- **Performance**: Static site generation with Astro
- **Type Safety**: Full TypeScript support

## 📁 Project Structure

```
src/
├── components/          # Reusable Astro components
│   ├── Header.astro
│   ├── Footer.astro
│   └── RestaurantCard.astro
├── data/               # Data layer for restaurants, cities, cuisines
│   ├── restaurants.ts
│   ├── cities.ts
│   └── cuisines.ts
├── layouts/            # Page layouts
│   └── BaseLayout.astro
├── pages/              # Dynamic pages
│   ├── index.astro
│   ├── restaurants/
│   │   └── [slug].astro
│   ├── cities/
│   │   └── [slug].astro
│   └── cuisines/
│       └── [slug].astro
└── types/              # TypeScript type definitions
    └── index.ts
```

## 🛠️ Setup & Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Commands

```bash
# Generate restaurant data
npm run generate

# Type checking
npm run astro check

# Build with type checking
npm run build
```

## 📊 Data Management

### Adding New Restaurants

1. Update `src/data/restaurants.ts`
2. Add restaurant data to the `restaurants` array
3. Run `npm run build` to generate new pages

### Adding New Cities

1. Update `src/data/cities.ts`
2. Add city data to the `cities` array
3. Update restaurant data to include new city
4. Run `npm run build` to generate new pages

### Data Structure

```typescript
interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  priceLevel: number;
  cuisineTypes: string[];
  openingHours: Record<string, string>;
  reviews: Review[];
  photos: string[];
  placeId: string;
  latitude: number;
  longitude: number;
  dateNightScore: number;
  city: string;
  area: string;
  zipCode: string;
  description?: string;
  amenities?: string[];
  specialFeatures?: string[];
  lastUpdated: string;
}
```

## 🎯 SEO Features

### Automatic Page Generation

- **Restaurant Pages**: `/restaurants/[slug]/`
- **City Pages**: `/cities/[slug]/`
- **Cuisine Pages**: `/cuisines/[slug]/`

### SEO Optimizations

- **Structured Data**: JSON-LD for restaurants, cities, and organizations
- **Meta Tags**: Dynamic title, description, and Open Graph tags
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: SEO-friendly crawling instructions
- **Canonical URLs**: Proper canonical link tags
- **Internal Linking**: Strategic cross-linking between pages

### Performance

- **Static Generation**: Pre-built pages for maximum speed
- **Image Optimization**: Responsive images with proper alt tags
- **Code Splitting**: Automatic code splitting with Astro
- **Lazy Loading**: Images and components load on demand

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on git push

### Vercel

1. Connect your GitHub repository to Vercel
2. Set framework preset to Astro
3. Deploy automatically on git push

### Manual Deployment

```bash
# Build the project
npm run build

# Upload dist/ folder to your hosting provider
```

## 📈 Scaling to Multiple Cities

### Adding New Cities

1. **Update Cities Data**:
   ```typescript
   // src/data/cities.ts
   export const cities: City[] = [
     // ... existing cities
     {
       id: 'san-francisco',
       name: 'San Francisco',
       slug: 'san-francisco',
       state: 'California',
       country: 'United States',
       description: 'Romantic dining in the City by the Bay...',
       coordinates: { latitude: 37.7749, longitude: -122.4194 },
       restaurantCount: 0,
       topRestaurants: [],
       popularCuisines: [],
       averageRating: 0,
       averagePriceLevel: 0,
       lastUpdated: new Date().toISOString(),
     }
   ];
   ```

2. **Add Restaurant Data**:
   ```typescript
   // src/data/restaurants.ts
   const newRestaurants = [
     // ... SF restaurants
   ];
   ```

3. **Update Navigation**:
   ```astro
   <!-- src/components/Header.astro -->
   <li><a href="/cities/san-francisco/">San Francisco</a></li>
   ```

### SEO Strategy for Multiple Cities

- **City-Specific Landing Pages**: Each city gets its own optimized page
- **Local SEO**: Include city names in titles, descriptions, and content
- **Geographic Structured Data**: Proper location markup for each city
- **Cross-City Linking**: Link between related cities and restaurants

## 🔧 Customization

### Styling

- **Tailwind CSS**: Customize in `tailwind.config.mjs`
- **Component Styles**: Scoped styles in `.astro` files
- **Global Styles**: Add to `BaseLayout.astro`

### Content

- **Restaurant Data**: Update `src/data/restaurants.ts`
- **City Information**: Update `src/data/cities.ts`
- **Cuisine Types**: Update `src/data/cuisines.ts`

### SEO

- **Meta Tags**: Customize in `BaseLayout.astro`
- **Structured Data**: Update in individual page components
- **Sitemap**: Configure in `astro.config.mjs`

## 📊 Analytics & Monitoring

### Google Analytics

Add to `BaseLayout.astro`:

```astro
<script>
  // Google Analytics
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Search Console

- Submit sitemap: `https://yoursite.com/sitemap.xml`
- Monitor indexing status
- Track search performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions or issues:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

Built with ❤️ using Astro, TypeScript, and Tailwind CSS# Force Cloudflare deployment
