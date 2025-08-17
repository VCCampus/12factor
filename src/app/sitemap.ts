import { MetadataRoute } from 'next';
import { getCourseIds } from '@/data/courses';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://12factor.me';
  const currentDate = new Date();
  
  // Get dynamic course IDs
  const courseIds = getCourseIds();
  
  const pages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/principles', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/flashcards', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/quiz', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/prompt-engineering', priority: 0.9, changeFrequency: 'weekly' as const },
    // Dynamic course pages
    ...courseIds.map(courseId => ({
      path: `/prompt-engineering/${courseId}`,
      priority: 0.8,
      changeFrequency: 'weekly' as const
    }))
  ];
  
  const urls: MetadataRoute.Sitemap = [];
  
  pages.forEach(({ path, priority, changeFrequency }) => {
    if (path === '') {
      // Home page (redirects to /en)
      urls.push({
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency,
        priority,
        alternates: {
          languages: {
            en: `${baseUrl}/en`,
            zh: `${baseUrl}/zh`,
          },
        },
      });
    } else {
      // English pages
      urls.push({
        url: `${baseUrl}/en${path}`,
        lastModified: currentDate,
        changeFrequency,
        priority,
        alternates: {
          languages: {
            en: `${baseUrl}/en${path}`,
            zh: `${baseUrl}/zh${path}`,
          },
        },
      });
    }
    
    // Chinese pages (always with /zh prefix)
    urls.push({
      url: `${baseUrl}/zh${path}`,
      lastModified: currentDate,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: path === '' ? `${baseUrl}/en` : `${baseUrl}/en${path}`,
          zh: `${baseUrl}/zh${path}`,
        },
      },
    });
  });
  
  return urls;
}