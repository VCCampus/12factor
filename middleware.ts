import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware({
  ...routing,
  // next-intl 会自动：
  // 1. 检测用户的语言偏好（从 URL、cookie、Accept-Language header）
  // 2. 当用户手动切换语言时，设置 NEXT_LOCALE cookie
  // 3. 后续访问时优先使用 cookie 中的语言设置
  localeDetection: true // 默认为 true，启用自动语言检测
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all pathnames within `/users`, including ones with a dot
    '/([\\w-]+)?/users/(.+)'
  ]
};