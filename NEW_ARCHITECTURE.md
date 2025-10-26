# New Architecture - Supabase-First Restaurant Directory

## Overview

This is a completely rebuilt restaurant directory with a focus on:
- **Supabase-first data architecture**
- **SEO-friendly URLs that actually work**
- **Proper query parameter handling**
- **Scalable, maintainable code**

## URL Structure

### New Clean URLs
- **Homepage**: `/`
- **All Restaurants**: `/restaurants/`
- **Neighborhood Restaurants**: `/restaurants/[neighborhood]/`
- **Individual Restaurant**: `/restaurants/[neighborhood]/[restaurant]/`

### Query Parameter Support
- **Search**: `/restaurants/?search=pizza`
- **Cuisine Filter**: `/restaurants/?cuisine=italian`
- **Price Filter**: `/restaurants/?price=3`
- **Date Score Filter**: `/restaurants/?dateScore=90`

### Automatic Redirects
- Old URLs automatically redirect to new structure
- `/losangeles/restaurants/` → `/restaurants/`
- `/losangeles/restaurants/venice/` → `/restaurants/venice/`
- `/losangeles/restaurants/venice/felix-trattoria/` → `/restaurants/venice/felix-trattoria/`

## Key Features

### 1. Supabase-First Data Layer
- All data comes from Supabase database
- Proper TypeScript interfaces
- Robust error handling
- Fallback mechanisms

### 2. Working Query Parameters
- Server-side redirects for neighborhood filters
- Client-side filtering for other parameters
- Proper URL parsing and handling

### 3. SEO Optimization
- Clean, semantic URLs
- Proper canonical URLs
- Structured data (JSON-LD)
- Meta tags and descriptions
- Breadcrumb navigation

### 4. Performance
- Static site generation where possible
- Optimized images
- Efficient data fetching
- Minimal JavaScript

## File Structure

```
src/
├── lib/
│   └── supabase.ts              # Supabase client and data functions
├── pages/
│   ├── index.astro              # Homepage
│   ├── restaurants/
│   │   ├── index.astro          # All restaurants listing
│   │   └── [neighborhood]/
│   │       ├── index.astro      # Neighborhood restaurants
│   │       └── [restaurant].astro # Individual restaurant
│   └── losangeles/              # Redirect pages for old URLs
│       └── restaurants/
│           ├── index.astro
│           └── [neighborhood]/
│               ├── index.astro
│               └── [restaurant].astro
├── components/
│   └── RestaurantCard.astro     # Restaurant card component
└── layouts/
    └── BaseLayout.astro         # Base layout with SEO
```

## Environment Variables

Create a `.env.local` file with:

```env
PUBLIC_SUPABASE_URL=your_supabase_url_here
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Database Schema

The Supabase database should have these tables:

### restaurants
- id (uuid, primary key)
- name (text)
- slug (text, unique)
- address (text)
- neighborhood (text)
- neighborhood_slug (text)
- city (text)
- city_slug (text)
- cuisine_types (text[])
- price_level (integer, 1-4)
- rating (numeric)
- date_night_score (integer)
- photos (text[])
- description (text)
- phone (text)
- website (text)
- is_active (boolean)
- created_at (timestamp)
- updated_at (timestamp)

### neighborhoods
- id (uuid, primary key)
- name (text)
- slug (text, unique)
- city (text)
- city_slug (text)
- description (text)
- is_active (boolean)

### cities
- id (uuid, primary key)
- name (text)
- slug (text, unique)
- description (text)
- is_active (boolean)

## Key Improvements

1. **Query Parameters Actually Work**
   - Neighborhood filters redirect to clean URLs
   - Other filters work with client-side JavaScript
   - No more "117 restaurants" issue

2. **Supabase Integration**
   - Real-time data from database
   - Proper error handling
   - Scalable data architecture

3. **SEO-Friendly URLs**
   - Clean, semantic structure
   - Proper redirects from old URLs
   - Canonical URLs and meta tags

4. **Maintainable Code**
   - TypeScript interfaces
   - Proper separation of concerns
   - Reusable components

## Testing

To test the new architecture:

1. **Homepage**: Visit `/` - should show featured restaurants
2. **All Restaurants**: Visit `/restaurants/` - should show all restaurants with filters
3. **Neighborhood**: Visit `/restaurants/venice/` - should show only Venice restaurants
4. **Individual Restaurant**: Visit `/restaurants/venice/felix-trattoria/` - should show restaurant details
5. **Query Parameters**: Visit `/restaurants/?neighborhood=Venice` - should redirect to `/restaurants/venice/`
6. **Search**: Visit `/restaurants/?search=pizza` - should filter restaurants

## Migration Notes

- Old URLs automatically redirect to new structure
- No data loss during migration
- All existing functionality preserved
- Improved performance and SEO
