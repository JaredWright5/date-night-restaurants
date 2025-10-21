# Infrastructure Improvement Plan for Date Night Restaurants

## Current State Analysis

### Strengths
- ✅ Static site generation with Astro (fast, SEO-friendly)
- ✅ TypeScript for type safety
- ✅ Structured data and SEO optimization
- ✅ Responsive design with Tailwind CSS
- ✅ Automated deployment with Cloudflare Pages

### Limitations
- ❌ Single JSON file for all data (not scalable)
- ❌ Manual data entry and updates
- ❌ No content management system
- ❌ Limited to Los Angeles only
- ❌ No real-time data updates
- ❌ No user-generated content

## Proposed Infrastructure Improvements

### Phase 1: Database Migration (Immediate - 2-3 weeks)

#### 1.1 Database Setup
**Option A: Supabase (Recommended)**
- PostgreSQL database with real-time capabilities
- Built-in authentication and API
- Row Level Security (RLS)
- Free tier: 500MB database, 50,000 monthly active users
- Easy migration from JSON to relational data

**Option B: PlanetScale (MySQL)**
- Serverless MySQL with branching
- Excellent for scaling
- Free tier: 1 billion reads, 10 million writes

**Option C: MongoDB Atlas**
- Document-based database
- Good for flexible restaurant data
- Free tier: 512MB storage

#### 1.2 Database Schema Design

```sql
-- Cities table
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  state VARCHAR(50),
  country VARCHAR(50) DEFAULT 'USA',
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  restaurant_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2),
  average_price_level DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Neighborhoods table
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  city_id UUID REFERENCES cities(id),
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  restaurant_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Restaurants table
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  city_id UUID REFERENCES cities(id),
  neighborhood_id UUID REFERENCES neighborhoods(id),
  address TEXT NOT NULL,
  phone VARCHAR(20),
  website VARCHAR(500),
  rating DECIMAL(3, 2),
  price_level INTEGER CHECK (price_level BETWEEN 1 AND 4),
  cuisine_types TEXT[],
  opening_hours JSONB,
  photos TEXT[],
  place_id VARCHAR(200),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  date_night_score INTEGER CHECK (date_night_score BETWEEN 1 AND 100),
  is_top_rated BOOLEAN DEFAULT FALSE,
  description TEXT,
  amenities TEXT[],
  special_features TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  author VARCHAR(100) NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cuisines table
CREATE TABLE cuisines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7),
  restaurant_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Restaurant-Cuisine junction table
CREATE TABLE restaurant_cuisines (
  restaurant_id UUID REFERENCES restaurants(id),
  cuisine_id UUID REFERENCES cuisines(id),
  PRIMARY KEY (restaurant_id, cuisine_id)
);
```

#### 1.3 Data Migration Script
```typescript
// scripts/migrate-to-database.ts
import { createClient } from '@supabase/supabase-js';
import laRestaurants from '../la_date_night_restaurants_real.json';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function migrateData() {
  // 1. Create Los Angeles city record
  const { data: city } = await supabase
    .from('cities')
    .insert({
      name: 'Los Angeles',
      slug: 'los-angeles',
      state: 'California',
      country: 'USA',
      description: 'The entertainment capital of the world...',
      latitude: 34.0522,
      longitude: -118.2437
    })
    .select()
    .single();

  // 2. Create neighborhoods
  const neighborhoods = [...new Set(laRestaurants.map(r => r.neighborhood))];
  for (const neighborhood of neighborhoods) {
    await supabase.from('neighborhoods').insert({
      name: neighborhood,
      slug: neighborhood.toLowerCase().replace(/\s+/g, '-'),
      city_id: city.id,
      description: `Explore romantic dining in ${neighborhood}...`
    });
  }

  // 3. Create cuisines
  const cuisineTypes = [...new Set(laRestaurants.flatMap(r => r.cuisine_types))];
  for (const cuisine of cuisineTypes) {
    await supabase.from('cuisines').insert({
      name: cuisine.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      slug: cuisine,
      description: `Discover ${cuisine} restaurants for date night...`
    });
  }

  // 4. Migrate restaurants
  for (const restaurant of laRestaurants) {
    await supabase.from('restaurants').insert({
      name: restaurant.name,
      slug: restaurant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      city_id: city.id,
      // ... map all other fields
    });
  }
}
```

### Phase 2: Content Management System (2-3 weeks)

#### 2.1 Admin Dashboard
**Technology Stack:**
- Next.js 14 with App Router
- Supabase for backend
- Tailwind CSS + shadcn/ui for UI
- React Hook Form for forms
- Zod for validation

**Features:**
- Restaurant CRUD operations
- Bulk import/export
- Image management
- SEO optimization tools
- Analytics dashboard
- User management

#### 2.2 Admin Dashboard Structure
```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── restaurants/
│   │   │   ├── [id]/
│   │   │   └── new/
│   │   ├── cities/
│   │   ├── neighborhoods/
│   │   └── analytics/
│   └── api/
│       ├── restaurants/
│       ├── cities/
│       └── upload/
├── components/
│   ├── admin/
│   ├── forms/
│   └── ui/
└── lib/
    ├── database/
    ├── validations/
    └── utils/
```

### Phase 3: Multi-City Expansion (3-4 weeks)

#### 3.1 City Management System
```typescript
// lib/cities.ts
export interface CityConfig {
  id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  coordinates: { lat: number; lng: number };
  timezone: string;
  currency: string;
  popularNeighborhoods: string[];
  localCuisines: string[];
  dateNightCulture: {
    averagePriceRange: [number, number];
    popularTimes: string[];
    specialOccasions: string[];
  };
}

export const cityConfigs: Record<string, CityConfig> = {
  'los-angeles': {
    id: 'los-angeles',
    name: 'Los Angeles',
    slug: 'los-angeles',
    state: 'California',
    country: 'USA',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    popularNeighborhoods: ['Beverly Hills', 'West Hollywood', 'Santa Monica'],
    localCuisines: ['Mexican', 'Korean', 'Japanese'],
    dateNightCulture: {
      averagePriceRange: [50, 150],
      popularTimes: ['7:00 PM', '8:00 PM'],
      specialOccasions: ['Anniversaries', 'Proposals', 'Birthdays']
    }
  },
  'new-york': {
    id: 'new-york',
    name: 'New York City',
    slug: 'new-york',
    state: 'New York',
    country: 'USA',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    timezone: 'America/New_York',
    currency: 'USD',
    popularNeighborhoods: ['Manhattan', 'Brooklyn', 'Queens'],
    localCuisines: ['Italian', 'Chinese', 'Jewish'],
    dateNightCulture: {
      averagePriceRange: [75, 200],
      popularTimes: ['7:30 PM', '8:30 PM'],
      specialOccasions: ['Broadway Shows', 'Central Park', 'Skyline Views']
    }
  }
};
```

#### 3.2 Dynamic Route Generation
```typescript
// src/pages/[city]/index.astro
export async function getStaticPaths() {
  const cities = await getCities();
  return cities.map(city => ({
    params: { city: city.slug }
  }));
}

// src/pages/[city]/[restaurant].astro
export async function getStaticPaths() {
  const restaurants = await getRestaurantsByCity();
  return restaurants.map(restaurant => ({
    params: { 
      city: restaurant.city.slug,
      restaurant: restaurant.slug 
    }
  }));
}
```

### Phase 4: Advanced Features (4-6 weeks)

#### 4.1 Real-Time Data Integration
```typescript
// lib/integrations/google-places.ts
export class GooglePlacesIntegration {
  async syncRestaurantData(placeId: string) {
    const placeDetails = await this.getPlaceDetails(placeId);
    const photos = await this.getPlacePhotos(placeId);
    const reviews = await this.getPlaceReviews(placeId);
    
    return {
      rating: placeDetails.rating,
      priceLevel: placeDetails.price_level,
      photos: photos,
      reviews: reviews,
      openingHours: placeDetails.opening_hours,
      lastUpdated: new Date().toISOString()
    };
  }
}

// lib/integrations/resy.ts
export class ResyIntegration {
  async getAvailability(restaurantId: string, date: string) {
    // Integration with Resy API for real-time availability
  }
}
```

#### 4.2 User-Generated Content
```typescript
// User reviews and ratings
interface UserReview {
  id: string;
  userId: string;
  restaurantId: string;
  rating: number;
  review: string;
  photos: string[];
  helpful: number;
  createdAt: Date;
}

// User favorites and lists
interface UserList {
  id: string;
  userId: string;
  name: string;
  description: string;
  restaurants: string[];
  isPublic: boolean;
}
```

#### 4.3 Advanced Analytics
```typescript
// lib/analytics/restaurant-analytics.ts
export class RestaurantAnalytics {
  async getPopularRestaurants(city: string, timeframe: string) {
    // Track page views, clicks, and conversions
  }
  
  async getTrendingCuisines(city: string) {
    // Analyze search patterns and user behavior
  }
  
  async getSeasonalTrends(city: string) {
    // Track seasonal variations in restaurant popularity
  }
}
```

### Phase 5: Scalability & Performance (2-3 weeks)

#### 5.1 Caching Strategy
```typescript
// lib/cache/redis-cache.ts
export class RedisCache {
  async getRestaurants(city: string, filters: FilterOptions) {
    const cacheKey = `restaurants:${city}:${JSON.stringify(filters)}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
    
    const restaurants = await this.fetchFromDatabase(city, filters);
    await redis.setex(cacheKey, 3600, JSON.stringify(restaurants));
    return restaurants;
  }
}
```

#### 5.2 CDN and Image Optimization
```typescript
// lib/images/image-optimization.ts
export class ImageOptimization {
  async optimizeRestaurantImage(url: string, options: {
    width: number;
    height: number;
    quality: number;
    format: 'webp' | 'avif' | 'jpeg';
  }) {
    // Use Cloudinary or similar service
    return `https://res.cloudinary.com/your-account/image/fetch/w_${options.width},h_${options.height},q_${options.quality},f_${options.format}/${url}`;
  }
}
```

## Implementation Timeline

### Week 1-2: Database Setup
- [ ] Set up Supabase project
- [ ] Design and create database schema
- [ ] Write migration scripts
- [ ] Migrate existing LA data

### Week 3-4: Admin Dashboard
- [ ] Create Next.js admin application
- [ ] Build restaurant management interface
- [ ] Implement CRUD operations
- [ ] Add image upload functionality

### Week 5-8: Multi-City Expansion
- [ ] Add New York City data
- [ ] Create dynamic routing system
- [ ] Update Astro site for multi-city support
- [ ] Add city-specific SEO optimization

### Week 9-12: Advanced Features
- [ ] Real-time data integration
- [ ] User authentication system
- [ ] User-generated content
- [ ] Advanced analytics

### Week 13-14: Performance & Scaling
- [ ] Implement caching strategy
- [ ] Optimize images and assets
- [ ] Set up monitoring and alerts
- [ ] Performance testing

## Cost Analysis

### Current Costs
- Cloudflare Pages: Free
- Domain: ~$15/year
- **Total: ~$15/year**

### Proposed Costs (Monthly)
- Supabase Pro: $25/month (500MB database, 100GB bandwidth)
- Cloudflare Pages: Free
- Domain: ~$1.25/month
- **Total: ~$26.25/month**

### Scaling Costs (When needed)
- Supabase Team: $599/month (8GB database, 1TB bandwidth)
- Additional services as needed

## Benefits of New Infrastructure

### For Development
- ✅ Scalable database architecture
- ✅ Type-safe API endpoints
- ✅ Automated data management
- ✅ Real-time updates
- ✅ Multi-city support

### For Content Management
- ✅ Easy restaurant additions
- ✅ Bulk data operations
- ✅ Image management
- ✅ SEO optimization tools
- ✅ Analytics dashboard

### For Users
- ✅ Faster page loads
- ✅ More accurate data
- ✅ Better search functionality
- ✅ User-generated content
- ✅ Mobile-optimized experience

## Next Steps

1. **Choose Database Provider** (Recommend Supabase)
2. **Set up Development Environment**
3. **Create Database Schema**
4. **Build Migration Scripts**
5. **Start with Admin Dashboard**
6. **Gradually migrate existing functionality**

Would you like me to start implementing any of these phases?
