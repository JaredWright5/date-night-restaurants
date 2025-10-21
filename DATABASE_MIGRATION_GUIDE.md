# Database Migration Guide

## Overview
This guide will help you migrate from the current JSON-based data system to a scalable database infrastructure using Supabase.

## Prerequisites

### 1. Supabase Account Setup
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note down your project URL and anon key from Settings > API

### 2. Environment Variables
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key

# Optional: For admin operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Install Dependencies
```bash
npm install @supabase/supabase-js
```

## Migration Steps

### Step 1: Database Setup
Run the database setup script:

```bash
node scripts/setup-database-infrastructure.js
```

This will:
- Create all necessary tables
- Set up indexes for performance
- Create triggers for automatic timestamps
- Migrate your existing LA restaurant data

### Step 2: Update Data Access Layer
Replace the current JSON imports with database calls:

**Before (src/data/restaurants.ts):**
```typescript
import laRestaurants from '../../la_date_night_restaurants_real.json';

export const restaurants: Restaurant[] = laRestaurants.map((restaurant, index) => ({
  // ... mapping logic
}));
```

**After (src/data/restaurants.ts):**
```typescript
import { RestaurantDatabase } from '@/lib/database/supabase';

export async function getRestaurants(filters = {}) {
  return await RestaurantDatabase.getRestaurants(filters);
}

export async function getRestaurantBySlug(slug: string, citySlug?: string) {
  return await RestaurantDatabase.getRestaurantBySlug(slug, citySlug);
}
```

### Step 3: Update Astro Pages
Update your Astro pages to use async data fetching:

**Before (src/pages/losangeles/[restaurant].astro):**
```astro
---
import { restaurants } from '@/data/restaurants';

const restaurant = restaurants.find(r => r.slug === Astro.params.restaurant);
---
```

**After (src/pages/losangeles/[restaurant].astro):**
```astro
---
import { getRestaurantBySlug } from '@/data/restaurants';

const restaurant = await getRestaurantBySlug(Astro.params.restaurant, 'los-angeles');
---
```

### Step 4: Add Multi-City Support
Create dynamic city pages:

**src/pages/[city]/index.astro:**
```astro
---
import { getRestaurantsByCity } from '@/data/restaurants';
import { getCityBySlug } from '@/data/cities';

const city = await getCityBySlug(Astro.params.city);
const restaurants = await getRestaurantsByCity(Astro.params.city);
---

<BaseLayout title={`${city.name} Date Night Restaurants`}>
  <!-- City page content -->
</BaseLayout>
```

## Database Schema

### Tables Created

1. **cities** - City information
2. **neighborhoods** - Neighborhood/area information  
3. **restaurants** - Restaurant data
4. **cuisines** - Cuisine types
5. **reviews** - User reviews
6. **restaurant_cuisines** - Many-to-many relationship

### Key Features

- **UUID Primary Keys** - Better for distributed systems
- **Automatic Timestamps** - Created/updated tracking
- **Foreign Key Constraints** - Data integrity
- **Indexes** - Query performance
- **JSONB Fields** - Flexible data storage
- **Array Fields** - Efficient list storage

## Performance Optimizations

### 1. Database Indexes
```sql
-- Restaurant queries
CREATE INDEX idx_restaurants_city_id ON restaurants(city_id);
CREATE INDEX idx_restaurants_rating ON restaurants(rating);
CREATE INDEX idx_restaurants_date_night_score ON restaurants(date_night_score);

-- Search queries
CREATE INDEX idx_restaurants_name_search ON restaurants USING gin(to_tsvector('english', name));
```

### 2. Query Optimization
```typescript
// Use select to limit returned fields
const { data } = await supabase
  .from('restaurants')
  .select('id, name, slug, rating, date_night_score')
  .eq('city_id', cityId);

// Use pagination for large datasets
const { data } = await supabase
  .from('restaurants')
  .select('*')
  .range(0, 49); // First 50 records
```

### 3. Caching Strategy
```typescript
// Add Redis caching for frequently accessed data
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedRestaurants(citySlug: string) {
  const cacheKey = `restaurants:${citySlug}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const restaurants = await RestaurantDatabase.getRestaurantsByCity(citySlug);
  await redis.setex(cacheKey, 3600, JSON.stringify(restaurants)); // 1 hour cache
  
  return restaurants;
}
```

## Multi-City Expansion

### Adding New Cities

1. **Add City Data:**
```typescript
// Add to cities table
await supabase.from('cities').insert({
  name: 'New York City',
  slug: 'new-york',
  state: 'New York',
  country: 'USA',
  latitude: 40.7128,
  longitude: -74.0060
});
```

2. **Add Neighborhoods:**
```typescript
// Add neighborhoods for the city
const neighborhoods = ['Manhattan', 'Brooklyn', 'Queens'];
for (const neighborhood of neighborhoods) {
  await supabase.from('neighborhoods').insert({
    name: neighborhood,
    slug: neighborhood.toLowerCase().replace(/\s+/g, '-'),
    city_id: cityId
  });
}
```

3. **Add Restaurants:**
```typescript
// Import restaurant data (similar to LA migration)
const nyRestaurants = await import('./ny_restaurants.json');
// ... migrate restaurants
```

### Dynamic Routing
```typescript
// src/pages/[city]/[restaurant].astro
export async function getStaticPaths() {
  const cities = await CityDatabase.getCities();
  const paths = [];
  
  for (const city of cities) {
    const restaurants = await RestaurantDatabase.getRestaurantsByCity(city.slug);
    for (const restaurant of restaurants) {
      paths.push({
        params: { 
          city: city.slug, 
          restaurant: restaurant.slug 
        }
      });
    }
  }
  
  return paths;
}
```

## Admin Dashboard Setup

### 1. Create Admin Interface
```typescript
// src/pages/admin/restaurants/index.astro
---
import { RestaurantDatabase } from '@/lib/database/supabase';

const restaurants = await RestaurantDatabase.getRestaurants({ limit: 50 });
---

<div class="admin-dashboard">
  <h1>Restaurant Management</h1>
  <table>
    {restaurants.map(restaurant => (
      <tr>
        <td>{restaurant.name}</td>
        <td>{restaurant.rating}</td>
        <td>{restaurant.date_night_score}</td>
        <td>
          <a href={`/admin/restaurants/${restaurant.id}/edit`}>Edit</a>
        </td>
      </tr>
    ))}
  </table>
</div>
```

### 2. Add CRUD Operations
```typescript
// src/lib/admin/restaurant-admin.ts
export class RestaurantAdmin {
  static async createRestaurant(data: Partial<Restaurant>) {
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return restaurant;
  }
  
  static async updateRestaurant(id: string, data: Partial<Restaurant>) {
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return restaurant;
  }
  
  static async deleteRestaurant(id: string) {
    const { error } = await supabase
      .from('restaurants')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  }
}
```

## Monitoring and Analytics

### 1. Database Monitoring
```sql
-- Monitor query performance
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Monitor table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 2. Application Analytics
```typescript
// Track restaurant page views
export async function trackRestaurantView(restaurantId: string) {
  await supabase
    .from('restaurant_analytics')
    .insert({
      restaurant_id: restaurantId,
      event_type: 'page_view',
      timestamp: new Date().toISOString()
    });
}
```

## Troubleshooting

### Common Issues

1. **Connection Issues:**
   - Verify environment variables
   - Check Supabase project status
   - Ensure network connectivity

2. **Query Performance:**
   - Add appropriate indexes
   - Use select to limit fields
   - Implement pagination

3. **Data Consistency:**
   - Use transactions for related operations
   - Implement proper error handling
   - Add data validation

### Debugging Tools

```typescript
// Enable Supabase debug mode
const supabase = createClient(url, key, {
  db: { schema: 'public' },
  auth: { persistSession: false },
  global: { headers: { 'x-my-custom-header': 'my-app-name' } }
});

// Log all queries
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session);
});
```

## Next Steps

1. **Complete Migration** - Run the setup script
2. **Update Pages** - Convert to async data fetching
3. **Add Multi-City** - Expand beyond Los Angeles
4. **Build Admin** - Create content management interface
5. **Add Analytics** - Track usage and performance
6. **Optimize** - Implement caching and performance improvements

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Astro Database Integration](https://docs.astro.build/en/guides/integrations-guide/supabase/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
