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
      filter: (page) => !page.includes('404') && !page.includes('test'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [
        'https://datenightrestaurants.com/',
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
