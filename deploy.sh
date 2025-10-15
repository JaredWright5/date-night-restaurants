#!/bin/bash

# Date Night Restaurants - Deployment Script
echo "🚀 Date Night Restaurants - Deployment Helper"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 Your site is ready to deploy!"
    echo ""
    echo "📁 Build output is in the 'dist' folder"
    echo ""
    echo "🚀 Deployment Options:"
    echo "1. Netlify (Recommended):"
    echo "   - Go to netlify.com"
    echo "   - Drag & drop the 'dist' folder"
    echo "   - Connect your domain: datenightrestaurants.com"
    echo ""
    echo "2. Vercel:"
    echo "   - Install: npm i -g vercel"
    echo "   - Run: vercel"
    echo "   - Connect your domain in Vercel dashboard"
    echo ""
    echo "3. GitHub Pages:"
    echo "   - Push to GitHub"
    echo "   - Enable GitHub Pages in repository settings"
    echo ""
    echo "📋 Next Steps:"
    echo "- Update DNS records at your domain registrar"
    echo "- Test your live site"
    echo "- Set up analytics and monitoring"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
