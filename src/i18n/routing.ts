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
    },
    '/prompt-engineering': {
      en: '/prompt-engineering',
      zh: '/prompt-engineering'
    },
    '/prompt-engineering/[course]': {
      en: '/prompt-engineering/[course]',
      zh: '/prompt-engineering/[course]'
    }
  }
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);