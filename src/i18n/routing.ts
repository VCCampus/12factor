import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/principles': {
      en: '/principles',
      zh: '/principles'
    },
    '/flashcards': {
      en: '/flashcards',
      zh: '/flashcards'
    },
    '/quiz': {
      en: '/quiz',
      zh: '/quiz'
    }
  }
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);