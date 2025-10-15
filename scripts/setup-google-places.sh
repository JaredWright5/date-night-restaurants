#!/bin/bash

# Google Places API Setup Script
# This script helps you set up and test your Google Places API key

echo "🗺️  Google Places API Setup for Date Night Restaurants"
echo "========================================================"
echo ""

# Check if API key is set
if [ -z "$GOOGLE_PLACES_API_KEY" ]; then
    echo "❌ GOOGLE_PLACES_API_KEY is not set"
    echo ""
    echo "📝 Setup Instructions:"
    echo "1. Create a Google Cloud project at: https://console.cloud.google.com/"
    echo "2. Enable Places API"
    echo "3. Create an API key"
    echo "4. Run: export GOOGLE_PLACES_API_KEY='your-api-key-here'"
    echo ""
    echo "📖 Full guide: See GOOGLE_PLACES_SETUP.md"
    echo ""
    exit 1
fi

echo "✅ API Key detected: ${GOOGLE_PLACES_API_KEY:0:10}..."
echo ""

# Test API key with a simple request
echo "🧪 Testing API key..."
TEST_URL="https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Providence%20Los%20Angeles&inputtype=textquery&fields=place_id,name&key=$GOOGLE_PLACES_API_KEY"

RESPONSE=$(curl -s "$TEST_URL")
STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

if [ "$STATUS" = "OK" ]; then
    echo "✅ API key is working!"
    echo ""
    echo "🎯 Ready to fetch restaurant photos!"
    echo ""
    echo "Run the following command to start:"
    echo "   npm run fetch-photos"
    echo ""
    echo "Or manually:"
    echo "   node scripts/fetch-restaurant-photos.js"
    echo ""
elif [ "$STATUS" = "REQUEST_DENIED" ]; then
    echo "❌ API key is invalid or Places API is not enabled"
    echo ""
    echo "📝 Checklist:"
    echo "□ API key is correct"
    echo "□ Places API is enabled in Google Cloud Console"
    echo "□ Billing is set up (required even for free tier)"
    echo "□ API key restrictions are properly configured"
    echo ""
else
    echo "⚠️  Unexpected response: $STATUS"
    echo ""
    echo "Response: $RESPONSE"
    echo ""
fi

