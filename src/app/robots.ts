import type { MetadataRoute } from 'next';

const SITE_URL = 'https://rrhandyman.downriver.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all major crawlers to index the public site.
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      // Explicitly allow social crawlers to fetch OG images.
      {
        userAgent: ['Googlebot', 'Bingbot', 'Twitterbot', 'facebookexternalhit'],
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
