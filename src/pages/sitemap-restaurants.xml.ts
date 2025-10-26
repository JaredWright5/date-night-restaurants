import type { APIRoute } from 'astro';
import { restaurants } from '@/data/restaurants';

export const GET: APIRoute = () => {
  const baseUrl = 'https://datenightrestaurants.com';
  const currentDate = new Date().toISOString();
  
  // Restaurant pages
  const restaurantPages = restaurants.map(restaurant => ({
    loc: `${baseUrl}/losangeles/${restaurant.slug}/`,
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.8'
  }));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${restaurantPages.map(page => `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
