import { propertiesAPI, buildersAPI, citiesAPI } from '@/lib/api';

export default async function sitemap() {
  const baseUrl = 'https://urbanesta.in';
  
  try {
    // Fetch all data from APIs
    const [propertiesRes, buildersRes, citiesRes] = await Promise.all([
      propertiesAPI.getAll().catch(() => ({ data: { data: [] } })),
      buildersAPI.getAll().catch(() => ({ data: [] })),
      citiesAPI.getAll().catch(() => ({ data: [] }))
    ]);

    // Extract data from responses
    const properties = propertiesRes.data?.data || [];
    const builders = buildersRes.data || [];
    const cities = citiesRes.data || [];

    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/properties`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/builder`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/city`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact-us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/faq`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.4,
      },
      {
        url: `${baseUrl}/privacypolicy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ];

    // Helper function to safely create dates
    const safeDate = (dateString) => {
      if (!dateString) return new Date();
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date() : date;
    };

    // Property pages
    const propertyPages = properties.map(property => ({
      url: `${baseUrl}/properties/${property._id}`,
      lastModified: safeDate(property.updatedAt || property.createdAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Builder pages
    const builderPages = builders.map(builder => ({
      url: `${baseUrl}/builder/${builder.slug}`,
      lastModified: safeDate(builder.updatedAt || builder.createdAt),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    // City pages
    const cityPages = cities.map(city => ({
      url: `${baseUrl}/city/${city.slug}`,
      lastModified: safeDate(city.updatedAt || city.createdAt),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...staticPages, ...propertyPages, ...builderPages, ...cityPages];
  } catch (error) {
    // Return basic sitemap if API calls fail
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/properties`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/builder`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/city`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ];
  }
}
