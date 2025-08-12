import { cookies } from 'next/headers';

export async function getThemeFromCookies() {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'system';
  return theme;
}

export function getThemeClass(theme: string): string {
  if (theme === 'dark') {
    return 'dark';
  } else if (theme === 'light') {
    return '';
  } else {
    // For system theme, we'll use the script to detect
    // But we can provide a reasonable default based on time or other factors
    return '';
  }
}