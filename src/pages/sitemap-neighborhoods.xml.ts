import type { APIRoute } from 'astro';
import { restaurants } from '@/data/restaurants';

export const GET: APIRoute = () => {
  const baseUrl = 'https://datenightrestaurants.com';
  const currentDate = new Date().toISOString();
  
  // Get unique neighborhoods
  const neighborhoods = [...new Set(restaurants.map(r => r.neighborhood))];
  
  // Neighborhood pages
  const neighborhoodPages = neighborhoods.map(neighborhood => ({
    loc: `${baseUrl}/neighborhoods/${neighborhood.toLowerCase().replace(/\s+/g, '-')}/restaurants/`,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: '0.7'
  }));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${neighborhoodPages.map(page => `
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