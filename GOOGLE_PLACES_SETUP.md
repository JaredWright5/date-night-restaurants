# 🗺️ Google Places API Setup Guide

This guide will help you set up Google Places API to fetch real restaurant photos for your Date Night Restaurants website.

## 📋 Prerequisites

- Google Cloud account (free to create)
- Credit card (required for verification, but you won't be charged within free tier)

## 🚀 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create a new project:**
   - Click the project dropdown at the top
   - Click "New Project"
   - Name it: `date-night-restaurants`
   - Click "Create"

### Step 2: Enable Places API

1. **Navigate to APIs & Services:**
   - From the main menu, go to "APIs & Services" → "Library"

2. **Enable Places API:**
   - Search for "Places API"
   - Click on "Places API"
   - Click "Enable"

3. **Also enable (required for photos):**
   - Search for "Maps JavaScript API"
   - Click "Enable"

### Step 3: Create API Credentials

1. **Go to Credentials:**
   - Click "APIs & Services" → "Credentials"

2. **Create API Key:**
   - Click "+ Create Credentials" → "API Key"
   - Copy your API key (looks like: `AIzaSyD...`)
   - Click "Restrict Key" (recommended)

3. **Restrict API Key (Important for Security):**
   - Click on your API key name
   - Under "API restrictions":
     - Select "Restrict key"
     - Check ✅ "Places API"
     - Check ✅ "Maps JavaScript API"
   - Under "Application restrictions" (optional):
     - Select "HTTP referrers"
     - Add: `datenightrestaurants.com/*`
     - Add: `localhost:*` (for development)
   - Click "Save"

### Step 4: Set Up Billing (Required but Free Tier Available)

1. **Enable Billing:**
   - Go to "Billing" in the main menu
   - Click "Link a billing account"
   - Follow the prompts to add a credit card

2. **Free Tier Limits:**
   - **Places API (Find Place):** $0 for first 100 requests/month
   - **Places API (Details):** $0 for first 100 requests/month  
   - **Places API (Photos):** $0 for first 1,000 requests/month
   
3. **Set Budget Alerts (Recommended):**
   - Go to "Billing" → "Budgets & alerts"
   - Create alert at $10, $25, $50
   - Get email notifications if costs approach limits

### Step 5: Run the Photo Fetcher Script

1. **Set your API key:**
   ```bash
   export GOOGLE_PLACES_API_KEY="your-api-key-here"
   ```

2. **Run the script:**
   ```bash
   cd /Users/jaredwright/Documents
   node scripts/fetch-restaurant-photos.js
   ```

3. **Review the results:**
   - Check `la_date_night_restaurants_updated.json`
   - Verify photos were fetched successfully

4. **Apply the updates:**
   ```bash
   # Backup original file
   cp la_date_night_restaurants.json la_date_night_restaurants_backup.json
   
   # Replace with updated data
   mv la_date_night_restaurants_updated.json la_date_night_restaurants.json
   ```

5. **Rebuild and deploy:**
   ```bash
   npm run build
   git add la_date_night_restaurants.json
   git commit -m "Update restaurant photos with real Google Places images"
   git push origin main
   ```

## 📊 Expected API Usage

For 100 restaurants:
- **Search requests:** ~100 calls
- **Details requests:** ~100 calls  
- **Photo references:** ~500 photos (5 per restaurant)

**Total API calls:** ~200 (well within free tier)

**Monthly cost:** $0 (within free limits)

## 🔒 Security Best Practices

1. **Never commit API keys to Git:**
   ```bash
   # Add to .gitignore
   echo ".env" >> .gitignore
   echo "*.key" >> .gitignore
   ```

2. **Use environment variables:**
   ```bash
   # Create .env file
   echo "GOOGLE_PLACES_API_KEY=your-key-here" > .env
   ```

3. **Restrict your API key:**
   - Only enable required APIs
   - Add HTTP referrer restrictions
   - Monitor usage regularly

## 🎯 What You'll Get

After running the script, each restaurant will have:
- ✅ **5 real photos** from Google Places
- ✅ **High-quality images** (800px wide)
- ✅ **Verified restaurant photos** (from Google's database)
- ✅ **Google Place ID** (for future updates)

## 🔄 Updating Photos Later

To refresh photos or add new restaurants:

1. Update the JSON file with new restaurants
2. Run the script again
3. It will only update restaurants without photos

## 💡 Alternative: Incremental Updates

If you want to test with just a few restaurants first:

```javascript
// Edit fetch-restaurant-photos.js
// Change this line:
const restaurantsData = JSON.parse(fs.readFileSync(RESTAURANT_DATA_PATH, 'utf-8'));

// To this (only process first 10):
const restaurantsData = JSON.parse(fs.readFileSync(RESTAURANT_DATA_PATH, 'utf-8')).slice(0, 10);
```

## 📞 Support

If you encounter errors:
1. Check API key is correct
2. Verify Places API is enabled
3. Check billing is set up (even for free tier)
4. Review quota limits in Google Cloud Console

## 🎉 Ready to Go!

Once you have your API key, run:
```bash
export GOOGLE_PLACES_API_KEY="your-key-here"
node scripts/fetch-restaurant-photos.js
```

The script will fetch real photos and update your restaurant data automatically!

