import { MetadataRoute } from 'next';
import { services, locations, roles } from '@/lib/seo-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mhk-delta.vercel.app';
  
  // Standard routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ];

  // Service x Location permutations
  services.forEach(service => {
    locations.forEach(location => {
      routes.push({
        url: `${baseUrl}/services/${service.slug}/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      });
    });
  });

  // Hire x Location permutations
  roles.forEach(role => {
    locations.forEach(location => {
      routes.push({
        url: `${baseUrl}/hire/${role.slug}/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      });
    });
  });

  return routes;
}
