#!/bin/bash
# Build script for Cloudflare Pages
echo "Starting build process..."

# Install dependencies
npm ci

# Build the Astro site
npm run build

echo "Build completed successfully!"
