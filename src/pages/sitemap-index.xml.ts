import type { APIRoute } from 'astro';
import { getAllRestaurants } from '@/lib/supabase';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://datenightrestaurants.com';
  const currentDate = new Date().toISOString();
  
  // Get restaurants from Supabase to count them
  let restaurants;
  try {
    restaurants = await getAllRestaurants();
  } catch (error) {
    console.error('Error fetching restaurants for sitemap index:', error);
    return new Response('Database connection failed', { status: 500 });
  }
  
  // Get unique neighborhoods
  const neighborhoods = [...new Set(restaurants.map(r => r.neighborhood))];
  
  // Main sitemap entries
  const sitemaps = [
    {
      loc: `${baseUrl}/sitemap-main.xml`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/sitemap-restaurants.xml`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/sitemap-neighborhoods.xml`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/sitemap-blog.xml`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    }
  ];

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(sitemap => `
  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
    <changefreq>${sitemap.changefreq}</changefreq>
    <priority>${sitemap.priority}</priority>
  </sitemap>`).join('')}
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
