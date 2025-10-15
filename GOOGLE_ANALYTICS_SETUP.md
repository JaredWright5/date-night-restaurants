# 📊 Google Analytics Setup Guide

## Step 1: Create Google Analytics Account

1. **Go to [Google Analytics](https://analytics.google.com/)**
2. **Click "Start measuring"**
3. **Create a new property:**
   - Property name: `Date Night Restaurants`
   - Reporting time zone: `Los Angeles`
   - Currency: `USD`

## Step 2: Get Your Measurement ID

1. **In your GA4 property, go to "Admin" (gear icon)**
2. **Click "Data Streams"**
3. **Click "Add stream" → "Web"**
4. **Enter your website URL:** `https://datenightrestaurants.com`
5. **Copy your Measurement ID** (looks like `G-XXXXXXXXXX`)

## Step 3: Add to Your Site

### Option A: Environment Variable (Recommended)
1. **Create a `.env` file in your project root:**
   ```
   PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
2. **Replace `G-XXXXXXXXXX` with your actual Measurement ID**

### Option B: Direct Edit
1. **Edit `src/components/GoogleAnalytics.astro`**
2. **Replace `G-XXXXXXXXXX` with your actual Measurement ID**

## Step 4: Deploy and Test

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Add Google Analytics tracking"
   git push origin main
   ```

2. **Wait for Cloudflare Pages to deploy**

3. **Test your analytics:**
   - Visit your website
   - Check Google Analytics "Realtime" reports
   - You should see your visit within a few minutes

## Step 5: Verify Tracking

1. **Go to Google Analytics → Realtime → Overview**
2. **Visit your website**
3. **You should see "1 user currently" in the last 30 minutes**

## 🎯 What You'll Track

- **Page views** for all restaurant pages
- **User engagement** and session duration
- **Traffic sources** (Google, social media, direct)
- **Popular restaurants** and neighborhoods
- **Mobile vs desktop** usage
- **Geographic data** of your visitors

## 📈 Advanced Tracking (Optional)

You can add custom events for:
- Restaurant page views
- Contact form submissions
- External link clicks
- Search queries

## 🔒 Privacy Compliance

Your site already includes:
- ✅ GDPR-compliant analytics setup
- ✅ No personal data collection
- ✅ Anonymous user tracking only

## 🚀 Next Steps

Once analytics is working:
1. **Set up goals** for contact form submissions
2. **Create custom reports** for restaurant performance
3. **Set up email alerts** for traffic spikes
4. **Connect to Google Search Console** for SEO data

---

**Need help?** Check the Google Analytics documentation or contact support.
