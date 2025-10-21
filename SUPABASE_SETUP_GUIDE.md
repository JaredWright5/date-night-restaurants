# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details:
   - **Name**: `date-night-restaurants`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users (US West for LA)
4. Click "Create new project"
5. Wait 2-3 minutes for the project to initialize

## Step 2: Get Your API Keys

1. Go to **Settings → API** in your Supabase dashboard
2. Copy these values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)
3. Save them somewhere safe

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Supabase Configuration
SUPABASE_URL=your-project-url-here
SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For admin operations (get this from Settings → API → service_role key)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 4: Install Dependencies

```bash
npm install @supabase/supabase-js
```

## Step 5: Run Database Setup

```bash
npm run setup-database
```

This will:
- Create all database tables
- Set up indexes and relationships
- Migrate your existing LA restaurant data
- Set up triggers for automatic timestamps

## Step 6: Test Everything

```bash
# Build and test
npm run build
npm run preview

# Check admin dashboard at /admin
```

## Troubleshooting

### If you get connection errors:
1. Double-check your environment variables
2. Make sure your Supabase project is fully initialized
3. Verify the API keys are correct

### If the migration fails:
1. Check the Supabase logs in your dashboard
2. Make sure you have the service role key for admin operations
3. Try running the script again

### If pages don't load:
1. Check that all environment variables are set
2. Verify the database tables were created
3. Check the browser console for errors

## Next Steps

Once everything is working:
1. Visit `/admin` to see your admin dashboard
2. Test adding/editing restaurants
3. Verify all existing pages still work
4. Plan your next city expansion!

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Check the console logs for detailed error messages
