import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://datenightrestaurants.com',
  output: 'static',
  build: {
    assets: '_astro'
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('404'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [
        'https://datenightrestaurants.com/',
        'https://datenightrestaurants.com/cities/',
        'https://datenightrestaurants.com/cuisines/',
      ]
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  vite: {
    define: {
      'process.env': process.env
    }
  }
});
