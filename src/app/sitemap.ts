import { MetadataRoute } from 'next';
// import { principles } from '@/data/principles'; // Will be used when individual principle pages are implemented

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://12factor.me';
  const currentDate = new Date();
  
  // Base pages for each locale
  const basePages = ['', '/principles', '/flashcards', '/quiz'];
  
  // Generate URLs for all locales and pages
  const urls: MetadataRoute.Sitemap = [];
  
  // Add home page for default locale (en)
  urls.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: {
      languages: {
        en: baseUrl,
        zh: `${baseUrl}/zh`,
      },
    },
  });
  
  // Add other pages for all locales
  basePages.slice(1).forEach(page => {
    // English version
    urls.push({
      url: `${baseUrl}${page}`,
      lastModified: currentDate,
      changeFrequency: page === '/principles' ? 'weekly' : 'monthly',
      priority: page === '/principles' ? 0.9 : 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}${page}`,
          zh: `${baseUrl}/zh${page}`,
        },
      },
    });
  });
  
  // Individual principle pages - commented out until implemented
  // principles.forEach((principle) => {
  //   const principleSlug = principle.title.en.toLowerCase().replace(/\s+/g, '-');
  //   urls.push({
  //     url: `${baseUrl}/principles/${principleSlug}`,
  //     lastModified: currentDate,
  //     changeFrequency: 'monthly',
  //     priority: 0.7,
  //     alternates: {
  //       languages: {
  //         en: `${baseUrl}/principles/${principleSlug}`,
  //         zh: `${baseUrl}/zh/principles/${principleSlug}`,
  //       },
  //     },
  //   });
  // });
  
  return urls;
}