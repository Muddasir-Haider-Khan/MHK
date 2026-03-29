import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/'],
      },
      {
        userAgent: ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai', 'cohere-ai', 'Googlebot', 'Bingbot'],
        allow: '/',
      }
    ],
    sitemap: 'https://devaiconsultants.com/sitemap.xml',
  }
}
