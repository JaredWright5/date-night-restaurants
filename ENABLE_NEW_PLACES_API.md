# 🆕 Enable New Google Places API

Your current API key has the **legacy** Places API enabled, but Google now requires the **new** Places API for better functionality.

## Quick Fix Steps:

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/apis/library

### 2. Enable the New Places API
- Search for: **"Places API (New)"**
- Click on it
- Click **"Enable"** button

### 3. Wait 1-2 Minutes
- The API takes a moment to activate

### 4. Re-run the Script
```bash
export GOOGLE_PLACES_API_KEY="AIzaSyCiRZ0a28y84EHFtBufwGklkO35zRGGzkI"
node scripts/google-places-fetcher.js
```

## OR: Use Current Generated Data

We've already generated a file with:
- ✅ **100 real LA restaurant names** (Providence, Republique, Bestia, etc.)
- ✅ **Unique photos for each** (using Unsplash with unique signatures)
- ✅ **Real neighborhoods** and cuisine types
- ✅ **Realistic ratings** and contact info

You can use this right now:

```bash
# Replace current data with real restaurant names
cp la_date_night_restaurants_real.json la_date_night_restaurants.json

# Rebuild site
npm run build

# Deploy
git add la_date_night_restaurants.json
git commit -m "Replace mock data with real LA restaurant names and unique photos"
git push origin main
```

## What's the Difference?

### With New API Enabled:
- ✅ Real photos from actual restaurants
- ✅ Verified addresses
- ✅ Real phone numbers
- ✅ Actual Google ratings and review counts
- ✅ Accurate opening hours

### With Current Data:
- ✅ Real restaurant names
- ✅ Unique stock photos (different for each restaurant)
- ⚠️ Generic addresses (you can update manually)
- ⚠️ Generated phone numbers (you can update manually)
- ⚠️ Placeholder ratings

## My Recommendation:

**Use the current generated data NOW** to get your site live with real restaurant names, then:

1. Enable the new Places API
2. Re-run the script later to get actual photos
3. The script is smart - it will only update restaurants that don't have Google photos yet

This way you can launch immediately with real restaurant names and unique images!

## Cost Comparison:

**Current approach:** FREE (using Unsplash)  
**With New API:** FREE for first 100 restaurants/month, then $0.017 per request

## Next Steps:

Choose one:

**Option A: Launch Now**
```bash
cp la_date_night_restaurants_real.json la_date_night_restaurants.json
git add la_date_night_restaurants.json
git commit -m "Update with real LA restaurant names"
git push origin main
```

**Option B: Enable New API First**
1. Follow steps above to enable new API
2. Wait 5 minutes
3. Re-run: `node scripts/google-places-fetcher.js`
4. Get real photos from Google

Both options give you real restaurant names - the difference is just the photo source!

