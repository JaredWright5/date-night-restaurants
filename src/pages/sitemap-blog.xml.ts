import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const baseUrl = 'https://datenightrestaurants.com';
  const currentDate = new Date().toISOString();
  
  // Blog pages
  const blogPages = [
    {
      loc: `${baseUrl}/blog/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/blog/best-date-night-restaurants-beverly-hills/`,
      lastmod: '2025-01-15T00:00:00.000Z',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/blog/romantic-restaurants-santa-monica-ocean-view/`,
      lastmod: '2025-01-08T00:00:00.000Z',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/blog/valentines-day-restaurants-los-angeles-2024/`,
      lastmod: '2025-01-01T00:00:00.000Z',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/blog/best-french-restaurants-los-angeles-date-night/`,
      lastmod: '2024-12-25T00:00:00.000Z',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/blog/best-date-night-restaurants-west-hollywood/`,
      lastmod: '2024-12-18T00:00:00.000Z',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/blog/downtown-la-date-night-urban-romance/`,
      lastmod: '2024-12-11T00:00:00.000Z',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/blog/summer-date-night-ideas-los-angeles/`,
      lastmod: '2024-12-04T00:00:00.000Z',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/blog/budget-friendly-date-night-restaurants-los-angeles/`,
      lastmod: '2024-11-27T00:00:00.000Z',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/blog/best-rooftop-restaurants-los-angeles-2024/`,
      lastmod: '2025-10-22T00:00:00.000Z',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/blog/first-date-restaurants-los-angeles/`,
      lastmod: '2025-10-15T00:00:00.000Z',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/blog/anniversary-restaurants-los-angeles/`,
      lastmod: '2025-10-08T00:00:00.000Z',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/blog/outdoor-dining-los-angeles/`,
      lastmod: '2025-10-01T00:00:00.000Z',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/blog/wine-bars-los-angeles-date-night/`,
      lastmod: '2025-09-24T00:00:00.000Z',
      changefreq: 'monthly',
      priority: '0.7'
    }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${blogPages.map(page => `
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
