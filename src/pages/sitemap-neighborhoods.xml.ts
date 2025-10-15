import type { APIRoute } from 'astro';
import { restaurants } from '@/data/restaurants';

export const GET: APIRoute = async () => {
  const site = 'https://datenightrestaurants.com';
  const uniqueNeighborhoods = Array.from(new Set(restaurants.map(r => r.neighborhood)));
  const toSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const lastmod = new Date().toISOString();

  const urls = [
    `${site}/neighborhoods/`,
    ...uniqueNeighborhoods.map((name) => `${site}/neighborhoods/${toSlug(name)}/`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
