import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if this is the root path without any locale
  if (pathname === '/') {
    // Try to get the user's preferred language from cookie (set by client-side)
    const preferredLocale = request.cookies.get('preferred-locale')?.value;
    
    if (preferredLocale && (preferredLocale === 'en' || preferredLocale === 'zh')) {
      // Redirect to the user's preferred locale
      const url = request.nextUrl.clone();
      url.pathname = `/${preferredLocale}`;
      return NextResponse.redirect(url);
    }
    
    // Otherwise, detect from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';
    
    // Check if the browser prefers Chinese
    // Common Chinese language codes: zh, zh-CN, zh-TW, zh-HK, etc.
    const isChinese = /\bzh\b/i.test(acceptLanguage);
    
    const detectedLocale = isChinese ? 'zh' : 'en';
    
    // Redirect to the detected locale
    const url = request.nextUrl.clone();
    url.pathname = `/${detectedLocale}`;
    return NextResponse.redirect(url);
  }
  
  // For all other paths, use the default next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};