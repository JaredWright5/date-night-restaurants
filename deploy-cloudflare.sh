#!/bin/bash

# Date Night Restaurants - Cloudflare Deployment Script
echo "🚀 Date Night Restaurants - Cloudflare Deployment Helper"
echo "========================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build the project
echo "📦 Building the project for Cloudflare..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Cloudflare Deployment Options:"
    echo ""
    echo "1. 🎯 Cloudflare Pages (Recommended - Easiest):"
    echo "   - Go to dash.cloudflare.com"
    echo "   - Click 'Pages' → 'Create a project'"
    echo "   - Connect your GitHub repository"
    echo "   - Build settings:"
    echo "     • Framework: Astro"
    echo "     • Build command: npm run build"
    echo "     • Build output: dist"
    echo "   - Add custom domain: datenightrestaurants.com"
    echo ""
    echo "2. ⚡ Cloudflare Workers (Advanced):"
    echo "   - Install: npm i -g wrangler"
    echo "   - Run: wrangler login"
    echo "   - Deploy: wrangler pages deploy dist"
    echo ""
    echo "3. 🗄️  Cloudflare R2 (Most Flexible):"
    echo "   - Create R2 bucket in Cloudflare dashboard"
    echo "   - Upload dist folder to R2"
    echo "   - Set up Workers to serve files"
    echo ""
    echo "📋 DNS Configuration:"
    echo "- Change nameservers at your domain registrar to Cloudflare's"
    echo "- Or add A record: @ → 104.21.0.0"
    echo "- Add CNAME: www → your-site.pages.dev"
    echo ""
    echo "🔧 Post-Deployment:"
    echo "- Enable SSL/TLS (Full strict mode)"
    echo "- Set up caching rules"
    echo "- Configure security settings"
    echo "- Add analytics and monitoring"
    echo ""
    echo "📖 For detailed instructions, see CLOUDFLARE_DEPLOYMENT.md"
    echo ""
    echo "🎉 Your site is ready for Cloudflare!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
