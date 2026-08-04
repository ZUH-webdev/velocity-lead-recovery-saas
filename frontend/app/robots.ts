import type { MetadataRoute } from 'next';

const BASE_URL = 'https://velocity-ai.site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/sign-in',
        '/sign-up',
        '/onboarding',
        '/auth',
        '/forgot-password',
        '/reset-password',
        '/verify',
        '/api',
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
