# Supabase Setup Guide

This guide will help you set up Supabase as your primary data source for the restaurant directory.

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a region close to your users
4. Set a strong database password
5. Wait for the project to be created (2-3 minutes)

### 2. Get Your Credentials

1. Go to your project dashboard
2. Navigate to **Settings** → **API**
3. Copy your **Project URL** and **anon public** key
4. Create a `.env.local` file in your project root:

```env
PUBLIC_SUPABASE_URL=your_project_url_here
PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the following SQL commands:

```sql
-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  restaurant_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  description TEXT,
  restaurant_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  neighborhood_slug TEXT NOT NULL,
  city TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  cuisine_types TEXT[] NOT NULL DEFAULT '{}',
  price_level INTEGER NOT NULL CHECK (price_level >= 1 AND price_level <= 4),
  rating DECIMAL(3,2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  date_night_score INTEGER NOT NULL CHECK (date_night_score >= 0 AND date_night_score <= 100),
  photos TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  phone TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_restaurants_neighborhood_slug ON restaurants(neighborhood_slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_city_slug ON restaurants(city_slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_is_active ON restaurants(is_active);
CREATE INDEX IF NOT EXISTS idx_restaurants_date_night_score ON restaurants(date_night_score DESC);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_slug ON neighborhoods(slug);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_city_slug ON neighborhoods(city_slug);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to neighborhoods" ON neighborhoods FOR SELECT USING (true);
CREATE POLICY "Allow public read access to restaurants" ON restaurants FOR SELECT USING (true);

-- Insert default city (Los Angeles)
INSERT INTO cities (name, slug, description, restaurant_count) 
VALUES ('Los Angeles', 'los-angeles', 'The City of Angels', 0)
ON CONFLICT (slug) DO NOTHING;
```

### 4. Import Your Restaurant Data

Run the setup script to create the import script:

```bash
node scripts/setup-supabase-database.js
```

This will create `scripts/import-restaurants.js`. Then run:

```bash
node scripts/import-restaurants.js
```

### 5. Test Your Connection

```bash
node scripts/test-supabase-connection.js
```

### 6. Start Your Application

```bash
npm run dev
```

## 🔧 Configuration Details

### Environment Variables

Your `.env.local` file should contain:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Google Analytics
PUBLIC_GA_MEASUREMENT_ID=your-ga-id-here
```

### Database Schema

The database has three main tables:

1. **cities** - Stores city information
2. **neighborhoods** - Stores neighborhood information with city relationships
3. **restaurants** - Stores restaurant information with neighborhood relationships

### Security

- Row Level Security (RLS) is enabled
- Public read access is allowed for all tables
- No write access for anonymous users (secure)

## 🚨 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check your `.env.local` file exists
   - Verify the variable names are correct
   - Restart your development server

2. **"Database connection failed"**
   - Verify your Supabase URL and key are correct
   - Check that your Supabase project is active
   - Ensure the database schema is set up correctly

3. **"No restaurants found"**
   - Run the import script: `node scripts/import-restaurants.js`
   - Check that your JSON data file exists
   - Verify the data format matches the expected schema

4. **"Table doesn't exist"**
   - Run the database schema SQL commands
   - Check that all tables were created successfully
   - Verify table names match exactly

### Testing Steps

1. **Test Connection**: `node scripts/test-supabase-connection.js`
2. **Test Import**: `node scripts/import-restaurants.js`
3. **Test Application**: `npm run dev`
4. **Test URLs**:
   - `http://localhost:4321/` (homepage)
   - `http://localhost:4321/restaurants/` (all restaurants)
   - `http://localhost:4321/restaurants/venice/` (neighborhood)
   - `http://localhost:4321/restaurants/?neighborhood=Venice` (query parameter)

## 📊 Data Management

### Adding New Restaurants

You can add restaurants through:

1. **Supabase Dashboard**: Go to Table Editor → restaurants
2. **SQL Commands**: Use INSERT statements
3. **API**: Use the Supabase client in your code

### Updating Data

- Use the Supabase dashboard for quick edits
- Use SQL commands for bulk updates
- The application will automatically reflect changes

### Backup

- Supabase automatically backs up your database
- You can export data through the dashboard
- Consider setting up additional backup strategies for production

## 🚀 Production Deployment

### Environment Variables

Set these in your production environment:

```env
PUBLIC_SUPABASE_URL=your_production_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

### Performance

- The database is optimized with proper indexes
- Queries are efficient and fast
- Consider upgrading your Supabase plan for production

### Monitoring

- Monitor your Supabase usage in the dashboard
- Set up alerts for high usage
- Monitor query performance

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Database Schema Reference](NEW_ARCHITECTURE.md)
- [API Documentation](https://supabase.com/docs/guides/api)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema created
- [ ] Restaurant data imported
- [ ] Connection test passed
- [ ] Application running locally
- [ ] All URLs working correctly
- [ ] Query parameters working
- [ ] Production deployment ready